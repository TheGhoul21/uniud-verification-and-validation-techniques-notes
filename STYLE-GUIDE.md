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
- Avoid transcript-like prose. Remove lecture logistics, filler, and repeated
  recaps unless they serve the exposition.
- Use "we" and "let's" when walking through constructions.

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

## Exercises

- Add short end-of-chapter exercises when they help the reader check a
  construction.
- Exercises should be specific and mechanically answerable:
  - simulate a DFA;
  - complete an NFA determinization step;
  - find an accepting lasso;
  - compute one attractor/preimage iteration.
- Avoid broad essay questions unless they are clearly marked as conceptual.
