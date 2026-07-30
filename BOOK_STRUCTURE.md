# Verification and Validation Techniques - Book Structure

The notes should be compiled as a **single book divided into two main
parts**. The university schedule interleaves lectures from the modules, but
the book should follow the conceptual dependency order rather than the
calendar order.

In Supabase, the current source buckets are:

- Course 88: 12 lectures with attachments. This is the automata/infinite-words
  source used for Part I.
- Course 89: 28 lectures with attachments. This is the model-checking,
  temporal-logic, symbolic-verification, learning, and security-protocol source
  used for Part II.

See `SOURCE_MAP.md` for the current database inventory.

## Part I: Automata, Infinite Words, and Games

Source: Course 88, lectures L01-L12.

This part focuses on the theoretical foundations of automata, infinite words,
and game-theoretic techniques used in verification.

- **Chapter 1: Finite-State Automata and Regular Languages**
  - Sources: L01-L02.
  - Words and languages, DFA/NFA definitions, runs, acceptance, finite-memory
    examples, subset construction, and the regular-language viewpoint.
- **Chapter 2: Regular Languages and Decision Problems**
  - Sources: L02-L03 and L06.
  - Regular expressions, epsilon-NFAs, Kleene equivalence, closure properties,
    emptiness/inclusion/equivalence reductions, and Myhill--Nerode minimality.
- **Chapter 3: Automata over Infinite Words**
  - Sources: L04-L05.
  - Omega-words, Büchi automata, omega-regular languages, acceptance over
    infinite runs, closure properties, omega-regular expressions, lasso
    emptiness, and ultimately periodic witnesses.
- **Chapter 4: Complementation of Omega-Regular Languages**
  - Sources: L07-L08, with supporting material from L05.
  - Finite-index congruences, transition profiles, saturation, Ramsey
    decomposition, Büchi complementation, and inclusion.
- **Chapter 5: Synthesis and Infinite Games**
  - Sources: L09-L11.
  - Church synthesis, arenas, strategies, winning regions, attractors,
    Muller/parity objectives, finite-state strategy memory, and the railway
    interlocking verification case study.
- **Chapter 6: Planning as Model Checking**
  - Source: L12.
  - Action-based and timeline-based planning, planning domains, weak/strong
    and strong-cyclic plans, execution structures, symbolic preimages, and
    action description languages.

## Part II: Model Checking, Temporal Logic, and Verification Tools

Source: Course 89, lectures L01-L28.

This part is now source-complete. It should be written after Part I using the
same OR-style standard: clear exposition, recurring examples, TikZ diagrams,
complete proofs for stated theorem-level results, and targeted exercises.

- **Chapter 7: Reactive Systems, SMV, and Explicit Model Checking**
  - Sources: L01-L03.
  - Reactive systems, executions, models, specifications, exhaustive
    verification, counterexamples, SMV modules, variables, transition
    relations, and practical model-checking inputs.
- **Chapter 8: S1S and the Büchi Theorem**
  - Sources: L04-L06.
  - Monadic second-order logic of one successor, encodings of words, projection,
    the correspondence between S1S and Büchi automata, and decidability.
- **Chapter 9: Deterministic Omega-Automata and Star-Free Languages**
  - Sources: L07-L09, L10 (part 1).
  - Deterministic Büchi Automata (DBA) characterization, Deterministic Muller Automata (DMA), McNaughton's theorem, Deterministic Rabin Automata (DRA), Safra's determinization construction, S1S vs WS1S equivalence, First-order S1S logic, star-free languages, McNaughton-Papert theorem.
- **Chapter 10: Tree Languages and Tree Automata**
  - Sources: L10 (part 2), L11-L12.
  - Finite and infinite trees, top-down and bottom-up tree automata, regular tree languages, Rabin's theorem, S2S logic, and Weak S2S logic.
- **Chapter 11: Linear Temporal Logic**
  - Sources: L13-L17.
  - LTL syntax and semantics, next/until, derived operators, satisfiability,
    tableau/fulfilling paths, translation to Büchi automata, and LTL with past.
- **Chapter 12: LTL Model Checking and Fairness**
  - Sources: L18-L19.
  - Automata-theoretic model checking, direct algorithms, SCC-based search,
    justice and compassion constraints.
- **Chapter 13: CTL and Symbolic Model Checking**
  - Sources: L20-L24.
  - CTL syntax/semantics, CTL*, explicit vs symbolic model checking, SAT-based
    bounded model checking, OBDDs, predicate transformers, and fixpoints.
- **Chapter 14: Learning Regular Languages**
  - Sources: L25-L26.
  - Learning automata/regular languages, Myhill-Nerode approximations, test
    sets, observation tables, and active-learning style algorithms.
- **Chapter 15: Security Protocol Verification with Tamarin**
  - Sources: L27-L28.
  - Multiset rewriting, facts, terms, protocol roles, traces, and property
    verification in the Tamarin prover.

## Editorial Policy

- Preserve the two-module structure with `\part{...}` in the LaTeX book.
- Do not order chapters by the interleaved lecture calendar.
- Keep a source mapping from every chapter section back to Course/Lecture IDs.
- Open every chapter with a compact radial mind map derived from its heading
  hierarchy. The website counterpart must expose the same structure
  interactively down to individual topics.
- After changing chapter headings, run `node scripts/generate-mindmaps.mjs`;
  generated map pages and TikZ fragments are build artifacts kept in the
  repository and must not be edited by hand.
- Write in the same style as `../uniud-operations-research`: formal definitions
  followed by intuition, concrete examples before general rules, figures for
  major constructions, and explicit bridge sections between concepts.
