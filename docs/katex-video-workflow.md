# KaTeX in UPSSSC Maths Pathshala videos

The website and React-based video compositions share the same KaTeX renderer.

## Use in a Remotion composition

Install the repository dependencies in the video workspace, then import:

```jsx
import VideoMath from "../src/components/VideoMath.jsx";

export function PercentageStep() {
  return (
    <AbsoluteFill>
      <VideoMath tex={String.raw`\frac{25}{100}\times 480 = 120`} />
    </AbsoluteFill>
  );
}
```

Animate the `video-math-layer` wrapper using the composition's existing Remotion
`spring`, `interpolate`, and `useCurrentFrame` logic. Keep one mathematical
operation per visual beat; avoid placing an entire solution on screen at once.

## Production guidance

- Use `display={true}` for standalone equations and `display={false}` inline.
- Use TeX strings, not pre-rendered screenshots, so equations remain crisp at 1080×1920.
- Keep Hindi narration and explanatory text as normal HTML/React text; use KaTeX only
  for mathematical notation.
- Check equation width on a 9:16 canvas. Break long derivations into separate steps.
- The video workspace must install the same pinned KaTeX major/minor dependency and
  import the shared component; the current Ootto/Remotion render workspace is separate
  from this Vite repository and is not changed automatically by this integration.

## Example equations

```js
String.raw`\frac{3}{5}+\frac{2}{7}=\frac{31}{35}`
String.raw`25\%\times 480=120`
String.raw`x=\frac{a(b+c)}{d}`
```
