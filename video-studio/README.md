# UPSSSC Maths Pathshala — Motion Canvas Studio

This is an isolated Motion Canvas workspace. It is deliberately separate from the React/Vite production website so the Cloudflare Pages build remains unchanged.

## Requirements

- Node.js 18+ and npm
- A desktop browser for the Motion Canvas editor
- FFmpeg is provisioned by the Motion Canvas FFmpeg exporter package

## Install and open the editor

From the repository root:

```bash
cd video-studio
npm install
npm run serve
```

Open http://localhost:9000/ and select the **Video Settings** panel.

## Render the first test reel

1. Open the `pet-question` scene in the editor.
2. In Video Settings, choose the **Video (FFmpeg)** exporter.
3. Set the output resolution to **1080 × 1920**, frame rate to **30 fps**, and confirm the full scene range.
4. Enable audio only after a voice track is added; the starter scene is intentionally silent.
5. Press **RENDER**. The MP4 is saved under `video-studio/output/`.

The first scene is a visual smoke-test template, not a complete lesson. It uses a reasoning sequence (not equation-heavy maths) and keeps the channel name in the top-left.

## Build check

```bash
npm run build
```

This validates the Motion Canvas/Vite project bundle. It does not itself export an MP4.

## Automation boundary — read before production use

The official Motion Canvas documentation describes the FFmpeg exporter as an exporter selected and started from the editor's Video Settings panel. This starter therefore provides a working editor-based MP4 render path and a CI build check, but does **not** claim unattended/headless MP4 rendering yet.

The full production automation stages are:
- structured lesson JSON → scene data;
- Hindi narration file and timing metadata;
- scene generation from reusable templates;
- editor/renderer-driven export;
- output validation (duration, dimensions, audio presence);
- manual approval before publishing.

No API keys, paid voice credentials, or publishing permissions are stored in this workspace.

## Channel production constraints

- Vertical 9:16 output, target 1080 × 1920.
- Maximum 45 seconds per reel.
- Faceless, motion-graphics-first presentation.
- Hindi/Hinglish explanation and female Indian teacher voice ("Siya") when a supplied audio asset is available.
- Open immediately with the actual question/challenge; no logo intro.
- Keep "UPSSSC Maths Pathshala" small and visible at the top-left.
- Until the KaTeX rendering defect is verified fixed, prefer reasoning, series, coding-decoding, direction sense, classification and exam strategy over equation-heavy lessons.
