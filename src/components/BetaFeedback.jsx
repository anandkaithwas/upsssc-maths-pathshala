import React, { useState } from "react";

export default function BetaFeedback() {
  const [rating, setRating] = useState("5");
  const [area, setArea] = useState("Learning content");
  const [comments, setComments] = useState("");
  const [status, setStatus] = useState("");

  const feedbackText = [
    "UPSSSC Maths Pathshala — Student Beta Feedback",
    `Overall rating: ${rating}/5`,
    `Area: ${area}`,
    `What worked / what did not: ${comments.trim() || "Not provided"}`,
    "",
    "Please do not include passwords, phone numbers, or other sensitive personal information."
  ].join("\n");

  async function copyFeedback() {
    try {
      await navigator.clipboard.writeText(feedbackText);
      setStatus("Feedback copied. Send it to us through Instagram DM or your tester coordinator.");
    } catch {
      setStatus("Clipboard access is unavailable. Select and copy the feedback text below.");
    }
  }

  return <section className="section wrap beta-feedback" id="beta-feedback">
    <div className="beta-feedback-card">
      <div className="eyebrow">HELP US IMPROVE</div>
      <h2>आपका feedback इस website को बेहतर बनाएगा।</h2>
      <p>आपकी ईमानदार राय ज़रूरी है। बताइए क्या आसान लगा, कहाँ परेशानी हुई और आगे क्या चाहिए। यह beta पूरी तरह free है।</p>
      <div className="beta-feedback-fields">
        <label>Overall experience
          <select value={rating} onChange={event => setRating(event.target.value)}>
            <option value="5">5 — बहुत अच्छा</option>
            <option value="4">4 — अच्छा</option>
            <option value="3">3 — ठीक-ठाक</option>
            <option value="2">2 — सुधार चाहिए</option>
            <option value="1">1 — बहुत परेशानी हुई</option>
          </select>
        </label>
        <label>Which area are you reviewing?
          <select value={area} onChange={event => setArea(event.target.value)}>
            <option>Learning content</option>
            <option>Quiz and questions</option>
            <option>Mobile experience</option>
            <option>Login and progress</option>
            <option>Navigation and design</option>
            <option>Other</option>
          </select>
        </label>
        <label className="beta-comments">What should we improve?
          <textarea rows="4" value={comments} onChange={event => setComments(event.target.value)} placeholder="Example: Question 2 explanation was confusing on my phone…"/>
        </label>
      </div>
      <button className="btn primary" type="button" onClick={copyFeedback}>Copy feedback to share</button>
      {status && <p className="beta-feedback-status" role="status">{status}</p>}
      <p className="beta-privacy-note">This form does not upload or store your feedback. It only prepares text on your device for you to share. Do not include personal or sensitive information.</p>
    </div>
  </section>;
}
