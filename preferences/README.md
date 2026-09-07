# Candidate preference engine

Imported from the supplied `vibecheck-research-handoff-v1/vibecheck-research` package dated 2026-09-07, whose manifest identifies repository baseline `0d38340008fa322570403e0ab39a9d79143d9379`. All 80 prompts and 320 option texts now have an authored editorial revision for a playful teen voice. This is no longer the exact original bank: stable item IDs, item version 1, dimensions, facets, contexts, overlap groups and weight maps remain unchanged. Option rationales change only their quoted option text; their reasoning remains original. This is candidate, unvalidated content with provisional expert ordinal weights; it is not psychometrically validated or calibrated. Research citations do not transfer instrument norms or reliability to this bank.

Exact source-file SHA-256 values:

- `question-bank.v1.json`: `cb70f0a92d407cd11c418061cc10b694c4f6880fa82cc6553a3852f104ee72ff`
- `bank-manifest.v1.json`: `9248994b12201ee54e65c46da74ebb1c5d222938a68b2093500277b69cd0371e`
- `reference-engine.mjs`: `7bb86b4298c3ed2ad44a125dcd0d747fc7aaacfc5212602de23413851e79054a`
- `reference-engine.test.mjs`: `64a42d152669348a4a23aadba38fa7d9e96004f5ac5425772f5cecdc0c192689`

`data-v1.js` exposes `PreferenceData` and `engine-v1.js` exposes `PreferenceEngine` in classic scripts, with CommonJS exports for tests. The reference API signatures and scoring are preserved. Assembly and ordering share a 20,000-node DFS budget across attempts; if no valid session is found, selection throws explicitly without weakening coverage. An already-valid best session may be returned when the budget is exhausted during variation optimization. This is a search-work ceiling, not a time guarantee for arbitrarily large untrusted input.

Run focused engineering verification under Node 24 with `node --test tests/preference-engine.test.cjs`. Engineering checks are not a human pilot or validation study.

## Editorial copy revision

The unpublished candidate is now `1.0.0-candidate-fun.1`, language revision `2`, result copy version `preference-snapshot-fun-1`. Other version/scoring fields are unchanged. The current bank SHA-256 is `482dbf8d544b325a42d11932e990a8c79357aa55534db730398039681a2d361d`, calculated over `JSON.stringify(bank, null, 2) + "\n"`. Original research hashes above remain provenance for the supplied sources.

See [copy-review.md](copy-review.md) for all 80 revised prompts and their four canonical options. Humor lives chiefly in scenarios; options retain neutral, ordered descriptions. Frequency items still ask how often, while preference items still ask what the person enjoys. Light phrases such as “remix,” “deep dive,” and “free time unlocked” require no specific internet reference. No participant comprehension testing, alternate-form equivalence study, psychometric validation or calibration has been performed. Editorial intent to preserve meaning is not empirical evidence of equivalence.
