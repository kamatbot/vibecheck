const PreferenceEngine = (() => {
/**
 * VIBECHECK candidate reference engine. No dependencies and no network calls.
 * This implements PROVISIONAL content-balanced scoring, NOT psychometric calibration.
 * Production needs persistence, consent, input-size limits, and security review.
 */
const DIMENSIONS = Object.freeze(['chaos', 'chill', 'brain', 'social']);
const invariant = (ok, message) => { if (!ok) throw new Error(message); };
const average = xs => xs.reduce((a, b) => a + b, 0) / xs.length;
const itemKey = q => `${q.id}@${q.version}`;
const responseKey = r => `${r.question_id}@${r.question_version}`;
const signature = items => items.map(q => q.id).sort().join('|');

// FNV-1a + xorshift32 are only deterministic randomization, NOT security primitives.
function hash32(text) {
  let h = 2166136261;
  for (const c of new TextEncoder().encode(String(text))) h = Math.imul(h ^ c, 16777619);
  return h >>> 0;
}
function randomFrom(seed) {
  let x = hash32(seed) || 1;
  return () => { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; return (x >>> 0) / 4294967296; };
}
function shuffle(xs, random) {
  const out = [...xs];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1)); [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function validateBank(bank, manifest) {
  invariant(Array.isArray(bank) && bank.length === 80, 'Expected exactly 80 items');
  invariant(new Set(bank.map(q => q.id)).size === 80, 'Question IDs must be unique');
  for (const d of DIMENSIONS) {
    const qs = bank.filter(q => q.dimension === d);
    invariant(qs.length === 20, `Expected 20 ${d} items`);
    const fs = manifest.dimensions[d].facets;
    invariant(fs.length === 3, `Expected 3 ${d} facets`);
    fs.forEach((f, i) => invariant(qs.filter(q => q.facet === f).length === [7, 7, 6][i], `Bad facet count: ${f}`));
  }
  for (const q of bank) {
    invariant(DIMENSIONS.includes(q.dimension), 'Unknown dimension');
    invariant(q.version === 1 && q.reading_age_target === 10, 'Unexpected candidate item version or reading target');
    invariant(manifest.dimensions[q.dimension].facets.includes(q.facet), 'Dimension/facet mismatch');
    invariant(typeof q.prompt === 'string' && q.prompt.length > 0, 'Missing prompt');
    invariant(q.options.length === 4 && q.options.map(o => o.id).sort().join('') === 'abcd', 'Exactly four stable option IDs required');
    invariant(new Set(q.options.map(o => o.text)).size === 4, 'Duplicate option text in an item');
    for (const o of q.options) {
      invariant(typeof o.text === 'string' && o.text.length > 0 && typeof o.rationale === 'string', 'Missing option text or rationale');
      invariant(Object.keys(o.weights).sort().join() === [...DIMENSIONS].sort().join(), 'Missing or extra scoring dimensions');
      DIMENSIONS.forEach(d => invariant(Number.isInteger(o.weights[d]) && o.weights[d] >= 0 && o.weights[d] <= 3, 'Invalid weight'));
      DIMENSIONS.filter(d => d !== q.dimension).forEach(d => invariant(o.weights[d] === 0, 'Cross-loading not permitted in expert v1'));
    }
    invariant(q.options.map(o => o.weights[q.dimension]).sort().join() === '0,1,2,3', 'Each ordinal level must appear once');
  }
  for (const [panel, ids] of Object.entries(manifest.selection.anchor_panels)) {
    const qs = ids.map(id => bank.find(q => q.id === id));
    invariant(qs.length === 4 && qs.every(Boolean), `Invalid anchor panel ${panel}`);
    invariant(new Set(qs.map(q => q.dimension)).size === 4, 'Anchor panel must cover each dimension');
    invariant(new Set(qs.map(q => q.overlap_group).filter(Boolean)).size === qs.filter(q => q.overlap_group).length, 'Anchor topic conflict');
  }
  return true;
}

/** Pin the returned panel in chain metadata; never recompute it after changing bank versions. */
function panelForChain(chainId, manifest) {
  const panels = Object.keys(manifest.selection.anchor_panels).sort();
  return panels[hash32(`${manifest.bank_version}|${chainId}`) % panels.length];
}

function contentValid(items, manifest, complete = false) {
  if (new Set(items.map(q => q.id)).size !== items.length) return false;
  if (new Set(items.map(q => `${q.dimension}:${q.facet}`)).size !== items.length) return false;
  const groups = items.map(q => q.overlap_group).filter(Boolean);
  if (new Set(groups).size !== groups.length) return false;
  const contexts = new Map();
  for (const q of items) contexts.set(q.context, (contexts.get(q.context) || 0) + 1);
  if ([...contexts.values()].some(n => n > manifest.selection.maximum_per_context)) return false;
  return !complete || (items.length === 12 && contexts.size >= manifest.selection.minimum_distinct_contexts &&
    DIMENSIONS.every(d => items.filter(q => q.dimension === d).length === 3));
}

function interleave(items, random, budget) {
  // Every block of four has one item per dimension; avoid adjacent context and dimension repeats.
  function walk(remaining, ordered) {
    if (--budget.remaining < 0) return null;
    if (!remaining.length) return ordered;
    const used = new Set(ordered.slice(ordered.length - ordered.length % 4).map(q => q.dimension));
    const previous = ordered.at(-1);
    for (const q of shuffle(remaining, random)) {
      if (used.has(q.dimension) || (previous && (q.context === previous.context || q.dimension === previous.dimension))) continue;
      const found = walk(remaining.filter(x => x.id !== q.id), [...ordered, q]);
      if (found) return found;
    }
    return null;
  }
  return walk(items, []);
}

/**
 * priorSessions contains item exposure only, never friends' answers.
 * Same dimension/facet coverage, <=3 per context, >=5 contexts, unique topic groups.
 * Variation is a soft objective; anchors are intentionally shared.
 */
function assembleSession(bank, manifest, {
  chainId, sessionId, participantId, anchorPanel = panelForChain(chainId, manifest),
  priorSessions = [], recentItemIds = [], attempts = 32
}) {
  invariant(typeof chainId === 'string' && typeof sessionId === 'string' && typeof participantId === 'string', 'Missing stable IDs');
  invariant(Number.isInteger(attempts) && attempts > 0 && attempts <= 256, 'Invalid search attempt count');
  const anchorIds = manifest.selection.anchor_panels[anchorPanel];
  invariant(Array.isArray(anchorIds), 'Unknown anchor panel');
  const anchors = anchorIds.map(id => bank.find(q => q.id === id));
  invariant(anchors.every(Boolean) && contentValid(anchors, manifest), 'Invalid anchors');
  const anchorSet = new Set(anchorIds);
  const filled = new Set(anchors.map(q => `${q.dimension}:${q.facet}`));
  const slots = DIMENSIONS.flatMap(d => manifest.dimensions[d].facets.map(f => `${d}:${f}`)).filter(s => !filled.has(s));
  const pools = new Map(slots.map(s => [s, bank.filter(q => `${q.dimension}:${q.facet}` === s)]));
  const prior = priorSessions.filter(s => s.bank_version === manifest.bank_version && s.anchor_panel === anchorPanel);
  const priorSets = prior.map(s => new Set(s.items.filter(q => !q.is_anchor).map(q => q.question_id)));
  const exposure = new Map();
  priorSets.forEach(set => set.forEach(id => exposure.set(id, (exposure.get(id) || 0) + 1)));
  const recent = new Set(recentItemIds);
  const usedForms = new Set(prior.map(s => s.items.map(q => q.question_id).sort().join('|')));
  const seed = `${manifest.selection_version}|${chainId}|${sessionId}|${participantId}`;
  // Bound all DFS work across attempts, including ordering, on the browser thread.
  const budget = {remaining: 20000};
  let best = null;
  for (let attempt = 0; attempt < attempts && budget.remaining > 0; attempt++) {
    const random = randomFrom(`${seed}|${attempt}`);
    const jitters = new Map(bank.map(q => [q.id, random()]));
    function find(remainingSlots, chosen) {
      if (--budget.remaining < 0) return null;
      if (!remainingSlots.length) {
        if (!contentValid(chosen, manifest, true) || usedForms.has(signature(chosen))) return null;
        return chosen;
      }
      const available = remainingSlots.map(s => ({s, qs: pools.get(s).filter(q => contentValid([...chosen, q], manifest))}));
      available.sort((a, b) => a.qs.length - b.qs.length || a.s.localeCompare(b.s));
      const {s, qs} = available[0];
      qs.sort((a, b) => ((exposure.get(a.id) || 0) / Math.max(1, prior.length) + (recent.has(a.id) ? 0.8 : 0) + jitters.get(a.id)) -
                        ((exposure.get(b.id) || 0) / Math.max(1, prior.length) + (recent.has(b.id) ? 0.8 : 0) + jitters.get(b.id)));
      for (const q of qs) {
        const result = find(remainingSlots.filter(x => x !== s), [...chosen, q]);
        if (result) return result;
      }
      return null;
    }
    const chosen = find(slots, anchors);
    if (!chosen) continue;
    const ordered = interleave(chosen, random, budget);
    if (!ordered) continue;
    const variable = chosen.filter(q => !anchorSet.has(q.id));
    const overlaps = priorSets.map(set => variable.filter(q => set.has(q.id)).length);
    const objective = 2 * Math.max(0, ...overlaps) + (overlaps.length ? average(overlaps) : 0) + variable.filter(q => recent.has(q.id)).length;
    if (!best || objective < best.objective) best = {ordered, objective, maximum_prior_variable_overlap: Math.max(0, ...overlaps)};
    if (best.objective === 0) break;
  }
  invariant(best, budget.remaining <= 0 ? 'Session search budget exhausted; no valid form found within bounded search' : 'No valid form: preserve content constraints; revise the approved manifest instead of silently dropping coverage');
  const reverse = (hash32(`${seed}|option-orientation`) & 1) === 1;
  return {
    schema_version: 1, chain_id: chainId, session_id: sessionId, participant_id: participantId,
    bank_id: manifest.bank_id, bank_version: manifest.bank_version, bank_sha256: manifest.item_file_sha256,
    scale_id: manifest.scale_id, scoring_version: manifest.scoring_version,
    calibration_version: manifest.calibration_version, selection_version: manifest.selection_version,
    language: manifest.language, language_revision: manifest.language_revision,
    anchor_panel: anchorPanel, seed, option_orientation: reverse ? 'descending' : 'ascending',
    selection_diagnostics: {maximum_prior_variable_overlap: best.maximum_prior_variable_overlap},
    anchor_exceptions: [], declined_items: [],
    items: best.ordered.map((q, position) => ({
      question_id: q.id, question_version: q.version, dimension: q.dimension, facet: q.facet,
      presented_position: position, display_option_ids: reverse ? ['d','c','b','a'] : ['a','b','c','d'],
      is_anchor: anchorSet.has(q.id)
    }))
  };
}

function validateSession(bank, manifest, session) {
  invariant(session.bank_version === manifest.bank_version && session.bank_sha256 === manifest.item_file_sha256, 'Bank version or hash mismatch');
  invariant(session.scoring_version === manifest.scoring_version && session.scale_id === manifest.scale_id && session.calibration_version === manifest.calibration_version, 'Scoring scale/version mismatch');
  invariant(Array.isArray(session.items) && session.items.length === 12, 'Session must have exactly 12 assigned items');
  const byKey = new Map(bank.map(q => [itemKey(q), q]));
  const selected = session.items.map(row => {
    const q = byKey.get(responseKey(row));
    invariant(q, 'Unknown question ID/version');
    invariant(row.dimension === q.dimension && row.facet === q.facet, 'Assigned content metadata mismatch');
    invariant(Array.isArray(row.display_option_ids) && [...row.display_option_ids].sort().join('') === 'abcd', 'Invalid display option order');
    return q;
  });
  invariant(contentValid(selected, manifest, true), 'Session blueprint violated');
  return byKey;
}

/** Unfamiliar-question replacement; does not count as an answer or a fifth response option. */
function swapUnansweredItem(bank, manifest, session, questionId, responses = []) {
  validateSession(bank, manifest, session);
  invariant(!responses.some(r => r.question_id === questionId), 'Only unanswered questions can be swapped');
  const row = session.items.find(r => r.question_id === questionId);
  invariant(row, 'Question not assigned');
  const exclude = new Set([...session.items.map(r => r.question_id), ...(session.declined_items || []).map(r => r.question_id)]);
  const others = session.items.filter(r => r.question_id !== questionId).map(r => bank.find(q => q.id === r.question_id));
  const position = session.items.findIndex(r => r.question_id === questionId);
  const random = randomFrom(`${session.seed}|swap|${questionId}|${session.declined_items.length}`);
  const candidates = shuffle(bank.filter(q => q.dimension === row.dimension && q.facet === row.facet && !exclude.has(q.id)), random);
  const replacement = candidates.find(q => contentValid([...others,q], manifest, true) &&
    [session.items[position - 1],session.items[position + 1]].filter(Boolean).every(r => bank.find(x => x.id === r.question_id).context !== q.context));
  invariant(replacement, 'No same-facet replacement fits; leave incomplete rather than inventing an answer');
  return {...session,
    items: session.items.map(r => r.question_id !== questionId ? r : {...r, question_id: replacement.id, question_version: replacement.version, is_anchor: false}),
    declined_items: [...session.declined_items, {question_id: row.question_id, question_version: row.question_version, reason: 'unfamiliar_or_declined'}],
    anchor_exceptions: row.is_anchor ? [...session.anchor_exceptions, {original_question_id: row.question_id, replacement_question_id: replacement.id}] : [...session.anchor_exceptions]
  };
}

function band(value) { return value < 1/3 ? 'low' : value > 2/3 ? 'high' : 'middle'; }

/** Scores are computed by stable ID, never by presentation position or untrusted input weights. */
function scoreSession(bank, manifest, session, responses) {
  const byKey = validateSession(bank, manifest, session);
  invariant(Array.isArray(responses) && responses.length <= 12, 'Invalid response count');
  invariant(new Set(responses.map(responseKey)).size === responses.length, 'Duplicate responses');
  const assigned = new Set(session.items.map(responseKey));
  for (const r of responses) {
    invariant(assigned.has(responseKey(r)), 'Response is not assigned to this session');
    const q = byKey.get(responseKey(r));
    invariant(q.options.some(o => o.id === r.option_id), 'Unknown option ID');
  }
  const common = {bank_version: manifest.bank_version, bank_sha256: manifest.item_file_sha256,
    scale_id: manifest.scale_id, scoring_version: manifest.scoring_version, calibration_version: null,
    session_id: session.session_id, answered_count: responses.length,
    precision: 'unquantified', weights_status: manifest.weights_status};
  if (responses.length !== 12) return {...common, status: 'incomplete', axes: null};
  const axes = {};
  for (const d of DIMENSIONS) {
    const values = responses.flatMap(r => {
      const q = byKey.get(responseKey(r));
      return q.dimension === d ? [{facet: q.facet, value: q.options.find(o => o.id === r.option_id).weights[d]}] : [];
    });
    invariant(values.length === 3 && new Set(values.map(v => v.facet)).size === 3, 'Missing facet coverage');
    const rawSum = values.reduce((s, v) => s + v.value, 0);
    // One item per facet means rawSum/9 is the equal-facet mean of level/3.
    const value = rawSum / 9;
    axes[d] = {value, raw_sum: rawSum, answered_count: 3, band: band(value)};
  }
  return {...common, status: 'provisional_snapshot', axes};
}

/** A descriptive quiz-similarity statistic, NOT a probability of friendship success. */
function compareProfiles(a, b, manifest) {
  invariant(a.status === 'provisional_snapshot' && b.status === 'provisional_snapshot', 'Two complete profiles required');
  for (const key of ['scale_id','scoring_version','bank_version','bank_sha256']) invariant(a[key] === b[key], `Unlinked profile versions: ${key}`);
  invariant(a.scale_id === manifest.scale_id && a.scoring_version === manifest.scoring_version && a.bank_version === manifest.bank_version && a.bank_sha256 === manifest.item_file_sha256, 'Wrong scoring manifest');
  const gaps = {};
  for (const d of DIMENSIONS) {
    const x = a.axes[d].value, y = b.axes[d].value;
    invariant(Number.isFinite(x) && x >= 0 && x <= 1 && Number.isFinite(y) && y >= 0 && y <= 1, 'Invalid profile coordinate');
    gaps[d] = Math.abs(x - y);
  }
  const rawScore = 100 * (1 - average(Object.values(gaps)));
  return {metric: 'quiz_preference_similarity', metric_version: manifest.pair_metric_version,
    raw_score: rawScore, display_score: Math.round(rawScore / 10) * 10, units: 'out_of_100',
    use_percent_sign: false, is_probability: false, status: 'prototype_only_uncalibrated',
    uncertainty: 'unquantified', axis_gaps: gaps, subtitle: manifest.pair_display.subtitle};
}

/** Every participant remains in the roster, even without a completed/shared profile. */
function summarizeGroup(participants, manifest) {
  invariant(Array.isArray(participants) && participants.length >= 3, 'Group summaries require at least three people');
  invariant(participants.every(p => typeof p.id === 'string') && new Set(participants.map(p => p.id)).size === participants.length, 'Unique participant IDs required');
  const eligible = p => p.share_profile === true && p.profile?.status === 'provisional_snapshot' &&
    p.profile.scale_id === manifest.scale_id && p.profile.scoring_version === manifest.scoring_version &&
    p.profile.bank_version === manifest.bank_version && p.profile.bank_sha256 === manifest.item_file_sha256;
  const included = participants.filter(eligible);
  const axes = {};
  for (const d of DIMENSIONS) {
    const values = included.map(p => p.profile.axes[d].value);
    invariant(values.every(x => Number.isFinite(x) && x >= 0 && x <= 1), 'Invalid group profile coordinate');
    const counts = {low: 0, middle: 0, high: 0};
    values.forEach(x => counts[band(x)]++);
    axes[d] = {counts, n: values.length, mean: values.length ? average(values) : null,
      minimum: values.length ? Math.min(...values) : null, maximum: values.length ? Math.max(...values) : null};
  }
  return {summary_version: manifest.group_summary_version, total_participants: participants.length,
    shared_complete_profiles: included.length, axes,
    roster: participants.map(p => ({participant_id: p.id, included_in_summary: eligible(p),
      status: eligible(p) ? 'shared_snapshot' : p.share_profile !== true ? 'private' : p.profile?.status === 'incomplete' || !p.profile ? 'not_completed' : 'unlinked_version'})),
    suggestions: [
      'Offer a familiar activity and a new twist; let the crew choose.',
      'Agree on a pace, with pauses available.',
      'Try a loose outline that people can change together.',
      'Make room to talk, listen, or join side by side.'
    ],
    warning: 'These are shared preference snapshots, not a verdict on how well this group gets along.'};
}

return {DIMENSIONS, validateBank, panelForChain, assembleSession, swapUnansweredItem, band, scoreSession, compareProfiles, summarizeGroup};
})();
if (typeof module !== "undefined" && module.exports) module.exports = PreferenceEngine;
