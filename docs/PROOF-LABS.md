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
