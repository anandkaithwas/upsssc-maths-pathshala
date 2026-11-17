const MAX_IMAGE_CHARS = 11_500_000;
const JSON_HEADERS = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };

function reply(status, body) {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

function extractOutputText(data) {
  for (const item of data.output || []) {
    for (const part of item.content || []) {
      if (part.type === "output_text" && part.text) return part.text;
    }
  }
  return "";
}

function parseAnswer(text) {
  const cleaned = text.trim().replace(/^\x60{3}(?:json)?\s*/i, "").replace(/\s*\x60{3}$/i, "");
  const parsed = JSON.parse(cleaned);
  return {
    recognisedQuestion: String(parsed.recognisedQuestion || ""),
    steps: Array.isArray(parsed.steps) ? parsed.steps.map(String).slice(0, 12) : [],
    finalAnswer: String(parsed.finalAnswer || ""),
    confidence: ["High", "Medium", "Low"].includes(parsed.confidence) ? parsed.confidence : "Check the reading",
    caveat: String(parsed.caveat || "").slice(0, 500)
  };
}

export async function onRequestPost({ request, env }) {
  if (!env.OPENAI_API_KEY || !env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
    return reply(503, { error: "Maths Camera is not configured on the server yet." });
  }
  const auth = request.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) return reply(401, { error: "Please sign in to use Maths Camera." });

  const userCheck = await fetch(env.SUPABASE_URL.replace(/\/$/, "") + "/auth/v1/user", {
    headers: { apikey: env.SUPABASE_ANON_KEY, authorization: "Bearer " + token }
  });
  if (!userCheck.ok) return reply(401, { error: "Your session has expired. Please sign in again." });

  let body;
  try { body = await request.json(); } catch { return reply(400, { error: "Invalid request." }); }
  const questionText = typeof body.questionText === "string" ? body.questionText.trim() : "";
  const image = typeof body.image === "string" ? body.image : "";
  if (questionText.length > 6000) return reply(413, { error: "Question text is too long." });
  if (!questionText && (!image.startsWith("data:image/") || image.length > MAX_IMAGE_CHARS)) {
    return reply(400, { error: "Upload a supported image under 8 MB, or enter the recognised question." });
  }
  if (image && !/^data:image\/(jpeg|png|webp|heic|heif);base64,/i.test(image)) {
    return reply(400, { error: "Unsupported image format." });
  }

  const instructions = `You are the maths and exam-question tutor for UPSSSC Maths Pathshala. Read the question carefully from the supplied photo, including handwritten notes in Hindi or English, mathematical notation, fractions, powers, roots, diagrams and options. Do not guess unclear digits or symbols. If uncertain, state the ambiguity in caveat and set confidence to Low. Solve only what is actually asked. Explain in simple, beginner-friendly Hindi (retain standard mathematical notation); use concise numbered steps. Check arithmetic and the final answer. If the image contains multiple questions, solve the most prominent complete question and say so in caveat. Return ONLY valid JSON with this exact shape: {"recognisedQuestion":"transcribed question","steps":["step 1","step 2"],"finalAnswer":"answer","confidence":"High|Medium|Low","caveat":"short note or empty string"}.`;
  const content = [{ type: "input_text", text: instructions }];
  if (questionText) content.push({ type: "input_text", text: "Solve this corrected question text: " + questionText });
  else content.push({ type: "input_image", image_url: image, detail: "high" });

  let aiResponse;
  try {
    aiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { authorization: "Bearer " + env.OPENAI_API_KEY, "content-type": "application/json" },
      body: JSON.stringify({
        model: env.OPENAI_VISION_MODEL || "gpt-4.1-mini",
        instructions,
        input: [{ role: "user", content }],
        max_output_tokens: 1200
      })
    });
  } catch {
    return reply(502, { error: "The AI solver could not be reached. Please try again." });
  }
  if (!aiResponse.ok) return reply(502, { error: "The AI solver returned an error. Please try again later." });
  const result = await aiResponse.json();
  try {
    const answer = parseAnswer(extractOutputText(result));
    if (!answer.recognisedQuestion && !questionText) return reply(422, { error: "We could not read the question clearly. Try a sharper photo or type the question." });
    return reply(200, answer);
  } catch {
    return reply(502, { error: "The solver returned an unreadable answer. Please try again." });
  }
}
