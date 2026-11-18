import React, { useMemo } from "react";
import { renderMathToHtml } from "../lib/math.js";

/** Render a TeX expression. Use display for centred, standalone equations. */
export default function MathRenderer({
  tex,
  display = false,
  className = "",
  ariaLabel,
}) {
  const html = useMemo(
    () => renderMathToHtml(tex, { displayMode: display }),
    [tex, display],
  );

  const Tag = display ? "div" : "span";
  return (
    <Tag
      className={`math-renderer ${display ? "math-display" : "math-inline"} ${className}`.trim()}
      role="img"
      aria-label={ariaLabel || tex}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
