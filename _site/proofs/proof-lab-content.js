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
      intro: "An NFA may be in several states at once — it 'branches' on each input symbol. The DFA we build has no branches; instead, its current state is the full set of NFA states that are still possible. After reading the same prefix, the DFA state and the set of live NFA states are always equal.",
      application: "Think of a spell-checker that must decide, character by character, whether the input could still be the word 'ab'. The NFA guesses freely; the DFA keeps track of every guess simultaneously.",
      strategy: "Define the DFA state after a prefix to be the set of NFA states reachable after that prefix. Prove by induction on word length that DFA state = reachable NFA set. Then show that the DFA acceptance rule mirrors the NFA's.",
      invariant: "After every prefix w, the DFA state equals the set of all NFA states reachable after reading w.",
      synthesis: String.raw`Let \(A=(Q,\Sigma,\Delta,q_s,F)\) be an NFA and define \(D\) on the state space \(2^Q\). Its initial state is \(\{q_s\}\), its transition is \(\delta_D(S,a)=\bigcup_{q\in S}\Delta(q,a)\), and a subset is final precisely when it intersects \(F\). An induction on \(|w|\) proves that the state reached by \(D\) after \(w\) is \(\operatorname{Reach}_A(w)\): the base case is \(\{q_s\}\), while the inductive step is exactly the union used in \(\delta_D\). Consequently, \(D\) accepts \(w\) iff \(\operatorname{Reach}_A(w)\cap F\neq\varnothing\), which holds iff \(A\) has an accepting run on \(w\). Therefore \(L(D)=L(A)\).`,
      diagram: {
        description: "An NFA for words ending in 'a', next to its two-state subset DFA. The NFA has states qs (scanning) and qa (accept). The DFA has states S0={qs} and S1={qs,qa}.",
        viewBox: [0, 0, 1000, 520],
        lanes: [
          { y: 245, label: "NFA", labelX: 35, labelY: 55 },
          { y: 500, label: "DFA", labelX: 35, labelY: 310 }
        ],
        nodes: [
          N("qs", 285, 145, "q\u209B", "scanning", { shape: "circle", r: 52 }),
          N("qa", 700, 145, "q\u2090", "accepted 'a'", { shape: "circle", r: 54, accepting: true }),
          N("s0", 285, 400, "S\u2080", "{q\u209B}", { shape: "circle", r: 58 }),
          N("s1", 700, 400, "S\u2081", "{q\u209B, q\u2090}", { shape: "circle", r: 66, accepting: true })
        ],
        edges: [
          E("nfa-loop", "qs", "qs", "a, b", { path: "M 260 102 C 205 28 365 28 310 102", labelX: 285, labelY: 38 }),
          E("nfa-a", "qs", "qa", "a", { labelY: 130 }),
          E("dfa-b0", "s0", "s0", "b", { path: "M 255 348 C 205 280 365 280 315 348", labelX: 285, labelY: 290 }),
          E("dfa-a", "s0", "s1", "a", { labelY: 383 }),
          E("dfa-a1", "s1", "s1", "a", { path: "M 670 344 C 620 276 780 276 730 344", labelX: 700, labelY: 285 }),
          E("dfa-b1", "s1", "s0", "b", { path: "M 650 438 C 560 505 425 505 335 438", labelX: 492, labelY: 490 })
        ],
        annotations: [
          { x: 500, y: 240, text: "\u2195  same reachable set", anchor: "middle" }
        ]
      },
      steps: [
        {
          label: "Base case",
          title: "Start: before reading anything",
          exposition: "Before we read any symbol, no transition has fired. The only active NFA state is q\u209B \u2014 the start state. So the DFA must start in S\u2080 = {q\u209B}. This is the base of our induction: after the empty prefix \u03b5, DFA state = {q\u209B} = reachable NFA states.",
          question: "Before reading any symbol, what subset must the DFA store?",
          choices: ["{q\u209B}", "{q\u2090}", "{q\u209B, q\u2090}"],
          correct: 0,
          hint: "No transition has been taken yet \u2014 which state is the NFA in?",
          feedback: "Correct. Only q\u209B is reachable after \u03b5, so the DFA starts at S\u2080 = {q\u209B}.",
          incorrect: "No symbol has been read yet, so only the initial NFA state is reachable.",
          formal: String.raw`\(\operatorname{Reach}_A(\varepsilon)=\{q_s\}\), and the constructed DFA starts in the singleton \(\{q_s\}\). This establishes the invariant for the base case.`,
          preview: V([], [], { dimNodes: ["qa", "s1"] }),
          reveal: V(["qs", "s0"], [], { dimNodes: ["qa", "s1"] }),
          previewNote: "Only the initial states are active. q\u2090 and S\u2081 are not yet reachable.",
          revealNote: "After \u03b5: NFA is in {q\u209B}, DFA is in S\u2080 = {q\u209B}. Invariant holds."
        },
        {
          label: "Inductive step",
          title: "Read 'a': collect all NFA successors",
          exposition: "From q\u209B, reading 'a' can either stay in q\u209B (self-loop) or move to q\u2090. The NFA branches \u2014 both moves are valid. The DFA cannot choose one branch; it must remember both. So \u03b4_D(S\u2080, a) = \u0394(q\u209B, a) = {q\u209B, q\u2090} = S\u2081.",
          question: "From S\u2080 = {q\u209B}, reading 'a', what does the DFA move to?",
          choices: ["Only {q\u2090}", "The union {q\u209B, q\u2090}", "Only {q\u209B}"],
          correct: 1,
          hint: "Check every outgoing 'a' edge from q\u209B \u2014 collect all destinations.",
          feedback: "Right. Both NFA successors of q\u209B on 'a' are q\u209B and q\u2090, so the DFA moves to S\u2081 = {q\u209B, q\u2090}.",
          incorrect: "Choosing just one successor would forget a valid NFA run.",
          formal: String.raw`\(\delta_D(S,a)=\bigcup_{q\in S}\Delta(q,a)\). Starting from \(\{q_s\}\) and reading \(a\): \(\Delta(q_s,a)=\{q_s,q_a\}\), so the DFA moves to \(S_1\).`,
          preview: V(["qs", "s0"], [], { dimNodes: ["qa", "s1"] }),
          reveal: V(["qs", "qa", "s1"], ["nfa-loop", "nfa-a", "dfa-a"], { goodNodes: ["s1"] }),
          previewNote: "From S\u2080, reading 'a' \u2014 both NFA branches fire.",
          revealNote: "S\u2081 = {q\u209B, q\u2090} packs both branches. The DFA makes no choice."
        },
        {
          label: "Inductive step",
          title: "Read 'b': a dead branch disappears",
          exposition: "From S\u2081 = {q\u209B, q\u2090}, reading 'b': q\u209B has a self-loop on 'b' (stays in q\u209B), but q\u2090 has no 'b' transition (it contributes \u2205). So the union is just {q\u209B} \u2014 the DFA returns to S\u2080. The accepted branch simply drops out.",
          question: "From S\u2081 = {q\u209B, q\u2090}, reading 'b', what remains?",
          choices: ["{q\u209B}", "{q\u2090}", "{q\u209B, q\u2090}"],
          correct: 0,
          hint: "q\u2090 has no outgoing 'b' arrow \u2014 it vanishes from the set.",
          feedback: "Correct. \u0394(q\u209B, b) = {q\u209B} and \u0394(q\u2090, b) = \u2205, so the union is {q\u209B} \u2014 back to S\u2080.",
          incorrect: "A state with no 'b' transition contributes \u2205 to the union.",
          formal: String.raw`The union contains \(\Delta(q_s,b)=\{q_s\}\) and \(\Delta(q_a,b)=\varnothing\), hence the DFA moves to \(\{q_s\}=S_0\).`,
          preview: V(["qs", "qa", "s1"], [], {}),
          reveal: V(["qs", "s0"], ["nfa-loop", "dfa-b1"], { dimNodes: ["qa", "s1"] }),
          previewNote: "From S\u2081, reading 'b' \u2014 only q\u209B has a 'b' edge.",
          revealNote: "q\u2090 contributes nothing. The set shrinks back to S\u2080 = {q\u209B}."
        },
        {
          label: "Acceptance",
          title: "Accept when any NFA branch reaches a final state",
          exposition: "An NFA accepts a word if at least one of its runs ends in a final state. The DFA subset S contains exactly the states reachable after the word. So: the DFA accepts S when S \u2229 F \u2260 \u2205 \u2014 at least one element of S is a final NFA state. S\u2081 = {q\u209B, q\u2090} contains q\u2090 \u2208 F, so S\u2081 is final. S\u2080 = {q\u209B} does not intersect F, so it is not.",
          question: "When is a DFA subset state accepting?",
          choices: ["When every member of the subset is final", "When at least one member is a final NFA state", "Only when it is a singleton final state"],
          correct: 1,
          hint: "The NFA accepts when one run succeeds \u2014 even if others don't.",
          feedback: "Exactly. S \u2229 F \u2260 \u2205 transfers the NFA's existential condition to the DFA.",
          incorrect: "Requiring every member would be too strict \u2014 the NFA needs just one successful run.",
          formal: String.raw`\(w\in L(A)\) iff \(\operatorname{Reach}_A(w)\cap F\neq\varnothing\). By the invariant, \(\operatorname{Reach}_A(w)\) is the DFA state reached after \(w\), so \(w\in L(D)\) iff \(w\in L(A)\).`,
          preview: V(["qs", "qa", "s1"], [], {}),
          reveal: V(["qa", "s1"], [], { goodNodes: ["qa", "s1"], dimNodes: ["qs", "s0"] }),
          previewNote: "S\u2081 still contains a non-final state (q\u209B). Does that matter?",
          revealNote: "No. S\u2081 is accepting because q\u2090 \u2208 F is inside it. One is enough."
        }
      ],
      next: { label: "\u03b5-removal", href: "/proofs/chapter-02/epsilon-removal.html" }
    },

    "epsilon-removal": {
      slug: "epsilon-removal",
      chapter: 2,
      title: "\u03b5-removal",
      theorem: "Every \u03b5-NFA has an equivalent NFA without \u03b5-moves.",
      intro: "An \u03b5-NFA can jump from state to state for free, without consuming any input symbol. We can fold all those free jumps into the ordinary transitions \u2014 turning each pattern of (free moves, one symbol, more free moves) into a single arrow.",
      application: "Compiling the expression open(edit+save)*close naturally creates \u03b5-handoffs between sub-automata. \u03b5-removal packages those internal handoffs while keeping the visible event language identical.",
      strategy: "For each state q, compute its \u03b5-closure ECl(q) \u2014 all states reachable from q using only \u03b5-moves. Then define each new transition as: close under \u03b5, take a symbol step, close under \u03b5 again. Prove by induction that this matches the original automaton on every nonempty word. Handle \u03b5 separately.",
      invariant: "For every non-empty prefix w, the ordinary NFA and the \u03b5-NFA reach the same \u03b5-closed set of states.",
      synthesis: String.raw`For each state \(q\), let \(\operatorname{ECl}(q)\) be its \(\varepsilon\)-closure and define \(\Delta'(q,a)=\operatorname{ECl}\!\left(\bigcup_{p\in\operatorname{ECl}(q)}\Delta(p,a)\right)\). Thus one transition of the new NFA represents every \(\varepsilon^*a\varepsilon^*\) fragment of the original \(\varepsilon\)-NFA. Induction on the length of every nonempty word shows that both machines reach the same \(\varepsilon\)-closed set after reading it. The empty word is the only exceptional case, because the new automaton cannot traverse an initial \(\varepsilon\)-path; declaring its initial state final exactly when \(\operatorname{ECl}(q_0)\cap F\neq\varnothing\) preserves that verdict. Hence the transformed NFA contains no \(\varepsilon\)-moves and recognizes the same language.`,
      diagram: {
        description: "Top: \u03b5-NFA with q0 -a-> q1 -\u03b5-> r0 -b-> r1. Bottom: ordinary NFA where the \u03b5-jump from q1 to r0 is folded into the 'a' transition, giving two 'a'-arrows from q0.",
        viewBox: [0, 0, 1000, 550],
        lanes: [
          { y: 245, label: "\u03b5-NFA", labelX: 25, labelY: 55 },
          { y: 525, label: "NFA (no \u03b5)", labelX: 25, labelY: 320 }
        ],
        nodes: [
          N("q0", 150, 145, "q\u2080", "start", { shape: "circle" }),
          N("q1", 385, 145, "q\u2081", "", { shape: "circle" }),
          N("r0", 620, 145, "r\u2080", "", { shape: "circle" }),
          N("r1", 855, 145, "r\u2081", "accept", { shape: "circle", accepting: true }),
          N("q0p", 150, 410, "q\u2080", "start", { shape: "circle" }),
          N("q1p", 385, 410, "q\u2081", "", { shape: "circle" }),
          N("r0p", 620, 410, "r\u2080", "", { shape: "circle" }),
          N("r1p", 855, 410, "r\u2081", "accept", { shape: "circle", accepting: true })
        ],
        edges: [
          E("a-top", "q0", "q1", "a", { labelY: 128 }),
          E("eps-top", "q1", "r0", "\u03b5", { labelY: 128 }),
          E("b-top", "r0", "r1", "b", { labelY: 128 }),
          E("a-q1", "q0p", "q1p", "a", { labelY: 393 }),
          E("a-r0", "q0p", "r0p", "a", { path: "M 192 430 C 310 520 470 520 570 430", labelX: 385, labelY: 505 }),
          E("b-q1", "q1p", "r1p", "b", { path: "M 428 390 C 555 315 710 315 812 390", labelX: 620, labelY: 335 }),
          E("b-r0", "r0p", "r1p", "b", { labelY: 393 })
        ],
        annotations: [
          { x: 500, y: 250, text: "\u2193  fold \u03b5-moves into symbol transitions", anchor: "middle" }
        ]
      },
      steps: [
        {
          label: "Construction",
          title: "Fold the free jump into the 'a' arrow",
          exposition: "In the top automaton, reading 'a' from q\u2080 reaches q\u2081. Then q\u2081 \u2192\u03b5\u2192 r\u2080 is free \u2014 no symbol consumed. The ordinary NFA must do both in one step. So its 'a' transition from q\u2080 leads to {q\u2081, r\u2080}: the symbol step plus everything reachable for free afterwards.",
          question: "After taking q\u2080 -a-> q\u2081, then using the free \u03b5-move, which set does the ordinary NFA store?",
          choices: ["Only {q\u2081}", "{q\u2081, r\u2080}", "Only {r\u2080}"],
          correct: 1,
          hint: "Take \u03b5-closure after consuming 'a' \u2014 include every state reachable for free.",
          feedback: "Correct. The 'a' transition in the new NFA reaches {q\u2081, r\u2080} \u2014 both the direct target and its \u03b5-closure.",
          incorrect: "The transformed NFA must already include every state reachable for free after the symbol step.",
          formal: String.raw`\(\Delta'(q,a)=\operatorname{ECl}\!\left(\bigcup_{p\in\operatorname{ECl}(q)}\Delta(p,a)\right)\). It compiles an \(\varepsilon^*a\varepsilon^*\) fragment into one \(a\)-transition.`,
          preview: V(["q0", "q1", "r0"], ["a-top", "eps-top"], { dimNodes: ["r1", "q0p", "q1p", "r0p", "r1p"] }),
          reveal: V(["q0p", "q1p", "r0p"], ["a-q1", "a-r0"], { goodNodes: ["q1p", "r0p"], dimNodes: ["q0", "q1", "r0", "r1"] }),
          previewNote: "The \u03b5-NFA reaches q\u2081 on 'a', then moves to r\u2080 for free.",
          revealNote: "The new NFA reaches {q\u2081, r\u2080} in one 'a' step \u2014 both destinations stored."
        },
        {
          label: "Inductive step",
          title: "Read 'b' from the already-closed set",
          exposition: "After reading 'a', the active set {q\u2081, r\u2080} is already \u03b5-closed (no more free moves). Reading 'b' next: only r\u2080 has a 'b' arrow, leading to r\u2081. So both automata reach {r\u2081} after 'ab'. This restores closure for the next symbol \u2014 the inductive step works.",
          question: "From {q\u2081, r\u2080}, reading 'b', which state(s) are reached?",
          choices: ["{r\u2081} only", "{q\u2081, r\u2080}", "No state is reached"],
          correct: 0,
          hint: "Only r\u2080 has a 'b' arrow \u2014 check the top diagram.",
          feedback: "Exactly. Both automata reach r\u2081 after 'ab'. The reachable sets are equal.",
          incorrect: "Check which state in {q\u2081, r\u2080} actually has a 'b' transition.",
          formal: String.raw`Because the active set is \(\varepsilon\)-closed, unioning \(\Delta'\) over it equals taking the original symbol successors and closing once more. Both machines reach \(\{r_1\}\) after \(ab\).`,
          preview: V(["q1p", "r0p"], [], { dimNodes: ["q0p", "r1p"] }),
          reveal: V(["r1", "r1p"], ["b-top", "b-q1", "b-r0"], { goodNodes: ["r1", "r1p"], dimNodes: ["q0", "q1", "r0", "q0p", "q1p", "r0p"] }),
          previewNote: "Active set after 'a': {q\u2081, r\u2080}. Now read 'b'.",
          revealNote: "r\u2081 is reached in both automata. The inductive step works."
        },
        {
          label: "Boundary case",
          title: "Handle \u03b5: the empty word",
          exposition: "What if the \u03b5-NFA accepts the empty word \u03b5 by taking free \u03b5-moves from q\u2080 to a final state? The new NFA cannot follow any \u03b5-path before reading its first symbol. So we check: is any final state reachable from q\u2080 by \u03b5-moves only? If yes, declare q\u2080 final in the new NFA too.",
          question: "When must q\u2080 be declared a final state in the new NFA?",
          choices: ["Always", "Exactly when ECl(q\u2080) contains a final state", "Never"],
          correct: 1,
          hint: "The new NFA can't take \u03b5-moves before reading anything \u2014 so it needs a correction for the empty word.",
          feedback: "Right. If ECl(q\u2080) \u2229 F \u2260 \u2205, the \u03b5-NFA accepts \u03b5 via a free path; we replicate that verdict by making q\u2080 final.",
          incorrect: "The correction is needed only when \u03b5-moves from q\u2080 can actually reach a final state.",
          formal: String.raw`Set \(F'=F\cup\{q_0\}\) iff \(\operatorname{ECl}(q_0)\cap F\neq\varnothing\). This is the only difference between the two automata on the word \(\varepsilon\).`,
          preview: V(["q0", "q0p"], [], { dimNodes: ["q1", "r0", "r1", "q1p", "r0p", "r1p"] }),
          reveal: V(["q0", "q0p"], [], { goodNodes: ["q0p"], dimNodes: ["q1", "r0", "r1", "q1p", "r0p", "r1p"] }),
          previewNote: "In this example, q\u2080 has no \u03b5-path to r\u2081 \u2014 so q\u2080 stays non-final.",
          revealNote: "If ECl(q\u2080) did hit r\u2081, we would mark q\u2080 final in the new NFA."
        },
        {
          label: "Conclusion",
          title: "The induction repeats for every symbol",
          exposition: "After each constructed transition, the active set is again \u03b5-closed. That means the same argument applies to the next symbol. So by induction, after any non-empty word w, both automata are in the same \u03b5-closed set \u2014 and the \u03b5 correction handles \u03b5 itself. The two automata accept exactly the same language.",
          question: "Why can the inductive argument be repeated for every next symbol?",
          choices: ["Every active set is \u03b5-closed after each step", "The automaton is deterministic", "Every state is final"],
          correct: 0,
          hint: "Look at the closure applied after every new NFA transition.",
          feedback: "Exactly. Each constructed transition ends in an \u03b5-closed set, ready for the next symbol.",
          incorrect: "The proof does not require determinism or universal finality \u2014 just \u03b5-closure restoration.",
          formal: String.raw`Induction on \(|w|\) shows equality of reachable \(\varepsilon\)-closed sets for all nonempty \(w\); the corrected \(F'\) handles \(\varepsilon\). Therefore the languages coincide.`,
          preview: V(["q0", "q1", "r0", "r1"], ["a-top", "eps-top", "b-top"], { dimNodes: ["q0p", "q1p", "r0p", "r1p"] }),
          reveal: V(["q0p", "q1p", "r0p", "r1p"], ["a-q1", "a-r0", "b-q1", "b-r0"], { goodNodes: ["r1p"], dimNodes: ["q0", "q1", "r0", "r1"] }),
          previewNote: "The \u03b5-NFA alternates symbol moves and free closures.",
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
      intro: "Regular expressions and finite automata describe exactly the same languages. The proof is constructive in both directions: every automaton can be compiled into a regular expression, and every regular expression can be compiled into an automaton.",
      application: "The editor session language 'open (edit+save)* close' is a regular expression. The theorem guarantees that a finite DFA can enforce the same property \u2014 and vice versa.",
      strategy: "Prove both directions constructively. Automaton to expression: use path equations indexed by allowed intermediate states (the R\u1d4f\u1d62\u2c7c recurrence). Expression to automaton: build an \u03b5-NFA by induction on expression syntax (Thompson's construction).",
      invariant: "Every translation preserves exactly the language denoted or recognized by the current representation.",
      synthesis: String.raw`For the automaton-to-expression direction, number the states \(q_1,\ldots,q_n\) and let \(R_{ij}^{(k)}\) denote the labels of paths from \(q_i\) to \(q_j\) whose intermediate states belong to \(\{q_1,\ldots,q_k\}\). The base expressions describe direct transitions and \(\varepsilon\) when \(i=j\). Splitting paths according to whether they use \(q_k\) yields \(R_{ij}^{(k)}=R_{ij}^{(k-1)}+R_{ik}^{(k-1)}(R_{kk}^{(k-1)})^*R_{kj}^{(k-1)}\), so the union of the expressions \(R_{if}^{(n)}\), from the initial state \(q_i\) to every final state \(q_f\), denotes the automaton language. Conversely, structural induction constructs an equivalent \(\varepsilon\)-NFA for every regular expression. Removing \(\varepsilon\)-moves and, if desired, determinizing preserves the language. Both directions therefore define exactly the regular languages.`,
      diagram: {
        description: "A cycle of four representations: Regular expression (top), e-NFA (right), NFA (bottom), DFA (left). In the center, R^k_ij is the path-expression induction variable. Each arrow around the cycle is a language-preserving translation.",
        viewBox: [0, 0, 1000, 540],
        nodes: [
          N("regex", 500, 85, "Regular|expression", "e.g. a(a+b)*", { width: 210 }),
          N("enfa", 820, 270, "\u03b5-NFA", "Thompson build", { width: 180 }),
          N("nfa", 500, 455, "NFA", "after \u03b5-removal", { width: 180 }),
          N("dfa", 180, 270, "DFA", "after subset constr.", { width: 180 }),
          N("rk", 500, 270, "R\u1d4f\u1d62\u2c7c", "path expression", { shape: "circle", r: 72 })
        ],
        edges: [
          E("regex-enfa", "regex", "enfa", "Thompson"),
          E("enfa-nfa", "enfa", "nfa", "remove \u03b5"),
          E("nfa-dfa", "nfa", "dfa", "determinize"),
          E("dfa-regex", "dfa", "regex", "eliminate states", { labelX: 305, labelY: 175 }),
          E("dfa-rk", "dfa", "rk", "index paths by k"),
          E("rk-regex", "rk", "regex", "R\u207f\u1d62\u2071 = expression", { labelX: 585, labelY: 200 })
        ],
        annotations: [
          { x: 500, y: 520, text: "Every arrow preserves the recognized language.", anchor: "middle" }
        ]
      },
      steps: [
        {
          label: "DFA \u2192 Regex",
          title: "Index paths by how far they can wander",
          exposition: "We want a regular expression for every DFA path. The trick: build it step by step, expanding which states are allowed as internal waypoints. Start with direct edges only (k=0). Then, one state at a time, allow paths that pass through state q\u1d4f. After allowing all n states, we have expressions for all paths.",
          question: "What does the index k control in R\u1d4f\u1d62\u2c7c?",
          choices: ["Which states may appear as internal waypoints on a path", "The length of the word being read", "How many final states the automaton has"],
          correct: 0,
          hint: "Think of k as a 'permission level': paths may use states q\u2081 through q\u1d4f in the middle.",
          feedback: "Correct. k expands the allowed intermediate waypoints from none (k=0) to all n states.",
          incorrect: "The index is about intermediate waypoints, not word length or final states.",
          formal: String.raw`\(R_{ij}^{(k)}\) denotes all labels of paths from \(q_i\) to \(q_j\) whose intermediate states lie among \(q_1,\ldots,q_k\).`,
          preview: V(["dfa"], [], { dimNodes: ["enfa", "nfa"] }),
          reveal: V(["dfa", "rk"], ["dfa-rk"], { goodNodes: ["rk"], dimNodes: ["enfa", "nfa"] }),
          previewNote: "Start from the DFA. Paths may wander through any states.",
          revealNote: "R\u1d4f\u1d62\u2c7c captures exactly those paths, indexed by allowed waypoints."
        },
        {
          label: "DFA \u2192 Regex",
          title: "Split: avoid q\u1d4f, or loop through it",
          exposition: "When q\u1d4f becomes a new allowed waypoint, any path from q\u1d62 to q\u2c7c falls into one of two cases: (1) avoid q\u1d4f entirely, described by R\u1d62\u2c7c\u1d4f\u207b\u00b9; or (2) reach q\u1d4f, loop there zero or more times, then leave to q\u2c7c. Case (2) gives: R\u1d62\u1d4f\u1d4f\u207b\u00b9 \u00b7 (R\u1d4f\u1d4f\u1d4f\u207b\u00b9)* \u00b7 R\u1d4f\u2c7c\u1d4f\u207b\u00b9. Their union is the recurrence.",
          question: "When q\u1d4f becomes available as a waypoint, how can a path from q\u1d62 to q\u2c7c use it?",
          choices: ["Avoid q\u1d4f entirely, or enter it, loop zero or more times, then leave", "Visit q\u1d4f exactly once", "Only end at q\u1d4f"],
          correct: 0,
          hint: "The path can skip q\u1d4f entirely, or pass through it any number of times.",
          feedback: "Exactly. The two cases give union, concatenation, and star \u2014 all three regex operators in one recurrence.",
          incorrect: "The new state may be skipped or revisited any number of times.",
          formal: String.raw`\(R_{ij}^{(k)}=R_{ij}^{(k-1)}+R_{ik}^{(k-1)}(R_{kk}^{(k-1)})^*R_{kj}^{(k-1)}\).`,
          preview: V(["rk"], [], { dimNodes: ["enfa", "nfa"] }),
          reveal: V(["rk", "regex"], ["rk-regex"], { goodNodes: ["regex"], dimNodes: ["enfa", "nfa"] }),
          previewNote: "A path either avoids q\u1d4f or factors through it.",
          revealNote: "The recurrence builds a regular expression from smaller ones."
        },
        {
          label: "Regex \u2192 Automaton",
          title: "Build an automaton from expression structure",
          exposition: "Going the other direction: a regular expression is built from atoms (single symbols) using union (+), concatenation, and star (*). Build a small automaton for each atom. Then wire them together using \u03b5-transitions: union adds a fork at the start; concatenation chains two automata; star adds a back-edge. The \u03b5-NFA mirrors the expression tree.",
          question: "Which model lets us connect sub-automata without consuming any input?",
          choices: ["A complete DFA", "An \u03b5-NFA", "A pushdown automaton"],
          correct: 1,
          hint: "We need free (\u03b5) transitions between sub-automata \u2014 no input consumed.",
          feedback: "Right. Thompson's construction uses \u03b5-transitions to connect pieces, following the syntax tree.",
          incorrect: "We need a finite-state model where pieces can be wired together for free (\u03b5).",
          formal: String.raw`Structural induction builds \(\varepsilon\)-NFAs for symbols and combines them for \(+\), concatenation, and \(^*\) while preserving denotation.`,
          preview: V(["regex"], [], { dimNodes: ["dfa", "nfa"] }),
          reveal: V(["regex", "enfa"], ["regex-enfa"], { goodNodes: ["enfa"], dimNodes: ["dfa", "nfa"] }),
          previewNote: "The expression tells us how its parts compose.",
          revealNote: "The \u03b5-NFA mirrors that tree: atoms become states, operators become \u03b5-wiring."
        },
        {
          label: "Equivalence",
          title: "Both directions close the loop",
          exposition: "We have two constructions: DFA \u2192 regex (via path equations) and regex \u2192 \u03b5-NFA \u2192 NFA \u2192 DFA (via Thompson + known conversions). Each step preserves the language. So the same language is expressible as a regex if and only if a finite automaton recognizes it. The cycle proves a full iff.",
          question: "Why does this cycle prove iff (not just one direction)?",
          choices: ["There is a language-preserving route in both directions", "Every automaton is smaller than the expression", "All automata are deterministic"],
          correct: 0,
          hint: "For iff, we need: regex \u2192 automaton and automaton \u2192 regex. Do both routes exist?",
          feedback: "Exactly. Each direction has a constructive, language-preserving translation.",
          incorrect: "Size and determinism are irrelevant; what matters is that both routes preserve the language.",
          formal: String.raw`DFA \(\to\) regular expression proves every automaton language is denotable; regular expression \(\to\varepsilon\)-NFA \(\to\) NFA proves every denotation is recognizable.`,
          preview: V(["regex", "enfa", "nfa", "dfa"], [], {}),
          reveal: V(["regex", "enfa", "nfa", "dfa"], ["regex-enfa", "enfa-nfa", "nfa-dfa", "dfa-regex"], { goodNodes: ["regex", "dfa"] }),
          previewNote: "Four representations form a cycle.",
          revealNote: "Every arrow preserves the language. The cycle closes both directions of the iff."
        }
      ],
      previous: { label: "\u03b5-removal", href: "/proofs/chapter-02/epsilon-removal.html" },
      next: { label: "Closure of regular languages", href: "/proofs/chapter-02/regular-closure.html" }
    },

    "regular-closure": {
      slug: "regular-closure",
      chapter: 2,
      title: "Closure of regular languages",
      theorem: "Regular languages are closed under union, concatenation, star, complement, and intersection.",
      intro: "If L\u2081 and L\u2082 are regular, so are L\u2081 \u222a L\u2082, L\u2081L\u2082, L\u2081*, \u00acL\u2081, and L\u2081 \u2229 L\u2082. 'Closed' means the operation stays inside the class. For each operation there is a concrete automaton construction that proves it.",
      application: "Intersect 'completed sessions' with 'at least one save' to get sessions that are both complete and non-trivial. Complement 'valid sessions' to get exactly the malformed ones. Both results stay regular.",
      strategy: "For each operation, exhibit a finite automaton recognizing exactly the result. Union, concatenation, and star use \u03b5-NFA wiring. Complement uses DFA state swapping. Intersection uses a product automaton.",
      invariant: "After each construction, the new automaton accepts exactly the result of applying the selected operation to the input regular language(s).",
      synthesis: String.raw`Let \(L,L_1,L_2\) be regular. Union, concatenation, and star are regular because the corresponding regular-expression constructors preserve denotation, equivalently because \(\varepsilon\)-NFAs can implement initial choice, finite handoff, and restart. For complement, determinize and complete an automaton for \(L\); every word then has one total run, and replacing \(F\) by \(Q\setminus F\) reverses exactly its acceptance verdict. For intersection, the product automaton on \(Q_1\times Q_2\) advances both components on every symbol and accepts in \(F_1\times F_2\), hence recognizes precisely \(L_1\cap L_2\). Each operation therefore has a finite automaton recognizing its result, so the class of regular languages is closed under all five operations.`,
      diagram: {
        description: "REG at the center. Five arrows point outward to the five operations: union and concatenation and star (using e-NFA wiring), complement (using DFA swap), intersection (using product automaton). All stay inside REG.",
        viewBox: [0, 0, 1000, 560],
        nodes: [
          N("reg", 500, 280, "REG", "finite automata", { shape: "circle", r: 76 }),
          N("union", 180, 105, "L\u2081 \u222a L\u2082", "\u03b5-NFA choice", { width: 190 }),
          N("concat", 500, 75, "L\u2081 \u00b7 L\u2082", "\u03b5-NFA handoff", { width: 190 }),
          N("star", 820, 105, "L*", "\u03b5-NFA restart", { width: 190 }),
          N("comp", 235, 455, "\u00acL", "swap F and Q\\F", { width: 190 }),
          N("inter", 765, 455, "L\u2081 \u2229 L\u2082", "Q\u2081\u00d7Q\u2082 product", { width: 190 })
        ],
        edges: [
          E("e-union", "reg", "union", "\u03b5-NFA"),
          E("e-concat", "reg", "concat", "\u03b5-NFA"),
          E("e-star", "reg", "star", "\u03b5-NFA"),
          E("e-comp", "reg", "comp", "complete DFA"),
          E("e-inter", "reg", "inter", "Q\u2081\u00d7Q\u2082")
        ],
        annotations: [
          { x: 500, y: 540, text: "Every outgoing arrow stays inside REG.", anchor: "middle" }
        ]
      },
      steps: [
        {
          label: "Union, concat, star",
          title: "Reuse what Kleene gives us for free",
          exposition: "Union, concatenation, and star are already part of regular expression syntax. By Kleene equivalence they correspond directly to \u03b5-NFA constructions: union = initial \u03b5-choice; concatenation = \u03b5-handoff from one automaton to the next; star = \u03b5 back-edge to the start. No new ideas needed.",
          question: "Which three operations are immediately handled by \u03b5-NFA wiring?",
          choices: ["Union, concatenation, star", "Complement, intersection, reversal", "Only union"],
          correct: 0,
          hint: "These are exactly the three constructors of a regular expression.",
          feedback: "Correct. Union, concatenation, and star already live inside regular expression syntax.",
          incorrect: "Look at the three constructors built into regular expressions.",
          formal: String.raw`Kleene equivalence turns expression constructors or \(\varepsilon\)-NFA wiring into finite automata for the resulting languages.`,
          preview: V(["reg"], [], { dimNodes: ["comp", "inter"] }),
          reveal: V(["reg", "union", "concat", "star"], ["e-union", "e-concat", "e-star"], { goodNodes: ["union", "concat", "star"], dimNodes: ["comp", "inter"] }),
          previewNote: "Three operations are inherited directly from regular expression syntax.",
          revealNote: "Each construction stays inside REG."
        },
        {
          label: "Complement",
          title: "Swap final and non-final states \u2014 but only in a DFA",
          exposition: "To complement L: we want an automaton accepting exactly the words L rejects. In a complete DFA, every word has exactly one run ending in exactly one state. Swapping F and Q\\F flips every verdict. But we need a complete DFA first \u2014 missing transitions mean some words have no run and no verdict to swap.",
          question: "Before swapping final and non-final states for complement, what must we do?",
          choices: ["Determinize and complete the automaton so every word has exactly one run", "Remove all cycles", "Make every state initial"],
          correct: 0,
          hint: "Every word needs exactly one complete run \u2014 otherwise swapping gives no verdict for some words.",
          feedback: "Exactly. Completeness ensures every word has a run; determinism ensures it lands in exactly one state.",
          incorrect: "Missing or nondeterministic transitions prevent a clean verdict swap.",
          formal: String.raw`For a complete DFA, every word has one run ending in \(q\). Replacing \(F\) by \(Q\setminus F\) accepts exactly the words previously rejected.`,
          preview: V(["reg", "comp"], [], { dimNodes: ["union", "concat", "star", "inter"] }),
          reveal: V(["reg", "comp"], ["e-comp"], { goodNodes: ["comp"], dimNodes: ["union", "concat", "star", "inter"] }),
          previewNote: "Complement reverses the verdict \u2014 but only when each word has one verdict.",
          revealNote: "A complete DFA gives every word exactly one run to flip."
        },
        {
          label: "Intersection",
          title: "Run both automata in parallel",
          exposition: "To check L\u2081 \u2229 L\u2082, we track where automaton 1 is and where automaton 2 is \u2014 simultaneously, on the same input. The product automaton: state = pair (q\u2081, q\u2082); both components advance together. Accept when both are final: (q\u2081, q\u2082) \u2208 F\u2081 \u00d7 F\u2082.",
          question: "What state space is needed to track two automata reading the same word?",
          choices: ["Q\u2081 \u222a Q\u2082", "Q\u2081 \u00d7 Q\u2082", "2^(Q\u2081 \u2229 Q\u2082)"],
          correct: 1,
          hint: "We need to know the current state in automaton 1 AND the current state in automaton 2.",
          feedback: "Right. The pair (q\u2081, q\u2082) tracks both simultaneously. Acceptance requires both to be final.",
          incorrect: "A union conflates the two automata; we need ordered pairs of simultaneous states.",
          formal: String.raw`The product transition advances both components on the same symbol and uses accepting set \(F_1\times F_2\).`,
          preview: V(["reg", "inter"], [], { dimNodes: ["union", "concat", "star", "comp"] }),
          reveal: V(["reg", "inter"], ["e-inter"], { goodNodes: ["inter"], dimNodes: ["union", "concat", "star", "comp"] }),
          previewNote: "Intersection requires both automata to accept on the same word.",
          revealNote: "The product stores both states as one ordered pair."
        },
        {
          label: "Closure",
          title: "Closure means: a compiler exists for each operation",
          exposition: "Saying 'regular languages are closed' is not just a set-theoretic claim. For each operation there is an algorithm that takes the input automata and builds an output automaton. This is what makes closure useful: compound specifications can be mechanically compiled, and decidability is preserved.",
          question: "What does closure give us in verification?",
          choices: ["A compiler for compound regular properties \u2014 build complex specs from simpler ones", "A proof that every language is regular", "A guarantee that the result is always a smaller automaton"],
          correct: 0,
          hint: "Closure means we can combine regular specifications and the result stays regular \u2014 still decidable.",
          feedback: "Exactly. Compound specifications remain in the decidable finite-state world.",
          incorrect: "Closure preserves membership in REG, not universality or compactness.",
          formal: "Each listed operation has a language-preserving finite automaton construction, hence its result is regular.",
          preview: V(["reg"], [], {}),
          reveal: V(["reg", "union", "concat", "star", "comp", "inter"], ["e-union", "e-concat", "e-star", "e-comp", "e-inter"], { goodNodes: ["reg"] }),
          previewNote: "All five operations point outward from REG.",
          revealNote: "Every arrow lands back inside REG."
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
      intro: "A shortest accepted word cannot revisit any state. If the run ever revisited a state, the section between the two visits forms a loop \u2014 and we could cut it out without breaking acceptance. So a shortest word has no repeated states, meaning its length is at most n\u22121.",
      application: "If a session checker (n states) accepts some malformed trace, it must accept a short malformed trace \u2014 shorter than n steps. This gives a bounded counterexample to search for.",
      strategy: "Choose a shortest accepted word z. Assume |z| \u2265 n for contradiction. Then its run has n+1 state visits, so by pigeonhole some state appears twice. Use determinism to cut the loop, finding a shorter accepted word \u2014 contradicting minimality.",
      invariant: "The shortened run reaches the same final state as the original because it shares the same suffix after the repeated state.",
      synthesis: String.raw`Assume \(L(A)\neq\varnothing\) and choose an accepted word \(z\) of minimum length. Write its run as \(p_0,p_1,\ldots,p_m\), where \(m=|z|\). If \(m\ge n\), the run contains at least \(n+1\) state occurrences but \(A\) has only \(n\) states, so \(p_i=p_j\) for some \(i<j\). Factor \(z=uvw\) with \(|u|=i\) and \(|uv|=j\). Since the run reaches the same state after \(u\) and \(uv\), determinism allows the suffix \(w\) to continue from either occurrence; hence \(uw\) is accepted. Because \(v\neq\varepsilon\), \(|uw|<|z|\), contradicting the minimality of \(z\). Therefore \(|z|<n\), so every nonempty DFA language has an accepted witness shorter than its number of states.`,
      diagram: {
        description: "A DFA run: p0 goes via u to pi. A non-empty loop v goes from pi through middle states to pj, where pj = pi (same state!). Then pj goes via w to pm (final). A shortcut arrow from pi directly to pm shows that 'uw' is a shorter accepted word.",
        viewBox: [0, 0, 1000, 520],
        nodes: [
          N("p0", 110, 250, "p\u2080", "start", { shape: "circle" }),
          N("pi", 330, 250, "p\u1d62", "loop start", { shape: "circle" }),
          N("mid", 500, 115, "v", "loop body (non-empty)", { width: 200 }),
          N("pj", 665, 250, "p\u2c7c = p\u1d62", "same state!", { shape: "circle" }),
          N("pm", 890, 250, "p\u2098", "final", { shape: "circle", accepting: true })
        ],
        edges: [
          E("u", "p0", "pi", "u", { labelY: 232 }),
          E("v-in", "pi", "mid", "", {}),
          E("v-out", "mid", "pj", "v", {}),
          E("w", "pj", "pm", "w", { labelY: 232 }),
          E("shortcut", "pi", "pm", "skip v \u2192 shorter!", { path: "M 375 282 C 515 440 745 440 850 282", labelX: 620, labelY: 435 })
        ],
        annotations: [
          { x: 500, y: 505, text: "Removing the loop gives 'uw', which is also accepted and strictly shorter.", anchor: "middle" }
        ]
      },
      steps: [
        {
          label: "Setup",
          title: "Fix a shortest accepted word z",
          exposition: "We want to prove that some accepted word is short. The cleanest way: reason about the shortest one. If the shortest accepted word z were too long, we would find a contradiction \u2014 a shorter accepted word. So we choose z with minimum length among all words in L(A).",
          question: "Why do we choose z to be a shortest accepted word?",
          choices: ["So that any shorter accepted word we find creates a contradiction", "So that the DFA becomes deterministic", "So that every state is visited"],
          correct: 0,
          hint: "We will try to shorten z. If we succeed, what does that contradict?",
          feedback: "Correct. If we find a shorter accepted word, it contradicts the minimality of z \u2014 exactly the contradiction we need.",
          incorrect: "The role of minimality is to create a contradiction when we find a shorter accepted word.",
          formal: String.raw`Assume \(L(A)\neq\varnothing\) and choose \(z\) of minimum accepted length. Any strictly shorter accepted word contradicts this choice.`,
          preview: V([], [], { dimNodes: ["mid"] }),
          reveal: V(["p0", "pi", "pj", "pm"], ["u", "w"], { goodNodes: ["pm"], dimNodes: ["mid"] }),
          previewNote: "A shortest accepted run \u2014 we don't yet know if it has a repeated state.",
          revealNote: "The final state p\u2098 is fixed. We must show the run cannot be too long."
        },
        {
          label: "Pigeonhole",
          title: "A long run must repeat a state",
          exposition: "A word of length m visits m+1 positions: before the first symbol, and after each of the m transitions. If m \u2265 n, we have m+1 \u2265 n+1 positions but only n distinct states \u2014 so two positions must hold the same state. That gives us p\u1d62 = p\u2c7c with i < j.",
          question: "If |z| \u2265 n, how many state positions does the run visit?",
          choices: ["At least n+1", "Exactly n", "At most n\u22121"],
          correct: 0,
          hint: "Count the initial state p\u2080, plus one state per symbol read.",
          feedback: "Exactly. m symbols give m+1 positions. If m \u2265 n, pigeonhole forces a repeated state.",
          incorrect: "Don't forget to count p\u2080 \u2014 the state before reading any symbol.",
          formal: String.raw`A run of length \(m\) has \(m+1\) state occurrences. If \(m\ge n\), the pigeonhole principle gives equal states at two positions \(i<j\).`,
          preview: V(["p0", "pi", "pj", "pm"], ["u", "w"], { dimNodes: ["mid"] }),
          reveal: V(["pi", "pj", "mid"], ["v-in", "v-out"], { goodNodes: ["pi", "pj"], dimNodes: ["p0", "pm"] }),
          previewNote: "n+1 positions in an n-state machine \u2014 one state must repeat.",
          revealNote: "p\u1d62 = p\u2c7c: the repeated state encloses a non-empty loop v."
        },
        {
          label: "Loop deletion",
          title: "Cut the loop: the run still accepts",
          exposition: "We have p\u1d62 = p\u2c7c. The run reads u to reach p\u1d62, then v (the loop) to return to p\u2c7c = p\u1d62, then w to reach p\u2098 (final). Since p\u1d62 = p\u2c7c and the DFA is deterministic, we can skip v: start at p\u1d62, read w, and still reach p\u2098. The word uw is accepted and has length |u|+|w| < |u|+|v|+|w| = |z|.",
          question: "After removing the loop v, what word does the shortcut accept?",
          choices: ["uvw (original)", "uw (without the loop)", "vw (without the prefix)"],
          correct: 1,
          hint: "The shortcut goes from p\u1d62 directly to the suffix w \u2014 remove only the loop factor v.",
          feedback: "Right. Because p\u1d62 = p\u2c7c, the suffix w can continue unchanged from p\u1d62. The word uw is accepted.",
          incorrect: "The shortcut removes v and keeps both the prefix u and the accepting suffix w.",
          formal: String.raw`Since \(q_0\xrightarrow{u}p_i=p_j\xrightarrow{w}p_m\), the word \(uw\) is accepted and \(|uw|<|uvw|\).`,
          preview: V(["pi", "mid", "pj"], ["v-in", "v-out"], { dimNodes: ["p0", "pm"] }),
          reveal: V(["p0", "pi", "pm"], ["u", "shortcut"], { goodNodes: ["pm"], dimNodes: ["mid", "pj"] }),
          previewNote: "The loop returns to exactly the same state p\u1d62.",
          revealNote: "Removing it yields 'uw', still accepted, strictly shorter."
        },
        {
          label: "Conclusion",
          title: "Conclude: no shortest word can be that long",
          exposition: "We assumed |z| \u2265 n and derived a strictly shorter accepted word uw. But z was chosen as the shortest accepted word \u2014 contradiction. So our assumption must be false: the shortest accepted word has length less than n. If L(A) is nonempty, it contains an accepted word of length at most n\u22121.",
          question: "Which assumption led to the contradiction?",
          choices: ["|z| \u2265 n (the word is at least as long as the number of states)", "The DFA is complete", "z is accepted"],
          correct: 0,
          hint: "We showed |z| \u2265 n implies a shorter accepted word.",
          feedback: "Exactly. The contradiction rules out |z| \u2265 n. So the shortest accepted word satisfies |z| < n.",
          incorrect: "Acceptance and completeness remain; it is the assumption of excessive length that fails.",
          formal: String.raw`If the minimal accepted word had length at least \(n\), loop deletion would produce a shorter accepted word. Therefore its length is less than \(n\).`,
          preview: V(["p0", "pi", "pj", "pm"], ["u", "v-in", "v-out", "w"], {}),
          reveal: V(["p0", "pi", "pm"], ["u", "shortcut"], { goodNodes: ["p0", "pi", "pm"], dimNodes: ["mid", "pj"] }),
          previewNote: "A repeated state certifies a removable loop.",
          revealNote: "No shortest run can have a repeated state \u2014 so its length is < n."
        }
      ],
      previous: { label: "Closure of regular languages", href: "/proofs/chapter-02/regular-closure.html" },
      next: { label: "Myhill\u2013Nerode", href: "/proofs/chapter-02/myhill-nerode.html" }
    },

    "myhill-nerode": {
      slug: "myhill-nerode",
      chapter: 2,
      title: "Myhill\u2013Nerode theorem",
      theorem: "A language L is regular iff \u223cL has finitely many equivalence classes.",
      intro: "Two words x and y are Nerode-equivalent (x \u223cL y) if every suffix z leads them to the same fate: xz \u2208 L iff yz \u2208 L. Intuitively, x and y have identical futures. The theorem says L is regular exactly when there are only finitely many such 'futures'.",
      application: "For editor sessions, every prefix falls into one of four futures: (1) still before 'open', (2) currently open, (3) already closed, (4) malformed. Those four classes are exactly the four states of the minimal DFA.",
      strategy: "Prove a cycle of three implications: a DFA gives finitely many state-classes; any finite compatible grouping refines \u223cL; the \u223cL classes build a DFA. Three implications close the cycle.",
      invariant: "Words in one \u223cL class must always agree: appending the same suffix z, they both end up in L or both outside L.",
      synthesis: String.raw`If \(L\) is recognized by a DFA \(A\), define \(x\sim_A y\) when \(\widehat{\delta}(q_0,x)=\widehat{\delta}(q_0,y)\). This relation has at most \(|Q|\) classes, is preserved by appending the same suffix, and never identifies an accepted word with a rejected one. Conversely, any finite-index right-invariant relation \(\sim\) compatible with \(L\) refines the canonical relation \(\sim_L\): from \(x\sim y\), right-invariance gives \(xz\sim yz\) for every \(z\), and compatibility gives \(xz\in L\) iff \(yz\in L\). Thus \(\sim_L\) also has finite index. Finally, if \(\sim_L\) has finite index, construct a DFA whose states are \(\Sigma^*/{\sim_L}\), with initial state \([\varepsilon]\), transition \(\delta([w],a)=[wa]\), and final classes \([w]\) with \(w\in L\). Right-invariance and compatibility make the construction well-defined, and the resulting DFA recognizes exactly \(L\).`,
      diagram: {
        description: "Three implications in a cycle: (1) Regular implies Finite relation (DFA creates state-classes); (2) Finite relation implies Finite ~L (the canonical relation has at most as many classes); (3) Finite ~L implies Regular (build quotient DFA). In the center: Sigma*/~L, the quotient construction.",
        viewBox: [0, 0, 1000, 540],
        nodes: [
          N("regular", 500, 90, "(1) Regular", "a DFA exists", { width: 220 }),
          N("relation", 190, 410, "(2) Finite relation", "right-inv., compatible", { width: 240 }),
          N("mn", 810, 410, "(3) Finite \u223cL", "same futures", { width: 220 }),
          N("quotient", 500, 330, "\u03a3*/\u223cL", "one state per future", { shape: "circle", r: 76 })
        ],
        edges: [
          E("one-two", "regular", "relation", "DFA state-classes"),
          E("two-three", "relation", "mn", "classes fit inside \u223cL", { labelY: 392 }),
          E("three-one", "mn", "regular", "build quotient DFA"),
          E("mn-quotient", "mn", "quotient", "classes = states"),
          E("quotient-regular", "quotient", "regular", "finite, well-defined")
        ],
        annotations: [
          { x: 500, y: 520, text: "Example: 4 \u223cL classes for sessions \u2192 4-state minimal DFA.", anchor: "middle" }
        ]
      },
      steps: [
        {
          label: "(1) \u21d2 (2)",
          title: "A DFA state is a finite memory class",
          exposition: "Suppose a DFA A recognizes L. Two words x and y that lead to the same DFA state have identical futures: any suffix z produces the same transitions and the same verdict. So we group words by which DFA state they reach \u2014 that gives at most |Q| classes.",
          question: "When should two words be grouped into the same DFA class?",
          choices: ["When they reach the same DFA state after reading them from q\u2080", "When they have equal length", "When both contain the symbol 'a'"],
          correct: 0,
          hint: "The DFA's only memory is its current state \u2014 if two words leave the same state, the DFA cannot tell them apart.",
          feedback: "Correct. Same state = same future behavior for any suffix. The DFA creates at most |Q| such classes.",
          incorrect: "The DFA's stored memory is exactly its current state \u2014 that is what defines the class.",
          formal: String.raw`Define \(x\sim_A y\) iff \(\widehat{\delta}(q_0,x)=\widehat{\delta}(q_0,y)\). It is right-invariant, compatible with \(L\), and has at most \(|Q|\) classes.`,
          preview: V(["regular"], [], { dimNodes: ["mn", "quotient"] }),
          reveal: V(["regular", "relation"], ["one-two"], { goodNodes: ["relation"], dimNodes: ["mn", "quotient"] }),
          previewNote: "A DFA compresses every prefix into one of finitely many states.",
          revealNote: "Those state-fibers are finite memory classes \u2014 relation (2) exists."
        },
        {
          label: "(2) \u21d2 (3)",
          title: "Any valid grouping fits inside \u223cL",
          exposition: "Suppose some finite grouping \u223c is compatible with L and right-invariant. If x \u223c y, then for any z: right-invariance gives xz \u223c yz, and compatibility gives xz \u2208 L iff yz \u2208 L. So x and y agree on all suffixes \u2014 that is exactly x \u223cL y. Every \u223c-class fits inside one \u223cL-class, so \u223cL has at most as many classes as \u223c \u2014 still finite.",
          question: "If x \u223c y and \u223c is right-invariant and compatible, what follows?",
          choices: ["x \u223cL y (they have the same future w.r.t. L)", "x and y are the same word", "Every suffix z is accepted"],
          correct: 0,
          hint: "Append any suffix z, use right-invariance to get xz \u223c yz, then use compatibility.",
          feedback: "Exactly. Every valid finite grouping is at least as fine as \u223cL, so \u223cL itself must be finite.",
          incorrect: "The conclusion is that x and y agree on all future acceptance \u2014 not that they are identical words.",
          formal: String.raw`\(x\sim y\) implies \(xz\sim yz\) for every \(z\); compatibility gives \(xz\in L\) iff \(yz\in L\). Hence \(x\sim_L y\), so \(\sim\) refines \(\sim_L\).`,
          preview: V(["relation"], [], { dimNodes: ["regular", "quotient"] }),
          reveal: V(["relation", "mn"], ["two-three"], { goodNodes: ["mn"], dimNodes: ["regular", "quotient"] }),
          previewNote: "A valid grouping cannot merge words with distinguishable futures.",
          revealNote: "\u223cL is at most as fine as any valid grouping \u2014 it too must be finite."
        },
        {
          label: "(3) \u21d2 (1)",
          title: "Finite \u223cL classes become DFA states",
          exposition: "If \u223cL has finitely many classes, build a DFA: states = equivalence classes [w], initial state = [\u03b5], transition \u03b4([w], a) = [wa], final states = {[w] | w \u2208 L}. This works because right-invariance ensures [wa] doesn't depend on which word w we pick from [w].",
          question: "Why is the transition \u03b4([w], a) = [wa] well-defined?",
          choices: ["Because \u223cL is right-invariant: if w \u223cL w', then wa \u223cL w'a", "Because all words have finite length", "Because L is already regular"],
          correct: 0,
          hint: "Different words in the same class [w] must all lead to the same next class after reading 'a'.",
          feedback: "Correct. Right-invariance guarantees that w \u223cL w' implies wa \u223cL w'a, so [wa] is the same regardless of representative.",
          incorrect: "The proof is constructing regularity from \u223cL \u2014 it cannot assume regularity. Right-invariance is the key.",
          formal: String.raw`Use states \(\Sigma^*/{\sim_L}\), start state \([\varepsilon]\), transition \([w]\mapsto[wa]\), and final classes \(\{[w]\mid w\in L\}\). Right-invariance and compatibility make both definitions well-defined.`,
          preview: V(["mn"], [], { dimNodes: ["relation"] }),
          reveal: V(["mn", "quotient", "regular"], ["mn-quotient", "quotient-regular", "three-one"], { goodNodes: ["quotient", "regular"], dimNodes: ["relation"] }),
          previewNote: "Finite future-behavior classes are exactly the candidate states.",
          revealNote: "The quotient DFA is well-defined and recognizes L. The cycle closes."
        }
      ],
      previous: { label: "Small model property", href: "/proofs/chapter-02/small-model-property.html" },
      next: { label: "\u03c9-regular closure", href: "/proofs/chapter-03/omega-closure.html" }
    },

    "omega-closure": {
      slug: "omega-closure",
      chapter: 3,
      title: "Basic \u03c9-regular closure",
      theorem: "\u03c9-regular languages are closed under \u03c9-power, finite-prefix concatenation, union, and intersection.",
      intro: "B\u00fcchi automata accept infinite words by visiting an accepting state infinitely often. Combining two B\u00fcchi languages is trickier than the finite case: for intersection, the two automata may visit their accepting states at completely different times \u2014 we need to alternate the obligations.",
      application: "Take U = {open} and V = (edit+save)*save. Then UV\u03c9 opens the editor once and then completes infinitely many save-terminated edit blocks \u2014 an infinite session property.",
      strategy: "Reduce each operation to a B\u00fcchi construction. V\u03c9 and V\u00b7L use nondeterministic restarts or handoffs. Union uses an initial guess. Intersection uses a phase controller that alternates between the two acceptance conditions.",
      invariant: "The constructed B\u00fcchi run visits its accepting marker infinitely often exactly when every required source obligation is fulfilled infinitely often.",
      synthesis: String.raw`For \(V^\omega\), use an automaton for the finite, nonempty \(V\)-blocks and, whenever a block is completed, allow a nondeterministic restart through an accepting marker; visiting that marker infinitely often is equivalent to completing infinitely many consecutive \(V\)-blocks. For \(V\cdot L\), simulate \(V\) for a finite prefix and nondeterministically transfer to a B\u00fcchi automaton for \(L\) when a \(V\)-final state is reached. Union is obtained by an initial nondeterministic choice between the two B\u00fcchi automata. For intersection, the ordinary synchronous product is augmented with a finite phase component: phase one waits for \(F_1\), phase two waits for \(F_2\), and completing both phases visits an accepting marker before resetting. This marker recurs infinitely often iff both component runs visit their respective final sets infinitely often. Hence every listed operation preserves \(\omega\)-regularity.`,
      diagram: {
        description: "omega-REG at the center. Arrows point to V^omega (restart blocks), V*L (finite handoff), L1 union L2 (initial guess). Below: a phase controller cycling between 'wait F1' then accepting marker then 'wait F2' and back, for intersection.",
        viewBox: [0, 0, 1000, 560],
        nodes: [
          N("omega", 500, 280, "\u03c9-REG", "B\u00fcchi languages", { shape: "circle", r: 78 }),
          N("power", 185, 105, "V\u03c9", "restart at each block", { width: 190 }),
          N("concat", 500, 75, "V \u00b7 L", "finite handoff", { width: 190 }),
          N("union", 815, 105, "L\u2081 \u222a L\u2082", "initial guess", { width: 190 }),
          N("phase1", 250, 455, "wait F\u2081", "phase 1", { width: 180 }),
          N("phase2", 750, 455, "wait F\u2082", "phase 2", { width: 180 }),
          N("accept", 500, 455, "cycle done", "B\u00fcchi marker", { shape: "circle", r: 58, accepting: true })
        ],
        edges: [
          E("power-e", "omega", "power", "closure"),
          E("concat-e", "omega", "concat", "closure"),
          E("union-e", "omega", "union", "closure"),
          E("f1", "phase1", "accept", "hit F\u2081"),
          E("f2", "accept", "phase2", "start waiting F\u2082"),
          E("reset", "phase2", "phase1", "hit F\u2082 \u2192 restart", { path: "M 700 485 C 560 555 410 555 300 485", labelX: 500, labelY: 545 })
        ],
        annotations: [
          { x: 500, y: 390, text: "\u27f5 Phase controller for intersection \u27f6", anchor: "middle" }
        ]
      },
      steps: [
        {
          label: "V\u03c9",
          title: "Turn infinitely many block completions into B\u00fcchi visits",
          exposition: "A word belongs to V\u03c9 when it can be split into infinitely many consecutive non-empty blocks, each from V. The B\u00fcchi automaton simulates one V-block at a time. Whenever a V-final state is reached, it nondeterministically restarts through an accepting marker. Visiting that marker infinitely often = completing infinitely many V-blocks.",
          question: "What state should the B\u00fcchi automaton revisit each time a V-block is completed?",
          choices: ["The start state (through an accepting marker)", "A dead/sink state", "The previous input symbol"],
          correct: 0,
          hint: "Each block completion must be visible to the B\u00fcchi condition \u2014 what state makes that happen?",
          feedback: "Correct. An accepting restart at q\u2080 marks one block completion. Infinitely many restarts = V\u03c9.",
          incorrect: "The B\u00fcchi condition needs a state that is revisited once per completed block.",
          formal: String.raw`Whenever a run of the \(V\)-automaton reaches a final state, add the nondeterministic option to restart at \(q_0\) through an accepting marker. Infinite visits to that marker correspond to infinitely many consecutive nonempty \(V\)-blocks.`,
          preview: V(["omega"], [], { dimNodes: ["phase1", "phase2", "accept"] }),
          reveal: V(["omega", "power"], ["power-e"], { goodNodes: ["power"], dimNodes: ["phase1", "phase2", "accept"] }),
          previewNote: "V\u03c9 means: infinitely many finite blocks from V, concatenated.",
          revealNote: "A recurring accepting restart marks each block completion."
        },
        {
          label: "Concat and union",
          title: "One finite nondeterministic choice at a boundary",
          exposition: "V\u00b7L: the run must switch from V-mode to L-mode at some finite point. The automaton simulates V; when it reaches a V-final state, it nondeterministically jumps to the B\u00fcchi automaton for L. L\u2081 \u222a L\u2082: at the very start, the run nondeterministically commits to one component. Both use a single finite existential choice.",
          question: "What do V\u00b7L and L\u2081 \u222a L\u2082 have in common?",
          choices: ["Both require a single finite nondeterministic handoff or initial choice", "Both require a deterministic complement", "Both need an auxiliary stack"],
          correct: 0,
          hint: "Only one finite decision point separates the two modes.",
          feedback: "Exactly. The run makes one existential choice, then runs inside one component.",
          incorrect: "No unbounded memory is needed; a single finite existential choice is enough.",
          formal: String.raw`For \(V\cdot L\), jump to the \(L\)-automaton when a \(V\)-prefix finishes. For union, a fresh start duplicates the outgoing choices of both components.`,
          preview: V(["omega"], [], { dimNodes: ["phase1", "phase2", "accept"] }),
          reveal: V(["omega", "concat", "union"], ["concat-e", "union-e"], { goodNodes: ["concat", "union"], dimNodes: ["phase1", "phase2", "accept"] }),
          previewNote: "Two operations, one common idea: a nondeterministic boundary.",
          revealNote: "Nondeterminism implements that existential choice."
        },
        {
          label: "Intersection (problem)",
          title: "Why simultaneous final states fail for B\u00fcchi",
          exposition: "For finite automata, F\u2081\u00d7F\u2082 works perfectly. For B\u00fcchi it fails. Consider: automaton 1 visits F\u2081 on even steps, automaton 2 visits F\u2082 on odd steps. Both fulfill their condition infinitely often \u2014 but they are never simultaneously final. F\u2081\u00d7F\u2082 would accept no run at all.",
          question: "Why is the accepting set F\u2081\u00d7F\u2082 too strict for B\u00fcchi intersection?",
          choices: ["The two automata may visit their final sets at different times \u2014 never simultaneously", "The product automaton is infinite", "B\u00fcchi automata have no final states"],
          correct: 0,
          hint: "Imagine one automaton accepting on even steps and the other on odd steps \u2014 does F\u2081\u00d7F\u2082 ever trigger?",
          feedback: "Correct. Both obligations can recur forever without ever happening at the same step.",
          incorrect: "The issue is timing: both may recur, just never at the same position.",
          formal: String.raw`B\u00fcchi acceptance requires visits to each of \(F_1\) and \(F_2\) infinitely often, not visits to \(F_1\times F_2\) at common instants.`,
          preview: V(["phase1", "phase2"], [], { dimNodes: ["power", "concat", "union"] }),
          reveal: V(["phase1", "phase2"], [], { badNodes: ["accept"], dimNodes: ["power", "concat", "union"] }),
          previewNote: "Both automata must accept infinitely often \u2014 but not necessarily together.",
          revealNote: "Simultaneous finality may never occur even when both conditions recur."
        },
        {
          label: "Intersection (fix)",
          title: "Alternate the obligations with a phase bit",
          exposition: "The fix: a phase controller. Phase 1 waits for F\u2081. When F\u2081 is hit, switch to phase 2, wait for F\u2082. When F\u2082 is hit, mark one complete cycle (the B\u00fcchi accepting state), and reset to phase 1. If both obligations recur infinitely often, the cycle completes infinitely often.",
          question: "When does the product mark one accepting cycle as complete?",
          choices: ["After visiting F\u2081 and then F\u2082 (in that order)", "After visiting either F\u2081 or F\u2082 once", "At every transition step"],
          correct: 0,
          hint: "The phase controller must witness both obligations in sequence before resetting.",
          feedback: "Exactly. Infinitely many completed phases means both F\u2081 and F\u2082 recur infinitely often.",
          incorrect: "One complete round must witness both F\u2081 and F\u2082 \u2014 not just one.",
          formal: String.raw`The phase component waits for \(F_1\), then \(F_2\), then emits an accepting marker and resets. Marker recurrence is equivalent to both obligations recurring.`,
          preview: V(["phase1"], [], { dimNodes: ["power", "concat", "union"] }),
          reveal: V(["phase1", "accept", "phase2"], ["f1", "f2", "reset"], { goodNodes: ["accept"], dimNodes: ["power", "concat", "union"] }),
          previewNote: "Phase 1: wait until F\u2081 is hit.",
          revealNote: "After F\u2081 \u2192 phase 2 \u2192 wait F\u2082 \u2192 mark cycle \u2192 restart. Infinitely often = both recur."
        }
      ],
      previous: { label: "Myhill\u2013Nerode", href: "/proofs/chapter-02/myhill-nerode.html" },
      next: { label: "B\u00fcchi\u2013expression equivalence", href: "/proofs/chapter-03/buchi-expression-equivalence.html" }
    },

    "buchi-expression-equivalence": {
      slug: "buchi-expression-equivalence",
      chapter: 3,
      title: "B\u00fcchi\u2013expression equivalence",
      theorem: "A language of infinite words is B\u00fcchi-recognizable iff it is denoted by an \u03c9-regular expression.",
      intro: "An \u03c9-regular expression is a finite union of terms UV\u03c9 \u2014 one finite prefix U, then infinitely many repetitions of V. Every accepting B\u00fcchi run, after some prefix, revisits some final state f infinitely often. That creates a lasso: prefix \u2192 reach f \u2192 loop back to f \u2192 loop \u2192 \u2026",
      application: "For editor sessions: U = {open} is the finite setup. V = (edit+save)*save is one operation block ending in save. The term UV\u03c9 means: open the editor, then complete infinitely many save-terminated blocks.",
      strategy: "Expression \u2192 automaton: compile UV\u03c9 by simulating U, then repeatedly completing V-blocks marked by an accepting restart. Automaton \u2192 expression: every accepting run revisits some fixed f \u2208 F infinitely often (pigeonhole), giving a lasso UV\u03c9 per final state f.",
      invariant: "Every displayed finite block labels a real path with the stated endpoints; concatenating the blocks yields one infinite run.",
      synthesis: String.raw`Every \(\omega\)-regular expression is a finite union of terms \(UV^\omega\) with regular \(U\) and \(V\subseteq\Sigma^+\). For one term, a B\u00fcchi automaton first simulates an automaton for \(U\), nondeterministically transfers to an automaton for \(V\), and visits an accepting restart marker whenever a \(V\)-block is completed; the marker recurs exactly for words in \(UV^\omega\). Conversely, let \(\mathcal{A}\) be a B\u00fcchi automaton and let \(W_{s,s'}\) be the regular language of finite labels taking \(s\) to \(s'\). Every accepting run visits some fixed \(f\in F\) infinitely often. Cutting at successive \(f\)-visits yields a prefix in \(W_{q_0,f}\) followed by infinitely many nonempty blocks in \(W_{f,f}\setminus\{\varepsilon\}\). Therefore \(L(\mathcal{A})=\bigcup_{f\in F}W_{q_0,f}(W_{f,f}\setminus\{\varepsilon\})^\omega\), a finite \(\omega\)-regular expression.`,
      diagram: {
        description: "Left: expression term UV^omega. Center: a run starting at q0, reaching recurrent final state f (via prefix u), then looping back to f via v1, v2, v3,... forever. Top center: the union over f in F collects one term per possible recurrent final state.",
        viewBox: [0, 0, 1000, 540],
        nodes: [
          N("expr", 140, 95, "UV\u03c9", "expression term", { width: 170 }),
          N("q0", 160, 330, "q\u2080", "run starts here", { shape: "circle" }),
          N("f", 545, 330, "f", "recurrent final", { shape: "circle", r: 54, accepting: true }),
          N("loop1", 760, 180, "v\u2081", "loop (non-empty)", { width: 160 }),
          N("loop2", 880, 330, "v\u2082, v\u2083, \u2026", "repeat forever", { width: 170 }),
          N("union", 500, 95, "\u22c3 f \u2208 F", "one term per final state", { width: 240 })
        ],
        edges: [
          E("prefix", "q0", "f", "u  (prefix)", { labelY: 310 }),
          E("loop-in", "f", "loop1", "W\u1D69,\u1D69"),
          E("loop-out", "loop1", "f", "return to f", { path: "M 720 210 C 620 245 610 270 590 292", labelX: 675, labelY: 250 }),
          E("repeat", "f", "loop2", "\u03c9"),
          E("expr-run", "expr", "q0", "build run"),
          E("run-union", "f", "union", "choose recurrent f"),
          E("union-expr", "union", "expr", "\u03c9-expression")
        ],
        annotations: [
          { x: 500, y: 510, text: "Lasso shape: one prefix into f, then infinite loops back to f.", anchor: "middle" }
        ]
      },
      steps: [
        {
          label: "Expr \u2192 Automaton",
          title: "Compile UV\u03c9: one prefix, infinitely many blocks",
          exposition: "A term UV\u03c9 says: read a finite word from U, then read infinitely many words from V (each non-empty). The automaton: simulate U, then nondeterministically jump to simulating V. Whenever a V-block is completed (a V-final state is reached), restart V and mark the restart as an accepting event. Infinitely many marked restarts = UV\u03c9 accepted.",
          question: "After the U-prefix is completed, what must the automaton keep doing?",
          choices: ["Complete infinitely many V-blocks, marking each one", "Stop immediately after one V-block", "Read just one V-block and halt"],
          correct: 0,
          hint: "The exponent \u03c9 means an infinite, never-ending sequence of V-blocks.",
          feedback: "Correct. Each V-block completion triggers a marked restart. Infinitely many restarts = B\u00fcchi acceptance.",
          incorrect: "The infinite suffix requires recurring completions, not a single one.",
          formal: String.raw`Simulate an automaton for \(U\), switch to one for \(V\), and restart \(V\) through an accepting marker after every completed nonempty block.`,
          preview: V(["expr"], [], { dimNodes: ["union", "loop1", "loop2"] }),
          reveal: V(["expr", "q0", "f", "loop1"], ["expr-run", "prefix", "loop-in", "loop-out"], { goodNodes: ["f"], dimNodes: ["union", "loop2"] }),
          previewNote: "UV\u03c9: a finite prefix phase, then an infinite loop phase.",
          revealNote: "The B\u00fcchi run marks each completed V-block. The lasso emerges."
        },
        {
          label: "Automaton \u2192 Expr",
          title: "An accepting run must revisit some fixed f",
          exposition: "Take any B\u00fcchi-accepting run: it visits F infinitely often. But F is a finite set. By pigeonhole: infinitely many visits to a finite set means at least one element is visited infinitely often. Fix that element as f.",
          question: "Why must an accepting B\u00fcchi run revisit some fixed f \u2208 F infinitely often?",
          choices: ["F is finite \u2014 infinitely many visits to finitely many states forces a repetition", "The alphabet is unary", "The run is deterministic"],
          correct: 0,
          hint: "Distribute infinitely many visits across finitely many states. What happens?",
          feedback: "Exactly. Pigeonhole: at least one state in F must absorb infinitely many visits.",
          incorrect: "The argument uses finiteness of F, not alphabet size or determinism.",
          formal: String.raw`A B\u00fcchi-accepting run visits \(F\) infinitely often. Since \(F\) is finite, at least one \(f\in F\) occurs infinitely often.`,
          preview: V(["q0", "f"], ["prefix"], { dimNodes: ["expr", "union", "loop1", "loop2"] }),
          reveal: V(["f"], [], { goodNodes: ["f"], dimNodes: ["expr", "union", "q0", "loop1", "loop2"] }),
          previewNote: "The run visits F many times \u2014 maybe different final states each time.",
          revealNote: "One particular f \u2208 F must appear infinitely often."
        },
        {
          label: "Automaton \u2192 Expr",
          title: "Cut the run into a prefix and infinite loops at f",
          exposition: "Once f is fixed, dissect the infinite run. The first segment goes from q\u2080 to f: its word u belongs to Wq\u2080,f. Each subsequent return from f back to f is a loop: word v\u2099 \u2208 Wf,f. Each v\u2099 must be non-empty \u2014 otherwise the run would never advance along the infinite word.",
          question: "Why must we exclude \u03b5 from the loop language Wf,f?",
          choices: ["Each loop must consume at least one symbol to advance the infinite word", "\u03b5 is not regular", "The prefix already uses \u03b5"],
          correct: 0,
          hint: "What would happen if some loop consumed zero symbols? Would the run ever advance?",
          feedback: "Correct. An \u03b5-loop would return to f without reading anything \u2014 the run would never proceed.",
          incorrect: "\u03b5 is regular, but empty loops would stall the infinite-word progress.",
          formal: String.raw`The prefix lies in \(W_{q_0,f}\), and every later segment lies in \(W_{f,f}\setminus\{\varepsilon\}\); their concatenation lies in \(W_{q_0,f}(W_{f,f}\setminus\{\varepsilon\})^\omega\).`,
          preview: V(["q0", "f"], ["prefix"], { dimNodes: ["expr", "union"] }),
          reveal: V(["q0", "f", "loop1", "loop2"], ["prefix", "loop-in", "loop-out", "repeat"], { goodNodes: ["f"], dimNodes: ["expr", "union"] }),
          previewNote: "After the prefix, mark each return to f as a loop.",
          revealNote: "Prefix \u2208 Wq\u2080,f and loops \u2208 Wf,f\\{\u03b5}. The lasso is complete."
        },
        {
          label: "Equality",
          title: "Union over all final states covers every run",
          exposition: "Different accepting runs may revisit different final states. But F is finite, so there are only |F| possible choices of recurrent f. Taking one term Wq\u2080,f \u00b7 (Wf,f\\{\u03b5})\u03c9 for each f \u2208 F and taking their union gives an \u03c9-regular expression covering all accepting runs.",
          question: "Why is the finite union \u22c3\u1D69\u2208F Wq\u2080,f (Wf,f\\{\u03b5})\u03c9 still \u03c9-regular?",
          choices: ["Because there are finitely many final states, and each term Wq\u2080,f (Wf,f\\{\u03b5})\u03c9 is \u03c9-regular", "Because every loop has length one", "Because the automaton has only one run"],
          correct: 0,
          hint: "The expression contributes one term per f \u2208 F. How many terms are there?",
          feedback: "Exactly. A finite union of \u03c9-regular terms is \u03c9-regular.",
          incorrect: "Loop lengths may vary; what matters is the finite number of candidate final states.",
          formal: String.raw`\(L(A)=\bigcup_{f\in F}W_{q_0,f}(W_{f,f}\setminus\{\varepsilon\})^\omega\). Both inclusions follow by cutting or concatenating paths.`,
          preview: V(["f", "union"], ["run-union"], { dimNodes: ["loop1", "loop2"] }),
          reveal: V(["union", "expr"], ["union-expr"], { goodNodes: ["union", "expr"], dimNodes: ["q0", "f", "loop1", "loop2"] }),
          previewNote: "Each recurrent final state contributes one expression term.",
          revealNote: "The finite union covers all accepting runs. The equality holds."
        }
      ],
      previous: { label: "\u03c9-regular closure", href: "/proofs/chapter-03/omega-closure.html" },
      next: { label: "Ramsey decomposition", href: "/proofs/chapter-04/ramsey-decomposition.html" }
    },

    "ramsey-decomposition": {
      slug: "ramsey-decomposition",
      chapter: 4,
      title: "Ramsey decomposition",
      theorem: "Every \u03c9-word \u03b1 belongs to U\u00b7V\u03c9 for some \u2261-classes U,V of a finite-index congruence \u2261, with V\u00b7V\u2286V.",
      intro: "A generic \u03c9-word need not be periodic at all — it can have gaps that grow forever. Yet a finite-index congruence can still slice any such word into one finite prefix and infinitely many interchangeable repeating blocks. Two nested pigeonhole arguments, linked by a persistence property, do the slicing.",
      application: "Running example: the automaton has states s\u2080,s\u2081,s\u2082 (F={s\u2081}) and transitions s\u2080\u2013a\u2192s\u2081, s\u2081\u2013b\u2192s\u2082, s\u2082\u2013c\u2192s\u2082 (self-loop), s\u2082\u2013a\u2192s\u2081. The word \u03b1=abc\u00b7abcc\u00b7abccc\u22ef has ever-growing gaps of c's and is not ultimately periodic — yet every block abc\u207f produces the identical \u2248\u1d00-behaviour (reach s\u2082 from s\u2080 or s\u2082, visiting F, and die immediately from s\u2081), so \u03b1 decomposes as [\u03b5]\u00b7V\u03c9 for a single class V.",
      strategy: "Build a second finite-index equivalence, this time on the positions of \u03b1, by colouring pairs of positions with the \u2261-class of the segment between them. Pigeonhole gives an infinite pairwise-merging set of positions; persistence (congruence applied to a shared future suffix) lets that merge survive forever. A second, independent pigeonhole on cumulative-prefix classes gives infinitely many prefixes in one class V — not yet consecutive blocks. Persistence links the two arguments: it transfers V's class from a cumulative prefix onto the very next gap, turning the merely-infinite-prefixes claim into genuine consecutive V-blocks. One witnessed concatenation then transports, via congruence, to V\u00b7V\u2286V.",
      invariant: "Step by step, more of the concrete α = abc·abcc·abccc⋯ is certified to lie in U·Vω: first the finitely many segment-classes exist, then infinitely many prefixes α(k₀,kᵢ) share one class V, then every consecutive gap α(kᵢ,kⱼ) also lies in V, and finally V·V ⊆ V — so the running example is provably U·Vω, not merely plausibly so.",
      synthesis: String.raw`Fix a finite-index congruence \(\equiv\) on \(\Sigma^*\) and an \(\omega\)-word \(\alpha\). Define \(k\mathbin{\overset{\sim}{=}}_\alpha k'\) when \(\alpha(k,m)\equiv\alpha(k',m)\) for some future position \(m\); this relation inherits finite index from \(\equiv\) via pigeonhole, and it is persistent: once two positions merge at some \(m\), congruence (\(x\equiv y\Rightarrow xz\equiv yz\)) keeps them merged at every later \(m'\). Pigeonhole on positions yields an infinite, pairwise-merging sequence \(k_0<k_1<k_2<\cdots\). Separately, pigeonhole on the \(\equiv\)-classes of the cumulative prefixes \(\alpha(k_0,k_i)\) yields infinitely many of them in one class \(V\), so \(\alpha\in U\overrightarrow V\) for \(U=[\alpha(0,k_0)]\) — real progress, but not yet consecutive blocks. Thinning the sequence once more so that \(k_0,\ldots,k_i\) all merge at \(k_{i+1}\) lets persistence transfer \(\alpha(k_0,k_{i+1})\in V\) onto the gap: \(\alpha(k_i,k_{i+1})\equiv\alpha(k_0,k_{i+1})\in V\). Every consecutive block is therefore in \(V\), so \(\alpha\in UV^\omega\). Finally, one witnessed pair \(a=\alpha(k_0,k_1)\), \(b=\alpha(k_1,k_2)\) with \(ab\in V\) transports, via congruence, to \(V\cdot V\subseteq V\): for arbitrary \(x,y\in V\), \(x\equiv a\) and \(y\equiv b\) give \(xy\equiv ab\in V\).`,
      diagram: {
        description: "The omega-word alpha is drawn as a ribbon of indexed positions carrying the symbols a,b,c -- here each symbol is its own merge-class. A compact automaton on top defines the equivalence; the checkpoints m=7, m=8 and the segment arcs alpha(2,8)=cabcca, alpha(5,8)=cca below the ribbon stage the thinning step.",
        viewBox: [0, 0, 1000, 340],
        lanes: [
          { y: 200, x1: 100, x2: 955, label: "", labelX: 0, labelY: 0 }
        ],
        nodes: [
          N("s0", 180, 58, "s\u2080", "", { shape: "circle", r: 20 }),
          N("s1", 400, 58, "s\u2081", "", { shape: "circle", r: 20, accepting: true }),
          N("s2", 620, 58, "s\u2082", "", { shape: "circle", r: 20 }),
          N("p0", 120, 200, "a", "0", { shape: "circle", r: 16 }),
          N("p1", 192, 200, "b", "1", { shape: "circle", r: 16 }),
          N("p2", 264, 200, "c", "2", { shape: "circle", r: 16 }),
          N("p3", 336, 200, "a", "3", { shape: "circle", r: 16 }),
          N("p4", 408, 200, "b", "4", { shape: "circle", r: 16 }),
          N("p5", 480, 200, "c", "5", { shape: "circle", r: 16 }),
          N("p6", 552, 200, "c", "6", { shape: "circle", r: 16 }),
          N("p7", 624, 200, "a", "7", { shape: "circle", r: 16 }),
          N("p8", 696, 200, "b", "8", { shape: "circle", r: 16 }),
          N("p9", 768, 200, "c", "9", { shape: "circle", r: 16 }),
          N("p10", 840, 200, "c", "10", { shape: "circle", r: 16 }),
          N("p11", 912, 200, "c", "11", { shape: "circle", r: 16 })
        ],
        edges: [
          E("aut_a", "s0", "s1", "a"),
          E("aut_b", "s1", "s2", "b"),
          E("aut_c", "s2", "s2", "c", { path: "M 602 46 C 590 14 650 14 638 46", labelX: 620, labelY: 14 }),
          E("aut_a2", "s2", "s1", "a", { path: "M 604 74 C 540 104 480 104 416 76", labelX: 508, labelY: 106 }),
          E("pbr", "p3", "p7", "3 ≈ 7", { path: "M 336 182 Q 480 152 624 182", labelX: 480, labelY: 173 }),
          E("m7", "p6", "p7", "m=7", { path: "M 588 176 L 588 224", labelX: 588, labelY: 240 }),
          E("m8", "p7", "p8", "m=8", { path: "M 660 176 L 660 224", labelX: 660, labelY: 240 }),
          E("seg28", "p2", "p7", "\u03b1(2,8)=cabcca", { path: "M 264 216 Q 460 304 660 220", labelX: 452, labelY: 304 }),
          E("seg58", "p5", "p7", "\u03b1(5,8)=cca", { path: "M 480 216 Q 574 284 660 214", labelX: 578, labelY: 282 })
        ],
        annotations: [
          { x: 96, y: 206, text: "\u03b1 =", anchor: "end" },
          { x: 948, y: 206, text: "\u22ef", anchor: "start" },
          { x: 660, y: 78, text: "\u2248\u1d00 sends each block to a \u2261-class", anchor: "start" },
          { x: 192, y: 138, text: "abc", anchor: "middle" },
          { x: 444, y: 138, text: "abcc", anchor: "middle" },
          { x: 768, y: 138, text: "abccc", anchor: "middle" }
        ]
      },
      steps: [
        {
          label: "Setup",
          title: "Why positions need their own finite-index relation",
          exposition: String.raw`We already have one finite-index tool: \(\equiv\) itself, classifying the finite segments of \(\alpha\) into finitely many labels. But \(\alpha\) has infinitely many positions, and nothing about \(\equiv\) directly compares two positions — only the words that sit between them. To run pigeonhole on positions, we need a second equivalence relation, one that lives on \(\mathbb N\) itself, built out of \(\equiv\).`,
          question: "Which construction would let pigeonhole force two DIFFERENT positions of \u03b1 to become interchangeable?",
          choices: [
            {
              text: "Colour each pair of positions (k,k') by the \u2261-class of a shared-future segment — \u03b1(k,m) versus \u03b1(k',m) for some common m — and let pigeonhole act on those finitely many colours.",
              correct: true,
              feedback: "Exactly — this is the merge relation: colour positions by segment class, and pigeonhole among finitely many colours forces a collision."
            },
            {
              text: "Colour each position k by the single symbol \u03b1(k) — finitely many alphabet symbols already force a collision.",
              correct: false,
              causalFailure: "For THIS automaton that happens to match the real partition (Example 4.4.6 found exactly 3 classes, one per symbol) — but purely by coincidence, since this automaton's states each read at most one letter. It doesn't use \u2261 at all, so for a general congruence it need not have finite index, and it has no persistence property: two positions with the same next symbol can behave completely differently just one step later.",
              consequence: V(["p0", "p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p9", "p10", "p11"], [], { badNodes: ["s0", "s1", "s2"], dimEdges: ["m7", "m8", "seg28", "seg58", "pbr"] })
            },
            {
              text: "Colour each position k by the \u2261-class of the entire infinite suffix \u03b1(k,\u03c9) — finite index on \u2261 bounds the number of suffixes.",
              correct: false,
              causalFailure: "\u2261 is a congruence on FINITE words (\u03a3*); \u03b1(k,\u03c9) is an infinite suffix, so it has no \u2261-class to begin with — \u2261 was never defined on infinite objects, and none of its properties (congruence, finite index) say anything about entire \u03c9-suffixes.",
              consequence: V([], [], { badNodes: ["p9", "p10", "p11"], dimNodes: ["s0", "s1", "s2"], dimEdges: ["m7", "m8", "seg28", "seg58", "pbr"] })
            }
          ],
          hint: "The relation being built compares two FINITE segments that both run out to the same future point m — not single symbols, not whole infinite suffixes.",
          formal: String.raw`\(k\mathbin{\overset{\sim}{=}}_{\alpha,m}k'\) means \(\alpha(k,m)\equiv\alpha(k',m)\); \(k\mathbin{\overset{\sim}{=}}_\alpha k'\) means this holds for some \(m\).`,
          preview: V([], [], { dimEdges: ["m7", "m8", "seg28", "seg58", "pbr"] }),
          reveal: V(["s0", "s1", "s2"], ["aut_a", "aut_b", "aut_c", "aut_a2"], { goodNodes: ["p0", "p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p9", "p10", "p11"], dimEdges: ["m7", "m8", "seg28", "seg58", "pbr"] }),
          previewNote: "Two objects on the board: the automaton (which defines ≡) and the bare positions of α.",
          revealNote: "Each position now carries a finite-index class, read off the automaton — a second tool, on positions."
        },
        {
          label: "Pigeonhole on positions",
          title: "Finitely many classes force an infinite collision",
          exposition: String.raw`The merge relation inherits finite index from \(\equiv\): if \(\equiv\) has \(r\) classes, any \(r+1\) positions must include two that merge. Running this on all of \(\mathbb N\) (not just \(r+1\) positions) yields an infinite set of positions that pairwise merge with each other.`,
          question: "Example 4.4.6 computed exactly 3 merge-classes among the positions of this \u03b1 (one per symbol a/b/c). Positions 0 through 10 are 11 positions in total. What does pigeonhole guarantee?",
          choices: [
            {
              text: "Some class holds at least \u2308 11/3 \u2309 = 4 of these 11 positions — a genuine, unavoidable collision.",
              correct: true,
              feedback: "Right: 11 positions into 3 realized classes forces some class to hold at least 4 of them."
            },
            {
              text: "Nothing is guaranteed — with a deterministic automaton, all 11 positions could still land in separate classes.",
              correct: false,
              causalFailure: "This confuses 'up to 3^9 classes possible in general' with 'only 3 classes actually occur for this \u03b1' — a fact already computed directly in Example 4.4.6. Once the number of REALIZED classes is bounded (here, 3), pigeonhole is unconditional: determinism doesn't change arithmetic, 11 items cannot survive in 3 bins without a collision.",
              consequence: V([], [], { badNodes: ["p2", "p5", "p6", "p9", "p10"], dimNodes: ["p0", "p1", "p3", "p4", "p7", "p8", "s0", "s1", "s2", "p11"], dimEdges: ["m7", "m8", "seg28", "seg58", "pbr"] })
            },
            {
              text: "Every position from 0 to 10 must merge with position 0 specifically.",
              correct: false,
              causalFailure: "Pigeonhole only guarantees SOME class gets crowded — it says nothing about WHICH one. Here the crowded class is actually the 'c' class {2,5,6,9,\u2026}, not position 0's own 'a' class {0,3,7,\u2026}; positions 2, 5, 6, 9 never merge with 0 at all.",
              consequence: V(["p0"], [], { goodNodes: ["p3", "p7"], badNodes: ["p2", "p5", "p6", "p9", "p10"], dimNodes: ["p1", "p4", "p8", "s0", "s1", "s2", "p11"], dimEdges: ["m7", "m8", "seg28", "seg58", "pbr"] })
            }
          ],
          hint: "Pigeonhole compares the number of items (11 positions) to the number of realized bins (3 classes) — it doesn't care what the automaton does internally.",
          formal: String.raw`If \(\equiv\) has \(r\) classes and \(\mathbin{\overset{\sim}{=}}_\alpha\) had more than \(r\), then \(r+1\) pairwise non-merging positions would yield \(r+1\) segments to one common \(m\) falling into only \(r\) classes of \(\equiv\) — a contradiction.`,
          preview: V([], [], { dimNodes: ["s0", "s1", "s2", "p11"], dimEdges: ["m7", "m8", "seg28", "seg58", "pbr"] }),
          reveal: V([], [], { goodNodes: ["p2", "p5", "p6", "p9", "p10"], dimNodes: ["p0", "p1", "p3", "p4", "p7", "p8", "s0", "s1", "s2", "p11"], dimEdges: ["m7", "m8", "seg28", "seg58", "pbr"] }),
          previewNote: "Only 3 classes are realized among positions 0\u201310 (Example 4.4.6).",
          revealNote: "11 positions into 3 classes: the c-class {2,5,6,9,10} must hold 5 \u2265 \u230811/3\u2309 = 4."
        },
        {
          label: "Persistence",
          title: "A merge at one checkpoint survives at every later one",
          exposition: String.raw`\(\equiv\) is a congruence: appending the same continuation to two \(\equiv\)-equivalent words keeps them \(\equiv\)-equivalent (\(x\equiv y \Rightarrow xz\equiv yz\) for every \(z\)). We have not yet asked what that buys us across time — once two positions merge at some checkpoint \(m\), does a later checkpoint have to be verified again from scratch?`,
          question: "Positions 3 and 7 of \u03b1 merge at m=12: \u03b1(3,12) and \u03b1(7,12) reach the same automaton behaviour. Does this already decide whether they merge at m'=17, or does the shared continuation \u03b1(12,17)=\u201cabccc\u201d need its own separate check?",
          choices: [
            {
              text: "Already decided — congruence appends \u03b1(12,17) to both sides at once: \u03b1(3,12)\u2261\u03b1(7,12) gives \u03b1(3,12)\u00b7\u03b1(12,17) \u2261 \u03b1(7,12)\u00b7\u03b1(12,17), i.e. \u03b1(3,17)\u2261\u03b1(7,17), with no new check.",
              correct: true,
              feedback: "Exactly — persistence is right-invariance of \u2261 applied to the shared suffix \u03b1(12,17). Once merged, always merged."
            },
            {
              text: "It has to be checked separately — merging is a fact about one specific m, so a later m' is an independent question.",
              correct: false,
              causalFailure: "If that were true, an infinite pairwise-merging set of positions would only ever certify 'merged at SOME point', never 'merged from some point on forever' — and the Thinning step needs exactly the forever version to transfer a cumulative prefix's class onto a gap. Without persistence, no finite amount of checking could certify infinitely many blocks in one class, and U\u00b7V\u03c9 would collapse to a claim about finitely many blocks.",
              consequence: V([], [], { badNodes: ["p3", "p7"], dimNodes: ["p0", "p1", "p2", "p4", "p5", "p6", "p8", "p9", "p10", "p11", "s0", "s1", "s2"], dimEdges: ["m7", "m8", "seg28", "seg58", "pbr"] })
            },
            {
              text: "It depends on whether \u03b1(12,17) itself is long enough to reach a final state — short continuations might not preserve the merge.",
              correct: false,
              causalFailure: "Congruence doesn't care about length or about F at all here — x\u2261y \u21d2 xz\u2261yz holds for every z, however short, whatever it does with F. Whether F is visited is already one of the coordinates \u2261 tracks inside x and y; z is simply appended identically to both sides, unexamined.",
              consequence: V(["p3", "p7"], ["pbr"], { goodNodes: ["p3", "p7"], dimNodes: ["p0", "p1", "p2", "p4", "p5", "p6", "p8", "p9", "p10", "p11", "s0", "s1", "s2"], dimEdges: ["m7", "m8", "seg28", "seg58"] })
            }
          ],
          hint: "Don't recompute reachability from positions 3 and 7 out to 17 separately — factor both through the shared checkpoint 12 and reuse what's already established there.",
          formal: String.raw`If \(k\mathbin{\overset{\sim}{=}}_{\alpha,m}k'\), then \(k\mathbin{\overset{\sim}{=}}_{\alpha,m'}k'\) for every \(m'\geq m\).`,
          preview: V(["p3", "p7"], [], { dimNodes: ["p0", "p1", "p2", "p4", "p5", "p6", "p8", "p9", "p10", "p11", "s0", "s1", "s2"], dimEdges: ["m7", "m8", "seg28", "seg58", "pbr"] }),
          reveal: V(["p3", "p7"], ["pbr"], { goodNodes: ["p3", "p7"], dimNodes: ["p0", "p1", "p2", "p4", "p5", "p6", "p8", "p9", "p10", "p11", "s0", "s1", "s2"], dimEdges: ["m7", "m8", "seg28", "seg58"] }),
          previewNote: "Positions 3 and 7 merge at one checkpoint \u2014 must a later one be re-checked?",
          revealNote: "Congruence appends the shared suffix to both sides: merged once \u21d2 merged at every later m (12 \u2192 17)."
        },
        {
          label: "Pigeonhole on segments",
          title: "Infinitely many good prefixes — but not yet consecutive blocks",
          exposition: String.raw`Separately from positions, pigeonhole the cumulative prefixes \(\alpha(k_0,k_1),\alpha(k_0,k_2),\alpha(k_0,k_3),\ldots\): only finitely many \(\equiv\)-classes are available, so infinitely many of them share one class \(V\). That already gives \(\alpha\in U\overrightarrow V\) (vectorial closure: infinitely many prefixes in \(V\)). The lemma needs more: consecutive blocks in \(V\), all the way out to \(\omega\).`,
          question: "Suppose all we know is: infinitely many i have \u03b1(k\u2080,k\u1d62)\u2208V. Does this alone already give the GAPS \u03b1(k\u1d62,k\u2c7c)\u2208V too, for consecutive chosen i<j?",
          choices: [
            {
              text: "No — two different i,j could each land back in V by unrelated routes; the gap \u03b1(k\u1d62,k\u2c7c) is unconstrained unless k\u1d62 and k\u2c7c are ALSO known to merge as positions.",
              correct: true,
              feedback: "Right — vectorial closure alone says nothing about the piece strictly between two good prefixes. That's exactly the gap persistence closes."
            },
            {
              text: "Yes — if \u03b1(k\u2080,k\u1d62) and \u03b1(k\u2080,k\u2c7c) are both in V, congruence forces \u03b1(k\u1d62,k\u2c7c) into V too, since V is closed under concatenation.",
              correct: false,
              causalFailure: "This assumes V\u00b7V\u2286V before it's proved — that closure is this very lemma's own conclusion, established later from one witnessed concatenation, not asserted upfront. And even granting it, concatenation isn't cancellative: \u03b1(k\u2080,k\u1d62)\u00b7\u03b1(k\u1d62,k\u2c7c)=\u03b1(k\u2080,k\u2c7c) doesn't let you solve for the middle factor's class from the two endpoints alone.",
              consequence: V([], [], { goodNodes: ["p0", "p3", "p7"], badNodes: ["p4", "p5", "p6"], dimNodes: ["p1", "p2", "p8", "p9", "p10", "p11", "s0", "s1", "s2"], dimEdges: ["m7", "m8", "seg28", "seg58", "pbr"] })
            },
            {
              text: "Yes, automatically — every \u2261-class is regular, and regular languages are closed under all Boolean operations.",
              correct: false,
              causalFailure: "Closure of regular LANGUAGES under Boolean operations is a fact about U and V as sets (useful later, for building an automaton for U\u00b7V\u03c9). It says nothing about which class one specific segment \u03b1(k\u1d62,k\u2c7c) of this one word \u03b1 happens to land in — that's a membership question about a single finite word, not a language-closure question.",
              consequence: V([], [], { goodNodes: ["p0", "p3", "p7"], badNodes: ["p4", "p5", "p6", "p8"], dimNodes: ["p1", "p2", "p9", "p10", "p11", "s0", "s1", "s2"], dimEdges: ["m7", "m8", "seg28", "seg58", "pbr"] })
            }
          ],
          hint: "Ask what the two good prefixes \u03b1(k\u2080,k\u1d62) and \u03b1(k\u2080,k\u2c7c) have in common as POSITIONS, not just as words — do k\u1d62 and k\u2c7c merge with each other?",
          formal: String.raw`\(\alpha(k_0,\omega)\in\overrightarrow{V}\) implies \(\alpha\in U\overrightarrow V\); but \(\alpha(k_i,k_j)\in V\) for consecutive \(i<j\) is NOT yet implied.`,
          preview: V(["p0", "p3", "p7"], [], { dimNodes: ["p1", "p2", "p4", "p5", "p6", "p8", "p9", "p10", "p11", "s0", "s1", "s2"], dimEdges: ["m7", "m8", "seg28", "seg58", "pbr"] }),
          reveal: V([], [], { goodNodes: ["p0", "p3", "p7"], dimNodes: ["p1", "p2", "p4", "p5", "p6", "p8", "p9", "p10", "p11", "s0", "s1", "s2"], dimEdges: ["m7", "m8", "seg28", "seg58", "pbr"] }),
          previewNote: "Cumulative prefixes α(k₀,kᵢ) end at the block-starts — pigeonholed on their classes.",
          revealNote: "Infinitely many prefixes share class V \u2014 but the gap between two of them is unconstrained."
        },
        {
          label: "Thinning to real blocks",
          title: "Persistence turns good prefixes into consecutive V-blocks",
          exposition: String.raw`If \(k_0\) and \(k_i\) already merge with each other (Persistence step), and \(k_{i+1}\) is chosen beyond their common witness, persistence guarantees \(k_0\) and \(k_i\) still merge at \(k_{i+1}\) — so \(\alpha(k_i,k_{i+1})\equiv\alpha(k_0,k_{i+1})\), and the right side is in \(V\) by the previous step. The gap inherits \(V\)'s class for free.`,
          question: "At m=7, \u03b1(2,7)=\u201ccabcc\u201d and \u03b1(5,7)=\u201ccc\u201d do NOT merge (one visits F on the way to s\u2082, the other doesn't). At m=8, both \u03b1(2,8)=\u201ccabcca\u201d and \u03b1(5,8)=\u201ccca\u201d reach s\u2081 having visited F: they DO merge at m=8. To conclude the gap \u03b1(5,8) lies in the same class as the cumulative prefix \u03b1(2,8), what fact are we actually using?",
          choices: [
            {
              text: "That 2 and 5 merge AT m=8 specifically — persistence then equates \u03b1(5,8) with \u03b1(2,8) directly, and \u03b1(2,8)'s class is already known from the Pigeonhole-on-segments step.",
              correct: true,
              feedback: "Exactly — merging at the SAME endpoint m=8 licenses replacing \u03b1(5,8) by \u03b1(2,8) via \u2261, transferring the known class across."
            },
            {
              text: "That they failed to merge at m=7 — showing the earlier attempt doesn't matter once a later one succeeds.",
              correct: false,
              causalFailure: "A failed merge at m=7 gives no positive information; it only means m=7 can't be used as a witness. The gap conclusion needs a SUCCESSFUL merge at the SAME m used for the cumulative-prefix comparison, not the mere fact that an earlier m didn't work.",
              consequence: V(["p2", "p5"], ["m7"], { badNodes: ["p2", "p5"], dimNodes: ["p0", "p1", "p3", "p4", "p6", "p7", "p8", "p9", "p10", "p11", "s0", "s1", "s2"], dimEdges: ["m8", "seg28", "seg58", "pbr"] })
            },
            {
              text: "That \u03b1(2,8) and \u03b1(5,8) have the same length.",
              correct: false,
              causalFailure: "\u03b1(2,8)=\u201ccabcca\u201d has 6 symbols; \u03b1(5,8)=\u201ccca\u201d has 3. \u2261 (built from \u2248\u1d00 here) never compares length, only reachability and F-visits — the two segments merge despite different lengths, which is exactly why \u2261 succeeds where a length-based congruence (like the parity example) would not even ask the right question.",
              consequence: V(["p2", "p5", "p7"], ["m8", "seg28", "seg58"], { dimNodes: ["p0", "p1", "p3", "p4", "p6", "p8", "p9", "p10", "p11", "s0", "s1", "s2"], dimEdges: ["m7", "pbr"] })
            }
          ],
          hint: "Compare the two segments at the SAME right endpoint m=8, not m=7 — persistence only ever equates things that merge at a common point.",
          formal: String.raw`\(k_0\mathbin{\overset{\sim}{=}}_{\alpha,k_{i+1}}k_i\) implies \(\alpha(k_i,k_{i+1})\equiv\alpha(k_0,k_{i+1})\in V\), hence \(\alpha(k_i,k_{i+1})\in V\).`,
          preview: V(["p2", "p5"], ["m7"], { dimNodes: ["p0", "p1", "p3", "p4", "p6", "p7", "p8", "p9", "p10", "p11", "s0", "s1", "s2"], dimEdges: ["m8", "seg28", "seg58", "pbr"] }),
          reveal: V(["p2", "p5", "p7"], ["m8", "seg28", "seg58"], { goodNodes: ["p5", "p6", "p7"], dimNodes: ["p0", "p1", "p3", "p4", "p8", "p9", "p10", "p11", "s0", "s1", "s2"], dimEdges: ["m7", "pbr"] }),
          previewNote: "At m=7, α(2,7)=cabcc and α(5,7)=cc do NOT merge — one visits F, the other doesn't.",
          revealNote: "At m=8 they merge: the gap \u03b1(5,8)=cca inherits V from the prefix \u03b1(2,8)=cabcca."
        },
        {
          label: "Idempotence and conclusion",
          title: "One witnessed concatenation transports to every pair in V",
          exposition: String.raw`One gap in hand isn't quite enough: the lemma needs \(V\cdot V\subseteq V\), so repeating \(V\) forever stays consistent. Two specific consecutive blocks \(a=\alpha(k_0,k_1)\) and \(b=\alpha(k_1,k_2)\), both in \(V\), have their concatenation \(ab=\alpha(k_0,k_2)\) also in \(V\) (from Pigeonhole on segments).`,
          question: "Given a=\u03b1(k\u2080,k\u2081)\u2208V, b=\u03b1(k\u2081,k\u2082)\u2208V, and ab=\u03b1(k\u2080,k\u2082)\u2208V, what follows about ARBITRARY x,y\u2208V (not just this a,b)?",
          choices: [
            {
              text: "xy\u2208V for every x,y\u2208V — since x\u2261a and y\u2261b (same classes), congruence gives xy\u2261ab, and ab\u2208V, so xy shares V's class too.",
              correct: true,
              feedback: "Right — this is V\u00b7V\u2286V. One witnessed pair with ab\u2208V is enough, because congruence transports the conclusion to every other pair in the same two classes."
            },
            {
              text: "Only that ab itself is in V — nothing follows about other pairs x,y unless they're checked individually.",
              correct: false,
              causalFailure: "This misses what congruence buys us: x\u2261a and y\u2261b already force xy\u2261ab with no need to trace x,y through the automaton again. Treating every pair as needing its own check would make V\u00b7V\u2286V unprovable in general — infinitely many pairs would need checking. The whole point of using a congruence, not an arbitrary relation, is that one witnessed instance transports to the entire class.",
              consequence: V([], [], { goodNodes: ["p0", "p1", "p2", "p3", "p4", "p5", "p6"], badNodes: ["p7", "p8", "p9", "p10", "p11"], dimNodes: ["s0", "s1", "s2"], dimEdges: ["m7", "m8", "seg28", "seg58", "pbr"] })
            },
            {
              text: "That V must equal exactly {a,b,ab}, since those are the only elements we've explicitly constructed.",
              correct: false,
              causalFailure: "V is an \u2261-class of \u03a3*, and here it's already infinite by construction — it has to contain every block abc\u207f (n\u22651) to build V\u03c9 at all. a, b, ab are just three witnessed members, not an exhaustive list.",
              consequence: V(["p7", "p8", "p9", "p10", "p11"], [], { goodNodes: ["p0", "p1", "p2", "p3", "p4", "p5", "p6"], dimNodes: ["s0", "s1", "s2"], dimEdges: ["m7", "m8", "seg28", "seg58", "pbr"] })
            }
          ],
          hint: "You don't need to re-derive anything about x and y from the automaton — congruence alone connects xy to the already-known ab.",
          formal: String.raw`\(x\equiv a\) and \(y\equiv b\) imply \(xy\equiv ab\in V\), hence \(xy\in V\). Therefore \(V\cdot V\subseteq V\) and \(\alpha\in UV^\omega\).`,
          preview: V(["p0", "p1", "p2", "p3", "p4", "p5", "p6"], [], { dimNodes: ["p7", "p8", "p9", "p10", "p11", "s0", "s1", "s2"], dimEdges: ["m7", "m8", "seg28", "seg58", "pbr"] }),
          reveal: V([], [], { goodNodes: ["p0", "p1", "p2", "p3", "p4", "p5", "p6"], dimNodes: ["p7", "p8", "p9", "p10", "p11", "s0", "s1", "s2"], dimEdges: ["m7", "m8", "seg28", "seg58", "pbr"] }),
          previewNote: "Two consecutive blocks a=α(k₀,k₁), b=α(k₁,k₂), and their concatenation ab.",
          revealNote: "a, b, ab all in V. Congruence transports it to every pair: V\u00b7V \u2286 V, so \u03b1 \u2208 U\u00b7V\u03c9."
        }
      ],
      previous: { label: "B\u00fcchi\u2013expression equivalence", href: "/proofs/chapter-03/buchi-expression-equivalence.html" },
      next: { label: "B\u00fcchi complementation", href: "/proofs/chapter-04/buchi-complementation.html" }
    },

    "buchi-complementation": {
      slug: "buchi-complementation",
      chapter: 4,
      title: "B\u00fcchi complementation",
      theorem: "The complement of every \u03c9-regular language is \u03c9-regular.",
      intro: "We cannot simply swap final and non-final states: B\u00fcchi acceptance depends on infinitely many visits, so a swap does not flip the language cleanly. Instead, the proof classifies all finite blocks with the relation \u2248\uD835\uDC9C, groups all infinite words into finitely many product classes UV\u03c9, and shows each class is entirely accepted or entirely rejected.",
      application: "The complement of 'save infinitely often' is 'save only finitely often'. The proof provides a B\u00fcchi automaton for the complement by collecting exactly the rejected product classes.",
      strategy: "Define a finite congruence on finite words capturing all automaton-observable behavior. Use it to decompose every infinite word into a class product UV\u03c9. Show each product is saturated (all-or-nothing). Collect rejected products \u2014 their finite union is \u03c9-regular.",
      invariant: "Every classified product UV\u03c9 lies wholly on one side of L, and the classified products together cover every \u03c9-word.",
      synthesis: String.raw`Fix a B\u00fcchi automaton \(\mathcal A\) for \(L\) and classify finite words using the relation \(\approx_{\mathcal A}\): words are equivalent when they induce the same state-to-state reachability and agree on whether an accepting state can be visited along each segment. This finite-index congruence has regular classes. Suitable pairs of classes \(U,V\) determine products \(UV^\omega\). Saturation shows that if one member of such a product has an accepting run, then equivalent block replacements preserve its boundary states and accepting visits, so every member is accepted; otherwise the entire product is disjoint from \(L\). The Ramsey decomposition places every infinite word in at least one product \(UV^\omega\), and only finitely many pairs of classes exist. Therefore \(\Sigma^\omega\setminus L\) is exactly the finite union of all products disjoint from \(L\). Each product is \(\omega\)-regular because \(U\) and \(V\) are regular, and finite union preserves \(\omega\)-regularity.`,
      diagram: {
        description: "Left: the classes of the relation \u2248\uD835\uDC9C generate pairs (U,V) forming class products UV^omega and U'V'^omega. Each product is saturated: it lies either in the accepted language or in its complement. The rejected products are collected into a finite union, which is omega-regular.",
        viewBox: [0, 0, 1000, 560],
        nodes: [
          N("profiles", 155, 120, "\u2248\uD835\uDC9C classes", "finite congruence", { width: 210 }),
          N("product1", 155, 320, "UV\u03c9", "class product 1", { width: 180 }),
          N("product2", 390, 320, "U\u2032V\u2032\u03c9", "class product 2", { width: 180 }),
          N("language", 690, 165, "L(\uD835\uDC9C)", "all accepted words", { width: 210 }),
          N("complement", 690, 420, "\u00acL(\uD835\uDC9C)", "all rejected words", { width: 210 }),
          N("union", 900, 420, "finite union", "\u03c9-regular!", { width: 165 })
        ],
        edges: [
          E("profiles-p1", "profiles", "product1", "pair (U,V)"),
          E("profiles-p2", "profiles", "product2", "pair (U\u2032,V\u2032)"),
          E("p1-l", "product1", "language", "saturated \u2192 all in"),
          E("p1-c", "product1", "complement", "or all out"),
          E("p2-l", "product2", "language", "saturated \u2192 all in"),
          E("p2-c", "product2", "complement", "or all out"),
          E("c-union", "complement", "union", "collect rejected")
        ],
        annotations: [
          { x: 500, y: 540, text: "Finitely many class pairs \u2192 finitely many saturated products \u2192 finite union for complement.", anchor: "middle" }
        ]
      },
      steps: [
        {
          label: "Abstraction",
          title: "Classify finite blocks by what the automaton sees",
          exposition: "To handle all infinite words uniformly, we use the relation \u2248\uD835\uDC9C. Two words are \u2248\uD835\uDC9C-equivalent if they agree on which pairs of states (p,q) are connected and whether a final state F is visited along the way. This captures all behavior the B\u00fcchi automaton can observe and gives finitely many classes.",
          question: "What must two \u2248\uD835\uDC9C-equivalent words agree on?",
          choices: ["Which states are reachable from which, and whether any final state F is visited", "Only their length", "Only their last symbol"],
          correct: 0,
          hint: "Replacing one block with another must preserve the ability to stitch an accepting run at the same boundary states.",
          feedback: "Correct. The relation \u2248\uD835\uDC9C captures reachability between boundary states and the presence of any F-visit.",
          incorrect: "Length or last symbol alone cannot capture arbitrary automaton behavior.",
          formal: String.raw`For every Büchi automaton \(\mathcal A\), the relation \(\approx_{\mathcal A}\) is a congruence of finite index that saturates \(L(\mathcal A)\).`,
          preview: V(["profiles"], [], { dimNodes: ["language", "complement", "union"] }),
          reveal: V(["profiles", "product1", "product2"], ["profiles-p1", "profiles-p2"], { goodNodes: ["profiles"], dimNodes: ["language", "complement", "union"] }),
          previewNote: "The automaton can observe only finitely many block behaviors.",
          revealNote: "Each pair of \u2248\uD835\uDC9C-classes generates a class product UV\u03c9."
        },
        {
          label: "Saturation",
          title: "Each product is all-or-nothing",
          exposition: "A class product UV\u03c9 allows swapping any U-block for another in the same \u2248\uD835\uDC9C-class, and any V-block similarly. If one word in UV\u03c9 has an accepting run, we can replace its factors block by block using \u2248\uD835\uDC9C-equivalent words \u2014 and the run still accepts, because boundary states and F-visits are preserved. So the whole product is either fully accepted or fully rejected.",
          question: "If one word in UV\u03c9 is accepted, what does saturation tell us?",
          choices: ["Every word in UV\u03c9 is accepted", "Exactly one word is accepted", "No other product matters"],
          correct: 0,
          hint: "Swap each finite block for an \u2248\uD835\uDC9C-equivalent one \u2014 what happens to acceptance?",
          feedback: "Exactly. \u2248\uD835\uDC9C-equivalent swaps maintain boundary states and F-visits, so any member can be turned into an accepted run.",
          incorrect: "Saturation means the entire product is uniform \u2014 not just some special member.",
          formal: String.raw`Equivalent prefix blocks preserve the first boundary state; equivalent loop blocks preserve every later boundary and each accepting visit.`,
          preview: V(["product1"], [], { dimNodes: ["profiles", "union"] }),
          reveal: V(["product1", "language"], ["p1-l"], { goodNodes: ["product1", "language"], dimNodes: ["profiles", "union"] }),
          previewNote: "Start from one accepted member of a class product.",
          revealNote: "\u2248\uD835\uDC9C-equivalent swaps accept every member. The product is saturated."
        },
        {
          label: "Coverage",
          title: "Every infinite word belongs to some product",
          exposition: "We have finitely many saturated products \u2014 but do they cover all infinite words? Yes. The Ramsey decomposition first defines when two positions merge. Finite index yields infinitely many positions in one merge class and a prefix in U followed by a suffix in the vectorial closure of V; a second subsequence extraction turns that suffix into consecutive V-blocks. Thus \u03b1 \u2208 UV\u03c9, with V\u00b7V \u2286 V.",
          question: "What does the Ramsey decomposition give for an arbitrary infinite word \u03b1?",
          choices: ["A prefix class U and a repeating class V such that \u03b1 \u2208 UV\u03c9", "A deterministic B\u00fcchi run", "A finite truncation of \u03b1"],
          correct: 0,
          hint: "The decomposition groups the infinitely many factors into one repeating \u2248\uD835\uDC9C-class after a prefix.",
          feedback: "Correct. Every \u03c9-word belongs to at least one class product UV\u03c9.",
          incorrect: "The proof covers all \u03c9-words by class products, not by determinizing.",
          formal: String.raw`The merge relation first yields \(\alpha\in U\overrightarrow V\). Thinning the positions again yields \(\alpha\in UV^\omega\), with \(V\cdot V\subseteq V\).`,
          preview: V(["product1", "product2"], [], { dimNodes: ["profiles", "union"] }),
          reveal: V(["product1", "product2", "language", "complement"], ["p1-l", "p2-c"], { goodNodes: ["language", "complement"], dimNodes: ["profiles", "union"] }),
          previewNote: "Finitely many products must cover all infinite words.",
          revealNote: "Each covered product is saturated \u2014 wholly in L or wholly outside L."
        },
        {
          label: "Complement",
          title: "Collect the rejected products \u2014 that is the complement",
          exposition: "Every infinite word belongs to some product, and each product is saturated. So \u00acL(\uD835\uDC9C) is exactly the union of all products wholly outside L. There are finitely many such products (finitely many class pairs (U,V)). Each product UV\u03c9 is \u03c9-regular. A finite union of \u03c9-regular languages is \u03c9-regular.",
          question: "Why is the complement \u00acL(\uD835\uDC9C) still \u03c9-regular?",
          choices: ["There are finitely many rejected products, each of the form UV\u03c9, which is \u03c9-regular", "Complementation was already assumed", "Every product is finite"],
          correct: 0,
          hint: "Count the rejected products, check what form they take, then use closure under finite union.",
          feedback: "Exactly. The complement is a finite union of \u03c9-regular class products.",
          incorrect: "Assuming complementation would be circular; and the products contain infinite words.",
          formal: String.raw`\(\Sigma^\omega\setminus L=\bigcup\{UV^\omega\mid UV^\omega\cap L=\varnothing\}\). Regular \(U,V\) make each term \(\omega\)-regular; finite union preserves \(\omega\)-regularity.`,
          preview: V(["complement"], [], { dimNodes: ["profiles", "language"] }),
          reveal: V(["complement", "union"], ["c-union"], { goodNodes: ["complement", "union"], dimNodes: ["profiles", "language", "product1", "product2"] }),
          previewNote: "The complement consists exactly of the products disjoint from L.",
          revealNote: "A finite union of \u03c9-regular products is \u03c9-regular. Done."
        }
      ],
      previous: { label: "Ramsey decomposition", href: "/proofs/chapter-04/ramsey-decomposition.html" }
    }
  };
})();
