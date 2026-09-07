# VIBECHECK

A playful 12-question preference quiz for 10–18 year olds. Discover a vibe snapshot, remix your 3D character, then send the link: each friend plays and joins the chain. Two people compare preferences; three or more see group dynamics. No backend, no accounts. Your answers live only in the link you share.

## Run

Any static server:

```bash
python3 -m http.server 8791
```

Open http://localhost:8791.

The opening page previews four characters. New chains draw 12 questions from an 80-item candidate preference bank with playful, teen-friendly wording: one per facet across Chaos, Chill, Plan and Social. Four anchor items are shared within a chain; eight variable items favor questions that friends have not seen. Question order is interleaved and option direction varies between sessions. There are no right answers or scored trivia in this edition.

## How the viral loop works

- Each friend opens the newest link, plays, and shares a new link containing the previous people plus themselves. Sharing repeatedly does not duplicate the player. “Friend plays on this phone” advances the same chain locally.
- Two players see descriptive comparisons of their quiz preferences. Three or more see counts across each preference axis and suggestions for activities together. Axes are independent; they do not sum to 100. These are unvalidated candidate snapshots, not a friendship prediction or permanent personality type.
- Everyone contributes to group summaries; the first eight participants remain the visible 3D cast, without paging. Chains support 64 completed participants and a 16 KiB fragment. A full chain offers an explicit start-new-chain action.
- “Try another question” replaces an unfamiliar item within the same facet while keeping the session balanced. If no replacement fits, the current question remains and an explanatory message appears.
- Cosmetic choices are independent of preference answers. “Remix my look” changes only the current player's appearance, preserving their responses and earlier participants.
- Links are snapshots: forward the newest link to bring everyone along. Separate branches do not automatically merge or update older links.
- Old V1/V2 links continue on their original trivia/taste quiz and scoring. They are never reinterpreted as answers to the new bank. An explicit new-chain action switches to the new edition.
- Answer choices use `touch-action: manipulation` to suppress double-tap zoom while retaining scrolling and pinch-to-zoom.

## Versions and reproducibility

New links use `#v=3&c=<base64url JSON>`. The envelope `[1, panel, participants]` pins candidate release 1 to `preferences/data-v1.js` and `preferences/engine-v1.js`. Keep these immutable when introducing a future bank or scoring release; add a new release decoder instead.

Each compact participant stores their name, avatar pool, 12 exact question/option identities in presentation order, separate 12-digit cosmetic choices, and option orientation. Question indices refer to the pinned 80-item array and stable item IDs/version 1; option IDs are a–d. Stored answers are validated against the complete session blueprint, and scores are recomputed from trusted weights. Unknown releases and malformed payloads are rejected as a whole.

The 24-character response field uses two base64url-alphabet characters for each integer `questionIndex * 4 + optionIndex`. The enclosing JSON is UTF-8/base64url encoded. Worst-case 64-person Unicode-name fixtures remain below the fragment ceiling. No backend, account or analytics was added.

The runtime retains the exact final form needed to reproduce a result. Declined-item history and selection seeds exist only during the active session and are not carried in links. This is an entertainment prototype, not a research data-collection implementation. See [candidate provenance](preferences/README.md) for source hashes, model limitations and engine changes.

Focused checks (Node.js 24):

```bash
PATH=/opt/homebrew/opt/node@24/bin:$PATH node --test tests/preference-engine.test.cjs tests/preference-quiz.test.cjs tests/preference-ui.test.cjs
```

Legacy chain, renderer/flow and loader checks remain in `tests/vibe-chain.test.cjs`, `tests/group-ui.test.cjs` and `tests/avatar-loader.test.cjs`.

## Avatars

`blender/make_avatars.py` builds 8 stylised teen bases (4 male, 4 female, each with its own hair, pose, outfit and body type) and 8 attribute accessories in Blender and exports `avatars.glb`. The cast uses expressive faces, sculpted hairstyles, casual streetwear and detailed sneakers, inspired by the supplied character reference.

The legacy quiz selects the same base identities and recolors the `outfit`, `headphone` and `cape` materials from answers:

| Attribute | Mesh | Triggered by |
|---|---|---|
| music | headphones, coloured by genre | always |
| dress | outfit colour, cape for Neon / Y2K | aesthetic answer |
| sense | sunglasses | streetwear or aura farming |
| smart | glasses | 2+ trivia correct |
| knowledge | grad cap | Brain top axis or 3/3 trivia |
| crazy | horns | Chaos top axis or lost aura |
| leader | crown | yapper, infinite aura, or Social top |
| chill | nightcap | Chill top axis or bed rotting |

Base avatar is seeded from independent cosmetic choices for new quizzes (answers for legacy quizzes), drawn from the pool for the gender you picked (or all 8 for "surprise me"). Bases are assigned in arrival order, avoiding repeats within each gender pool until its options are exhausted. Adding friends preserves earlier assignments.

Regenerate with Blender 5.2:

```bash
/Applications/Blender.app/Contents/MacOS/Blender -b --python blender/make_avatars.py
```

Review outputs:

- `blender/avatars.blend`: editable scene, framed on the full cast.
- `blender/preview.png`: full-body lineup.
- `blender/faces.png`: face close-ups.
- `blender/accessories.png`: accessory fit sheet.

The current Meshopt-compressed GLB is approximately 1.25 MB. Blender regeneration produces the larger source export; retain the decoder-compatible optimization step before publishing. Update `GLB_BASE_URL` in `index.html` when replacing the asset to invalidate browser caches. The current palette optimization merged the named tint materials, so answer-based material recoloring needs a separate asset correction.
