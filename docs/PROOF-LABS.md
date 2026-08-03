# Proof Labs

Proof Labs are the interactive theorem companion for the book. The selected
production pattern comes from the `A - Guided canvas` prototype:

- one dominant mathematical diagram;
- one narrow contextual rail on desktop;
- one centered column on mobile;
- one prediction before each revealed proof state;
- causal feedback and an optional formal justification;
- one persistent invariant connecting the example to the general proof.

The LaTeX proof remains authoritative and complete. A Proof Lab does not certify
the theorem and does not replace its proof; it exposes the construction,
invariant, cases, and failure modes on a carefully chosen instance.

## Repository layout

- `proofs/proof-lab.css`: shared responsive presentation;
- `proofs/proof-lab.js`: shared guided-proof runtime;
- `proofs/proof-lab-content.js`: theorem-specific diagrams and proof steps;
- `proofs/index.qmd`: chapter-by-chapter index;
- `proofs/chapter-NN/*.qmd`: stable theorem routes;
- `\prooflablink` in `preamble.tex`: direct PDF-to-site callout.

## Content contract

Every theorem configuration provides:

1. the theorem statement, a short purpose, and a proof strategy;
2. a persistent invariant or organizing claim;
3. a labelled diagram whose stable geometry survives every step;
4. three to five proof steps, each introduced by serious technical exposition;
5. one meaningful prediction per step;
6. a hint, causal success/failure feedback, and a MathJax-rendered formal warrant;
7. preview and revealed visual states;
8. a complete proof synthesis reconnecting the local steps;
9. previous/next Proof Lab navigation.

Mathematical prose inserted by the shared runtime uses `\(...\)` delimiters and
is typeset after every dynamic update. Keep formulas in LaTeX rather than
approximating subscripts, set operations, or indexed unions with plain Unicode.

Use automata diagrams for state constructions, transformation cycles for
equivalence proofs, quotient/class diagrams for congruence arguments, lasso
diagrams for infinite runs, and witness surgery for small-model arguments.
The shell remains constant; the main visual must be native to the proof.

## Methodological framework

The content contract above lists *what* every lab must provide. This section
states *how* to make those fields teach well. It refines — does not repeat —
the editorial rules in `STYLE-GUIDE.md` → *Interactive Proof Labs*.

**Central thesis.** A Proof Lab is not a quiz about a proof. It is a controlled
instrument that makes the proof's mechanism observable on one instance, forces
one falsifiable prediction per inferential step, and closes each step with a
formal warrant that lifts the observation to the general case. The "game-like"
failure mode is precisely what happens when a prediction stops being a
falsification test and becomes a scored guess. Every rule below exists to
prevent that drift.

### Design principles

- **One visual protagonist, stable geometry.** The diagram is the object of
  study, not an illustration. `nodes`/`edges`/`lanes` never change within a lab;
  only the visual *state* (`preview`/`reveal`/`consequence`) does. The reader
  learns by watching one scene evolve, never by re-orienting to a new one.
- **Three separated cognitive modes.** Each phase does one job and the badge
  makes the current mode unambiguous: *Read* (`exposition` + `preview`) is for
  observing the mechanism; *Answer* (`question` + `choices`) is for committing to
  a prediction; *Result* (`feedback`/`causalFailure` + `consequence` + `formal`)
  is for verifying and generalising.
- **Predictions are falsification tests (anti-game rule).** A distractor is not
  a wrong answer — it is a *named failure mode* of the construction. Every wrong
  choice must carry a `causalFailure` explaining why the proof would break, and,
  where the diagram can show it, a `consequence` that renders the breakage
  (`badNodes`, blocked propagation). A distractor that maps to no real
  counterexample is noise; delete it.
- **Both registers, always.** The concrete instance (`exposition`) shows how the
  mechanism works; the `formal` warrant proves it for every instance. The
  concrete must never *substitute* for the general. Keep the shared notation
  identical across the two.
- **One persistent invariant.** `invariant` is the single claim that survives
  every step and ties the instance to the theorem. Reaffirm it at each step
  close; it is what stops the lab from fragmenting into disconnected questions.
- **Self-contained, statically degradable.** `strategy` + `exposition` +
  `synthesis` must carry the whole argument with JavaScript disabled. No metaphor
  that does not carry mechanical load; no animation without semantics.
- **Cognitive economy.** One prediction per step. Every symbol introduced before
  use. Load belongs on the inference, not the interface.

### Example integration

- **Minimal witness instance.** Choose the smallest instance that exhibits every
  case *and* every failure mode — small-model discipline. Prefer a worst-case
  witness (e.g. a non-ultimately-periodic omega-word) over a comfortable one: it
  proves the construction where it is hardest.
- **Proof-identical notation.** The instance uses the exact symbols of the formal
  proof, in LaTeX, not Unicode approximations of indexed unions or subscripts.
- **Distractors are the examples.** Instead of narrating a counterexample in
  prose, make it selectable: the reader picks it and the `consequence` shows the
  proof breaking. The negative example becomes direct experience.
- **Fading scaffold (I do -> we do -> you do).** Degrade support across steps: the
  first step *shows* (base case near-mechanical), the middle steps *guide* (real
  prediction, `hint` available on request, never forced), the last step
  *generalises* (the reader states the rule).
- **Lift concrete -> general at each step.** After each concrete observation, the
  `formal` field raises it to an arbitrary instance.

### Learning flow

Per lab, once: state the theorem (`theorem`/`intro`), expose the map
(`strategy`), declare the `invariant`.

Per step, a fixed loop: **orient** (`stepLabel`) -> **observe** (`exposition` +
`preview`) -> **predict** (`question` + `choices`, optional `hint`) -> **causal
feedback** (`reveal` on success, `causalFailure` + `consequence` on error) ->
**formal warrant** (`formal`) -> **consolidate** (invariant reaffirmed). No
score, no timer, no lives: a retry is re-examination, not a penalty.

Per lab, once more: `synthesis` recomposes the local steps into one continuous
proof.

### Authoring checklist

A lab is on-method when every item holds; if one fails, it is drifting toward a
quiz:

1. one visual protagonist, stable geometry across all steps;
2. one minimal witness instance covering every case and every failure mode;
3. every distractor is a named counterexample with `causalFailure` (and
   `consequence` where the diagram can show it);
4. every step closes with a `formal` warrant that generalises the observation;
5. one persistent `invariant` links instance to theorem;
6. no game mechanics — no score, timer, or lives; retry is re-examination;
7. the page reads completely with JavaScript disabled.

## Initial coverage

The first tranche covers all nine theorem environments in Chapters 1--4:

1. subset construction;
2. epsilon-removal;
3. Kleene equivalence;
4. closure of regular languages;
5. small model property for finite automata;
6. Myhill--Nerode;
7. basic omega-regular closure;
8. Buchi-expression equivalence;
9. Buchi complementation.

After these are validated against the studied chapters, extend the same
contract to the remaining theorem environments in the book.
