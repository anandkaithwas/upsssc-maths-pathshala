# Animation toolchain research — 23 November 2026

## Decision

Do not install all nine tools or add desktop animation dependencies to the public React/Vite education website. The website is a static learning portal; animation authoring/rendering belongs in a separate studio workflow. Keep generated MP4/WebM/SVG assets outside the app until approved.

## Ranked for our projects

Scores are practical fit (not a software quality score), weighted toward UPSSSC Maths Pathshala reels, repeatable production, automation, free/open-source access, and the current mobile-first studio constraints.

1. **Motion Canvas — priority pilot for scripted explainer videos (9/10).** TypeScript/React-adjacent, timeline/editor, code-driven scenes and audio/voiceover timing. Best fit for reusable branded 9:16 explainers and scripted motion graphics. It is a development workflow, not an Android app; render on a desktop/cloud environment. The public repo's latest GitHub release shown in this research is 3.17.2 (Dec 2024), so verify compatibility before adopting.
2. **Friction — priority desktop trial for 2D motion graphics (8.5/10).** Open-source vector/motion-graphics editor; keyframes and SVG-oriented workflow. Useful for reusable title cards, transitions, icons and non-equation visual lessons. New 1.0.0 release published 9 Nov 2026. Desktop, not Android.
3. **Manim — specialist maths animation engine (8/10, conditional).** Python-based programmatic mathematical animations and LaTeX. Valuable for future concept visualizations, but keep equation-heavy topics disabled for our channel until the existing math-rendering issue is demonstrably fixed. The image points to 3Blue1Brown's original Manim; also evaluate Manim Community Edition separately. Desktop/Python workflow.
4. **Synfig — character/rigged 2D animation (6.5/10).** Vector-based 2D animation, bones/animation and interpolation. Could support recurring illustrated characters, but likely slower than motion-graphics templates for short exam reels. Desktop.
5. **OpenToonz — full hand-drawn 2D animation (6/10).** Xsheet, frame-by-frame drawing and effects. Strong for bespoke cartoon lessons, but high production effort and not the best default for two short videos daily. Desktop.
6. **Pencil2D — lightweight hand-drawn animation (5.5/10).** Simple bitmap/vector frame-by-frame animation and onion skin. Useful for occasional hand-drawn diagrams; limited leverage for automated high-volume reels. Desktop.
7. **Theatre.js — web/interactive motion layer (5/10).** Timeline/keyframe editor for JavaScript/Three.js scenes. Better for interactive web explainers or motion inside a web app than a general reel pipeline. Add only to a dedicated prototype, not the main learning site by default.
8. **Natron — VFX compositing (4/10).** Node-based compositing, roto/tracking and OpenFX. Overkill unless we begin compositing green-screen footage or advanced effects. Desktop; project/release cadence should be checked carefully (latest release surfaced here is 2.5.0 from 2022).
9. **FreeMoCap — motion capture (2/10).** Markerless motion capture and skeleton export for Blender/3D workflows. No meaningful role in our faceless exam-reel format; consider only if we later make a 3D presenter/character. Current surfaced 2.0.0-alpha.26 is explicitly alpha; avoid production dependency.

## Official project and download links

- Motion Canvas source/docs: https://github.com/motion-canvas/motion-canvas and https://motioncanvas.io/docs/
- Friction source/releases: https://github.com/friction2d/friction/releases
- Manim (3Blue1Brown original): https://github.com/3b1b/manim/releases
- Manim Community Edition: https://github.com/ManimCommunity/manim
- Synfig releases: https://github.com/synfig/synfig/releases
- OpenToonz releases: https://github.com/opentoonz/opentoonz/releases
- Pencil2D releases: https://github.com/pencil2d/pencil/releases
- Theatre.js docs: https://www.theatrejs.com/docs/latest
- Natron releases: https://github.com/NatronGitHub/Natron/releases
- FreeMoCap official download guide: https://docs.freemocap.org/freemocap/download

Use the official release/download pages to choose the correct Windows/macOS/Linux package. These are not Android APKs; none of these nine is a suitable native Android installation for the user's phone. Motion Canvas and Theatre.js are JavaScript development libraries rather than one-click desktop editors.

## Recommended staged adoption

### Phase 1 — pilot
- Trial Motion Canvas on a separate workstation/cloud development environment.
- Build one 30–45 second vertical sample with our brand rules: 1080×1920, Hindi voiceover, Siya voice where available, channel name small at top-left, actual question/challenge in the opening frame, and visual change every 1–2 seconds.
- Use Friction for a small set of reusable vector assets/title transitions if its editing workflow is faster than scripted scenes.
- Export final video files; do not ship the animation editor/runtime in the public site bundle.

### Phase 2 — conditional
- Re-test Manim only after mathematical typography/rendering is verified on a complete sample export.
- Trial Synfig/OpenToonz/Pencil2D only if we commit to recurring illustrated characters or frame-by-frame lessons.
- Theatre.js only for a browser-based interactive explainer feature.
- Defer Natron and FreeMoCap.

## Integration boundary

The current repository is a React 18 + Vite static website deployed on Cloudflare Pages. Its package manifest has no animation dependencies. Keep the website lightweight. Store approved exported videos as media assets or embed a hosted video; do not add desktop applications, Python renderers, or large editing dependencies to the website runtime.

This research note is documentation only. No packages were installed and no production website code was changed. The work is isolated on branch `research/animation-toolchain` for review.
