# VIBECHECK

A quick 12-question vibe quiz with big emoji answer tiles. Find your character, share the link, and let friends join the group. Two people see a match score; three or more see group dynamics. No backend, no accounts.

## Run

```bash
python3 -m http.server 8791
```

Open http://localhost:8791.

## Current experience

- The original 12 questions are back, with the original four illustrated emoji choices in a two-column grid. Each player gets a shuffled question order; answers remain stored in canonical order for compatible scoring.
- The opening page previews four characters. Tapping a result character triggers a gentle 24-second rotation. There is no “Run it back” option.
- Each friend opens the newest link, plays, and shares a new link containing previous participants plus themselves. Sharing repeatedly does not duplicate the player. “Friend plays on this phone” advances the chain locally.
- Two players receive the original pair match score. Three or more receive the original group energy, closest duo and unanimous preference picks. Everyone contributes; only the first eight characters appear.
- Chains support 64 completed participants and a 16 KiB fragment. A full chain offers an explicit start-new-chain action. Names are rendered as text.
- New links use the existing V2 format. Earlier V1/V2 links remain compatible. Links are snapshots: forward the newest link; separate branches do not merge or automatically update old links.
- Answer choices use `touch-action: manipulation` to suppress double-tap zoom while retaining scrolling and pinch-to-zoom.

## Saved question-bank groups

The 80-question candidate edition is retired from the play flow. Its V3 links remain readable: players can view/share the saved group or explicitly start a classic quiz. Starting a classic quiz starts a separate chain; old preference answers are never reinterpreted as classic answers. Saved one-person snapshots and larger groups remain viewable.

`preference-quiz.js` and the immutable `preferences/data-v1.js` / `preferences/engine-v1.js` remain for V3 compatibility. Release 1 pins `1.0.0-candidate-fun.1`, language revision 2. See [candidate provenance](preferences/README.md) and [question copy archive](preferences/copy-review.md). The bank was a candidate, not a validated psychometric assessment. No new questions have been added to the classic set.

Focused checks (Node.js 24):

```bash
PATH=/opt/homebrew/opt/node@24/bin:$PATH node --test tests/group-ui.test.cjs tests/preference-ui.test.cjs tests/vibe-chain.test.cjs
```

Loader recovery and archived preference-engine/transport checks remain in the other files under `tests/`.

## Avatars

`blender/make_avatars.py` builds 8 stylised teen bases (4 male, 4 female, each with its own hair, pose, outfit and body type) and 8 attribute accessories in Blender and exports `avatars.glb`. The cast uses expressive faces, sculpted hairstyles, casual streetwear and detailed sneakers, inspired by the supplied character reference.

The classic quiz selects the same base identities and recolors the `outfit`, `headphone` and `cape` materials from answers:

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

Base avatar is seeded from classic quiz answers (independent cosmetic choices for saved V3 snapshots), drawn from the pool for the gender you picked (or all 8 for "surprise me"). Bases are assigned in arrival order, avoiding repeats within each gender pool until its options are exhausted. Adding friends preserves earlier assignments.

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
