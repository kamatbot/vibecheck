// Candidate editorial revision of research data; see README.md for provenance.
const PreferenceData = {bank: [
  {
    "id": "chaos_001",
    "version": 1,
    "dimension": "chaos",
    "facet": "familiarity_choice",
    "prompt": "One game slot. Four good picks. What usually gets your vote?",
    "context": "games",
    "options": [
      {
        "id": "a",
        "text": "My well-known favorite.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"My well-known favorite.\" expresses a familiar choice, so it receives 0 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "b",
        "text": "A familiar game, one new feature.",
        "weights": {
          "chaos": 1,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A familiar game, one new feature.\" expresses a mostly familiar choice, so it receives 1 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "c",
        "text": "A mostly new game.",
        "weights": {
          "chaos": 2,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A mostly new game.\" expresses a mostly new choice, so it receives 2 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "d",
        "text": "A game that's totally new to me.",
        "weights": {
          "chaos": 3,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A game that's totally new to me.\" expresses a new choice, so it receives 3 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "game_choice",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Check whether access to games or reading new rules affects responses; novelty should not imply difficulty."
  },
  {
    "id": "chaos_002",
    "version": 1,
    "dimension": "chaos",
    "facet": "familiarity_choice",
    "prompt": "Story time has options. Which kind usually pulls you in?",
    "context": "stories",
    "options": [
      {
        "id": "a",
        "text": "A story I already love hearing.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A story I already love hearing.\" expresses a familiar choice, so it receives 0 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "b",
        "text": "A fresh story with known characters.",
        "weights": {
          "chaos": 1,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A fresh story with known characters.\" expresses a mostly familiar choice, so it receives 1 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "c",
        "text": "A fresh story in a familiar sort of place.",
        "weights": {
          "chaos": 2,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A fresh story in a familiar sort of place.\" expresses a mostly new choice, so it receives 2 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "d",
        "text": "A story unlike anything I've heard.",
        "weights": {
          "chaos": 3,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A story unlike anything I've heard.\" expresses a new choice, so it receives 3 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "story_choice",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Test the ordering of the two middle choices; familiarity with characters and places may differ."
  },
  {
    "id": "chaos_003",
    "version": 1,
    "dimension": "chaos",
    "facet": "familiarity_choice",
    "prompt": "Blank paper, no assignment. What's your usual drawing move?",
    "context": "creative",
    "options": [
      {
        "id": "a",
        "text": "Draw one of my usual things.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Draw one of my usual things.\" expresses a familiar choice, so it receives 0 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "b",
        "text": "Give a usual drawing a small tweak.",
        "weights": {
          "chaos": 1,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Give a usual drawing a small tweak.\" expresses a mostly familiar choice, so it receives 1 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "c",
        "text": "Draw something new, close to my usual style.",
        "weights": {
          "chaos": 2,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Draw something new, close to my usual style.\" expresses a mostly new choice, so it receives 2 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "d",
        "text": "Draw something far from my usual pictures.",
        "weights": {
          "chaos": 3,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Draw something far from my usual pictures.\" expresses a new choice, so it receives 3 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "picture_choice",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Separate topic novelty from drawing skill; accept drawing by any accessible method."
  },
  {
    "id": "chaos_004",
    "version": 1,
    "dimension": "chaos",
    "facet": "familiarity_choice",
    "prompt": "Animal deep dive: which creature would you usually pick to learn about?",
    "context": "learning",
    "options": [
      {
        "id": "a",
        "text": "One I already know loads about.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"One I already know loads about.\" expresses a familiar choice, so it receives 0 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "b",
        "text": "One I know a bit about.",
        "weights": {
          "chaos": 1,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"One I know a bit about.\" expresses a mostly familiar choice, so it receives 1 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "c",
        "text": "One I've only heard mentioned.",
        "weights": {
          "chaos": 2,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"One I've only heard mentioned.\" expresses a mostly new choice, so it receives 2 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "d",
        "text": "One I've never even heard of.",
        "weights": {
          "chaos": 3,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"One I've never even heard of.\" expresses a new choice, so it receives 3 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "animal_topic",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Measure chosen familiarity, not how much animal knowledge someone has; no factual answer is scored."
  },
  {
    "id": "chaos_005",
    "version": 1,
    "dimension": "chaos",
    "facet": "familiarity_choice",
    "prompt": "The wait needs a mini side quest. All four choices are equally easy. What's your usual pick?",
    "context": "waiting",
    "options": [
      {
        "id": "a",
        "text": "Something I've done loads of times.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Something I've done loads of times.\" expresses a familiar choice, so it receives 0 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "b",
        "text": "Something known, with one small twist.",
        "weights": {
          "chaos": 1,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Something known, with one small twist.\" expresses a mostly familiar choice, so it receives 1 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "c",
        "text": "Something that's mostly new.",
        "weights": {
          "chaos": 2,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Something that's mostly new.\" expresses a mostly new choice, so it receives 2 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "d",
        "text": "Something entirely new to me.",
        "weights": {
          "chaos": 3,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Something entirely new to me.\" expresses a new choice, so it receives 3 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "waiting_choice",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Probe what children imagine; waiting must not imply safety concerns or imposed rules."
  },
  {
    "id": "chaos_006",
    "version": 1,
    "dimension": "chaos",
    "facet": "familiarity_choice",
    "prompt": "You and a friend are picking a word game. What's your usual suggestion?",
    "context": "friends",
    "options": [
      {
        "id": "a",
        "text": "Our go-to word game.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Our go-to word game.\" expresses a familiar choice, so it receives 0 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "b",
        "text": "Our go-to, with one rule tweaked.",
        "weights": {
          "chaos": 1,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Our go-to, with one rule tweaked.\" expresses a mostly familiar choice, so it receives 1 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "c",
        "text": "A word game mostly new to us.",
        "weights": {
          "chaos": 2,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A word game mostly new to us.\" expresses a mostly new choice, so it receives 2 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "d",
        "text": "One we've both never played.",
        "weights": {
          "chaos": 3,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"One we've both never played.\" expresses a new choice, so it receives 3 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "game_choice",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Keep the focus on the preferred game, not willingness to speak; overlaps with chaos_001."
  },
  {
    "id": "chaos_007",
    "version": 1,
    "dimension": "chaos",
    "facet": "familiarity_choice",
    "prompt": "Free afternoon unlocked. All the options sound good. What usually calls to you?",
    "context": "everyday",
    "options": [
      {
        "id": "a",
        "text": "A tried-and-loved activity.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A tried-and-loved activity.\" expresses a familiar choice, so it receives 0 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "b",
        "text": "A favorite with a little change.",
        "weights": {
          "chaos": 1,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A favorite with a little change.\" expresses a mostly familiar choice, so it receives 1 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "c",
        "text": "An activity that's mostly new.",
        "weights": {
          "chaos": 2,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"An activity that's mostly new.\" expresses a mostly new choice, so it receives 2 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "d",
        "text": "An activity I've never tried.",
        "weights": {
          "chaos": 3,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"An activity I've never tried.\" expresses a new choice, so it receives 3 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "free_choice",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Check that free time is understood as a hypothetical choice, not a claim about spare time at home."
  },
  {
    "id": "chaos_008",
    "version": 1,
    "dimension": "chaos",
    "facet": "variation_seeking",
    "prompt": "Your word game has a few versions you like. Across several rounds, what's your vibe?",
    "context": "games",
    "options": [
      {
        "id": "a",
        "text": "Stick to one version throughout.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Stick to one version throughout.\" expresses repeating one version, so it receives 0 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "b",
        "text": "Switch versions just once.",
        "weights": {
          "chaos": 1,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Switch versions just once.\" expresses small amounts of variation, so it receives 1 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "c",
        "text": "Switch on several rounds.",
        "weights": {
          "chaos": 2,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Switch on several rounds.\" expresses frequent variation, so it receives 2 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "d",
        "text": "Switch to a different version each round.",
        "weights": {
          "chaos": 3,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Switch to a different version each round.\" expresses variation on nearly every turn, so it receives 3 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "word_rounds",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Use enough imagined rounds to distinguish middle options; not a test of sustained attention."
  },
  {
    "id": "chaos_009",
    "version": 1,
    "dimension": "chaos",
    "facet": "variation_seeking",
    "prompt": "You're lining up tiny paper shapes for fun. What pattern would you usually go for?",
    "context": "creative",
    "options": [
      {
        "id": "a",
        "text": "One shape on repeat.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"One shape on repeat.\" expresses repeating one version, so it receives 0 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "b",
        "text": "Mostly one shape, a few swaps.",
        "weights": {
          "chaos": 1,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Mostly one shape, a few swaps.\" expresses small amounts of variation, so it receives 1 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "c",
        "text": "A mix of several shapes.",
        "weights": {
          "chaos": 2,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A mix of several shapes.\" expresses frequent variation, so it receives 2 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "d",
        "text": "A different shape every time.",
        "weights": {
          "chaos": 3,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A different shape every time.\" expresses variation on nearly every turn, so it receives 3 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "paper_shapes",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. All patterns must be equally valued; avoid implying that varied shapes require more artistic skill."
  },
  {
    "id": "chaos_010",
    "version": 1,
    "dimension": "chaos",
    "facet": "variation_seeking",
    "prompt": "You're sharing a story in short scenes. What setting mix do you usually enjoy?",
    "context": "stories",
    "options": [
      {
        "id": "a",
        "text": "One place for every scene.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"One place for every scene.\" expresses repeating one version, so it receives 0 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "b",
        "text": "One main place, plus one other.",
        "weights": {
          "chaos": 1,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"One main place, plus one other.\" expresses small amounts of variation, so it receives 1 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "c",
        "text": "Several places across the scenes.",
        "weights": {
          "chaos": 2,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Several places across the scenes.\" expresses frequent variation, so it receives 2 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "d",
        "text": "A different place in every scene.",
        "weights": {
          "chaos": 3,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A different place in every scene.\" expresses variation on nearly every turn, so it receives 3 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "story_places",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Check whether preference reflects story comprehension rather than desire for variation."
  },
  {
    "id": "chaos_011",
    "version": 1,
    "dimension": "chaos",
    "facet": "variation_seeking",
    "prompt": "A few short chats with a friend are on the menu. What topic mix usually suits you?",
    "context": "friends",
    "options": [
      {
        "id": "a",
        "text": "One topic the whole time.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"One topic the whole time.\" expresses repeating one version, so it receives 0 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "b",
        "text": "Switch topics once.",
        "weights": {
          "chaos": 1,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Switch topics once.\" expresses small amounts of variation, so it receives 1 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "c",
        "text": "Cover a few different topics.",
        "weights": {
          "chaos": 2,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Cover a few different topics.\" expresses frequent variation, so it receives 2 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "d",
        "text": "A fresh topic for every chat.",
        "weights": {
          "chaos": 3,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A fresh topic for every chat.\" expresses variation on nearly every turn, so it receives 3 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "chat_topics",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. All options describe equal total chat time; do not score talkativeness here."
  },
  {
    "id": "chaos_012",
    "version": 1,
    "dimension": "chaos",
    "facet": "variation_seeking",
    "prompt": "Group break, several equally fun mini activities. What's your usual activity mix?",
    "context": "group_activity",
    "options": [
      {
        "id": "a",
        "text": "One activity for the whole break.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"One activity for the whole break.\" expresses repeating one version, so it receives 0 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "b",
        "text": "Switch activities once.",
        "weights": {
          "chaos": 1,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Switch activities once.\" expresses small amounts of variation, so it receives 1 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "c",
        "text": "Switch activities a few times.",
        "weights": {
          "chaos": 2,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Switch activities a few times.\" expresses frequent variation, so it receives 2 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "d",
        "text": "A different activity whenever I get the chance.",
        "weights": {
          "chaos": 3,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A different activity whenever I get the chance.\" expresses variation on nearly every turn, so it receives 3 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "break_variety",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Potential overlap with transition pace: score number of changes, never speed or rest needs."
  },
  {
    "id": "chaos_013",
    "version": 1,
    "dimension": "chaos",
    "facet": "variation_seeking",
    "prompt": "Time to explore some questions about the world. What's your usual rabbit-hole style?",
    "context": "learning",
    "options": [
      {
        "id": "a",
        "text": "Keep every question on one topic.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Keep every question on one topic.\" expresses repeating one version, so it receives 0 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "b",
        "text": "One main topic, a small detour.",
        "weights": {
          "chaos": 1,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"One main topic, a small detour.\" expresses small amounts of variation, so it receives 1 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "c",
        "text": "Spread questions over a few topics.",
        "weights": {
          "chaos": 2,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Spread questions over a few topics.\" expresses frequent variation, so it receives 2 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "d",
        "text": "Pick a different topic for each question.",
        "weights": {
          "chaos": 3,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Pick a different topic for each question.\" expresses variation on nearly every turn, so it receives 3 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "learning_topics",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Do not infer depth of knowledge or curiosity level from breadth of topic choice."
  },
  {
    "id": "chaos_014",
    "version": 1,
    "dimension": "chaos",
    "facet": "variation_seeking",
    "prompt": "You're waiting, with a few ways to pass the time. What usually works for you?",
    "context": "waiting",
    "options": [
      {
        "id": "a",
        "text": "Keep doing one thing throughout.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Keep doing one thing throughout.\" expresses repeating one version, so it receives 0 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "b",
        "text": "Switch what I'm doing once.",
        "weights": {
          "chaos": 1,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Switch what I'm doing once.\" expresses small amounts of variation, so it receives 1 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "c",
        "text": "Switch things up a few times.",
        "weights": {
          "chaos": 2,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Switch things up a few times.\" expresses frequent variation, so it receives 2 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "d",
        "text": "Do a different thing at each chance.",
        "weights": {
          "chaos": 3,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Do a different thing at each chance.\" expresses variation on nearly every turn, so it receives 3 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "waiting_choice",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Potential attention and situational-constraint confounds; ask about chosen variety, not inability to continue."
  },
  {
    "id": "chaos_015",
    "version": 1,
    "dimension": "chaos",
    "facet": "playful_remixing",
    "prompt": "You're retelling a made-up story you know. How much would you usually remix the ending?",
    "context": "stories",
    "options": [
      {
        "id": "a",
        "text": "Leave the original ending intact.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Leave the original ending intact.\" expresses keeping an existing idea, so it receives 0 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "b",
        "text": "Tweak one tiny detail.",
        "weights": {
          "chaos": 1,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Tweak one tiny detail.\" expresses changing a small part, so it receives 1 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "c",
        "text": "Change a few parts of the ending.",
        "weights": {
          "chaos": 2,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Change a few parts of the ending.\" expresses changing several parts, so it receives 2 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "d",
        "text": "Give it a whole different ending.",
        "weights": {
          "chaos": 3,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Give it a whole different ending.\" expresses making a substantially different version, so it receives 3 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "story_ending",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Retelling is explicitly fictional; do not associate changing stories with dishonesty."
  },
  {
    "id": "chaos_016",
    "version": 1,
    "dimension": "chaos",
    "facet": "playful_remixing",
    "prompt": "Everyone's agreed: this game can get a just-for-fun rules remix. What's your usual pick?",
    "context": "games",
    "options": [
      {
        "id": "a",
        "text": "Play with the original rules.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Play with the original rules.\" expresses keeping an existing idea, so it receives 0 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "b",
        "text": "Tweak one little rule.",
        "weights": {
          "chaos": 1,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Tweak one little rule.\" expresses changing a small part, so it receives 1 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "c",
        "text": "Tweak several rules.",
        "weights": {
          "chaos": 2,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Tweak several rules.\" expresses changing several parts, so it receives 2 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "d",
        "text": "Turn it into a very different version.",
        "weights": {
          "chaos": 3,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Turn it into a very different version.\" expresses making a substantially different version, so it receives 3 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "rule_remix",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Consent is fixed in the prompt; changing rules must not imply cheating or disregard for others."
  },
  {
    "id": "chaos_017",
    "version": 1,
    "dimension": "chaos",
    "facet": "playful_remixing",
    "prompt": "A made-up creature is getting a redraw. It has zero design requests. What's your usual move?",
    "context": "creative",
    "options": [
      {
        "id": "a",
        "text": "Keep its original look.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Keep its original look.\" expresses keeping an existing idea, so it receives 0 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "b",
        "text": "Tweak one little feature.",
        "weights": {
          "chaos": 1,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Tweak one little feature.\" expresses changing a small part, so it receives 1 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "c",
        "text": "Rework several features.",
        "weights": {
          "chaos": 2,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Rework several features.\" expresses changing several parts, so it receives 2 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "d",
        "text": "Give it an entirely different look.",
        "weights": {
          "chaos": 3,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Give it an entirely different look.\" expresses making a substantially different version, so it receives 3 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "picture_choice",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Score chosen departure from a model, not drawing quality or originality judged by others."
  },
  {
    "id": "chaos_018",
    "version": 1,
    "dimension": "chaos",
    "facet": "playful_remixing",
    "prompt": "You're inventing a room. Gravity is optional for the furniture. What's your usual design vibe?",
    "context": "everyday",
    "options": [
      {
        "id": "a",
        "text": "A room that works like a real one.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A room that works like a real one.\" expresses keeping an existing idea, so it receives 0 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "b",
        "text": "One object gets an unusual twist.",
        "weights": {
          "chaos": 1,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"One object gets an unusual twist.\" expresses changing a small part, so it receives 1 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "c",
        "text": "Several objects get unusual twists.",
        "weights": {
          "chaos": 2,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Several objects get unusual twists.\" expresses changing several parts, so it receives 2 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "d",
        "text": "The whole room works differently.",
        "weights": {
          "chaos": 3,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"The whole room works differently.\" expresses making a substantially different version, so it receives 3 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "pretend_room",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Check gravity is understood; room is imaginary and does not presume a private bedroom."
  },
  {
    "id": "chaos_019",
    "version": 1,
    "dimension": "chaos",
    "facet": "playful_remixing",
    "prompt": "Your group can remix a familiar rhyme for fun. How far do you usually want to take it?",
    "context": "group_activity",
    "options": [
      {
        "id": "a",
        "text": "Keep the original rhyme.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Keep the original rhyme.\" expresses keeping an existing idea, so it receives 0 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "b",
        "text": "Change just one word.",
        "weights": {
          "chaos": 1,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Change just one word.\" expresses changing a small part, so it receives 1 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "c",
        "text": "Rewrite several lines.",
        "weights": {
          "chaos": 2,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Rewrite several lines.\" expresses changing several parts, so it receives 2 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "d",
        "text": "Make it a very different rhyme.",
        "weights": {
          "chaos": 3,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Make it a very different rhyme.\" expresses making a substantially different version, so it receives 3 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "rhyme_remix",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Requires only a preference, not rhyme production; review across language and schooling backgrounds."
  },
  {
    "id": "chaos_020",
    "version": 1,
    "dimension": "chaos",
    "facet": "playful_remixing",
    "prompt": "A friend gives an everyday object a pretend job. What kind of job usually sounds fun?",
    "context": "friends",
    "options": [
      {
        "id": "a",
        "text": "The same job it normally does.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"The same job it normally does.\" expresses keeping an existing idea, so it receives 0 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "b",
        "text": "Its normal job with one small twist.",
        "weights": {
          "chaos": 1,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Its normal job with one small twist.\" expresses changing a small part, so it receives 1 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "c",
        "text": "A job mostly unlike its normal one.",
        "weights": {
          "chaos": 2,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A job mostly unlike its normal one.\" expresses changing several parts, so it receives 2 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      },
      {
        "id": "d",
        "text": "A job completely unlike its normal one.",
        "weights": {
          "chaos": 3,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A job completely unlike its normal one.\" expresses making a substantially different version, so it receives 3 on chaos. Other dimensions are unscored by this item. This does not score risk-taking, rule-breaking, attention, or creative ability."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "pretend_object",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Could reflect imaginative-play interest that changes with age; require comprehension and age-DIF review."
  },
  {
    "id": "chill_001",
    "version": 1,
    "dimension": "chill",
    "facet": "activity_pace",
    "prompt": "You're making a picture for fun. The clock can mind its business. What pace usually suits you?",
    "context": "creative",
    "options": [
      {
        "id": "a",
        "text": "A lively, quick pace.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A lively, quick pace.\" expresses a brisk pace, so it receives 0 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "b",
        "text": "A somewhat quick pace.",
        "weights": {
          "chaos": 0,
          "chill": 1,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A somewhat quick pace.\" expresses a fairly brisk pace, so it receives 1 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "c",
        "text": "A somewhat slow pace.",
        "weights": {
          "chaos": 0,
          "chill": 2,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A somewhat slow pace.\" expresses a fairly unhurried pace, so it receives 2 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "d",
        "text": "A very unhurried pace.",
        "weights": {
          "chaos": 0,
          "chill": 3,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A very unhurried pace.\" expresses an unhurried pace, so it receives 3 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "picture_pace",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Preference only: do not time drawing or infer motor ability, effort, or picture quality."
  },
  {
    "id": "chill_002",
    "version": 1,
    "dimension": "chill",
    "facet": "activity_pace",
    "prompt": "Pretend animals need names. How fast do you usually like this naming session to roll?",
    "context": "learning",
    "options": [
      {
        "id": "a",
        "text": "Quick and lively.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Quick and lively.\" expresses a brisk pace, so it receives 0 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "b",
        "text": "Somewhat quick.",
        "weights": {
          "chaos": 0,
          "chill": 1,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Somewhat quick.\" expresses a fairly brisk pace, so it receives 1 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "c",
        "text": "Somewhat slow.",
        "weights": {
          "chaos": 0,
          "chill": 2,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Somewhat slow.\" expresses a fairly unhurried pace, so it receives 2 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "d",
        "text": "Very unhurried.",
        "weights": {
          "chaos": 0,
          "chill": 3,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Very unhurried.\" expresses an unhurried pace, so it receives 3 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "animal_topic",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. No real animal knowledge or speed of producing names is scored; test the word roomy."
  },
  {
    "id": "chill_003",
    "version": 1,
    "dimension": "chill",
    "facet": "activity_pace",
    "prompt": "Solo word game. No timer, no trophy, just vibes. What's your usual preferred pace?",
    "context": "games",
    "options": [
      {
        "id": "a",
        "text": "Keep it quick.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Keep it quick.\" expresses a brisk pace, so it receives 0 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "b",
        "text": "Go somewhat quickly.",
        "weights": {
          "chaos": 0,
          "chill": 1,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Go somewhat quickly.\" expresses a fairly brisk pace, so it receives 1 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "c",
        "text": "Go somewhat slowly.",
        "weights": {
          "chaos": 0,
          "chill": 2,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Go somewhat slowly.\" expresses a fairly unhurried pace, so it receives 2 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "d",
        "text": "Take it very unhurriedly.",
        "weights": {
          "chaos": 0,
          "chill": 3,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Take it very unhurriedly.\" expresses an unhurried pace, so it receives 3 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "word_rounds",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Must be read as preferred tempo, not reading speed, vocabulary, or success at the game."
  },
  {
    "id": "chill_004",
    "version": 1,
    "dimension": "chill",
    "facet": "activity_pace",
    "prompt": "You're telling a short story you made up. What delivery speed do you usually enjoy?",
    "context": "stories",
    "options": [
      {
        "id": "a",
        "text": "Quick and lively storytelling.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Quick and lively storytelling.\" expresses a brisk pace, so it receives 0 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "b",
        "text": "Somewhat quick storytelling.",
        "weights": {
          "chaos": 0,
          "chill": 1,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Somewhat quick storytelling.\" expresses a fairly brisk pace, so it receives 1 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "c",
        "text": "Somewhat slow storytelling.",
        "weights": {
          "chaos": 0,
          "chill": 2,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Somewhat slow storytelling.\" expresses a fairly unhurried pace, so it receives 2 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "d",
        "text": "Very unhurried storytelling.",
        "weights": {
          "chaos": 0,
          "chill": 3,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Very unhurried storytelling.\" expresses an unhurried pace, so it receives 3 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "telling_story",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Potential speech or language confound; ask about preferred storytelling rhythm, not fluency."
  },
  {
    "id": "chill_005",
    "version": 1,
    "dimension": "chill",
    "facet": "activity_pace",
    "prompt": "You're passing a wait by naming imaginary places. How fast do you usually like names to come?",
    "context": "waiting",
    "options": [
      {
        "id": "a",
        "text": "A quick flow of names.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A quick flow of names.\" expresses a brisk pace, so it receives 0 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "b",
        "text": "A somewhat quick flow.",
        "weights": {
          "chaos": 0,
          "chill": 1,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A somewhat quick flow.\" expresses a fairly brisk pace, so it receives 1 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "c",
        "text": "A somewhat slow flow.",
        "weights": {
          "chaos": 0,
          "chill": 2,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A somewhat slow flow.\" expresses a fairly unhurried pace, so it receives 2 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "d",
        "text": "A very unhurried flow.",
        "weights": {
          "chaos": 0,
          "chill": 3,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A very unhurried flow.\" expresses an unhurried pace, so it receives 3 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "waiting_imagination",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. No number of generated names is measured; naming fluency must not become the basis for scoring."
  },
  {
    "id": "chill_006",
    "version": 1,
    "dimension": "chill",
    "facet": "activity_pace",
    "prompt": "A few objects, one just-for-fun pattern. What arranging pace usually feels right?",
    "context": "everyday",
    "options": [
      {
        "id": "a",
        "text": "Quick and lively arranging.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Quick and lively arranging.\" expresses a brisk pace, so it receives 0 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "b",
        "text": "Somewhat quick arranging.",
        "weights": {
          "chaos": 0,
          "chill": 1,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Somewhat quick arranging.\" expresses a fairly brisk pace, so it receives 1 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "c",
        "text": "Somewhat slow arranging.",
        "weights": {
          "chaos": 0,
          "chill": 2,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Somewhat slow arranging.\" expresses a fairly unhurried pace, so it receives 2 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "d",
        "text": "Very unhurried arranging.",
        "weights": {
          "chaos": 0,
          "chill": 3,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Very unhurried arranging.\" expresses an unhurried pace, so it receives 3 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "object_pattern",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Accessible alternatives should be offered; distinguish preferred pace from physical movement speed."
  },
  {
    "id": "chill_007",
    "version": 1,
    "dimension": "chill",
    "facet": "activity_pace",
    "prompt": "You and a friend are making up a silly chant. What's your usual preferred beat?",
    "context": "friends",
    "options": [
      {
        "id": "a",
        "text": "A quick beat.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A quick beat.\" expresses a brisk pace, so it receives 0 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "b",
        "text": "A somewhat quick beat.",
        "weights": {
          "chaos": 0,
          "chill": 1,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A somewhat quick beat.\" expresses a fairly brisk pace, so it receives 1 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "c",
        "text": "A somewhat slow beat.",
        "weights": {
          "chaos": 0,
          "chill": 2,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A somewhat slow beat.\" expresses a fairly unhurried pace, so it receives 2 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "d",
        "text": "A very unhurried beat.",
        "weights": {
          "chaos": 0,
          "chill": 3,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A very unhurried beat.\" expresses an unhurried pace, so it receives 3 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "chant_pace",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Music familiarity and speech differences may matter; review whether a rhythm preference generalizes to tempo."
  },
  {
    "id": "chill_008",
    "version": 1,
    "dimension": "chill",
    "facet": "transition_spacing",
    "prompt": "Game round done. Everyone's fine with any pace. What's your usual next-round timing?",
    "context": "games",
    "options": [
      {
        "id": "a",
        "text": "Roll straight into the next round.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Roll straight into the next round.\" expresses moving straight to the next activity, so it receives 0 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "b",
        "text": "Take a tiny pause first.",
        "weights": {
          "chaos": 0,
          "chill": 1,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Take a tiny pause first.\" expresses a short gap between activities, so it receives 1 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "c",
        "text": "Take a moderate pause first.",
        "weights": {
          "chaos": 0,
          "chill": 2,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Take a moderate pause first.\" expresses a moderate gap between activities, so it receives 2 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "d",
        "text": "Take a long, unhurried pause first.",
        "weights": {
          "chaos": 0,
          "chill": 3,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Take a long, unhurried pause first.\" expresses a spacious gap between activities, so it receives 3 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "round_gap",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Pause preference only; no fatigue, losing, or need to recover is implied."
  },
  {
    "id": "chill_009",
    "version": 1,
    "dimension": "chill",
    "facet": "transition_spacing",
    "prompt": "One little picture finished, another planned. What gap between them usually feels good?",
    "context": "creative",
    "options": [
      {
        "id": "a",
        "text": "Start the next picture right away.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Start the next picture right away.\" expresses moving straight to the next activity, so it receives 0 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "b",
        "text": "Take a tiny pause.",
        "weights": {
          "chaos": 0,
          "chill": 1,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Take a tiny pause.\" expresses a short gap between activities, so it receives 1 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "c",
        "text": "Take a moderate pause.",
        "weights": {
          "chaos": 0,
          "chill": 2,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Take a moderate pause.\" expresses a moderate gap between activities, so it receives 2 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "d",
        "text": "Take a long, unhurried pause.",
        "weights": {
          "chaos": 0,
          "chill": 3,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Take a long, unhurried pause.\" expresses a spacious gap between activities, so it receives 3 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "picture_pace",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Keep content and number of pictures constant; do not score variation or persistence."
  },
  {
    "id": "chill_010",
    "version": 1,
    "dimension": "chill",
    "facet": "transition_spacing",
    "prompt": "Story finished. The next one's ready to go. What's your usual gap preference?",
    "context": "stories",
    "options": [
      {
        "id": "a",
        "text": "Next story, straight away.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Next story, straight away.\" expresses moving straight to the next activity, so it receives 0 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "b",
        "text": "A tiny pause between stories.",
        "weights": {
          "chaos": 0,
          "chill": 1,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A tiny pause between stories.\" expresses a short gap between activities, so it receives 1 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "c",
        "text": "A moderate pause between stories.",
        "weights": {
          "chaos": 0,
          "chill": 2,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A moderate pause between stories.\" expresses a moderate gap between activities, so it receives 2 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "d",
        "text": "A long, unhurried pause between stories.",
        "weights": {
          "chaos": 0,
          "chill": 3,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A long, unhurried pause between stories.\" expresses a spacious gap between activities, so it receives 3 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "story_gap",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Check whether pauses are chosen for pace rather than a requirement to understand the story."
  },
  {
    "id": "chill_011",
    "version": 1,
    "dimension": "chill",
    "facet": "transition_spacing",
    "prompt": "You and a friend finish one activity. The next is ready when you are. What's your usual timing?",
    "context": "friends",
    "options": [
      {
        "id": "a",
        "text": "Start the next thing right away.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Start the next thing right away.\" expresses moving straight to the next activity, so it receives 0 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "b",
        "text": "Leave a tiny pause first.",
        "weights": {
          "chaos": 0,
          "chill": 1,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Leave a tiny pause first.\" expresses a short gap between activities, so it receives 1 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "c",
        "text": "Leave a moderate pause first.",
        "weights": {
          "chaos": 0,
          "chill": 2,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Leave a moderate pause first.\" expresses a moderate gap between activities, so it receives 2 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "d",
        "text": "Leave a long, unhurried break first.",
        "weights": {
          "chaos": 0,
          "chill": 3,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Leave a long, unhurried break first.\" expresses a spacious gap between activities, so it receives 3 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "friend_transition",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. All activities equally appealing; distinguish transition spacing from disliking the next activity."
  },
  {
    "id": "chill_012",
    "version": 1,
    "dimension": "chill",
    "facet": "transition_spacing",
    "prompt": "Your group has a lineup of short activities. What gaps do you usually like between them?",
    "context": "group_activity",
    "options": [
      {
        "id": "a",
        "text": "Go directly from one to the next.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Go directly from one to the next.\" expresses moving straight to the next activity, so it receives 0 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "b",
        "text": "Very short pauses.",
        "weights": {
          "chaos": 0,
          "chill": 1,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Very short pauses.\" expresses a short gap between activities, so it receives 1 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "c",
        "text": "Moderate pauses.",
        "weights": {
          "chaos": 0,
          "chill": 2,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Moderate pauses.\" expresses a moderate gap between activities, so it receives 2 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "d",
        "text": "Long, unhurried pauses.",
        "weights": {
          "chaos": 0,
          "chill": 3,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Long, unhurried pauses.\" expresses a spacious gap between activities, so it receives 3 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "group_transition",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Ask about chosen pacing, not need for disability accommodations; test moderate and unhurried."
  },
  {
    "id": "chill_013",
    "version": 1,
    "dimension": "chill",
    "facet": "transition_spacing",
    "prompt": "One interesting topic explored. Another's ready. What gap do you usually prefer?",
    "context": "learning",
    "options": [
      {
        "id": "a",
        "text": "Next topic right away.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Next topic right away.\" expresses moving straight to the next activity, so it receives 0 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "b",
        "text": "A tiny pause before the next topic.",
        "weights": {
          "chaos": 0,
          "chill": 1,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A tiny pause before the next topic.\" expresses a short gap between activities, so it receives 1 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "c",
        "text": "A moderate pause before the next topic.",
        "weights": {
          "chaos": 0,
          "chill": 2,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A moderate pause before the next topic.\" expresses a moderate gap between activities, so it receives 2 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "d",
        "text": "A long, unhurried pause before the next topic.",
        "weights": {
          "chaos": 0,
          "chill": 3,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A long, unhurried pause before the next topic.\" expresses a spacious gap between activities, so it receives 3 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "learning_topics",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Possible processing-time confound; comprehension interviews must separate enjoyment from need."
  },
  {
    "id": "chill_014",
    "version": 1,
    "dimension": "chill",
    "facet": "transition_spacing",
    "prompt": "Two easy things you'd enjoy today. What spacing usually feels best?",
    "context": "everyday",
    "options": [
      {
        "id": "a",
        "text": "One straight after the other.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"One straight after the other.\" expresses moving straight to the next activity, so it receives 0 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "b",
        "text": "A tiny pause between them.",
        "weights": {
          "chaos": 0,
          "chill": 1,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A tiny pause between them.\" expresses a short gap between activities, so it receives 1 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "c",
        "text": "A moderate pause between them.",
        "weights": {
          "chaos": 0,
          "chill": 2,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A moderate pause between them.\" expresses a moderate gap between activities, so it receives 2 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "d",
        "text": "A long, unhurried pause between them.",
        "weights": {
          "chaos": 0,
          "chill": 3,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A long, unhurried pause between them.\" expresses a spacious gap between activities, so it receives 3 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "free_choice",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. No obligations or deadline are present; high scores must not be labeled lazy or low-energy."
  },
  {
    "id": "chill_015",
    "version": 1,
    "dimension": "chill",
    "facet": "event_pace",
    "prompt": "Silly group guessing game, no winners needed. How do you usually like the rounds to flow?",
    "context": "group_activity",
    "options": [
      {
        "id": "a",
        "text": "Quick rounds, one after another.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Quick rounds, one after another.\" expresses events unfolding briskly, so it receives 0 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "b",
        "text": "Somewhat quick rounds.",
        "weights": {
          "chaos": 0,
          "chill": 1,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Somewhat quick rounds.\" expresses events unfolding fairly briskly, so it receives 1 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "c",
        "text": "Somewhat slow rounds.",
        "weights": {
          "chaos": 0,
          "chill": 2,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Somewhat slow rounds.\" expresses events unfolding fairly slowly, so it receives 2 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "d",
        "text": "Very unhurried rounds, with lots of space.",
        "weights": {
          "chaos": 0,
          "chill": 3,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Very unhurried rounds, with lots of space.\" expresses events unfolding slowly, so it receives 3 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "round_gap",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. No time pressure, correctness, or competition; potential overlap with transition_spacing is intentional to test."
  },
  {
    "id": "chill_016",
    "version": 1,
    "dimension": "chill",
    "facet": "event_pace",
    "prompt": "You're listening to a made-up adventure. How fast do you usually like events to land?",
    "context": "stories",
    "options": [
      {
        "id": "a",
        "text": "Events arrive quickly.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Events arrive quickly.\" expresses events unfolding briskly, so it receives 0 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "b",
        "text": "Events arrive somewhat quickly.",
        "weights": {
          "chaos": 0,
          "chill": 1,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Events arrive somewhat quickly.\" expresses events unfolding fairly briskly, so it receives 1 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "c",
        "text": "Events arrive somewhat slowly.",
        "weights": {
          "chaos": 0,
          "chill": 2,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Events arrive somewhat slowly.\" expresses events unfolding fairly slowly, so it receives 2 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "d",
        "text": "Events arrive very unhurriedly.",
        "weights": {
          "chaos": 0,
          "chill": 3,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Events arrive very unhurriedly.\" expresses events unfolding slowly, so it receives 3 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "story_choice",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Hold story complexity separate from pace; may reflect media preference rather than cross-context tempo."
  },
  {
    "id": "chill_017",
    "version": 1,
    "dimension": "chill",
    "facet": "event_pace",
    "prompt": "Friends are trading funny made-up examples. What's your usual preferred rhythm?",
    "context": "friends",
    "options": [
      {
        "id": "a",
        "text": "A quick exchange.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A quick exchange.\" expresses events unfolding briskly, so it receives 0 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "b",
        "text": "A somewhat quick exchange.",
        "weights": {
          "chaos": 0,
          "chill": 1,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A somewhat quick exchange.\" expresses events unfolding fairly briskly, so it receives 1 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "c",
        "text": "A somewhat slow exchange.",
        "weights": {
          "chaos": 0,
          "chill": 2,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A somewhat slow exchange.\" expresses events unfolding fairly slowly, so it receives 2 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "d",
        "text": "A very unhurried exchange.",
        "weights": {
          "chaos": 0,
          "chill": 3,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A very unhurried exchange.\" expresses events unfolding slowly, so it receives 3 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "chat_rhythm",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. The amount each person contributes is fixed; do not score talking volume or social confidence."
  },
  {
    "id": "chill_018",
    "version": 1,
    "dimension": "chill",
    "facet": "event_pace",
    "prompt": "Someone's doing a simple paper trick you already know, just for fun. What's your usual viewing pace?",
    "context": "learning",
    "options": [
      {
        "id": "a",
        "text": "A quick run-through.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A quick run-through.\" expresses events unfolding briskly, so it receives 0 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "b",
        "text": "A somewhat quick run-through.",
        "weights": {
          "chaos": 0,
          "chill": 1,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A somewhat quick run-through.\" expresses events unfolding fairly briskly, so it receives 1 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "c",
        "text": "A somewhat slow run-through.",
        "weights": {
          "chaos": 0,
          "chill": 2,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A somewhat slow run-through.\" expresses events unfolding fairly slowly, so it receives 2 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "d",
        "text": "A very unhurried run-through.",
        "weights": {
          "chaos": 0,
          "chill": 3,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A very unhurried run-through.\" expresses events unfolding slowly, so it receives 3 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "paper_demo",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. The trick is already understood. Still check whether processing needs, rather than preferred event pace, drive answers."
  },
  {
    "id": "chill_019",
    "version": 1,
    "dimension": "chill",
    "facet": "event_pace",
    "prompt": "A drawing game reveals a picture bit by bit. How fast do you usually like the reveal?",
    "context": "games",
    "options": [
      {
        "id": "a",
        "text": "Bits appear quickly.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Bits appear quickly.\" expresses events unfolding briskly, so it receives 0 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "b",
        "text": "Bits appear somewhat quickly.",
        "weights": {
          "chaos": 0,
          "chill": 1,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Bits appear somewhat quickly.\" expresses events unfolding fairly briskly, so it receives 1 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "c",
        "text": "Bits appear somewhat slowly.",
        "weights": {
          "chaos": 0,
          "chill": 2,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Bits appear somewhat slowly.\" expresses events unfolding fairly slowly, so it receives 2 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "d",
        "text": "Bits appear very unhurriedly.",
        "weights": {
          "chaos": 0,
          "chill": 3,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Bits appear very unhurriedly.\" expresses events unfolding slowly, so it receives 3 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "picture_reveal",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Ask about enjoyment, not time needed to identify the picture; no correct guesses collected."
  },
  {
    "id": "chill_020",
    "version": 1,
    "dimension": "chill",
    "facet": "event_pace",
    "prompt": "Paper characters, pretend scene. What speed do you usually like for the action?",
    "context": "creative",
    "options": [
      {
        "id": "a",
        "text": "Quick and lively action.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Quick and lively action.\" expresses events unfolding briskly, so it receives 0 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "b",
        "text": "Somewhat quick action.",
        "weights": {
          "chaos": 0,
          "chill": 1,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Somewhat quick action.\" expresses events unfolding fairly briskly, so it receives 1 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "c",
        "text": "Somewhat slow action.",
        "weights": {
          "chaos": 0,
          "chill": 2,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Somewhat slow action.\" expresses events unfolding fairly slowly, so it receives 2 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      },
      {
        "id": "d",
        "text": "Very unhurried action.",
        "weights": {
          "chaos": 0,
          "chill": 3,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Very unhurried action.\" expresses events unfolding slowly, so it receives 3 on chill. Other dimensions are unscored by this item. This does not score emotional stability, health, effort, or actual performance speed."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "paper_scene",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. May overlap with story or play interest across age; all scenes remain imaginary and low-stakes."
  },
  {
    "id": "brain_001",
    "version": 1,
    "dimension": "brain",
    "facet": "advance_planning",
    "prompt": "Tiny paper model, purely for fun. Before you start, how much do you usually map out?",
    "context": "creative",
    "options": [
      {
        "id": "a",
        "text": "Work out each part as I go.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Work out each part as I go.\" expresses deciding as an activity unfolds, so it receives 0 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "b",
        "text": "Decide only the first part ahead.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 1,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Decide only the first part ahead.\" expresses a little advance planning, so it receives 1 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "c",
        "text": "Decide most parts ahead.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 2,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Decide most parts ahead.\" expresses planning most of an activity ahead, so it receives 2 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "d",
        "text": "Decide the whole model ahead.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 3,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Decide the whole model ahead.\" expresses planning the whole activity ahead, so it receives 3 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "paper_build",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. No quality judgment; planning is not treated as better than discovering a design while making it."
  },
  {
    "id": "brain_002",
    "version": 1,
    "dimension": "brain",
    "facet": "advance_planning",
    "prompt": "A few free-time activities are waiting. How much do you usually plan before you dive in?",
    "context": "everyday",
    "options": [
      {
        "id": "a",
        "text": "Pick each activity as it comes.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Pick each activity as it comes.\" expresses deciding as an activity unfolds, so it receives 0 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "b",
        "text": "Pick just the first activity ahead.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 1,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Pick just the first activity ahead.\" expresses a little advance planning, so it receives 1 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "c",
        "text": "Pick most activities ahead.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 2,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Pick most activities ahead.\" expresses planning most of an activity ahead, so it receives 2 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "d",
        "text": "Pick every activity ahead.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 3,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Pick every activity ahead.\" expresses planning the whole activity ahead, so it receives 3 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "free_choice",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. All choices are feasible and low-stakes; distinguish planning from availability of free time."
  },
  {
    "id": "brain_003",
    "version": 1,
    "dimension": "brain",
    "facet": "advance_planning",
    "prompt": "You're telling an imaginary adventure. Zero real dragons required. How much do you usually decide first?",
    "context": "stories",
    "options": [
      {
        "id": "a",
        "text": "Let it unfold while I tell it.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Let it unfold while I tell it.\" expresses deciding as an activity unfolds, so it receives 0 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "b",
        "text": "Decide only the opening first.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 1,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Decide only the opening first.\" expresses a little advance planning, so it receives 1 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "c",
        "text": "Decide most of the story first.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 2,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Decide most of the story first.\" expresses planning most of an activity ahead, so it receives 2 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "d",
        "text": "Decide the entire story first.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 3,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Decide the entire story first.\" expresses planning the whole activity ahead, so it receives 3 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "telling_story",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Do not infer verbal ability or imaginative quality from advance planning."
  },
  {
    "id": "brain_004",
    "version": 1,
    "dimension": "brain",
    "facet": "advance_planning",
    "prompt": "You and a friend are inventing a game. How much do you usually want settled before turn one?",
    "context": "friends",
    "options": [
      {
        "id": "a",
        "text": "Just enough for the first turn.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Just enough for the first turn.\" expresses deciding as an activity unfolds, so it receives 0 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "b",
        "text": "A few game details.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 1,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A few game details.\" expresses a little advance planning, so it receives 1 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "c",
        "text": "Most game details.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 2,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Most game details.\" expresses planning most of an activity ahead, so it receives 2 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "d",
        "text": "The complete game.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 3,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"The complete game.\" expresses planning the whole activity ahead, so it receives 3 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "rule_remix",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Consent and safety rules are fixed outside the item; do not score fairness or rule compliance."
  },
  {
    "id": "brain_005",
    "version": 1,
    "dimension": "brain",
    "facet": "advance_planning",
    "prompt": "An interesting topic is yours to explore. What's your usual plan before the deep dive?",
    "context": "learning",
    "options": [
      {
        "id": "a",
        "text": "Pick what to explore along the way.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Pick what to explore along the way.\" expresses deciding as an activity unfolds, so it receives 0 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "b",
        "text": "Pick only my starting point.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 1,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Pick only my starting point.\" expresses a little advance planning, so it receives 1 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "c",
        "text": "Pick most things to explore ahead.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 2,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Pick most things to explore ahead.\" expresses planning most of an activity ahead, so it receives 2 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "d",
        "text": "Pick everything to explore ahead.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 3,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Pick everything to explore ahead.\" expresses planning the whole activity ahead, so it receives 3 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "learning_plan",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Measures preparation, not knowledge, curiosity, academic achievement, or persistence."
  },
  {
    "id": "brain_006",
    "version": 1,
    "dimension": "brain",
    "facet": "advance_planning",
    "prompt": "Your group is making a pretend banner. How much design do you usually want agreed first?",
    "context": "group_activity",
    "options": [
      {
        "id": "a",
        "text": "Let the design develop as we make it.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Let the design develop as we make it.\" expresses deciding as an activity unfolds, so it receives 0 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "b",
        "text": "Agree on one design part.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 1,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Agree on one design part.\" expresses a little advance planning, so it receives 1 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "c",
        "text": "Agree on most of the design.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 2,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Agree on most of the design.\" expresses planning most of an activity ahead, so it receives 2 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "d",
        "text": "Agree on the complete design.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 3,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Agree on the complete design.\" expresses planning the whole activity ahead, so it receives 3 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "group_banner",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Do not infer who leads or whose ideas are used; preference about preparation only."
  },
  {
    "id": "brain_007",
    "version": 1,
    "dimension": "brain",
    "facet": "advance_planning",
    "prompt": "You're setting up a game just for fun. How much do you usually settle before starting?",
    "context": "games",
    "options": [
      {
        "id": "a",
        "text": "Work out the setup along the way.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Work out the setup along the way.\" expresses deciding as an activity unfolds, so it receives 0 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "b",
        "text": "Settle only the first setup part.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 1,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Settle only the first setup part.\" expresses a little advance planning, so it receives 1 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "c",
        "text": "Settle most of the setup ahead.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 2,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Settle most of the setup ahead.\" expresses planning most of an activity ahead, so it receives 2 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "d",
        "text": "Settle all of the setup ahead.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 3,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Settle all of the setup ahead.\" expresses planning the whole activity ahead, so it receives 3 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "game_setup",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Supplies and any safety rules are given; score preferred advance preparation, not strategy or game success."
  },
  {
    "id": "brain_008",
    "version": 1,
    "dimension": "brain",
    "facet": "step_structure",
    "prompt": "You're making something with several equally easy parts. What's your usual order strategy?",
    "context": "creative",
    "options": [
      {
        "id": "a",
        "text": "Pick the next part along the way.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Pick the next part along the way.\" expresses choosing the order along the way, so it receives 0 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "b",
        "text": "Pick part one, leave the rest open.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 1,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Pick part one, leave the rest open.\" expresses a loosely defined order, so it receives 1 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "c",
        "text": "Order most parts before starting.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 2,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Order most parts before starting.\" expresses a mostly defined order, so it receives 2 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "d",
        "text": "Order every part before starting.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 3,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Order every part before starting.\" expresses a fully defined order, so it receives 3 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "paper_build",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Distinguish sequence preference from need to follow mandatory instructions."
  },
  {
    "id": "brain_009",
    "version": 1,
    "dimension": "brain",
    "facet": "step_structure",
    "prompt": "A few fun things, a patch of free time. How do you usually line them up?",
    "context": "everyday",
    "options": [
      {
        "id": "a",
        "text": "Pick the next thing in the moment.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Pick the next thing in the moment.\" expresses choosing the order along the way, so it receives 0 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "b",
        "text": "Pick the first, keep the rest open.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 1,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Pick the first, keep the rest open.\" expresses a loosely defined order, so it receives 1 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "c",
        "text": "Give most things a set order.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 2,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Give most things a set order.\" expresses a mostly defined order, so it receives 2 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "d",
        "text": "Give everything a set order.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 3,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Give everything a set order.\" expresses a fully defined order, so it receives 3 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "free_choice",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Possible overlap with advance_planning; verify these content facets do not create redundant items."
  },
  {
    "id": "brain_010",
    "version": 1,
    "dimension": "brain",
    "facet": "step_structure",
    "prompt": "A topic has a few easy questions to explore. What's your usual question order?",
    "context": "learning",
    "options": [
      {
        "id": "a",
        "text": "Pick each next question as I go.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Pick each next question as I go.\" expresses choosing the order along the way, so it receives 0 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "b",
        "text": "Pick the first, leave the rest open.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 1,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Pick the first, leave the rest open.\" expresses a loosely defined order, so it receives 1 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "c",
        "text": "Order most questions ahead.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 2,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Order most questions ahead.\" expresses a mostly defined order, so it receives 2 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "d",
        "text": "Order all questions ahead.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 3,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Order all questions ahead.\" expresses a fully defined order, so it receives 3 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "learning_plan",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. No correct answer, grades, or required curriculum; sequence is a preference, not achievement."
  },
  {
    "id": "brain_011",
    "version": 1,
    "dimension": "brain",
    "facet": "step_structure",
    "prompt": "You and a friend are adding to a picture, turn by turn. What order do you usually prefer?",
    "context": "friends",
    "options": [
      {
        "id": "a",
        "text": "Choose each part when its turn arrives.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Choose each part when its turn arrives.\" expresses choosing the order along the way, so it receives 0 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "b",
        "text": "Choose the first part, keep the rest open.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 1,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Choose the first part, keep the rest open.\" expresses a loosely defined order, so it receives 1 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "c",
        "text": "Set the order for most parts.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 2,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Set the order for most parts.\" expresses a mostly defined order, so it receives 2 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "d",
        "text": "Set the order for every part.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 3,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Set the order for every part.\" expresses a fully defined order, so it receives 3 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "picture_turns",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Turn fairness is constant; score structure of picture-building, not amount of social participation."
  },
  {
    "id": "brain_012",
    "version": 1,
    "dimension": "brain",
    "facet": "step_structure",
    "prompt": "Your group has a few silly challenges lined up. How do you usually want to pick the order?",
    "context": "group_activity",
    "options": [
      {
        "id": "a",
        "text": "Pick each next challenge in the moment.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Pick each next challenge in the moment.\" expresses choosing the order along the way, so it receives 0 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "b",
        "text": "Pick the first, leave the rest open.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 1,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Pick the first, leave the rest open.\" expresses a loosely defined order, so it receives 1 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "c",
        "text": "Give most challenges a set order.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 2,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Give most challenges a set order.\" expresses a mostly defined order, so it receives 2 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "d",
        "text": "Give every challenge a set order.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 3,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Give every challenge a set order.\" expresses a fully defined order, so it receives 3 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "group_transition",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Challenges are optional, equally accessible and noncompetitive; not compliance or leadership."
  },
  {
    "id": "brain_013",
    "version": 1,
    "dimension": "brain",
    "facet": "step_structure",
    "prompt": "You're inventing scenes for a pretend story. How much do you usually set their order?",
    "context": "stories",
    "options": [
      {
        "id": "a",
        "text": "Choose each next scene as I go.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Choose each next scene as I go.\" expresses choosing the order along the way, so it receives 0 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "b",
        "text": "Set scene one, leave the rest open.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 1,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Set scene one, leave the rest open.\" expresses a loosely defined order, so it receives 1 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "c",
        "text": "Set the order for most scenes.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 2,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Set the order for most scenes.\" expresses a mostly defined order, so it receives 2 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "d",
        "text": "Set the order for every scene.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 3,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Set the order for every scene.\" expresses a fully defined order, so it receives 3 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "story_places",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Could be redundant with story advance planning; overlap tag prevents same-session repetition."
  },
  {
    "id": "brain_014",
    "version": 1,
    "dimension": "brain",
    "facet": "step_structure",
    "prompt": "A wait to fill, a few little activities to try. How do you usually choose what comes next?",
    "context": "waiting",
    "options": [
      {
        "id": "a",
        "text": "Choose each one in the moment.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Choose each one in the moment.\" expresses choosing the order along the way, so it receives 0 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "b",
        "text": "Choose the first, keep the rest open.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 1,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Choose the first, keep the rest open.\" expresses a loosely defined order, so it receives 1 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "c",
        "text": "Put most of them in a set order.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 2,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Put most of them in a set order.\" expresses a mostly defined order, so it receives 2 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "d",
        "text": "Put all of them in a set order.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 3,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Put all of them in a set order.\" expresses a fully defined order, so it receives 3 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "waiting_choice",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. The wait is safe and flexible; no assumptions about technology, travel, or supervision."
  },
  {
    "id": "brain_015",
    "version": 1,
    "dimension": "brain",
    "facet": "material_organization",
    "prompt": "Paper pieces provided. Picture time incoming. What setup do you usually like before starting?",
    "context": "creative",
    "options": [
      {
        "id": "a",
        "text": "All together in a mixed pile.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"All together in a mixed pile.\" expresses keeping materials together without sorting, so it receives 0 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "b",
        "text": "A couple of roughly grouped piles.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 1,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A couple of roughly grouped piles.\" expresses a small amount of sorting, so it receives 1 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "c",
        "text": "Most pieces sorted into groups.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 2,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Most pieces sorted into groups.\" expresses sorting most materials into groups, so it receives 2 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "d",
        "text": "A set spot for every piece.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 3,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A set spot for every piece.\" expresses giving each material a defined place, so it receives 3 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "paper_materials",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Supplies are provided; no inference about ownership, tidiness, or quality of the finished picture."
  },
  {
    "id": "brain_016",
    "version": 1,
    "dimension": "brain",
    "facet": "material_organization",
    "prompt": "Relaxed game, a handful of pieces. How do you usually like to keep them?",
    "context": "games",
    "options": [
      {
        "id": "a",
        "text": "All together, unsorted.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"All together, unsorted.\" expresses keeping materials together without sorting, so it receives 0 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "b",
        "text": "A couple of roughly grouped piles.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 1,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A couple of roughly grouped piles.\" expresses a small amount of sorting, so it receives 1 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "c",
        "text": "Most pieces sorted into groups.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 2,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Most pieces sorted into groups.\" expresses sorting most materials into groups, so it receives 2 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "d",
        "text": "A set spot for each kind of piece.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 3,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A set spot for each kind of piece.\" expresses giving each material a defined place, so it receives 3 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "game_materials",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Game rules do not require sorting; actual performance is not measured."
  },
  {
    "id": "brain_017",
    "version": 1,
    "dimension": "brain",
    "facet": "material_organization",
    "prompt": "You've been given some objects to make a fun pattern. What's your usual starting setup?",
    "context": "everyday",
    "options": [
      {
        "id": "a",
        "text": "One mixed bunch of objects.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"One mixed bunch of objects.\" expresses keeping materials together without sorting, so it receives 0 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "b",
        "text": "A couple of rough groups.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 1,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A couple of rough groups.\" expresses a small amount of sorting, so it receives 1 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "c",
        "text": "Most objects sorted into groups.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 2,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Most objects sorted into groups.\" expresses sorting most materials into groups, so it receives 2 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "d",
        "text": "A set spot for each kind of object.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 3,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A set spot for each kind of object.\" expresses giving each material a defined place, so it receives 3 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "object_pattern",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Potential overlap with material-sorting skill; explicitly ask preferred setup rather than best method."
  },
  {
    "id": "brain_018",
    "version": 1,
    "dimension": "brain",
    "facet": "material_organization",
    "prompt": "Pretend banner project: your group has the paper bits. What's your usual setup preference?",
    "context": "group_activity",
    "options": [
      {
        "id": "a",
        "text": "All the bits in one mixed pile.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"All the bits in one mixed pile.\" expresses keeping materials together without sorting, so it receives 0 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "b",
        "text": "A couple of roughly grouped piles.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 1,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A couple of roughly grouped piles.\" expresses a small amount of sorting, so it receives 1 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "c",
        "text": "Group most of the paper bits.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 2,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Group most of the paper bits.\" expresses sorting most materials into groups, so it receives 2 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "d",
        "text": "A set spot for each kind of bit.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 3,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A set spot for each kind of bit.\" expresses giving each material a defined place, so it receives 3 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "group_banner",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. All group members can access supplies in every option; not helpfulness or responsibility."
  },
  {
    "id": "brain_019",
    "version": 1,
    "dimension": "brain",
    "facet": "material_organization",
    "prompt": "Picture cards are ready for a topic deep dive. How do you usually like them laid out?",
    "context": "learning",
    "options": [
      {
        "id": "a",
        "text": "Together in an unsorted bunch.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Together in an unsorted bunch.\" expresses keeping materials together without sorting, so it receives 0 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "b",
        "text": "A couple of rough groups.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 1,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A couple of rough groups.\" expresses a small amount of sorting, so it receives 1 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "c",
        "text": "Most cards sorted into groups.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 2,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Most cards sorted into groups.\" expresses sorting most materials into groups, so it receives 2 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "d",
        "text": "A set spot for each kind of card.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 3,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A set spot for each kind of card.\" expresses giving each material a defined place, so it receives 3 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "topic_cards",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. No reading requirement; accessible card presentation should not force a particular organization."
  },
  {
    "id": "brain_020",
    "version": 1,
    "dimension": "brain",
    "facet": "material_organization",
    "prompt": "You and a friend have paper characters for a pretend scene. What's your usual setup?",
    "context": "friends",
    "options": [
      {
        "id": "a",
        "text": "Characters together in a mixed pile.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Characters together in a mixed pile.\" expresses keeping materials together without sorting, so it receives 0 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "b",
        "text": "Characters in a couple of rough groups.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 1,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Characters in a couple of rough groups.\" expresses a small amount of sorting, so it receives 1 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "c",
        "text": "Most characters sorted into groups.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 2,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Most characters sorted into groups.\" expresses sorting most materials into groups, so it receives 2 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      },
      {
        "id": "d",
        "text": "A set spot for every character.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 3,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"A set spot for every character.\" expresses giving each material a defined place, so it receives 3 on brain. Other dimensions are unscored by this item. This does not score intelligence, memory, school success, or responsibility."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "paper_scene",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Check relevance at ages 16-18; organization preference must not become a measure of pretend-play interest."
  },
  {
    "id": "social_001",
    "version": 1,
    "dimension": "social",
    "facet": "initiating_interaction",
    "prompt": "You're waiting beside someone you know. Chatting is welcome. How often are you usually the one to kick it off?",
    "context": "waiting",
    "options": [
      {
        "id": "a",
        "text": "I kick off almost none of these chats.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"I kick off almost none of these chats.\" expresses starting almost none of the chats, so it receives 0 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "b",
        "text": "I kick off a few of these chats.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 1
        },
        "rationale": "Provisional expert judgment: \"I kick off a few of these chats.\" expresses starting a few of the chats, so it receives 1 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "c",
        "text": "I kick off many of these chats.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 2
        },
        "rationale": "Provisional expert judgment: \"I kick off many of these chats.\" expresses starting many of the chats, so it receives 2 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "d",
        "text": "I kick off almost all of these chats.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 3
        },
        "rationale": "Provisional expert judgment: \"I kick off almost all of these chats.\" expresses starting nearly all of the chats, so it receives 3 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "waiting_chat",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Check the four frequency categories are distinct. Score initiation preference in a welcome setting, not confidence, leadership, conversational skill, or the number of friends."
  },
  {
    "id": "social_002",
    "version": 1,
    "dimension": "social",
    "facet": "initiating_interaction",
    "prompt": "The familiar crew is ready to talk game ideas. How often do you usually get the chat going?",
    "context": "group_activity",
    "options": [
      {
        "id": "a",
        "text": "I get almost none of these chats going.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"I get almost none of these chats going.\" expresses starting almost none of the chats, so it receives 0 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "b",
        "text": "I get a few of these chats going.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 1
        },
        "rationale": "Provisional expert judgment: \"I get a few of these chats going.\" expresses starting a few of the chats, so it receives 1 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "c",
        "text": "I get many of these chats going.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 2
        },
        "rationale": "Provisional expert judgment: \"I get many of these chats going.\" expresses starting many of the chats, so it receives 2 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "d",
        "text": "I get almost all of these chats going.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 3
        },
        "rationale": "Provisional expert judgment: \"I get almost all of these chats going.\" expresses starting nearly all of the chats, so it receives 3 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "group_opening",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Check the four frequency categories are distinct. Score initiation preference in a welcome setting, not confidence, leadership, conversational skill, or the number of friends."
  },
  {
    "id": "social_003",
    "version": 1,
    "dimension": "social",
    "facet": "initiating_interaction",
    "prompt": "A quiet moment with a friend, and a chat would be welcome. How often do you usually make the first comment?",
    "context": "friends",
    "options": [
      {
        "id": "a",
        "text": "I'm first in almost none of these chats.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"I'm first in almost none of these chats.\" expresses starting almost none of the chats, so it receives 0 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "b",
        "text": "I'm first in a few of these chats.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 1
        },
        "rationale": "Provisional expert judgment: \"I'm first in a few of these chats.\" expresses starting a few of the chats, so it receives 1 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "c",
        "text": "I'm first in many of these chats.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 2
        },
        "rationale": "Provisional expert judgment: \"I'm first in many of these chats.\" expresses starting many of the chats, so it receives 2 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "d",
        "text": "I'm first in almost all of these chats.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 3
        },
        "rationale": "Provisional expert judgment: \"I'm first in almost all of these chats.\" expresses starting nearly all of the chats, so it receives 3 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "conversation_gap",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Check the four frequency categories are distinct. Score initiation preference in a welcome setting, not confidence, leadership, conversational skill, or the number of friends."
  },
  {
    "id": "social_004",
    "version": 1,
    "dimension": "social",
    "facet": "initiating_interaction",
    "prompt": "Relaxed game with people you know. Pre-game chat is welcome. How often do you usually start it?",
    "context": "games",
    "options": [
      {
        "id": "a",
        "text": "I begin almost none of these chats.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"I begin almost none of these chats.\" expresses starting almost none of the chats, so it receives 0 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "b",
        "text": "I begin a few of these chats.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 1
        },
        "rationale": "Provisional expert judgment: \"I begin a few of these chats.\" expresses starting a few of the chats, so it receives 1 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "c",
        "text": "I begin many of these chats.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 2
        },
        "rationale": "Provisional expert judgment: \"I begin many of these chats.\" expresses starting many of the chats, so it receives 2 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "d",
        "text": "I begin almost all of these chats.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 3
        },
        "rationale": "Provisional expert judgment: \"I begin almost all of these chats.\" expresses starting nearly all of the chats, so it receives 3 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "game_opening",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Check the four frequency categories are distinct. Score initiation preference in a welcome setting, not confidence, leadership, conversational skill, or the number of friends."
  },
  {
    "id": "social_005",
    "version": 1,
    "dimension": "social",
    "facet": "initiating_interaction",
    "prompt": "You and someone you know are looking at a picture. How often do you usually open a chat about it?",
    "context": "creative",
    "options": [
      {
        "id": "a",
        "text": "I open almost none of these chats.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"I open almost none of these chats.\" expresses starting almost none of the chats, so it receives 0 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "b",
        "text": "I open a few of these chats.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 1
        },
        "rationale": "Provisional expert judgment: \"I open a few of these chats.\" expresses starting a few of the chats, so it receives 1 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "c",
        "text": "I open many of these chats.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 2
        },
        "rationale": "Provisional expert judgment: \"I open many of these chats.\" expresses starting many of the chats, so it receives 2 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "d",
        "text": "I open almost all of these chats.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 3
        },
        "rationale": "Provisional expert judgment: \"I open almost all of these chats.\" expresses starting nearly all of the chats, so it receives 3 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "picture_chat",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Check the four frequency categories are distinct. Score initiation preference in a welcome setting, not confidence, leadership, conversational skill, or the number of friends."
  },
  {
    "id": "social_006",
    "version": 1,
    "dimension": "social",
    "facet": "initiating_interaction",
    "prompt": "People you know are ready for an open-topic chat. How often do you usually get things rolling?",
    "context": "learning",
    "options": [
      {
        "id": "a",
        "text": "I open almost none of those chats.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"I open almost none of those chats.\" expresses starting almost none of the chats, so it receives 0 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "b",
        "text": "I open a few of those chats.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 1
        },
        "rationale": "Provisional expert judgment: \"I open a few of those chats.\" expresses starting a few of the chats, so it receives 1 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "c",
        "text": "I open many of those chats.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 2
        },
        "rationale": "Provisional expert judgment: \"I open many of those chats.\" expresses starting many of the chats, so it receives 2 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "d",
        "text": "I open almost all of those chats.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 3
        },
        "rationale": "Provisional expert judgment: \"I open almost all of those chats.\" expresses starting nearly all of the chats, so it receives 3 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "group_opening",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Check the four frequency categories are distinct. Score initiation preference in a welcome setting, not confidence, leadership, conversational skill, or the number of friends."
  },
  {
    "id": "social_007",
    "version": 1,
    "dimension": "social",
    "facet": "initiating_interaction",
    "prompt": "You're hanging out with people you know, and chat is welcome. How often do you usually kick things off?",
    "context": "everyday",
    "options": [
      {
        "id": "a",
        "text": "I begin almost none of those chats.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"I begin almost none of those chats.\" expresses starting almost none of the chats, so it receives 0 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "b",
        "text": "I begin a few of those chats.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 1
        },
        "rationale": "Provisional expert judgment: \"I begin a few of those chats.\" expresses starting a few of the chats, so it receives 1 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "c",
        "text": "I begin many of those chats.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 2
        },
        "rationale": "Provisional expert judgment: \"I begin many of those chats.\" expresses starting many of the chats, so it receives 2 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "d",
        "text": "I begin almost all of those chats.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 3
        },
        "rationale": "Provisional expert judgment: \"I begin almost all of those chats.\" expresses starting nearly all of the chats, so it receives 3 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "conversation_gap",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Check the four frequency categories are distinct. Score initiation preference in a welcome setting, not confidence, leadership, conversational skill, or the number of friends."
  },
  {
    "id": "social_008",
    "version": 1,
    "dimension": "social",
    "facet": "participation_amount",
    "prompt": "Friends are chatting everyday stuff, with room for everyone to speak. How much do you usually enjoy adding?",
    "context": "friends",
    "options": [
      {
        "id": "a",
        "text": "Mostly listen, barely add comments.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Mostly listen, barely add comments.\" expresses listening with almost no contributions, so it receives 0 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "b",
        "text": "Share a few comments.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 1
        },
        "rationale": "Provisional expert judgment: \"Share a few comments.\" expresses making a few contributions, so it receives 1 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "c",
        "text": "Share comments at many chances.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 2
        },
        "rationale": "Provisional expert judgment: \"Share comments at many chances.\" expresses contributing at many opportunities, so it receives 2 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "d",
        "text": "Share comments at almost every chance.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 3
        },
        "rationale": "Provisional expert judgment: \"Share comments at almost every chance.\" expresses contributing at nearly every opportunity, so it receives 3 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "chat_amount",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Frequent contribution does not mean interrupting; listening is not less caring or less skilled."
  },
  {
    "id": "social_009",
    "version": 1,
    "dimension": "social",
    "facet": "participation_amount",
    "prompt": "The group is naming made-up creatures. Tiny dragon, big naming session. How much do you usually enjoy adding?",
    "context": "group_activity",
    "options": [
      {
        "id": "a",
        "text": "Mostly listen, barely add ideas.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Mostly listen, barely add ideas.\" expresses listening with almost no contributions, so it receives 0 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "b",
        "text": "Share a few ideas.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 1
        },
        "rationale": "Provisional expert judgment: \"Share a few ideas.\" expresses making a few contributions, so it receives 1 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "c",
        "text": "Share ideas at many chances.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 2
        },
        "rationale": "Provisional expert judgment: \"Share ideas at many chances.\" expresses contributing at many opportunities, so it receives 2 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "d",
        "text": "Share ideas at almost every chance.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 3
        },
        "rationale": "Provisional expert judgment: \"Share ideas at almost every chance.\" expresses contributing at nearly every opportunity, so it receives 3 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "animal_names_group",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Do not score the quality or originality of names; all contributions are welcome."
  },
  {
    "id": "social_010",
    "version": 1,
    "dimension": "social",
    "facet": "participation_amount",
    "prompt": "People you know are trading imaginary story ideas. How much do you usually like to add?",
    "context": "stories",
    "options": [
      {
        "id": "a",
        "text": "Mostly listen, offer almost no ideas.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Mostly listen, offer almost no ideas.\" expresses listening with almost no contributions, so it receives 0 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "b",
        "text": "Offer a few ideas.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 1
        },
        "rationale": "Provisional expert judgment: \"Offer a few ideas.\" expresses making a few contributions, so it receives 1 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "c",
        "text": "Offer ideas at many chances.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 2
        },
        "rationale": "Provisional expert judgment: \"Offer ideas at many chances.\" expresses contributing at many opportunities, so it receives 2 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "d",
        "text": "Offer ideas at almost every chance.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 3
        },
        "rationale": "Provisional expert judgment: \"Offer ideas at almost every chance.\" expresses contributing at nearly every opportunity, so it receives 3 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "story_chat",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Preference for speaking frequency, not storytelling talent or knowledge."
  },
  {
    "id": "social_011",
    "version": 1,
    "dimension": "social",
    "facet": "participation_amount",
    "prompt": "Relaxed game, friendly chat welcome. How much do you usually enjoy joining the chat?",
    "context": "games",
    "options": [
      {
        "id": "a",
        "text": "Mostly listen, offer almost no comments.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Mostly listen, offer almost no comments.\" expresses listening with almost no contributions, so it receives 0 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "b",
        "text": "Offer a few comments.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 1
        },
        "rationale": "Provisional expert judgment: \"Offer a few comments.\" expresses making a few contributions, so it receives 1 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "c",
        "text": "Offer comments at many chances.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 2
        },
        "rationale": "Provisional expert judgment: \"Offer comments at many chances.\" expresses contributing at many opportunities, so it receives 2 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "d",
        "text": "Offer comments at almost every chance.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 3
        },
        "rationale": "Provisional expert judgment: \"Offer comments at almost every chance.\" expresses contributing at nearly every opportunity, so it receives 3 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "game_opening",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Game success and concentration are not scored; may be redundant with general participation items."
  },
  {
    "id": "social_012",
    "version": 1,
    "dimension": "social",
    "facet": "participation_amount",
    "prompt": "You and someone you know are waiting together. What amount of chatting is usually your vibe?",
    "context": "waiting",
    "options": [
      {
        "id": "a",
        "text": "Listen, with barely any comments from me.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Listen, with barely any comments from me.\" expresses listening with almost no contributions, so it receives 0 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "b",
        "text": "Make a few comments.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 1
        },
        "rationale": "Provisional expert judgment: \"Make a few comments.\" expresses making a few contributions, so it receives 1 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "c",
        "text": "Make comments at many chances.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 2
        },
        "rationale": "Provisional expert judgment: \"Make comments at many chances.\" expresses contributing at many opportunities, so it receives 2 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "d",
        "text": "Make comments at almost every chance.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 3
        },
        "rationale": "Provisional expert judgment: \"Make comments at almost every chance.\" expresses contributing at nearly every opportunity, so it receives 3 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "waiting_chat",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Hold setting comfort constant; a small talk preference is not relationship quality."
  },
  {
    "id": "social_013",
    "version": 1,
    "dimension": "social",
    "facet": "participation_amount",
    "prompt": "A familiar group is chatting about things they're into. How much do you usually enjoy adding?",
    "context": "learning",
    "options": [
      {
        "id": "a",
        "text": "Listen, with almost no comments of my own.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Listen, with almost no comments of my own.\" expresses listening with almost no contributions, so it receives 0 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "b",
        "text": "Contribute a few comments.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 1
        },
        "rationale": "Provisional expert judgment: \"Contribute a few comments.\" expresses making a few contributions, so it receives 1 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "c",
        "text": "Contribute comments at many chances.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 2
        },
        "rationale": "Provisional expert judgment: \"Contribute comments at many chances.\" expresses contributing at many opportunities, so it receives 2 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "d",
        "text": "Contribute comments at almost every chance.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 3
        },
        "rationale": "Provisional expert judgment: \"Contribute comments at almost every chance.\" expresses contributing at nearly every opportunity, so it receives 3 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "topic_chat",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Topic knowledge must not determine the choice; no correctness, grades, or expertise is implied."
  },
  {
    "id": "social_014",
    "version": 1,
    "dimension": "social",
    "facet": "participation_amount",
    "prompt": "People you know are swapping ideas for a pretend picture. How much do you usually like to contribute?",
    "context": "creative",
    "options": [
      {
        "id": "a",
        "text": "Listen, with almost no ideas of my own.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Listen, with almost no ideas of my own.\" expresses listening with almost no contributions, so it receives 0 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "b",
        "text": "Contribute a few ideas.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 1
        },
        "rationale": "Provisional expert judgment: \"Contribute a few ideas.\" expresses making a few contributions, so it receives 1 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "c",
        "text": "Contribute ideas at many chances.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 2
        },
        "rationale": "Provisional expert judgment: \"Contribute ideas at many chances.\" expresses contributing at many opportunities, so it receives 2 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "d",
        "text": "Contribute ideas at almost every chance.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 3
        },
        "rationale": "Provisional expert judgment: \"Contribute ideas at almost every chance.\" expresses contributing at nearly every opportunity, so it receives 3 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "picture_chat",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Not a test of creative ability; inspect whether the two upper options are distinguishable."
  },
  {
    "id": "social_015",
    "version": 1,
    "dimension": "social",
    "facet": "company_preference",
    "prompt": "Free time unlocked, people you like available. What's your usual company preference?",
    "context": "everyday",
    "options": [
      {
        "id": "a",
        "text": "Solo time throughout.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Solo time throughout.\" expresses mostly solo time, so it receives 0 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "b",
        "text": "Mostly solo, a little time together.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 1
        },
        "rationale": "Provisional expert judgment: \"Mostly solo, a little time together.\" expresses more solo than shared time, so it receives 1 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "c",
        "text": "Mostly together, a little solo time.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 2
        },
        "rationale": "Provisional expert judgment: \"Mostly together, a little solo time.\" expresses more shared than solo time, so it receives 2 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "d",
        "text": "Time together throughout.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 3
        },
        "rationale": "Provisional expert judgment: \"Time together throughout.\" expresses mostly shared time, so it receives 3 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "free_company",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Both solo and shared options are safe and available; no assumption of popularity or family structure."
  },
  {
    "id": "social_016",
    "version": 1,
    "dimension": "social",
    "facet": "company_preference",
    "prompt": "A lowkey activity works equally well solo or with others. What company mix do you usually prefer?",
    "context": "group_activity",
    "options": [
      {
        "id": "a",
        "text": "Do it solo the whole time.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Do it solo the whole time.\" expresses mostly solo time, so it receives 0 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "b",
        "text": "Mostly solo, a little shared time.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 1
        },
        "rationale": "Provisional expert judgment: \"Mostly solo, a little shared time.\" expresses more solo than shared time, so it receives 1 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "c",
        "text": "Mostly shared, a little solo time.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 2
        },
        "rationale": "Provisional expert judgment: \"Mostly shared, a little solo time.\" expresses more shared than solo time, so it receives 2 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "d",
        "text": "Do it together the whole time.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 3
        },
        "rationale": "Provisional expert judgment: \"Do it together the whole time.\" expresses mostly shared time, so it receives 3 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "activity_company",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Equal access and enjoyment of the activity are fixed; not collaboration skill or group acceptance."
  },
  {
    "id": "social_017",
    "version": 1,
    "dimension": "social",
    "facet": "company_preference",
    "prompt": "Picture-making time: on your own or beside people you like. What's your usual preference?",
    "context": "creative",
    "options": [
      {
        "id": "a",
        "text": "Make pictures solo throughout.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Make pictures solo throughout.\" expresses mostly solo time, so it receives 0 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "b",
        "text": "Mostly draw solo, a little together.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 1
        },
        "rationale": "Provisional expert judgment: \"Mostly draw solo, a little together.\" expresses more solo than shared time, so it receives 1 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "c",
        "text": "Mostly draw together, a little solo.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 2
        },
        "rationale": "Provisional expert judgment: \"Mostly draw together, a little solo.\" expresses more shared than solo time, so it receives 2 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "d",
        "text": "Make pictures together throughout.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 3
        },
        "rationale": "Provisional expert judgment: \"Make pictures together throughout.\" expresses mostly shared time, so it receives 3 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "picture_company",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Being alongside others need not include talking; helps separate company preference from talk amount."
  },
  {
    "id": "social_018",
    "version": 1,
    "dimension": "social",
    "facet": "company_preference",
    "prompt": "Interesting topic to explore, someone you like available. What's your usual company mix?",
    "context": "learning",
    "options": [
      {
        "id": "a",
        "text": "Explore solo throughout.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Explore solo throughout.\" expresses mostly solo time, so it receives 0 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "b",
        "text": "Mostly explore solo, a little together.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 1
        },
        "rationale": "Provisional expert judgment: \"Mostly explore solo, a little together.\" expresses more solo than shared time, so it receives 1 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "c",
        "text": "Mostly explore together, a little solo.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 2
        },
        "rationale": "Provisional expert judgment: \"Mostly explore together, a little solo.\" expresses more shared than solo time, so it receives 2 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "d",
        "text": "Explore together throughout.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 3
        },
        "rationale": "Provisional expert judgment: \"Explore together throughout.\" expresses mostly shared time, so it receives 3 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "learning_company",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Not academic skill or dependence on help; both ways permit the same learning opportunities."
  },
  {
    "id": "social_019",
    "version": 1,
    "dimension": "social",
    "facet": "company_preference",
    "prompt": "You enjoy games both solo and with others. What's your usual game-break company mix?",
    "context": "games",
    "options": [
      {
        "id": "a",
        "text": "Play solo the whole time.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Play solo the whole time.\" expresses mostly solo time, so it receives 0 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "b",
        "text": "Mostly solo play, a little shared play.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 1
        },
        "rationale": "Provisional expert judgment: \"Mostly solo play, a little shared play.\" expresses more solo than shared time, so it receives 1 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "c",
        "text": "Mostly shared play, a little solo play.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 2
        },
        "rationale": "Provisional expert judgment: \"Mostly shared play, a little solo play.\" expresses more shared than solo time, so it receives 2 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "d",
        "text": "Play together the whole time.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 3
        },
        "rationale": "Provisional expert judgment: \"Play together the whole time.\" expresses mostly shared time, so it receives 3 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "game_company",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. No technology, purchases, or organized sport implied; compare preference, not availability."
  },
  {
    "id": "social_020",
    "version": 1,
    "dimension": "social",
    "facet": "company_preference",
    "prompt": "Safe, relaxed wait. Own space or a seat with people you like? What usually suits you?",
    "context": "waiting",
    "options": [
      {
        "id": "a",
        "text": "Have my own space throughout.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 0
        },
        "rationale": "Provisional expert judgment: \"Have my own space throughout.\" expresses mostly solo time, so it receives 0 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "b",
        "text": "Mostly own space, a little shared time.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 1
        },
        "rationale": "Provisional expert judgment: \"Mostly own space, a little shared time.\" expresses more solo than shared time, so it receives 1 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "c",
        "text": "Mostly shared time, a little own space.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 2
        },
        "rationale": "Provisional expert judgment: \"Mostly shared time, a little own space.\" expresses more shared than solo time, so it receives 2 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      },
      {
        "id": "d",
        "text": "Spend the whole wait together.",
        "weights": {
          "chaos": 0,
          "chill": 0,
          "brain": 0,
          "social": 3
        },
        "rationale": "Provisional expert judgment: \"Spend the whole wait together.\" expresses mostly shared time, so it receives 3 on social. Other dimensions are unscored by this item. This does not score popularity, kindness, confidence, or social skill."
      }
    ],
    "reading_age_target": 10,
    "overlap_group": "waiting_company",
    "review_notes": "Candidate, not validated. Reading age is an authoring target, not a tested reading level. Own space does not imply avoidance, loneliness, sensory problems, or a lack of friends."
  }
], manifest: {
  "schema_version": 1,
  "bank_id": "vibecheck-preferences",
  "bank_version": "1.0.0-candidate-fun.1",
  "language": "en",
  "language_revision": 2,
  "status": "candidate_not_validated",
  "created_date": "2026-09-07",
  "item_file": "question-bank.v1.json",
  "item_file_sha256": "482dbf8d544b325a42d11932e990a8c79357aa55534db730398039681a2d361d",
  "item_count": 80,
  "intended_age_range": [
    10,
    18
  ],
  "scoring_version": "expert-ordinal-equal-facet-1",
  "scale_id": "vibecheck-preferences-expert-1",
  "calibration_version": null,
  "selection_version": "balanced-12-anchor-panels-1",
  "pair_metric_version": "mean-absolute-gap-1",
  "group_summary_version": "inclusive-distributions-1",
  "result_copy_version": "preference-snapshot-fun-1",
  "weights_status": "provisional_expert_judgments_not_empirically_calibrated",
  "instruction": "Think about what you usually enjoy over the past few months when you have a choice. Pick the closest answer. There are no right answers. You can swap an unfamiliar question.",
  "dimensions": {
    "chaos": {
      "label": "Chaos",
      "construct": "Novelty preference",
      "low_pole": "Familiar favorites",
      "high_pole": "New twists",
      "facets": [
        "familiarity_choice",
        "variation_seeking",
        "playful_remixing"
      ],
      "facet_bank_counts": [
        7,
        7,
        6
      ],
      "items_per_session": 3
    },
    "chill": {
      "label": "Chill",
      "construct": "Preferred tempo",
      "low_pole": "Lively pace",
      "high_pole": "Unhurried pace",
      "facets": [
        "activity_pace",
        "transition_spacing",
        "event_pace"
      ],
      "facet_bank_counts": [
        7,
        7,
        6
      ],
      "items_per_session": 3
    },
    "brain": {
      "label": "Plan",
      "construct": "Advance structure preference",
      "low_pole": "Build as you go",
      "high_pole": "Map it out",
      "facets": [
        "advance_planning",
        "step_structure",
        "material_organization"
      ],
      "facet_bank_counts": [
        7,
        7,
        6
      ],
      "items_per_session": 3
    },
    "social": {
      "label": "Social",
      "construct": "Interaction preference",
      "low_pole": "More own space",
      "high_pole": "More interaction",
      "facets": [
        "initiating_interaction",
        "participation_amount",
        "company_preference"
      ],
      "facet_bank_counts": [
        7,
        7,
        6
      ],
      "items_per_session": 3
    }
  },
  "scoring": {
    "item_levels": [
      0,
      1,
      2,
      3
    ],
    "non_target_weights_mean": "unscored_not_evidence_of_low_trait",
    "dimension_aggregation": "equal_facet_mean_of_item_level_divided_by_3",
    "normalize_across_dimensions": false,
    "dimension_display": "three_bands",
    "band_cutpoints": [
      0.3333333333333333,
      0.6666666666666666
    ],
    "cutpoint_rule": "low if x < 1/3; high if x > 2/3; otherwise middle",
    "middle_label": "A bit of both",
    "minimum_answers_for_profile": 12,
    "confidence_intervals_available": false,
    "percentiles_available": false
  },
  "selection": {
    "session_size": 12,
    "per_dimension": 3,
    "per_facet": 1,
    "maximum_per_context": 3,
    "minimum_distinct_contexts": 5,
    "maximum_per_non_null_overlap_group": 1,
    "shared_anchor_count": 4,
    "variable_item_count": 8,
    "anchor_panels": {
      "A": [
        "chaos_001",
        "chill_001",
        "brain_002",
        "social_001"
      ],
      "B": [
        "chaos_009",
        "chill_010",
        "brain_010",
        "social_008"
      ],
      "C": [
        "chaos_018",
        "chill_015",
        "brain_015",
        "social_019"
      ]
    },
    "anchor_policy": "Panel fixed per chain; panel rotates across chains. Other panel anchors remain eligible as variable items.",
    "friend_variation": "soft_minimize_variable_item_overlap_never_infer_or_optimize_scores",
    "options": "ordinal_order_consistent_within_session; counterbalance ascending_vs_descending_across_sessions",
    "swap_policy": "replace_same_dimension_and_facet_without_scoring_declined_item; mark_anchor_exception"
  },
  "pair_display": {
    "name": "Vibe match",
    "subtitle": "Similarity of your quiz preferences, not a friendship prediction.",
    "use_percent_sign": false,
    "round_to_nearest": 10,
    "units": "out_of_100",
    "show_provisional_badge": true,
    "allow_cross_version_without_bridge": false,
    "numeric_release_policy": "prototype_only_until_alternate_form_and_interpretation_validation"
  },
  "research_note": "These are original items. Citing research does not validate this bank or transfer instrument norms or reliability.",
  "repo_inspected": {
    "repository": "kamatbot/vibecheck",
    "commit": "0d38340008fa322570403e0ab39a9d79143d9379"
  }
}};
if (typeof module !== "undefined" && module.exports) module.exports = PreferenceData;
