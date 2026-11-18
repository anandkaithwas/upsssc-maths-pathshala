import test from "node:test";
import assert from "node:assert/strict";
import { renderMathToHtml } from "../src/lib/math.js";

test("renders a fraction and retains MathML accessibility output", () => {
  const html = renderMathToHtml(String.raw`\frac{3}{5}+\frac{2}{7}`);
  assert.match(html, /katex/);
  assert.match(html, /mfrac/);
  assert.match(html, /mathml/);
});

test("supports display-mode equations", () => {
  const html = renderMathToHtml(String.raw`x^2+1=0`, { displayMode: true });
  assert.match(html, /katex-display/);
});

test("rejects non-string expressions", () => {
  assert.throws(() => renderMathToHtml(123), /must be a string/);
});

test("rejects excessively long expressions", () => {
  assert.throws(() => renderMathToHtml("x".repeat(2001)), /too long/);
});

test("does not trust HTML/URL commands from TeX input", () => {
  const html = renderMathToHtml(String.raw`\href{javascript:alert(1)}{click}`);
  assert.doesNotMatch(html, /href="javascript:/i);
});
