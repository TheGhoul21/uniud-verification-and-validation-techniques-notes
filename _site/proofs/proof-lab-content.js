(() => {
  "use strict";

  const N = (id, x, y, label, detail = "", extra = {}) => ({
    id, x, y, label, detail, ...extra
  });
  const E = (id, from, to, label = "", extra = {}) => ({
    id, from, to, label, ...extra
  });
  const V = (activeNodes = [], activeEdges = [], extra = {}) => ({
    activeNodes, activeEdges, ...extra
  });
  const T = String.raw;

  window.PROOF_LABS = {
    "subset-construction": {
      slug: "subset-construction",
      chapter: 1,
      title: "Subset construction",
      theorem: "For every NFA A there is a DFA D such that L(D) = L(A).",
      intro: "The DFA never guesses one NFA run. Its current state is the set of every NFA state that could be active after the same prefix.",
      application: "An editor monitor may branch when it guesses which save will be the relevant one before close. Determinization stores all still-possible monitor phases after the same event prefix.",
      strategy: "Define the deterministic state reached after a prefix to be the complete set of NFA states reachable after that prefix. Prove this equality by induction on the input length, then translate the NFA's existential acceptance condition to subsets.",
      invariant: "After every prefix w, the DFA state equals exactly the set of NFA states reachable after reading w.",
      synthesis: T`Let \(A=(Q,\Sigma,\Delta,q_s,F)\) be an NFA and define \(D\) on the state space \(2^Q\). Its initial state is \(\{q_s\}\), its transition is \(\delta_D(S,a)=\bigcup_{q\in S}\Delta(q,a)\), and a subset is final precisely when it intersects \(F\). An induction on \(|w|\) proves that the state reached by \(D\) after \(w\) is \(\operatorname{Reach}_A(w)\): the base case is \(\{q_s\}\), while the inductive step is exactly the union used in \(\delta_D\). Consequently, \(D\) accepts \(w\) iff \(\operatorname{Reach}_A(w)\cap F\neq\varnothing\), which holds iff \(A\) has an accepting run on \(w\). Therefore \(L(D)=L(A)\).`,
      diagram: {
        description: "An NFA for words ending in a synchronized with its two-state subset DFA.",
        viewBox: [0, 0, 1000, 520],
        lanes: [
          { y: 245, label: "NFA", labelX: 35, labelY: 55 },
          { y: 500, label: "DFA", labelX: 35, labelY: 310 }
        ],
        nodes: [
          N("qs", 285, 145, "qₛ", "scan", { shape: "circle", r: 48 }),
          N("qa", 700, 145, "qₐ", "accept", { shape: "circle", r: 48, accepting: true }),
          N("s0", 285, 400, "S₀", "{qₛ}", { shape: "circle", r: 56 }),
          N("s1", 700, 400, "S₁", "{qₛ,qₐ}", { shape: "circle", r: 62, accepting: true })
        ],
        edges: [
          E("nfa-loop", "qs", "qs", "a,b", { path: "M 260 102 C 205 28 365 28 310 102", labelX: 285, labelY: 38 }),
          E("nfa-a", "qs", "qa", "a", { labelY: 130 }),
          E("dfa-b0", "s0", "s0", "b", { path: "M 255 348 C 205 280 365 280 315 348", labelX: 285, labelY: 290 }),
          E("dfa-a", "s0", "s1", "a", { labelY: 383 }),
          E("dfa-a1", "s1", "s1", "a", { path: "M 670 344 C 620 276 780 276 730 344", labelX: 700, labelY: 285 }),
          E("dfa-b1", "s1", "s0", "b", { path: "M 650 438 C 560 505 425 505 335 438", labelX: 492, labelY: 490 })
        ]
      },
      steps: [
        {
          label: "Base case",
          title: "Anchor both machines at ε",
          exposition: "The deterministic simulation must begin with the reachable-set invariant already true. Before any input is consumed, the only NFA configuration is its initial state, so the corresponding subset is forced rather than chosen.",
          question: "Before reading any symbol, which subset must the DFA store?",
          choices: ["{qₛ}", "{qₐ}", "{qₛ,qₐ}"],
          correct: 0,
          hint: "The empty prefix takes no transition.",
          feedback: "Exactly. The only reachable NFA state is qₛ, so the DFA starts at S₀={qₛ}.",
          incorrect: "That set contains a state the NFA has not reached after ε.",
          formal: T`\(\operatorname{Reach}_A(\varepsilon)=\{q_s\}\), and the constructed DFA starts in the singleton \(\{q_s\}\). This establishes the invariant.`,
          preview: V([], [], { dimNodes: ["qa", "s1"] }),
          reveal: V(["qs", "s0"], [], { dimNodes: ["qa", "s1"] }),
          previewNote: "Predict the shared initial state.",
          revealNote: "Both machines encode the same reachable set after ε."
        },
        {
          label: "Preservation",
          title: "Read a without choosing a branch",
          exposition: "Assume that the current subset contains exactly the NFA states reachable after a prefix w. On the next symbol, determinism is obtained by collecting every successor of every state in that subset; discarding any branch would invalidate the induction hypothesis.",
          question: "The NFA can stay in qₛ or move to qₐ. What must the DFA store?",
          choices: ["Only {qₐ}", "The union {qₛ,qₐ}", "Only {qₛ}"],
          correct: 1,
          hint: "The deterministic state must remember every possible successor.",
          feedback: "Right. The union transition packages both NFA branches into S₁.",
          incorrect: "Choosing one successor would forget a valid NFA run.",
          formal: T`\(\delta_D(S,a)=\bigcup_{q\in S}\Delta(q,a)\). Therefore the invariant for \(w\) implies the invariant for \(wa\).`,
          preview: V(["qs", "s0"], [], { dimNodes: ["qa", "s1"] }),
          reveal: V(["qs", "qa", "s1"], ["nfa-loop", "nfa-a", "dfa-a"], { goodNodes: ["s1"] }),
          previewNote: "One symbol creates two NFA possibilities.",
          revealNote: "S₁ is not a guess: it is the union of both successors."
        },
        {
          label: "Preservation",
          title: "Let b remove the finished guess",
          exposition: "The subset construction records possible runs, not permanently active states. When a branch has no transition for the next symbol, it contributes the empty set to the union and therefore disappears from the deterministic state.",
          question: "From S₁={qₛ,qₐ}, what remains after reading b?",
          choices: ["{qₛ}", "{qₐ}", "{qₛ,qₐ}"],
          correct: 0,
          hint: "qₐ has no outgoing b-transition.",
          feedback: "Correct. Only the scanning branch survives, so the DFA returns to S₀.",
          incorrect: "Any state without a b-successor must disappear from the reachable set.",
          formal: T`The union contains \(\Delta(q_s,b)=\{q_s\}\) and \(\Delta(q_a,b)=\varnothing\), hence it equals \(\{q_s\}\).`,
          preview: V(["qs", "qa", "s1"], [], {}),
          reveal: V(["qs", "s0"], ["nfa-loop", "dfa-b1"], { dimNodes: ["qa", "s1"] }),
          previewNote: "A dead branch contributes the empty set.",
          revealNote: "The subset shrinks when a possible run can no longer continue."
        },
        {
          label: "Acceptance",
          title: "Transfer existential acceptance",
          exposition: "Once the reachable-set equality holds for every word, only the acceptance condition remains. An NFA accepts when at least one reachable state is final, so a deterministic subset must be final exactly when it contains such a state.",
          question: "When is a DFA subset accepting?",
          choices: ["When every member is final", "When it contains at least one final state", "Only when it is a singleton"],
          correct: 1,
          hint: "An NFA accepts when one run succeeds.",
          feedback: "Exactly. S∩F≠∅ transfers the NFA's existential verdict to the DFA.",
          incorrect: "That rule would reject a subset containing both a successful and an unfinished run.",
          formal: T`\(w\in L(A)\) iff \(\operatorname{Reach}_A(w)\cap F\neq\varnothing\). By the invariant, \(\operatorname{Reach}_A(w)\) is the DFA state, so \(w\in L(D)\) iff \(w\in L(A)\).`,
          preview: V(["qs", "qa", "s1"], [], {}),
          reveal: V(["qa", "s1"], [], { goodNodes: ["qa", "s1"], dimNodes: ["qs", "s0"] }),
          previewNote: "The subset still contains a non-final state.",
          revealNote: "One final member is sufficient because one accepting NFA run is sufficient."
        }
      ],
      next: { label: "ε-removal", href: "/proofs/chapter-02/epsilon-removal.html" }
    },

    "epsilon-removal": {
      slug: "epsilon-removal",
      chapter: 2,
      title: "ε-removal",
      theorem: "Every ε-NFA has an equivalent NFA without ε-moves.",
      intro: "The ordinary NFA absorbs every free move into its symbol transitions: close, consume one symbol, then close again.",
      application: "Compiling the expression open(edit+save)*close naturally creates ε-handoffs between fragments. ε-removal packages those internal handoffs while preserving the visible editor-event language.",
      strategy: "Compile every fragment consisting of free moves, one symbol move, and further free moves into a single ordinary transition. Prove preservation of reachable sets by induction, treating the empty word separately because it consumes no symbol.",
      invariant: "For every non-empty prefix, both automata reach the same ε-closed set; acceptance of ε is handled by correcting the initial final state.",
      synthesis: T`For each state \(q\), let \(\operatorname{ECl}(q)\) be its \(\varepsilon\)-closure and define \(\Delta'(q,a)=\operatorname{ECl}\!\left(\bigcup_{p\in\operatorname{ECl}(q)}\Delta(p,a)\right)\). Thus one transition of the new NFA represents every \(\varepsilon^*a\varepsilon^*\) fragment of the original \(\varepsilon\)-NFA. Induction on the length of every nonempty word shows that both machines reach the same \(\varepsilon\)-closed set after reading it. The empty word is the only exceptional case, because the new automaton cannot traverse an initial \(\varepsilon\)-path; declaring its initial state final exactly when \(\operatorname{ECl}(q_0)\cap F\neq\varnothing\) preserves that verdict. Hence the transformed NFA contains no \(\varepsilon\)-moves and recognizes the same language.`,
      diagram: {
        description: "An epsilon NFA and the ordinary NFA obtained by absorbing epsilon closure.",
        viewBox: [0, 0, 1000, 550],
        lanes: [
          { y: 245, label: "ε-NFA", labelX: 25, labelY: 55 },
          { y: 525, label: "NFA", labelX: 25, labelY: 320 }
        ],
        nodes: [
          N("q0", 150, 145, "q₀", "", { shape: "circle" }),
          N("q1", 385, 145, "q₁", "", { shape: "circle" }),
          N("r0", 620, 145, "r₀", "", { shape: "circle" }),
          N("r1", 855, 145, "r₁", "final", { shape: "circle", accepting: true }),
          N("q0p", 150, 410, "q₀", "", { shape: "circle" }),
          N("q1p", 385, 410, "q₁", "", { shape: "circle" }),
          N("r0p", 620, 410, "r₀", "", { shape: "circle" }),
          N("r1p", 855, 410, "r₁", "final", { shape: "circle", accepting: true })
        ],
        edges: [
          E("a-top", "q0", "q1", "a", { labelY: 128 }),
          E("eps-top", "q1", "r0", "ε", { labelY: 128 }),
          E("b-top", "r0", "r1", "b", { labelY: 128 }),
          E("a-q1", "q0p", "q1p", "a", { labelY: 393 }),
          E("a-r0", "q0p", "r0p", "a", { path: "M 192 430 C 310 520 470 520 570 430", labelX: 385, labelY: 505 }),
          E("b-q1", "q1p", "r1p", "b", { path: "M 428 390 C 555 315 710 315 812 390", labelX: 620, labelY: 335 }),
          E("b-r0", "r0p", "r1p", "b", { labelY: 393 })
        ]
      },
      steps: [
        {
          label: "Construction",
          title: "Package the free moves",
          exposition: "Removing ε-transitions does not mean ignoring the states they reach. Each ordinary transition must incorporate the ε-closure available before the symbol, the symbol transition itself, and the ε-closure available afterwards.",
          question: "What set follows q₀ --a→ q₁ when q₁ --ε→ r₀ is free?",
          choices: ["Only {q₁}", "{q₁,r₀}", "Only {r₀}"],
          correct: 1,
          hint: "Take ε-closure after consuming a.",
          feedback: "Correct. The new a-transition reaches the entire closure {q₁,r₀}.",
          incorrect: "The transformed NFA must already include every state reachable for free.",
          formal: T`\(\Delta'(q,a)=\operatorname{ECl}\!\left(\bigcup_{p\in\operatorname{ECl}(q)}\Delta(p,a)\right)\). It compiles an \(\varepsilon^*a\varepsilon^*\) fragment into one \(a\)-transition.`,
          preview: V(["q0", "q1", "r0"], ["a-top", "eps-top"], { dimNodes: ["r1", "q0p", "q1p", "r0p", "r1p"] }),
          reveal: V(["q0p", "q1p", "r0p"], ["a-q1", "a-r0"], { goodNodes: ["q1p", "r0p"], dimNodes: ["q0", "q1", "r0", "r1"] }),
          previewNote: "The top path consumes a and then moves for free.",
          revealNote: "The bottom automaton absorbs both destinations into its a-transition."
        },
        {
          label: "Preservation",
          title: "Consume b from an ε-closed set",
          exposition: "After one transformed transition, the active set is again closed under ε. This restores the condition needed for the next symbol, allowing the local construction to serve as the inductive step for arbitrary words.",
          question: "After the prefix a, which b-successor preserves the same reachable set?",
          choices: ["r₁ only", "q₁ and r₀", "No state"],
          correct: 0,
          hint: "Only r₀ has a b-transition.",
          feedback: "Exactly. Both machines reach r₁ after ab.",
          incorrect: "Check which state in {q₁,r₀} can actually consume b.",
          formal: T`Because the active set is \(\varepsilon\)-closed, unioning \(\Delta'\) over it equals taking the original symbol successors and closing once more.`,
          preview: V(["q1p", "r0p"], [], { dimNodes: ["q0p", "r1p"] }),
          reveal: V(["r1", "r1p"], ["b-top", "b-q1", "b-r0"], { goodNodes: ["r1", "r1p"], dimNodes: ["q0", "q1", "r0", "q0p", "q1p", "r0p"] }),
          previewNote: "The active set is already closed under ε.",
          revealNote: "The same symbol step reaches the same final state."
        },
        {
          label: "Boundary case",
          title: "Repair acceptance of ε",
          exposition: "The induction over symbol transitions does not cover ε. In the original automaton, a final state may be reachable without consuming input, whereas the transformed automaton remains at its initial state and therefore needs an explicit acceptance correction.",
          question: "When must the new initial state be accepting?",
          choices: ["Always", "Exactly when ECl(q₀) meets F", "Never"],
          correct: 1,
          hint: "The new automaton cannot move before reading the empty word.",
          feedback: "Right. F′ corrects exactly the one case where the initial reachable sets differ.",
          incorrect: "The correction depends on whether a free path already reaches a final state.",
          formal: T`Set \(F'=F\cup\{q_0\}\) iff \(\operatorname{ECl}(q_0)\cap F\neq\varnothing\). This preserves acceptance of the empty word.`,
          preview: V(["q0", "q0p"], [], { dimNodes: ["q1", "r0", "r1", "q1p", "r0p", "r1p"] }),
          reveal: V(["q0", "q0p"], [], { goodNodes: ["q0p"], dimNodes: ["q1", "r0", "r1", "q1p", "r0p", "r1p"] }),
          previewNote: "No real symbol can simulate an initial ε-path.",
          revealNote: "A final-state correction preserves the empty-word verdict."
        },
        {
          label: "Conclusion",
          title: "Lift the equality to every word",
          exposition: "The construction re-establishes ε-closure after every consumed symbol. Consequently, the same reachability argument can be repeated along the entire word, while the separate initial-state correction accounts for the zero-length case.",
          question: "What makes the inductive step repeat for every next symbol?",
          choices: ["Every active set is ε-closed", "The automaton is deterministic", "Every state is final"],
          correct: 0,
          hint: "Look at the closure applied after every transformed transition.",
          feedback: "Exactly. Closure is re-established after every step, so the same argument can be reused.",
          incorrect: "The proof does not require determinism or universal finality.",
          formal: T`Induction on \(|w|\) shows equality of the reachable \(\varepsilon\)-closed sets for nonempty words; the corrected \(F'\) handles \(\varepsilon\), so the languages coincide.`,
          preview: V(["q0", "q1", "r0", "r1"], ["a-top", "eps-top", "b-top"], { dimNodes: ["q0p", "q1p", "r0p", "r1p"] }),
          reveal: V(["q0p", "q1p", "r0p", "r1p"], ["a-q1", "a-r0", "b-q1", "b-r0"], { goodNodes: ["r1p"], dimNodes: ["q0", "q1", "r0", "r1"] }),
          previewNote: "The original run alternates symbol moves and free closure.",
          revealNote: "Every such fragment has one ordinary transition with the same effect."
        }
      ],
      previous: { label: "Subset construction", href: "/proofs/chapter-01/subset-construction.html" },
      next: { label: "Kleene equivalence", href: "/proofs/chapter-02/kleene-equivalence.html" }
    },

    "kleene-equivalence": {
      slug: "kleene-equivalence",
      chapter: 2,
      title: "Kleene equivalence",
      theorem: "A language is recognized by a finite automaton iff it is denoted by a regular expression.",
      intro: "The proof is a cycle of executable translations. One direction eliminates states; the other builds an automaton from expression syntax.",
      application: "The completed-session language has two equivalent views: the expression open(edit+save)*close and the four-phase editor DFA. The theorem explains why neither view adds expressive power.",
      strategy: "Prove both inclusions constructively. Encode all automaton paths by a finite induction over permitted intermediate states, and translate expressions back to automata by structural induction over their syntax.",
      invariant: "Every translation preserves exactly the language denoted or recognized by the current representation.",
      synthesis: T`For the automaton-to-expression direction, number the states \(q_1,\ldots,q_n\) and let \(R_{ij}^{(k)}\) denote the labels of paths from \(q_i\) to \(q_j\) whose intermediate states belong to \(\{q_1,\ldots,q_k\}\). The base expressions describe direct transitions and \(\varepsilon\) when \(i=j\). Splitting paths according to whether they use \(q_k\) yields \(R_{ij}^{(k)}=R_{ij}^{(k-1)}+R_{ik}^{(k-1)}(R_{kk}^{(k-1)})^*R_{kj}^{(k-1)}\), so the union of the expressions \(R_{if}^{(n)}\), from the initial state \(q_i\) to every final state \(q_f\), denotes the automaton language. Conversely, structural induction constructs an equivalent \(\varepsilon\)-NFA for every regular expression. Removing \(\varepsilon\)-moves and, if desired, determinizing preserves the language. Both directions therefore define exactly the regular languages.`,
      diagram: {
        description: "The cycle of translations between regular expressions, epsilon NFAs, NFAs, and DFAs.",
        viewBox: [0, 0, 1000, 540],
        nodes: [
          N("regex", 500, 85, "Regular|expression", "syntax", { width: 210 }),
          N("enfa", 820, 270, "ε-NFA", "Thompson", { width: 180 }),
          N("nfa", 500, 455, "NFA", "ε-removal", { width: 180 }),
          N("dfa", 180, 270, "DFA", "subset states", { width: 180 }),
          N("rk", 500, 270, "Rᵏᵢⱼ", "allowed intermediates", { shape: "circle", r: 72 })
        ],
        edges: [
          E("regex-enfa", "regex", "enfa", "structure"),
          E("enfa-nfa", "enfa", "nfa", "remove ε"),
          E("nfa-dfa", "nfa", "dfa", "determinize"),
          E("dfa-regex", "dfa", "regex", "eliminate states"),
          E("dfa-rk", "dfa", "rk", "paths"),
          E("rk-regex", "rk", "regex", "Rⁿ₁f")
        ]
      },
      steps: [
        {
          label: "DFA → Regex",
          title: "Invent the induction parameter",
          exposition: "A finite automaton may traverse cycles arbitrarily many times, so induction on path length would not directly produce a finite expression. Instead, the construction restricts which states may appear internally and enlarges that finite set one state at a time.",
          question: "What does k control in Rᵏᵢⱼ?",
          choices: ["The word length", "Which states may occur internally on a path", "The number of final states"],
          correct: 1,
          hint: "The proof must gradually permit more ways for a run to wander.",
          feedback: "Correct. k turns unrestricted paths into a finite induction over allowed intermediate states.",
          incorrect: "The recurrence is not bounded by the input word or by final states.",
          formal: T`\(R_{ij}^{(k)}\) denotes all labels of paths from \(q_i\) to \(q_j\) whose intermediate states lie among \(q_1,\ldots,q_k\).`,
          preview: V(["dfa"], [], { dimNodes: ["enfa", "nfa"] }),
          reveal: V(["dfa", "rk"], ["dfa-rk"], { goodNodes: ["rk"], dimNodes: ["enfa", "nfa"] }),
          previewNote: "A run may wander through the DFA arbitrarily.",
          revealNote: "The index k exposes that wandering one state at a time."
        },
        {
          label: "DFA → Regex",
          title: "Split paths at qₖ",
          exposition: "When qₖ is admitted as a new intermediate state, every relevant path has a canonical description: it either avoids qₖ or reaches it, performs zero or more qₖ-to-qₖ segments, and finally leaves it toward qⱼ.",
          question: "When qₖ becomes available, how can a path use it?",
          choices: ["Avoid qₖ, or enter it, loop, and leave", "Visit qₖ exactly once", "Only end at qₖ"],
          correct: 0,
          hint: "A path may return to the new intermediate state many times.",
          feedback: "Exactly. The two cases produce union, concatenation, and Kleene star in one recurrence.",
          incorrect: "The new state may be skipped or revisited arbitrarily many times.",
          formal: T`\(R_{ij}^{(k)}=R_{ij}^{(k-1)}+R_{ik}^{(k-1)}(R_{kk}^{(k-1)})^*R_{kj}^{(k-1)}\).`,
          preview: V(["rk"], [], { dimNodes: ["enfa", "nfa"] }),
          reveal: V(["rk", "regex"], ["rk-regex"], { goodNodes: ["regex"], dimNodes: ["enfa", "nfa"] }),
          previewNote: "Every path either avoids the new state or factors through it.",
          revealNote: "The recurrence is itself a regular expression."
        },
        {
          label: "Regex → Automaton",
          title: "Compile syntax compositionally",
          exposition: "The reverse inclusion follows the recursive structure of regular expressions. Atomic expressions have immediate finite automata, while union, concatenation, and star require a model whose components can be connected without consuming an input symbol.",
          question: "Which intermediate model makes union, concatenation, and star local wiring operations?",
          choices: ["A complete DFA", "An ε-NFA", "A pushdown automaton"],
          correct: 1,
          hint: "Free transitions glue sub-automata without consuming input.",
          feedback: "Right. Thompson's construction follows the expression tree and connects pieces with ε-moves.",
          incorrect: "The proof needs a finite-state model whose pieces can be connected for free.",
          formal: T`Structural induction builds \(\varepsilon\)-NFAs for symbols and combines them for \(+\), concatenation, and \(^*\) while preserving denotation.`,
          preview: V(["regex"], [], { dimNodes: ["dfa", "nfa"] }),
          reveal: V(["regex", "enfa"], ["regex-enfa"], { goodNodes: ["enfa"], dimNodes: ["dfa", "nfa"] }),
          previewNote: "The expression already tells us how its parts are composed.",
          revealNote: "The automaton mirrors that syntax tree."
        },
        {
          label: "Equivalence cycle",
          title: "Close the translation loop",
          exposition: "The theorem is an equivalence of expressive power, so language preservation is required in both directions. The intermediate ε-NFA, NFA, and DFA representations do not enlarge the class because each conversion preserves the recognized language.",
          question: "Why does the cycle prove equivalence rather than mere inclusion?",
          choices: ["Every representation is smaller", "There is a language-preserving route in both directions", "All automata are deterministic"],
          correct: 1,
          hint: "An iff needs both constructive directions.",
          feedback: "Exactly. Each formalism can be translated to the other without changing its language.",
          incorrect: "Size and determinism are irrelevant to the logical iff.",
          formal: T`DFA \(\to\) regular expression proves every automaton language is denotable; regular expression \(\to\varepsilon\)-NFA \(\to\) NFA proves every denotation is recognizable.`,
          preview: V(["regex", "enfa", "nfa", "dfa"], [], {}),
          reveal: V(["regex", "enfa", "nfa", "dfa"], ["regex-enfa", "enfa-nfa", "nfa-dfa", "dfa-regex"], { goodNodes: ["regex", "dfa"] }),
          previewNote: "The four representations form a cycle.",
          revealNote: "Every edge preserves the same language."
        }
      ],
      previous: { label: "ε-removal", href: "/proofs/chapter-02/epsilon-removal.html" },
      next: { label: "Closure of regular languages", href: "/proofs/chapter-02/regular-closure.html" }
    },

    "regular-closure": {
      slug: "regular-closure",
      chapter: 2,
      title: "Closure of regular languages",
      theorem: "Regular languages are closed under union, concatenation, star, complement, and intersection.",
      intro: "Closure is not a list to memorize. Each operation has a concrete compiler that stays inside finite automata.",
      application: "Intersect completed editor sessions with “at least one save” to enforce both requirements. Complementing the session monitor instead recognizes malformed event sequences.",
      strategy: "Associate each language operation with a finite-state construction and prove that the constructed automaton has exactly the intended acceptance condition. Positive operations use compositional wiring; Boolean operations use determinism or synchronized products.",
      invariant: "After each construction, the new automaton accepts exactly the result of applying the selected language operation.",
      synthesis: T`Let \(L,L_1,L_2\) be regular. Union, concatenation, and star are regular because the corresponding regular-expression constructors preserve denotation, equivalently because \(\varepsilon\)-NFAs can implement initial choice, finite handoff, and restart. For complement, determinize and complete an automaton for \(L\); every word then has one total run, and replacing \(F\) by \(Q\setminus F\) reverses exactly its acceptance verdict. For intersection, the product automaton on \(Q_1\times Q_2\) advances both components on every symbol and accepts in \(F_1\times F_2\), hence recognizes precisely \(L_1\cap L_2\). Each operation therefore has a finite automaton recognizing its result, so the class of regular languages is closed under all five operations.`,
      diagram: {
        description: "Regular languages at the center of five closure constructions.",
        viewBox: [0, 0, 1000, 560],
        nodes: [
          N("reg", 500, 280, "REG", "finite automata", { shape: "circle", r: 76 }),
          N("union", 180, 105, "L₁ ∪ L₂", "choice", { width: 190 }),
          N("concat", 500, 75, "L₁L₂", "ε-handoff", { width: 190 }),
          N("star", 820, 105, "L*", "restart", { width: 190 }),
          N("comp", 235, 455, "¬L", "swap finals", { width: 190 }),
          N("inter", 765, 455, "L₁ ∩ L₂", "product", { width: 190 })
        ],
        edges: [
          E("e-union", "reg", "union", "ε-NFA"),
          E("e-concat", "reg", "concat", "ε-NFA"),
          E("e-star", "reg", "star", "ε-NFA"),
          E("e-comp", "reg", "comp", "DFA"),
          E("e-inter", "reg", "inter", "Q₁×Q₂")
        ]
      },
      steps: [
        {
          label: "Positive operations",
          title: "Reuse the syntax constructors",
          exposition: "Union, concatenation, and star are already constructors of regular expressions. By Kleene equivalence, their semantic clauses can be transferred directly to finite automata, or implemented explicitly through ε-transitions that choose, hand off, or restart.",
          question: "Which three operations are immediate from regex or ε-NFA composition?",
          choices: ["Union, concatenation, star", "Complement, intersection, reversal", "Only union"],
          correct: 0,
          hint: "They are the constructors in a restricted regular expression.",
          feedback: "Correct. Choice, handoff, and restart directly implement union, concatenation, and star.",
          incorrect: "Look at the three operations already built into regular-expression syntax.",
          formal: T`Kleene equivalence turns expression constructors or \(\varepsilon\)-NFA wiring into finite automata for the resulting languages.`,
          preview: V(["reg"], [], { dimNodes: ["comp", "inter"] }),
          reveal: V(["reg", "union", "concat", "star"], ["e-union", "e-concat", "e-star"], { goodNodes: ["union", "concat", "star"], dimNodes: ["comp", "inter"] }),
          previewNote: "Three operations already have compositional finite-state constructions.",
          revealNote: "Each construction remains inside REG."
        },
        {
          label: "Complement",
          title: "Swap a deterministic verdict",
          exposition: "Complementation must reverse the verdict for every word. This is sound only when each word determines one complete run; nondeterministic failure and missing transitions cannot be interpreted as a single terminal state whose status can simply be swapped.",
          question: "What must happen before swapping final and non-final states?",
          choices: ["Determinize and complete the automaton", "Remove every cycle", "Make every state initial"],
          correct: 0,
          hint: "Every word must have exactly one complete run.",
          feedback: "Exactly. Then the same unique run receives the opposite verdict.",
          incorrect: "A missing or nondeterministic branch prevents a simple verdict swap.",
          formal: T`For a complete DFA, every word has one run ending in \(q\). Replacing \(F\) by \(Q\setminus F\) accepts exactly the words previously rejected.`,
          preview: V(["reg", "comp"], [], { dimNodes: ["union", "concat", "star", "inter"] }),
          reveal: V(["reg", "comp"], ["e-comp"], { goodNodes: ["comp"], dimNodes: ["union", "concat", "star", "inter"] }),
          previewNote: "Complement changes only the verdict, not the run.",
          revealNote: "Completeness and determinism make that verdict total and unique."
        },
        {
          label: "Intersection",
          title: "Run both obligations together",
          exposition: "A word belongs to an intersection exactly when both source automata accept that same word. The construction therefore synchronizes their transitions and records the two current states as one ordered pair.",
          question: "What state space tracks both automata after the same prefix?",
          choices: ["Q₁∪Q₂", "Q₁×Q₂", "2^(Q₁∩Q₂)"],
          correct: 1,
          hint: "A state must remember one current state from each automaton.",
          feedback: "Right. The product accepts exactly when both components are final.",
          incorrect: "The construction needs an ordered pair of simultaneous states.",
          formal: T`The product transition advances both components on the same symbol and uses accepting set \(F_1\times F_2\).`,
          preview: V(["reg", "inter"], [], { dimNodes: ["union", "concat", "star", "comp"] }),
          reveal: V(["reg", "inter"], ["e-inter"], { goodNodes: ["inter"], dimNodes: ["union", "concat", "star", "comp"] }),
          previewNote: "Intersection requires two runs to agree on the same word.",
          revealNote: "The product stores both run states at once."
        },
        {
          label: "Closure",
          title: "Read the theorem operationally",
          exposition: "Closure is established by the existence of effective constructions, not merely by a set-theoretic assertion. Each compound operation can be compiled to another finite automaton, preserving the algorithms and decision procedures available for regular languages.",
          question: "What does closure give us in verification?",
          choices: ["A compiler for compound regular properties", "A guarantee that every language is regular", "A smaller automaton in every case"],
          correct: 0,
          hint: "Closure preserves the class while combining properties.",
          feedback: "Exactly. Compound properties can be built without leaving the decidable finite-state world.",
          incorrect: "Closure preserves membership in REG; it does not cover all languages or guarantee compactness.",
          formal: "Each listed operation has a language-preserving finite automaton construction, hence its result is regular.",
          preview: V(["reg"], [], {}),
          reveal: V(["reg", "union", "concat", "star", "comp", "inter"], ["e-union", "e-concat", "e-star", "e-comp", "e-inter"], { goodNodes: ["reg"] }),
          previewNote: "Five constructions surround the same language class.",
          revealNote: "Every outgoing operation returns to REG."
        }
      ],
      previous: { label: "Kleene equivalence", href: "/proofs/chapter-02/kleene-equivalence.html" },
      next: { label: "Small model property", href: "/proofs/chapter-02/small-model-property.html" }
    },

    "small-model-property": {
      slug: "small-model-property",
      chapter: 2,
      title: "Small model property",
      theorem: "If an n-state DFA accepts any word, it accepts one of length less than n.",
      intro: "A shortest accepting run cannot repeat a state. If it did, the loop between the repetitions could be deleted.",
      application: "If a finite-state checker accepts some malformed editor session, then it accepts a shortest malformed trace. The theorem bounds that counterexample by the checker’s number of states.",
      strategy: "Choose a shortest accepted word and argue by contradiction. If its run is too long, the pigeonhole principle forces a repeated state, and determinism permits deletion of the intervening loop without changing the accepting suffix.",
      invariant: "The shortened run reaches the same state after the removed loop and therefore preserves its accepting suffix.",
      synthesis: T`Assume \(L(A)\neq\varnothing\) and choose an accepted word \(z\) of minimum length. Write its run as \(p_0,p_1,\ldots,p_m\), where \(m=|z|\). If \(m\ge n\), the run contains at least \(n+1\) state occurrences but \(A\) has only \(n\) states, so \(p_i=p_j\) for some \(i<j\). Factor \(z=uvw\) with \(|u|=i\) and \(|uv|=j\). Since the run reaches the same state after \(u\) and \(uv\), determinism allows the suffix \(w\) to continue from either occurrence; hence \(uw\) is accepted. Because \(v\neq\varepsilon\), \(|uw|<|z|\), contradicting the minimality of \(z\). Therefore \(|z|<n\), so every nonempty DFA language has an accepted witness shorter than its number of states.`,
      diagram: {
        description: "A shortest accepting run with a repeated state and the shortcut obtained by removing the loop.",
        viewBox: [0, 0, 1000, 520],
        nodes: [
          N("p0", 110, 250, "p₀", "start", { shape: "circle" }),
          N("pi", 330, 250, "pᵢ", "after u", { shape: "circle" }),
          N("mid", 500, 115, "v", "non-empty loop", { width: 160 }),
          N("pj", 665, 250, "pⱼ=pᵢ", "same state", { shape: "circle" }),
          N("pm", 890, 250, "pₘ", "final", { shape: "circle", accepting: true })
        ],
        edges: [
          E("u", "p0", "pi", "u", { labelY: 232 }),
          E("v-in", "pi", "mid", "", {}),
          E("v-out", "mid", "pj", "v", {}),
          E("w", "pj", "pm", "w", { labelY: 232 }),
          E("shortcut", "pi", "pm", "skip v", { path: "M 375 282 C 515 440 745 440 850 282", labelX: 620, labelY: 425 })
        ]
      },
      steps: [
        {
          label: "Minimal witness",
          title: "Choose the shortest accepted word",
          exposition: "The statement asserts the existence of a bounded witness, so it is natural to reason from a witness of minimum length. Minimality supplies the contradiction criterion: any accepted word obtained by deleting a nonempty factor must be impossible.",
          question: "Why begin with a minimum-length accepted word z?",
          choices: ["So any shorter accepted word creates a contradiction", "So the DFA becomes deterministic", "So every state is visited"],
          correct: 0,
          hint: "The proof will try to remove part of z.",
          feedback: "Correct. Minimality turns a successful shortcut into the contradiction we need.",
          incorrect: "The role of minimality is to rule out a shorter accepted witness.",
          formal: T`Assume \(L(A)\neq\varnothing\) and choose \(z\) of minimum accepted length. Any strictly shorter accepted word contradicts this choice.`,
          preview: V([], [], { dimNodes: ["mid"] }),
          reveal: V(["p0", "pi", "pj", "pm"], ["u", "w"], { goodNodes: ["pm"], dimNodes: ["mid"] }),
          previewNote: "Start with an accepting run whose label is as short as possible.",
          revealNote: "The final state fixes the suffix that must be preserved."
        },
        {
          label: "Pigeonhole",
          title: "Force a repeated state",
          exposition: "A word of length m induces m transitions but m+1 visited positions, including the initial state. If the word is at least as long as the number of states, these positions cannot all contain distinct states.",
          question: "If |z|≥n, how many state occurrences does its run contain?",
          choices: ["At least n+1", "Exactly n", "At most n−1"],
          correct: 0,
          hint: "A word of length m visits one state before reading and one after every symbol.",
          feedback: "Exactly. n+1 occurrences among n states force pᵢ=pⱼ.",
          incorrect: "Remember to count the initial state p₀ as well.",
          formal: T`A run of length \(m\) has \(m+1\) state occurrences. If \(m\ge n\), the pigeonhole principle gives equal states at two positions \(i<j\).`,
          preview: V(["p0", "pi", "pj", "pm"], ["u", "w"], { dimNodes: ["mid"] }),
          reveal: V(["pi", "pj", "mid"], ["v-in", "v-out"], { goodNodes: ["pi", "pj"], dimNodes: ["p0", "pm"] }),
          previewNote: "Too many positions must reuse one of the n states.",
          revealNote: "The repeated state encloses a non-empty closed loop v."
        },
        {
          label: "Loop deletion",
          title: "Splice the run",
          exposition: "The repeated state makes the factor between its two occurrences operationally redundant. Because the automaton is deterministic, the suffix beginning at the second occurrence can be executed unchanged from the first occurrence.",
          question: "What word follows the shortcut from pᵢ directly into the old suffix?",
          choices: ["uvw", "uw", "vw"],
          correct: 1,
          hint: "Delete exactly the factor labelling the closed loop.",
          feedback: "Right. Because pᵢ=pⱼ, the suffix w can continue unchanged after u.",
          incorrect: "The shortcut removes v and keeps both the prefix and accepting suffix.",
          formal: T`Since \(q_0\xrightarrow{u}p_i=p_j\xrightarrow{w}p_m\), the word \(uw\) is accepted and \(|uw|<|uvw|\).`,
          preview: V(["pi", "mid", "pj"], ["v-in", "v-out"], { dimNodes: ["p0", "pm"] }),
          reveal: V(["p0", "pi", "pm"], ["u", "shortcut"], { goodNodes: ["pm"], dimNodes: ["mid", "pj"] }),
          previewNote: "The loop returns to the same state.",
          revealNote: "Removing it leaves the accepting continuation intact."
        },
        {
          label: "Bound",
          title: "Conclude |z|<n",
          exposition: "The shortened word preserves acceptance and is strictly shorter, so it contradicts the selected witness. The only assumption introduced to force the repetition was that the minimal accepted word had length at least n.",
          question: "Which assumption caused the contradiction?",
          choices: ["|z|≥n", "The DFA is complete", "z is accepted"],
          correct: 0,
          hint: "The repetition was forced only by the length bound.",
          feedback: "Exactly. A shortest accepted word cannot be that long, so some accepted word has length below n.",
          incorrect: "Acceptance and determinism remain; the excessive length is what must fail.",
          formal: T`If the minimal accepted word had length at least \(n\), loop deletion would produce a shorter accepted word. Therefore its length is less than \(n\).`,
          preview: V(["p0", "pi", "pj", "pm"], ["u", "v-in", "v-out", "w"], {}),
          reveal: V(["p0", "pi", "pm"], ["u", "shortcut"], { goodNodes: ["p0", "pi", "pm"], dimNodes: ["mid", "pj"] }),
          previewNote: "A repeated state certifies removable redundancy.",
          revealNote: "A minimal accepting run is simple and visits at most n states."
        }
      ],
      previous: { label: "Closure of regular languages", href: "/proofs/chapter-02/regular-closure.html" },
      next: { label: "Myhill–Nerode", href: "/proofs/chapter-02/myhill-nerode.html" }
    },

    "myhill-nerode": {
      slug: "myhill-nerode",
      chapter: 2,
      title: "Myhill–Nerode theorem",
      theorem: "Regularity, a finite compatible right-invariant quotient, and finite index of ∼L are equivalent.",
      intro: "The proof is a three-step cycle: automata create finite memory classes, every valid grouping refines future behavior, and the future-behavior classes become a quotient DFA.",
      application: "For completed editor sessions, prefixes fall into four future-behaviour classes: before open, currently open, already closed, and irreparably malformed. These classes are exactly the minimal DFA states.",
      strategy: "Prove a cycle of implications. Extract a finite right-invariant relation from DFA states, compare every such relation with the canonical future-equivalence ∼L, and finally use the finitely many ∼L classes as states of a quotient automaton.",
      invariant: "Words in one class must remain together after the same suffix and must receive the same acceptance verdict.",
      synthesis: T`If \(L\) is recognized by a DFA \(A\), define \(x\sim_A y\) when \(\widehat{\delta}(q_0,x)=\widehat{\delta}(q_0,y)\). This relation has at most \(|Q|\) classes, is preserved by appending the same suffix, and never identifies an accepted word with a rejected one. Conversely, any finite-index right-invariant relation \(\sim\) compatible with \(L\) refines the canonical relation \(\sim_L\): from \(x\sim y\), right-invariance gives \(xz\sim yz\) for every \(z\), and compatibility gives \(xz\in L\) iff \(yz\in L\). Thus \(\sim_L\) also has finite index. Finally, if \(\sim_L\) has finite index, construct a DFA whose states are \(\Sigma^*/{\sim_L}\), with initial state \([\varepsilon]\), transition \(\delta([w],a)=[wa]\), and final classes \([w]\) with \(w\in L\). Right-invariance and compatibility make the construction well-defined, and the resulting DFA recognizes exactly \(L\).`,
      diagram: {
        description: "The three implications of the Myhill Nerode equivalence cycle.",
        viewBox: [0, 0, 1000, 540],
        nodes: [
          N("regular", 500, 90, "(1) Regular", "a DFA exists", { width: 220 }),
          N("relation", 190, 410, "(2) Finite relation", "right-invariant", { width: 240 }),
          N("mn", 810, 410, "(3) Finite ∼L", "same futures", { width: 220 }),
          N("quotient", 500, 330, "Σ*/∼L", "quotient states", { shape: "circle", r: 76 })
        ],
        edges: [
          E("one-two", "regular", "relation", "DFA relation"),
          E("two-three", "relation", "mn", "refines ∼L", { labelY: 392 }),
          E("three-one", "mn", "regular", "quotient DFA"),
          E("mn-quotient", "mn", "quotient", "classes"),
          E("quotient-regular", "quotient", "regular", "finite automaton")
        ]
      },
      steps: [
        {
          label: "(1) ⇒ (2)",
          title: "Turn DFA states into memory classes",
          exposition: "A DFA state summarizes all information about a prefix that can affect the processing of future suffixes. Prefixes reaching the same state therefore induce identical continuations and can be placed in the same finite equivalence class.",
          question: "When should two words be equivalent under the automaton relation?",
          choices: ["When they reach the same DFA state", "When they have equal length", "When both contain a"],
          correct: 0,
          hint: "A state is precisely the memory retained after a prefix.",
          feedback: "Correct. Same state means every common suffix evolves identically and gets the same verdict.",
          incorrect: "The relation must capture the automaton's actual stored memory.",
          formal: T`Define \(x\sim_A y\) iff \(\widehat{\delta}(q_0,x)=\widehat{\delta}(q_0,y)\). It is right-invariant, compatible with \(L\), and has at most \(|Q|\) classes.`,
          preview: V(["regular"], [], { dimNodes: ["mn", "quotient"] }),
          reveal: V(["regular", "relation"], ["one-two"], { goodNodes: ["relation"], dimNodes: ["mn", "quotient"] }),
          previewNote: "A DFA compresses every prefix into one of finitely many states.",
          revealNote: "Those state fibers are finite memory classes."
        },
        {
          label: "(2) ⇒ (3)",
          title: "Compare any grouping with ∼L",
          exposition: "The relation ∼L identifies prefixes exactly when no suffix can distinguish their membership in L. Any right-invariant relation compatible with L must be at least as discriminating, because merging two distinguishable prefixes would eventually violate compatibility.",
          question: "If x∼y and the relation is right-invariant and compatible, what follows?",
          choices: ["x∼L y", "x and y are the same word", "Every suffix is accepted"],
          correct: 0,
          hint: "Append an arbitrary z, then use compatibility.",
          feedback: "Exactly. Every valid class fits inside one ∼L class, so ∼L has no more classes.",
          incorrect: "The conclusion is equality of future acceptance behavior, not literal word equality.",
          formal: T`\(x\sim y\) implies \(xz\sim yz\) for every \(z\); compatibility gives \(xz\in L\) iff \(yz\in L\). Hence \(x\sim_L y\), so \(\sim\) refines \(\sim_L\).`,
          preview: V(["relation"], [], { dimNodes: ["regular", "quotient"] }),
          reveal: V(["relation", "mn"], ["two-three"], { goodNodes: ["mn"], dimNodes: ["regular", "quotient"] }),
          previewNote: "A valid grouping cannot merge prefixes with distinguishable futures.",
          revealNote: "The canonical ∼L quotient is at least as coarse and therefore still finite."
        },
        {
          label: "(3) ⇒ (1)",
          title: "Make equivalence classes into states",
          exposition: "Finite future behavior already provides the finite memory required by an automaton. The transition should append one symbol to a representative, but this is meaningful only if all representatives of a class lead to the same successor class.",
          question: "Why is δ([w],a)=[wa] well-defined?",
          choices: ["Because ∼L is right-invariant", "Because all words are finite", "Because L is already regular"],
          correct: 0,
          hint: "Different representatives of [w] must move to the same next class.",
          feedback: "Correct. Right-invariance makes the transition independent of the chosen representative.",
          incorrect: "The construction cannot assume regularity; it is proving regularity.",
          formal: T`Use states \(\Sigma^*/{\sim_L}\), start state \([\varepsilon]\), transition \([w]\mapsto[wa]\), and final classes \(\{[w]\mid w\in L\}\). Right-invariance and compatibility make both definitions well-defined.`,
          preview: V(["mn"], [], { dimNodes: ["relation"] }),
          reveal: V(["mn", "quotient", "regular"], ["mn-quotient", "quotient-regular", "three-one"], { goodNodes: ["quotient", "regular"], dimNodes: ["relation"] }),
          previewNote: "Finite future-behavior classes are already candidate states.",
          revealNote: "The quotient DFA closes the implication cycle."
        }
      ],
      previous: { label: "Small model property", href: "/proofs/chapter-02/small-model-property.html" },
      next: { label: "ω-regular closure", href: "/proofs/chapter-03/omega-closure.html" }
    },

    "omega-closure": {
      slug: "omega-closure",
      chapter: 3,
      title: "Basic ω-regular closure",
      theorem: "ω-regular languages are closed under ω-power, finite-prefix concatenation, union, and intersection.",
      intro: "Infinite acceptance changes the constructions: intersection must alternate two recurring obligations instead of waiting for simultaneous final states.",
      application: "Take U={open} and V=(edit+idle+save)*save. The language UVω opens the editor once and then completes infinitely many finite operation blocks, each ending in save.",
      strategy: "Reduce every operation to a finite-state Büchi construction. Finite choices and handoffs use nondeterminism, while recurring requirements are represented by accepting markers whose infinite recurrence is proved equivalent to the source acceptance conditions.",
      invariant: "The constructed Büchi run visits its accepting marker infinitely often exactly when every required source obligation is fulfilled infinitely often.",
      synthesis: T`For \(V^\omega\), use an automaton for the finite, nonempty \(V\)-blocks and, whenever a block is completed, allow a nondeterministic restart through an accepting marker; visiting that marker infinitely often is equivalent to completing infinitely many consecutive \(V\)-blocks. For \(V\cdot L\), simulate \(V\) for a finite prefix and nondeterministically transfer to a Büchi automaton for \(L\) when a \(V\)-final state is reached. Union is obtained by an initial nondeterministic choice between the two Büchi automata. For intersection, the ordinary synchronous product is augmented with a finite phase component: phase one waits for \(F_1\), phase two waits for \(F_2\), and completing both phases visits an accepting marker before resetting. This marker recurs infinitely often iff both component runs visit their respective final sets infinitely often. Hence every listed operation preserves \(\omega\)-regularity.`,
      diagram: {
        description: "Four omega regular closure constructions around a recurring acceptance controller.",
        viewBox: [0, 0, 1000, 560],
        nodes: [
          N("omega", 500, 280, "ω-REG", "Büchi languages", { shape: "circle", r: 78 }),
          N("power", 185, 105, "Vω", "restart blocks", { width: 190 }),
          N("concat", 500, 75, "V·L", "finite handoff", { width: 190 }),
          N("union", 815, 105, "L₁∪L₂", "initial guess", { width: 190 }),
          N("phase1", 250, 455, "wait F₁", "phase 1", { width: 180 }),
          N("phase2", 750, 455, "wait F₂", "phase 2", { width: 180 }),
          N("accept", 500, 455, "cycle complete", "Büchi marker", { shape: "circle", r: 58, accepting: true })
        ],
        edges: [
          E("power-e", "omega", "power", "closure"),
          E("concat-e", "omega", "concat", "closure"),
          E("union-e", "omega", "union", "closure"),
          E("f1", "phase1", "accept", "hit F₁"),
          E("f2", "accept", "phase2", "now wait F₂"),
          E("reset", "phase2", "phase1", "hit F₂", { path: "M 700 485 C 560 555 410 555 300 485", labelX: 500, labelY: 545 })
        ]
      },
      steps: [
        {
          label: "ω-power",
          title: "Turn completed blocks into recurring visits",
          exposition: "A word belongs to Vω when it admits a decomposition into infinitely many consecutive nonempty blocks from V. The construction must therefore convert each finite block completion into one visit of a Büchi accepting state, so that infinitely many blocks yield infinitely many accepting visits.",
          question: "What should the Büchi automaton revisit after every accepted V-block?",
          choices: ["The block start state", "A dead state", "The previous input symbol"],
          correct: 0,
          hint: "Infinitely many blocks need infinitely many visible completions.",
          feedback: "Correct. Returning through an accepting start marker records one completed block each time.",
          incorrect: "The Büchi condition needs a state that is revisited once per completed block.",
          formal: T`Whenever a run of the \(V\)-automaton reaches a final state, add the nondeterministic option to restart at \(q_0\) through an accepting marker. Infinite visits to that marker correspond to infinitely many consecutive nonempty \(V\)-blocks.`,
          preview: V(["omega"], [], { dimNodes: ["phase1", "phase2", "accept"] }),
          reveal: V(["omega", "power"], ["power-e"], { goodNodes: ["power"], dimNodes: ["phase1", "phase2", "accept"] }),
          previewNote: "Vω requires infinitely many finite block completions.",
          revealNote: "A recurring start marker turns those completions into Büchi acceptance."
        },
        {
          label: "Concatenation and union",
          title: "Use nondeterminism at a finite boundary",
          exposition: "Finite-prefix concatenation requires selecting the point at which the finite V-prefix ends and the infinite L-run begins. Union similarly requires selecting one component whose run will witness acceptance; both are existential choices that Büchi nondeterminism can perform finitely.",
          question: "What do V·L and L₁∪L₂ both need?",
          choices: ["A finite nondeterministic handoff or choice", "A deterministic complement", "A stack"],
          correct: 0,
          hint: "Only one finite decision separates the modes.",
          feedback: "Exactly. The run chooses when to hand off, or which component to follow.",
          incorrect: "No unbounded memory is needed; the construction makes one finite-mode choice.",
          formal: T`For \(V\cdot L\), jump to the \(L\)-automaton when a \(V\)-prefix finishes. For union, a fresh start duplicates the outgoing choices of both components.`,
          preview: V(["omega"], [], { dimNodes: ["phase1", "phase2", "accept"] }),
          reveal: V(["omega", "concat", "union"], ["concat-e", "union-e"], { goodNodes: ["concat", "union"], dimNodes: ["phase1", "phase2", "accept"] }),
          previewNote: "Both constructions select one continuation mode.",
          revealNote: "Nondeterminism implements that finite existential choice."
        },
        {
          label: "Intersection",
          title: "Reject simultaneous-final thinking",
          exposition: "The synchronous product correctly follows both component runs, but the accepting set F₁×F₂ does not express Büchi intersection. Each component may visit its own final set infinitely often at different positions, so simultaneous finality may never occur.",
          question: "Why is F₁×F₂ too strict for Büchi intersection?",
          choices: ["The two runs may visit their final sets at different times", "Products are infinite", "Büchi automata have no final states"],
          correct: 0,
          hint: "One component may accept on even positions and the other on odd positions.",
          feedback: "Correct. Both obligations can recur forever without ever occurring simultaneously.",
          incorrect: "The problem is temporal alignment, not the existence or size of the product.",
          formal: T`Büchi acceptance requires visits to each of \(F_1\) and \(F_2\) infinitely often, not visits to \(F_1\times F_2\) at common instants.`,
          preview: V(["phase1", "phase2"], [], { dimNodes: ["power", "concat", "union"] }),
          reveal: V(["phase1", "phase2"], [], { badNodes: ["accept"], dimNodes: ["power", "concat", "union"] }),
          previewNote: "Two recurring sequences need not be synchronized.",
          revealNote: "A single simultaneous-final checkpoint can miss valid intersections."
        },
        {
          label: "Intersection",
          title: "Alternate the obligations",
          exposition: "A finite phase bit repairs the temporal mismatch. The product first waits until the first component reaches F₁, then waits until the second reaches F₂, and records one completed round before returning to the first obligation.",
          question: "When should the product mark one accepting cycle as complete?",
          choices: ["After seeing F₁ and then F₂", "After seeing either one once", "At every transition"],
          correct: 0,
          hint: "The controller must certify both recurring obligations.",
          feedback: "Exactly. Infinitely many completed phases imply infinitely many visits to both F₁ and F₂.",
          incorrect: "One complete round must witness both source acceptance sets.",
          formal: T`The phase component waits for \(F_1\), then \(F_2\), then emits an accepting marker and resets. Marker recurrence is equivalent to both obligations recurring.`,
          preview: V(["phase1"], [], { dimNodes: ["power", "concat", "union"] }),
          reveal: V(["phase1", "accept", "phase2"], ["f1", "f2", "reset"], { goodNodes: ["accept"], dimNodes: ["power", "concat", "union"] }),
          previewNote: "The controller begins by waiting for F₁.",
          revealNote: "A completed round records F₁ followed by F₂, and then starts again."
        }
      ],
      previous: { label: "Myhill–Nerode", href: "/proofs/chapter-02/myhill-nerode.html" },
      next: { label: "Büchi–expression equivalence", href: "/proofs/chapter-03/buchi-expression-equivalence.html" }
    },

    "buchi-expression-equivalence": {
      slug: "buchi-expression-equivalence",
      chapter: 3,
      title: "Büchi–expression equivalence",
      theorem: "A language of infinite words is Büchi-recognizable iff it is denoted by an ω-regular expression.",
      intro: "An accepting infinite run must pass through some final state infinitely often. Cutting the run right after each such visit splits it into one finite prefix followed by infinitely many non-empty loops back to that state — a shape usually called a lasso.",
      application: "For the editor, U={open} is the finite initialization and each V-block ends in save. The accepting Büchi checkpoint records exactly those recurring block completions.",
      strategy: "Translate expression terms to Büchi automata by recording infinitely many block completions. For the converse, decompose every accepting run around one final state that recurs infinitely often and describe its prefix and return segments by regular path languages. In lecture this recurring state is written qᵢ over an alphabet A; this page keeps f∈F and Σ to match the rest of the book, but they name the same objects.",
      invariant: "Every displayed finite block labels a real path with the stated endpoints; concatenating the blocks therefore yields one infinite run.",
      synthesis: T`Every \(\omega\)-regular expression is a finite union of terms \(UV^\omega\) with regular \(U\) and \(V\subseteq\Sigma^+\) (written over an alphabet \(A\) in lecture, \(\Sigma\) in this book). For one term, a Büchi automaton first simulates an automaton for \(U\), nondeterministically transfers to an automaton for \(V\), and visits an accepting restart marker whenever a \(V\)-block is completed; the marker recurs exactly for words in \(UV^\omega\). Conversely, let \(\mathcal{A}\) be a Büchi automaton and let \(W_{s,s'}\) be the regular language of finite labels taking \(s\) to \(s'\). Every accepting run visits some fixed \(f\in F\) infinitely often (called \(q_i\) in lecture). Cutting at successive \(f\)-visits yields a prefix in \(W_{q_0,f}\) followed by infinitely many nonempty blocks in \(W_{f,f}\setminus\{\varepsilon\}\). Conversely, concatenating paths described by such blocks produces an accepting run recurring at \(f\). Therefore \(L(\mathcal{A})=\bigcup_{f\in F}W_{q_0,f}(W_{f,f}\setminus\{\varepsilon\})^\omega\), a finite \(\omega\)-regular expression.`,
      diagram: {
        description: "A prefix into a recurring accepting state and an infinite sequence of non-empty loops.",
        viewBox: [0, 0, 1000, 540],
        nodes: [
          N("expr", 140, 95, "UVω", "expression term", { width: 170 }),
          N("q0", 160, 330, "q₀", "start", { shape: "circle" }),
          N("f", 545, 330, "f", "recurrent final", { shape: "circle", r: 54, accepting: true }),
          N("loop1", 760, 180, "v₁", "non-empty", { width: 150 }),
          N("loop2", 880, 330, "v₂,v₃,…", "repeat forever", { width: 170 }),
          N("union", 500, 95, "⋃f∈F", "one term per final", { width: 220 })
        ],
        edges: [
          E("prefix", "q0", "f", "u∈Wq₀,f", { labelY: 310 }),
          E("loop-in", "f", "loop1", "Wf,f"),
          E("loop-out", "loop1", "f", "return", { path: "M 720 210 C 620 245 610 270 590 292", labelX: 675, labelY: 250 }),
          E("repeat", "f", "loop2", "ω"),
          E("expr-run", "expr", "q0", "build"),
          E("run-union", "f", "union", "choose recurrent f"),
          E("union-expr", "union", "expr", "ω-expression")
        ]
      },
      steps: [
        {
          label: "Expression → Automaton",
          title: "Compile one term UVω",
          exposition: "A term UVω separates one finite prefix from an infinite sequence of V-blocks. A Büchi construction must recognize the U-prefix once, then expose every later V-completion as a recurring accepting event.",
          question: "What behavior must the automaton perform after the U-prefix?",
          choices: ["Complete infinitely many V-blocks", "Stop immediately", "Read one V-block only"],
          correct: 0,
          hint: "The exponent ω means an infinite block sequence.",
          feedback: "Correct. A Büchi marker is visited once per completed V-block.",
          incorrect: "The infinite suffix requires recurring, not one-time, completion.",
          formal: T`Simulate an automaton for \(U\), switch to one for \(V\), and restart \(V\) through an accepting marker after every completed nonempty block.`,
          preview: V(["expr"], [], { dimNodes: ["union", "loop1", "loop2"] }),
          reveal: V(["expr", "q0", "f", "loop1"], ["expr-run", "prefix", "loop-in", "loop-out"], { goodNodes: ["f"], dimNodes: ["union", "loop2"] }),
          previewNote: "One expression term specifies a finite phase and an infinite phase.",
          revealNote: "The Büchi run records every completed V-block."
        },
        {
          label: "Automaton → Expression",
          title: "Find one recurrent final state",
          exposition: "An accepting run may move among several final states, but the set F is finite. Infinitely many visits distributed over finitely many candidates guarantee that at least one particular final state occurs infinitely often.",
          question: "Why must an accepting run revisit some fixed f∈F infinitely often?",
          choices: ["F is finite", "The alphabet is unary", "The run is deterministic"],
          correct: 0,
          hint: "Infinitely many accepting visits are distributed among finitely many final states.",
          feedback: "Exactly. Infinite pigeonhole selects one final state f that recurs forever.",
          incorrect: "The argument uses finiteness of the final-state set, not determinism or alphabet size.",
          formal: T`A Büchi-accepting run visits \(F\) infinitely often. Since \(F\) is finite, at least one \(f\in F\) occurs infinitely often. In lecture this recurring state is written \(q_i\).`,
          preview: V(["q0", "f"], ["prefix"], { dimNodes: ["expr", "union", "loop1", "loop2"] }),
          reveal: V(["f"], [], { goodNodes: ["f"], dimNodes: ["expr", "union", "q0", "loop1", "loop2"] }),
          previewNote: "The accepting run may visit several final states.",
          revealNote: "One particular f must still occur infinitely often."
        },
        {
          label: "Automaton → Expression",
          title: "Cut the run at repeated f-visits",
          exposition: "Once a recurrent final state f is fixed, the infinite run can be factored at successive occurrences of f. The first segment reaches f from the initial state; every later segment returns from f to f and must consume input to advance along the infinite word.",
          question: "Why exclude ε from the loop language Wf,f?",
          choices: ["Successive marked visits must consume at least one symbol", "ε is never regular", "The prefix already contains ε"],
          correct: 0,
          hint: "Two successive positions in an infinite word cannot be separated by zero input forever.",
          feedback: "Correct. Non-empty blocks ensure their ω-concatenation denotes a genuine infinite word.",
          incorrect: "ε is regular, but empty repeated blocks would not advance along the input.",
          formal: T`The prefix lies in \(W_{q_0,f}\), and every later segment lies in \(W_{f,f}\setminus\{\varepsilon\}\); their concatenation lies in \(W_{q_0,f}(W_{f,f}\setminus\{\varepsilon\})^\omega\).`,
          preview: V(["q0", "f"], ["prefix"], { dimNodes: ["expr", "union"] }),
          reveal: V(["q0", "f", "loop1", "loop2"], ["prefix", "loop-in", "loop-out", "repeat"], { goodNodes: ["f"], dimNodes: ["expr", "union"] }),
          previewNote: "Mark successive positions where the run returns to f.",
          revealNote: "The cuts expose one finite prefix and infinitely many non-empty loops."
        },
        {
          label: "Equality",
          title: "Take the finite union over F",
          exposition: "Different accepting runs may have different recurrent final states, so no single term need describe the entire language. Taking one term for each f∈F covers every accepting run, and finiteness of F keeps the expression within the allowed syntax.",
          question: "Why is the resulting union still an ω-regular expression?",
          choices: ["There are finitely many final states", "Every loop has length one", "The automaton has one run"],
          correct: 0,
          hint: "The expression contributes one UVω term for each f.",
          feedback: "Exactly. A finite union covers every possible recurrent final state.",
          incorrect: "Runs and loop lengths may vary; only the finite number of candidate f matters.",
          formal: T`\(L(A)=\bigcup_{f\in F}W_{q_0,f}(W_{f,f}\setminus\{\varepsilon\})^\omega\). Both inclusions follow by cutting or concatenating paths.`,
          preview: V(["f", "union"], ["run-union"], { dimNodes: ["loop1", "loop2"] }),
          reveal: V(["union", "expr"], ["union-expr"], { goodNodes: ["union", "expr"], dimNodes: ["q0", "f", "loop1", "loop2"] }),
          previewNote: "Each recurrent final state yields one expression term.",
          revealNote: "Their finite union denotes exactly the automaton language."
        }
      ],
      previous: { label: "ω-regular closure", href: "/proofs/chapter-03/omega-closure.html" },
      next: { label: "Büchi complementation", href: "/proofs/chapter-04/buchi-complementation.html" }
    },

    "buchi-complementation": {
      slug: "buchi-complementation",
      chapter: 4,
      title: "Büchi complementation",
      theorem: "The complement of every ω-regular language is ω-regular.",
      intro: "The proof partitions all infinite words into finitely many class products. Saturation makes each product entirely accepted or entirely rejected.",
      application: "The complement of “save infinitely often” is “save only finitely often”. Finite transition profiles classify operation blocks finely enough to collect precisely the products with no recurrent-save witness.",
      strategy: "Replace arbitrary finite blocks by a finite transition-profile congruence, use homogeneous decompositions to cover all infinite words by finitely many products UVω, and prove that each product is saturated with respect to acceptance. The complement is then the union of the rejected products.",
      invariant: "Every classified product UVω lies wholly on one side of L, and the classified products cover every ω-word.",
      synthesis: T`Fix a Büchi automaton \(A\) for \(L\) and classify finite words by the state-to-state reachability they induce, recording also whether an accepting state can be visited along each segment. This finite-index congruence \(\approx_A\) has regular classes. Suitable linked pairs of classes \(U,V\) determine products \(UV^\omega\). Saturation shows that if one member of such a product has an accepting run, then equivalent block replacements preserve its boundary states and accepting visits, so every member is accepted; otherwise the entire product is disjoint from \(L\). A Ramsey-style homogeneous factorization places every infinite word in at least one linked product \(UV^\omega\), and only finitely many pairs of classes exist. Therefore \(\Sigma^\omega\setminus L\) is exactly the finite union of all products disjoint from \(L\). Each product is \(\omega\)-regular because \(U\) and \(V\) are regular, and finite union preserves \(\omega\)-regularity.`,
      diagram: {
        description: "Finite class products split by saturation into the language and its complement.",
        viewBox: [0, 0, 1000, 560],
        nodes: [
          N("profiles", 155, 120, "≈A classes", "finite profiles", { width: 200 }),
          N("product1", 155, 320, "UVω", "class product", { width: 180 }),
          N("product2", 390, 320, "U′V′ω", "class product", { width: 180 }),
          N("language", 690, 165, "L(A)", "accepted products", { width: 210 }),
          N("complement", 690, 420, "¬L(A)", "rejected products", { width: 210 }),
          N("union", 900, 420, "finite union", "ω-regular", { width: 165 })
        ],
        edges: [
          E("profiles-p1", "profiles", "product1", "pair U,V"),
          E("profiles-p2", "profiles", "product2", "pair U′,V′"),
          E("p1-l", "product1", "language", "saturated"),
          E("p1-c", "product1", "complement", "or"),
          E("p2-l", "product2", "language", "saturated"),
          E("p2-c", "product2", "complement", "or"),
          E("c-union", "complement", "union", "collect")
        ]
      },
      steps: [
        {
          label: "Finite abstraction",
          title: "Classify finite blocks by transition profile",
          exposition: "Exact finite words contain more information than the Büchi automaton can observe. The proof quotients them by the finite behavior relevant to stitching runs: possible boundary states and whether a segment can witness a visit to F.",
          question: "What information must two equivalent blocks preserve?",
          choices: ["Reachability between states and whether F can be visited", "Only their length", "Only their last symbol"],
          correct: 0,
          hint: "Replacing one block must preserve the ability to stitch an accepting run.",
          feedback: "Correct. The profile remembers endpoints and whether a segment can witness an accepting visit.",
          incorrect: "Length or final symbol alone cannot preserve arbitrary automaton behavior.",
          formal: T`The congruence \(\approx_A\) equates words with the same state-to-state reachability and accepting-visit profile. It has finite index.`,
          preview: V(["profiles"], [], { dimNodes: ["language", "complement", "union"] }),
          reveal: V(["profiles", "product1", "product2"], ["profiles-p1", "profiles-p2"], { goodNodes: ["profiles"], dimNodes: ["language", "complement", "union"] }),
          previewNote: "A finite automaton can observe only finitely many block behaviors.",
          revealNote: "Pairs of profile classes generate finitely many products UVω."
        },
        {
          label: "Saturation",
          title: "Make each product all-or-nothing",
          exposition: "A class product UVω permits each finite factor to be replaced by another word with the same transition profile. Because these replacements preserve the required endpoints and accepting visits, an accepting run for one member can be reconstructed for every member.",
          question: "If one word in UVω is accepted, what does saturation prove?",
          choices: ["Every word in UVω is accepted", "Exactly one word is accepted", "No other product matters"],
          correct: 0,
          hint: "Replace each block by an equivalent one while preserving boundary states and F-visits.",
          feedback: "Exactly. An accepting run can be stitched through any equivalent replacement blocks.",
          incorrect: "The point of saturation is uniform behavior across the entire class product.",
          formal: T`Equivalent prefix blocks preserve the first boundary state; equivalent loop blocks preserve every later boundary and each accepting visit.`,
          preview: V(["product1"], [], { dimNodes: ["profiles", "union"] }),
          reveal: V(["product1", "language"], ["p1-l"], { goodNodes: ["product1", "language"], dimNodes: ["profiles", "union"] }),
          previewNote: "Start from one accepted member of a class product.",
          revealNote: "Profile-preserving block replacement accepts every member."
        },
        {
          label: "Coverage",
          title: "Cover every infinite word",
          exposition: "Saturation is useful only if the class products cover the entire space of infinite words. Homogeneous decomposition groups infinitely many consecutive factors into one repeatable profile class, after a possibly different finite prefix class.",
          question: "What does homogeneous decomposition supply for an arbitrary ω-word?",
          choices: ["A prefix class U and repeatable class V with the word in UVω", "A deterministic Büchi run", "A finite version of the word"],
          correct: 0,
          hint: "The decomposition groups infinitely many blocks into one repeating profile class.",
          feedback: "Correct. Every ω-word belongs to at least one saturated class product.",
          incorrect: "The proof covers words by class products, not by determinizing the automaton.",
          formal: T`A Ramsey-style homogeneous decomposition yields \(\alpha=u_0u_1\cdots\), with \(u_0\in U\), every later \(u_i\in V\), and \(V\cdot V\subseteq V\).`,
          preview: V(["product1", "product2"], [], { dimNodes: ["profiles", "union"] }),
          reveal: V(["product1", "product2", "language", "complement"], ["p1-l", "p2-c"], { goodNodes: ["language", "complement"], dimNodes: ["profiles", "union"] }),
          previewNote: "Finitely many products are enough to cover infinitely many words.",
          revealNote: "Saturation places every covered product wholly on one side."
        },
        {
          label: "Complement",
          title: "Collect the rejected products",
          exposition: "Coverage and saturation reduce complementation to a finite classification problem. Each product is wholly accepted or wholly rejected, so the complement is obtained by selecting exactly the rejected products rather than by complementing individual Büchi runs.",
          question: "Why is their union ω-regular?",
          choices: ["There are finitely many products and each UVω is ω-regular", "Complementation was assumed", "Every product is finite"],
          correct: 0,
          hint: "Use the closure theorem from Chapter 3, not the result being proved.",
          feedback: "Exactly. The complement is a finite union of already ω-regular class products.",
          incorrect: "Assuming complementation would be circular, and each product contains infinite words.",
          formal: T`\(\Sigma^\omega\setminus L=\bigcup\{UV^\omega\mid UV^\omega\cap L=\varnothing\}\). Regular \(U,V\) make each term \(\omega\)-regular; finite union preserves \(\omega\)-regularity.`,
          preview: V(["complement"], [], { dimNodes: ["profiles", "language"] }),
          reveal: V(["complement", "union"], ["c-union"], { goodNodes: ["complement", "union"], dimNodes: ["profiles", "language", "product1", "product2"] }),
          previewNote: "The complement consists exactly of products disjoint from L.",
          revealNote: "A finite union automaton recognizes all and only those products."
        }
      ],
      previous: { label: "Büchi–expression equivalence", href: "/proofs/chapter-03/buchi-expression-equivalence.html" }
    }
  };
})();
