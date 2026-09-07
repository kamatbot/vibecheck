# VIBECHECK

60-second vibe quiz for 10–18 year olds. Find your vibe, get a 3D Vibe avatar built from your answers, then send the link: each friend plays and joins the chain. Two people see their match %; three or more see group dynamics. No backend, no accounts. Your answers live only in the link you share.

## Run

Any static server:

```bash
python3 -m http.server 8791
```

Open http://localhost:8791.

## How the viral loop works

- New share links use `#v=2&c=<base64url payload>`. The payload carries every completed participant's 12 answers, nickname and avatar pool in arrival order. It stays in the URL fragment; no backend or account is required.
- Each friend opens the newest link, plays, and shares a new link containing the previous people plus themselves. Sharing again or replaying does not add duplicate entries. “Friend plays on this phone” advances the same chain locally.
- Two participants see the existing pair match score and shared picks. Three or more see group energy, the closest duo, unanimous preference picks, a full roster, and the accumulated characters.
- Group energy averages each participant's normalized four-axis profile and rounds to percentages totaling 100. Closest duo uses the existing pair-match formula; ties keep the first pair in arrival order. Unanimous picks exclude trivia questions.
- The 3D cast keeps the first eight participants visible. Later participants still join the roster and update all group dynamics; there is no character paging. Desktop groups use a wider cast layout.
- A chain supports 64 people and a 16 KiB fragment. A full chain has an explicit start-new-chain action; previous participants are never silently discarded.
- Links are snapshots: forward the newest link to bring everyone along. Separate branches do not automatically merge or update older links.
- Old `#a=<12 answers>&n=<name>&h=<hop count>&g=<m/f/x>` links still work. They carry only one previous person's answers, so their old hop count cannot restore missing participants.
- Answer choices use `touch-action: manipulation` to suppress double-tap zoom while retaining scrolling and pinch-to-zoom.

Focused checks (Node.js 24):

```bash
PATH=/opt/homebrew/opt/node@24/bin:$PATH node --test tests/vibe-chain.test.cjs tests/group-ui.test.cjs tests/avatar-loader.test.cjs
```

## Avatars

`blender/make_avatars.py` builds 8 stylised teen bases (4 male, 4 female, each with its own hair, pose, outfit and body type) and 8 attribute accessories in Blender and exports `avatars.glb`. The cast uses expressive faces, sculpted hairstyles, casual streetwear and detailed sneakers, inspired by the supplied character reference.

The quiz still selects the same base identities and recolors the `outfit`, `headphone` and `cape` materials from answers:

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

Base avatar is seeded from your answers, drawn from the pool for the gender you picked (or all 8 for "surprise me"). Bases are assigned in arrival order, avoiding repeats within each gender pool until its options are exhausted. Adding friends preserves earlier assignments.

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
