# Style Guide - Verification and Validation Techniques Notes

These notes should follow the pedagogical style of
`../uniud-operations-research`, adapted to automata, verification, model
checking, synthesis, and planning.

## Writing Style

- Write as a knowledgeable guide at a whiteboard, not as a compressed theorem
  list.
- Prefer concrete examples before general definitions.
- After each formal definition, add an intuitive paragraph explaining what each
  component means operationally.
- Do not use a symbol before naming it in prose. When introducing notation, give
  the symbol, its type, and its role before relying on it in definitions or
  proofs. For example, introduce `F` as the set of accepting states before using
  `$q \in F$` as an acceptance condition.
- After a formal definition, add a short "how to read it" paragraph: identify
  the object being defined, explain what question it answers, and state the
  operational test it gives the reader.
- Avoid transcript-like prose. Remove lecture logistics, filler, and repeated
  recaps unless they serve the exposition.
- Use "we" and "let's" when walking through constructions.

## Chapter Construction Workflow

To maintain high quality and pedagogical cohesion, every chapter must follow a strict four-phase creation process:

1. **Comprehensive Reading**: Read the entire set of transcripts and source materials first. Do not write any draft text yet.
2. **Structural Outline (Schema)**: Prepare and align on a detailed section-by-section outline. Map every section to its source lectures, noting which definitions, theorems, examples, and TikZ figures will be included.
3. **Drafting with "Narrative Glue"**: When writing, avoid presenting a dry sequence of disconnected blocks (definition $\to$ theorem $\to$ proof $\to$ example). You must weave a continuous narrative:
   - **Bridges**: Explain *why* we transition from one concept to the next. What is the limit of the current system that forces us to introduce a new definition, logic, or automaton?
   - **Intuitive Introductions**: Before writing a formal block, provide a high-level, informal explanation of what the formalization aims to capture.
   - **Whiteboard Guidance**: Guide the reader through the reasoning, connecting the formal mathematical constructs back to the practical verification goals.
4. **Pedagogical Polish**: Review the chapter to ensure that figures and examples are tightly integrated with the text, referencing them directly to reinforce the intuition.

## Proofs

- If a result is stated as `theorem`, `lemma`, `proposition`, or `corollary`,
  include a real proof at the level appropriate for the course.
- If the lecture only motivates a large theorem whose full proof is too long
  for the current chapter, do not present it as a proved theorem. Use a
  `formaldetails` box titled "Proof roadmap" or "Construction idea" instead.
- For constructive proofs, show the construction first, then prove the
  invariant that makes it correct.
- For algorithms, state the invariant and explain initialization, preservation,
  and termination.
- Prefer **example-led proofs** for technical constructions. Before the formal
  definition or recurrence, state what object is already given, what must be
  shown, and what bookkeeping device will make the proof manageable. Then show
  a small visible example that uses the same notation as the proof.
- Treat running examples as part of the proof, not as decoration after it. A
  good proof should let the reader see one concrete instance evolve through the
  same stages as the general argument: base case, induction step, invariant, or
  final extraction.
- When a proof introduces indexed objects such as `$R_{i,j}^k$`, `$S_i$`, or
  `$X_m$`, first explain the operational meaning of each index in prose. If
  possible, compute two or three representative instances before giving the
  general formula.
- When you believe a construction admits a genuinely different, non-competing
  way in (e.g. deriving the machinery from the target backward instead of
  building it upward from the base case, as in the two readings of the
  $R_{i,j}^k$ construction in `subsec:kleene-theorem`), do not treat it as a
  replacement for the lecture's derivation. Keep the lecture's order as the
  primary proof, and add the alternative as a `formaldetails` box placed right
  after the proof, titled to describe the specific axis of the alternative
  (not a fixed label like "top-down"---that phrasing is specific to this one
  case and will not fit every alternative reading). State explicitly, in the
  box, that both readings land on the same objects and formulas, and that the
  second is an optional second entry point, not a rival argument.
- Reserve this for cases where the alternative reading is substantial enough
  to need its own paragraph. If it only reframes the opening sentence of the
  proof (stating the goal before the construction), fold it directly into the
  proof's own introduction instead of adding a box.

## Proof-as-Story-Arc Framework

For major results (theorems, propositions), use the structured narrative arc
rather than bare `\begin{proof}...\end{proof}`. The framework provides five
modular components — not every result needs all of them.

### Catalyst

Use `\begin{catalyst}{title}...\end{catalyst}` before a theorem to set up
*why* the result is needed. State the gap, limitation, or open question that
the theorem resolves. Keep it to 2–4 sentences.

### Proof Walkthrough

Use `\begin{walkthrough}{title}...\end{walkthrough}` instead of
`\begin{proof}` for major results. Inside, use `\wtstep{label}{formal}{example}`
to break the proof into labeled steps, each paired with a concrete example
panel:

- **Step label**: a short phrase ("Setup", "Base case", "Inductive step",
  "Conclusion").
- **Formal argument**: the mathematical reasoning for that step.
- **Example panel**: the same step traced on the chapter's running example.

For short lemmas and corollaries, the standard `\begin{proof}` is fine.

### Counterpoint

Use `\begin{counterpoint}{title}...\end{counterpoint}` after a theorem to
show what breaks if a hypothesis is dropped. Use these when there is a
genuinely illuminating failure case — not as mandatory decoration after every
result.

### Proof Map

Use `\begin{proofmap}{title}...\end{proofmap}` before a multi-lemma proof
(e.g., Büchi complementation) to show a TikZ dependency diagram of how the
pieces fit together.

### Takeaway

Use `\begin{takeaway}...\end{takeaway}` after a proof to distill the
operational meaning. This is not a restatement of the theorem — it is the
practical "so what?" that tells the reader what the result means for their
work.

### Usage Guide

| Result type       | Catalyst | Proof Map | Walkthrough | Counterpoint | Takeaway |
|-------------------|----------|-----------|-------------|--------------|----------|
| Major theorem     | ✓        | optional  | ✓ (full)    | ✓            | ✓        |
| Lemma             | —        | —         | ✓ (light)   | optional     | —        |
| Proposition       | ✓        | —         | ✓           | optional     | ✓        |
| Corollary         | —        | —         | — (obvious) | optional     | ✓        |

## Examples

- Use recurring examples across chapters:
  - finite words: turnstile events and parity over `{a,b}`;
  - omega words: request/acknowledgement traces;
  - games: environment requests and system grants;
  - planning: parcel delivery controlled by traffic lights.
- When a formal definition is introduced, immediately verify it on a recurring
  example.
- Each chapter should maintain one running example whenever possible. Reuse it
  across definitions and constructions so the reader can track how the same
  object changes as new machinery is introduced.
- Show failure cases where they clarify why a new concept is needed.

## Figures

- Every major construction should have a TikZ figure:
  - DFA/NFA transition structure;
  - subset construction as a set-of-states update;
  - product automaton;
  - Buechi accepting lasso;
  - congruence/profile intuition;
  - game arena and attractor;
  - planning preimage.
- Figures must be referenced in the prose and must explain a specific point.
- Use visual contrast:
  - teal/green for accepting, winning, or target states;
  - orange/violet for environment choices or highlighted transitions;
  - gray for rejected/sink/irrelevant structure.

### Chapter Mind Maps

- Each chapter opens with a radial overview: the chapter is the root, sections
  are the main arteries, and subsections or subsubsections are the outer topics.
  Where a section has no nested headings, use its titled definitions, results,
  examples, and construction boxes as topic-level leaves.
- The map is an orientation aid, not a replacement for bridge paragraphs or
  narrative structure.
- The website version must support zooming, panning, search, branch folding,
  and highlighting the full artery of a selected topic.
- The PDF and website maps share the LaTeX heading hierarchy as their source of
  truth. After changing headings, run `node scripts/generate-mindmaps.mjs`.
- Do not hand-edit files in `mindmaps/generated/` or generated chapter-map
  `.qmd` files; change the source headings, generator, or shared map styles.

## Asides

- Use `\aside{...}` for short margin or interstitial notes that add intuition,
  context, or design motivation without interrupting the main narrative.
- Most asides are **editorial commentary** written by the author. These need no
  special attribution — just write the note directly.
- When an aside paraphrases something the professor said or drew on the
  whiteboard during a lecture, **open with an attribution phrase** such as
  "In the lecture, ..." or "On the whiteboard, ...". This tells the reader the
  note is sourced from a specific presentation, not general editorial context.
- Do not use direct quotation marks unless the wording is verbatim from the
  transcription. Prefer paraphrase.
- Keep asides concise (1–3 sentences). If the content is substantial enough to
  need a paragraph, consider promoting it to a `formaldetails` box or folding it
  into the main prose.

## Structure

- The book is one LaTeX book with two parts:
  - Part I: Course 88, complete.
  - Part II: Course 89, in progress.
- The book order is conceptual, not calendar order.
- Keep `SOURCE_MAP.md` updated with course/lecture IDs and topic mapping.
- Keep old extracted/generated files out of `main.tex` until reviewed.
- Each chapter should include a compact notation recap near the end, before the
  summary or exercises. List only notation introduced or heavily used in that
  chapter, with short meanings and no duplicate glossary prose. This is meant as
  a quick lookup table for symbols such as `$A^*$`, `$\widehat{\delta}$`, or
  `$L(\mathcal{A})$`.

## Exercises

- Add short end-of-chapter exercises when they help the reader check a
  construction.
- Exercises should be specific and mechanically answerable:
  - simulate a DFA;
  - complete an NFA determinization step;
  - find an accepting lasso;
  - compute one attractor/preimage iteration.
- Avoid broad essay questions unless they are clearly marked as conceptual.
