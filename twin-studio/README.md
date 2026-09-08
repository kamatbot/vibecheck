# Twin Studio

A local-first digital-twin editor with an original Blender character, editable face morphs, interchangeable hair and a playful sci-fi stage. This is a separate project from VIBECHECK.

Run the commands below from the `twin-studio/` directory in this repository.

### Character revision status

The exported `public/models/twin.glb`, editable `blender/twin.blend`, previews and validation receipt are produced by `blender/make_twin.py`. The head and every hair style are implicit sculpts: anatomical volumes (cranium, brow ridge, cheek and zygomatic masses, mandible, chin, nose, lips, lids, ears) are signed-distance primitives evaluated in numpy, blended, carved for the eye openings, nostrils and mouth seam, and meshed through Blender's bundled OpenVDB. Real eyeballs with a raised cornea sit behind the sculpted lids. `blender/make_twin_playful.py` is an older palette draft built on the previous height-field head and is superseded by this pipeline.

## Run locally

Use Node **24.x**:

```sh
export PATH=/opt/homebrew/opt/node@24/bin:$PATH
node --version
npm ci
npm run dev
```

Open http://127.0.0.1:8793. The dev command starts both Vite and the local ChatGPT service. `npm run build` produces `dist/`; `npm start` serves that build and the AI service at http://127.0.0.1:8794. `npm run preview` is a static-only preview and does not include the ChatGPT service.

This version runs on the desktop's loopback interface only. Publishing a public website requires a separate deployment and per-user authentication/credential-storage design; this preview deliberately does not expose the local account service publicly.

## Character and editing

- `blender/make_twin.py` builds the original source in Blender 5.2.1 LTS.
- `blender/twin.blend` is the editable source, and `public/models/twin.glb` is the browser asset.
- `public/models/asset-contract.json` documents coordinates, morph names, materials, supported ranges and geometry cost.
- Face and body sliders drive real glTF morph targets. Hair buttons select one of four authored mesh groups.
- Save stores only the validated design in this browser. JSON files move an editable design between browsers; PNG captures the current framing; GLB exports the selected character and its current settings.

## Photo privacy and limits

Selfies are decoded and resized locally, then transferred to a dedicated browser worker. The self-hosted MediaPipe model estimates facial landmarks; the app converts a few proportions and cheek color samples into editable settings. Photos and raw landmarks are neither uploaded nor saved. The worker is terminated and the temporary preview removed after each attempt. Model and runtime assets are served from this same website; there is no analytics integration.

This is a stylized starting point, not a calibrated scan or exact identity reconstruction. Hair, eye color and wardrobe remain manual choices. Use one clear, front-facing person in a JPG, PNG or WebP (up to 12 MB and 32 MP). Manual editing works without photo analysis. Current asset limitations, including the lack of an animation skeleton, are recorded in the asset contract.

## ChatGPT co-creator

Choose **Connect ChatGPT**, open the official device sign-in page, and enter the displayed code. Finish sign-in in your browser, then choose one of the models returned by your account. Describe an edit and choose **Generate design**. The prompt and current editable configuration are sent to OpenAI only for that action; photos and raw landmarks are never sent. Valid AI output is applied through the normal undo history.

The implementation ports MeetOdds' device OAuth, account model discovery, refresh and Codex Responses adapter from `MeetingRecorder/frontend/src-tauri/src/openai_codex.rs` at baseline `5f08753d54ae83f3d1aa44779350d19e595a6178`. Each browser has a separate HttpOnly, SameSite Strict cookie; tokens remain in the local Node process memory and are discarded on restart or disconnect. It never reads MeetOdds credentials or the user's Codex login. The service checks exact loopback Host/Origin, bounds request size, validates every AI configuration and rejects stale sign-in results after cancellation. Account plan access and allowance are determined by OpenAI.

## Validation

`npm test` checks design boundaries, unsafe extra fields, photo input validation and the real GLB morph geometry. Browser acceptance covers photo import, manual changes, save/restore, camera framing and downloadable exports. This first version targets desktop screens, with a minimum workspace width of 1024px. Test portraits are temporary local fixtures and are not distributed in the website.

The seven service tests mock provider responses, including cancellation races, refresh, rate limits, invalid/truncated AI output, session isolation and CSRF. Actual account sign-in and a live generation require the user's own account.

Third-party runtime provenance is listed in `THIRD_PARTY.md`. No production upload, deployment or change to VIBECHECK is part of this preview.
