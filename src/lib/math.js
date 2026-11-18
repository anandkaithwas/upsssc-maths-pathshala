import katex from "katex";

const MAX_TEX_LENGTH = 2000;

/**
 * Render trusted, authored TeX to KaTeX HTML.
 * Keep trust disabled: student-provided TeX must never enable HTML or URL commands.
 */
export function renderMathToHtml(tex, options = {}) {
  if (typeof tex !== "string") throw new TypeError("Math expression must be a string.");
  if (tex.length > MAX_TEX_LENGTH) throw new RangeError("Math expression is too long.");
  return katex.renderToString(tex, {
    displayMode: Boolean(options.displayMode),
    throwOnError: false,
    strict: "ignore",
    trust: false,
    output: "htmlAndMathml",
    maxExpand: 1000,
    maxSize: 20,
  });
}
