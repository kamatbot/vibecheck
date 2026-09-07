# VIBECHECK

60-second vibe quiz for 10–18 year olds. Find your vibe, get a 3D Vibe avatar built from your answers, then send the link: your friend plays and sees your match %. No backend, no accounts. Your answers live only in the link you share.

## Run

Any static server:

```bash
python3 -m http.server 8791
```

Open http://localhost:8791.

## How the viral loop works

- Share link = `#a=<12 answers>&n=<name>&h=<hop count>&g=<m/f/x>`.
- A friend opening it sees "Maya wants to see if you match", plays, and gets a match ring, shared picks, and both Vibe avatars side by side.
- "Friend plays on this phone" does the same hand-off on one device.

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

Base avatar is seeded from your answers, drawn from the pool for the gender you picked (or all 8 for "surprise me"). In a match the two players always get different bases.

Regenerate with Blender 5.2:

```bash
/Applications/Blender.app/Contents/MacOS/Blender -b --python blender/make_avatars.py
```

Review outputs:

- `blender/avatars.blend`: editable scene, framed on the full cast.
- `blender/preview.png`: full-body lineup.
- `blender/faces.png`: face close-ups.
- `blender/accessories.png`: accessory fit sheet.

The GLB is approximately 8.5 MB. When regenerating it, update both `avatars.glb?v=...` URLs in `index.html` together to invalidate browser caches.
