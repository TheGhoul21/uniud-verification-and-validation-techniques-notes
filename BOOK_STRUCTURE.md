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
  - Sources: L01-L03, with later references from L06 where needed.
  - DFA/NFA definitions, words and languages, runs, acceptance, regular
    expressions, and automata-language correspondence.
- **Chapter 2: Equivalence and Closure for Regular Languages**
  - Sources: L03-L04.
  - Kleene-style constructions, NFA-to-DFA determinization, closure properties,
    and decision problems such as emptiness, inclusion, and equivalence.
- **Chapter 3: Automata over Infinite Words**
  - Sources: L04-L08.
  - Omega-words, Büchi automata, omega-regular languages, acceptance over
    infinite runs, closure properties, and complementation.
- **Chapter 4: Formal Verification in Practice**
  - Source: L09.
  - Guest/practical material on industrial formal verification and model
    checking applications.
- **Chapter 5: Two-Player Games for Verification**
  - Sources: L10-L11.
  - Arenas, plays, strategies, winning regions, Muller/parity objectives, and
    verification games.
- **Appendix A: Review and Exam Preparation**
  - Source: L12.
  - Wrap-up, exercises, recurring constructions, and exam-oriented synthesis.

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
- **Chapter 9: Deterministic Automata, Star-Free Languages, and Trees**
  - Sources: L07-L12.
  - S1S extensions, McNaughton's theorem, deterministic Muller/parity-style
    automata, first-order definability, star-free languages, finite and
    infinite trees, and tree automata.
- **Chapter 10: Linear Temporal Logic**
  - Sources: L13-L17.
  - LTL syntax and semantics, next/until, derived operators, satisfiability,
    tableau/fulfilling paths, translation to Büchi automata, and LTL with past.
- **Chapter 11: LTL Model Checking and Fairness**
  - Sources: L18-L19.
  - Automata-theoretic model checking, direct algorithms, SCC-based search,
    justice and compassion constraints.
- **Chapter 12: CTL and Symbolic Model Checking**
  - Sources: L20-L24.
  - CTL syntax/semantics, CTL*, explicit vs symbolic model checking, SAT-based
    bounded model checking, OBDDs, predicate transformers, and fixpoints.
- **Chapter 13: Learning Regular Languages**
  - Sources: L25-L26.
  - Learning automata/regular languages, Myhill-Nerode approximations, test
    sets, observation tables, and active-learning style algorithms.
- **Chapter 14: Security Protocol Verification with Tamarin**
  - Sources: L27-L28.
  - Multiset rewriting, facts, terms, protocol roles, traces, and property
    verification in the Tamarin prover.

## Editorial Policy

- Preserve the two-module structure with `\part{...}` in the LaTeX book.
- Do not order chapters by the interleaved lecture calendar.
- Keep a source mapping from every chapter section back to Course/Lecture IDs.
- Write in the same style as `../uniud-operations-research`: formal definitions
  followed by intuition, concrete examples before general rules, figures for
  major constructions, and explicit bridge sections between concepts.
