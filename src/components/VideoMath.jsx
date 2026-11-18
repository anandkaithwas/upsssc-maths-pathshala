import React from "react";
import MathRenderer from "./MathRenderer.jsx";

/**
 * Equation layer for Remotion/video compositions.
 * Import this component into a React-based video composition and animate its
 * wrapper with the composition's existing spring/interpolate logic.
 */
export default function VideoMath({
  tex,
  display = true,
  className = "",
  ariaLabel,
}) {
  return (
    <div className={`video-math-layer ${className}`.trim()}>
      <MathRenderer
        tex={tex}
        display={display}
        className="video-math"
        ariaLabel={ariaLabel}
      />
    </div>
  );
}
