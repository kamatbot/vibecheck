# Twin Studio

## Product
A new website where users build a digital creative avatar inspired by themselves: start from a selfie or by hand, then refine the face, hair, skin, body and clothing. The main output is a warm, playful full-body 3D character in an animated-film style. A loose resemblance matters more than anatomical accuracy; the character should feel expressive and approachable.

## Confirmed user decisions
- Polished animated-film style rather than photorealism.
- Photo-assisted starting point plus manual editing.
- Photos stay on device; estimated facial features remain editable.
- First deliverable is a working new website with an editor.
- Astra Max exclusively for Blender modeling work.
- Prioritize fun, friendly proportions and expression over exact photo likeness.
- ChatGPT co-creation uses the MeetOdds device sign-in flow.

## Platform
Desktop web for now. A large central character preview leads the experience.

## Scope and assumptions
Working title Twin Studio. A separate local project, preserving VIBECHECK. Local facial landmarks suggest gentle changes capped at 40% of the sculpt range; manual controls allow stronger stylization. A Node service handles optional ChatGPT connection, with tokens outside browser storage. The editor includes a clothed full-body base, interchangeable hair, tunable materials/morphs, local design save/load and PNG/GLB export. Deployment to twin.ryshi.com is paused by the user's latest instruction until the character is approved.
