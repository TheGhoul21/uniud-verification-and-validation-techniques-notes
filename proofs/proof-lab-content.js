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
      theorem: String.raw`For every NFA \(\mathcal{A} = (Q,\Sigma,\Delta,q_0,F)\) there exists a DFA \(\mathcal{D} = (2^Q,\Sigma,\delta_D,\{q_0\},F_D)\) such that \(L(\mathcal{D}) = L(\mathcal{A})\).`,
      intro: "Non-deterministic finite automata (NFAs) allow concurrent execution paths by branching across multiple successor states. The subset construction proves that non-determinism does not expand the class of recognizable finite-word languages: by tracking the entire set of concurrently active NFA states in a single deterministic macro-state, a DFA can simulate all non-deterministic runs simultaneously.",
      application: "In model checking and safety property verification, specifications often model non-deterministic environment actions. Compiling an NFA into a DFA produces an executable deterministic monitor capable of validating event sequences in real time without backtracking.",
      strategy: "Formulate the inductive invariant that after reading any word w, the state reached by the DFA is precisely the set of states reachable in the NFA: \\(\\widehat{\\delta}_D(\\{q_0\\}, w) = \\widehat{\\Delta}(q_0, w)\\). Establish the base case at w = \\(\\varepsilon\\), prove the inductive step using the union transition \\(\\delta_D(S, a) = \\bigcup_{q \\in S} \\Delta(q, a)\\), and map acceptance via the existential condition \\(F_D = \\{S \\subseteq Q \\mid S \\cap F \\neq \\emptyset\\}\\).",
      invariant: String.raw`\(\forall w \in \Sigma^*,\; \widehat{\delta}_D(\{q_0\}, w) = \widehat{\Delta}(q_0, w)\).`,
      synthesis: String.raw`Let \(\mathcal{A}=(Q,\Sigma,\Delta,q_0,F)\) be an NFA. Define the determinized automaton \(\mathcal{D}=(2^Q,\Sigma,\delta_D,\{q_0\},F_D)\) where \(\delta_D(S,a)=\bigcup_{q\in S}\Delta(q,a)\) and \(F_D=\{S\subseteq Q\mid S\cap F\neq\emptyset\}\). By induction on \(|w|\), we establish the invariant \(\widehat{\delta}_D(\{q_0\},w)=\widehat{\Delta}(q_0,w)\). For \(w=\varepsilon\), \(\widehat{\delta}_D(\{q_0\},\varepsilon)=\{q_0\}=\widehat{\Delta}(q_0,\varepsilon)\). Assuming the claim for \(w\), reading \(a\in\Sigma\) yields \(\widehat{\delta}_D(\{q_0\},wa)=\delta_D(\widehat{\delta}_D(\{q_0\},w),a)=\bigcup_{q\in\widehat{\Delta}(q_0,w)}\Delta(q,a)=\widehat{\Delta}(q_0,wa)\), completing the induction. A word \(w\) is accepted by \(\mathcal{A}\) iff \(\widehat{\Delta}(q_0,w)\cap F\neq\emptyset\), which holds iff \(\widehat{\delta}_D(\{q_0\},w)\in F_D\), that is, iff \(w\in L(\mathcal{D})\). Thus \(L(\mathcal{D})=L(\mathcal{A})\).`,
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
          { x: 500, y: 240, text: "\u2195  identical reachable configuration set", anchor: "middle" }
        ]
      },
      steps: [
        {
          label: "Base case",
          title: "Length |w| = 0: Initialization on the empty word \u03b5",
          exposition: String.raw`Let \(\mathcal{A} = (Q, \Sigma, \Delta, q_0, F)\) be an NFA without \(\varepsilon\)-transitions. We prove by induction on \(|w|\) that \(\widehat{\delta}_D(\{q_0\}, w) = \widehat{\Delta}(q_0, w)\). For \(w = \varepsilon\), zero transitions are executed. By formal definition of extended transition functions, \(\widehat{\Delta}(q_0, \varepsilon) = \{q_0\}\). Hence, setting the initial state of the DFA to the singleton \(S_0 = \{q_0\} \in 2^Q\) anchors the base case.`,
          question: "Which formal condition must the initial DFA state satisfy to establish the inductive invariant at w = \u03b5?",
          choices: [
            {
              text: String.raw`\(S_0 = \{q_0\}\), matching the base evaluation \(\widehat{\Delta}(q_0, \varepsilon) = \{q_0\}\).`,
              correct: true,
              feedback: String.raw`Correct. On the empty word \(\varepsilon\), the set of reachable NFA states is strictly the singleton \(\{q_0\}\); initializing \(\mathcal{D}\) to \(S_0 = \{q_0\}\) satisfies the inductive invariant.`
            },
            {
              text: String.raw`\(S_0 = Q\), over-approximating reachable states to prevent missed runs.`,
              correct: false,
              causalFailure: String.raw`Starting in \(Q\) asserts that all states are reachable prior to consuming any input symbol, causing immediate over-approximation and accepting unauthorized words.`
            },
            {
              text: String.raw`\(S_0 = \{q_0\} \cap F\), restricting the start state exclusively to accepting configurations.`,
              correct: false,
              causalFailure: String.raw`If \(q_0 \notin F\), this yields \(S_0 = \emptyset\), prematurely terminating all simulations and rejecting valid words.`
            }
          ],
          hint: "Evaluate both extended transition functions \u03b4\u0302_D and \u0394\u0302 on the empty word \u03b5.",
          formal: String.raw`\(\widehat{\Delta}(q_0,\varepsilon)=\{q_0\}\) and \(\widehat{\delta}_D(\{q_0\},\varepsilon)=\{q_0\}\), so the invariant \(\widehat{\delta}_D(\{q_0\},w)=\widehat{\Delta}(q_0,w)\) holds at \(|w|=0\).`,
          preview: V([], [], { dimNodes: ["qa", "s1"] }),
          reveal: V(["qs", "s0"], [], { dimNodes: ["qa", "s1"] }),
          previewNote: "Prior to consuming input, only the start state qs is reachable in the NFA.",
          revealNote: "At |w| = 0: NFA is in {qs}, DFA is in S0 = {qs}. Invariant holds."
        },
        {
          label: "Inductive step",
          title: "Symbol 'a': Simulating non-deterministic branching via set union",
          exposition: String.raw`Suppose \(\widehat{\delta}_D(\{q_0\}, w) = \widehat{\Delta}(q_0, w) = S\) for some word \(w\). Appending symbol \(a \in \Sigma\) yields \(\widehat{\Delta}(q_0, wa) = \bigcup_{q \in S} \Delta(q, a)\). To maintain the invariant, the deterministic transition function must compute this exact union: \(\delta_D(S, a) = \bigcup_{q \in S} \Delta(q, a)\). From \(S_0 = \{q_s\}\), reading 'a' fires both the self-loop \(\Delta(q_s, a) \ni q_s\) and the forward branch \(\Delta(q_s, a) \ni q_a\), leading to \(S_1 = \{q_s, q_a\}\).`,
          question: "Why must \u03b4_D(S, a) be defined as the set union \u22c3_{q \in S} \u0394(q, a) rather than selecting a single successor state?",
          choices: [
            {
              text: String.raw`Because NFA acceptance is existential: pruning any successor branch risks discarding the unique path that eventually reaches an accepting state.`,
              correct: true,
              feedback: String.raw`Precisely. An NFA accepts if at least one run succeeds. Because the automaton cannot foresee future symbols, the DFA must track all viable successor states simultaneously.`
            },
            {
              text: String.raw`Because computing the union ensures that the constructed DFA has at most |Q| states.`,
              correct: false,
              causalFailure: String.raw`The union over subsets operates on the power set \(2^Q\), which can grow exponentially up to \(2^{|Q|}\) states in the worst case.`
            },
            {
              text: String.raw`Because the transition function of a DFA is mathematically required to be bijective.`,
              correct: false,
              causalFailure: String.raw`DFA transition functions are total functions \(\delta_D: 2^Q \times \Sigma \to 2^Q\); they are rarely injective or surjective.`
            }
          ],
          hint: "Consider what happens if an arbitrary branch is pruned: could that branch have reached F?",
          formal: String.raw`\(\widehat{\delta}_D(\{q_0\},wa) = \delta_D(S,a) = \bigcup_{q\in S}\Delta(q,a) = \widehat{\Delta}(q_0,wa)\), verifying the inductive step.`,
          preview: V(["qs", "s0"], [], { dimNodes: ["qa", "s1"] }),
          reveal: V(["qs", "qa", "s1"], ["nfa-loop", "nfa-a", "dfa-a"], { goodNodes: ["s1"] }),
          previewNote: "From qs on 'a', the NFA branches concurrently into {qs, qa}.",
          revealNote: "DFA state S1 = {qs, qa} encapsulates both branches simultaneously."
        },
        {
          label: "Inductive step",
          title: "Symbol 'b': Natural branch pruning via empty transitions",
          exposition: String.raw`From \(S_1 = \{q_s, q_a\}\), reading symbol 'b' evaluates the union \(\delta_D(S_1, b) = \Delta(q_s, b) \cup \Delta(q_a, b)\). The scanning state continues via its loop \(\Delta(q_s, b) = \{q_s\}\), whereas state \(q_a\) has no outgoing 'b' transitions (\(\Delta(q_a, b) = \emptyset\)). Since \(\emptyset\) is the identity element of set union, \(\{q_s\} \cup \emptyset = \{q_s\} = S_0\). Dead branches are filtered out automatically without exceptional rules.`,
          question: "How does the algebraic formulation \u03b4_D(S, a) = \u22c3_{q \in S} \u0394(q, a) handle states with no outgoing transitions on a symbol?",
          choices: [
            {
              text: String.raw`Such states contribute the empty set \(\emptyset\) to the union, naturally pruning dead execution paths while preserving active ones.`,
              correct: true,
              feedback: String.raw`Correct. Since \(U \cup \emptyset = U\), non-viable branches drop out of the active subset without affecting surviving runs.`
            },
            {
              text: String.raw`The presence of \(\emptyset\) forces the entire union to evaluate to \(\emptyset\), driving the DFA into a dead-end sink state.`,
              correct: false,
              causalFailure: String.raw`This confuses union (\(\cup\)) with intersection (\(\cap\)). The empty set does not annihilate non-empty components under union.`
            },
            {
              text: String.raw`The DFA halts with an execution error because transition functions must be defined per individual state.`,
              correct: false,
              causalFailure: String.raw`In the subset construction, the DFA state space is \(2^Q\), and \(\delta_D\) is a completely defined total function on all subsets.`
            }
          ],
          hint: "Recall the algebraic identity S \u222a \u2205 = S in set theory.",
          formal: String.raw`\(\delta_D(S_1,b)=\Delta(q_s,b)\cup\Delta(q_a,b)=\{q_s\}\cup\varnothing=\{q_s\}=S_0\).`,
          preview: V(["qs", "qa", "s1"], [], {}),
          reveal: V(["qs", "s0"], ["nfa-loop", "dfa-b1"], { dimNodes: ["qa", "s1"] }),
          previewNote: "From S1 on 'b': qs loops to qs, while qa has no transition on 'b'.",
          revealNote: "The subset contracts back to S0 = {qs}. Invariant holds."
        },
        {
          label: "Acceptance",
          title: "Acceptance condition: Existential quantification over final states",
          exposition: String.raw`By induction, \(\widehat{\delta}_D(\{q_0\}, w) = \widehat{\Delta}(q_0, w)\) holds for all \(w \in \Sigma^*\). An NFA accepts \(w\) if and only if \emph{at least one} run ends in an accepting state: \(\widehat{\Delta}(q_0, w) \cap F \neq \emptyset\). Substituting the invariant yields \(\widehat{\delta}_D(\{q_0\}, w) \cap F \neq \emptyset\). Therefore, defining the DFA final states as \(F_D = \{ S \subseteq Q \mid S \cap F \neq \emptyset \}\) ensures that \(\mathcal{D}\) accepts \(w\) if and only if \(\mathcal{A}\) accepts \(w\).`,
          question: "Why must the accepting set of the DFA be defined as F_D = {S \u2286 Q | S \u2229 F \u2260 \u2205} rather than F_D = {S \u2286 Q | S \u2286 F}?",
          choices: [
            {
              text: String.raw`Because NFA acceptance is existential: requiring \(S \subseteq F\) would erroneously reject words whenever an accepting branch coexists with a non-accepting branch.`,
              correct: true,
              feedback: String.raw`Exactly. In \(S_1 = \{q_s, q_a\}\), \(q_a \in F\) certifies acceptance even though \(q_s \notin F\). The subset condition \(S \subseteq F\) corresponds to universal acceptance, which is strictly stronger.`
            },
            {
              text: String.raw`Because \(S \subseteq F\) is only well-defined when the alphabet \(\Sigma\) is unary.`,
              correct: false,
              causalFailure: String.raw`The subset condition \(S \subseteq F\) is well-defined for any alphabet; its flaw is semantic (it enforces universal acceptance rather than existential).`
            },
            {
              text: String.raw`Because the Myhill-Nerode theorem requires every subset state to contain at least one non-accepting state.`,
              correct: false,
              causalFailure: String.raw`Myhill-Nerode states that equivalence classes of \(\sim_L\) form the minimal DFA; it places no constraint requiring non-final states in subsets.`
            }
          ],
          hint: "Compare existential acceptance (\u2203 run ending in F) with universal acceptance (\u2200 runs ending in F).",
          formal: String.raw`\(w\in L(\mathcal{A}) \iff \widehat{\Delta}(q_0,w)\cap F\neq\emptyset \iff \widehat{\delta}_D(\{q_0\},w)\in F_D \iff w\in L(\mathcal{D})\). Hence \(L(\mathcal{D})=L(\mathcal{A})\).`,
          preview: V(["qs", "qa", "s1"], [], {}),
          reveal: V(["qa", "s1"], [], { goodNodes: ["qa", "s1"], dimNodes: ["qs", "s0"] }),
          previewNote: "S1 = {qs, qa} contains both a non-final state (qs) and a final state (qa).",
          revealNote: "Because S1 \u2229 F = {qa} \u2260 \u2205, S1 \u2208 F_D. Existential acceptance is preserved."
        }
      ],
      next: { label: "\u03b5-removal", href: "/proofs/chapter-02/epsilon-removal.html" }
    },

    "epsilon-removal": {
      slug: "epsilon-removal",
      chapter: 2,
      title: "\u03b5-removal",
      theorem: String.raw`For every \(\varepsilon\)-NFA \(\mathcal{A} = (Q, \Sigma, \Delta, q_0, F)\) there exists an equivalent \(\varepsilon\)-free NFA \(\mathcal{A}' = (Q, \Sigma, \Delta', q_0, F')\) such that \(L(\mathcal{A}') = L(\mathcal{A})\).`,
      intro: "Non-deterministic finite automata with \(\varepsilon\)-transitions (\(\varepsilon\)-NFAs) permit instantaneous state changes without consuming input symbols. While \(\varepsilon\)-transitions provide modularity in structural constructions (such as Thompson's synthesis of regular expressions), they do not extend the class of regular languages. By computing the reflexive-transitive \(\varepsilon\)-closure \(\operatorname{ECl}(q)\) for each state and collapsing all composite path patterns of the form \(\varepsilon^* a \varepsilon^*\) into atomic transitions, silent moves are eliminated without altering observable language behavior.",
      application: "In compositional model checking, modular specifications are linked by \(\varepsilon\)-handoffs between component automata. Removing \(\varepsilon\)-moves produces a streamlined state space and prevents unobservable stuttering cycles during state-space exploration.",
      strategy: String.raw`Define the \(\varepsilon\)-closure \(\operatorname{ECl}(S) = \{ p \in Q \mid \exists q \in S,\; q \xrightarrow{\varepsilon^*} p \}\). Define the \(\varepsilon\)-free transition relation as \(\Delta'(q, a) = \operatorname{ECl}(\bigcup_{p \in \operatorname{ECl}(q)} \Delta(p, a))\). Prove by induction on word length that for all non-empty words \(w \in \Sigma^+\), \(\widehat{\Delta}'(q_0, w) = \operatorname{ECl}(\widehat{\Delta}(q_0, w))\). Reconcile the empty word \(w = \varepsilon\) by setting \(F' = F \cup \{q_0\}\) iff \(\operatorname{ECl}(q_0) \cap F \neq \emptyset\).`,
      invariant: String.raw`\(\forall w \in \Sigma^+,\; \widehat{\Delta}'(q_0, w) = \operatorname{ECl}(\widehat{\Delta}(q_0, w))\).`,
      synthesis: String.raw`For each state \(q\), let \(\operatorname{ECl}(q)\) denote its reflexive-transitive \(\varepsilon\)-closure and define \(\Delta'(q,a)=\operatorname{ECl}\!\left(\bigcup_{p\in\operatorname{ECl}(q)}\Delta(p,a)\right)\). Thus one transition of the new NFA compresses every composite \(\varepsilon^*a\varepsilon^*\) execution segment. An induction on \(|w|\) for \(w\in\Sigma^+\) shows that \(\widehat{\Delta}'(q_0,w)=\operatorname{ECl}(\widehat{\Delta}(q_0,w))\). The empty word is a boundary case because \(\mathcal{A}'\) cannot take \(\varepsilon\)-transitions without consuming a symbol; setting \(F'=F\cup\{q_0\}\) iff \(\operatorname{ECl}(q_0)\cap F\neq\emptyset\) preserves acceptance of \(\varepsilon\). Hence \(L(\mathcal{A}')=L(\mathcal{A})\) with state space \(Q'=Q\).`,
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
          title: "Synthesizing \u0394': Compiling \u03b5* a \u03b5* paths into atomic symbol transitions",
          exposition: String.raw`In an \(\varepsilon\)-NFA, consuming symbol \(a\) from state \(q\) can involve a prefix sequence of \(\varepsilon\)-transitions, the symbol transition \(a\), and a suffix sequence of \(\varepsilon\)-transitions: \(q \xrightarrow{\varepsilon^*} p \xrightarrow{a} p' \xrightarrow{\varepsilon^*} r\). To execute this composite step in a single transition without \(\varepsilon\)-moves, we define \(\Delta'(q, a) = \operatorname{ECl}(\bigcup_{p \in \operatorname{ECl}(q)} \Delta(p, a))\). In the top machine, \(q_0 \xrightarrow{a} q_1 \xrightarrow{\varepsilon} r_0\); hence in \(\mathcal{A}'\), \(\Delta'(q_0, a) = \{q_1, r_0\}\).`,
          question: "Why must the compiled transition \u0394'(q, a) apply \u03b5-closure both BEFORE and AFTER consuming symbol a?",
          choices: [
            {
              text: String.raw`Because valid paths may traverse silent moves prior to reading \(a\) (reaching \(\operatorname{ECl}(q)\)) as well as after reading \(a\) (reaching \(\operatorname{ECl}(p')\)); omitting either closure loses valid execution runs.`,
              correct: true,
              feedback: String.raw`Precisely. Any path adhering to the regular pattern \(\varepsilon^* a \varepsilon^*\) is captured in one atomic \(a\)-step by taking the closure before and after the symbol transition.`
            },
            {
              text: String.raw`Because applying \(\operatorname{ECl}\) twice is mathematically required to guarantee determinism in \(\mathcal{A}'\).`,
              correct: false,
              causalFailure: String.raw`The resulting automaton \(\mathcal{A}'\) is an NFA, not a DFA; it may retain non-deterministic branching across multiple successor states.`
            },
            {
              text: String.raw`Because \(\varepsilon\)-closure is an anti-monotone operator that shrinks the reachable state set.`,
              correct: false,
              causalFailure: String.raw`The \(\varepsilon\)-closure is extensive (\(S \subseteq \operatorname{ECl}(S)\)) and monotone, expanding the state set rather than shrinking it.`
            }
          ],
          hint: "Consider a general path of the form q -\u03b5*-> p -a-> p' -\u03b5*-> r. Which parts consume input?",
          formal: String.raw`\(\Delta'(q,a)=\operatorname{ECl}\!\left(\bigcup_{p\in\operatorname{ECl}(q)}\Delta(p,a)\right)\). It maps every \(\varepsilon^*a\varepsilon^*\) execution segment into a single \(a\)-transition.`,
          preview: V(["q0", "q1", "r0"], ["a-top", "eps-top"], { dimNodes: ["r1", "q0p", "q1p", "r0p", "r1p"] }),
          reveal: V(["q0p", "q1p", "r0p"], ["a-q1", "a-r0"], { goodNodes: ["q1p", "r0p"], dimNodes: ["q0", "q1", "r0", "r1"] }),
          previewNote: "The \u03b5-NFA reaches q1 on 'a', followed by an unobservable \u03b5-move to r0.",
          revealNote: "The transformed NFA transitions directly from q0 to {q1, r0} on symbol 'a'."
        },
        {
          label: "Inductive step",
          title: "Closure idempotence: Preserving \u03b5-invariance across concatenation",
          exposition: String.raw`Assume by induction hypothesis that \(\widehat{\Delta}'(q_0, w) = \operatorname{ECl}(\widehat{\Delta}(q_0, w))\). When extending by symbol \(b\), the new states reached are \(\widehat{\Delta}'(q_0, wb) = \bigcup_{q \in \widehat{\Delta}'(q_0, w)} \Delta'(q, b)\). Because the active set is already \(\varepsilon\)-closed, the idempotence of the closure operator (\(\operatorname{ECl}(\operatorname{ECl}(S)) = \operatorname{ECl}(S)\)) guarantees that composing \(\Delta'\) over \(\widehat{\Delta}'(q_0, w)\) is identical to reading \(b\) in \(\mathcal{A}\) and taking the global \(\varepsilon\)-closure. From \(\{q_1, r_0\}\), reading 'b' hits \(r_1\).`,
          question: "How does the algebraic idempotence \u2014 ECl(ECl(S)) = ECl(S) \u2014 maintain the inductive invariant when reading wb?",
          choices: [
            {
              text: String.raw`Since the active set is already \(\varepsilon\)-closed, taking another closure before symbol \(b\) is redundant; the new transition directly generates \(\operatorname{ECl}(\widehat{\Delta}(q_0, wb))\).`,
              correct: true,
              feedback: String.raw`Correct. Idempotence ensures that the pre-closure step \(\operatorname{ECl}(q)\) inside \(\Delta'\) seamlessly absorbs the post-closure of the previous step without loss or distortion.`
            },
            {
              text: String.raw`Idempotence forces the transition relation \(\Delta'\) to commute with Cartesian product.`,
              correct: false,
              causalFailure: String.raw`Idempotence refers strictly to closure repetition (\(f(f(x)) = f(x)\)); it has no bearing on Cartesian products or parallel composition.`
            },
            {
              text: String.raw`It guarantees that the language recognized by \(\mathcal{A}'\) is star-free.`,
              correct: false,
              causalFailure: String.raw`The language remains general regular; it is not restricted to the star-free subclass.`
            }
          ],
          hint: "Recall that a closure operator satisfies extensivity, monotonicity, and idempotence: ECl(ECl(X)) = ECl(X).",
          formal: String.raw`\(\widehat{\Delta}'(q_0,wb)=\bigcup_{q\in\widehat{\Delta}'(q_0,w)}\Delta'(q,b)=\operatorname{ECl}(\widehat{\Delta}(q_0,wb))\), establishing the inductive step for all \(w\in\Sigma^+\).`,
          preview: V(["q1p", "r0p"], [], { dimNodes: ["q0p", "r1p"] }),
          reveal: V(["r1", "r1p"], ["b-top", "b-q1", "b-r0"], { goodNodes: ["r1", "r1p"], dimNodes: ["q0", "q1", "r0", "q0p", "q1p", "r0p"] }),
          previewNote: "Current active set after 'a': {q1, r0}, which is already \u03b5-closed.",
          revealNote: "On 'b', both machines reach {r1}, restoring \u03b5-closure for subsequent steps."
        },
        {
          label: "Boundary case",
          title: "Length |w| = 0: Reconciling the empty word \u03b5",
          exposition: String.raw`The inductive invariant \(\widehat{\Delta}'(q_0, w) = \operatorname{ECl}(\widehat{\Delta}(q_0, w))\) holds for all non-empty words \(w \in \Sigma^+\). However, on the empty word \(w = \varepsilon\), zero transitions are taken in \(\mathcal{A}'\), leaving the automaton strictly in its initial state \(q_0\). If the original \(\varepsilon\)-NFA accepts \(\varepsilon\) via a silent path \(q_0 \xrightarrow{\varepsilon^+} f \in F\), the new automaton cannot execute this silent path before reading input. To faithfully preserve acceptance of \(\varepsilon\), we declare \(q_0\) accepting in \(\mathcal{A}'\) if and only if \(\operatorname{ECl}(q_0) \cap F \neq \emptyset\).`,
          question: "Under what exact formal condition must q_0 be included in the accepting set F' of the \u03b5-free automaton?",
          choices: [
            {
              text: String.raw`If and only if \(\operatorname{ECl}(q_0) \cap F \neq \emptyset\), compensating for silent paths from \(q_0\) to final states on input \(\varepsilon\).`,
              correct: true,
              feedback: String.raw`Exactly. In \(\mathcal{A}'\), no \(\varepsilon\)-moves can be taken before reading a symbol. If \(\varepsilon \in L(\mathcal{A})\), \(q_0\) must be directly accepting to ensure \(\varepsilon \in L(\mathcal{A}')\).`
            },
            {
              text: String.raw`Always, because initial states in \(\varepsilon\)-free NFAs must be final by convention.`,
              correct: false,
              causalFailure: String.raw`Making \(q_0\) unconditionally final would force \(\mathcal{A}'\) to accept \(\varepsilon\) even when \(\varepsilon \notin L(\mathcal{A})\), corrupting language fidelity.`
            },
            {
              text: String.raw`Never, because final states can only be entered after consuming at least one alphabet symbol.`,
              correct: false,
              causalFailure: String.raw`If \(\varepsilon \in L(\mathcal{A})\), rejecting \(\varepsilon\) in \(\mathcal{A}'\) would break equivalence \(L(\mathcal{A}') = L(\mathcal{A})\).`
            }
          ],
          hint: "Evaluate \u03b5 \u2208 L(A): an \u03b5-NFA accepts \u03b5 iff an accepting state is reachable via zero or more \u03b5-moves from q_0.",
          formal: String.raw`Define \(F'=F\cup\{q_0\}\) if \(\operatorname{ECl}(q_0)\cap F\neq\emptyset\), and \(F'=F\) otherwise. Then \(\varepsilon\in L(\mathcal{A}')\iff\varepsilon\in L(\mathcal{A})\).`,
          preview: V(["q0", "q0p"], [], { dimNodes: ["q1", "r0", "r1", "q1p", "r0p", "r1p"] }),
          reveal: V(["q0", "q0p"], [], { goodNodes: ["q0p"], dimNodes: ["q1", "r0", "r1", "q1p", "r0p", "r1p"] }),
          previewNote: "In this instance, ECl(q0) = {q0} and q0 \u2209 F, so q0 remains non-final.",
          revealNote: "If ECl(q0) intersected F, q0 would be added to F' to preserve \u03b5 acceptance."
        },
        {
          label: "Conclusion",
          title: "Language equivalence and complexity bounds",
          exposition: String.raw`Combining the inductive equivalence for all \(w \in \Sigma^+\) with the boundary adjustment for \(w = \varepsilon\), we conclude that \(L(\mathcal{A}') = L(\mathcal{A})\). Notably, the state set of \(\mathcal{A}'\) is identical to that of \(\mathcal{A}\) (\(Q' = Q\)). Unlike determinization, \(\varepsilon\)-removal does not incur an exponential state blowup: it only increases transition density, yielding an equivalent \(\varepsilon\)-free NFA in polynomial time \(\mathcal{O}(|\Sigma| \cdot |Q|^3)\).`,
          question: "What is the worst-case state complexity of eliminating \u03b5-transitions, and how does it compare to the subset construction?",
          choices: [
            {
              text: String.raw`The state complexity is exactly \(|Q|\) (no new states are introduced), unlike the subset construction which can incur an exponential blowup of \(2^{|Q|}\).`,
              correct: true,
              feedback: String.raw`Correct. \(\varepsilon\)-removal preserves the state set \(Q'=Q\); only the transition relation \(\Delta'\) is enriched by transitivity, keeping state complexity linear.`
            },
            {
              text: String.raw`The state complexity is \(\mathcal{O}(2^{|Q|})\) because all \(\varepsilon\)-closures must be stored as separate macro-states.`,
              correct: false,
              causalFailure: String.raw`\(\varepsilon\)-closures are used to compute the transition targets between existing states in \(Q\); they are not stored as macro-states in the automaton.`
            },
            {
              text: String.raw`The state complexity is unbounded because removing \(\varepsilon\)-cycles requires state replication.`,
              correct: false,
              causalFailure: String.raw`\(\varepsilon\)-cycles are naturally collapsed by the equivalence classes of the \(\varepsilon\)-reachability pre-order; no state replication is necessary.`
            }
          ],
          hint: "Check the state space Q' in the formal theorem statement: does Q' equal Q or 2^Q?",
          formal: String.raw`\(|Q'| = |Q|\) and \(L(\mathcal{A}') = L(\mathcal{A})\). The construction preserves state cardinality and operates in polynomial time.`,
          preview: V(["q0", "q1", "r0", "r1"], ["a-top", "eps-top", "b-top"], { dimNodes: ["q0p", "q1p", "r0p", "r1p"] }),
          reveal: V(["q0p", "q1p", "r0p", "r1p"], ["a-q1", "a-r0", "b-q1", "b-r0"], { goodNodes: ["r1p"], dimNodes: ["q0", "q1", "r0", "r1"] }),
          previewNote: "The \u03b5-NFA interleaves symbol transitions with silent \u03b5-moves.",
          revealNote: "The resulting NFA recognizes the identical language without \u03b5-transitions."
        }
      ],
      previous: { label: "Subset construction", href: "/proofs/chapter-01/subset-construction.html" },
      next: { label: "Kleene equivalence", href: "/proofs/chapter-02/kleene-equivalence.html" }
    },

    "kleene-equivalence": {
      slug: "kleene-equivalence",
      chapter: 2,
      title: "Kleene equivalence",
      theorem: String.raw`A formal language \(L \subseteq \Sigma^*\) is recognized by a finite automaton if and only if it is denoted by a regular expression: \(\mathcal{L}(\mathrm{FA}) = \mathcal{L}(\mathrm{RegExp})\).`,
      intro: "Kleene's Theorem establishes the fundamental equivalence between operational state-transition models (finite automata) and denotational algebraic syntax (regular expressions). The equivalence is constructive in both directions: any finite automaton can be compiled into a regular expression via path expressions or state elimination, and any regular expression can be inductively compiled into an equivalent finite automaton via Thompson's structural construction.",
      application: "In formal protocol specification and hardware verification, engineers define temporal patterns using declarative regular expressions (e.g. open(edit+save)*close). Kleene's theorem guarantees that these declarative expressions can be compiled into deterministic execution monitors with bounded memory.",
      strategy: "Prove both directions constructively. Automaton \(\to\) Expression: formulate the McNaughton-Yamada path recurrence \(R_{ij}^{(k)} = R_{ij}^{(k-1)} \cup R_{ik}^{(k-1)}(R_{kk}^{(k-1)})^*R_{kj}^{(k-1)}\) indexed by permissible intermediate states. Expression \(\to\) Automaton: apply structural induction on expression syntax via Thompson's \(\varepsilon\)-NFA composition. Close the translation cycle via \(\varepsilon\)-removal and the subset construction.",
      invariant: String.raw`Every transformation step preserves exact language denotation: \(L(\text{source}) = L(\text{target})\).`,
      synthesis: String.raw`For the automaton-to-expression direction, order the states \(q_1,\ldots,q_n\) and let \(R_{ij}^{(k)}\) denote the regular expression for paths from \(q_i\) to \(q_j\) whose intermediate vertices belong to \(\{q_1,\ldots,q_k\}\). The base expressions \(R_{ij}^{(0)}\) account for atomic transitions (and \(\varepsilon\) if \(i=j\)). Partitioning paths by whether they traverse \(q_k\) yields the recurrence \(R_{ij}^{(k)}=R_{ij}^{(k-1)}\cup R_{ik}^{(k-1)}(R_{kk}^{(k-1)})^*R_{kj}^{(k-1)}\). Taking the union of \(R_{1f}^{(n)}\) over all \(q_f\in F\) produces an equivalent regular expression. Conversely, structural induction constructs an equivalent \(\varepsilon\)-NFA for every regular expression. Eliminating \(\varepsilon\)-moves and determinizing completes the equivalence cycle \(\mathcal{L}(\mathrm{RegExp}) = \mathcal{L}(\mathrm{DFA})\).`,
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
          title: "Intermediate state indexing in path expressions",
          exposition: String.raw`To extract a regular expression from a DFA with state set \(Q = \{q_1, \ldots, q_n\}\), we avoid cyclic loops by bounding the permissible intermediate states. Define \(R_{ij}^{(k)}\) as the set of labels of all paths from \(q_i\) to \(q_j\) whose internal vertices belong strictly to \(\{q_1, \ldots, q_k\}\). For \(k = 0\), paths contain no intermediate states (only direct edges, plus \(\varepsilon\) if \(i = j\)). When \(k = n\), all states are permitted as intermediate waypoints, yielding the complete path language.`,
          question: "What precise structural constraint does the index k impose on the path language R_{ij}^{(k)}?",
          choices: [
            {
              text: String.raw`Internal path vertices must belong to the subset \(\{q_1, \ldots, q_k\}\); the endpoints \(q_i\) and \(q_j\) are unrestricted.`,
              correct: true,
              feedback: String.raw`Correct. The index \(k\) acts as an internal state filter: only states with index \(\le k\) can be visited between departure from \(q_i\) and arrival at \(q_j\).`
            },
            {
              text: String.raw`Paths must have length at most \(k\) transitions.`,
              correct: false,
              causalFailure: String.raw`The index \(k\) restricts state identities, not path length; paths in \(R_{ij}^{(k)}\) can be arbitrarily long due to loops among \(\{q_1, \ldots, q_k\}\).`
            },
            {
              text: String.raw`The automaton must contain at most \(k\) accepting states.`,
              correct: false,
              causalFailure: String.raw`Path expressions are independent of final states; acceptance is applied only at the outer union \(\bigcup_{q_f \in F} R_{1f}^{(n)}\).`
            }
          ],
          hint: "Distinguish between the endpoints q_i, q_j and the internal waypoints visited between them.",
          formal: String.raw`\(R_{ij}^{(k)} = \{ w \in \Sigma^* \mid q_i \xrightarrow{w} q_j \text{ such that all internal states lie in } \{q_1,\ldots,q_k\} \}\).`,
          preview: V(["dfa"], [], { dimNodes: ["enfa", "nfa"] }),
          reveal: V(["dfa", "rk"], ["dfa-rk"], { goodNodes: ["rk"], dimNodes: ["enfa", "nfa"] }),
          previewNote: "Start from the DFA. Arbitrary paths may contain complex cyclic loops.",
          revealNote: "R_ij^(k) stratifies all paths by their permitted intermediate states."
        },
        {
          label: "DFA \u2192 Regex",
          title: "The McNaughton-Yamada path recurrence",
          exposition: String.raw`When allowing \(q_k\) as a new intermediate waypoint, any path from \(q_i\) to \(q_j\) with internal vertices in \(\{q_1, \ldots, q_k\}\) partitions into two disjoint cases: (1) paths that never visit \(q_k\) as an internal state, denoted by \(R_{ij}^{(k-1)}\); and (2) paths that visit \(q_k\) at least once: they travel from \(q_i\) to \(q_k\), loop on \(q_k\) zero or more times, and finally travel from \(q_k\) to \(q_j\), with all intermediate states in \(\{q_1, \ldots, q_{k-1}\}\). This yields the algebraic recurrence: \(R_{ij}^{(k)} = R_{ij}^{(k-1)} \cup R_{ik}^{(k-1)} (R_{kk}^{(k-1)})^* R_{kj}^{(k-1)}\).`,
          question: "Why does the second term in the recurrence R_{ij}^{(k)} require the Kleene star (R_{kk}^{(k-1)})*?",
          choices: [
            {
              text: String.raw`Because a path may revisit state \(q_k\) multiple times, executing an arbitrary number of intermediate loops before departing toward \(q_j\).`,
              correct: true,
              feedback: String.raw`Precisely. After reaching \(q_k\) for the first time, the run may return to \(q_k\) zero, one, or arbitrarily many times via intermediate states \(\{q_1, \ldots, q_{k-1}\}\), captured algebraically by \({}^*\).`
            },
            {
              text: String.raw`Because regular expressions cannot represent concatenation without an enclosing star.`,
              correct: false,
              causalFailure: String.raw`Regular expressions support concatenation independently of star; the star operator specifically models unbounded self-loops.`
            },
            {
              text: String.raw`Because state \(q_k\) is mathematically guaranteed to be an accepting state.`,
              correct: false,
              causalFailure: String.raw`State \(q_k\) is an arbitrary state in the elimination ordering; it need not belong to \(F\).`
            }
          ],
          hint: "How many times can an execution path visit the newly permitted waypoint q_k?",
          formal: String.raw`\(R_{ij}^{(k)}=R_{ij}^{(k-1)}\cup R_{ik}^{(k-1)}(R_{kk}^{(k-1)})^*R_{kj}^{(k-1)}\). The base cases are \(R_{ij}^{(0)}=\{a\in\Sigma\mid \delta(q_i,a)=q_j\}\cup(\{\varepsilon\}\text{ if }i=j\text{ else }\emptyset)\).`,
          preview: V(["rk"], [], { dimNodes: ["enfa", "nfa"] }),
          reveal: V(["rk", "regex"], ["rk-regex"], { goodNodes: ["regex"], dimNodes: ["enfa", "nfa"] }),
          previewNote: "Paths decompose into: avoiding q_k entirely, or entering q_k and looping.",
          revealNote: "The recurrence synthesizes union, concatenation, and star algebraically."
        },
        {
          label: "Regex \u2192 Automaton",
          title: "Thompson's structural induction on syntax trees",
          exposition: String.raw`Conversely, given regular expression \(e\), we construct an equivalent \(\varepsilon\)-NFA by structural induction on its syntax tree. Atomic expressions (\(\emptyset, \varepsilon, a\)) map to elementary 2-state automata. Inductive operators (\(e_1 + e_2, e_1 \cdot e_2, e_1^*\)) compose sub-automata using \(\varepsilon\)-transitions. Thompson's construction maintains an essential structural invariant: every synthesized sub-automaton possesses exactly one initial state with zero incoming edges, and exactly one accepting state with zero outgoing edges.`,
          question: "Which structural property guaranteed by Thompson's construction prevents cross-talk or unintended cycles when nesting sub-automata under concatenation and star?",
          choices: [
            {
              text: String.raw`Every component automaton has a unique start state with in-degree 0 and a unique final state with out-degree 0.`,
              correct: true,
              feedback: String.raw`Exactly. Having a single entrance with in-degree 0 and a single exit with out-degree 0 ensures that adding \(\varepsilon\)-links for concatenation or loops cannot inadvertently re-enter internal states of component modules.`
            },
            {
              text: String.raw`All constructed component automata are strictly deterministic and minimal.`,
              correct: false,
              causalFailure: String.raw`Thompson automata are highly non-deterministic with numerous \(\varepsilon\)-transitions, and are far from minimal.`
            },
            {
              text: String.raw`Transitions are only permitted to connect states with monotonically increasing indices.`,
              correct: false,
              causalFailure: String.raw`Kleene star introduces backwards \(\varepsilon\)-transitions to enable looping, violating monotonic index ordering.`
            }
          ],
          hint: "Consider why Thompson's construction adds dedicated new initial and final states for union and star.",
          formal: String.raw`By structural induction, for every regular expression \(e\) there exists an \(\varepsilon\)-NFA \(\mathcal{A}_e\) with \(L(\mathcal{A}_e) = \mathcal{L}(e)\) satisfying the single-entry single-exit invariant.`,
          preview: V(["regex"], [], { dimNodes: ["dfa", "nfa"] }),
          reveal: V(["regex", "enfa"], ["regex-enfa"], { goodNodes: ["enfa"], dimNodes: ["dfa", "nfa"] }),
          previewNote: "A regular expression is a structured syntax tree of atoms and operators.",
          revealNote: "Thompson's construction mirrors that tree using \u03b5-linked component blocks."
        },
        {
          label: "Equivalence",
          title: "Closing the equivalence cycle: \u22c3 R_{1f}^{(n)} = L(A)",
          exposition: String.raw`The two directions close a complete translation loop: \(\mathrm{RegExp} \xrightarrow{\text{Thompson}} \varepsilon\text{-NFA} \xrightarrow{\varepsilon\text{-elim}} \mathrm{NFA} \xrightarrow{\text{subset}} \mathrm{DFA} \xrightarrow{\text{Kleene}} \mathrm{RegExp}\). Since every intermediate representation preserves the recognized language, we conclude that the class of languages recognized by finite automata is identical to the class of languages denoted by regular expressions: \(\mathcal{L}(\mathrm{FA}) = \mathcal{L}(\mathrm{RegExp})\).`,
          question: "Why does the closed cycle of language-preserving reductions prove logical equivalence (\u21d4) rather than a one-way inclusion?",
          choices: [
            {
              text: String.raw`Because constructive translations exist in both directions: every automaton denotes a regular expression, and every regular expression compiles to an automaton.`,
              correct: true,
              feedback: String.raw`Correct. A translation \(\mathrm{DFA} \to \mathrm{RegExp}\) proves \(\mathcal{L}(\mathrm{DFA}) \subseteq \mathcal{L}(\mathrm{RegExp})\), while \(\mathrm{RegExp} \to \varepsilon\text{-NFA} \to \mathrm{DFA}\) proves \(\mathcal{L}(\mathrm{RegExp}) \subseteq \mathcal{L}(\mathrm{DFA})\), establishing exact equality.`
            },
            {
              text: String.raw`Because regular expressions are isomorphic to context-free grammars in Greibach normal form.`,
              correct: false,
              causalFailure: String.raw`Context-free grammars strictly subsume regular expressions; they are not equivalent to finite automata.`
            },
            {
              text: String.raw`Because the McNaughton-Yamada algorithm runs in linear time.`,
              correct: false,
              causalFailure: String.raw`McNaughton-Yamada can produce exponentially large expressions \(\mathcal{O}(4^n)\); computational complexity does not determine language equivalence.`
            }
          ],
          hint: "To prove A = B, one must establish both inclusions: A \u2286 B and B \u2286 A.",
          formal: String.raw`\(L(\mathcal{A})=\bigcup_{q_f\in F}R_{1f}^{(n)}\implies\mathcal{L}(\mathrm{DFA})\subseteq\mathcal{L}(\mathrm{RegExp})\), and Thompson's construction gives \(\mathcal{L}(\mathrm{RegExp})\subseteq\mathcal{L}(\mathrm{DFA})\). Hence \(\mathcal{L}(\mathrm{DFA})=\mathcal{L}(\mathrm{RegExp})\).`,
          preview: V(["regex", "enfa", "nfa", "dfa"], [], {}),
          reveal: V(["regex", "enfa", "nfa", "dfa"], ["regex-enfa", "enfa-nfa", "nfa-dfa", "dfa-regex"], { goodNodes: ["regex", "dfa"] }),
          previewNote: "Four representations form a closed translational cycle.",
          revealNote: "Every translation preserves language semantics: L(DFA) = L(RegExp)."
        }
      ],
      previous: { label: "\u03b5-removal", href: "/proofs/chapter-02/epsilon-removal.html" },
      next: { label: "Closure of regular languages", href: "/proofs/chapter-02/regular-closure.html" }
    },

    "regular-closure": {
      slug: "regular-closure",
      chapter: 2,
      title: "Closure of regular languages",
      theorem: String.raw`The class of regular languages \(\mathrm{REG}\) is an effective Boolean algebra: it is closed under union (\(\cup\)), intersection (\(\cap\)), complementation (\(\complement\)), concatenation (\(\cdot\)), and Kleene star (\({}^*\)).`,
      intro: "A language family is closed under an operation if applying that operation to languages within the family yields another language in the same family. For regular languages, closure is fully constructive: for every Boolean and regular operation, an explicit algorithm synthesizes a finite automaton recognizing the compound language directly from automata for the operands.",
      application: "In model checking, safety verification reduces to language containment: a system model \(\mathcal{M}\) complies with specification \(\mathcal{S}\) iff \(\mathcal{L}(\mathcal{M}) \subseteq \mathcal{L}(\mathcal{S})\), which is algorithmically decidable by checking emptiness of the product \(\mathcal{L}(\mathcal{M}) \cap \overline{\mathcal{L}(\mathcal{S})} = \emptyset\).",
      strategy: "For regular operations (\(\cup, \cdot, {}^*\)), construct compositional \(\varepsilon\)-NFAs via Thompson's synthesis. For complementation, determinize and complete the automaton so every word admits a unique total run, then invert final states: \(F' = Q \setminus F\). For intersection, construct the synchronous Cartesian product automaton on \(Q_1 \times Q_2\) with accepting set \(F_1 \times F_2\).",
      invariant: String.raw`Every constructed automaton accepts exactly the language defined by the corresponding set-theoretic operation.`,
      synthesis: String.raw`Let \(L_1, L_2\) be regular languages. Closure under union, concatenation, and star follows directly from regular expression syntax and Thompson's \(\varepsilon\)-NFA compilation. For complementation, determinize and complete a DFA for \(L_1\); since \(\delta\) is total and deterministic, every word \(w\in\Sigma^*\) induces a unique path ending in \(\widehat{\delta}(q_0, w)\). Replacing \(F\) by \(Q\setminus F\) inverts the acceptance verdict: \(w\in\Sigma^*\setminus L_1 \iff \widehat{\delta}(q_0, w)\in Q\setminus F\). For intersection, the synchronous product \(\mathcal{A}_1\times\mathcal{A}_2\) with state space \(Q_1\times Q_2\), transition \(\delta((p,q),a)=(\delta_1(p,a),\delta_2(q,a))\), and accepting set \(F_1\times F_2\) accepts \(w\) iff \(w\in L_1\cap L_2\). Thus \(\mathrm{REG}\) is closed under all five operations.`,
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
          label: "Syntactic operations",
          title: "Closure under union, concatenation, and Kleene star",
          exposition: String.raw`The operations \(L_1 \cup L_2\), \(L_1 \cdot L_2\), and \(L_1^*\) correspond directly to the inductive constructors of regular expressions. By Kleene's theorem, if \(L_1 = \mathcal{L}(e_1)\) and \(L_2 = \mathcal{L}(e_2)\), then \(L_1 \cup L_2 = \mathcal{L}(e_1 + e_2)\), \(L_1 \cdot L_2 = \mathcal{L}(e_1 \cdot e_2)\), and \(L_1^* = \mathcal{L}(e_1^*)\). Operationally, Thompson's construction implements these operations by wiring sub-automata using \(\varepsilon\)-transitions without modifying internal state spaces.`,
          question: "Why do the operations \u222a, \u22c5, and * preserve regularity without requiring determinization?",
          choices: [
            {
              text: String.raw`Because they are primitive constructors of regular expressions; \(\varepsilon\)-NFAs implement initial choice (\(\cup\)), sequential handoff (\(\cdot\)), and restart loops (\({}^*\)) while remaining finite-state.`,
              correct: true,
              feedback: String.raw`Correct. Non-determinism allows combining existing automata via \(\varepsilon\)-transitions in linear time \(\mathcal{O}(|Q_1| + |Q_2|)\), directly certifying regularity.`
            },
            {
              text: String.raw`Because all regular languages are finite sets, and operations on finite sets are trivially closed.`,
              correct: false,
              causalFailure: String.raw`Regular languages can be infinite (e.g. \(a^*\)); closure depends on finite-state recognizability, not set finiteness.`
            },
            {
              text: String.raw`Because regular expressions commute with the subset construction operator.`,
              correct: false,
              causalFailure: String.raw`Regular expressions are syntactic terms; they do not commute with determinization algorithms.`
            }
          ],
          hint: "Recall Thompson's synthesis: how are sub-automata wired together for e_1 + e_2, e_1 \u00b7 e_2, and e_1*?",
          formal: String.raw`If \(L_1, L_2 \in \mathrm{REG}\), then \(e_1 + e_2, e_1 e_2, e_1^* \in \mathrm{RegExp}\), hence \(L_1 \cup L_2, L_1 L_2, L_1^* \in \mathrm{REG}\).`,
          preview: V(["reg"], [], { dimNodes: ["comp", "inter"] }),
          reveal: V(["reg", "union", "concat", "star"], ["e-union", "e-concat", "e-star"], { goodNodes: ["union", "concat", "star"], dimNodes: ["comp", "inter"] }),
          previewNote: "Three operations are inherited directly from regular expression syntax.",
          revealNote: "Thompson wiring keeps all three constructions inside REG with linear state overhead."
        },
        {
          label: "Complementation",
          title: "Inverting acceptance: The necessity of completeness and determinism",
          exposition: String.raw`To recognize \(\overline{L} = \Sigma^* \setminus L\), we invert the acceptance status of states: \(F' = Q \setminus F\). However, this swap is sound if and only if the automaton is BOTH deterministic AND complete (every state has exactly one outgoing transition per alphabet symbol). In an incomplete DFA, rejected words may lack a complete run and will still be rejected after swapping. In an NFA, a word may reach both accepting and non-accepting states simultaneously, so flipping states does not compute the complement.`,
          question: "Why is state flipping (F' = Q \\ F) sound for complementation ONLY when the automaton is both deterministic and complete?",
          choices: [
            {
              text: String.raw`Determinism guarantees that every word induces at most one run, while completeness guarantees that every word induces at least one run; together they ensure a unique run ending in \(\widehat{\delta}(q_0, w)\), so inverting \(F\) precisely inverts acceptance.`,
              correct: true,
              feedback: String.raw`Precisely. In an NFA, a word can have multiple runs, some ending in \(F\) and others in \(Q \setminus F\), so both the original and flipped machines would accept it. In an incomplete DFA, a missing transition discards words entirely.`
            },
            {
              text: String.raw`Because non-deterministic automata cannot be complemented under any mathematical construction.`,
              correct: false,
              causalFailure: String.raw`NFAs can be complemented, but they must first be converted into complete DFAs via the subset construction before flipping final states.`
            },
            {
              text: String.raw`Because inverting final states in an NFA would make the start state unreachable.`,
              correct: false,
              causalFailure: String.raw`Flipping final states alters only \(F\); it does not modify the transition graph or reachability from \(q_0\).`
            }
          ],
          hint: "Consider what happens if a word has no run (incomplete) or multiple runs (non-deterministic).",
          formal: String.raw`For a complete DFA \(\mathcal{A}\), \(\forall w\in\Sigma^*,\; \exists! q\in Q \text{ s.t. } \widehat{\delta}(q_0,w)=q\). Thus \(w\notin L(\mathcal{A}) \iff \widehat{\delta}(q_0,w)\in Q\setminus F\).`,
          preview: V(["reg", "comp"], [], { dimNodes: ["union", "concat", "star", "inter"] }),
          reveal: V(["reg", "comp"], ["e-comp"], { goodNodes: ["comp"], dimNodes: ["union", "concat", "star", "inter"] }),
          previewNote: "Complementation inverts the verdict: w is accepted iff it was previously rejected.",
          revealNote: "A complete DFA ensures every word has exactly one run to invert: F' = Q \\ F."
        },
        {
          label: "Intersection",
          title: "Synchronous parallel composition: The Cartesian product automaton",
          exposition: String.raw`Given DFAs \(\mathcal{A}_1 = (Q_1, \Sigma, \delta_1, q_{0,1}, F_1)\) and \(\mathcal{A}_2 = (Q_2, \Sigma, \delta_2, q_{0,2}, F_2)\), we construct the synchronous product automaton \(\mathcal{A}_1 \times \mathcal{A}_2 = (Q_1 \times Q_2, \Sigma, \delta, (q_{0,1}, q_{0,2}), F_1 \times F_2)\). The transition function advances both components simultaneously on each symbol: \(\delta((p, q), a) = (\delta_1(p, a), \delta_2(q, a))\). By induction, \(\widehat{\delta}((q_{0,1}, q_{0,2}), w) = (\widehat{\delta}_1(q_{0,1}, w), \widehat{\delta}_2(q_{0,2}, w))\). Acceptance requires both components to land in final states: \((p, q) \in F_1 \times F_2\).`,
          question: "Why does the synchronous product automaton use state space Q_1 \u00d7 Q_2 and final set F_1 \u00d7 F_2 to recognize L_1 \u2229 L_2?",
          choices: [
            {
              text: String.raw`The pair \((p, q)\) maintains the exact instantaneous state of both machines after reading prefix \(w\); requiring both components to be final ensures \(w \in L_1\) and \(w \in L_2\).`,
              correct: true,
              feedback: String.raw`Correct. Synchronous product simulates parallel execution on identical input symbols, and the product of accepting sets enforces simultaneous acceptance.`
            },
            {
              text: String.raw`Because the union of state sets \(Q_1 \cup Q_2\) would conflate states belonging to different automata.`,
              correct: false,
              causalFailure: String.raw`While \(Q_1 \cup Q_2\) is incorrect, the mathematical reason is that an ordered pair in \(Q_1 \times Q_2\) is required to track two independent configurations simultaneously.`
            },
            {
              text: String.raw`Because De Morgan's laws do not apply to regular languages.`,
              correct: false,
              causalFailure: String.raw`De Morgan's laws hold for any Boolean algebra of sets: \(L_1 \cap L_2 = \overline{\overline{L_1} \cup \overline{L_2}}\).`
            }
          ],
          hint: "Evaluate \u03b4\u0302((q_0,1, q_0,2), w): both components must accept the identical word w.",
          formal: String.raw`\(\widehat{\delta}((q_{0,1},q_{0,2}),w)\in F_1\times F_2 \iff \widehat{\delta}_1(q_{0,1},w)\in F_1 \land \widehat{\delta}_2(q_{0,2},w)\in F_2 \iff w\in L_1\cap L_2\).`,
          preview: V(["reg", "inter"], [], { dimNodes: ["union", "concat", "star", "comp"] }),
          reveal: V(["reg", "inter"], ["e-inter"], { goodNodes: ["inter"], dimNodes: ["union", "concat", "star", "comp"] }),
          previewNote: "Intersection requires both automata to accept on the identical input word.",
          revealNote: "The Cartesian product Q1 \u00d7 Q2 tracks both state configurations synchronously."
        },
        {
          label: "Decision procedures",
          title: "Verification implications: Decidability of inclusion and equivalence",
          exposition: String.raw`The effective Boolean closure of \(\mathrm{REG}\) is the foundation of automated formal verification. Given two regular specifications \(L_1\) and \(L_2\), language containment \(L_1 \subseteq L_2\) holds if and only if \(L_1 \cap \overline{L_2} = \emptyset\). Since regular languages are effectively closed under complementation and intersection, we construct a DFA for \(L_1 \cap \overline{L_2}\) and test emptiness by reachability analysis in \(\mathcal{O}(|Q_1| \cdot 2^{|Q_2|})\). Similarly, language equivalence \(L_1 = L_2\) reduces to mutual containment.`,
          question: "How does effective Boolean closure enable algorithmic decision procedures for language inclusion L_1 \u2286 L_2?",
          choices: [
            {
              text: String.raw`By reducing containment to emptiness: \(L_1 \subseteq L_2 \iff L_1 \cap \overline{L_2} = \emptyset\); since \(\mathrm{REG}\) is closed under \(\complement\) and \(\cap\), the product DFA can be checked for reachability of final states.`,
              correct: true,
              feedback: String.raw`Exactly. Boolean closure allows compiling compound verification queries into single automata whose emptiness can be checked in linear time with respect to the transition graph.`
            },
            {
              text: String.raw`By proving that all regular languages have identical minimal automata.`,
              correct: false,
              causalFailure: String.raw`Minimal automata are unique up to isomorphism for a single language, but different languages have different minimal automata.`
            },
            {
              text: String.raw`By establishing that regular language inclusion is undecidable by Rice's theorem.`,
              correct: false,
              causalFailure: String.raw`Rice's theorem applies to Turing-complete systems; regular language inclusion is fully decidable.`
            }
          ],
          hint: "Express L_1 \u2286 L_2 in terms of set operations and the empty set \u2205.",
          formal: String.raw`\(L_1 \subseteq L_2 \iff L_1 \setminus L_2 = \emptyset \iff L_1 \cap \overline{L_2} = \emptyset\). Since \(\overline{L_2}\in\mathrm{REG}\) and \(\cap\) preserves regularity, emptiness is decidable via graph search.`,
          preview: V(["reg"], [], {}),
          reveal: V(["reg", "union", "concat", "star", "comp", "inter"], ["e-union", "e-concat", "e-star", "e-comp", "e-inter"], { goodNodes: ["reg"] }),
          previewNote: "All five operations map regular languages to regular languages.",
          revealNote: "REG is an effective Boolean algebra with decidable emptiness, inclusion, and equivalence."
        }
      ],
      previous: { label: "Kleene equivalence", href: "/proofs/chapter-02/kleene-equivalence.html" },
      next: { label: "Small model property", href: "/proofs/chapter-02/small-model-property.html" }
    },

    "small-model-property": {
      slug: "small-model-property",
      chapter: 2,
      title: "Small model property",
      theorem: String.raw`If a DFA \(\mathcal{A} = (Q, \Sigma, \delta, q_0, F)\) with \(n = |Q|\) states accepts any word, it accepts at least one witness word \(z\) of bounded length: \(|z| < n\).`,
      intro: "The Small Model Property establishes a fundamental finite-bound principle in formal verification: if a finite automaton accepts any words, it must accept a short witness whose length is strictly less than its state count. This property provides the computational basis for deciding automaton emptiness and constitutes the core combinatorial argument of the Pumping Lemma.",
      application: "In model checking and bounded verification, searching for safety counterexamples (error traces) can be strictly bounded by the system's state space size: if an \(n\)-state concurrent model contains an error trajectory, there exists a minimal counterexample trace of length at most \(n-1\).",
      strategy: "Proof by contradiction using Dirichlet's Pigeonhole Principle. Assume \(L(\mathcal{A}) \neq \emptyset\) and fix an accepted word \(z\) of minimal length. Assume \(|z| \ge n\). The run visits \(|z| + 1 \ge n + 1\) states, forcing a duplicate state \(p_i = p_j\) with \(i < j\). Factor \(z = uvw\) and splice out the loop factor \(v\); determinism ensures the shortened word \(uw\) is accepted, contradicting the minimality of \(z\).",
      invariant: String.raw`The spliced run visits identical final states because determinism guarantees \(\widehat{\delta}(p_i, w) = \widehat{\delta}(p_j, w) \in F\).`,
      synthesis: String.raw`Assume \(L(\mathcal{A})\neq\emptyset\) and select an accepted word \(z\in L(\mathcal{A})\) of minimum length \(m=|z|\). Its deterministic run is a sequence of \(m+1\) state visits \(p_0, p_1, \ldots, p_m\) with \(p_0=q_0\) and \(p_m\in F\). If \(m\ge n\), the pigeonhole principle guarantees indices \(0\le i < j \le n\) such that \(p_i=p_j\). Decompose \(z=uvw\) where \(|u|=i\), \(|v|=j-i\ge 1\), and \(|w|=m-j\). Because the automaton is deterministic, \(\widehat{\delta}(q_0, u)=p_i=p_j\) and \(\widehat{\delta}(p_j, w)=p_m\in F\). Consequently, the spliced word \(uw\) induces the run \(q_0 \xrightarrow{u} p_i \xrightarrow{w} p_m\), so \(uw\in L(\mathcal{A})\). But \(|uw|=|u|+|w|=m-|v|<m=|z|\), strictly contradicting the minimality of \(z\). Thus \(|z|<n\).`,
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
          title: "Fixing a minimal witness word z \u2208 L(A)",
          exposition: String.raw`To prove that every non-empty regular language contains a short word, we select a word \(z \in L(\mathcal{A})\) of minimal length: \(|z| = \min \{ |w| \mid w \in L(\mathcal{A}) \}\). The proof proceeds by contradiction: we hypothesize that \(|z| \ge n\), where \(n = |Q|\) is the number of states in \(\mathcal{A}\). If this assumption enables us to construct another accepted word strictly shorter than \(z\), minimality is contradicted, proving \(|z| < n\).`,
          question: "What is the methodological purpose of assuming z is a word of MINIMUM length in L(A)?",
          choices: [
            {
              text: String.raw`To set up a proof by contradiction: exhibiting any accepted word \(z'\) with \(|z'| < |z|\) refutes the assumption that \(|z| \ge n\).`,
              correct: true,
              feedback: String.raw`Correct. Choosing a minimal element is a standard extremum argument: if a long minimal word contains a cycle, deleting the cycle produces an even shorter accepted word, yielding an immediate contradiction.`
            },
            {
              text: String.raw`Because minimal words in a regular language are guaranteed to be palindromes.`,
              correct: false,
              causalFailure: String.raw`Minimal words have no requirement of symmetry or palindromic structure; they simply minimize string length.`
            },
            {
              text: String.raw`Because the transition function \(\delta\) is only defined for words of minimal length.`,
              correct: false,
              causalFailure: String.raw`Transition functions \(\widehat{\delta}\) are totally defined over all words in \(\Sigma^*\), regardless of length.`
            }
          ],
          hint: "Consider what happens if you find another accepted word shorter than the shortest one.",
          formal: String.raw`Assume \(L(\mathcal{A})\neq\emptyset\) and let \(z\in\arg\min_{w\in L(\mathcal{A})}|w|\). If \(|z|\ge n\), we derive \(z'\in L(\mathcal{A})\) with \(|z'|<|z|\), a contradiction.`,
          preview: V([], [], { dimNodes: ["mid"] }),
          reveal: V(["p0", "pi", "pj", "pm"], ["u", "w"], { goodNodes: ["pm"], dimNodes: ["mid"] }),
          previewNote: "A minimal accepted run p0 ... pm \u2014 we hypothesize m = |z| \u2265 n.",
          revealNote: "Fixing the minimal witness: we will search for an internal state repetition."
        },
        {
          label: "Pigeonhole",
          title: "Dirichlet's Principle: Forcing an internal state recurrence",
          exposition: String.raw`Let \(m = |z|\). The deterministic run on \(z = a_1 a_2 \cdots a_m\) traverses a sequence of \(m + 1\) state configurations: \(p_0, p_1, \ldots, p_m\), where \(p_0 = q_0\) and \(p_k = \delta(p_{k-1}, a_k)\). If \(m \ge n\), the run visits at least \(n + 1\) states. By the Dirichlet Pigeonhole Principle, distributing \(n + 1\) visits into \(n\) available states forces at least one state to recur: there exist indices \(0 \le i < j \le n\) such that \(p_i = p_j\).`,
          question: "Why does the condition |z| \u2265 n guarantee the existence of indices i < j with p_i = p_j?",
          choices: [
            {
              text: String.raw`A word of length \(m\) visits \(m+1\) states (including \(p_0\)); if \(m \ge n\), there are at least \(n+1\) state visits among \(n\) distinct states in \(Q\), forcing a collision by pigeonhole.`,
              correct: true,
              feedback: String.raw`Exactly. Counting both endpoints of every step, \(m\) transitions visit \(m+1\) state positions. When \(m+1 > n\), at least two positions must share identical states.`
            },
            {
              text: String.raw`Because the transition graph of every DFA is strongly connected.`,
              correct: false,
              causalFailure: String.raw`DFAs are not necessarily strongly connected; state repetition is forced purely by the length of the path exceeding the number of distinct vertices.`
            },
            {
              text: String.raw`Because deterministic automata cannot visit more than \(n/2\) distinct states.`,
              correct: false,
              causalFailure: String.raw`A DFA can visit all \(n\) distinct states along an acyclic path of length \(n-1\).`
            }
          ],
          hint: "Count the number of vertices on a path of length m: p_0, p_1, ..., p_m. How many items vs boxes?",
          formal: String.raw`\(|\{p_0, p_1, \ldots, p_n\}| = n + 1 > |Q| = n \implies \exists i < j \le n \text{ such that } p_i = p_j\).`,
          preview: V(["p0", "pi", "pj", "pm"], ["u", "w"], { dimNodes: ["mid"] }),
          reveal: V(["pi", "pj", "mid"], ["v-in", "v-out"], { goodNodes: ["pi", "pj"], dimNodes: ["p0", "pm"] }),
          previewNote: "n+1 state visits distributed among n available states in Q.",
          revealNote: "p_i = p_j: the run encloses a non-empty cyclic factor v = a_{i+1}...a_j with |v| \u2265 1."
        },
        {
          label: "Loop excision",
          title: "Splicing out the loop factor: Preserving acceptance",
          exposition: String.raw`Factor \(z = uvw\), where \(u = a_1 \cdots a_i\), \(v = a_{i+1} \cdots a_j\), and \(w = a_{j+1} \cdots a_m\). The factor \(v\) has length \(|v| = j - i \ge 1\). The run satisfies \(q_0 \xrightarrow{u} p_i \xrightarrow{v} p_j \xrightarrow{w} p_m \in F\). Since \(p_i = p_j\) and \(\mathcal{A}\) is deterministic, feeding suffix \(w\) from \(p_i\) produces the identical state trajectory as feeding \(w\) from \(p_j\): \(\widehat{\delta}(p_i, w) = \widehat{\delta}(p_j, w) = p_m \in F\). Therefore, the spliced word \(uw\) is accepted by \(\mathcal{A}\).`,
          question: "Why is the shortened word uw guaranteed to be accepted by the DFA?",
          choices: [
            {
              text: String.raw`Because \(p_i = p_j\), determinism guarantees that suffix \(w\) starting from \(p_i\) reaches the exact same final state \(p_m \in F\) as starting from \(p_j\).`,
              correct: true,
              feedback: String.raw`Correct. Determinism implies that the transition function is memoryless: future state trajectories depend solely on current state and input suffix, so bypassing the loop \(v\) still lands in \(p_m \in F\).`
            },
            {
              text: String.raw`Because the loop factor \(v\) must have been the empty string \(\varepsilon\).`,
              correct: false,
              causalFailure: String.raw`The loop factor \(v\) satisfies \(|v| = j - i \ge 1\); it is strictly non-empty because \(i < j\).`
            },
            {
              text: String.raw`Because regular languages are closed under arbitrary substring deletion.`,
              correct: false,
              causalFailure: String.raw`Regular languages are not closed under arbitrary substring deletion; excision is valid here specifically because the endpoints of \(v\) share the identical state \(p_i = p_j\).`
            }
          ],
          hint: "Examine the path: q_0 -u-> p_i. Since p_i = p_j, can you apply -w-> directly?",
          formal: String.raw`\(\widehat{\delta}(q_0, uw) = \widehat{\delta}(\widehat{\delta}(q_0, u), w) = \widehat{\delta}(p_i, w) = \widehat{\delta}(p_j, w) = p_m \in F \implies uw \in L(\mathcal{A})\).`,
          preview: V(["pi", "mid", "pj"], ["v-in", "v-out"], { dimNodes: ["p0", "pm"] }),
          reveal: V(["p0", "pi", "pm"], ["u", "shortcut"], { goodNodes: ["pm"], dimNodes: ["mid", "pj"] }),
          previewNote: "The cyclic factor v starts and ends at the identical state p_i.",
          revealNote: "Excising v yields word uw \u2208 L(A) with length |uw| = |z| - |v| < |z|."
        },
        {
          label: "Conclusion",
          title: "Contradiction and emptiness decidability",
          exposition: String.raw`The spliced word \(uw\) is accepted by \(\mathcal{A}\), and its length satisfies \(|uw| = |u| + |w| = |z| - |v| < |z|\) because \(|v| \ge 1\). This strictly contradicts the choice of \(z\) as an accepted word of minimal length. Consequently, the initial hypothesis \(|z| \ge n\) must be false. We conclude that every non-empty regular language contains an accepted word of length at most \(n - 1\). This provides an algorithmic decision procedure: testing emptiness of \(\mathcal{A}\) requires checking reachability of \(F\) within depth \(n - 1\).`,
          question: "What is the algorithmic significance of the bound |z| < n for verification algorithms?",
          choices: [
            {
              text: String.raw`It guarantees that DFA emptiness is decidable in polynomial time: checking words up to length \(n-1\) (or running breadth-first search to depth \(n-1\)) is both necessary and sufficient.`,
              correct: true,
              feedback: String.raw`Precisely. If no final state is reached within \(n-1\) steps, the language is guaranteed to be empty, bounding reachability search to \(\mathcal{O}(|Q| + |\Delta|)\).`
            },
            {
              text: String.raw`It proves that all regular languages have finite cardinality.`,
              correct: false,
              causalFailure: String.raw`The theorem bounds the shortest accepted word, not the total number of accepted words; a language with an accepted word of length \(< n\) can still contain infinitely many longer words.`
            },
            {
              text: String.raw`It implies that any DFA can be minimized in \(\mathcal{O}(1)\) time.`,
              correct: false,
              causalFailure: String.raw`DFA minimization requires Hopcroft's algorithm (\(\mathcal{O}(n \log n)\)); the small model property bounds witness length, not minimization time.`
            }
          ],
          hint: "If an error state is reachable, what is the maximum depth at which it can first appear?",
          formal: String.raw`\(L(\mathcal{A})\neq\emptyset \iff \exists w\in L(\mathcal{A}) \text{ s.t. } |w|<|Q|\). Emptiness is decidable in linear time \(\mathcal{O}(|Q|+|\Delta|)\).`,
          preview: V(["p0", "pi", "pj", "pm"], ["u", "v-in", "v-out", "w"], {}),
          reveal: V(["p0", "pi", "pm"], ["u", "shortcut"], { goodNodes: ["p0", "pi", "pm"], dimNodes: ["mid", "pj"] }),
          previewNote: "A minimal accepted run cannot revisit any state.",
          revealNote: "No state can repeat, so an acyclic witness path has at most n-1 edges: |z| < n."
        }
      ],
      previous: { label: "Closure of regular languages", href: "/proofs/chapter-02/regular-closure.html" },
      next: { label: "Myhill\u2013Nerode", href: "/proofs/chapter-02/myhill-nerode.html" }
    },

    "myhill-nerode": {
      slug: "myhill-nerode",
      chapter: 2,
      title: "Myhill\u2013Nerode theorem",
      theorem: String.raw`A formal language \(L \subseteq \Sigma^*\) is regular if and only if the Nerode right-congruence \(\sim_L\) has finite index: \(\operatorname{index}(\sim_L) < \infty\). Furthermore, \(\operatorname{index}(\sim_L)\) equals the number of states in the minimal DFA recognizing \(L\).`,
      intro: "The Myhill-Nerode Theorem provides the fundamental structural and algebraic characterization of regular languages. It establishes that the minimal memory necessary to recognize a language \(L\) corresponds precisely to distinguishing future continuations: two words \(x, y \in \Sigma^*\) are Nerode-equivalent (\(x \sim_L y\)) iff \(\forall z \in \Sigma^*,\; xz \in L \iff yz \in L\). The language is regular iff \(\sim_L\) has finitely many equivalence classes, which form the states of the unique minimal DFA.",
      application: "In formal verification and model checking, state-space minimization via bisimulation quotienting relies directly on the Myhill-Nerode theorem. It also provides the definitive mathematical technique for proving non-regularity by constructing an infinite set of pairwise distinguishable prefixes.",
      strategy: "Prove the tripartite cycle of logical implications: (1) If \(L\) is regular, the state fibers of any recognizing DFA define a finite-index right-invariant equivalence compatible with \(L\). (2) Any such relation refines the canonical relation \(\sim_L\), forcing \(\operatorname{index}(\sim_L) < \infty\). (3) If \(\operatorname{index}(\sim_L) < \infty\), construct the canonical quotient DFA on \(\Sigma^*/{\sim_L}\) and prove well-definedness via right-invariance.",
      invariant: String.raw`\(\forall x, y \in [w]_L,\; \forall z \in \Sigma^*,\; xz \in L \iff yz \in L\). Classes preserve future observational equivalence.`,
      synthesis: String.raw`Let \(L\subseteq\Sigma^*\). (1) \(\implies\) (2): If \(L\) is recognized by a DFA \(\mathcal{A}=(Q,\Sigma,\delta,q_0,F)\), define \(x\sim_{\mathcal{A}} y \iff \widehat{\delta}(q_0, x)=\widehat{\delta}(q_0, y)\). This relation is right-invariant (\(x\sim_{\mathcal{A}} y \implies xz\sim_{\mathcal{A}} yz\)), compatible with \(L\) (\(x\in L \iff y\in L\)), and has \(\operatorname{index}(\sim_{\mathcal{A}})\le |Q|<\infty\). (2) \(\implies\) (3): Let \(\sim\) be any right-invariant, compatible relation of finite index. If \(x\sim y\), then \(\forall z\), \(xz\sim yz\) by right-invariance, so \(xz\in L\iff yz\in L\) by compatibility. Thus \(x\sim_L y\), meaning \(\sim\) refines \(\sim_L\) and \(\operatorname{index}(\sim_L)\le\operatorname{index}(\sim)<\infty\). (3) \(\implies\) (1): Construct \(\mathcal{A}_L=(\Sigma^*/{\sim_L}, \Sigma, \delta_L, [\varepsilon]_L, F_L)\) where \(\delta_L([w]_L, a)=[wa]_L\) and \(F_L=\{[w]_L\mid w\in L\}\). Right-invariance ensures \(\delta_L\) is well-defined; compatibility ensures \(F_L\) is well-defined. Induction confirms \(\widehat{\delta}_L([\varepsilon]_L, w)=[w]_L\), so \(L(\mathcal{A}_L)=L\).`,
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
          title: "State fibers: DFAs induce finite right-invariant congruences",
          exposition: String.raw`Suppose \(L\) is recognized by a DFA \(\mathcal{A} = (Q, \Sigma, \delta, q_0, F)\). Define the relation \(\sim_{\mathcal{A}}\) on \(\Sigma^*\) by \(x \sim_{\mathcal{A}} y \iff \widehat{\delta}(q_0, x) = \widehat{\delta}(q_0, y)\). This partitions \(\Sigma^*\) into at most \(|Q|\) equivalence classes (the fibers of \(\widehat{\delta}(q_0, \cdot)\)). It is right-invariant because appending any suffix \(z\) gives \(\widehat{\delta}(q_0, xz) = \widehat{\delta}(\widehat{\delta}(q_0, x), z) = \widehat{\delta}(\widehat{\delta}(q_0, y), z) = \widehat{\delta}(q_0, yz)\). It is compatible with \(L\) because \(x \in L \iff \widehat{\delta}(q_0, x) \in F \iff \widehat{\delta}(q_0, y) \in F \iff y \in L\).`,
          question: "Why does the relation x \u223c_A y \u21d4 \u03b4\u0302(q_0, x) = \u03b4\u0302(q_0, y) satisfy right-invariance: x \u223c_A y \u21d2 xz \u223c_A yz?",
          choices: [
            {
              text: String.raw`Because the extended transition function is compositional: \(\widehat{\delta}(q_0, xz) = \widehat{\delta}(\widehat{\delta}(q_0, x), z)\); identical intermediate states guarantee identical future trajectories on any suffix \(z\).`,
              correct: true,
              feedback: String.raw`Correct. A DFA is memoryless beyond its current state: if two words reach identical states, appending identical suffixes executes identical transition sequences.`
            },
            {
              text: String.raw`Because the transition function of a DFA must be an injective homomorphism.`,
              correct: false,
              causalFailure: String.raw`Transition functions are not injective; multiple distinct words frequently map to the same state (that is why equivalence classes exist).`
            },
            {
              text: String.raw`Because right-invariance only holds when the language is prefix-free.`,
              correct: false,
              causalFailure: String.raw`Right-invariance holds for every DFA state relation on any language, regardless of prefix properties.`
            }
          ],
          hint: "Evaluate \u03b4\u0302(q_0, xz) using the definition of extended transition functions: how does it depend on \u03b4\u0302(q_0, x)?",
          formal: String.raw`\(x\sim_{\mathcal{A}} y \implies \widehat{\delta}(q_0,xz)=\widehat{\delta}(\widehat{\delta}(q_0,x),z)=\widehat{\delta}(\widehat{\delta}(q_0,y),z)=\widehat{\delta}(q_0,yz)\implies xz\sim_{\mathcal{A}} yz\). Also \(\operatorname{index}(\sim_{\mathcal{A}})\le |Q|<\infty\).`,
          preview: V(["regular"], [], { dimNodes: ["mn", "quotient"] }),
          reveal: V(["regular", "relation"], ["one-two"], { goodNodes: ["relation"], dimNodes: ["mn", "quotient"] }),
          previewNote: "A DFA compresses infinitely many prefixes into at most |Q| state fibers.",
          revealNote: "The state equivalence relation \u223c_A is right-invariant, compatible, and finite-index."
        },
        {
          label: "(2) \u21d2 (3)",
          title: "Refinement: The canonical relation \u223c_L is the coarsest grouping",
          exposition: String.raw`Let \(\sim\) be any equivalence relation of finite index that is right-invariant and compatible with \(L\). Suppose \(x \sim y\). By right-invariance, \(xz \sim yz\) holds for every future continuation \(z \in \Sigma^*\). By compatibility with \(L\), \(xz \in L \iff yz \in L\). But this condition (\(\forall z,\; xz \in L \iff yz \in L\)) is the exact definition of the canonical Nerode relation \(x \sim_L y\). Thus \(x \sim y \implies x \sim_L y\), meaning \(\sim\) is a mathematical refinement of \(\sim_L\). Consequently, each \(\sim_L\)-class is a union of \(\sim\)-classes, proving \(\operatorname{index}(\sim_L) \le \operatorname{index}(\sim) < \infty\).`,
          question: "Why does any finite-index right-invariant compatible relation \u223c necessarily refine \u223c_L (\u223c \u2286 \u223c_L)?",
          choices: [
            {
              text: String.raw`Right-invariance propagates \(x \sim y\) to all suffixes (\(xz \sim yz\)), and compatibility ensures they share acceptance (\(xz \in L \iff yz \in L\)), which is precisely the definition of \(\sim_L\).`,
              correct: true,
              feedback: String.raw`Precisely. Any valid state grouping cannot separate words unless they have distinguishable futures. Therefore, \(\sim_L\) is the coarsest possible right-invariant compatible equivalence.`
            },
            {
              text: String.raw`Because \(\sim_L\) is defined as the intersection of all equivalence relations on \(\Sigma^*\).`,
              correct: false,
              causalFailure: String.raw`\(\sim_L\) is not an intersection of all relations; it is defined specifically via distinguishing suffixes w.r.t. \(L\).`
            },
            {
              text: String.raw`Because all equivalence relations of finite index are isomorphic to each other.`,
              correct: false,
              causalFailure: String.raw`Relations of identical or finite index can have entirely different partitions and structural properties.`
            }
          ],
          hint: "Test the definition: to show x \u223c_L y, you must prove that for all z, xz \u2208 L \u21d4 yz \u2208 L.",
          formal: String.raw`\(x\sim y \implies \forall z,\; xz\sim yz \implies \forall z,\; (xz\in L \iff yz\in L) \implies x\sim_L y\). Thus \(\sim\) refines \(\sim_L\) and \(\operatorname{index}(\sim_L)\le\operatorname{index}(\sim)<\infty\).`,
          preview: V(["relation"], [], { dimNodes: ["regular", "quotient"] }),
          reveal: V(["relation", "mn"], ["two-three"], { goodNodes: ["mn"], dimNodes: ["regular", "quotient"] }),
          previewNote: "A valid grouping cannot merge words with distinguishable futures.",
          revealNote: "\u223c_L is the coarsest valid congruence; its index is bounded by \operatorname{index}(\u223c) < \u221e."
        },
        {
          label: "(3) \u21d2 (1)",
          title: "Quotient DFA: \u03a3* / \u223cL constitutes the minimal automaton",
          exposition: String.raw`Assume \(\operatorname{index}(\sim_L) = k < \infty\). We construct the canonical quotient automaton \(\mathcal{A}_L = (Q_L, \Sigma, \delta_L, q_{0,L}, F_L)\) where: \(Q_L = \Sigma^*/{\sim_L}\); the initial state is \(q_{0,L} = [\varepsilon]_L\); \(\delta_L([w]_L, a) = [wa]_L\); and \(F_L = \{ [w]_L \mid w \in L \}\). Right-invariance ensures that \(\delta_L\) is well-defined: if \(w \sim_L w'\), then \(wa \sim_L w'a\), so \([wa]_L = [w'a]_L\) regardless of chosen representative. Compatibility ensures \(F_L\) is well-defined. Induction confirms \(\widehat{\delta}_L([\varepsilon]_L, w) = [w]_L\), proving \(w \in L(\mathcal{A}_L) \iff [w]_L \in F_L \iff w \in L\).`,
          question: "Why is the transition function \u03b4_L([w]_L, a) = [wa]_L guaranteed to be mathematically well-defined?",
          choices: [
            {
              text: String.raw`Because \(\sim_L\) is right-invariant: if \(w \sim_L w'\), then \(wa \sim_L w'a\), meaning \([wa]_L = [w'a]_L\) independently of which representative is selected from \([w]_L\).`,
              correct: true,
              feedback: String.raw`Correct. Well-definedness on quotient sets requires that the operation does not depend on representative choice: right-invariance (\(w \sim_L w' \implies wa \sim_L w'a\)) is precisely the algebraic condition ensuring this.`
            },
            {
              text: String.raw`Because the language \(L\) is guaranteed to contain the empty word \(\varepsilon\).`,
              correct: false,
              causalFailure: String.raw`Whether \(\varepsilon \in L\) only affects whether \([\varepsilon]_L \in F_L\); it has no bearing on the well-definedness of transitions.`
            },
            {
              text: String.raw`Because \(\delta_L\) is constructed using a topological sorting of the equivalence classes.`,
              correct: false,
              causalFailure: String.raw`Equivalence classes in automata frequently contain directed cycles; topological sorting is impossible in cyclic graphs.`
            }
          ],
          hint: "Recall the definition of a well-defined function on equivalence classes: if [w] = [w'], must [wa] = [w'a]?",
          formal: String.raw`\(w\sim_L w' \implies \forall z,\; (waz\in L \iff w'az\in L) \implies wa\sim_L w'a \implies [wa]_L=[w'a]_L\). Thus \(\delta_L\) is well-defined and \(|Q_L|=\operatorname{index}(\sim_L)\).`,
          preview: V(["mn"], [], { dimNodes: ["relation"] }),
          reveal: V(["mn", "quotient", "regular"], ["mn-quotient", "quotient-regular", "three-one"], { goodNodes: ["quotient", "regular"], dimNodes: ["relation"] }),
          previewNote: "Equivalence classes [w]_L of indistinguishable futures form the candidate state set.",
          revealNote: "The quotient DFA is well-defined, minimal, and recognizes L. The cycle closes."
        }
      ],
      previous: { label: "Small model property", href: "/proofs/chapter-02/small-model-property.html" },
      next: { label: "\u03c9-regular closure", href: "/proofs/chapter-03/omega-closure.html" }
    },

    "omega-closure": {
      slug: "omega-closure",
      chapter: 3,
      title: "Basic \u03c9-regular closure",
      theorem: String.raw`The class of \(\omega\)-regular languages is closed under \(\omega\)-power (\(V^\omega\)), finite-prefix concatenation (\(V \cdot L\)), union (\(L_1 \cup L_2\)), and intersection (\(L_1 \cap L_2\)).`,
      intro: "Non-deterministic Büchi Automata (NBAs) process infinite words \(\alpha \in \Sigma^\omega\), accepting \(\alpha\) if there exists an infinite execution run \(\rho\) that visits the final state set \(F\) infinitely often: \(\operatorname{Inf}(\rho) \cap F \neq \emptyset\). While union and concatenation extend naturally from finite words via non-deterministic branching, intersection requires a new synchronization mechanism: the two component automata may fulfill their Büchi acceptance conditions at disjoint, desynchronized time steps.",
      application: "In reactive system verification, liveness properties ('every request is eventually serviced') and fairness constraints ('a process is scheduled infinitely often') are combined via intersection. Büchi intersection allows forming the joint verification automaton \(\mathcal{M} \times \mathcal{A}_{\neg \varphi}\).",
      strategy: "For \(V^\omega\) where \(V \subseteq \Sigma^+\) is regular, construct an automaton that non-deterministically restarts at \(q_0\) through an accepting marker whenever a \(V\)-final state is entered. For \(V \cdot L\) and \(L_1 \cup L_2\), use non-deterministic handoff and initial choice. For intersection \(L_1 \cap L_2\), augment the synchronous product with a 2-phase controller on \(Q_1 \times Q_2 \times \{1, 2\}\) that enforces alternating visits to \(F_1\) and \(F_2\).",
      invariant: String.raw`The composite run visits accepting state \(Q_1 \times F_2 \times \{2\}\) infinitely often iff both component runs satisfy \(\operatorname{Inf}(\rho_1) \cap F_1 \neq \emptyset\) and \(\operatorname{Inf}(\rho_2) \cap F_2 \neq \emptyset\).`,
      synthesis: String.raw`Let \(V\subseteq\Sigma^+\) and \(L, L_1, L_2\subseteq\Sigma^\omega\) be \(\omega\)-regular. For \(V^\omega\), add non-deterministic transitions from \(F_V\) back to \(q_{0,V}\) through a designated accepting marker; visiting this marker infinitely often certifies an infinite sequence of completed \(V\)-blocks. For \(V\cdot L\), simulate \(V\) and non-deterministically transition to an NBA for \(L\) when reaching \(F_V\). Union is an initial non-deterministic choice. For intersection, define \(\mathcal{A}_{1\cap 2}\) on \(Q_1\times Q_2\times\{1,2\}\). In phase 1, the machine waits for component 1 to hit \(F_1\), then switches to phase 2; in phase 2, it waits for component 2 to hit \(F_2\), transitions to the accepting set \(Q_1\times F_2\times\{2\}\), and resets to phase 1. The accepting set recurs infinitely often iff both runs visit their respective final sets infinitely often. Thus \(\omega\text{-}\mathrm{REG}\) is closed under all four operations.`,
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
          label: "V\u03c9 power",
          title: "Synthesizing V\u03c9: Translating block completions into recurrent B\u00fcchi visits",
          exposition: String.raw`Let \(V \subseteq \Sigma^+\) be a regular language with \(V \cap \{\varepsilon\} = \emptyset\). An infinite word \(\alpha \in \Sigma^\omega\) belongs to \(V^\omega\) iff it can be factored into an infinite sequence of non-empty words: \(\alpha = v_1 v_2 v_3 \cdots\) where each \(v_i \in V\). The NBA simulates an NFA for \(V\). Whenever a final state \(f \in F_V\) is reached, the automaton non-deterministically branches back to the start state \(q_{0,V}\) through a designated accepting transition or marker. Visiting this marker infinitely often certifies that infinitely many complete, non-empty \(V\)-blocks have been consumed.`,
          question: "Why must the block language V satisfy V \u2229 {\u03b5} = \u2205 (or have \u03b5 excluded) when defining V\u03c9?",
          choices: [
            {
              text: String.raw`If \(\varepsilon \in V\), an NBA could execute an infinite loop of instantaneous \(\varepsilon\)-restarts without consuming any input symbols, falsely accepting words with finite progress.`,
              correct: true,
              feedback: String.raw`Precisely. If empty blocks were allowed, the Büchi condition could be satisfied by stuttering on \(\varepsilon\) at a single position, violating the requirement that an \(\omega\)-word must advance indefinitely.`
            },
            {
              text: String.raw`Because the empty word cannot be recognized by any finite automaton.`,
              correct: false,
              causalFailure: String.raw`The empty word \(\varepsilon\) is regular and trivially recognized by making the initial state accepting.`
            },
            {
              text: String.raw`Because \(\omega\)-power is only defined over finite alphabets containing at least two symbols.`,
              correct: false,
              causalFailure: String.raw`\(\omega\)-power is well-defined over unary alphabets (e.g. \(\{a\}^\omega = \{a^\omega\}\)).`
            }
          ],
          hint: "What would happen if an automaton took infinitely many restart transitions without consuming any input letters?",
          formal: String.raw`For \(V\subseteq\Sigma^+\), \(\alpha\in V^\omega \iff \alpha=v_1 v_2 \cdots\) with \(v_i\in V\). An NBA with restart transitions through \(F'=\{q_0\}\) accepts \(\alpha\) iff \(q_0\) is visited infinitely often.`
          ,
          preview: V(["omega"], [], { dimNodes: ["phase1", "phase2", "accept"] }),
          reveal: V(["omega", "power"], ["power-e"], { goodNodes: ["power"], dimNodes: ["phase1", "phase2", "accept"] }),
          previewNote: "V\u03c9 represents an infinite sequence of finite, non-empty blocks from V.",
          revealNote: "Recurring visits to the accepting restart marker certify infinitely many completed blocks."
        },
        {
          label: "Concat and union",
          title: "Prefix concatenation V \u00b7 L and Union L_1 \u222a L_2",
          exposition: String.raw`Concatenation of a regular finite-word language \(V \subseteq \Sigma^*\) with an \(\omega\)-regular language \(L \subseteq \Sigma^\omega\) requires a single existential transition point: the automaton runs in \(V\)-mode until non-deterministically deciding that the finite prefix has ended at state \(f \in F_V\), at which point it jumps to the initial state of the NBA for \(L\). Union \(L_1 \cup L_2\) similarly branches non-deterministically at \(t = 0\) to choose between simulating \(\mathcal{A}_1\) or \(\mathcal{A}_2\). In both cases, non-determinism resolves the finite existential boundary.`,
          question: "Why do concatenation V \u00b7 L and union L_1 \u222a L_2 introduce zero synchronization difficulties compared to intersection?",
          choices: [
            {
              text: String.raw`Both operations resolve their structural choice at a single finite instant (at \(t = 0\) for \(\cup\), and at the end of the \(V\)-prefix for \(\cdot\)), after which the automaton runs inside a single NBA without coordinating concurrent conditions.`,
              correct: true,
              feedback: String.raw`Correct. Union and concatenation require only a one-time existential routing step; once inside the target NBA, standard single-set Büchi acceptance governs the infinite run.`
            },
            {
              text: String.raw`Because deterministic Büchi automata are closed under all Boolean operations.`,
              correct: false,
              causalFailure: String.raw`Deterministic Büchi Automata (DBAs) are strictly less expressive than NBAs and are NOT closed under union or complementation.`
            },
            {
              text: String.raw`Because concatenation with an infinite word always yields an empty language.`,
              correct: false,
              causalFailure: String.raw`Concatenation \(V \cdot L\) produces non-empty \(\omega\)-words whenever \(V\) and \(L\) are non-empty.`
            }
          ],
          hint: "How many times does the automaton need to decide between the two components in V \u00b7 L or L_1 \u222a L_2?",
          formal: String.raw`Union uses a new start state branching into \(q_{0,1}\) and \(q_{0,2}\). Concatenation links \(F_V\) to \(q_{0,L}\) via \(\varepsilon\)-transitions. Both preserve \(\omega\)-regularity.`,
          preview: V(["omega"], [], { dimNodes: ["phase1", "phase2", "accept"] }),
          reveal: V(["omega", "concat", "union"], ["concat-e", "union-e"], { goodNodes: ["concat", "union"], dimNodes: ["phase1", "phase2", "accept"] }),
          previewNote: "Both operations use a single non-deterministic boundary choice.",
          revealNote: "After the finite boundary, execution proceeds under standard Büchi semantics."
        },
        {
          label: "Intersection anomaly",
          title: "The desynchronization anomaly: Why F_1 \u00d7 F_2 fails for B\u00fcchi intersection",
          exposition: String.raw`In finite automata, the product automaton accepts in \(F_1 \times F_2\). For Büchi automata, setting \(F' = F_1 \times F_2\) is fundamentally flawed. Consider two NBAs on \(\Sigma^\omega\): \(\mathcal{A}_1\) visits \(F_1\) on every even position (\(t \in \{0, 2, 4, \dots\}\)), while \(\mathcal{A}_2\) visits \(F_2\) on every odd position (\(t \in \{1, 3, 5, \dots\}\)). Both individual runs satisfy the Büchi acceptance condition: \(\operatorname{Inf}(\rho_1) \cap F_1 \neq \emptyset\) and \(\operatorname{Inf}(\rho_2) \cap F_2 \neq \emptyset\). However, they NEVER enter final states at the same time: \((p_t, q_t) \notin F_1 \times F_2\) for all \(t\). A naive Cartesian product would reject this valid word.`,
          question: "Why is the naive acceptance condition F' = F_1 \u00d7 F_2 unsound for B\u00fcchi intersection?",
          choices: [
            {
              text: String.raw`Büchi acceptance requires that visits to \(F_1\) and \(F_2\) recur infinitely often individually; requiring simultaneous visits (\(F_1 \times F_2\)) erroneously rejects runs whose accepting visits are interleaved or desynchronized.`,
              correct: true,
              feedback: String.raw`Exactly. Two liveness properties may be satisfied asynchronously; forcing them to occur at identical time steps conflates asynchronous recurrence with synchronous lock-step coincidence.`
            },
            {
              text: String.raw`Because Cartesian products of finite sets can produce infinite state spaces.`,
              correct: false,
              causalFailure: String.raw`The Cartesian product of two finite sets \(Q_1 \times Q_2\) is strictly finite: \(|Q_1 \times Q_2| = |Q_1| \cdot |Q_2|\).`
            },
            {
              text: String.raw`Because Büchi automata cannot have more than one final state.`,
              correct: false,
              causalFailure: String.raw`Büchi automata can have arbitrarily many final states in \(F \subseteq Q\).`
            }
          ],
          hint: "Consider: does 'infinitely often p' AND 'infinitely often q' imply 'infinitely often (p AND q simultaneously)'?",
          formal: String.raw`\(\operatorname{Inf}(\rho_1)\cap F_1\neq\emptyset \land \operatorname{Inf}(\rho_2)\cap F_2\neq\emptyset \;\not\implies\; \operatorname{Inf}((\rho_1,\rho_2))\cap(F_1\times F_2)\neq\emptyset\). Synchronous coincidence is too strict.`,
          preview: V(["phase1", "phase2"], [], { dimNodes: ["power", "concat", "union"] }),
          reveal: V(["phase1", "phase2"], [], { badNodes: ["accept"], dimNodes: ["power", "concat", "union"] }),
          previewNote: "Component runs may satisfy their Büchi conditions at alternating, desynchronized steps.",
          revealNote: "Simultaneous F1 \u00d7 F2 acceptance fails to detect asynchronously recurring visits."
        },
        {
          label: "Phase controller",
          title: "The 2-track alternating phase controller for B\u00fcchi intersection",
          exposition: String.raw`To solve the desynchronization problem, we augment the product state space with a discrete phase bit: \(Q' = Q_1 \times Q_2 \times \{1, 2\}\). The initial state is \((q_{0,1}, q_{0,2}, 1)\). In phase 1, the automaton waits for component 1 to enter a final state \(p \in F_1\); upon doing so, it transitions to phase 2. In phase 2, it waits for component 2 to enter a final state \(q \in F_2\); upon doing so, it visits the designated accepting set \(F' = Q_1 \times F_2 \times \{2\}\) and resets back to phase 1. Visiting \(F'\) infinitely often guarantees that an infinite sequence of completed phase 1 \(\to\) phase 2 rounds occurred, which is mathematically equivalent to both \(F_1\) and \(F_2\) recurring infinitely often.`,
          question: "Why does infinite recurrence of the phase-2 accepting marker prove that both component conditions recur infinitely often?",
          choices: [
            {
              text: String.raw`Because resetting the phase controller requires witnessing a visit to \(F_1\) (to advance from phase 1 to 2) followed by a visit to \(F_2\) (to complete phase 2 and trigger the marker); repeating this cycle infinitely often certifies infinite visits to both.`,
              correct: true,
              feedback: String.raw`Correct. The phase controller acts as a two-stage sequential latch: completing a cycle requires discharging the first liveness obligation, then discharging the second. Thus marker recurrence \(\iff\) both obligations recur.`
            },
            {
              text: String.raw`Because phase 2 can only be entered if the input word is periodic.`,
              correct: false,
              causalFailure: String.raw`The phase controller operates on arbitrary \(\omega\)-words, periodic or non-periodic.`
            },
            {
              text: String.raw`Because the phase controller determinizes the resulting product automaton.`,
              correct: false,
              causalFailure: String.raw`The product of two NBAs remains non-deterministic; the phase bit merely coordinates the acceptance condition.`
            }
          ],
          hint: "Trace the phase transitions: 1 -[hit F1]-> 2 -[hit F2]-> 1. Can you visit F' without visiting F1 first?",
          formal: String.raw`Define \(F'=Q_1\times F_2\times\{2\}\). A run \(\rho\) visits \(F'\) infinitely often \(\iff\) \(\operatorname{Inf}(\rho_1)\cap F_1\neq\emptyset\) and \(\operatorname{Inf}(\rho_2)\cap F_2\neq\emptyset\). Hence \(L(\mathcal{A}_{1\cap 2})=L_1\cap L_2\).`,
          preview: V(["phase1"], [], { dimNodes: ["power", "concat", "union"] }),
          reveal: V(["phase1", "accept", "phase2"], ["f1", "f2", "reset"], { goodNodes: ["accept"], dimNodes: ["power", "concat", "union"] }),
          previewNote: "Phase 1 tracks progress toward F1; upon arrival, it hands off to Phase 2.",
          revealNote: "Phase 2 waits for F2, marks cycle completion in F', and resets. Alternation captures intersection."
        }
      ],
      previous: { label: "Myhill\u2013Nerode", href: "/proofs/chapter-02/myhill-nerode.html" },
      next: { label: "B\u00fcchi\u2013expression equivalence", href: "/proofs/chapter-03/buchi-expression-equivalence.html" }
    },

    "buchi-expression-equivalence": {
      slug: "buchi-expression-equivalence",
      chapter: 3,
      title: "B\u00fcchi\u2013expression equivalence",
      theorem: String.raw`An \(\omega\)-language \(L \subseteq \Sigma^\omega\) is recognized by a Non-deterministic Büchi Automaton (NBA) if and only if it is denoted by an \(\omega\)-regular expression of the form \(\bigcup_{i=1}^k U_i V_i^\omega\), where \(U_i, V_i \subseteq \Sigma^*\) are regular languages with \(V_i \cap \{\varepsilon\} = \emptyset\).`,
      intro: "Büchi's Theorem on \(\omega\)-Regular Expressions characterizes the operational power of Büchi automata via algebraic syntax. It proves that every Büchi-recognizable language corresponds to a finite union of terms \(U V^\omega\) (a finite regular prefix \(U\) followed by an infinite concatenation of non-empty regular blocks from \(V\)). The proof hinges on the geometric 'lasso' decomposition of accepting runs: any infinite run visiting a finite set \(F\) infinitely often must revisit some designated state \(f \in F\) repeatedly.",
      application: "In model checking with LTL (Linear Temporal Logic), system counterexamples are reported as lasso executions: an initialization trace followed by an infinitely repeating loop. Nested Depth-First Search (NDFS) and Tarjan's SCC algorithm detect accepting Büchi runs by searching for these exact lasso structures.",
      strategy: "Direction 1 (Expression \(\to\) NBA): Compile each term \(U V^\omega\) by composing an NFA for \(U\) with an accepting restart loop for \(V^\omega\), and take the initial union across all terms. Direction 2 (NBA \(\to\) Expression): Given NBA \(\mathcal{A}\), every accepting run \(\rho\) satisfies \(\operatorname{Inf}(\rho) \cap F \neq \emptyset\). By Dirichlet's Principle, at least one state \(f \in F\) is visited infinitely often. Decompose the run into a prefix in \(W_{q_0, f}\) and infinite non-empty loops in \(W_{f, f} \setminus \{\varepsilon\}\). Unioning across all \(f \in F\) completes the equivalence.",
      invariant: String.raw`Every accepting run decomposes into \(q_0 \xrightarrow{u} f \xrightarrow{v_1} f \xrightarrow{v_2} f \cdots\) with \(u \in W_{q_0, f}\) and \(v_i \in W_{f, f} \setminus \{\varepsilon\}\).`,
      synthesis: String.raw`Every \(\omega\)-regular expression is a finite union of terms \(UV^\omega\) with regular \(U\) and \(V\subseteq\Sigma^+\). For one term, an NBA simulates \(U\), non-deterministically switches to \(V\), and restarts \(V\) through an accepting marker upon reaching \(F_V\); this marker recurs infinitely often iff the input word lies in \(UV^\omega\). Conversely, let \(\mathcal{A}\) be an NBA. Let \(W_{s,s'}\) denote the regular language of finite words driving \(\mathcal{A}\) from state \(s\) to \(s'\). Every accepting run visits \(F\) infinitely often; since \(F\) is finite, there exists at least one recurrent state \(f\in F\) visited infinitely often. Slicing the run at successive occurrences of \(f\) yields a prefix in \(W_{q_0,f}\) followed by an infinite sequence of non-empty loop factors in \(W_{f,f}\setminus\{\varepsilon\}\). Hence \(L(\mathcal{A})=\bigcup_{f\in F}W_{q_0,f}(W_{f,f}\setminus\{\varepsilon\})^\omega\), an \(\omega\)-regular expression.`,
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
          title: "Compiling UV\u03c9: Prefix simulation followed by recurrent block completions",
          exposition: String.raw`A term \(U V^\omega\) represents all words \(\alpha \in \Sigma^\omega\) that can be factored as \(\alpha = u v_1 v_2 v_3 \cdots\) where \(u \in U\) and each \(v_i \in V \subseteq \Sigma^+\). To construct an equivalent NBA, we simulate an NFA for \(U\) until reaching a state in \(F_U\), then non-deterministically transition to an NBA for \(V^\omega\). The \(V^\omega\) automaton runs an NFA for \(V\), restarting at \(q_{0,V}\) through a designated accepting marker state whenever a state in \(F_V\) is visited. An infinite run visits this marker infinitely often iff it consumes infinitely many non-empty \(V\)-blocks.`,
          question: "How does the NBA construction ensure that words in UV\u03c9 satisfy the B\u00fcchi acceptance condition \u221e-often?",
          choices: [
            {
              text: String.raw`Each completion of a \(V\)-block passes through an accepting restart marker; completing infinitely many consecutive \(V\)-blocks forces the marker to be visited infinitely often.`,
              correct: true,
              feedback: String.raw`Correct. The accepting state is placed on the block-boundary reset transitions: visiting the marker infinitely often certifies an infinite sequence of completed \(V\)-blocks.`
            },
            {
              text: String.raw`By requiring every state in the \(U\)-automaton to be accepting.`,
              correct: false,
              causalFailure: String.raw`States in \(U\) are traversed only during the finite prefix phase; making them accepting would not capture infinite liveness and could accept words with finite \(U\)-prefixes that halt.`
            },
            {
              text: String.raw`By determinizing the \(V\)-automaton using the subset construction.`,
              correct: false,
              causalFailure: String.raw`Determinization is not necessary and does not generally work for Büchi automata (DBAs are strictly less expressive than NBAs).`
            }
          ],
          hint: "Where must the accepting marker be located to certify an infinite progression of V-blocks?",
          formal: String.raw`An NBA for \(UV^\omega\) chains \(\mathcal{A}_U\) to an accepting restart loop on \(\mathcal{A}_V\). The Büchi acceptance condition \(\operatorname{Inf}(\rho)\cap F\neq\emptyset\) captures \(\alpha\in UV^\omega\).`,
          preview: V(["expr"], [], { dimNodes: ["union", "loop1", "loop2"] }),
          reveal: V(["expr", "q0", "f", "loop1"], ["expr-run", "prefix", "loop-in", "loop-out"], { goodNodes: ["f"], dimNodes: ["union", "loop2"] }),
          previewNote: "UV\u03c9: a finite prefix phase U, then an infinite recurring loop phase V.",
          revealNote: "The NBA marks each completed V-block; infinite recurrence yields Büchi acceptance."
        },
        {
          label: "Automaton \u2192 Expr",
          title: "Dirichlet's Principle: Isolating a recurrent final state f \u2208 F",
          exposition: String.raw`Let \(\mathcal{A} = (Q, \Sigma, \Delta, q_0, F)\) be an NBA and let \(\rho \in Q^\omega\) be an accepting run on \(\alpha \in L(\mathcal{A})\). By definition of Büchi acceptance, the set of states occurring infinitely often in \(\rho\), denoted \(\operatorname{Inf}(\rho)\), intersects \(F\): \(\operatorname{Inf}(\rho) \cap F \neq \emptyset\). Because the set of final states \(F\) is finite, Dirichlet's Pigeonhole Principle guarantees that at least one individual state \(f \in F\) must appear infinitely often along \(\rho\). We fix this recurrent state \(f\).`,
          question: "Why does the finiteness of F guarantee the existence of a single state f \u2208 F visited infinitely often?",
          choices: [
            {
              text: String.raw`An infinite sequence of visits distributed across a finite set \(F\) must assign infinitely many visits to at least one element of \(F\) by Dirichlet's Pigeonhole Principle.`,
              correct: true,
              feedback: String.raw`Exactly. If every state in \(F\) were visited only finitely many times, the total number of visits to \(F\) would be finite, directly contradicting Büchi acceptance.`
            },
            {
              text: String.raw`Because every Büchi automaton is restricted to having exactly one final state: \(|F| = 1\).`,
              correct: false,
              causalFailure: String.raw`Büchi automata can have arbitrarily large final sets \(F \subseteq Q\); the argument holds for any finite cardinality \(|F|\).`
            },
            {
              text: String.raw`Because the transition graph of the automaton is topologically ordered.`,
              correct: false,
              causalFailure: String.raw`Topological ordering exists only in acyclic graphs; accepting Büchi runs inherently require directed cycles to visit states infinitely often.`
            }
          ],
          hint: "If each state f \u2208 F occurred only a finite number of times c_f, what would be the sum \u2211 c_f?",
          formal: String.raw`\(\operatorname{Inf}(\rho)\cap F\neq\emptyset \land |F|<\infty \implies \exists f\in F \text{ s.t. } f\in\operatorname{Inf}(\rho)\). At least one specific final state recurs forever.`,
          preview: V(["q0", "f"], ["prefix"], { dimNodes: ["expr", "union", "loop1", "loop2"] }),
          reveal: V(["f"], [], { goodNodes: ["f"], dimNodes: ["expr", "union", "q0", "loop1", "loop2"] }),
          previewNote: "The run visits F infinitely many times across potentially several states.",
          revealNote: "By pigeonhole, at least one designated state f \u2208 F recurs infinitely often."
        },
        {
          label: "Lasso decomposition",
          title: "Slicing the run: The lasso factorisation W_{q0, f} (W_{f, f} \\ {\u03b5})\u03c9",
          exposition: String.raw`Having isolated a recurrent final state \(f \in F\), we slice the infinite run \(\rho\) at its successive occurrences: \(q_0 \xrightarrow{u} f \xrightarrow{v_1} f \xrightarrow{v_2} f \xrightarrow{v_3} \cdots\). The prefix \(u\) drives the automaton from \(q_0\) to its first visit to \(f\), belonging to the regular path language \(W_{q_0, f}\). Each subsequent segment \(v_k\) loops from \(f\) back to \(f\), belonging to \(W_{f, f}\). To guarantee that the run makes strict progress along the infinite word \(\alpha\), each loop factor must consume at least one symbol: \(v_k \in W_{f, f} \setminus \{\varepsilon\}\).`,
          question: "Why must the loop language explicitly exclude the empty word: W_{f, f} \\ {\u03b5}?",
          choices: [
            {
              text: String.raw`Because each loop factor \(v_k\) must consume at least one symbol (\(|v_k| \ge 1\)) to advance along the infinite word; otherwise, an infinite sequence of \(\varepsilon\)-loops would stall progress.`,
              correct: true,
              feedback: String.raw`Precisely. An infinite run on word \(\alpha \in \Sigma^\omega\) must consume infinitely many input letters; allowing \(v_k = \varepsilon\) would allow stuttering infinitely often at a finite prefix.`
            },
            {
              text: String.raw`Because the empty word \(\varepsilon\) is not a regular language.`,
              correct: false,
              causalFailure: String.raw`The singleton language \(\{\varepsilon\}\) is regular; it is excluded here strictly for dynamic progress reasons.`
            },
            {
              text: String.raw`Because state \(f\) cannot have an outgoing transition on any symbol.`,
              correct: false,
              causalFailure: String.raw`State \(f\) must have outgoing transitions to enable looping back to \(f\).`
            }
          ],
          hint: "What happens to the word length |v_1 v_2 ... v_k| if the factors v_k consume zero symbols?",
          formal: String.raw`\(u \in W_{q_0, f}\) and \(\forall k \ge 1,\; v_k \in W_{f, f} \setminus \{\varepsilon\} \implies \alpha = u v_1 v_2 \cdots \in W_{q_0, f}(W_{f, f}\setminus\{\varepsilon\})^\omega\).`,
          preview: V(["q0", "f"], ["prefix"], { dimNodes: ["expr", "union"] }),
          reveal: V(["q0", "f", "loop1", "loop2"], ["prefix", "loop-in", "loop-out", "repeat"], { goodNodes: ["f"], dimNodes: ["expr", "union"] }),
          previewNote: "Slice the run: one prefix to reach f, followed by recurrent cycles at f.",
          revealNote: "Lasso structure: u \u2208 W_{q0, f} followed by infinite non-empty loops v_k \u2208 W_{f, f} \\ {\u03b5}."
        },
        {
          label: "Finite union",
          title: "Covering all runs: L(A) = \u22c3_{f \in F} W_{q0, f} (W_{f, f} \\ {\u03b5})\u03c9",
          exposition: String.raw`Different accepting runs of \(\mathcal{A}\) may recur on different final states in \(F\). However, because \(F\) is finite, there are at most \(|F|\) candidate recurrent states. Taking the union of the lasso terms across all \(f \in F\) covers every conceivable accepting run: \(L(\mathcal{A}) = \bigcup_{f \in F} W_{q_0, f} (W_{f, f} \setminus \{\varepsilon\})^\omega\). By Kleene's theorem, each path language \(W_{q_0, f}\) and \(W_{f, f}\) is regular. Thus, \(L(\mathcal{A})\) is expressible as a finite union of \(\omega\)-regular terms, closing the equivalence.`,
          question: "Why does the expression \u22c3_{f \in F} W_{q0, f} (W_{f, f} \\ {\u03b5})\u03c9 qualify as an \u03c9-regular expression?",
          choices: [
            {
              text: String.raw`By Kleene's theorem, each path language \(W_{s, s'}\) is regular on finite words; since \(F\) is a finite set, the union is finite, yielding a valid \(\omega\)-regular expression.`,
              correct: true,
              feedback: String.raw`Correct. Each term \(U_f V_f^\omega\) comprises regular languages \(U_f = W_{q_0, f}\) and \(V_f = W_{f, f} \setminus \{\varepsilon\}\), and a finite union of such terms is by definition \(\omega\)-regular.`
            },
            {
              text: String.raw`Because every \(\omega\)-regular expression must contain at least \(2^{|Q|}\) terms.`,
              correct: false,
              causalFailure: String.raw`The expression contains at most \(|F| \le |Q|\) terms; exponential blowup is avoided here.`
            },
            {
              text: String.raw`Because the union operator over infinite words is only defined when \(F\) is a singleton.`,
              correct: false,
              causalFailure: String.raw`Set union over \(\Sigma^\omega\) is defined for any indexing set, finite or infinite.`
            }
          ],
          hint: "Check the definition of an \u03c9-regular expression: a finite union of terms U_i V_i^\u03c9 with regular U_i, V_i.",
          formal: String.raw`\(L(\mathcal{A}) = \bigcup_{f\in F} W_{q_0, f} (W_{f, f} \setminus \{\varepsilon\})^\omega\). Both inclusions hold, proving \(\mathcal{L}(\mathrm{NBA}) = \mathcal{L}(\omega\text{-}\mathrm{RegExp})\).`,
          preview: V(["f", "union"], ["run-union"], { dimNodes: ["loop1", "loop2"] }),
          reveal: V(["union", "expr"], ["union-expr"], { goodNodes: ["union", "expr"], dimNodes: ["q0", "f", "loop1", "loop2"] }),
          previewNote: "Each recurrent final state f \u2208 F contributes one term to the global expression.",
          revealNote: "The finite union over F covers all accepting runs: L(A) is an \u03c9-regular expression."
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
      theorem: String.raw`The complement \(\Sigma^\omega \setminus L\) of every Büchi-recognizable language \(L \subseteq \Sigma^\omega\) is Büchi-recognizable.`,
      intro: "Complementation of Büchi automata is one of the foundational results of automata theory over infinite words. Because Non-deterministic Büchi Automata (NBAs) strictly exceed Deterministic Büchi Automata (DBAs) in expressive power, complementation cannot be achieved by determinizing and swapping accepting states. Instead, Büchi's 1962 proof classifies finite words using a finite-index transition congruence \(\approx_{\mathcal{A}}\), partitions the infinite universe \(\Sigma^\omega\) into saturated product sets \(U V^\omega\), and constructs the complement as a finite union of rejected products.",
      application: "In temporal logic model checking, verifying whether a concurrent system satisfies a temporal specification \(\varphi\) requires constructing an automaton for the negated property \(\neg \varphi\). Büchi complementation guarantees that the negation of any \(\omega\)-regular specification remains algorithmically verifiable.",
      strategy: "Define the transition profile congruence \(\approx_{\mathcal{A}}\) on \(\Sigma^*\) tracking state reachability and acceptance visits. Form class products \(U V^\omega\) with idempotent factors \(V \cdot V \subseteq V\). Prove saturation: each product \(U V^\omega\) is either entirely contained in \(L(\mathcal{A})\) or entirely disjoint from \(L(\mathcal{A})\). Apply the Ramsey decomposition to prove universal coverage: \(\Sigma^\omega = \bigcup U V^\omega\). Deduce that \(\Sigma^\omega \setminus L(\mathcal{A}) = \bigcup \{ U V^\omega \mid U V^\omega \cap L(\mathcal{A}) = \emptyset \}\), which is \(\omega\)-regular as a finite union of \(\omega\)-regular terms.",
      invariant: String.raw`Every class product \(U V^\omega\) is saturated with respect to \(L(\mathcal{A})\), and the finite family of products covers \(\Sigma^\omega\).`,
      synthesis: String.raw`Fix an NBA \(\mathcal{A}=(Q,\Sigma,\Delta,q_0,F)\) recognizing \(L\). Define the relation \(\approx_{\mathcal{A}}\) on \(\Sigma^*\) by \(u\approx_{\mathcal{A}} v\) iff for all \(p,q\in Q\): (1) there is a path \(p\xrightarrow{u} q \iff p\xrightarrow{v} q\), and (2) there is a path \(p\xrightarrow{u} q\) visiting \(F\) iff there is a path \(p\xrightarrow{v} q\) visiting \(F\). This relation is a congruence of finite index \(\le 3^{|Q|^2}\). For class pairs \((U,V)\) with \(V\cdot V\subseteq V\), saturation proves that either \(UV^\omega \subseteq L\) or \(UV^\omega \cap L = \emptyset\). By Ramsey's theorem, every \(\alpha\in\Sigma^\omega\) belongs to at least one such product \(UV^\omega\). Therefore \(\Sigma^\omega\setminus L = \bigcup \{ UV^\omega \mid UV^\omega \cap L = \emptyset \}\). Since each \(U,V\) is regular, each \(UV^\omega\) is \(\omega\)-regular, and the finite union is \(\omega\)-regular.`,
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
          title: "The profile congruence \u2248_A: Capturing reachability and acceptance visits",
          exposition: String.raw`To analyze all infinite words uniformly, we classify finite words by the state transitions they induce in \(\mathcal{A} = (Q, \Sigma, \Delta, q_0, F)\). Define the relation \(\approx_{\mathcal{A}}\) on \(\Sigma^*\) by setting \(u \approx_{\mathcal{A}} v\) iff for every pair of states \(p, q \in Q\): (1) \(\mathcal{A}\) has a path \(p \xrightarrow{u} q \iff p \xrightarrow{v} q\), and (2) \(\mathcal{A}\) has a path \(p \xrightarrow{u} q\) that visits \(F \iff\) it has a path \(p \xrightarrow{v} q\) that visits \(F\). Each word is characterized by a transition matrix of size \(|Q| \times |Q|\) over the semiring \(\{0, 1, 2\}\) (no path, path without \(F\), path with \(F\)). This relation is a congruence of finite index at most \(3^{|Q|^2}\).`,
          question: "Why must the congruence \u2248_A track BOTH state reachability AND intermediate visits to F?",
          choices: [
            {
              text: String.raw`Because Büchi acceptance requires visiting \(F\) infinitely often; tracking reachability alone cannot determine whether looping between boundary states witnesses accepting states.`,
              correct: true,
              feedback: String.raw`Correct. Two words might connect the same boundary states \(p \to q\), but if one visits \(F\) and the other avoids \(F\), an infinite concatenation could accept with the former and reject with the latter.`
            },
            {
              text: String.raw`Because tracking \(F\)-visits is required to make the transition relation deterministic.`,
              correct: false,
              causalFailure: String.raw`The automaton \(\mathcal{A}\) is non-deterministic; the congruence \(\approx_{\mathcal{A}}\) abstracts transition behaviors without modifying automaton determinism.`
            },
            {
              text: String.raw`Because words that visit \(F\) must have strictly greater length than words that do not.`,
              correct: false,
              causalFailure: String.raw`Word length is completely decoupled from \(F\)-visitation; an atomic transition of length 1 can visit \(F\), while a long path of length 100 may avoid \(F\).`
            }
          ],
          hint: "Consider what determines Büchi acceptance: boundary state matching vs recurrent visits to F.",
          formal: String.raw`\(u\approx_{\mathcal{A}} v \iff \forall p,q\in Q,\; (p\xrightarrow{u} q \iff p\xrightarrow{v} q) \land (p\xrightarrow{u}_F q \iff p\xrightarrow{v}_F q)\). The index satisfies \(\operatorname{index}(\approx_{\mathcal{A}})\le 3^{|Q|^2}\).`,
          preview: V(["profiles"], [], { dimNodes: ["language", "complement", "union"] }),
          reveal: V(["profiles", "product1", "product2"], ["profiles-p1", "profiles-p2"], { goodNodes: ["profiles"], dimNodes: ["language", "complement", "union"] }),
          previewNote: "The automaton can observe only finitely many profile matrices over Q \u00d7 Q.",
          revealNote: "Each pair of \u2248_A classes (U, V) with V \u00b7 V \u2286 V generates a class product UV\u03c9."
        },
        {
          label: "Saturation",
          title: "Saturation: Class products UV\u03c9 are strictly all-or-nothing",
          exposition: String.raw`Let \(U, V \in \Sigma^* / {\approx_{\mathcal{A}}}\) with \(V \cdot V \subseteq V\). A class product \(U V^\omega\) contains all words of the form \(u v_1 v_2 v_3 \cdots\) where \(u \in U\) and each \(v_k \in V\). Saturation states that \(U V^\omega\) cannot be partially accepted: either \(U V^\omega \subseteq L(\mathcal{A})\) or \(U V^\omega \cap L(\mathcal{A}) = \emptyset\). Indeed, if one word \(\alpha \in U V^\omega\) admits an accepting run, replacing its blocks \(u, v_1, v_2, \ldots\) with any other elements \(u', v_1', v_2', \ldots\) from the same \(\approx_{\mathcal{A}}\)-classes preserves boundary states and \(F\)-visits, yielding an accepting run on \(\alpha'\).`,
          question: "If one word \u03b1 \u2208 UV\u03c9 is accepted by A, why does saturation force EVERY word in UV\u03c9 to be accepted?",
          choices: [
            {
              text: String.raw`Because all words in \(U\) share identical transition profiles, and all words in \(V\) share identical profiles; replacing blocks preserves boundary state connections and \(F\)-visitations along the infinite run.`,
              correct: true,
              feedback: String.raw`Exactly. The congruence \(\approx_{\mathcal{A}}\) preserves all observations observable by \(\mathcal{A}\); since every \(v_k' \in V\) replicates the exact state reachability and \(F\)-witnesses of \(v_k\), acceptance is invariant under block substitution.`
            },
            {
              text: String.raw`Because every class product \(U V^\omega\) contains exactly one unique infinite word.`,
              correct: false,
              causalFailure: String.raw`Class products \(U V^\omega\) are uncountably infinite sets of \(\omega\)-words whenever \(V\) contains multiple elements.`
            },
            {
              text: String.raw`Because saturation implies that the automaton \(\mathcal{A}\) accepts all infinite words \(\Sigma^\omega\).`,
              correct: false,
              causalFailure: String.raw`Saturation is local to each product \(U V^\omega\); it asserts that each product is wholly inside or wholly outside \(L(\mathcal{A})\), not that \(L(\mathcal{A}) = \Sigma^\omega\).`
            }
          ],
          hint: "What happens to the accepting run \u03c1 when you substitute block v_k with another word from the same \u2248_A-class?",
          formal: String.raw`\(\forall \alpha, \alpha' \in UV^\omega,\; \alpha\in L(\mathcal{A}) \iff \alpha'\in L(\mathcal{A})\). Hence \(UV^\omega \subseteq L(\mathcal{A})\) or \(UV^\omega \cap L(\mathcal{A}) = \emptyset\).`,
          preview: V(["product1"], [], { dimNodes: ["profiles", "union"] }),
          reveal: V(["product1", "language"], ["p1-l"], { goodNodes: ["product1", "language"], dimNodes: ["profiles", "union"] }),
          previewNote: "Start from an accepted word in class product UV\u03c9.",
          revealNote: "By profile substitution, all words in UV\u03c9 are accepted. The product is saturated."
        },
        {
          label: "Coverage",
          title: "Universal coverage via the Ramsey decomposition theorem",
          exposition: String.raw`Having established that each class product \(U V^\omega\) is saturated, we must prove that these products cover the entire space \(\Sigma^\omega\). This is precisely the guarantee of the Ramsey Decomposition Theorem: for every finite-index congruence \(\approx\) on \(\Sigma^*\) and every infinite word \(\alpha \in \Sigma^\omega\), there exist equivalence classes \(U, V \in \Sigma^* / \approx\) such that \(V \cdot V \subseteq V\) and \(\alpha \in U V^\omega\). Therefore, the family of saturated class products forms a total covering: \(\Sigma^\omega = \bigcup \{ U V^\omega \mid U, V \in \Sigma^* / {\approx_{\mathcal{A}}},\; V \cdot V \subseteq V \}\).`,
          question: "What essential guarantee does the Ramsey decomposition theorem provide for B\u00fcchi complementation?",
          choices: [
            {
              text: String.raw`Every infinite word \(\alpha \in \Sigma^\omega\) belongs to at least one product \(U V^\omega\) with \(V \cdot V \subseteq V\), ensuring that classifying products leaves no infinite words unclassified.`,
              correct: true,
              feedback: String.raw`Correct. Ramsey's theorem guarantees total coverage: every \(\alpha \in \Sigma^\omega\) is captured by some idempotent class product \(U V^\omega\), leaving zero gaps in \(\Sigma^\omega\).`
            },
            {
              text: String.raw`It guarantees that all Büchi automata can be complemented in polynomial time.`,
              correct: false,
              causalFailure: String.raw`Büchi complementation has an exponential lower bound \(2^{\Omega(n \log n)}\); Ramsey's theorem provides structural coverage, not polynomial complexity.`
            },
            {
              text: String.raw`It proves that every \(\omega\)-word is ultimately periodic.`,
              correct: false,
              causalFailure: String.raw`Arbitrary \(\omega\)-words need not be periodic; Ramsey decomposition proves they factor into class products of equivalent blocks, not identical letters.`
            }
          ],
          hint: "Does \u22c3 UV\u03c9 cover ALL words in \u03a3\u03c9, or only periodic words?",
          formal: String.raw`\(\forall \alpha \in \Sigma^\omega,\; \exists U, V \in \Sigma^* / {\approx_{\mathcal{A}}} \text{ s.t. } V\cdot V\subseteq V \land \alpha \in UV^\omega \implies \Sigma^\omega = \bigcup UV^\omega\).`,
          preview: V(["product1", "product2"], [], { dimNodes: ["profiles", "union"] }),
          reveal: V(["product1", "product2", "language", "complement"], ["p1-l", "p2-c"], { goodNodes: ["language", "complement"], dimNodes: ["profiles", "union"] }),
          previewNote: "Does the collection of class products cover every infinite word?",
          revealNote: "Yes: by Ramsey's theorem, every \u03b1 \u2208 \u03a3\u03c9 lies in some saturated product UV\u03c9."
        },
        {
          label: "Complement",
          title: "Synthesizing the complement as a finite union of rejected products",
          exposition: String.raw`Since the saturated products cover \(\Sigma^\omega\), and each product is wholly contained in \(L(\mathcal{A})\) or wholly disjoint from \(L(\mathcal{A})\), the complement \(\Sigma^\omega \setminus L(\mathcal{A})\) is precisely the union of all products disjoint from \(L(\mathcal{A})\): \(\Sigma^\omega \setminus L(\mathcal{A}) = \bigcup \{ U V^\omega \mid U V^\omega \cap L(\mathcal{A}) = \emptyset \}\). Because \(\approx_{\mathcal{A}}\) has finite index, there are only finitely many pairs \((U, V)\). By Myhill-Nerode, each class \(U, V\) is regular, so each term \(U V^\omega\) is \(\omega\)-regular. Since \(\omega\)-regular languages are closed under finite union, \(\Sigma^\omega \setminus L(\mathcal{A})\) is \(\omega\)-regular.`,
          question: "Why is the complement \u03a3\u03c9 \\ L(A) guaranteed to be \u03c9-regular?",
          choices: [
            {
              text: String.raw`It is a finite union of terms of the form \(U V^\omega\), where each \(U, V\) is regular, and \(\omega\)-regular languages are closed under finite union.`,
              correct: true,
              feedback: String.raw`Precisely. Finitely many class pairs \((U, V)\) produce finitely many rejected products; each \(U V^\omega\) is \(\omega\)-regular, and finite union preserves \(\omega\)-regularity.`
            },
            {
              text: String.raw`Because every non-deterministic Büchi automaton can be complemented by flipping final states.`,
              correct: false,
              causalFailure: String.raw`Flipping final states fails for NBAs because runs are non-deterministic and acceptance is based on infinite recurrence.`
            },
            {
              text: String.raw`Because the complement of any language over an infinite alphabet is trivially empty.`,
              correct: false,
              causalFailure: String.raw`The alphabet \(\Sigma\) is finite, and the complement language is generally non-empty.`
            }
          ],
          hint: "Count the number of rejected terms: is it finite? What form does each term take?",
          formal: String.raw`\(\Sigma^\omega\setminus L(\mathcal{A}) = \bigcup \{ UV^\omega \mid UV^\omega \cap L(\mathcal{A}) = \emptyset \}\). Finitely many pairs \((U, V)\) ensure the union is \(\omega\)-regular.`,
          preview: V(["complement"], [], { dimNodes: ["profiles", "language"] }),
          reveal: V(["complement", "union"], ["c-union"], { goodNodes: ["complement", "union"], dimNodes: ["profiles", "language", "product1", "product2"] }),
          previewNote: "The complement consists of all class products wholly outside L(A).",
          revealNote: "A finite union of \u03c9-regular class products is \u03c9-regular: complementation is closed."
        }
      ],
      previous: { label: "Ramsey decomposition", href: "/proofs/chapter-04/ramsey-decomposition.html" }
    }
  };
})();
