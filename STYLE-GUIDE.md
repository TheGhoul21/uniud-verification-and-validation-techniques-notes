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
