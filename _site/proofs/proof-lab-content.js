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
      strategy: String.raw`Formulate the inductive invariant that after reading any word w, the state reached by the DFA is precisely the set of states reachable in the NFA: \\(\\widehat{\\delta}_D(\\{q_0\\}, w) = \\widehat{\\Delta}(q_0, w)\\). Establish the base case at w = \\(\\varepsilon\\), prove the inductive step using the union transition \\(\\delta_D(S, a) = \\bigcup_{q \\in S} \\Delta(q, a)\\), and map acceptance via the existential condition \\(F_D = \\{S \\subseteq Q \\mid S \\cap F \\neq \\emptyset\\}\\).`,
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
          title: String.raw`Length |w| = 0: Initialization on the empty word \u03b5`,
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
      title: String.raw`\u03b5-removal`,
      theorem: String.raw`For every \(\varepsilon\)-NFA \(\mathcal{A} = (Q, \Sigma, \Delta, q_0, F)\) there exists an equivalent \(\varepsilon\)-free NFA \(\mathcal{A}' = (Q, \Sigma, \Delta', q_0, F')\) such that \(L(\mathcal{A}') = L(\mathcal{A})\).`,
      intro: String.raw`Non-deterministic finite automata with \(\varepsilon\)-transitions (\(\varepsilon\)-NFAs) permit instantaneous state changes without consuming input symbols. While \(\varepsilon\)-transitions provide modularity in structural constructions (such as Thompson's synthesis of regular expressions), they do not extend the class of regular languages. By computing the reflexive-transitive \(\varepsilon\)-closure \(\operatorname{ECl}(q)\) for each state and collapsing all composite path patterns of the form \(\varepsilon^* a \varepsilon^*\) into atomic transitions, silent moves are eliminated without altering observable language behavior.`,
      application: String.raw`In compositional model checking, modular specifications are linked by \(\varepsilon\)-handoffs between component automata. Removing \(\varepsilon\)-moves produces a streamlined state space and prevents unobservable stuttering cycles during state-space exploration.`,
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
          title: String.raw`Synthesizing \u0394': Compiling \u03b5* a \u03b5* paths into atomic symbol transitions`,
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
          title: String.raw`Closure idempotence: Preserving \u03b5-invariance across concatenation`,
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
          title: String.raw`Length |w| = 0: Reconciling the empty word \u03b5`,
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
      strategy: String.raw`Prove both directions constructively. Automaton \(\to\) Expression: formulate the McNaughton-Yamada path recurrence \(R_{ij}^{(k)} = R_{ij}^{(k-1)} \cup R_{ik}^{(k-1)}(R_{kk}^{(k-1)})^*R_{kj}^{(k-1)}\) indexed by permissible intermediate states. Expression \(\to\) Automaton: apply structural induction on expression syntax via Thompson's \(\varepsilon\)-NFA composition. Close the translation cycle via \(\varepsilon\)-removal and the subset construction.`,
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
          title: String.raw`Closing the equivalence cycle: \u22c3 R_{1f}^{(n)} = L(A)`,
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
      application: String.raw`In model checking, safety verification reduces to language containment: a system model \(\mathcal{M}\) complies with specification \(\mathcal{S}\) iff \(\mathcal{L}(\mathcal{M}) \subseteq \mathcal{L}(\mathcal{S})\), which is algorithmically decidable by checking emptiness of the product \(\mathcal{L}(\mathcal{M}) \cap \overline{\mathcal{L}(\mathcal{S})} = \emptyset\).`,
      strategy: String.raw`For regular operations (\(\cup, \cdot, {}^*\)), construct compositional \(\varepsilon\)-NFAs via Thompson's synthesis. For complementation, determinize and complete the automaton so every word admits a unique total run, then invert final states: \(F' = Q \setminus F\). For intersection, construct the synchronous Cartesian product automaton on \(Q_1 \times Q_2\) with accepting set \(F_1 \times F_2\).`,
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
      application: String.raw`In model checking and bounded verification, searching for safety counterexamples (error traces) can be strictly bounded by the system's state space size: if an \(n\)-state concurrent model contains an error trajectory, there exists a minimal counterexample trace of length at most \(n-1\).`,
      strategy: String.raw`Proof by contradiction using Dirichlet's Pigeonhole Principle. Assume \(L(\mathcal{A}) \neq \emptyset\) and fix an accepted word \(z\) of minimal length. Assume \(|z| \ge n\). The run visits \(|z| + 1 \ge n + 1\) states, forcing a duplicate state \(p_i = p_j\) with \(i < j\). Factor \(z = uvw\) and splice out the loop factor \(v\); determinism ensures the shortened word \(uw\) is accepted, contradicting the minimality of \(z\).`,
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
          title: String.raw`Fixing a minimal witness word z \u2208 L(A)`,
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
      title: String.raw`Myhill\u2013Nerode theorem`,
      theorem: String.raw`A formal language \(L \subseteq \Sigma^*\) is regular if and only if the Nerode right-congruence \(\sim_L\) has finite index: \(\operatorname{index}(\sim_L) < \infty\). Furthermore, \(\operatorname{index}(\sim_L)\) equals the number of states in the minimal DFA recognizing \(L\).`,
      intro: String.raw`The Myhill-Nerode Theorem provides the fundamental structural and algebraic characterization of regular languages. It establishes that the minimal memory necessary to recognize a language \(L\) corresponds precisely to distinguishing future continuations: two words \(x, y \in \Sigma^*\) are Nerode-equivalent (\(x \sim_L y\)) iff \(\forall z \in \Sigma^*,\; xz \in L \iff yz \in L\). The language is regular iff \(\sim_L\) has finitely many equivalence classes, which form the states of the unique minimal DFA.`,
      application: "In formal verification and model checking, state-space minimization via bisimulation quotienting relies directly on the Myhill-Nerode theorem. It also provides the definitive mathematical technique for proving non-regularity by constructing an infinite set of pairwise distinguishable prefixes.",
      strategy: String.raw`Prove the tripartite cycle of logical implications: (1) If \(L\) is regular, the state fibers of any recognizing DFA define a finite-index right-invariant equivalence compatible with \(L\). (2) Any such relation refines the canonical relation \(\sim_L\), forcing \(\operatorname{index}(\sim_L) < \infty\). (3) If \(\operatorname{index}(\sim_L) < \infty\), construct the canonical quotient DFA on \(\Sigma^*/{\sim_L}\) and prove well-definedness via right-invariance.`,
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
          title: String.raw`Refinement: The canonical relation \u223c_L is the coarsest grouping`,
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
          title: String.raw`Quotient DFA: \u03a3* / \u223cL constitutes the minimal automaton`,
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
      title: String.raw`Basic \u03c9-regular closure`,
      theorem: String.raw`The class of \(\omega\)-regular languages is closed under \(\omega\)-power (\(V^\omega\)), finite-prefix concatenation (\(V \cdot L\)), union (\(L_1 \cup L_2\)), and intersection (\(L_1 \cap L_2\)).`,
      intro: String.raw`Non-deterministic Büchi Automata (NBAs) process infinite words \(\alpha \in \Sigma^\omega\), accepting \(\alpha\) if there exists an infinite execution run \(\rho\) that visits the final state set \(F\) infinitely often: \(\operatorname{Inf}(\rho) \cap F \neq \emptyset\). While union and concatenation extend naturally from finite words via non-deterministic branching, intersection requires a new synchronization mechanism: the two component automata may fulfill their Büchi acceptance conditions at disjoint, desynchronized time steps.`,
      application: String.raw`In reactive system verification, liveness properties ('every request is eventually serviced') and fairness constraints ('a process is scheduled infinitely often') are combined via intersection. Büchi intersection allows forming the joint verification automaton \(\mathcal{M} \times \mathcal{A}_{\neg \varphi}\).`,
      strategy: String.raw`For \(V^\omega\) where \(V \subseteq \Sigma^+\) is regular, construct an automaton that non-deterministically restarts at \(q_0\) through an accepting marker whenever a \(V\)-final state is entered. For \(V \cdot L\) and \(L_1 \cup L_2\), use non-deterministic handoff and initial choice. For intersection \(L_1 \cap L_2\), augment the synchronous product with a 2-phase controller on \(Q_1 \times Q_2 \times \{1, 2\}\) that enforces alternating visits to \(F_1\) and \(F_2\).`,
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
          title: String.raw`Synthesizing V\u03c9: Translating block completions into recurrent B\u00fcchi visits`,
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
          title: String.raw`Prefix concatenation V \u00b7 L and Union L_1 \u222a L_2`,
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
          title: String.raw`The desynchronization anomaly: Why F_1 \u00d7 F_2 fails for B\u00fcchi intersection`,
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
          title: String.raw`The 2-track alternating phase controller for B\u00fcchi intersection`,
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
      title: String.raw`B\u00fcchi\u2013expression equivalence`,
      theorem: String.raw`An \(\omega\)-language \(L \subseteq \Sigma^\omega\) is recognized by a Non-deterministic Büchi Automaton (NBA) if and only if it is denoted by an \(\omega\)-regular expression of the form \(\bigcup_{i=1}^k U_i V_i^\omega\), where \(U_i, V_i \subseteq \Sigma^*\) are regular languages with \(V_i \cap \{\varepsilon\} = \emptyset\).`,
      intro: String.raw`Büchi's Theorem on \(\omega\)-Regular Expressions characterizes the operational power of Büchi automata via algebraic syntax. It proves that every Büchi-recognizable language corresponds to a finite union of terms \(U V^\omega\) (a finite regular prefix \(U\) followed by an infinite concatenation of non-empty regular blocks from \(V\)). The proof hinges on the geometric 'lasso' decomposition of accepting runs: any infinite run visiting a finite set \(F\) infinitely often must revisit some designated state \(f \in F\) repeatedly.`,
      application: "In model checking with LTL (Linear Temporal Logic), system counterexamples are reported as lasso executions: an initialization trace followed by an infinitely repeating loop. Nested Depth-First Search (NDFS) and Tarjan's SCC algorithm detect accepting Büchi runs by searching for these exact lasso structures.",
      strategy: String.raw`Direction 1 (Expression \(\to\) NBA): Compile each term \(U V^\omega\) by composing an NFA for \(U\) with an accepting restart loop for \(V^\omega\), and take the initial union across all terms. Direction 2 (NBA \(\to\) Expression): Given NBA \(\mathcal{A}\), every accepting run \(\rho\) satisfies \(\operatorname{Inf}(\rho) \cap F \neq \emptyset\). By Dirichlet's Principle, at least one state \(f \in F\) is visited infinitely often. Decompose the run into a prefix in \(W_{q_0, f}\) and infinite non-empty loops in \(W_{f, f} \setminus \{\varepsilon\}\). Unioning across all \(f \in F\) completes the equivalence.`,
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
          title: String.raw`Compiling UV\u03c9: Prefix simulation followed by recurrent block completions`,
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
          title: String.raw`Dirichlet's Principle: Isolating a recurrent final state f \u2208 F`,
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
          title: String.raw`Slicing the run: The lasso factorisation W_{q0, f} (W_{f, f} \\ {\u03b5})\u03c9`,
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
          title: String.raw`Covering all runs: L(A) = \u22c3_{f \in F} W_{q0, f} (W_{f, f} \\ {\u03b5})\u03c9`,
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
      next: { label: "Büchi emptiness", href: "/proofs/chapter-03/buchi-emptiness.html" }
    },

    "ramsey-decomposition": {
      slug: "ramsey-decomposition",
      chapter: 4,
      title: "Ramsey decomposition",
      theorem: String.raw`Every \u03c9-word \u03b1 belongs to U\u00b7V\u03c9 for some \u2261-classes U,V of a finite-index congruence \u2261, with V\u00b7V\u2286V.`,
      intro: String.raw`A generic \u03c9-word need not be periodic at all — it can have gaps that grow forever. Yet a finite-index congruence can still slice any such word into one finite prefix and infinitely many interchangeable repeating blocks. Two nested pigeonhole arguments, linked by a persistence property, do the slicing.`,
      application: String.raw`Running example: the automaton has states s\u2080,s\u2081,s\u2082 (F={s\u2081}) and transitions s\u2080\u2013a\u2192s\u2081, s\u2081\u2013b\u2192s\u2082, s\u2082\u2013c\u2192s\u2082 (self-loop), s\u2082\u2013a\u2192s\u2081. The word \u03b1=abc\u00b7abcc\u00b7abccc\u22ef has ever-growing gaps of c's and is not ultimately periodic — yet every block abc\u207f produces the identical \u2248\u1d00-behaviour (reach s\u2082 from s\u2080 or s\u2082, visiting F, and die immediately from s\u2081), so \u03b1 decomposes as [\u03b5]\u00b7V\u03c9 for a single class V.`,
      strategy: String.raw`Build a second finite-index equivalence, this time on the positions of \u03b1, by colouring pairs of positions with the \u2261-class of the segment between them. Pigeonhole gives an infinite pairwise-merging set of positions; persistence (congruence applied to a shared future suffix) lets that merge survive forever. A second, independent pigeonhole on cumulative-prefix classes gives infinitely many prefixes in one class V — not yet consecutive blocks. Persistence links the two arguments: it transfers V's class from a cumulative prefix onto the very next gap, turning the merely-infinite-prefixes claim into genuine consecutive V-blocks. One witnessed concatenation then transports, via congruence, to V\u00b7V\u2286V.`,
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
      previous: { label: "Büchi emptiness", href: "/proofs/chapter-03/buchi-emptiness.html" },
      next: { label: "B\u00fcchi complementation", href: "/proofs/chapter-04/buchi-complementation.html" }
    },

    "buchi-complementation": {
      slug: "buchi-complementation",
      chapter: 4,
      title: String.raw`B\u00fcchi complementation`,
      theorem: String.raw`The complement \(\Sigma^\omega \setminus L\) of every Büchi-recognizable language \(L \subseteq \Sigma^\omega\) is Büchi-recognizable.`,
      intro: String.raw`Complementation of Büchi automata is one of the foundational results of automata theory over infinite words. Because Non-deterministic Büchi Automata (NBAs) strictly exceed Deterministic Büchi Automata (DBAs) in expressive power, complementation cannot be achieved by determinizing and swapping accepting states. Instead, Büchi's 1962 proof classifies finite words using a finite-index transition congruence \(\approx_{\mathcal{A}}\), partitions the infinite universe \(\Sigma^\omega\) into saturated product sets \(U V^\omega\), and constructs the complement as a finite union of rejected products.`,
      application: String.raw`In temporal logic model checking, verifying whether a concurrent system satisfies a temporal specification \(\varphi\) requires constructing an automaton for the negated property \(\neg \varphi\). Büchi complementation guarantees that the negation of any \(\omega\)-regular specification remains algorithmically verifiable.`,
      strategy: String.raw`Define the transition profile congruence \(\approx_{\mathcal{A}}\) on \(\Sigma^*\) tracking state reachability and acceptance visits. Form class products \(U V^\omega\) with idempotent factors \(V \cdot V \subseteq V\). Prove saturation: each product \(U V^\omega\) is either entirely contained in \(L(\mathcal{A})\) or entirely disjoint from \(L(\mathcal{A})\). Apply the Ramsey decomposition to prove universal coverage: \(\Sigma^\omega = \bigcup U V^\omega\). Deduce that \(\Sigma^\omega \setminus L(\mathcal{A}) = \bigcup \{ U V^\omega \mid U V^\omega \cap L(\mathcal{A}) = \emptyset \}\), which is \(\omega\)-regular as a finite union of \(\omega\)-regular terms.`,
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
          title: String.raw`The profile congruence \u2248_A: Capturing reachability and acceptance visits`,
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
          title: String.raw`Saturation: Class products UV\u03c9 are strictly all-or-nothing`,
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
      previous: { label: "Ramsey decomposition", href: "/proofs/chapter-04/ramsey-decomposition.html" },
      next: { label: "Attractor correctness", href: "/proofs/chapter-05/attractor-correctness.html" }
    },

    "buchi-emptiness": {
  "slug": "buchi-emptiness",
  "chapter": 3,
  "title": "Decidability of Büchi emptiness",
  "theorem": "Let \\(\\mathcal{A} = (Q, \\Sigma, \\Delta, q_0, F)\\) be a Büchi automaton. Then \\(L(\\mathcal{A}) \\neq \\emptyset \\iff\\) there exists an accepting state \\(f \\in F\\) that is reachable from \\(q_0\\) and belongs to a directed cycle in the transition graph.",
  "intro": "The emptiness problem asks whether a Büchi automaton accepts at least one infinite word. In finite automata, emptiness is simple state reachability. For Büchi automata, acceptance demands visiting an accepting state infinitely often. This theorem establishes that if any accepting run exists, there is an ultimately periodic run witnessing it: a finite stem reaching an accepting state \\(f \\in F\\) followed by a cycle through \\(f\\) repeated indefinitely (\\(u v^\\omega\\)).",
  "application": "Büchi emptiness is the core decision algorithm in automata-theoretic LTL and CTL* model checking. Verifying a system against a property \\(\\varphi\\) reduces to checking whether the synchronous product \\(\\mathcal{M} \\otimes \\mathcal{A}_{\\neg\\varphi}\\) is empty. Whenever the language is non-empty, cycle detection directly produces a concrete counterexample trace \\(u v^\\omega\\) (stem and loop) witnessing the specification violation.",
  "strategy": "Prove both directions: \\((\\impliedby)\\) Given a path from \\(q_0\\) to \\(f \\in F\\) reading \\(u \\in \\Sigma^*\\) and a non-empty cycle from \\(f\\) to \\(f\\) reading \\(v \\in \\Sigma^+\\), construct the infinite word \\(w = u v^\\omega\\). The generated run visits \\(f\\) at every iteration of \\(v\\), ensuring \\(f \\in \\mathrm{Inf}(\\rho)\\) and \\(w \\in L(\\mathcal{A})\\). \\((\\implies)\\) Given any accepting run \\(\\rho\\) over some word \\(w\\), by definition \\(\\mathrm{Inf}(\\rho) \\cap F \\neq \\emptyset\\). Since \\(F\\) is finite, the Pigeonhole Principle forces some state \\(f \\in F\\) to be revisited infinitely often. The segment between two consecutive visits to \\(f\\) defines a non-empty directed cycle from \\(f\\) back to \\(f\\), establishing a finite stem and loop. Graph-theoretically, this is equivalent to finding a reachable strongly connected component (SCC) containing an accepting state and at least one transition, computable in linear time \\(O(|Q| + |\\Delta|)\\) via Tarjan's or Nested DFS algorithms.",
  "invariant": "\\(\\rho\\) is an accepting run \\(\\iff \\exists f \\in F,\\; q_0 \\xrightarrow{u}^* f \\land f \\xrightarrow{v}^+ f \\text{ with } |v| \\ge 1\\)",
  "synthesis": "Let \\(\\mathcal{A}=(Q,\\Sigma,\\Delta,q_0,F)\\). If there exist \\(f\\in F\\) and words \\(u\\in\\Sigma^*, v\\in\\Sigma^+\\) such that \\(q_0\\xrightarrow{u}^* f\\) and \\(f\\xrightarrow{v}^+ f\\), the concatenated infinite word \\(w = u v^\\omega\\) generates the infinite run \\(\\rho = q_0 \\xrightarrow{u} f \\xrightarrow{v} f \\xrightarrow{v} \\dots\\). The set of states visited infinitely often is \\(\\mathrm{Inf}(\\rho) \\supseteq \\{f\\}\\); since \\(f\\in F\\), \\(\\mathrm{Inf}(\\rho)\\cap F \\neq \\emptyset\\), proving \\(w\\in L(\\mathcal{A})\\). Conversely, let \\(w\\in L(\\mathcal{A})\\) with run \\(\\rho = s_0 s_1 s_2 \\dots\\) where \\(s_0 = q_0\\). By Büchi acceptance, \\(\\mathrm{Inf}(\\rho) \\cap F \\neq \\emptyset\\), so there exists \\(f \\in F\\) occurring infinitely often. Choose two indices \\(i_1 < i_2\\) such that \\(s_{i_1} = s_{i_2} = f\\). The prefix \\(w_0 \\dots w_{i_1-1}\\) labels a finite run from \\(q_0\\) to \\(f\\), and the segment \\(w_{i_1} \\dots w_{i_2-1}\\) (length \\(\\ge 1\\)) labels a directed cycle from \\(f\\) to \\(f\\). Thus, \\(L(\\mathcal{A}) \\neq \\emptyset\\) is equivalent to the existence of a reachable non-trivial SCC containing at least one state in \\(F\\), decidable in \\(O(|Q| + |\\Delta|)\\) time.",
  "diagram": {
    "description": "Büchi automaton transition graph decomposing an infinite accepting run into a finite stem reaching an accepting state f, and a directed non-trivial cycle through f.",
    "viewBox": [
      0,
      0,
      1000,
      520
    ],
    "lanes": [
      {
        "y": 240,
        "label": "Reachable Path (Stem u)",
        "labelX": 35,
        "labelY": 55
      },
      {
        "y": 490,
        "label": "Accepting Cycle (Loop v)",
        "labelX": 35,
        "labelY": 300
      }
    ],
    "nodes": [
      {
        "id": "q0",
        "x": 180,
        "y": 140,
        "label": "q₀",
        "detail": "initial state",
        "shape": "circle",
        "r": 48
      },
      {
        "id": "q1",
        "x": 450,
        "y": 140,
        "label": "q₁",
        "detail": "stem path",
        "shape": "circle",
        "r": 48
      },
      {
        "id": "f",
        "x": 750,
        "y": 140,
        "label": "f ∈ F",
        "detail": "accepting target",
        "shape": "circle",
        "r": 56,
        "accepting": true
      },
      {
        "id": "c1",
        "x": 850,
        "y": 380,
        "label": "c₁",
        "detail": "cycle state",
        "shape": "circle",
        "r": 48
      },
      {
        "id": "c2",
        "x": 650,
        "y": 380,
        "label": "c₂",
        "detail": "cycle return",
        "shape": "circle",
        "r": 48
      },
      {
        "id": "sink",
        "x": 450,
        "y": 380,
        "label": "qₛₗₙₖ",
        "detail": "transient trap",
        "shape": "circle",
        "r": 46
      }
    ],
    "edges": [
      {
        "id": "e-stem1",
        "from": "q0",
        "to": "q1",
        "label": "u₁",
        "labelY": 120
      },
      {
        "id": "e-stem2",
        "from": "q1",
        "to": "f",
        "label": "u₂",
        "labelY": 120
      },
      {
        "id": "e-trap",
        "from": "q1",
        "to": "sink",
        "label": "d",
        "labelX": 475,
        "labelY": 260
      },
      {
        "id": "e-c1",
        "from": "f",
        "to": "c1",
        "label": "v₁",
        "path": "M 780 185 C 840 240 870 300 855 335",
        "labelX": 840,
        "labelY": 250
      },
      {
        "id": "e-c2",
        "from": "c1",
        "to": "c2",
        "label": "v₂",
        "labelY": 360
      },
      {
        "id": "e-close",
        "from": "c2",
        "to": "f",
        "label": "v₃",
        "path": "M 660 335 C 660 250 710 200 730 185",
        "labelX": 675,
        "labelY": 250
      }
    ],
    "annotations": [
      {
        "x": 500,
        "y": 470,
        "text": "Lasso witness: u = u₁u₂, v = v₁v₂v₃  ⟹  u·vω ∈ L(Ⅎ)",
        "anchor": "middle"
      }
    ]
  },
  "steps": [
    {
      "label": "Sufficiency",
      "title": "Constructing an accepting run from a finite stem and loop",
      "exposition": "Suppose there exists an accepting state \\(f \\in F\\) that is reachable from \\(q_0\\) via a finite word \\(u \\in \\Sigma^*\\) and admits a non-empty directed cycle back to \\(f\\) via \\(v \\in \\Sigma^+\\). We construct the ultimately periodic word \\(w = u v^\\omega = u v v v \\dots\\). We must formally verify why the run generated by \\(w\\) satisfies the Büchi acceptance condition.",
      "question": "Why does the periodic run produced by w = u v^ω guarantee Büchi acceptance?",
      "choices": [
        {
          "text": "Because following the stem reaches \\(f\\), and traversing the loop \\(v\\) repeatedly visits \\(f\\) at every period, making \\(f \\in \\mathrm{Inf}(\\rho)\\) with \\(f \\in F\\).",
          "correct": true,
          "feedback": "Correct. The run visits state \\(f\\) at step \\(|u|\\), step \\(|u|+|v|\\), step \\(|u|+2|v|\\), etc. Since \\(|v| \\ge 1\\), this visits \\(f\\) at infinitely many distinct time indices, ensuring \\(\\mathrm{Inf}(\\rho) \\cap F \\neq \\emptyset\\)."
        },
        {
          "text": "Because any cycle in a finite automaton forces all states of the automaton to appear infinitely often.",
          "correct": false,
          "causalFailure": "A cycle visits only the vertices on that specific cycle; states outside the cycle (such as \\(q_0\\) or non-cycle states) are visited only finitely many times."
        },
        {
          "text": "Because Büchi automata accept any word that traverses at least one accepting state at least once.",
          "correct": false,
          "causalFailure": "Visiting an accepting state once is finite automaton acceptance; Büchi acceptance strictly requires an accepting state to be visited infinitely often (\\(\\mathrm{Inf}(\\rho) \\cap F \\neq \\emptyset\\))."
        }
      ],
      "hint": "Recall the Büchi acceptance condition: Inf(ρ) ∩ F ≠ ∅. How often is state f visited when repeating loop v?",
      "formal": "\\(q_0 \\xrightarrow{u} f \\land f \\xrightarrow{v} f \\implies \\rho = q_0 \\xrightarrow{u} f (\\xrightarrow{v} f)^\\omega\\). Since \\(|v| \\ge 1\\), \\(\\{f\\} \\subseteq \\mathrm{Inf}(\\rho)\\). As \\(f \\in F\\), \\(\\mathrm{Inf}(\\rho) \\cap F \\neq \\emptyset\\), so \\(u v^\\omega \\in L(\\mathcal{A})\\).",
      "preview": {
        "activeNodes": [
          "q0",
          "f"
        ],
        "activeEdges": [
          "e-stem1",
          "e-stem2"
        ]
      },
      "reveal": {
        "activeNodes": [
          "q0",
          "q1",
          "f",
          "c1",
          "c2"
        ],
        "activeEdges": [
          "e-stem1",
          "e-stem2",
          "e-c1",
          "e-c2",
          "e-close"
        ],
        "goodNodes": [
          "f",
          "c1",
          "c2"
        ]
      },
      "previewNote": "The stem u reaches an accepting state f ∈ F.",
      "revealNote": "Indefinitely iterating the cycle v visits f infinitely often, certifying acceptance."
    },
    {
      "label": "Necessity",
      "title": "Pigeonhole principle on infinite accepting visits",
      "exposition": "Now assume \\(L(\\mathcal{A}) \\neq \\emptyset\\), so there exists an infinite word \\(w\\) admitting an accepting run \\(\\rho = s_0 s_1 s_2 \\dots\\) with \\(s_0 = q_0\\). By definition, \\(\\mathrm{Inf}(\\rho) \\cap F \\neq \\emptyset\\), meaning the run visits states from \\(F\\) infinitely many times. We must deduce the existence of a finite cycle from this infinite sequence.",
      "question": "Which combinatorial argument guarantees that an accepting run must contain a cycle through some state in F?",
      "choices": [
        {
          "text": "Since \\(F\\) is finite, the infinite sequence of visits to \\(F\\) must revisit at least one specific state \\(f \\in F\\) at multiple indices \\(i_1 < i_2\\), forming a cycle \\(f \\xrightarrow{w_{i_1}\\dots w_{i_2-1}} f\\).",
          "correct": true,
          "feedback": "Exactly. By the Dirichlet Pigeonhole Principle, distributing infinitely many visits across a finite set \\(F\\) forces at least one state \\(f \\in F\\) to occur infinitely often. The run segment between two occurrences forms a directed cycle."
        },
        {
          "text": "Because every infinite sequence of transitions in a graph must visit all vertices of the graph.",
          "correct": false,
          "causalFailure": "A run can easily remain trapped in a small 2-state subcomponent, never visiting the rest of the graph."
        },
        {
          "text": "Because non-deterministic transitions always duplicate states until a cycle is formed.",
          "correct": false,
          "causalFailure": "Non-determinism allows branching choices, but the run itself is a single sequence of states; cycle existence stems from graph finiteness and infinite length."
        }
      ],
      "hint": "How many states are in F? How many times does an accepting run visit F?",
      "formal": "\\(\\mathrm{Inf}(\\rho) \\cap F \\neq \\emptyset \\implies \\exists f \\in F \\text{ such that } \\{i \\mid s_i = f\\} \\text{ is infinite}\\). Picking any two indices \\(i_1 < i_2\\) gives \\(s_{i_1} = s_{i_2} = f\\), defining the directed cycle.",
      "preview": {
        "activeNodes": [
          "f"
        ],
        "activeEdges": []
      },
      "reveal": {
        "activeNodes": [
          "f",
          "c1",
          "c2"
        ],
        "activeEdges": [
          "e-c1",
          "e-c2",
          "e-close"
        ],
        "goodNodes": [
          "f"
        ]
      },
      "previewNote": "Some state f in F is visited at infinitely many time steps.",
      "revealNote": "Two distinct visit times i₁ < i₂ delimit a finite closed cycle from f back to f."
    },
    {
      "label": "Graph Reduction",
      "title": "Strongly Connected Components and non-transient components",
      "exposition": "A strongly connected component (SCC) is a maximal subgraph where every pair of vertices is mutually reachable. An SCC is non-trivial (or non-transient) if it contains at least one directed edge (which includes self-loops or cycles of length \\(\\ge 2\\)). A single isolated state without self-loops is a trivial SCC with no cycle.",
      "question": "What exact condition on the SCC decomposition of the transition graph characterizes non-emptiness of L(A)?",
      "choices": [
        {
          "text": "There is a reachable non-trivial SCC \\(C\\) containing at least one accepting state \\(f \\in F \\cap C\\).",
          "correct": true,
          "feedback": "Precisely. In a non-trivial SCC, every state belongs to a directed cycle. If that SCC contains \\(f \\in F\\) and is reachable from \\(q_0\\), \\(f\\) can be visited and cycled through repeatedly."
        },
        {
          "text": "Every accepting state in the automaton must belong to a single global strongly connected component.",
          "correct": false,
          "causalFailure": "An automaton can have multiple disconnected accepting components; only one reachable accepting cycle is required for non-emptiness."
        },
        {
          "text": "The graph must contain no sink states anywhere in the state space.",
          "correct": false,
          "causalFailure": "The presence of sink states elsewhere does not affect language non-emptiness as long as one accepting lasso exists."
        }
      ],
      "hint": "Does a trivial SCC (a single vertex without a self-loop) contain a cycle?",
      "formal": "\\(L(\\mathcal{A}) \\neq \\emptyset \\iff \\exists \\text{ non-trivial SCC } C \\subseteq Q \\text{ such that } C \\text{ is reachable from } q_0 \\land C \\cap F \\neq \\emptyset\\).",
      "preview": {
        "activeNodes": [
          "q0",
          "q1",
          "sink"
        ],
        "activeEdges": [
          "e-stem1",
          "e-trap"
        ],
        "badNodes": [
          "sink"
        ]
      },
      "reveal": {
        "activeNodes": [
          "q0",
          "q1",
          "f",
          "c1",
          "c2"
        ],
        "activeEdges": [
          "e-stem1",
          "e-stem2",
          "e-c1",
          "e-c2",
          "e-close"
        ],
        "goodNodes": [
          "f",
          "c1",
          "c2"
        ],
        "badNodes": [
          "sink"
        ]
      },
      "previewNote": "Transient paths leading to dead sinks do not form cycles.",
      "revealNote": "Reachable non-trivial SCC containing f ∈ F confirms a cycle: language is non-empty."
    },
    {
      "label": "Algorithmics",
      "title": "Linear-time decision and counterexample extraction",
      "exposition": "To solve Büchi emptiness algorithmically on an automaton with \\(|Q|\\) states and \\(|\\Delta|\\) transitions, we can compute all SCCs using Tarjan's algorithm in \\(O(|Q| + |\\Delta|)\\) time, or execute a Nested Depth-First Search (NDFS) that searches for accepting states during DFS-1 and finds return cycles in DFS-2.",
      "question": "What is the worst-case time complexity of checking Büchi emptiness, and what witness is produced?",
      "choices": [
        {
          "text": "Linear time \\(O(|Q| + |\\Delta|)\\), producing an ultimately periodic word \\(u v^\\omega\\) as a concrete counterexample witness.",
          "correct": true,
          "feedback": "Spot on. Graph reachability and cycle detection run in linear time. The stem path and cycle path directly supply the words \\(u\\) and \\(v\\), forming the counterexample lasso \\(u v^\\omega\\)."
        },
        {
          "text": "Exponential time \\(O(2^{|Q|})\\), because infinite runs require exploring all subsets of states.",
          "correct": false,
          "causalFailure": "Subset exploration is needed for determinization or complementation, but emptiness checks the existing transition graph directly in linear time."
        },
        {
          "text": "Undecidable, because the language consists of infinite-length words.",
          "correct": false,
          "causalFailure": "The language contains infinite words, but the automaton is finite; the ultimately periodic property reduces the infinite problem to finite cycle detection."
        }
      ],
      "hint": "Tarjan's SCC algorithm and Nested DFS both inspect vertices and edges a constant number of times.",
      "formal": "\\(\\text{Time complexity: } O(|Q| + |\\Delta|)\\). The witness is \\(w = u v^\\omega \\in L(\\mathcal{A})\\) with \\(|u| \\le |Q|\\) and \\(1 \\le |v| \\le |Q|\\).",
      "preview": {
        "activeNodes": [
          "q0",
          "q1",
          "f"
        ],
        "activeEdges": [
          "e-stem1",
          "e-stem2"
        ]
      },
      "reveal": {
        "activeNodes": [
          "q0",
          "q1",
          "f",
          "c1",
          "c2"
        ],
        "activeEdges": [
          "e-stem1",
          "e-stem2",
          "e-c1",
          "e-c2",
          "e-close"
        ],
        "goodNodes": [
          "q0",
          "f",
          "c1",
          "c2"
        ]
      },
      "previewNote": "DFS-1 reaches the accepting state f.",
      "revealNote": "DFS-2 closes the cycle back to f, returning the lasso counterexample in linear time."
    }
  ],
  "previous": {
    "label": "Büchi–expression equivalence",
    "href": "/proofs/chapter-03/buchi-expression-equivalence.html"
  },
  "next": {
    "label": "Ramsey decomposition",
    "href": "/proofs/chapter-04/ramsey-decomposition.html"
  }
},

    "attractor-correctness": {
  "slug": "attractor-correctness",
  "chapter": 5,
  "title": "Attractor correctness & controllable predecessors",
  "theorem": "Let \\(G = (V_E, V_S, E)\\) be a finite 2-player game arena with target \\(T \\subseteq V\\). A vertex \\(v\\) belongs to \\(\\mathsf{Attr}_S(T)\\) if and only if the System has a memoryless winning strategy for the reachability objective to force the play into \\(T\\) regardless of Environment choices.",
  "intro": "In reactive synthesis, a software or hardware controller interacts with an antagonistic environment. The controllable attractor \\(\\mathsf{Attr}_S(T)\\) formalizes backward reachability: it is the set of all arena states from which the System can guarantee entering the target set \\(T\\) within a finite number of steps, no matter how the Environment plays.",
  "application": "Attractor computation is the workhorse of game solving: it computes winning regions in safety games, reachability games, Büchi games, and parity games (via Zielonka's algorithm). When synthesizing reactive controllers, the attractor's rank function directly yields a correct-by-construction positional control policy.",
  "strategy": "Define the predecessor operators \\(\\textit{Pre}_S(X) = \\{v \\in V_S \\mid \\exists (v, u) \\in E.\\; u \\in X\\}\\) (existential for System) and \\(\\textit{Pre}_E(X) = \\{v \\in V_E \\mid \\forall (v, u) \\in E.\\; u \\in X\\}\\) (universal for Environment). Form the attractor iteration \\(\\mathsf{Attr}_0(T) = T\\), \\(\\mathsf{Attr}_{k+1}(T) = \\mathsf{Attr}_k(T) \\cup \\textit{Pre}_S(\\mathsf{Attr}_k(T)) \\cup \\textit{Pre}_E(\\mathsf{Attr}_k(T))\\). On \\(\\mathsf{Attr}_S(T)\\), define the rank \\(r(v) = \\min \\{k \\mid v \\in \\mathsf{Attr}_k(T)\\}\\). Prove that \\(r(v)\\) acts as a Lyapunov function: the System can choose a successor with strictly lower rank, while the Environment cannot prevent moving to a state with lower rank. Hence, play reaches \\(T\\) in at most \\(r(v)\\) steps. Conversely, show that on the complement \\(V \\setminus \\mathsf{Attr}_S(T)\\), the Environment has a strategy to trap the play forever outside \\(T\\).",
  "invariant": "\\(\\forall v \\in \\mathsf{Attr}_S(T) \\setminus T,\\; (v \\in V_S \\implies \\exists u.\\; r(u) < r(v)) \\land (v \\in V_E \\implies \\forall u.\\; r(u) < r(v))\\)",
  "synthesis": "Let \\(G=(V_E,V_S,E)\\) with target \\(T\\subseteq V\\). The sequence \\(\\mathsf{Attr}_0(T)\\subseteq \\mathsf{Attr}_1(T)\\subseteq \\dots\\) is monotone in the finite lattice \\((2^V,\\subseteq)\\), reaching a fixed point \\(\\mathsf{Attr}_S(T) = \\mathsf{Attr}_{|V|}(T)\\). For \\(v\\in\\mathsf{Attr}_S(T)\\), define \\(r(v)=\\min\\{k\\mid v\\in\\mathsf{Attr}_k(T)\\}\\). Construct a memoryless System strategy \\(\\sigma: V_S\\to V\\): for \\(v\\in V_S\\cap\\mathsf{Attr}_S(T)\\setminus T\\) with \\(r(v)=k+1\\), by definition of \\(\\textit{Pre}_S\\), \\(\\exists u\\in\\mathsf{Attr}_k(T)\\) such that \\((v,u)\\in E\\); set \\(\\sigma(v)=u\\). For Environment vertices \\(v\\in V_E\\cap\\mathsf{Attr}_S(T)\\setminus T\\) with \\(r(v)=k+1\\), by definition of \\(\\textit{Pre}_E\\), all successors \\(u\\) satisfy \\(u\\in\\mathsf{Attr}_k(T)\\), so \\(r(u)\\le k < r(v)\\). Thus, along any play obeying \\(\\sigma\\), the integer rank strictly decreases at every step, ensuring arrival in \\(T\\) in at most \\(r(v)\\) steps. On the complement \\(U = V\\setminus\\mathsf{Attr}_S(T)\\), for all \\(v\\in U\\cap V_S\\), all successors remain in \\(U\\) (otherwise \\(v\\in\\textit{Pre}_S(\\mathsf{Attr}_S(T))\\)); for all \\(v\\in U\\cap V_E\\), there exists a successor in \\(U\\) (otherwise \\(v\\in\\textit{Pre}_E(\\mathsf{Attr}_S(T))\\)). Thus the Environment traps the play in \\(U\\), proving that the System cannot win from \\(U\\).",
  "diagram": {
    "description": "Controllable attractor arena showing System vertices (squares) with existential choice, Environment vertices (circles) with universal branches, rank layers, and the external trap.",
    "viewBox": [
      0,
      0,
      1000,
      520
    ],
    "lanes": [
      {
        "y": 160,
        "label": "System Vertices (Vs) — Existential Choice",
        "labelX": 35,
        "labelY": 45
      },
      {
        "y": 340,
        "label": "Environment Vertices (Ve) — Universal Obligation",
        "labelX": 35,
        "labelY": 220
      },
      {
        "y": 490,
        "label": "Target Region T (Rank 0)",
        "labelX": 35,
        "labelY": 390
      }
    ],
    "nodes": [
      {
        "id": "vs2",
        "x": 200,
        "y": 100,
        "label": "vₛ₂",
        "detail": "rank 2 (Vs)",
        "shape": "rect",
        "width": 140,
        "height": 60
      },
      {
        "id": "ve1",
        "x": 500,
        "y": 270,
        "label": "vₑ₁",
        "detail": "rank 1 (Ve)",
        "shape": "circle",
        "r": 46
      },
      {
        "id": "vs1",
        "x": 200,
        "y": 270,
        "label": "vₛ₁",
        "detail": "rank 1 (Vs)",
        "shape": "rect",
        "width": 140,
        "height": 60
      },
      {
        "id": "t1",
        "x": 350,
        "y": 430,
        "label": "t₁ ∈ T",
        "detail": "target state",
        "shape": "circle",
        "r": 48,
        "accepting": true
      },
      {
        "id": "t2",
        "x": 650,
        "y": 430,
        "label": "t₂ ∈ T",
        "detail": "target state",
        "shape": "circle",
        "r": 48,
        "accepting": true
      },
      {
        "id": "trap",
        "x": 820,
        "y": 270,
        "label": "uₜᵣₐₚ",
        "detail": "outside attractor",
        "shape": "circle",
        "r": 48
      }
    ],
    "edges": [
      {
        "id": "e-vs2-vs1",
        "from": "vs2",
        "to": "vs1",
        "label": "σ(vₛ₂)",
        "labelX": 230,
        "labelY": 185
      },
      {
        "id": "e-vs2-trap",
        "from": "vs2",
        "to": "trap",
        "label": "bad choice",
        "path": "M 280 80 C 600 40 820 120 820 220",
        "labelX": 620,
        "labelY": 80
      },
      {
        "id": "e-vs1-t1",
        "from": "vs1",
        "to": "t1",
        "label": "σ(vₛ₁)",
        "labelX": 250,
        "labelY": 355
      },
      {
        "id": "e-ve1-t1",
        "from": "ve1",
        "to": "t1",
        "label": "env move 1",
        "labelX": 405,
        "labelY": 355
      },
      {
        "id": "e-ve1-t2",
        "from": "ve1",
        "to": "t2",
        "label": "env move 2",
        "labelX": 600,
        "labelY": 355
      },
      {
        "id": "e-trap-loop",
        "from": "trap",
        "to": "trap",
        "label": "trap loop",
        "path": "M 855 240 C 930 200 930 340 855 300",
        "labelX": 955,
        "labelY": 270
      }
    ],
    "annotations": [
      {
        "x": 500,
        "y": 505,
        "text": "Rank function r(v) guarantees arrival in T within at most r(v) steps.",
        "anchor": "middle"
      }
    ]
  },
  "steps": [
    {
      "label": "Predecessor Duality",
      "title": "Existential versus universal predecessor operators",
      "exposition": "In an arena \\(G = (V_E, V_S, E)\\), the System controls transitions from \\(V_S\\), while the Environment controls transitions from \\(V_E\\). To expand a target set \\(X \\subseteq V\\) backwards by one step, we must account for this strategic asymmetry.",
      "question": "How are the controllable predecessor operators defined for System and Environment vertices?",
      "choices": [
        {
          "text": "\\(\\textit{Pre}_S(X) = \\{v \\in V_S \\mid \\exists u \\in X.\\; (v, u) \\in E\\}\\) and \\(\\textit{Pre}_E(X) = \\{v \\in V_E \\mid \\forall u.\\; (v, u) \\in E \\implies u \\in X\\}\\).",
          "correct": true,
          "feedback": "Correct. The System needs only one winning move to enter \\(X\\), whereas from an Environment vertex, all possible adversary transitions must remain inside \\(X\\)."
        },
        {
          "text": "Both System and Environment use existential quantification: \\(\\exists u \\in X.\\; (v, u) \\in E\\).",
          "correct": false,
          "causalFailure": "If an Environment vertex has one move to \\(X\\) and another to an escape route, the Environment will simply choose the escape route, defeating the System."
        },
        {
          "text": "Both System and Environment use universal quantification: \\(\\forall u.\\; (v, u) \\in E \\implies u \\in X\\).",
          "correct": false,
          "causalFailure": "Universal quantification is overly restrictive for the System: the System picks the transition, so having multiple outgoing moves is an advantage, not a failure."
        }
      ],
      "hint": "Consider who chooses the move: the System wants at least one good successor; against the adversary, all successors must be safe.",
      "formal": "\\(\\textit{CPre}(X) = \\{v \\in V_S \\mid E(v) \\cap X \\neq \\emptyset\\} \\cup \\{v \\in V_E \\mid E(v) \\subseteq X\\}\\).",
      "preview": {
        "activeNodes": [
          "t1",
          "t2"
        ],
        "activeEdges": []
      },
      "reveal": {
        "activeNodes": [
          "vs1",
          "ve1",
          "t1",
          "t2"
        ],
        "activeEdges": [
          "e-vs1-t1",
          "e-ve1-t1",
          "e-ve1-t2"
        ],
        "goodNodes": [
          "vs1",
          "ve1",
          "t1",
          "t2"
        ]
      },
      "previewNote": "Starting target set T (rank 0).",
      "revealNote": "Rank 1: vs1 has an existential move to T; ve1 has all its moves to T."
    },
    {
      "label": "Fixed-Point Monotonicity",
      "title": "Iterative expansion and finite convergence",
      "exposition": "The attractor is computed by iterating the controllable predecessor: \\(\\mathsf{Attr}_0(T) = T\\) and \\(\\mathsf{Attr}_{k+1}(T) = \\mathsf{Attr}_k(T) \\cup \\textit{CPre}(\\mathsf{Attr}_k(T))\\). We analyze the convergence of this sequence in a finite arena.",
      "question": "Why is the sequence guaranteed to reach a fixed point in at most |V| steps?",
      "choices": [
        {
          "text": "Because \\(\\mathsf{Attr}_k(T) \\subseteq \\mathsf{Attr}_{k+1}(T)\\) is a monotonically increasing sequence on the finite set \\(V\\), stabilizing when no new vertex is added.",
          "correct": true,
          "feedback": "Exactly. Since each step only adds vertices and \\(|V|\\) is finite, the iteration must terminate in at most \\(|V|\\) rounds when \\(\\mathsf{Attr}_{k+1}(T) = \\mathsf{Attr}_k(T)\\)."
        },
        {
          "text": "Because the Environment vertices are deleted from the arena at each iteration.",
          "correct": false,
          "causalFailure": "Vertices are never deleted during attractor computation; their membership in the attractor set is accumulated monotonically."
        },
        {
          "text": "Because reachability games always terminate in zero steps when targets are non-empty.",
          "correct": false,
          "causalFailure": "Reachability requires traversing paths of positive length; stabilizing requires \\(k\\) steps where \\(k\\) is the diameter of the attractor."
        }
      ],
      "hint": "A monotonically increasing sequence of subsets of a finite set must stabilize.",
      "formal": "\\(\\mathsf{Attr}_0(T) \\subseteq \\mathsf{Attr}_1(T) \\subseteq \\dots \\subseteq V\\). Finiteness implies \\(\\exists k \\le |V|.\\; \\mathsf{Attr}_{k+1}(T) = \\mathsf{Attr}_k(T) = \\mathsf{Attr}_S(T)\\).",
      "preview": {
        "activeNodes": [
          "vs1",
          "ve1",
          "t1",
          "t2"
        ],
        "activeEdges": [
          "e-vs1-t1",
          "e-ve1-t1",
          "e-ve1-t2"
        ]
      },
      "reveal": {
        "activeNodes": [
          "vs2",
          "vs1",
          "ve1",
          "t1",
          "t2"
        ],
        "activeEdges": [
          "e-vs2-vs1",
          "e-vs1-t1",
          "e-ve1-t1",
          "e-ve1-t2"
        ],
        "goodNodes": [
          "vs2",
          "vs1",
          "ve1",
          "t1",
          "t2"
        ]
      },
      "previewNote": "Rank 1 vertices added to the attractor.",
      "revealNote": "Rank 2 vertex vs2 added via its transition to vs1: monotone expansion."
    },
    {
      "label": "Lyapunov Rank",
      "title": "Rank function as a strictly decreasing Lyapunov potential",
      "exposition": "For any vertex \\(v \\in \\mathsf{Attr}_S(T)\\), define the rank \\(r(v) = \\min \\{k \\mid v \\in \\mathsf{Attr}_k(T)\\}\\). We construct the positional System strategy \\(\\sigma: V_S \\to V\\) by setting \\(\\sigma(v) = u\\) where \\((v, u) \\in E\\) and \\(r(u) < r(v)\\).",
      "question": "How does the rank r(v) guarantee that the System reaches T in a finite number of steps?",
      "choices": [
        {
          "text": "Along any play, \\(r(v)\\) strictly decreases at every System move and cannot increase at Environment moves, forcing arrival in \\(T\\) (where \\(r=0\\)) in at most \\(r(v)\\) steps.",
          "correct": true,
          "feedback": "Spot on. The integer rank is bounded below by 0. Because it decreases by at least 1 at every step along the strategy, no cycle can occur within the attractor, ensuring finite arrival."
        },
        {
          "text": "The rank allows the play to cycle infinitely through System vertices of equal rank.",
          "correct": false,
          "causalFailure": "If play could cycle without decreasing rank, the System would fail the finite reachability objective, violating strategy correctness."
        },
        {
          "text": "The rank increases monotonically until it exceeds the arena size.",
          "correct": false,
          "causalFailure": "A rank increasing indefinitely would represent moving further away from the target, not reaching it."
        }
      ],
      "hint": "A strictly decreasing function on non-negative integers must reach 0 in finitely many steps.",
      "formal": "\\(\\forall v \\in \\mathsf{Attr}_S(T) \\setminus T:\\; r(\\sigma(v)) \\le r(v) - 1\\) and \\(\\forall u \\in E(v \\in V_E):\\; r(u) \\le r(v) - 1\\). Hence \\(\\text{steps to } T \\le r(v)\\).",
      "preview": {
        "activeNodes": [
          "vs2"
        ],
        "activeEdges": []
      },
      "reveal": {
        "activeNodes": [
          "vs2",
          "vs1",
          "t1"
        ],
        "activeEdges": [
          "e-vs2-vs1",
          "e-vs1-t1"
        ],
        "goodNodes": [
          "vs2",
          "vs1",
          "t1"
        ]
      },
      "previewNote": "System vertex vs2 at rank 2.",
      "revealNote": "Following σ: vs2 (rank 2) → vs1 (rank 1) → t1 (rank 0). Strict rank descent."
    },
    {
      "label": "Trap Duality",
      "title": "Environment trapping strategy outside the attractor",
      "exposition": "To complete the equivalence, we must prove that the System cannot win from any state in the complement \\(U = V \\setminus \\mathsf{Attr}_S(T)\\). We show that the Environment can trap the play in \\(U\\) forever.",
      "question": "Why is the complement set U = V \\ Attr_S(T) a trap for the System?",
      "choices": [
        {
          "text": "Because from any System state in \\(U\\), all outgoing edges lead back into \\(U\\); and from any Environment state in \\(U\\), there exists at least one edge staying in \\(U\\).",
          "correct": true,
          "feedback": "Precisely. If a System state in \\(U\\) had an edge into \\(\\mathsf{Attr}_S(T)\\), it would belong to \\(\\textit{Pre}_S(\\mathsf{Attr}_S(T)) \\subseteq \\mathsf{Attr}_S(T)\\), a contradiction. Similarly, if an Environment state in \\(U\\) had all edges into \\(\\mathsf{Attr}_S(T)\\), it would belong to \\(\\textit{Pre}_E(\\mathsf{Attr}_S(T))\\)."
        },
        {
          "text": "Because vertices outside the attractor have no outgoing edges.",
          "correct": false,
          "causalFailure": "Game arenas are non-blocking; vertices in \\(U\\) have outgoing transitions, but the Environment can steer them within \\(U\\)."
        },
        {
          "text": "Because the target set \\(T\\) is completely unreachable by any graph path from \\(U\\).",
          "correct": false,
          "causalFailure": "There may exist paths from \\(U\\) to \\(T\\), but the Environment has the power to avoid taking them."
        }
      ],
      "hint": "What would happen if a vertex in U could force a move into Attr_S(T)? Would it have stayed in U?",
      "formal": "\\(v \\in U \\cap V_S \\implies E(v) \\subseteq U\\); \\(v \\in U \\cap V_E \\implies E(v) \\cap U \\neq \\emptyset\\). Hence Environment forces play to stay in \\(U \\subseteq V \\setminus T\\).",
      "preview": {
        "activeNodes": [
          "trap"
        ],
        "activeEdges": []
      },
      "reveal": {
        "activeNodes": [
          "trap"
        ],
        "activeEdges": [
          "e-trap-loop"
        ],
        "badNodes": [
          "trap"
        ]
      },
      "previewNote": "State utrap outside the attractor.",
      "revealNote": "Adversary traps the play inside U forever: System cannot force reachability."
    }
  ],
  "previous": {
    "label": "Büchi complementation",
    "href": "/proofs/chapter-04/buchi-complementation.html"
  },
  "next": {
    "label": "Parity game determinacy",
    "href": "/proofs/chapter-05/parity-determinacy.html"
  }
},

    "parity-determinacy": {
  "slug": "parity-determinacy",
  "chapter": 5,
  "title": "Büchi–Landweber & positional determinacy of parity games",
  "theorem": "Every parity game on a finite 2-player arena \\(G = (V_E, V_S, E, \\Omega)\\) is determined, and both players have positional (memoryless) winning strategies: \\(V = W_0 \\uplus W_1\\).",
  "intro": "Parity games are the central model for reactive synthesis and modal mu-calculus model checking. Each vertex is colored with an integer priority. An infinite play is won by Player 0 (System) if the maximum priority visited infinitely often is even; otherwise Player 1 (Environment) wins. Büchi and Landweber (1969) proved determinacy, and Zielonka (1998) introduced an elegant constructive induction showing that winning strategies need zero memory.",
  "application": "Solving parity games is the computational bottleneck of translating LTL specifications to deterministic parity automata and synthesizing reactive controllers. Because strategies are memoryless, synthesized controllers can be implemented as combinational circuits or finite lookup tables without tracking game history.",
  "strategy": "Prove determinacy by Zielonka's induction on the number of distinct priorities \\(k = |\\Omega(V)|\\). Let \\(c = \\max \\Omega(V)\\) be the top priority. Without loss of generality, assume \\(c\\) is even (won by Player 0; the odd case is dual). Form the set \\(U = \\{v \\in V \\mid \\Omega(v) = c\\}\\) and compute the Player 0 attractor \\(A = \\mathsf{Attr}_0(U)\\). The subarena \\(G' = G \\setminus A\\) contains strictly fewer priorities (at most \\(k-1\\)). By the induction hypothesis, \\(G'\\) is determined with positional winning regions \\(W'_0, W'_1\\). If \\(W'_1 = \\emptyset\\), Player 0 wins the entire game \\(G\\) using the attractor strategy inside \\(A\\) and \\(\\tau'_0\\) inside \\(G'\\). If \\(W'_1 \\neq \\emptyset\\), compute \\(B = \\mathsf{Attr}_1(W'_1)\\) in the whole game. The subarena \\(G \\setminus B\\) is strictly smaller than \\(G\\), so by induction hypothesis it decomposes into winning regions \\(W''_0, W''_1\\). We then prove \\(W_0 = W''_0\\) and \\(W_1 = W''_1 \\cup B\\), combining memoryless strategies with zero memory overhead.",
  "invariant": "\\(\\forall v \\in V,\\; v \\in W_0 \\lor v \\in W_1\\) and \\(\\sigma_i: V_i \\to V\\) depends solely on current vertex",
  "synthesis": "Let \\(G=(V_E, V_S, E, \\Omega)\\) with \\(\\Omega: V \\to \\{0, \\dots, c\\}\\). The base case \\(k=1\\) is immediate: all vertices share priority \\(c\\); Player 0 wins everywhere if \\(c\\) is even, Player 1 if \\(c\\) is odd, both with arbitrary memoryless choices. For the induction step, assume \\(c = \\max \\Omega(V)\\) is even. Let \\(U = \\Omega^{-1}(c)\\) and \\(A = \\mathsf{Attr}_0(U)\\). The subarena \\(G' = G \\setminus A\\) is well-defined because Player 1 cannot escape \\(G'\\) into \\(A\\) (by definition of \\(\\textit{Pre}_0\\)). Since \\(G'\\) lacks priority \\(c\\), it has \\(\\le k-1\\) priorities. By induction hypothesis, \\(V(G') = W'_0 \\uplus W'_1\\) with positional strategies \\(\\tau'_0, \\tau'_1\\). Case 1: \\(W'_1 = \\emptyset\\). Player 0 wins everywhere on \\(G\\): on \\(G'\\), play \\(\\tau'_0\\); if the play ever leaves \\(G'\\) into \\(A\\), follow the attractor strategy to hit \\(U\\) (priority \\(c\\)). Either the play stays in \\(A\\) hitting \\(c\\) infinitely often, or it visits \\(G'\\) finitely/infinitely. In every case, the maximum infinitely recurring priority is \\(c\\) (even), so Player 0 wins. Case 2: \\(W'_1 \\neq \\emptyset\\). Compute \\(B = \\mathsf{Attr}_1(W'_1)\\) in \\(G\\). The subarena \\(G \\setminus B\\) is strictly smaller than \\(G\\) because \\(W'_1 \\subseteq B\\) is non-empty. By induction hypothesis, \\(G \\setminus B\\) has positional winning regions \\(W''_0, W''_1\\). Player 0 wins on \\(W''_0\\) using \\(\\tau''_0\\); Player 1 wins on \\(W''_1 \\cup B\\) using \\(\\tau''_1\\) on \\(W''_1\\), the attractor strategy to reach \\(W'_1\\) on \\(B \\setminus W'_1\\), and \\(\\tau'_1\\) on \\(W'_1\\). Since each piece is positional, the union strategy is positional.",
  "diagram": {
    "description": "Zielonka's recursive arena decomposition showing the top priority set U (even priority c), attractor A, and the inductive split of subarena G \\ A into W'0 and W'1.",
    "viewBox": [
      0,
      0,
      1000,
      520
    ],
    "lanes": [
      {
        "y": 160,
        "label": "Top Priority Set U (Priority c = max, even)",
        "labelX": 35,
        "labelY": 45
      },
      {
        "y": 340,
        "label": "Player 0 Attractor A = Attr₀(U)",
        "labelX": 35,
        "labelY": 220
      },
      {
        "y": 490,
        "label": "Residual Subarena G ∖ A (Strictly Fewer Priorities)",
        "labelX": 35,
        "labelY": 390
      }
    ],
    "nodes": [
      {
        "id": "u_top",
        "x": 500,
        "y": 100,
        "label": "U (Ω = c)",
        "detail": "top priority (even)",
        "shape": "circle",
        "r": 52,
        "accepting": true
      },
      {
        "id": "a_node",
        "x": 220,
        "y": 260,
        "label": "A ∖ U",
        "detail": "attractor to U",
        "shape": "rect",
        "width": 140,
        "height": 60
      },
      {
        "id": "w0_sub",
        "x": 320,
        "y": 430,
        "label": "W'₀",
        "detail": "Player 0 win in G∖A",
        "shape": "rect",
        "width": 150,
        "height": 64
      },
      {
        "id": "w1_sub",
        "x": 680,
        "y": 430,
        "label": "W'₁",
        "detail": "Player 1 win in G∖A",
        "shape": "rect",
        "width": 150,
        "height": 64
      },
      {
        "id": "b_node",
        "x": 820,
        "y": 260,
        "label": "B = Attr₁(W'₁)",
        "detail": "Player 1 global trap",
        "shape": "rect",
        "width": 150,
        "height": 60
      }
    ],
    "edges": [
      {
        "id": "e-a-u",
        "from": "a_node",
        "to": "u_top",
        "label": "σ_attr",
        "labelX": 320,
        "labelY": 170
      },
      {
        "id": "e-w0-a",
        "from": "w0_sub",
        "to": "a_node",
        "label": "escape to A",
        "labelX": 250,
        "labelY": 350
      },
      {
        "id": "e-w0-loop",
        "from": "w0_sub",
        "to": "w0_sub",
        "label": "τ'₀ strategy",
        "path": "M 245 440 C 180 490 280 520 310 460",
        "labelX": 230,
        "labelY": 505
      },
      {
        "id": "e-w1-b",
        "from": "w1_sub",
        "to": "b_node",
        "label": "attract to W'₁",
        "labelX": 770,
        "labelY": 350
      },
      {
        "id": "e-u-w0",
        "from": "u_top",
        "to": "w0_sub",
        "label": "re-enter G∖A",
        "path": "M 480 145 C 430 260 380 340 345 400",
        "labelX": 430,
        "labelY": 280
      }
    ],
    "annotations": [
      {
        "x": 500,
        "y": 505,
        "text": "Zielonka induction: Case 1 (W'₁ = ∅ ⟹ W₀ = V) vs Case 2 (W'₁ ≠ ∅ ⟹ recurse on G ∖ B).",
        "anchor": "middle"
      }
    ]
  },
  "steps": [
    {
      "label": "Parity Objective",
      "title": "The parity condition and maximum recurring priority",
      "exposition": "In a parity game, an infinite play \\(\\pi = v_0 v_1 v_2 \\dots\\) produces a sequence of priorities \\(\\Omega(v_0) \\Omega(v_1) \\dots\\). The winner is determined by \\(\\max(\\mathrm{Inf}(\\pi))\\): Player 0 wins iff this maximum recurring priority is even. We examine why memoryless strategies suffice to enforce this condition.",
      "question": "Which condition guarantees victory for Player 0 on an infinite play π?",
      "choices": [
        {
          "text": "The highest priority occurring infinitely often in \\(\\pi\\) is an even integer: \\(\\max(\\mathrm{Inf}(\\Omega(\\pi))) \\equiv 0 \\pmod 2\\).",
          "correct": true,
          "feedback": "Correct. The parity condition looks exclusively at the asymptotic highest priority visited infinitely often; any finite prefix of priorities is irrelevant."
        },
        {
          "text": "Player 0 must visit even priorities strictly more times than odd priorities along the play.",
          "correct": false,
          "causalFailure": "Parity does not count frequencies or averages; a single visit to an odd priority higher than all recurring even priorities wins for Player 1."
        },
        {
          "text": "Every vertex visited along the play must have an even priority.",
          "correct": false,
          "causalFailure": "A play may traverse vertices with odd priorities arbitrarily often, provided that some strictly higher even priority is visited infinitely often."
        }
      ],
      "hint": "Look at the definition of max(Inf(π)): it is the greatest color seen infinitely many times.",
      "formal": "\\(\\text{Player 0 wins } \\pi \\iff \\max \\{ c \\mid \\forall i.\\, \\exists j > i.\\, \\Omega(v_j) = c \\} \\in 2\\mathbb{N}\\).",
      "preview": {
        "activeNodes": [
          "u_top"
        ],
        "activeEdges": []
      },
      "reveal": {
        "activeNodes": [
          "u_top"
        ],
        "activeEdges": [],
        "goodNodes": [
          "u_top"
        ]
      },
      "previewNote": "Top priority c = max Ω(V).",
      "revealNote": "If c is even, infinitely recurring visits to U guarantee victory for Player 0."
    },
    {
      "label": "Attractor Decomposition",
      "title": "Isolating the maximal priority via attractor extraction",
      "exposition": "Let \\(c = \\max \\Omega(V)\\) be even, and let \\(U = \\{v \\in V \\mid \\Omega(v) = c\\}\\). We compute \\(A = \\mathsf{Attr}_0(U)\\). In the residual subgame \\(G' = G \\setminus A\\), priority \\(c\\) does not appear at all, so \\(G'\\) has strictly fewer priorities than \\(G\\).",
      "question": "Why can the induction hypothesis be safely applied to the subarena G' = G \\ A?",
      "choices": [
        {
          "text": "Because \\(G'\\) contains at most \\(k-1\\) priorities, and Player 1 cannot force a move from \\(G'\\) into \\(A\\) (by definition of \\(\\textit{Pre}_0\\)).",
          "correct": true,
          "feedback": "Precisely. If Player 1 could force a move into \\(A\\), that vertex would have been added to \\(A\\) during the attractor computation. Hence \\(G'\\) is a closed subgame for Player 1 with fewer priorities."
        },
        {
          "text": "Because \\(G'\\) contains no vertices belonging to Player 1.",
          "correct": false,
          "causalFailure": "\\(G'\\) contains both Player 0 and Player 1 vertices; it is a full 2-player game arena, just on a smaller vertex set with fewer colors."
        },
        {
          "text": "Because the attractor \\(A\\) deletes all transitions between vertices in \\(G'\\).",
          "correct": false,
          "causalFailure": "Transitions internal to \\(G'\\) remain completely untouched."
        }
      ],
      "hint": "What is the defining property of the vertices outside an attractor Attr_0(U)?",
      "formal": "\\(\\Omega(G') \\subseteq \\Omega(V) \\setminus \\{c\\} \\implies |\\Omega(G')| \\le k-1\\). By induction hypothesis, \\(V(G') = W'_0 \\uplus W'_1\\).",
      "preview": {
        "activeNodes": [
          "u_top",
          "a_node"
        ],
        "activeEdges": [
          "e-a-u"
        ]
      },
      "reveal": {
        "activeNodes": [
          "u_top",
          "a_node",
          "w0_sub",
          "w1_sub"
        ],
        "activeEdges": [
          "e-a-u"
        ],
        "goodNodes": [
          "u_top",
          "a_node"
        ]
      },
      "previewNote": "Attractor A attracts to top priority U.",
      "revealNote": "Residual subarena G' = G \\ A has strictly fewer priorities; inductive split into W'0 and W'1."
    },
    {
      "label": "Zielonka Case 1",
      "title": "Base case of the induction: W'1 is empty",
      "exposition": "Suppose the inductive solution on \\(G'\\) yields \\(W'_1 = \\emptyset\\), meaning Player 0 wins everywhere on \\(G'\\) via positional strategy \\(\\tau'_0\\). We must show that Player 0 wins the entire original game \\(G\\).",
      "question": "How does Player 0 combine strategies to win on all of G when W'1 = ∅?",
      "choices": [
        {
          "text": "Play \\(\\tau'_0\\) inside \\(G'\\); if the play enters \\(A\\), play the attractor strategy to hit \\(U\\) (priority \\(c\\)). Either the play hits \\(c\\) infinitely often, or it stays in \\(G'\\) where Player 0 already wins.",
          "correct": true,
          "feedback": "Spot on. If play visits \\(A\\) infinitely often, it visits \\(U\\) infinitely often, so the highest recurring priority is \\(c\\) (even, winning for Player 0). If play visits \\(A\\) only finitely often, it eventually stays in \\(G'\\), where \\(\\tau'_0\\) guarantees victory."
        },
        {
          "text": "Player 0 must immediately forfeit if the play ever leaves the attractor \\(A\\).",
          "correct": false,
          "causalFailure": "Leaving \\(A\\) enters \\(G'\\), which is completely won by Player 0; leaving \\(A\\) is completely safe."
        },
        {
          "text": "Player 0 must restart the entire game from the initial state upon entering \\(A\\).",
          "correct": false,
          "causalFailure": "Games on graphs are played forward without rollbacks; the combination of positional strategies is static."
        }
      ],
      "hint": "Consider the two possible asymptotic behaviors: either A is visited infinitely many times, or only finitely many times.",
      "formal": "\\(W'_1 = \\emptyset \\implies W_0 = V(G)\\). Strategy: \\(\\sigma_0(v) = \\tau'_0(v)\\) for \\(v \\in G'\\), and \\(\\sigma_0(v) = \\sigma_{\\text{attr}}(v)\\) for \\(v \\in A\\).",
      "preview": {
        "activeNodes": [
          "w0_sub",
          "a_node",
          "u_top"
        ],
        "activeEdges": [
          "e-a-u"
        ]
      },
      "reveal": {
        "activeNodes": [
          "w0_sub",
          "a_node",
          "u_top"
        ],
        "activeEdges": [
          "e-a-u",
          "e-w0-a",
          "e-u-w0",
          "e-w0-loop"
        ],
        "goodNodes": [
          "w0_sub",
          "a_node",
          "u_top"
        ]
      },
      "previewNote": "W'1 is empty, so Player 0 controls all of G'.",
      "revealNote": "Combining attractor moves with τ'0 wins everywhere: W0 = V."
    },
    {
      "label": "Zielonka Case 2",
      "title": "Inductive step: W'1 is non-empty and strategy fusion",
      "exposition": "Now suppose \\(W'_1 \\neq \\emptyset\\). Player 1 has a winning region inside \\(G'\\). We compute Player 1's attractor \\(B = \\mathsf{Attr}_1(W'_1)\\) in the whole game \\(G\\). Because \\(W'_1 \\subseteq B\\) is non-empty, the arena \\(G \\setminus B\\) is strictly smaller than \\(G\\).",
      "question": "Why does Player 1 win on all of B, and how does the recursion complete?",
      "choices": [
        {
          "text": "Player 1 uses the attractor strategy to reach \\(W'_1\\), and then plays \\(\\tau'_1\\). Since Player 0 cannot escape \\(W'_1\\) into \\(G \\setminus B\\), Player 1 wins on \\(B\\); recursing on the smaller arena \\(G \\setminus B\\) yields \\(W_0 = W''_0\\) and \\(W_1 = W''_1 \\cup B\\).",
          "correct": true,
          "feedback": "Exactly. Player 1 guarantees reaching \\(W'_1\\), where the winning strategy \\(\\tau'_1\\) enforces victory without ever allowing Player 0 to hit the top priority \\(c\\). By induction on \\(G \\setminus B\\), both winning regions and positional strategies fuse cleanly."
        },
        {
          "text": "Player 1 wins on \\(B\\) only if Player 0 makes a fatal mistake in vertex selection.",
          "correct": false,
          "causalFailure": "By definition of attractor, Player 1 wins against all possible counter-moves of Player 0; no mistake is needed."
        },
        {
          "text": "The recursion fails because memory must be added to remember how many times B was entered.",
          "correct": false,
          "causalFailure": "The attractor strategy is positional, \\(\\tau'_1\\) is positional, and the subgame strategy \\(\\tau''_1\\) is positional; their disjoint union is strictly positional."
        }
      ],
      "hint": "Remember that B is an attractor for Player 1: once inside, Player 1 forces arrival at W'1.",
      "formal": "\\(B = \\mathsf{Attr}_1(W'_1)\\); by induction on \\(G \\setminus B\\), \\(V(G \\setminus B) = W''_0 \\uplus W''_1\\). Then \\(W_0 = W''_0\\) and \\(W_1 = W''_1 \\cup B\\). Both strategies are memoryless.",
      "preview": {
        "activeNodes": [
          "w1_sub",
          "b_node"
        ],
        "activeEdges": [
          "e-w1-b"
        ]
      },
      "reveal": {
        "activeNodes": [
          "w1_sub",
          "b_node"
        ],
        "activeEdges": [
          "e-w1-b"
        ],
        "badNodes": [
          "w1_sub",
          "b_node"
        ]
      },
      "previewNote": "Player 1 winning core W'1.",
      "revealNote": "Player 1 expands to B = Attr1(W'1); recursive determinacy on G \\ B finishes the partition."
    }
  ],
  "previous": {
    "label": "Attractor correctness",
    "href": "/proofs/chapter-05/attractor-correctness.html"
  },
  "next": {
    "label": "Büchi S1S decidability",
    "href": "/proofs/chapter-08/s1s-buchi.html"
  }
},

    "s1s-buchi": {
  "slug": "s1s-buchi",
  "chapter": 8,
  "title": "Büchi's S1S decidability theorem (1960)",
  "theorem": "An \\(\\omega\\)-language \\(L \\subseteq \\Sigma^\\omega\\) is \\(\\omega\\)-regular (recognized by a non-deterministic Büchi automaton) if and only if it is definable in \\(\\mathrm{S1S}\\) (the monadic second-order logic of one successor: \\((\\mathbb{N}, <, +1, \\in)\\)). Consequently, \\(\\mathrm{S1S}\\) is decidable.",
  "intro": "In 1960, J. Richard Büchi proved the profound equivalence between non-deterministic automata over infinite words and monadic second-order logic with one successor (S1S). This bridged declarative logic (describing properties of sequences) and operational automata (executing step-by-step state transitions), simultaneously solving the famous decision problem posed by Church for monadic arithmetic.",
  "application": "S1S is the foundational logic for hardware specification, reactive synthesis, and temporal logics. Because every S1S formula compiles into an equivalent Büchi automaton, checking whether an S1S specification is satisfiable, valid, or realizable reduces to graph emptiness on the compiled automaton.",
  "strategy": "Prove both directions constructively: \\((\\implies)\\) Given an NBA \\(\\mathcal{A} = (Q, \\Sigma, \\Delta, q_0, F)\\) with states \\(Q = \\{q_0, \\dots, q_{m-1}\\}\\), encode an accepting run into an S1S sentence using \\(m\\) monadic set variables \\(X_0, \\dots, X_{m-1}\\). Quantify \\(\\exists X_0 \\dots \\exists X_{m-1}\\) asserting that: (1) the sets partition \\(\\mathbb{N}\\) (at each time step the automaton is in exactly one state); (2) \\(0 \\in X_0\\) (initial state); (3) transitions respect \\(\\Delta\\) at each step \\(t \\to t+1\\); and (4) some state in \\(F\\) is visited infinitely often (\\(\\forall t.\\, \\exists t' > t.\\, \\bigvee_{q_f \\in F} t' \\in X_f\\)). \\((\\impliedby)\\) Given an S1S formula \\(\\Phi\\), translate it inductively into an NBA: atomic formulas (\\(x < y\\), \\(S(x, y)\\), \\(x \\in X\\)) compile into simple fixed-state NBAs; disjunction and conjunction compile into union and intersection of NBAs; negation \\(\\neg\\) compiles into Büchi complementation (Theorem 9); and existential quantification \\(\\exists X\\) compiles into projection (erasing the track for \\(X\\)). Conclude decidability by reducing validity of a sentence \\(\\Phi\\) to checking emptiness of \\(\\mathcal{A}_{\\neg\\Phi}\\).",
  "invariant": "\\(\\forall w \\in \\Sigma^\\omega,\\; w \\models \\Phi \\iff w \\in L(\\mathcal{A}_\\Phi)\\)",
  "synthesis": "Let \\(\\mathcal{A}=(Q,\\Sigma,\\Delta,q_0,F)\\) with \\(Q=\\{0,\\dots,m-1\\}\\). An accepting run \\(\\rho:\\mathbb{N}\\to Q\\) is uniquely represented by a partition of \\(\\mathbb{N}\\) into sets \\(X_0,\\dots,X_{m-1}\\) where \\(X_i=\\{t\\in\\mathbb{N}\\mid \\rho(t)=i\\}\\). The S1S sentence \\(\\Phi_\\mathcal{A}\\) asserts: \\(\\exists X_0\\dots\\exists X_{m-1}\\; \\bigl[\\forall t\\, \\bigvee_{i} (t\\in X_i \\land \\bigwedge_{j\\neq i} t\\notin X_j) \\land 0\\in X_0 \\land \\forall t\\, \\bigwedge_{a\\in\\Sigma} (P_a(t) \\to \\bigvee_{(i,a,j)\\in\\Delta} (t\\in X_i \\land t+1\\in X_j)) \\land \\forall t\\, \\exists t'>t\\, \\bigvee_{f\\in F} t'\\in X_f\\bigr]\\). Then \\(w\\models \\Phi_\\mathcal{A} \\iff w\\in L(\\mathcal{A})\\). Conversely, every S1S formula is built from atoms \\(x\\in P_a\\), \\(x\\in X\\), \\(x<y\\), \\(y=x+1\\) via \\(\\lor, \\neg, \\exists\\). Atomic formulas translate to finite-state automata reading tracks in \\(\\Sigma \\times \\{0,1\\}^k\\). Conjunction and disjunction translate to automaton product and union. Existential quantification \\(\\exists X\\) erases the corresponding boolean track from the alphabet, which preserves \\(\\omega\\)-regularity by non-deterministic guessing. Negation \\(\\neg\\Phi\\) translates to Büchi complementation, which preserves \\(\\omega\\)-regularity by Büchi's complementation theorem. For a closed sentence \\(\\Phi\\), \\(\\mathcal{A}_\\Phi\\) operates over the 1-letter alphabet \\(\\{0\\}\\); deciding \\(\\models \\Phi\\) reduces to checking \\(L(\\mathcal{A}_\\Phi) = \\{0\\}^\\omega \\iff L(\\mathcal{A}_{\\neg\\Phi}) = \\emptyset\\), which is decidable in linear time.",
  "diagram": {
    "description": "Translation bridge between S1S logical quantification and Büchi automaton operations (projection, complementation, and emptiness test).",
    "viewBox": [
      0,
      0,
      1000,
      520
    ],
    "lanes": [
      {
        "y": 160,
        "label": "Logical Domain: S1S Formula Φ",
        "labelX": 35,
        "labelY": 45
      },
      {
        "y": 340,
        "label": "Automata Domain: Büchi Automaton Ⅎᵦ",
        "labelX": 35,
        "labelY": 220
      },
      {
        "y": 490,
        "label": "Decision Engine: Emptiness & Lasso Check",
        "labelX": 35,
        "labelY": 390
      }
    ],
    "nodes": [
      {
        "id": "s1s_phi",
        "x": 200,
        "y": 100,
        "label": "∃X Ψ(X)",
        "detail": "S1S sentence",
        "shape": "rect",
        "width": 150,
        "height": 60
      },
      {
        "id": "s1s_atoms",
        "x": 500,
        "y": 100,
        "label": "x < y, x ∈ X",
        "detail": "atomic formulas",
        "shape": "rect",
        "width": 150,
        "height": 60
      },
      {
        "id": "s1s_neg",
        "x": 800,
        "y": 100,
        "label": "¬ Φ",
        "detail": "negation",
        "shape": "rect",
        "width": 140,
        "height": 60
      },
      {
        "id": "nba_atoms",
        "x": 500,
        "y": 260,
        "label": "Ⅎ_atoms",
        "detail": "atomic NBAs",
        "shape": "circle",
        "r": 48
      },
      {
        "id": "nba_proj",
        "x": 200,
        "y": 260,
        "label": "Projection π",
        "detail": "erase track X",
        "shape": "circle",
        "r": 48
      },
      {
        "id": "nba_comp",
        "x": 800,
        "y": 260,
        "label": "Compl(Ⅎ)",
        "detail": "Büchi complement",
        "shape": "circle",
        "r": 48
      },
      {
        "id": "decider",
        "x": 500,
        "y": 430,
        "label": "L(Ⅎ) ≠ ∅ ?",
        "detail": "lasso cycle test",
        "shape": "rect",
        "width": 180,
        "height": 64,
        "accepting": true
      }
    ],
    "edges": [
      {
        "id": "e-atom-trans",
        "from": "s1s_atoms",
        "to": "nba_atoms",
        "label": "compile atom",
        "labelX": 520,
        "labelY": 180
      },
      {
        "id": "e-phi-proj",
        "from": "s1s_phi",
        "to": "nba_proj",
        "label": "∃X ↦ π",
        "labelX": 220,
        "labelY": 180
      },
      {
        "id": "e-neg-comp",
        "from": "s1s_neg",
        "to": "nba_comp",
        "label": "¬ ↦ compl",
        "labelX": 820,
        "labelY": 180
      },
      {
        "id": "e-proj-decide",
        "from": "nba_proj",
        "to": "decider",
        "label": "compiled Ⅎ",
        "path": "M 240 290 C 320 370 410 410 440 425",
        "labelX": 340,
        "labelY": 370
      },
      {
        "id": "e-atoms-decide",
        "from": "nba_atoms",
        "to": "decider",
        "label": "product / union",
        "labelX": 520,
        "labelY": 350
      },
      {
        "id": "e-comp-decide",
        "from": "nba_comp",
        "to": "decider",
        "label": "closed sentence",
        "path": "M 760 290 C 680 370 590 410 560 425",
        "labelX": 680,
        "labelY": 370
      }
    ],
    "annotations": [
      {
        "x": 500,
        "y": 505,
        "text": "S1S is decidable: ⊨ Φ ⟺ L(Ⅎ_¬Φ) = ∅ (decidable in linear time on Ⅎ).",
        "anchor": "middle"
      }
    ]
  },
  "steps": [
    {
      "label": "Automaton to Logic",
      "title": "Encoding an infinite accepting run into second-order variables",
      "exposition": "Given an NBA \\(\\mathcal{A} = (Q, \\Sigma, \\Delta, q_0, F)\\) with \\(m\\) states \\(Q = \\{0, \\dots, m-1\\}\\), an accepting run \\(\\rho: \\mathbb{N} \\to Q\\) is an infinite sequence of states. We express the existence of such a run in S1S.",
      "question": "How does S1S represent the run of an automaton over infinite positions?",
      "choices": [
        {
          "text": "By existentially quantifying \\(m\\) second-order set variables \\(X_0, \\dots, X_{m-1}\\), where \\(t \\in X_i\\) asserts that the automaton is in state \\(i\\) at time step \\(t\\).",
          "correct": true,
          "feedback": "Correct. Monadic second-order variables represent subsets of \\(\\mathbb{N}\\). A collection of \\(m\\) disjoint subsets partitions the time steps into the exact sequence of states visited by the run."
        },
        {
          "text": "By using a single first-order integer variable to store the infinite state sequence as an integer.",
          "correct": false,
          "causalFailure": "First-order variables in S1S quantify only individual positions (integers \\(t \\in \\mathbb{N}\\)), which cannot encode an entire infinite sequence."
        },
        {
          "text": "By writing an infinite conjunction of propositional formulas for every position \\(t \\in \\mathbb{N}\\).",
          "correct": false,
          "causalFailure": "Formulas in S1S are finite syntactic expressions; infinite formulas are not allowed in first- or second-order logic."
        }
      ],
      "hint": "Recall what monadic second-order logic allows you to quantify: sets of positions.",
      "formal": "\\(\\exists X_0 \\dots \\exists X_{m-1} \\left[ \\text{Partition}(X) \\land 0 \\in X_{q_0} \\land \\text{Step}(X) \\land \\text{BüchiAccept}(X) \\right]\\).",
      "preview": {
        "activeNodes": [
          "s1s_phi"
        ],
        "activeEdges": []
      },
      "reveal": {
        "activeNodes": [
          "s1s_phi",
          "nba_proj"
        ],
        "activeEdges": [
          "e-phi-proj"
        ],
        "goodNodes": [
          "s1s_phi",
          "nba_proj"
        ]
      },
      "previewNote": "S1S sentence asserting existence of run.",
      "revealNote": "Existential quantification over sets X₀..X_{m-1} faithfully mirrors NBA run branching."
    },
    {
      "label": "Atomic Translation",
      "title": "Translating atomic logic relations into elementary Büchi automata",
      "exposition": "For the converse, we translate S1S formulas into automata. Formulas contain free first- and second-order variables. We represent a variable valuation as an infinite word over the expanded alphabet \\(\\Sigma \\times \\{0, 1\\}^k\\), where track \\(i\\) contains a 1 at position \\(t\\) iff \\(t \\in X_i\\).",
      "question": "Why can the atomic relation x < y be recognized by a finite-state Büchi automaton?",
      "choices": [
        {
          "text": "Because an automaton needs only 3 states: scanning zeros until the unique 1 for \\(x\\) is seen, verifying that the unique 1 for \\(y\\) occurs strictly later, and accepting.",
          "correct": true,
          "feedback": "Precisely. Checking \\(x < y\\) requires detecting the marker for \\(x\\) before the marker for \\(y\\). A simple 3-state deterministic automaton performs this verification effortlessly."
        },
        {
          "text": "Because the relation \\(x < y\\) requires an unbounded pushdown stack to count the distance between \\(x\\) and \\(y\\).",
          "correct": false,
          "causalFailure": "The actual numerical distance between \\(x\\) and \\(y\\) is irrelevant; only the relative temporal order of their markers matters, which requires zero stack memory."
        },
        {
          "text": "Because \\(x < y\\) is an axiom that does not require any automaton representation.",
          "correct": false,
          "causalFailure": "In an inductive translation, every atomic predicate must be represented by a concrete automaton reading the variable tracks."
        }
      ],
      "hint": "Does checking whether x appears before y require counting the distance, or just remembering that x was already seen?",
      "formal": "\\(\\mathcal{A}_{x < y}\\) has states \\(\\{q_{\\text{start}}, q_{\\text{saw\\_x}}, q_{\\text{accept}}\\}\\) and accepts track words having unique 1s with \\(1_x\\) strictly before \\(1_y\\).",
      "preview": {
        "activeNodes": [
          "s1s_atoms"
        ],
        "activeEdges": []
      },
      "reveal": {
        "activeNodes": [
          "s1s_atoms",
          "nba_atoms"
        ],
        "activeEdges": [
          "e-atom-trans"
        ],
        "goodNodes": [
          "s1s_atoms",
          "nba_atoms"
        ]
      },
      "previewNote": "S1S atomic formulas x < y and x ∈ X.",
      "revealNote": "3-state Büchi automaton recognizes track word validations."
    },
    {
      "label": "Inductive Connectives",
      "title": "Logical connectives and quantifier projection",
      "exposition": "We build automata for compound formulas \\(\\Phi_1 \\lor \\Phi_2\\), \\(\\neg\\Phi\\), and \\(\\exists X\\, \\Phi\\). We know from earlier chapters that Büchi automata are closed under union and complementation.",
      "question": "Which automata operation corresponds to existential second-order quantification ∃X Φ?",
      "choices": [
        {
          "text": "Alphabet projection: erasing the boolean track for \\(X\\) from the alphabet, transforming deterministic transitions into non-deterministic guesses of the erased track.",
          "correct": true,
          "feedback": "Spot on. If \\(\\mathcal{A}_\\Phi\\) operates over \\(\\Sigma \\times \\{0, 1\\}\\), erasing the \\(\\{0, 1\\}\\) track yields an automaton over \\(\\Sigma\\). A word \\(w\\) is accepted iff there exists a track assignment for \\(X\\) that was accepted by \\(\\mathcal{A}_\\Phi\\)."
        },
        {
          "text": "State minimization: computing the Myhill–Nerode quotient to eliminate variable \\(X\\).",
          "correct": false,
          "causalFailure": "Minimization reduces redundant states for the same language, but does not eliminate an input variable track."
        },
        {
          "text": "Kripke synchronization: intersecting the automaton with a universal model checker.",
          "correct": false,
          "causalFailure": "Kripke synchronization corresponds to conjunction with a system model, not existential projection."
        }
      ],
      "hint": "Quantifying ∃X means: does there exist an assignment to track X making the rest accept?",
      "formal": "\\(L(\\mathcal{A}_{\\exists X \\Phi}) = \\pi_\\Sigma(L(\\mathcal{A}_\\Phi))\\). Non-deterministic projection preserves \\(\\omega\\)-regularity.",
      "preview": {
        "activeNodes": [
          "nba_proj"
        ],
        "activeEdges": []
      },
      "reveal": {
        "activeNodes": [
          "nba_proj",
          "nba_comp",
          "s1s_neg"
        ],
        "activeEdges": [
          "e-neg-comp"
        ],
        "goodNodes": [
          "nba_proj",
          "nba_comp"
        ]
      },
      "previewNote": "Track projection implements existential quantification.",
      "revealNote": "Büchi complementation implements logical negation ¬: all connectives closed."
    },
    {
      "label": "Decidability",
      "title": "Decidability of S1S via Büchi emptiness",
      "exposition": "Let \\(\\Phi\\) be a closed S1S sentence (no free variables). Following the inductive compilation, we construct an automaton \\(\\mathcal{A}_\\Phi\\) over the 1-letter alphabet \\(\\Sigma = \\{0\\}\\).",
      "question": "How is the validity of the S1S sentence Φ decided via the compiled automaton?",
      "choices": [
        {
          "text": "\\(\\Phi\\) is valid \\(\\iff L(\\mathcal{A}_{\\neg\\Phi}) = \\emptyset\\), which is decidable in linear time by searching for a reachable accepting cycle in the compiled automaton.",
          "correct": true,
          "feedback": "Precisely. A sentence is valid iff its negation has no models. Compiling \\(\\neg\\Phi\\) to \\(\\mathcal{A}_{\\neg\\Phi}\\) reduces the decision problem to Büchi emptiness, which runs in linear time \\(O(|Q| + |\\Delta|)\\) on the automaton."
        },
        {
          "text": "By simulating the automaton on all infinitely many words of \\(\\{0\\}^\\omega\\) one by one.",
          "correct": false,
          "causalFailure": "Simulating infinitely many infinite words one by one is non-terminating and impossible."
        },
        {
          "text": "By verifying that the automaton has no unreachable states.",
          "correct": false,
          "causalFailure": "Having unreachable states has nothing to do with whether the language contains words; emptiness requires checking reachable cycles through \\(F\\)."
        }
      ],
      "hint": "Validity is equivalent to unsatisfiability of the negation. How do we test unsatisfiability in automata theory?",
      "formal": "\\(\\mathbb{N} \\models \\Phi \\iff L(\\mathcal{A}_\\Phi) = \\Sigma^\\omega \\iff L(\\mathcal{A}_{\\neg\\Phi}) = \\emptyset\\). Decidable via Theorem 3.4.",
      "preview": {
        "activeNodes": [
          "decider"
        ],
        "activeEdges": []
      },
      "reveal": {
        "activeNodes": [
          "decider",
          "nba_comp"
        ],
        "activeEdges": [
          "e-comp-decide"
        ],
        "goodNodes": [
          "decider"
        ]
      },
      "previewNote": "Compiled automaton for ¬Φ over 1-letter alphabet.",
      "revealNote": "Büchi emptiness test decides truth of S1S sentence Φ: Church's problem solved."
    }
  ],
  "previous": {
    "label": "Parity game determinacy",
    "href": "/proofs/chapter-05/parity-determinacy.html"
  },
  "next": {
    "label": "McNaughton determinization",
    "href": "/proofs/chapter-09/mcnaughton-determinization.html"
  }
},

    "mcnaughton-determinization": {
  "slug": "mcnaughton-determinization",
  "chapter": 9,
  "title": "McNaughton's determinization theorem (1966)",
  "theorem": "Every non-deterministic Büchi automaton (NBA) \\(\\mathcal{A}\\) has an equivalent deterministic Muller automaton (DMA) \\(\\mathcal{D}_M\\) and an equivalent deterministic parity automaton (DPA) \\(\\mathcal{D}_P\\): \\(\\mathcal{L}(\\mathrm{NBA}) = \\mathcal{L}(\\mathrm{DMA}) = \\mathcal{L}(\\mathrm{DPA})\\).",
  "intro": "For finite words, NFAs determinize into DFAs via the classical subset construction. For infinite words, this construction completely breaks down: deterministic Büchi automata (DBAs) are strictly weaker than NBAs (e.g. they cannot recognize (a+b)* b^ω). In 1966, Robert McNaughton solved this deep open problem by proving that determinism can be restored if one upgrades the acceptance condition to Muller or Parity conditions, tracked by structured breakpoint or Safra trees.",
  "application": "McNaughton determinization is the vital cornerstone of reactive synthesis (Church's problem). To synthesize a controller from an LTL specification, one must determinize the automaton into a deterministic parity automaton (DPA), enabling game solving and strategy extraction without clairvoyant non-deterministic guessing.",
  "strategy": "Step 1: Understand the failure of DBA determinization: in \\(L = (a+b)^* b^\\omega\\), after any finite sequence of \\(b\\)'s, a deterministic automaton cannot know if this is the definitive infinite suffix of \\(b\\)'s or if another \\(a\\) will appear; if it enters an accepting state, an adversary playing \\(a\\) catches it; if it never enters, \\(b^\\omega\\) is rejected. Step 2: Muller and Parity conditions: instead of checking \\(\\mathrm{Inf}(\\rho) \\cap F \\neq \\emptyset\\), Muller acceptance specifies a family of subsets \\(\\mathcal{F} \\subseteq 2^Q\\) and accepts iff \\(\\mathrm{Inf}(\\rho) \\in \\mathcal{F}\\). Parity acceptance assigns integer colors and checks the parity of the maximum color seen infinitely often. Step 3: Safra's tree construction: organize macro-states not as a flat subset, but as a tree of subsets with bounded height. A node spawns children to monitor new accepting paths; when a child's descendants cover all parent states, a breakpoint is reached and the node flashes a green signal (color emission). Step 4: Parity compaction: bounded nodes and names yield a deterministic automaton with \\(2^{O(n \\log n)}\\) states and \\(2n\\) parity colors, establishing full equivalence.",
  "invariant": "\\(\\forall w \\in \\Sigma^\\omega,\\; \\text{Safra tree run emits even parity infinitely often} \\iff \\exists \\text{ accepting NBA run on } w\\)",
  "synthesis": "Let \\(\\mathcal{A}=(Q,\\Sigma,\\Delta,q_0,F)\\) be an NBA with \\(|Q|=n\\). The language \\((a+b)^* b^\\omega\\) proves that deterministic Büchi automata are strictly less expressive than NBAs. McNaughton's theorem overcomes this by enriching the acceptance mechanism. Safra's determinization algorithm structures the deterministic macro-state as an ordered tree of subsets of \\(Q\\) whose nodes are labeled with unique names from \\(\\{1, \\dots, 2n\\}\\). At each step on symbol \\(a\\): (1) every node \\(v\\) updates its subset to \\(\\Delta(S_v, a)\\); (2) for every node \\(v\\), if \\(S_v \\cap F \\neq \\emptyset\\), a new rightmost child is spawned with subset \\(S_v \\cap F\\); (3) horizontal pruning: states appearing in multiple siblings are removed from right-hand siblings to maintain disjointness; (4) vertical collapse: if the union of children's subsets equals the parent's subset \\(S_v\\), all children are deleted and node \\(v\\) flashes a green success signal. The tree height is bounded by \\(n\\) and the number of nodes by \\(n\\). Assigning parity priorities based on the lowest flashed node name converts the Safra automaton into an equivalent Deterministic Parity Automaton with \\(2^{O(n \\log n)}\\) states, proving \\(\\mathcal{L}(\\mathrm{NBA}) = \\mathcal{L}(\\mathrm{DPA}) = \\mathcal{L}(\\mathrm{DMA})\\).",
  "diagram": {
    "description": "Safra tree node evolution showing subset tracking, child spawning on accepting states, horizontal pruning, and vertical collapse (green flash).",
    "viewBox": [
      0,
      0,
      1000,
      520
    ],
    "lanes": [
      {
        "y": 160,
        "label": "Root Macro-State (All Active Runs)",
        "labelX": 35,
        "labelY": 45
      },
      {
        "y": 340,
        "label": "Safra Child Nodes (Monitoring Accepting Threads)",
        "labelX": 35,
        "labelY": 220
      },
      {
        "y": 490,
        "label": "Deterministic Parity Condition (Priority Emission)",
        "labelX": 35,
        "labelY": 390
      }
    ],
    "nodes": [
      {
        "id": "root",
        "x": 500,
        "y": 100,
        "label": "Root Node {q₀, q₁}",
        "detail": "tracks all active threads",
        "shape": "rect",
        "width": 220,
        "height": 60
      },
      {
        "id": "child1",
        "x": 300,
        "y": 260,
        "label": "Child 1 {q₁ ∈ F}",
        "detail": "spawned on visit to F",
        "shape": "rect",
        "width": 180,
        "height": 60
      },
      {
        "id": "child2",
        "x": 700,
        "y": 260,
        "label": "Child 2 {q₂}",
        "detail": "pruned disjoint subset",
        "shape": "rect",
        "width": 180,
        "height": 60
      },
      {
        "id": "collapse",
        "x": 500,
        "y": 430,
        "label": "Green Flash (Collapse)",
        "detail": "children cover parent ⟹ even priority",
        "shape": "rect",
        "width": 280,
        "height": 64,
        "accepting": true
      }
    ],
    "edges": [
      {
        "id": "e-root-c1",
        "from": "root",
        "to": "child1",
        "label": "spawn on F",
        "labelX": 360,
        "labelY": 180
      },
      {
        "id": "e-root-c2",
        "from": "root",
        "to": "child2",
        "label": "subset split",
        "labelX": 640,
        "labelY": 180
      },
      {
        "id": "e-c1-c2",
        "from": "child1",
        "to": "child2",
        "label": "horizontal pruning",
        "labelY": 240
      },
      {
        "id": "e-c1-coll",
        "from": "child1",
        "to": "collapse",
        "label": "cover parent",
        "labelX": 370,
        "labelY": 360
      },
      {
        "id": "e-c2-coll",
        "from": "child2",
        "to": "collapse",
        "label": "children union = parent",
        "labelX": 630,
        "labelY": 360
      }
    ],
    "annotations": [
      {
        "x": 500,
        "y": 505,
        "text": "Safra tree determinization produces an equivalent DPA with 2^{O(n log n)} states.",
        "anchor": "middle"
      }
    ]
  },
  "steps": [
    {
      "label": "DBA Incompleteness",
      "title": "Why deterministic Büchi automata fail to recognize all omega-languages",
      "exposition": "Consider the language \\(L = (a+b)^* b^\\omega\\) consisting of infinite words with only finitely many \\(a\\)'s. An NBA easily recognizes \\(L\\) by non-deterministically guessing the position of the last \\(a\\) and looping in an accepting state on \\(b\\). We analyze why a deterministic Büchi automaton cannot recognize \\(L\\).",
      "question": "Why is the language L = (a+b)* b^ω impossible to recognize with a deterministic Büchi automaton?",
      "choices": [
        {
          "text": "Because reading words \\(b^{n_1} a b^{n_2} a \\dots\\) forces a deterministic automaton to either visit an accepting state infinitely often on an infinite sequence of \\(a\\)'s, or never accept \\(b^\\omega\\).",
          "correct": true,
          "feedback": "Correct. If a DBA accepts \\(b^\\omega\\), it must visit \\(F\\) after some \\(b^{n_1}\\). Appending \\(a b^{n_2}\\) forces it to visit \\(F\\) again. Repeating this builds a word with infinitely many \\(a\\)'s that the DBA erroneously accepts."
        },
        {
          "text": "Because Büchi automata cannot have transitions labeled with the letter b.",
          "correct": false,
          "causalFailure": "Automata alphabets routinely contain any finite set of symbols, including \\(b\\)."
        },
        {
          "text": "Because (a+b)* b^ω is not an omega-regular language.",
          "correct": false,
          "causalFailure": "The language is completely \\(\\omega\\)-regular and accepted by a 2-state NBA; it simply cannot be recognized deterministically under Büchi acceptance."
        }
      ],
      "hint": "Think about Landweber's lemma: if a DBA accepts, what happens when an adversary repeatedly extends prefixes after accepting visits?",
      "formal": "\\(\\mathcal{L}(\\mathrm{DBA}) \\subsetneq \\mathcal{L}(\\mathrm{NBA})\\). Specifically, \\((a+b)^* b^\\omega \\in \\mathcal{L}(\\mathrm{NBA}) \\setminus \\mathcal{L}(\\mathrm{DBA})\\).",
      "preview": {
        "activeNodes": [
          "root"
        ],
        "activeEdges": []
      },
      "reveal": {
        "activeNodes": [
          "root",
          "child1"
        ],
        "activeEdges": [
          "e-root-c1"
        ]
      },
      "previewNote": "Deterministic tracking without guessing.",
      "revealNote": "DBA trapped by adversary: richer acceptance condition required."
    },
    {
      "label": "Acceptance Upgrade",
      "title": "Muller and Parity conditions: observing the recurring set",
      "exposition": "To restore determinism, McNaughton upgraded the acceptance condition from visiting \\(F\\) to observing the exact set of infinitely recurring states: \\(\\mathrm{Inf}(\\rho)\\). Muller acceptance defines a table \\(\\mathcal{F} \\subseteq 2^Q\\) of allowable recurring sets; Parity acceptance colors states and checks \\(\\max \\mathrm{Inf}(\\Omega(\\rho)) \\pmod 2 = 0\\).",
      "question": "How does the Muller/Parity condition overcome the limitation of Büchi acceptance?",
      "choices": [
        {
          "text": "By distinguishing between visiting a set of states and being trapped inside that exact set forever: it can accept runs that stay inside \\(\\{q_b\\}\\) while rejecting runs that also visit \\(q_a\\).",
          "correct": true,
          "feedback": "Spot on. A Muller automaton can specify that \\(\\{q_b\\}\\) is an accepting recurring set (\\(\\{q_b\\} \\in \\mathcal{F}\\)), while \\(\\{q_a, q_b\\} \\notin \\mathcal{F}\\). Thus visiting \\(q_a\\) infinitely often rejects, solving \\((a+b)^* b^\\omega\\)."
        },
        {
          "text": "By converting the infinite word into a finite word using end-of-file delimiters.",
          "correct": false,
          "causalFailure": "Infinite words have no end-of-file markers; Muller conditions operate on the genuine infinite limit set \\(\\mathrm{Inf}(\\rho)\\)."
        },
        {
          "text": "By replacing the deterministic state space with continuous real-valued coordinates.",
          "correct": false,
          "causalFailure": "Muller and Parity automata remain completely discrete, finite-state machines."
        }
      ],
      "hint": "Look at the recurring set: Inf(ρ) = {qb} versus Inf(ρ) = {qa, qb}. Can Muller acceptance distinguish them?",
      "formal": "\\(\\text{Muller: } \\mathrm{Inf}(\\rho) \\in \\mathcal{F}\\). For \\((a+b)^* b^\\omega\\), set \\(\\mathcal{F} = \\{ \\{q_b\\} \\}\\), rejecting \\(\\{q_a, q_b\\}\\).",
      "preview": {
        "activeNodes": [
          "root",
          "child1"
        ],
        "activeEdges": [
          "e-root-c1"
        ]
      },
      "reveal": {
        "activeNodes": [
          "root",
          "child1",
          "child2"
        ],
        "activeEdges": [
          "e-root-c1",
          "e-root-c2",
          "e-c1-c2"
        ],
        "goodNodes": [
          "child1"
        ]
      },
      "previewNote": "Tracking separate recurring threads.",
      "revealNote": "Muller condition discriminates exact infinite sets: determinism becomes expressively complete."
    },
    {
      "label": "Safra Trees",
      "title": "Tree-structured macro-states and breakpoint detection",
      "exposition": "Safra's algorithm maintains a tree of subsets. The root tracks all active runs. When states in a node \\(v\\) hit \\(F\\), a child is spawned to monitor whether those accepting threads can continue forever without dying. When the children's threads collectively cover the parent, a cycle of accepting visits has occurred.",
      "question": "What happens during a vertical collapse in a Safra tree?",
      "choices": [
        {
          "text": "If the union of children's subsets equals the parent's subset, all children are deleted and the parent flashes a success signal, certifying that all active paths traversed accepting states.",
          "correct": true,
          "feedback": "Precisely. If the children cover the parent, every thread currently alive has passed through an accepting state since the child was spawned. The children have fulfilled their mission, so they collapse, flashing a green breakpoint."
        },
        {
          "text": "The parent node is deleted and the automaton resets to the initial state.",
          "correct": false,
          "causalFailure": "Deleting the parent would lose track of all active simulation paths; only the fulfilled children are collapsed into the parent."
        },
        {
          "text": "The automaton branches into two parallel non-deterministic copies.",
          "correct": false,
          "causalFailure": "Safra's construction is strictly deterministic; no non-deterministic branching ever occurs."
        }
      ],
      "hint": "Why did we create the children? To check if every path through the parent hit F. What does it mean when children cover the parent?",
      "formal": "\\(\\bigcup_{c \\in \\text{children}(v)} S_c = S_v \\implies \\text{remove children}(v) \\land \\text{emit\\_breakpoint}(v)\\).",
      "preview": {
        "activeNodes": [
          "child1",
          "child2"
        ],
        "activeEdges": [
          "e-c1-c2"
        ]
      },
      "reveal": {
        "activeNodes": [
          "collapse"
        ],
        "activeEdges": [
          "e-c1-coll",
          "e-c2-coll"
        ],
        "goodNodes": [
          "collapse"
        ]
      },
      "previewNote": "Children monitoring accepting branches.",
      "revealNote": "Vertical collapse: union covers parent ⟹ green flash event emitted."
    },
    {
      "label": "Determinization Theorem",
      "title": "Full equivalence of NBA, DMA, and DPA",
      "exposition": "By bounding the number of tree nodes by \\(n\\) and using names from \\(\\{1, \\dots, 2n\\}\\), the Safra tree automaton has at most \\(2^{O(n \\log n)}\\) states. Flashed node names directly define the priorities of a Deterministic Parity Automaton (DPA).",
      "question": "What is the ultimate consequence of McNaughton's theorem for omega-automata theory?",
      "choices": [
        {
          "text": "\\(\\mathcal{L}(\\mathrm{NBA}) = \\mathcal{L}(\\mathrm{DMA}) = \\mathcal{L}(\\mathrm{DPA})\\): every \\(\\omega\\)-regular language can be recognized deterministically, enabling game solving and reactive synthesis.",
          "correct": true,
          "feedback": "Spot on. While deterministic Büchi automata are incomplete, upgrading to Muller or Parity acceptance achieves 100% expressive equivalence with non-deterministic automata."
        },
        {
          "text": "Non-deterministic Büchi automata are proven to be strictly more powerful than any deterministic automaton condition.",
          "correct": false,
          "causalFailure": "McNaughton proved the exact opposite: deterministic Muller and Parity automata are fully as expressive as NBAs."
        },
        {
          "text": "Every Büchi automaton can be determinized with at most n states.",
          "correct": false,
          "causalFailure": "Determinization incurs an inevitable \\(2^{\\Omega(n \\log n)}\\) state blowup in the worst case."
        }
      ],
      "hint": "Remember the three classes of automata: NBA, DMA, DPA. What is their relative expressive power?",
      "formal": "\\(\\mathcal{L}(\\mathrm{NBA}) = \\mathcal{L}(\\mathrm{DMA}) = \\mathcal{L}(\\mathrm{DPA})\\). State blowup: \\(2^{O(n \\log n)}\\), priorities: \\(2n\\).",
      "preview": {
        "activeNodes": [
          "root",
          "collapse"
        ],
        "activeEdges": []
      },
      "reveal": {
        "activeNodes": [
          "root",
          "child1",
          "child2",
          "collapse"
        ],
        "activeEdges": [
          "e-root-c1",
          "e-root-c2",
          "e-c1-coll",
          "e-c2-coll"
        ],
        "goodNodes": [
          "collapse"
        ]
      },
      "previewNote": "Safra tree with bounded names.",
      "revealNote": "McNaughton equivalence established: Ⅎ(NBA) = Ⅎ(DMA) = Ⅎ(DPA)."
    }
  ],
  "previous": {
    "label": "Büchi S1S decidability",
    "href": "/proofs/chapter-08/s1s-buchi.html"
  },
  "next": {
    "label": "McNaughton–Papert theorem",
    "href": "/proofs/chapter-09/mcnaughton-papert.html"
  }
},

    "mcnaughton-papert": {
  "slug": "mcnaughton-papert",
  "chapter": 9,
  "title": "McNaughton–Papert & Schützenberger theorem (1971)",
  "theorem": "For every regular language \\(L \\subseteq \\Sigma^*\\), the following conditions are equivalent: (1) \\(L\\) is star-free (definable from letters via concatenation, boolean operations, and complementation, without Kleene star); (2) \\(L\\) is definable in first-order logic of linear order \\(\\mathrm{FO}[<]\\); (3) the syntactic monoid \\(M(L)\\) is aperiodic (counter-free: \\(\\exists n \\ge 1.\\, \\forall s \\in M(L),\\; s^{n+1} = s^n\\)).",
  "intro": "The celebrated McNaughton–Papert (1971) and Schützenberger (1965) theorems form one of the deepest trilateral equivalences in theoretical computer science. They link formal language theory (star-free regular expressions), mathematical logic (first-order logic over words), and abstract algebra (aperiodic semigroups). The theorem precisely identifies what automata can do when they are stripped of the ability to count modulo an integer.",
  "application": "This theorem is the bridge between Linear Temporal Logic (LTL) and automata. By Kamp's theorem, LTL has the exact expressive power of FO[<]. Hence, an automaton specification can be translated into an LTL formula if and only if its minimal DFA has an aperiodic syntactic monoid (no counting loops like (aa)*).",
  "strategy": "Prove the triangular equivalence \\((1) \\iff (2) \\iff (3)\\). Step 1: Star-free expressions vs counting: express \\(\\Sigma^* = \\emptyset^c\\) and \\(a \\Sigma^* = a \\emptyset^c\\) without Kleene star, but show that \\((aa)^*\\) (even length) inherently requires counting modulo 2, making it non-star-free. Step 2: First-order logic \\(\\mathrm{FO}[<]\\) and Ehrenfeucht–Fraïssé games: prove that a sentence of quantifier depth \\(k\\) cannot distinguish between words of length \\(2^k\\) and \\(2^k + 1\\); hence \\(\\mathrm{FO}[<]\\) cannot express modulo counting. Step 3: Algebraic aperiodicity: define the syntactic monoid \\(M(L) = \\Sigma^* / \\equiv_L\\); show that if \\(M(L)\\) contains a non-trivial permutation group (e.g. an element satisfying \\(s^2 = 1 \\neq s\\)), the automaton counts mod 2; aperiodicity requires that for sufficiently large \\(n\\), \\(s^{n+1} = s^n\\) (all cycles are self-loops). Step 4: Synthesize the full equivalence: star-free compilation into FO[<] and aperiodic monoid decomposition (Krohn–Rhodes theorem).",
  "invariant": "\\(L \\in \\text{Star-Free} \\iff L \\in \\mathrm{FO}[<] \\iff \\forall s \\in M(L),\\; \\exists n.\\; s^{n+1} = s^n\\)",
  "synthesis": "Let \\(L\\subseteq \\Sigma^*\\). (1) \\(\\implies\\) (2): Every star-free expression is translated inductively into an \\(\\mathrm{FO}[<]\\) formula: letters \\(a\\) become \\(P_a(x)\\), concatenation \\(E_1 \\cdot E_2\\) becomes \\(\\exists y.\\, \\Phi_1^{< y} \\land \\Phi_2^{> y}\\), and complementation becomes logical negation \\(\\neg\\Phi\\). (2) \\(\\implies\\) (3): Let \\(\\Phi\\) be an \\(\\mathrm{FO}[<]\\) sentence with quantifier depth \\(k\\). By the Ehrenfeucht–Fraïssé theorem, Duplicator wins the \\(k\\)-pebble game on word pairs whose letter-neighborhoods match up to threshold \\(2^k\\). If \\(s \\in M(L)\\) induced a non-trivial group with identity \\(e\\) and generator \\(g \\neq e\\) such that \\(g^p = e\\) (\\(p \\ge 2\\)), Duplicator could not distinguish \\(g^{2^k}\\) from \\(g^{2^k + p}\\), forcing \\(g^{2^k} \\equiv_L g^{2^k + p}\\), which contradicts \\(g \\neq e\\). Hence \\(M(L)\\) contains no non-trivial subgroups, proving \\(\\exists n.\\, \\forall s \\in M(L),\\, s^{n+1} = s^n\\) (aperiodicity). (3) \\(\\implies\\) (1): Schützenberger's algebraic induction: every finite aperiodic monoid can be decomposed via wreath product into a cascade of two-state reset monoids (flip-flops) by the Krohn–Rhodes theorem. Each reset monoid corresponds to a star-free language, so the entire language \\(L\\) is star-free.",
  "diagram": {
    "description": "Trilateral equivalence between Star-Free regular expressions, First-Order Logic FO[<], and Aperiodic Syntactic Monoids.",
    "viewBox": [
      0,
      0,
      1000,
      520
    ],
    "lanes": [
      {
        "y": 160,
        "label": "Language Theory: Star-Free Expressions",
        "labelX": 35,
        "labelY": 45
      },
      {
        "y": 340,
        "label": "Logic: First-Order Logic FO[<]",
        "labelX": 35,
        "labelY": 220
      },
      {
        "y": 490,
        "label": "Algebra: Aperiodic Syntactic Monoid",
        "labelX": 35,
        "labelY": 390
      }
    ],
    "nodes": [
      {
        "id": "starfree",
        "x": 250,
        "y": 100,
        "label": "Star-Free RegExp",
        "detail": "∅, a, ∪, ·, ¬ (no Kleene *)",
        "shape": "rect",
        "width": 220,
        "height": 60
      },
      {
        "id": "fol",
        "x": 750,
        "y": 100,
        "label": "FO[<] Logic",
        "detail": "quantifiers ∃x, ∀x over positions",
        "shape": "rect",
        "width": 220,
        "height": 60
      },
      {
        "id": "efgame",
        "x": 750,
        "y": 260,
        "label": "EF Games (Depth k)",
        "detail": "cannot count modulo p",
        "shape": "circle",
        "r": 52
      },
      {
        "id": "monoid",
        "x": 250,
        "y": 430,
        "label": "M(L) Aperiodic",
        "detail": "s^{n+1} = s^n (counter-free)",
        "shape": "rect",
        "width": 220,
        "height": 64
      },
      {
        "id": "reset",
        "x": 750,
        "y": 430,
        "label": "Reset Semigroups",
        "detail": "cascade decomposition",
        "shape": "rect",
        "width": 200,
        "height": 60,
        "accepting": true
      }
    ],
    "edges": [
      {
        "id": "e-sf-fo",
        "from": "starfree",
        "to": "fol",
        "label": "inductive syntax translation",
        "labelY": 80
      },
      {
        "id": "e-fo-ef",
        "from": "fol",
        "to": "efgame",
        "label": "quantifier depth k",
        "labelX": 770,
        "labelY": 180
      },
      {
        "id": "e-ef-mon",
        "from": "efgame",
        "to": "monoid",
        "label": "Duplicator wins ⟹ no groups",
        "path": "M 700 280 C 500 340 380 390 330 410",
        "labelX": 520,
        "labelY": 330
      },
      {
        "id": "e-mon-res",
        "from": "monoid",
        "to": "reset",
        "label": "Krohn–Rhodes decomposition",
        "labelY": 410
      },
      {
        "id": "e-res-sf",
        "from": "reset",
        "to": "starfree",
        "label": "reconstruct star-free terms",
        "path": "M 750 400 C 600 240 400 160 330 130",
        "labelX": 530,
        "labelY": 220
      }
    ],
    "annotations": [
      {
        "x": 500,
        "y": 505,
        "text": "A regular language is LTL-definable ⟺ its minimal DFA contains no modulo-counting cycles.",
        "anchor": "middle"
      }
    ]
  },
  "steps": [
    {
      "label": "Star-Free vs Star",
      "title": "Star-free expressions: concatenation and complement without Kleene star",
      "exposition": "A regular expression is star-free if it is constructed from the empty set and alphabet symbols using only concatenation, union, and complementation with respect to \\(\\Sigma^*\\) (denoted \\(\\sim E\\)). The universal language is star-free because \\(\\Sigma^* = \\sim\\emptyset\\). However, not all regular languages are star-free.",
      "question": "Which of the following regular languages is NOT star-free?",
      "choices": [
        {
          "text": "\\(L = (aa)^*\\): the language of words over \\(\\{a\\}\\) of even length.",
          "correct": true,
          "feedback": "Correct. Recognizing \\((aa)^*\\) requires checking that the length is \\(0 \\pmod 2\\). Counting modulo an integer cannot be expressed using only concatenation and complementation without the Kleene star."
        },
        {
          "text": "\\(L = \\Sigma^* a \\Sigma^*\\): the language of words containing at least one 'a'.",
          "correct": false,
          "causalFailure": "This language is completely star-free: it can be written as \\((\\sim\\emptyset) \\cdot a \\cdot (\\sim\\emptyset)\\)."
        },
        {
          "text": "\\(L = \\emptyset\\): the empty language.",
          "correct": false,
          "causalFailure": "The empty language \\(\\emptyset\\) is the base case of star-free expressions."
        }
      ],
      "hint": "Which language requires keeping track of an arithmetic parity counter (mod 2)?",
      "formal": "\\(\\Sigma^* = \\sim\\emptyset \\in \\text{Star-Free}\\), but \\((aa)^* \\notin \\text{Star-Free}\\) because it requires modulo counting.",
      "preview": {
        "activeNodes": [
          "starfree"
        ],
        "activeEdges": []
      },
      "reveal": {
        "activeNodes": [
          "starfree",
          "fol"
        ],
        "activeEdges": [
          "e-sf-fo"
        ],
        "goodNodes": [
          "starfree"
        ]
      },
      "previewNote": "Star-free expressions: booleans and concatenations.",
      "revealNote": "Every star-free expression maps directly to an FO[<] sentence."
    },
    {
      "label": "FO[<] Limits",
      "title": "First-Order Logic and Ehrenfeucht–Fraïssé indistinguishability",
      "exposition": "In First-Order Logic \\(\\mathrm{FO}[<]\\), formulas quantify over word positions \\(x, y \\in \\{1, \\dots, |w|\\}\\) using order \\(x < y\\) and letter predicates \\(P_a(x)\\). The quantifier depth \\(k\\) measures formula complexity. By the Ehrenfeucht–Fraïssé theorem, Duplicator can match moves on long words.",
      "question": "Why is First-Order Logic FO[<] unable to express the language (aa)*?",
      "choices": [
        {
          "text": "Because for any quantifier depth \\(k\\), Duplicator wins the EF game between the word \\(a^{2^k}\\) (even) and \\(a^{2^k + 1}\\) (odd), proving no FO sentence can distinguish even and odd lengths.",
          "correct": true,
          "feedback": "Spot on. With only \\(k\\) pebbles, Spoiler cannot explore distances beyond \\(2^k\\). Two words longer than \\(2^k\\) whose letters are identical appear completely indistinguishable to \\(\\mathrm{FO}[<]\\)."
        },
        {
          "text": "Because FO[<] does not have variables for letters.",
          "correct": false,
          "causalFailure": "FO[<] has unary predicates \\(P_a(x)\\) specifically for testing the letter at position \\(x\\)."
        },
        {
          "text": "Because first-order logic cannot express the relation x < y.",
          "correct": false,
          "causalFailure": "The linear order predicate \\(<\\) is an explicit primitive of \\(\\mathrm{FO}[<]\\)."
        }
      ],
      "hint": "Consider what happens in an Ehrenfeucht–Fraïssé game with k rounds when comparing a^{2^k} and a^{2^k+1}.",
      "formal": "\\(a^{2^k} \\equiv_k a^{2^k + 1}\\). Since one word is in \\((aa)^*\\) and the other is not, \\((aa)^* \\notin \\mathrm{FO}[<]\\).",
      "preview": {
        "activeNodes": [
          "fol",
          "efgame"
        ],
        "activeEdges": [
          "e-fo-ef"
        ]
      },
      "reveal": {
        "activeNodes": [
          "fol",
          "efgame",
          "monoid"
        ],
        "activeEdges": [
          "e-fo-ef",
          "e-ef-mon"
        ],
        "goodNodes": [
          "fol",
          "efgame"
        ]
      },
      "previewNote": "Quantifier depth k bounds horizon.",
      "revealNote": "EF game wins by Duplicator prove FO[<] cannot count modulo p."
    },
    {
      "label": "Aperiodic Semigroups",
      "title": "The algebraic characterization: aperiodicity of the syntactic monoid",
      "exposition": "The syntactic monoid \\(M(L)\\) of a language is the quotient of \\(\\Sigma^*\\) by the two-sided Myhill congruence \\(u \\equiv_L v \\iff \\forall x, y.\\; xuy \\in L \\leftrightarrow xvy \\in L\\). A monoid is aperiodic (or counter-free) if it contains no non-trivial groups.",
      "question": "What algebraic equation characterizes an aperiodic (counter-free) monoid?",
      "choices": [
        {
          "text": "\\(\\exists n \\ge 1.\\, \\forall s \\in M(L),\\; s^{n+1} = s^n\\): every element eventually stabilizes under powers, meaning all cycles are self-loops.",
          "correct": true,
          "feedback": "Precisely. If an element satisfied \\(s^{n+p} = s^n\\) for \\(p \\ge 2\\), the set \\(\\{s^n, \\dots, s^{n+p-1}\\}\\) would form a non-trivial cyclic group of order \\(p\\), counting modulo \\(p\\). Aperiodicity forces \\(p=1\\)."
        },
        {
          "text": "\\(\\forall s \\in M(L),\\; s^2 = 1\\): every element is its own inverse.",
          "correct": false,
          "causalFailure": "This defines a Boolean group (like \\(\\mathbb{Z}_2\\)), which is a non-trivial group that counts modulo 2!"
        },
        {
          "text": "\\(M(L)\\) must have cardinality equal to 1.",
          "correct": false,
          "causalFailure": "A monoid with 1 element recognizes only \\(\\emptyset\\) and \\(\\Sigma^*\\); non-trivial star-free languages have monoids of arbitrary finite size."
        }
      ],
      "hint": "What does it mean for an automaton not to count? In any cycle, repeating the loop must immediately stabilize.",
      "formal": "M(L) \\text{ aperiodic} \\iff \\forall s \\in M(L),\\; \\exists n \\ge 1.\\; s^{n+1} = s^n \\iff M(L) \\text{ is group-free}.",
      "preview": {
        "activeNodes": [
          "monoid"
        ],
        "activeEdges": []
      },
      "reveal": {
        "activeNodes": [
          "monoid",
          "reset"
        ],
        "activeEdges": [
          "e-mon-res"
        ],
        "goodNodes": [
          "monoid",
          "reset"
        ]
      },
      "previewNote": "Syntactic monoid M(L).",
      "revealNote": "s^{n+1} = s^n eliminates permutation groups: no modulo counting."
    },
    {
      "label": "Trilateral Equivalence",
      "title": "The synthesis: star-free = FO[<] = aperiodic monoids",
      "exposition": "Schützenberger (1965) proved Star-Free = Aperiodic, and McNaughton–Papert (1971) proved Star-Free = FO[<]. Together, they establish that the three perspectives coincide completely.",
      "question": "Why is the McNaughton–Papert theorem critical for LTL verification?",
      "choices": [
        {
          "text": "Because Kamp's theorem equates LTL with FO[<], so an automaton specification can be verified with standard LTL model checking iff its transition monoid is aperiodic.",
          "correct": true,
          "feedback": "Spot on. LTL cannot express modulo properties like 'p holds at every even step'. By testing whether the minimal automaton is aperiodic (\\(s^{n+1} = s^n\\)), we can decide if a specification is expressible in LTL."
        },
        {
          "text": "Because it proves that all regular languages can be implemented without memory.",
          "correct": false,
          "causalFailure": "Star-free languages require finite memory; they only forbid modulo counting."
        },
        {
          "text": "Because it proves that first-order logic is undecidable on finite words.",
          "correct": false,
          "causalFailure": "FO[<] on finite words is completely decidable via compilation into DFAs."
        }
      ],
      "hint": "Remember the connection between LTL and FO[<]: Kamp's theorem proves LTL = FO[<].",
      "formal": "\\(\\text{Star-Free} = \\mathrm{FO}[<] = \\mathrm{LTL} = \\text{Aperiodic Monoids}\\). Modulo-free regularity completely characterized.",
      "preview": {
        "activeNodes": [
          "starfree",
          "fol",
          "monoid"
        ],
        "activeEdges": [
          "e-sf-fo",
          "e-ef-mon"
        ]
      },
      "reveal": {
        "activeNodes": [
          "starfree",
          "fol",
          "efgame",
          "monoid",
          "reset"
        ],
        "activeEdges": [
          "e-sf-fo",
          "e-fo-ef",
          "e-ef-mon",
          "e-mon-res",
          "e-res-sf"
        ],
        "goodNodes": [
          "starfree",
          "fol",
          "monoid",
          "reset"
        ]
      },
      "previewNote": "Bridging syntax, logic, and algebra.",
      "revealNote": "Trilateral equivalence closed: Star-Free ⟺ FO[<] ⟺ Aperiodic Monoids."
    }
  ],
  "previous": {
    "label": "McNaughton determinization",
    "href": "/proofs/chapter-09/mcnaughton-determinization.html"
  },
  "next": {
    "label": "Tree automata determinization",
    "href": "/proofs/chapter-10/tree-automata-determinization.html"
  }
},

    "tree-automata-determinization": {
  "slug": "tree-automata-determinization",
  "chapter": 10,
  "title": "Bottom-up tree automata determinization",
  "theorem": "Every non-deterministic finite tree automaton (NFTA) operating bottom-up on ranked trees has an equivalent deterministic finite tree automaton (DFTA): \\(\\mathcal{L}(\\mathrm{DFTA}) = \\mathcal{L}(\\mathrm{NFTA})\\). Conversely, deterministic top-down tree automata are strictly less expressive.",
  "intro": "Finite tree automata process structured branching trees (terms) rather than flat linear words. While word automata can process strings left-to-right or right-to-left symmetrically, tree automata exhibit a fundamental structural asymmetry: trees converge from multiple leaves to a single root bottom-up, but diverge from a single root to multiple independent branches top-down. This theorem proves that bottom-up tree automata determinize completely via a generalized subset construction, whereas top-down determinism fails.",
  "application": "Tree automata are the foundation of XML/JSON schema validation, program static analysis (abstract syntax trees), and compiler instruction selection. Decidability of emptiness and inclusion for bottom-up tree automata underpins program synthesis and type systems.",
  "strategy": "Step 1: Formalize ranked alphabets \\(\\Sigma = \\bigcup_k \\Sigma_k\\) and transition rules: leaves \\(a \\in \\Sigma_0\\) map to state subsets \\(\\Delta(a) \\subseteq Q\\); internal nodes \\(\\sigma \\in \\Sigma_k\\) map tuples of child states to parent state subsets \\(\\Delta(\\sigma, q_1, \\dots, q_k) \\subseteq Q\\). Step 2: Formulate the bottom-up subset construction: the DFTA state space is \\(2^Q\\); for leaves, \\(\\delta_D(a) = \\Delta(a)\\); for internal nodes, evaluate the set of all possible parent states: \\(\\delta_D(\\sigma, S_1, \\dots, S_k) = \\bigcup_{q_1 \\in S_1, \\dots, q_k \\in S_k} \\Delta(\\sigma, q_1, \\dots, q_k)\\). Step 3: Prove by structural induction on tree height \\(h(t)\\) that the unique DFTA state reached at root \\(t\\) is precisely the set of all states reachable by the NFTA on \\(t\\). Step 4: Explain why top-down determinism fails: a deterministic top-down automaton reading \\(f(x, y)\\) must send fixed states \\((q_1, q_2)\\) to the children without knowing their contents; it cannot recognize languages like \\(\\{f(a, b), f(b, a)\\}\\) because path independence forces cross-combination products \\(\\{f(a, a), f(b, b)\\}\\).",
  "invariant": "\\(\\forall \\text{ tree } t,\\; \\delta_D(t) = \\{q \\in Q \\mid t \\xrightarrow{*}_{\\text{NFTA}} q\\}\\)",
  "synthesis": "Let \\(\\mathcal{A}=(Q, \\Sigma, \\Delta, F)\\) be an NFTA. Define the DFTA \\(\\mathcal{D}=(2^Q, \\Sigma, \\delta_D, F_D)\\) where \\(F_D = \\{S \\subseteq Q \\mid S \\cap F \\neq \\emptyset\\}\\). For leaves \\(a \\in \\Sigma_0\\), set \\(\\delta_D(a) = \\Delta(a)\\). For internal nodes \\(\\sigma \\in \\Sigma_k\\) with child subsets \\(S_1, \\dots, S_k \\in 2^Q\\), set \\(\\delta_D(\\sigma, S_1, \\dots, S_k) = \\bigcup_{q_1 \\in S_1, \\dots, q_k \\in S_k} \\Delta(\\sigma, q_1, \\dots, q_k)\\). We prove by structural induction on tree \\(t\\) that \\(\\delta_D(t) = \\{q \\in Q \\mid t \\to^* q\\}\\). Base case: \\(t = a \\in \\Sigma_0\\); then \\(\\delta_D(a) = \\Delta(a)\\), matching NFTA leaf evaluation. Inductive step: let \\(t = \\sigma(t_1, \\dots, t_k)\\). By induction hypothesis, each child tree \\(t_i\\) reaches \\(\\delta_D(t_i) = S_i = \\{q \\in Q \\mid t_i \\to^* q\\}\\). Then \\(t \\to^* q \\iff \\exists q_1 \\in S_1, \\dots, q_k \\in S_k\\) such that \\(q \\in \\Delta(\\sigma, q_1, \\dots, q_k) \\iff q \\in \\delta_D(\\sigma, S_1, \\dots, S_k)\\), completing the induction. Acceptance holds iff \\(\\delta_D(t) \\cap F \\neq \\emptyset \\iff \\delta_D(t) \\in F_D\\). For top-down automata, a deterministic transition \\(\\delta(q, f) = (q_1, q_2)\\) must independently accept left and right subtrees; hence if it accepts \\(f(a, b)\\) and \\(f(b, a)\\), it is forced to accept \\(f(a, a)\\) and \\(f(b, b)\\), proving top-down DTA are strictly weaker.",
  "diagram": {
    "description": "Bottom-up tree evaluation merging multiple child states at node f, compared with top-down path divergence.",
    "viewBox": [
      0,
      0,
      1000,
      520
    ],
    "lanes": [
      {
        "y": 160,
        "label": "Root Level: σ(t₁, t₂) Evaluation",
        "labelX": 35,
        "labelY": 45
      },
      {
        "y": 340,
        "label": "Internal Subtrees: State Subsets S₁, S₂",
        "labelX": 35,
        "labelY": 220
      },
      {
        "y": 490,
        "label": "Leaves: Atomic Constants a, b",
        "labelX": 35,
        "labelY": 390
      }
    ],
    "nodes": [
      {
        "id": "leaf_a",
        "x": 250,
        "y": 430,
        "label": "Leaf a",
        "detail": "δ_D(a) = {qₐ}",
        "shape": "circle",
        "r": 48
      },
      {
        "id": "leaf_b",
        "x": 750,
        "y": 430,
        "label": "Leaf b",
        "detail": "δ_D(b) = {qₑ}",
        "shape": "circle",
        "r": 48
      },
      {
        "id": "sub1",
        "x": 350,
        "y": 260,
        "label": "Subtree t₁",
        "detail": "S₁ = {q₁, q₂}",
        "shape": "rect",
        "width": 150,
        "height": 60
      },
      {
        "id": "sub2",
        "x": 650,
        "y": 260,
        "label": "Subtree t₂",
        "detail": "S₂ = {q₃}",
        "shape": "rect",
        "width": 150,
        "height": 60
      },
      {
        "id": "root_f",
        "x": 500,
        "y": 100,
        "label": "Root f(t₁, t₂)",
        "detail": "δ_D(f, S₁, S₂) ⊆ 2^Q",
        "shape": "rect",
        "width": 220,
        "height": 64,
        "accepting": true
      }
    ],
    "edges": [
      {
        "id": "e-a-sub1",
        "from": "leaf_a",
        "to": "sub1",
        "label": "eval leaf",
        "labelX": 280,
        "labelY": 350
      },
      {
        "id": "e-b-sub2",
        "from": "leaf_b",
        "to": "sub2",
        "label": "eval leaf",
        "labelX": 720,
        "labelY": 350
      },
      {
        "id": "e-sub1-root",
        "from": "sub1",
        "to": "root_f",
        "label": "child 1 set",
        "labelX": 410,
        "labelY": 180
      },
      {
        "id": "e-sub2-root",
        "from": "sub2",
        "to": "root_f",
        "label": "child 2 set",
        "labelX": 590,
        "labelY": 180
      }
    ],
    "annotations": [
      {
        "x": 500,
        "y": 505,
        "text": "Bottom-up subset construction merges child sets: δ_D(f, S₁, S₂) = ∪ Δ(f, q₁, q₂).",
        "anchor": "middle"
      }
    ]
  },
  "steps": [
    {
      "label": "Ranked Trees",
      "title": "Ranked alphabets and tree transition semantics",
      "exposition": "In a ranked alphabet \\(\\Sigma\\), each symbol has a fixed arity \\(k \\ge 0\\). Nullary symbols (\\(k=0\\)) are leaves, and \\(k\\)-ary symbols (\\(k \\ge 1\\)) are internal nodes. In a non-deterministic bottom-up automaton, transitions assign a set of candidate states to leaves and to internal nodes given their child states.",
      "question": "How does a non-deterministic tree automaton evaluate an internal node f(t_1, ..., t_k)?",
      "choices": [
        {
          "text": "It takes candidate states \\(q_1, \\dots, q_k\\) reached by the child subtrees and transitions to any state in \\(\\Delta(f, q_1, \\dots, q_k)\\).",
          "correct": true,
          "feedback": "Correct. Evaluation proceeds bottom-up from the leaves to the root: each child subtree computes its set of reached states, and the parent symbol maps their combination into a set of parent states."
        },
        {
          "text": "It computes the sum of the ASCII values of all letters in the subtrees.",
          "correct": false,
          "causalFailure": "Tree automata do not perform arithmetic summing; they compute state transitions based on tree syntax."
        },
        {
          "text": "It processes the tree as a flattened text string from left to right.",
          "correct": false,
          "causalFailure": "Flattening destroys tree structure; tree automata process tree branches concurrently."
        }
      ],
      "hint": "Think about structural induction: leaves are evaluated first, then internal nodes combine child states.",
      "formal": "\\(\\Delta: \\Sigma_k \\times Q^k \\to 2^Q\\). Evaluation: \\(t = \\sigma(t_1, \\dots, t_k) \\to^* q \\iff \\exists q_i \\in \\text{Runs}(t_i).\\; q \\in \\Delta(\\sigma, q_1, \\dots, q_k)\\).",
      "preview": {
        "activeNodes": [
          "leaf_a",
          "leaf_b"
        ],
        "activeEdges": []
      },
      "reveal": {
        "activeNodes": [
          "leaf_a",
          "leaf_b",
          "sub1",
          "sub2"
        ],
        "activeEdges": [
          "e-a-sub1",
          "e-b-sub2"
        ],
        "goodNodes": [
          "leaf_a",
          "leaf_b"
        ]
      },
      "previewNote": "Leaves evaluated to initial states.",
      "revealNote": "Subtrees compute sets of reached states S₁ and S₂."
    },
    {
      "label": "Subset Construction",
      "title": "Bottom-up subset construction over 2^Q",
      "exposition": "To determinize the automaton, the DFTA operates over macro-states in \\(2^Q\\). We must define the deterministic transition function \\(\\delta_D\\) for internal nodes.",
      "question": "How is the deterministic transition function delta_D defined for an internal node with child macro-states S_1, ..., S_k?",
      "choices": [
        {
          "text": "\\(\\delta_D(\\sigma, S_1, \\dots, S_k) = \\bigcup_{q_1 \\in S_1, \\dots, q_k \\in S_k} \\Delta(\\sigma, q_1, \\dots, q_k)\\): the union over all combinations of child states.",
          "correct": true,
          "feedback": "Precisely. This exactly mirrors the word subset construction, generalized to \\(k\\)-ary tuples of states: it collects all parent states reachable by choosing any valid run on each child subtree."
        },
        {
          "text": "\\(\\delta_D(\\sigma, S_1, \\dots, S_k) = S_1 \\cap S_2 \\cap \\dots \\cap S_k\\): the intersection of child states.",
          "correct": false,
          "causalFailure": "Intersection would require child subtrees to be in the exact same states, which is false for independent branches."
        },
        {
          "text": "\\(\\delta_D(\\sigma, S_1, \\dots, S_k) = S_1 \\times S_2 \\times \\dots \\times S_k\\): the Cartesian product of states.",
          "correct": false,
          "causalFailure": "The state space of the DFTA is \\(2^Q\\), not an unbounded Cartesian product of sets."
        }
      ],
      "hint": "How does the subset construction handle multiple independent choices in each branch? By taking the union over all tuples.",
      "formal": "\\(\\delta_D(\\sigma, S_1, \\dots, S_k) = \\bigcup_{\\vec{q} \\in S_1 \\times \\dots \\times S_k} \\Delta(\\sigma, \\vec{q})\\). Result is a deterministic element of \\(2^Q\\).",
      "preview": {
        "activeNodes": [
          "sub1",
          "sub2"
        ],
        "activeEdges": []
      },
      "reveal": {
        "activeNodes": [
          "sub1",
          "sub2",
          "root_f"
        ],
        "activeEdges": [
          "e-sub1-root",
          "e-sub2-root"
        ],
        "goodNodes": [
          "root_f"
        ]
      },
      "previewNote": "Child state sets S₁ and S₂.",
      "revealNote": "Root macro-state δ_D(f, S₁, S₂) deterministically computed via union over tuples."
    },
    {
      "label": "Structural Induction",
      "title": "Correctness by structural induction on tree height",
      "exposition": "We verify the inductive invariant: for every finite tree \\(t\\), the state reached by \\(\\mathcal{D}\\) on \\(t\\) is precisely \\(\\delta_D(t) = \\{q \\in Q \\mid t \\to^* q\\}\\).",
      "question": "Why does the inductive step hold for t = sigma(t_1, ..., t_k)?",
      "choices": [
        {
          "text": "Because by induction hypothesis each child \\(t_i\\) reaches exactly the set \\(S_i\\) of NFTA-reachable states, and \\(\\delta_D\\) aggregates all possible parent transitions from those sets.",
          "correct": true,
          "feedback": "Spot on. A tree run is valid iff its subtree runs are valid and the root transition is valid. Since the induction hypothesis provides all valid child states, the union over \\(\\Delta\\) produces all valid root states."
        },
        {
          "text": "Because trees are always complete balanced binary trees.",
          "correct": false,
          "causalFailure": "Structural induction applies to all trees of arbitrary shape, height, and branching degree."
        },
        {
          "text": "Because non-deterministic tree automata have at most one run per tree.",
          "correct": false,
          "causalFailure": "NFTAs can have exponentially many runs on a single tree; the subset construction collapses them into one deterministic run."
        }
      ],
      "hint": "Structural induction on trees: assume the property holds for all subtrees, then prove it for the parent.",
      "formal": "\\(\\delta_D(t) = \\delta_D(\\sigma, \\delta_D(t_1), \\dots, \\delta_D(t_k)) = \\bigcup_{\\vec{q}} \\Delta(\\sigma, \\vec{q}) = \\{q \\mid t \\xrightarrow{*}_{\\text{NFTA}} q\\}\\).",
      "preview": {
        "activeNodes": [
          "leaf_a",
          "sub1"
        ],
        "activeEdges": [
          "e-a-sub1"
        ]
      },
      "reveal": {
        "activeNodes": [
          "leaf_a",
          "leaf_b",
          "sub1",
          "sub2",
          "root_f"
        ],
        "activeEdges": [
          "e-a-sub1",
          "e-b-sub2",
          "e-sub1-root",
          "e-sub2-root"
        ],
        "goodNodes": [
          "root_f"
        ]
      },
      "previewNote": "Base case on leaves verified.",
      "revealNote": "Inductive step complete on tree height: full equivalence Ⅎ(DFTA) = Ⅎ(NFTA)."
    },
    {
      "label": "Top-Down Asymmetry",
      "title": "The top-down deterministic limit: path independence",
      "exposition": "In a top-down tree automaton, computation starts at the root and moves towards the leaves. A deterministic top-down transition must choose a fixed pair of successor states: \\(\\delta(q, f) = (q_1, q_2)\\). We examine why this strictly limits expressiveness.",
      "question": "Why can a deterministic top-down tree automaton NOT recognize L = {f(a, b), f(b, a)}?",
      "choices": [
        {
          "text": "Because it must send fixed states \\((q_1, q_2)\\) to left and right subtrees; accepting both \\(f(a,b)\\) and \\(f(b,a)\\) forces it to accept \\(f(a,a)\\) and \\(f(b,b)\\) as well.",
          "correct": true,
          "feedback": "Precisely. Top-down determinism causes path independence: the left branch has no knowledge of what the right branch is doing. To correlate branches, non-determinism is indispensable."
        },
        {
          "text": "Because letters 'a' and 'b' cannot appear in the same tree language.",
          "correct": false,
          "causalFailure": "Any alphabet can contain multiple symbols; the failure is due to path decorrelation, not alphabet size."
        },
        {
          "text": "Because top-down automata cannot read trees of depth 1.",
          "correct": false,
          "causalFailure": "Top-down automata easily read trees of depth 1; the issue is branch correlation."
        }
      ],
      "hint": "If q_1 accepts both 'a' and 'b', and q_2 accepts both 'a' and 'b', what happens when you combine them?",
      "formal": "\\(\\delta(q_0, f) = (q_1, q_2) \\implies L(f(t_1, t_2)) = L(q_1) \\times L(q_2)\\). Cross-product closure forces \\(f(a, a), f(b, b) \\in L\\).",
      "preview": {
        "activeNodes": [
          "root_f"
        ],
        "activeEdges": []
      },
      "reveal": {
        "activeNodes": [
          "root_f",
          "sub1",
          "sub2"
        ],
        "activeEdges": [
          "e-sub1-root",
          "e-sub2-root"
        ],
        "badNodes": [
          "sub1",
          "sub2"
        ]
      },
      "previewNote": "Top-down transition from root.",
      "revealNote": "Path independence: deterministic top-down cannot correlate branches (Ⅎ(DTA_top) ⊊ Ⅎ(NFTA))."
    }
  ],
  "previous": {
    "label": "McNaughton–Papert theorem",
    "href": "/proofs/chapter-09/mcnaughton-papert.html"
  },
  "next": {
    "label": "Vardi–Wolper tableau",
    "href": "/proofs/chapter-11/vardi-wolper-tableau.html"
  }
},

    "vardi-wolper-tableau": {
  "slug": "vardi-wolper-tableau",
  "chapter": 11,
  "title": "Vardi–Wolper tableau & fulfilling path theorem",
  "theorem": "An LTL formula \\(\\phi\\) is satisfiable if and only if there exists a fulfilling path \\(\\pi = A_0 A_1 \\dots\\) in the tableau graph \\(T(\\phi)\\) of elementary sets (atoms) such that \\(\\phi \\in A_0\\).",
  "intro": "The Vardi–Wolper construction (1986) is the classical algorithm bridging Linear Temporal Logic (LTL) and automata theory. By analyzing the subformulas of \\(\\phi\\) (the Fisher–Ladner closure), it constructs a finite graph whose vertices are maximal propositionally consistent sets of formulas called 'atoms'. The Fulfilling Path Theorem proves that satisfying models of an LTL formula correspond precisely to infinite paths that do not postpone temporal promises forever.",
  "application": "This construction is the algorithmic foundation of LTL model checkers like SPIN. The tableau graph is translated directly into a Generalized Büchi Automaton (GBA) of size \\(2^{O(|\\phi|)}\\), which is then synchronized with the system model to detect violation cycles.",
  "strategy": "Step 1: Define the closure \\(Cl(\\phi)\\) containing all subformulas and their negations, and define atoms as maximal subsets \\(A \\subseteq Cl(\\phi)\\) that are propositionally consistent: \\(\\psi \\in A \\iff \\neg\\psi \\notin A\\), \\(\\psi_1 \\land \\psi_2 \\in A \\iff \\psi_1 \\in A \\land \\psi_2 \\in A\\), and temporally consistent with expansion rules: \\(\\alpha\\,\\mathsf{U}\\,\\beta \\in A \\iff \\beta \\in A \\lor (\\alpha \\in A \\land X(\\alpha\\,\\mathsf{U}\\,\\beta) \\in A)\\). Step 2: Define directed transitions \\(A \\to B\\) in the tableau graph \\(T(\\phi)\\) requiring edge consistency: for all \\(X\\chi \\in Cl(\\phi)\\), \\(X\\chi \\in A \\iff \\chi \\in B\\). Step 3: Fulfilling paths: define a path \\(\\pi = A_0 A_1 \\dots\\) as fulfilling if for every promising formula \\(\\alpha\\,\\mathsf{U}\\,\\beta \\in Cl(\\phi)\\), \\(\\pi\\) visits infinitely many atoms where \\(\\beta \\in A_j\\) or \\(\\neg(\\alpha\\,\\mathsf{U}\\,\\beta) \\in A_j\\) (no infinite procrastination). Step 4: Prove equivalence by induction on formula length: given a fulfilling path, construct the model \\(\\sigma(i) = A_i \\cap AP\\) and prove by induction that \\(\\sigma, i \\models \\psi \\iff \\psi \\in A_i\\).",
  "invariant": "\\(\\forall i \\in \\mathbb{N},\\; \\forall \\psi \\in Cl(\\phi),\\; \\sigma, i \\models \\psi \\iff \\psi \\in A_i\\)",
  "synthesis": "Let \\(\\phi\\) be an LTL formula and \\(Cl(\\phi)\\) its closure. An atom is a maximal propositionally and temporally consistent subset of \\(Cl(\\phi)\\). The tableau graph \\(T(\\phi) = (V, E)\\) has atoms as vertices and edges \\((A, B) \\in E \\iff \\forall X\\chi \\in Cl(\\phi),\\, X\\chi \\in A \\leftrightarrow \\chi \\in B\\). A path \\(\\pi = A_0 A_1 \\dots\\) is fulfilling iff for every \\(\\alpha\\,\\mathsf{U}\\,\\beta \\in Cl(\\phi)\\), \\(\\pi\\) contains infinitely many atoms fulfilling the promise (\\(\\beta \\in A_j \\lor \\neg(\\alpha\\,\\mathsf{U}\\,\\beta) \\in A_j\\)). (\\(\\implies\\)) Given a model \\(\\sigma \\models \\phi\\), define \\(A_i = \\{\\chi \\in Cl(\\phi) \\mid \\sigma, i \\models \\chi\\}\\). By LTL semantics, each \\(A_i\\) is an atom, edges satisfy \\(X\\chi \\in A_i \\leftrightarrow \\chi \\in A_{i+1}\\), and promises are fulfilled because \\(\\sigma, i \\models \\alpha\\,\\mathsf{U}\\,\\beta\\) guarantees some \\(j \\ge i\\) where \\(\\sigma, j \\models \\beta\\). (\\(\\impliedby\\)) Given a fulfilling path \\(\\pi\\) with \\(\\phi \\in A_0\\), define the word \\(\\sigma\\) by \\(s_i = A_i \\cap AP\\). We prove \\(\\sigma, i \\models \\psi \\iff \\psi \\in A_i\\) by structural induction on \\(\\psi\\). For \\(X\\chi\\), \\(\\sigma, i \\models X\\chi \\iff \\sigma, i+1 \\models \\chi \\iff \\chi \\in A_{i+1} \\iff X\\chi \\in A_i\\). For \\(\\alpha\\,\\mathsf{U}\\,\\beta\\): if \\(\\alpha\\,\\mathsf{U}\\,\\beta \\in A_i\\), fulfillment ensures a least \\(j \\ge i\\) with \\(\\beta \\in A_j\\); for all \\(k \\in [i, j-1]\\), \\(\\beta \\notin A_k\\), forcing \\(\\alpha \\in A_k\\) and \\(X(\\alpha\\,\\mathsf{U}\\,\\beta) \\in A_k\\) by atom consistency, which propagates to \\(\\sigma, i \\models \\alpha\\,\\mathsf{U}\\,\\beta\\). If \\(\\alpha\\,\\mathsf{U}\\,\\beta \\notin A_i\\), \\(\\neg(\\alpha\\,\\mathsf{U}\\,\\beta)\\) propagates, preventing \\(\\beta\\) from ever being satisfied with preceding \\(\\alpha\\)'s. Thus \\(\\sigma \\models \\phi\\).",
  "diagram": {
    "description": "Vardi-Wolper tableau graph showing atoms (maximal consistent sets), temporal edge consistency, and promise fulfillment cycles.",
    "viewBox": [
      0,
      0,
      1000,
      520
    ],
    "lanes": [
      {
        "y": 160,
        "label": "Tableau Atoms: Maximal Consistent Subformula Sets",
        "labelX": 35,
        "labelY": 45
      },
      {
        "y": 340,
        "label": "Temporal Transitions: Xχ ∈ A ⇔ χ ∈ B",
        "labelX": 35,
        "labelY": 220
      },
      {
        "y": 490,
        "label": "Fulfilling Cycle: Promise α U β Discharged by β",
        "labelX": 35,
        "labelY": 390
      }
    ],
    "nodes": [
      {
        "id": "a0",
        "x": 200,
        "y": 100,
        "label": "Atom A₀ {φ, αUβ, X...}",
        "detail": "initial atom",
        "shape": "rect",
        "width": 220,
        "height": 60
      },
      {
        "id": "a1",
        "x": 500,
        "y": 100,
        "label": "Atom A₁ {α, X(αUβ)}",
        "detail": "temporal propagation",
        "shape": "rect",
        "width": 220,
        "height": 60
      },
      {
        "id": "aj",
        "x": 800,
        "y": 100,
        "label": "Atom Aⱼ {β ∈ Aⱼ}",
        "detail": "promise fulfilled!",
        "shape": "rect",
        "width": 200,
        "height": 60,
        "accepting": true
      },
      {
        "id": "cycle1",
        "x": 650,
        "y": 260,
        "label": "Cycle Node C₁",
        "detail": "recurring atom",
        "shape": "rect",
        "width": 160,
        "height": 56
      },
      {
        "id": "cycle2",
        "x": 800,
        "y": 430,
        "label": "Fulfilling SCS",
        "detail": "infinitely visits β",
        "shape": "rect",
        "width": 200,
        "height": 64,
        "accepting": true
      }
    ],
    "edges": [
      {
        "id": "e-a0-a1",
        "from": "a0",
        "to": "a1",
        "label": "edge consistency",
        "labelY": 80
      },
      {
        "id": "e-a1-aj",
        "from": "a1",
        "to": "aj",
        "label": "finite postponement",
        "labelY": 80
      },
      {
        "id": "e-aj-c1",
        "from": "aj",
        "to": "cycle1",
        "label": "recurrent path",
        "labelX": 740,
        "labelY": 180
      },
      {
        "id": "e-c1-c2",
        "from": "cycle1",
        "to": "cycle2",
        "label": "enter SCS",
        "labelX": 740,
        "labelY": 340
      },
      {
        "id": "e-c2-aj",
        "from": "cycle2",
        "to": "aj",
        "label": "close fulfilling cycle",
        "path": "M 820 395 C 870 300 870 200 820 135",
        "labelX": 890,
        "labelY": 260
      }
    ],
    "annotations": [
      {
        "x": 500,
        "y": 505,
        "text": "Fulfilling Path Theorem: φ is satisfiable ⟺ T(φ) has a reachable fulfilling SCS.",
        "anchor": "middle"
      }
    ]
  },
  "steps": [
    {
      "label": "Closure and Atoms",
      "title": "Fisher–Ladner closure and maximal consistent atoms",
      "exposition": "The closure \\(Cl(\\phi)\\) contains all subformulas of \\(\\phi\\) and their negations. An atom \\(A \\subseteq Cl(\\phi)\\) is a maximal subset that obeys boolean logic (e.g. \\(\\chi \\in A \\iff \\neg\\chi \\notin A\\)) and local temporal expansion rules: \\(\\alpha\\,\\mathsf{U}\\,\\beta \\in A \\iff \\beta \\in A \\lor (\\alpha \\in A \\land X(\\alpha\\,\\mathsf{U}\\,\\beta) \\in A)\\).",
      "question": "Why must every atom satisfy the expansion rule for the Until operator?",
      "choices": [
        {
          "text": "Because \\(\\alpha\\,\\mathsf{U}\\,\\beta\\) holds now iff either \\(\\beta\\) holds now, or \\(\\alpha\\) holds now and the Until formula holds at the next step: \\(\\alpha\\,\\mathsf{U}\\,\\beta \\equiv \\beta \\lor (\\alpha \\land X(\\alpha\\,\\mathsf{U}\\,\\beta))\\).",
          "correct": true,
          "feedback": "Correct. This is the fundamental fixpoint expansion of Until. Enforcing it in every atom guarantees that local step-by-step reasoning matches LTL semantics."
        },
        {
          "text": "Because atoms are forbidden from containing the Next operator \\(X\\).",
          "correct": false,
          "causalFailure": "Atoms explicitly contain Next formulas \\(X\\chi\\) to communicate obligations across edges."
        },
        {
          "text": "Because \\(\\alpha\\,\\mathsf{U}\\,\\beta\\) requires \\(\\alpha\\) and \\(\\beta\\) to be true simultaneously at all times.",
          "correct": false,
          "causalFailure": "Until requires \\(\\beta\\) to hold eventually, with \\(\\alpha\\) holding until then; they do not have to hold simultaneously forever."
        }
      ],
      "hint": "Remember the recursive unwinding of Until: alpha U beta = beta OR (alpha AND X(alpha U beta)).",
      "formal": "\\(\\text{Atom } A \\subseteq Cl(\\phi): \\alpha\\,\\mathsf{U}\\,\\beta \\in A \\iff \\beta \\in A \\lor (\\alpha \\in A \\land X(\\alpha\\,\\mathsf{U}\\,\\beta) \\in A)\\). Number of atoms \\(\\le 2^{|\\phi|}\\).",
      "preview": {
        "activeNodes": [
          "a0"
        ],
        "activeEdges": []
      },
      "reveal": {
        "activeNodes": [
          "a0",
          "a1"
        ],
        "activeEdges": [
          "e-a0-a1"
        ],
        "goodNodes": [
          "a0",
          "a1"
        ]
      },
      "previewNote": "Atom A₀ containing initial formula φ.",
      "revealNote": "Local expansion rule enforces X(αUβ) in atom when β is not yet satisfied."
    },
    {
      "label": "Edge Consistency",
      "title": "Temporal transitions across atoms in the tableau",
      "exposition": "Transitions between atoms in the tableau graph \\(T(\\phi)\\) connect atom \\(A\\) to atom \\(B\\) if and only if the temporal promises made by Next formulas in \\(A\\) match the contents of \\(B\\).",
      "question": "What is the exact condition for an edge (A, B) to exist in the tableau graph?",
      "choices": [
        {
          "text": "For every Next formula \\(X\\chi \\in Cl(\\phi)\\): \\(X\\chi \\in A \\iff \\chi \\in B\\).",
          "correct": true,
          "feedback": "Precisely. If atom \\(A\\) asserts that \\(\\chi\\) must hold in the next state (\\(X\\chi \\in A\\)), atom \\(B\\) must contain \\(\\chi\\). Conversely, if \\(X\\chi \\notin A\\), atom \\(B\\) cannot contain \\(\\chi\\)."
        },
        {
          "text": "Atom \\(A\\) and atom \\(B\\) must be completely identical sets of formulas.",
          "correct": false,
          "causalFailure": "Identical atoms would model only constant static worlds; systems evolve over time as formulas change truth values."
        },
        {
          "text": "Atom \\(B\\) must contain strictly fewer formulas than atom \\(A\\).",
          "correct": false,
          "causalFailure": "Atoms are maximal consistent sets; by definition, every atom contains exactly half of the formulas in \\(Cl(\\phi)\\) (either \\(\\psi\\) or \\(\\neg\\psi\\))."
        }
      ],
      "hint": "Next-time semantics: what does Xχ in the current state require of the successor state?",
      "formal": "\\((A, B) \\in E \\iff \\forall X\\chi \\in Cl(\\phi),\\; X\\chi \\in A \\leftrightarrow \\chi \\in B\\).",
      "preview": {
        "activeNodes": [
          "a0",
          "a1"
        ],
        "activeEdges": [
          "e-a0-a1"
        ]
      },
      "reveal": {
        "activeNodes": [
          "a0",
          "a1",
          "aj"
        ],
        "activeEdges": [
          "e-a0-a1",
          "e-a1-aj"
        ],
        "goodNodes": [
          "aj"
        ]
      },
      "previewNote": "Edge consistency propagates temporal commitments.",
      "revealNote": "Transitions march forward until atom Aj fulfills the promise with β ∈ Aj."
    },
    {
      "label": "Fulfilling Paths",
      "title": "Promising formulas and the danger of infinite postponement",
      "exposition": "Consider the formula \\(\\mathsf{F}\\,\\beta \\equiv \\top\\,\\mathsf{U}\\,\\beta\\). Local expansion allows an atom to contain \\(\\top \\land X(\\top\\,\\mathsf{U}\\,\\beta)\\). In a finite graph, an infinite path could loop forever on atoms asserting \\(X(\\top\\,\\mathsf{U}\\,\\beta)\\) while never visiting an atom containing \\(\\beta\\).",
      "question": "How does the fulfilling path condition eliminate this unsound infinite postponement?",
      "choices": [
        {
          "text": "By requiring that for every promising formula \\(\\alpha\\,\\mathsf{U}\\,\\beta \\in Cl(\\phi)\\), the path visits infinitely many atoms where \\(\\beta \\in A_j\\) (or where the Until formula was never requested).",
          "correct": true,
          "feedback": "Spot on. This is the fairness / Büchi condition of the tableau: a promise made cannot be postponed forever. Infinitely many visits to \\(\\beta\\) ensure that every pending Until is eventually discharged."
        },
        {
          "text": "By deleting all cycles from the tableau graph to ensure paths are finite.",
          "correct": false,
          "causalFailure": "LTL models are infinite words; deleting cycles would make infinite runs impossible."
        },
        {
          "text": "By requiring \\(\\beta\\) to be satisfied immediately at the very first step \\(A_0\\).",
          "correct": false,
          "causalFailure": "Until allows \\(\\beta\\) to occur at any finite future time \\(j \\ge 0\\); forcing \\(j=0\\) would restrict Until to trivial immediate satisfaction."
        }
      ],
      "hint": "Until means eventually: you can postpone, but not infinitely many times without fulfilling.",
      "formal": "\\(\\pi\\) is fulfilling \\(\\iff \\forall \\alpha\\,\\mathsf{U}\\,\\beta \\in Cl(\\phi),\\; \\mathrm{Inf}(\\pi) \\cap \\{A \\mid \\beta \\in A \\lor \\neg(\\alpha\\,\\mathsf{U}\\,\\beta) \\in A\\} \\neq \\emptyset\\).",
      "preview": {
        "activeNodes": [
          "aj",
          "cycle1"
        ],
        "activeEdges": [
          "e-aj-c1"
        ]
      },
      "reveal": {
        "activeNodes": [
          "aj",
          "cycle1",
          "cycle2"
        ],
        "activeEdges": [
          "e-aj-c1",
          "e-c1-c2",
          "e-c2-aj"
        ],
        "goodNodes": [
          "aj",
          "cycle2"
        ]
      },
      "previewNote": "Cycle through atoms.",
      "revealNote": "Fulfilling condition forces recurring visit to β: no infinite procrastination."
    },
    {
      "label": "Model Induction",
      "title": "Model construction by structural induction on formulas",
      "exposition": "Given a fulfilling path \\(\\pi = A_0 A_1 \\dots\\) with \\(\\phi \\in A_0\\), we define the word \\(\\sigma\\) by setting atomic propositions \\(s_i = A_i \\cap AP\\). We prove by induction on the structure of subformulas that \\(\\sigma, i \\models \\psi \\iff \\psi \\in A_i\\).",
      "question": "Why does the inductive step for Until hold when alpha U beta belongs to A_i?",
      "choices": [
        {
          "text": "Because fulfillment ensures a smallest \\(j \\ge i\\) with \\(\\beta \\in A_j\\); for all intermediate steps \\(k \\in [i, j-1]\\), atom consistency forces \\(\\alpha \\in A_k\\), which matches the semantic definition of Until.",
          "correct": true,
          "feedback": "Precisely. If \\(\\beta\\) is not true at intermediate steps, the expansion rule \\(\\alpha\\,\\mathsf{U}\\,\\beta \\equiv \\beta \\lor (\\alpha \\land X(\\alpha\\,\\mathsf{U}\\,\\beta))\\) forces \\(\\alpha\\) and the Next obligation to hold. By induction hypothesis, \\(\\sigma, k \\models \\alpha\\) and \\(\\sigma, j \\models \\beta\\)."
        },
        {
          "text": "Because Until formulas are automatically true in all states by definition of Kripke models.",
          "correct": false,
          "causalFailure": "Until formulas can be false; their truth value depends entirely on the sequence of truth values of \\(\\alpha\\) and \\(\\beta\\)."
        },
        {
          "text": "Because the alphabet of the automaton is assumed to contain only truth values.",
          "correct": false,
          "causalFailure": "The alphabet is \\(2^{AP}\\); truth values are assigned according to atom membership."
        }
      ],
      "hint": "Look at the segment [i, j-1]: what does the expansion rule force when beta is absent?",
      "formal": "\\(\\beta \\in A_j \\implies \\sigma, j \\models \\beta\\); \\(\\forall k \\in [i, j-1],\\, \\alpha \\in A_k \\implies \\sigma, k \\models \\alpha\\). Hence \\(\\sigma, i \\models \\alpha\\,\\mathsf{U}\\,\\beta\\). \\(\\sigma \\models \\phi\\) established.",
      "preview": {
        "activeNodes": [
          "a0",
          "aj",
          "cycle2"
        ],
        "activeEdges": [
          "e-a0-a1",
          "e-c2-aj"
        ]
      },
      "reveal": {
        "activeNodes": [
          "a0",
          "a1",
          "aj",
          "cycle1",
          "cycle2"
        ],
        "activeEdges": [
          "e-a0-a1",
          "e-a1-aj",
          "e-aj-c1",
          "e-c1-c2",
          "e-c2-aj"
        ],
        "goodNodes": [
          "a0",
          "aj",
          "cycle2"
        ]
      },
      "previewNote": "Initial atom A₀ contains φ.",
      "revealNote": "Fulfilling path theorem proved: φ satisfiable ⟺ σ ⊨ φ constructed."
    }
  ],
  "previous": {
    "label": "Tree automata determinization",
    "href": "/proofs/chapter-10/tree-automata-determinization.html"
  },
  "next": {
    "label": "Kamp's theorem",
    "href": "/proofs/chapter-11/kamp-theorem.html"
  }
},

    "kamp-theorem": {
  "slug": "kamp-theorem",
  "chapter": 11,
  "title": "Kamp's expressive completeness theorem (1968)",
  "theorem": "Over the Dedekind-complete linear time model \\((\\mathbb{N}, <)\\), Linear Temporal Logic with Until and Since (\\(\\mathrm{LTL}[\\mathsf{U}, \\mathsf{S}]\\)) has exactly the same expressive power as First-Order Logic of linear order (\\(\\mathrm{FO}[<]\\)): \\(\\mathcal{L}(\\mathrm{LTL}[\\mathsf{U}, \\mathsf{S}]) = \\mathcal{L}(\\mathrm{FO}[<])\\).",
  "intro": "Hans Kamp's 1968 landmark theorem answered a fundamental question in philosophical and mathematical logic: can an implicit temporal tense logic without explicit position variables express every property definable by classical first-order logic with quantifiers and relational operators? Kamp proved that the two modalities 'Until' (\\(\\\\mathsf{U}\\)) and 'Since' (\\(\\\\mathsf{S}\\)) provide an expressively complete basis over continuous and discrete linear orders.",
  "application": "Kamp's theorem justifies using LTL as the definitive specification language for reactive systems: engineers write concise, readable temporal formulas without having to manage bound position variables (e.g., \\\\(\\\\exists t_1 \\\\forall t_2 > t_1\\\\dots\\\\)), knowing that no first-order property of execution traces is sacrificed.",
  "strategy": "Step 1: Embedding LTL into \\(\\mathrm{FO}[<]\\): prove by induction on formula structure that every LTL formula translates to an \\(\\mathrm{FO}[<]\\) formula with one free variable \\(t_0\\). Step 2: The expressive challenge: \\(\\mathrm{FO}[<]\\) can quantify arbitrary variables \\(x, y, z\\), reference multiple points simultaneously, and cross-compare intervals; how can variable-free modal operators match this? Step 3: Gabbay's Separation Property: on Dedekind-complete linear orders, every temporal formula can be separated into an equivalent boolean combination of pure present, pure past (involving only \\(\\mathsf{S}\\)), and pure future (involving only \\(\\mathsf{U}\\)) formulas without temporal nesting interference. Step 4: Initial equivalence on \\((\\mathbb{N}, <)\\): at the origin \\(t=0\\), there is no past, so past operators \\(\\mathsf{S}\\) evaluate to false; hence pure future \\(\\mathrm{LTL}[\\mathsf{U}]\\) is expressively complete for all first-order sentences evaluated at time 0.",
  "invariant": "\\(\\forall \\varphi \\in \\mathrm{FO}[<] \\text{ with free variable } t_0,\\; \\exists \\psi \\in \\mathrm{LTL}[\\mathsf{U}, \\mathsf{S}] \\text{ such that } \\forall \\sigma, t:\\; \\sigma, t \\models \\psi \\iff \\sigma \\models \\varphi(t)\\)",
  "synthesis": "The translation from \\(\\mathrm{LTL}[\\mathsf{U}, \\mathsf{S}]\\) to \\(\\mathrm{FO}[<]\\) is direct: atomic propositions \\(p\\) become \\(P_p(t_0)\\); boolean connectives commute; \\(\\mathsf{X}\\psi(t_0) \\equiv \\exists t\\, (t > t_0 \\land \\neg\\exists t'\\, (t_0 < t' < t) \\land \\psi^*(t))\\); and \\(\\psi_1\\,\\mathsf{U}\\,\\psi_2(t_0) \\equiv \\exists t_2 > t_0\\, (\\psi_2^*(t_2) \\land \\forall t\\, (t_0 < t < t_2 \\to \\psi_1^*(t)))\\). The converse is Kamp's theorem, established via Gabbay's separation theorem. A temporal formula is separated if it is a boolean combination of formulas that look only into the future (using \\(\\mathsf{U}\\)), only into the past (using \\(\\mathsf{S}\\)), or evaluate the present. Over \\((\\mathbb{N}, <)\\), every formula can be separated without introducing variables. When evaluating sentences at the origin \\(t=0\\), any formula with a past operator collapses to false because no positions precede 0. Thus, any \\(\\mathrm{FO}[<]\\) sentence specifying a set of infinite execution sequences is expressible in pure-future \\(\\mathrm{LTL}[\\mathsf{U}]\\), establishing \\(\\mathcal{L}(\\mathrm{LTL}) = \\mathcal{L}(\\mathrm{FO}[<])\\).",
  "diagram": {
    "description": "Kamp's expressive completeness: inductive translation from LTL to FO[<], and Gabbay's separation into pure past, present, and future.",
    "viewBox": [
      0,
      0,
      1000,
      520
    ],
    "lanes": [
      {
        "y": 160,
        "label": "LTL Formula Space (Modal Operators: U, S, X)",
        "labelX": 35,
        "labelY": 45
      },
      {
        "y": 340,
        "label": "Gabbay Separation: Pure Past | Present | Pure Future",
        "labelX": 35,
        "labelY": 220
      },
      {
        "y": 490,
        "label": "First-Order Logic FO[<] Over Time Positions",
        "labelX": 35,
        "labelY": 390
      }
    ],
    "nodes": [
      {
        "id": "ltl_u",
        "x": 250,
        "y": 100,
        "label": "ψ₁ U ψ₂",
        "detail": "modal future operator",
        "shape": "rect",
        "width": 180,
        "height": 60
      },
      {
        "id": "ltl_s",
        "x": 750,
        "y": 100,
        "label": "ψ₁ S ψ₂",
        "detail": "modal past operator",
        "shape": "rect",
        "width": 180,
        "height": 60
      },
      {
        "id": "past_node",
        "x": 200,
        "y": 260,
        "label": "Pure Past (⇐)",
        "detail": "depends only on t < t₀",
        "shape": "rect",
        "width": 180,
        "height": 60
      },
      {
        "id": "pres_node",
        "x": 500,
        "y": 260,
        "label": "Present (t₀)",
        "detail": "depends only on t = t₀",
        "shape": "rect",
        "width": 160,
        "height": 60
      },
      {
        "id": "fut_node",
        "x": 800,
        "y": 260,
        "label": "Pure Future (⇒)",
        "detail": "depends only on t > t₀",
        "shape": "rect",
        "width": 180,
        "height": 60
      },
      {
        "id": "fo_equiv",
        "x": 500,
        "y": 430,
        "label": "∃t > t₀ ψ(t) ∧ ∀...",
        "detail": "FO[<] exact equivalence",
        "shape": "rect",
        "width": 280,
        "height": 64,
        "accepting": true
      }
    ],
    "edges": [
      {
        "id": "e-u-fut",
        "from": "ltl_u",
        "to": "fut_node",
        "label": "future projection",
        "labelX": 520,
        "labelY": 170
      },
      {
        "id": "e-s-past",
        "from": "ltl_s",
        "to": "past_node",
        "label": "past projection",
        "labelX": 470,
        "labelY": 170
      },
      {
        "id": "e-past-fo",
        "from": "past_node",
        "to": "fo_equiv",
        "label": "translate past",
        "labelX": 320,
        "labelY": 360
      },
      {
        "id": "e-pres-fo",
        "from": "pres_node",
        "to": "fo_equiv",
        "label": "translate atom",
        "labelX": 520,
        "labelY": 350
      },
      {
        "id": "e-fut-fo",
        "from": "fut_node",
        "to": "fo_equiv",
        "label": "translate future",
        "labelX": 680,
        "labelY": 360
      }
    ],
    "annotations": [
      {
        "x": 500,
        "y": 505,
        "text": "Kamp's Theorem: LTL[U, S] ≡ FO[<]. At t = 0, pure-future LTL[U] ≡ FO[<].",
        "anchor": "middle"
      }
    ]
  },
  "steps": [
    {
      "label": "LTL into FO[<]",
      "title": "Embedding temporal operators into first-order order formulas",
      "exposition": "We define the standard translation \\(ST_{t_0}(\\varphi)\\) which turns any LTL formula into an \\(\\mathrm{FO}[<]\\) formula with one free variable \\(t_0\\). Atomic proposition \\(p\\) translates to \\(P_p(t_0)\\).",
      "question": "What is the correct first-order translation ST_{t_0}(psi_1 U psi_2) for the Until operator?",
      "choices": [
        {
          "text": "\\(\\exists t_2 > t_0\\, \\bigl( ST_{t_2}(\\psi_2) \\land \\forall t\\, (t_0 < t < t_2 \\to ST_t(\\psi_1)) \\bigr)\\).",
          "correct": true,
          "feedback": "Correct. There exists a future point \\(t_2 > t_0\\) where \\(\\psi_2\\) holds, and for all intermediate points \\(t\\) strictly between \\(t_0\\) and \\(t_2\\), \\(\\psi_1\\) holds. This directly translates the temporal semantics into first-order logic."
        },
        {
          "text": "\\(\\forall t_2 > t_0\\, \\bigl( ST_{t_2}(\\psi_2) \\lor ST_{t_0}(\\psi_1) \\bigr)\\).",
          "correct": false,
          "causalFailure": "Until requires an existential witness \\(t_2\\) for \\(\\psi_2\\), not a universal quantification over all future points."
        },
        {
          "text": "\\(\\exists t_2 < t_0\\, ST_{t_2}(\\psi_2)\\).",
          "correct": false,
          "causalFailure": "\\(t_2 < t_0\\) looks into the past, which corresponds to the Since operator (\\(\\mathsf{S}\\)), not Until."
        }
      ],
      "hint": "Remember the definition of Until: psi_2 must hold at some future time t_2, and psi_1 must hold at all intermediate times.",
      "formal": "\\(ST_{t_0}(\\psi_1\\,\\mathsf{U}\\,\\psi_2) \\equiv \\exists t_2 > t_0 \\left[ ST_{t_2}(\\psi_2) \\land \\forall t\\, (t_0 < t < t_2 \\to ST_t(\\psi_1)) \\right]\\).",
      "preview": {
        "activeNodes": [
          "ltl_u"
        ],
        "activeEdges": []
      },
      "reveal": {
        "activeNodes": [
          "ltl_u",
          "fut_node",
          "fo_equiv"
        ],
        "activeEdges": [
          "e-u-fut",
          "e-fut-fo"
        ],
        "goodNodes": [
          "ltl_u",
          "fo_equiv"
        ]
      },
      "previewNote": "Modal formula ψ₁ U ψ₂.",
      "revealNote": "Direct FO[<] translation using quantifiers ∃t₂ > t₀ and ∀t: LTL ⊆ FO[<]."
    },
    {
      "label": "Expressive Challenge",
      "title": "Why expressive completeness is non-trivial",
      "exposition": "While embedding LTL into \\(\\mathrm{FO}[<]\\) takes a simple 5-line structural induction, proving the reverse direction (\\(\\mathrm{FO}[<] \\subseteq \\mathrm{LTL}\\)) is notoriously deep. First-order logic allows reusing variables, nesting quantifiers arbitrarily, and comparing disjoint intervals.",
      "question": "Why was it initially surprising that variable-free LTL could express all FO[<] properties?",
      "choices": [
        {
          "text": "Because \\(\\mathrm{FO}[<]\\) can reference an arbitrary number of time points simultaneously with independent variables, while LTL evaluates only at an implicit 'current' point without variables.",
          "correct": true,
          "feedback": "Spot on. In \\(\\mathrm{FO}[<]\\), one can write statements with 10 variables comparing pairs of intervals. Kamp proved that on linear orders, every such multi-variable relationship can be factored through local Until/Since modalities."
        },
        {
          "text": "Because LTL is an undecidable logic.",
          "correct": false,
          "causalFailure": "LTL satisfiability and model checking are completely decidable (PSPACE-complete)."
        },
        {
          "text": "Because first-order logic cannot express propositional conjunction.",
          "correct": false,
          "causalFailure": "First-order logic includes standard boolean conjunction \\(\\land\\) as a basic connective."
        }
      ],
      "hint": "Think about the syntactic difference: FO[<] has explicit variable names (x, y, z...); LTL has zero variables.",
      "formal": "\\(\\text{Challenge: eliminate unbounded bound variables } x_1, \\dots, x_k \\text{ in favor of modal operators } \\mathsf{U}, \\mathsf{S}\\).",
      "preview": {
        "activeNodes": [
          "fo_equiv"
        ],
        "activeEdges": []
      },
      "reveal": {
        "activeNodes": [
          "fo_equiv",
          "pres_node"
        ],
        "activeEdges": [
          "e-pres-fo"
        ]
      },
      "previewNote": "Arbitrary FO[<] formulas with complex variable scoping.",
      "revealNote": "Kamp's objective: factor all multi-variable relations into temporal modalities."
    },
    {
      "label": "Gabbay Separation",
      "title": "Gabbay's separation theorem on linear orders",
      "exposition": "Dov Gabbay established that Kamp's theorem holds because linear orders possess the Separation Property: every temporal formula can be decomposed into an equivalent boolean combination of terms, where each term refers purely to the past, purely to the present, or purely to the future.",
      "question": "What does the separation of a formula into pure components achieve?",
      "choices": [
        {
          "text": "It removes nested entanglements between past and future (e.g. \\(\\mathsf{F}(\\dots \\mathsf{P}\\dots)\\)), isolating future analysis from past history.",
          "correct": true,
          "feedback": "Precisely. Separation proves that you never need to look into the past from a point in the future; any such mixed claim can be rewritten into claims about the past and future evaluated independently from the present."
        },
        {
          "text": "It proves that the formula evaluates to true at all time steps.",
          "correct": false,
          "causalFailure": "Separation is an equivalence-preserving normal form; it does not change the truth value of the formula."
        },
        {
          "text": "It replaces all temporal operators with arithmetic addition.",
          "correct": false,
          "causalFailure": "Separation works entirely within temporal logic without arithmetic operators."
        }
      ],
      "hint": "Separation disentangles past and future: a formula is separated if its terms look strictly one way.",
      "formal": "\\(\\forall \\varphi \\in \\mathrm{LTL}[\\mathsf{U}, \\mathsf{S}],\\; \\varphi \\equiv \\bigvee_i \\left( \\text{Past}_i \\land \\text{Present}_i \\land \\text{Future}_i \\right)\\).",
      "preview": {
        "activeNodes": [
          "past_node",
          "pres_node",
          "fut_node"
        ],
        "activeEdges": []
      },
      "reveal": {
        "activeNodes": [
          "past_node",
          "pres_node",
          "fut_node"
        ],
        "activeEdges": [
          "e-s-past",
          "e-u-fut"
        ],
        "goodNodes": [
          "past_node",
          "pres_node",
          "fut_node"
        ]
      },
      "previewNote": "Mixed temporal formulas.",
      "revealNote": "Separation normal form: Pure Past (⇐) ∧ Present ∧ Pure Future (⇒)."
    },
    {
      "label": "Origin Equivalence",
      "title": "Initial validity and pure future completeness on (N, <)",
      "exposition": "We now consider specifications evaluated at the initial time \\(t=0\\) of a reactive execution on \\((\\mathbb{N}, <)\\). At \\(t=0\\), the set of predecessors \\(\\{t \\in \\mathbb{N} \\mid t < 0\\}\\) is empty.",
      "question": "Why does evaluating formulas at t=0 allow dropping the past operator Since (S)?",
      "choices": [
        {
          "text": "Because at \\(t=0\\) there is no past, so any pure past formula evaluates to false; thus every FO[<] sentence at \\(t=0\\) is expressible in pure-future LTL[U].",
          "correct": true,
          "feedback": "Spot on. In the separated form, past conjuncts are either vacuously false (if they require a past witness) or trivially true. The entire sentence simplifies to a pure-future formula in \\(\\mathrm{LTL}[\\mathsf{U}]\\)."
        },
        {
          "text": "Because time runs backwards on the natural numbers.",
          "correct": false,
          "causalFailure": "Time on \\((\\mathbb{N}, <)\\) flows forward: \\(0 < 1 < 2 < \\dots\\)."
        },
        {
          "text": "Because Since is an abbreviation for Until.",
          "correct": false,
          "causalFailure": "Since and Until are dual directional operators; Since cannot be defined from Until on general intervals."
        }
      ],
      "hint": "What is { t in N | t < 0 }? How does any formula requiring a past state evaluate at t = 0?",
      "formal": "\\(\\forall \\varphi \\in \\mathrm{FO}[<],\\; (\\mathbb{N}, <, 0) \\models \\varphi \\iff (\\mathbb{N}, <, 0) \\models \\psi_{\\text{future}} \\in \\mathrm{LTL}[\\mathsf{U}]\\). Kamp's theorem complete.",
      "preview": {
        "activeNodes": [
          "fo_equiv",
          "fut_node"
        ],
        "activeEdges": [
          "e-fut-fo"
        ]
      },
      "reveal": {
        "activeNodes": [
          "ltl_u",
          "fut_node",
          "fo_equiv"
        ],
        "activeEdges": [
          "e-u-fut",
          "e-fut-fo"
        ],
        "goodNodes": [
          "ltl_u",
          "fo_equiv"
        ]
      },
      "previewNote": "Separated formula evaluated at t = 0.",
      "revealNote": "Past vanishes at origin: pure-future LTL[U] is expressively complete for FO[<]."
    }
  ],
  "previous": {
    "label": "Vardi–Wolper tableau",
    "href": "/proofs/chapter-11/vardi-wolper-tableau.html"
  },
  "next": {
    "label": "LTL model checking",
    "href": "/proofs/chapter-12/ltl-model-checking.html"
  }
},

    "ltl-model-checking": {
  "slug": "ltl-model-checking",
  "chapter": 12,
  "title": "Automata-theoretic LTL model checking",
  "theorem": "Let \\(\\mathcal{M}\\) be a finite Kripke structure and \\(\\varphi\\) an LTL formula. Then \\(\\mathcal{M} \\models \\varphi \\iff L(\\mathcal{M}) \\subseteq L(\\varphi) \\iff L(\\mathcal{M}) \\cap L(\\neg\\varphi) = \\emptyset \\iff \\mathcal{M} \\otimes \\mathcal{A}_{\\neg\\varphi}\\) has no accepting run.",
  "intro": "Automata-theoretic model checking solves the universal verification problem ('do all paths of the system satisfy \\(\\\\varphi\\)?') by converting it into an existential refutation problem ('does there exist a path violating \\(\\\\varphi\\)?'). By compiling the negated formula \\(\\\\neg\\\\varphi\\) into a Büchi automaton \\(\\\\mathcal{A}_{\\\\neg\\\\varphi}\\), the problem reduces to searching for an accepting lasso in the synchronous product automaton.",
  "application": "This is the exact operational architecture implemented by industry-standard model checkers like SPIN, NuSMV, and Spot. If verification fails, the cycle detection produces an execution trace (counterexample) showing developers precisely where their system misbehaves.",
  "strategy": "Step 1: Translate verification into language containment \\(L(\\mathcal{M}) \\subseteq L(\\varphi)\\), and rewrite it as emptiness of the intersection: \\(L(\\mathcal{M}) \\cap L(\\neg\\varphi) = \\emptyset\\). Step 2: Construct the synchronous product automaton \\(\\mathcal{P} = \\mathcal{M} \\otimes \\mathcal{A}_{\\neg\\varphi}\\), where states are pairs \\((s, q) \\in S \\times Q\\) and transitions synchronize the Kripke state transition with the automaton transition reading the proposition label \\(L(s)\\). Step 3: Projection lemma: prove that an accepting run in \\(\\mathcal{P}\\) projects directly to an infinite execution in \\(\\mathcal{M}\\) accepted by \\(\\mathcal{A}_{\\neg\\varphi}\\), witnessing \\(\\mathcal{M} \\not\\models \\varphi\\). Step 4: On-the-fly Nested Depth-First Search (NDFS): detect accepting lassos without constructing the full product upfront, solving model checking in time \\(O(|\\mathcal{M}| \\cdot 2^{O(|\\varphi|)})\\).",
  "invariant": "\\(\\text{Accepting run in } \\mathcal{M} \\otimes \\mathcal{A}_{\\neg\\varphi} \\iff \\exists \\text{ path } \\pi \\text{ of } \\mathcal{M} \\text{ such that } \\pi \\models \\neg\\varphi\\)",
  "synthesis": "Let \\(\\mathcal{M}=(S, S_0, R, L, AP)\\) and \\(\\mathcal{A}_{\\neg\\varphi}=(Q, 2^{AP}, \\Delta, Q_0, F)\\). The product automaton is \\(\\mathcal{P} = (S \\times Q, 2^{AP}, \\Delta_\\mathcal{P}, S_0 \\times Q_0, S \\times F)\\), where \\(((s, q), a, (s', q')) \\in \\Delta_\\mathcal{P} \\iff (s, s') \\in R \\land a = L(s) \\land q' \\in \\Delta(q, L(s))\\). Any accepting run in \\(\\mathcal{P}\\) visits \\(S \\times F\\) infinitely often. Projecting onto \\(S\\) yields an infinite path \\(\\pi = s_0 s_1 \\dots\\) of \\(\\mathcal{M}\\), and projecting onto \\(Q\\) yields an accepting run of \\(\\mathcal{A}_{\\neg\\varphi}\\) on \\(L(\\pi)\\). Thus \\(L(\\pi) \\in L(\\mathcal{A}_{\\neg\\varphi}) = L(\\neg\\varphi)\\), which proves \\(\\pi \\not\\models \\varphi\\) and hence \\(\\mathcal{M} \\not\\models \\varphi\\). Conversely, if \\(\\mathcal{M} \\not\\models \\varphi\\), there exists a path \\(\\pi\\) of \\(\\mathcal{M}\\) with \\(\\pi \\models \\neg\\varphi\\); then \\(L(\\pi)\\) is accepted by \\(\\mathcal{A}_{\\neg\\varphi}\\) via some run \\(\\rho\\). Pairing \\(\\pi\\) and \\(\\rho\\) produces an accepting run in \\(\\mathcal{P}\\). Emptiness of \\(\\mathcal{P}\\) is decided in linear time \\(O(|S\\times Q| + |\\Delta_\\mathcal{P}|)\\) via Courcoubetis et al.'s Nested DFS, which explores states on-the-fly using two interleaved DFS traversals (blue for reachability, red for cycle detection).",
  "diagram": {
    "description": "Automata-theoretic verification: synchronizing Kripke structure M with negated monitor A_{¬φ} into the product M ⊗ A_{¬φ}.",
    "viewBox": [
      0,
      0,
      1000,
      520
    ],
    "lanes": [
      {
        "y": 160,
        "label": "System Model: Kripke Structure ℳ",
        "labelX": 35,
        "labelY": 45
      },
      {
        "y": 340,
        "label": "Violation Monitor: Büchi Automaton Ⅎ_¬φ",
        "labelX": 35,
        "labelY": 220
      },
      {
        "y": 490,
        "label": "Synchronous Product: ℳ ⊗ Ⅎ_¬φ (Counterexample Lasso)",
        "labelX": 35,
        "labelY": 390
      }
    ],
    "nodes": [
      {
        "id": "m0",
        "x": 250,
        "y": 100,
        "label": "s₀ {p}",
        "detail": "Kripke initial",
        "shape": "circle",
        "r": 46
      },
      {
        "id": "m1",
        "x": 750,
        "y": 100,
        "label": "s₁ {¬p}",
        "detail": "system state",
        "shape": "circle",
        "r": 46
      },
      {
        "id": "a0",
        "x": 250,
        "y": 260,
        "label": "q₀",
        "detail": "monitor start",
        "shape": "circle",
        "r": 46
      },
      {
        "id": "af",
        "x": 750,
        "y": 260,
        "label": "q_f ∈ F",
        "detail": "accepts violation",
        "shape": "circle",
        "r": 48,
        "accepting": true
      },
      {
        "id": "p0",
        "x": 250,
        "y": 430,
        "label": "(s₀, q₀)",
        "detail": "product initial",
        "shape": "rect",
        "width": 140,
        "height": 56
      },
      {
        "id": "pf",
        "x": 650,
        "y": 430,
        "label": "(s₁, q_f)",
        "detail": "accepting product",
        "shape": "rect",
        "width": 150,
        "height": 56,
        "accepting": true
      },
      {
        "id": "ploop",
        "x": 850,
        "y": 430,
        "label": "(s₀, q_f)",
        "detail": "cycle return",
        "shape": "rect",
        "width": 140,
        "height": 56
      }
    ],
    "edges": [
      {
        "id": "e-m0-m1",
        "from": "m0",
        "to": "m1",
        "label": "trans R",
        "labelY": 80
      },
      {
        "id": "e-m1-m0",
        "from": "m1",
        "to": "m0",
        "label": "trans R",
        "path": "M 710 130 C 500 170 350 170 290 130",
        "labelX": 500,
        "labelY": 175
      },
      {
        "id": "e-a0-af",
        "from": "a0",
        "to": "af",
        "label": "read {¬p}",
        "labelY": 240
      },
      {
        "id": "e-af-af",
        "from": "af",
        "to": "af",
        "label": "loop {¬p}",
        "path": "M 785 235 C 850 200 850 320 785 285",
        "labelX": 870,
        "labelY": 260
      },
      {
        "id": "e-p0-pf",
        "from": "p0",
        "to": "pf",
        "label": "synch step",
        "labelY": 410
      },
      {
        "id": "e-pf-pl",
        "from": "pf",
        "to": "ploop",
        "label": "stem to loop",
        "labelY": 410
      },
      {
        "id": "e-pl-pf",
        "from": "ploop",
        "to": "pf",
        "label": "close lasso cycle",
        "path": "M 810 465 C 750 510 700 510 660 465",
        "labelX": 740,
        "labelY": 510
      }
    ],
    "annotations": [
      {
        "x": 500,
        "y": 505,
        "text": "Lasso in ℳ ⊗ Ⅎ_¬φ projects to a concrete system execution violating φ.",
        "anchor": "middle"
      }
    ]
  },
  "steps": [
    {
      "label": "Falsification Duality",
      "title": "Universal verification transformed into existential falsification",
      "exposition": "A system \\(\\mathcal{M}\\) satisfies a specification \\(\\varphi\\) if all possible infinite paths \\(\\pi \\in \\mathrm{Paths}(\\mathcal{M})\\) satisfy \\(\\varphi\\). Checking this directly requires testing every path. Model checking turns this universal question into an existential search for a violation.",
      "question": "Which set-theoretic equivalence underpins automata-theoretic model checking?",
      "choices": [
        {
          "text": "\\(\\mathcal{M} \\models \\varphi \\iff L(\\mathcal{M}) \\subseteq L(\\varphi) \\iff L(\\mathcal{M}) \\cap L(\\neg\\varphi) = \\emptyset\\).",
          "correct": true,
          "feedback": "Correct. All system behaviors satisfy \\(\\varphi\\) iff no system behavior satisfies \\(\\neg\\varphi\\). Finding a single path in the intersection disproves the specification."
        },
        {
          "text": "\\(\\mathcal{M} \\models \\varphi \\iff L(\\mathcal{M}) = L(\\varphi)\\).",
          "correct": false,
          "causalFailure": "Equality is too strong: the system does not need to exhibit every possible behavior permitted by \\(\\varphi\\); it only needs to avoid forbidden behaviors (\\(L(\\mathcal{M}) \\subseteq L(\\varphi)\\))."
        },
        {
          "text": "\\(\\mathcal{M} \\models \\varphi \\iff L(\\mathcal{M}) \\cup L(\\neg\\varphi) = \\Sigma^\\omega\\).",
          "correct": false,
          "causalFailure": "Union with \\(\\neg\\varphi\\) being universal does not guarantee containment; it holds trivially if \\(L(\\neg\\varphi)\\) is universal."
        }
      ],
      "hint": "Remember the relation between subset containment A ⊆ B and intersection with the complement A ∩ B^c.",
      "formal": "\\(\\mathcal{M} \\models \\varphi \\iff \\mathrm{Paths}(\\mathcal{M}) \\subseteq \\text{Models}(\\varphi) \\iff \\mathrm{Paths}(\\mathcal{M}) \\cap \\text{Models}(\\neg\\varphi) = \\emptyset\\).",
      "preview": {
        "activeNodes": [
          "m0",
          "a0"
        ],
        "activeEdges": []
      },
      "reveal": {
        "activeNodes": [
          "m0",
          "m1",
          "a0",
          "af"
        ],
        "activeEdges": [
          "e-m0-m1",
          "e-a0-af"
        ],
        "goodNodes": [
          "m0",
          "a0"
        ]
      },
      "previewNote": "Universal verification question.",
      "revealNote": "Negation ¬φ targets bad paths: emptiness of intersection is the goal."
    },
    {
      "label": "Synchronous Product",
      "title": "Constructing the synchronous product automaton M (x) A_{¬φ}",
      "exposition": "To compute the intersection \\(L(\\mathcal{M}) \\cap L(\\neg\\varphi)\\), we construct the synchronous product \\(\\mathcal{P} = \\mathcal{M} \\otimes \\mathcal{A}_{\\neg\\varphi}\\). A state in \\(\\mathcal{P}\\) is a pair \\((s, q)\\) containing the current Kripke state \\(s\\) and the current automaton state \\(q\\).",
      "question": "How are transitions defined in the product automaton?",
      "choices": [
        {
          "text": "\\((s, q) \\to (s', q')\\) exists in \\(\\mathcal{P}\\) iff \\((s, s') \\in R\\) is a valid system step and \\(q' \\in \\Delta(q, L(s))\\) is a valid automaton step reading the label of \\(s\\).",
          "correct": true,
          "feedback": "Precisely. The monitor \\(\\mathcal{A}_{\\neg\\varphi}\\) synchronously tracks the execution of \\(\\mathcal{M}\\): at each step, the automaton reads the atomic propositions currently active in the system state."
        },
        {
          "text": "Transitions can be taken by the system and the automaton at completely independent asynchronous times.",
          "correct": false,
          "causalFailure": "Asynchronous execution would desynchronize the monitor from the state sequence it is supposed to inspect."
        },
        {
          "text": "The product transition exists only when the Kripke state and the automaton state have the same name.",
          "correct": false,
          "causalFailure": "State names in \\(\\mathcal{M}\\) and \\(\\mathcal{A}_{\\neg\\varphi}\\) come from completely different sets; synchronization is governed by atomic proposition labels."
        }
      ],
      "hint": "Synchronization means lock-step: when the system moves s -> s', the automaton reads the label L(s) and updates q -> q'.",
      "formal": "\\(((s, q), (s', q')) \\in \\Delta_\\mathcal{P} \\iff (s, s') \\in R \\land q' \\in \\Delta(q, L(s))\\). Accepting states: \\(F_\\mathcal{P} = S \\times F\\).",
      "preview": {
        "activeNodes": [
          "p0"
        ],
        "activeEdges": []
      },
      "reveal": {
        "activeNodes": [
          "p0",
          "pf",
          "ploop"
        ],
        "activeEdges": [
          "e-p0-pf",
          "e-pf-pl",
          "e-pl-pf"
        ],
        "goodNodes": [
          "p0",
          "pf"
        ]
      },
      "previewNote": "Initial product state (s₀, q₀).",
      "revealNote": "Synchronous product edges track system transitions matching automaton labels."
    },
    {
      "label": "Projection Lemma",
      "title": "Accepting runs in the product witness counterexample executions",
      "exposition": "We verify the correctness of the reduction: an accepting run in the product \\(\\mathcal{P}\\) exists if and only if the system violates the specification.",
      "question": "What does an accepting run rho_P in the product automaton correspond to in the physical system?",
      "choices": [
        {
          "text": "Its projection onto the system states yields an executable infinite path \\(\\pi\\) of \\(\\mathcal{M}\\) that satisfies \\(\\neg\\varphi\\), proving \\(\\mathcal{M} \\not\\models \\varphi\\).",
          "correct": true,
          "feedback": "Spot on. An accepting run in \\(\\mathcal{P}\\) visits \\(S \\times F\\) infinitely often, which means the automaton monitor accepted the execution trace. This provides an indisputable bug witness (counterexample)."
        },
        {
          "text": "It proves that the system satisfies \\(\\varphi\\) on all execution branches.",
          "correct": false,
          "causalFailure": "An accepting run in the product accepts \\(\\neg\\varphi\\); this refutes \\(\\varphi\\) rather than proving it."
        },
        {
          "text": "It indicates that the Kripke structure has deadlocks.",
          "correct": false,
          "causalFailure": "Deadlocks are states without outgoing transitions; accepting runs are infinite sequences of transitions."
        }
      ],
      "hint": "Remember that the automaton is for the NEGATED formula ¬φ. Accepting ¬φ means finding a violation.",
      "formal": "\\(\\rho_\\mathcal{P} = (s_0, q_0)(s_1, q_1)\\dots \\in \\text{Acc}(\\mathcal{P}) \\implies \\pi = s_0 s_1 \\dots \\in \\mathrm{Paths}(\\mathcal{M}) \\land L(\\pi) \\models \\neg\\varphi\\).",
      "preview": {
        "activeNodes": [
          "pf",
          "ploop"
        ],
        "activeEdges": [
          "e-pf-pl",
          "e-pl-pf"
        ]
      },
      "reveal": {
        "activeNodes": [
          "m0",
          "m1",
          "p0",
          "pf",
          "ploop"
        ],
        "activeEdges": [
          "e-m0-m1",
          "e-m1-m0",
          "e-p0-pf",
          "e-pf-pl",
          "e-pl-pf"
        ],
        "badNodes": [
          "pf",
          "ploop"
        ]
      },
      "previewNote": "Accepting cycle in product.",
      "revealNote": "Projection to M provides concrete counterexample lasso: violation detected."
    },
    {
      "label": "On-the-Fly NDFS",
      "title": "Nested DFS complexity and memory efficiency",
      "exposition": "Constructing the entire product \\(\\mathcal{M} \\otimes \\mathcal{A}_{\\neg\\varphi}\\) in memory is prohibitive for large systems. The Nested Depth-First Search (NDFS) algorithm searches for counterexample lassos on-the-fly.",
      "question": "How does Nested DFS find an accepting lasso in linear time without building the full product?",
      "choices": [
        {
          "text": "A primary DFS (blue) explores reachable states and, when backtracking from an accepting state, launches a nested DFS (red) to detect a cycle back to that accepting state.",
          "correct": true,
          "feedback": "Precisely. Blue DFS discovers reachable accepting states in post-order; red DFS immediately searches for a return cycle. Because each state is visited at most twice (once blue, once red), complexity is strictly linear in the product size."
        },
        {
          "text": "It generates random paths until an accepting state is hit.",
          "correct": false,
          "causalFailure": "Random walk does not provide exhaustive verification or correctness guarantees."
        },
        {
          "text": "It computes the transitive closure matrix of the product automaton.",
          "correct": false,
          "causalFailure": "Transitive closure requires cubic time \\(O(|V|^3)\\) and quadratic memory, leading to immediate state explosion."
        }
      ],
      "hint": "Nested DFS uses two passes: one to find accepting states, and a nested one to detect return cycles.",
      "formal": "\\(\\text{Complexity: } O(|\\mathcal{M}| \\cdot 2^{O(|\\varphi|)})\\) time and \\(O(|\\mathcal{M}| \\cdot 2^{O(|\\varphi|)})\\) space. Verified on-the-fly.",
      "preview": {
        "activeNodes": [
          "p0",
          "pf"
        ],
        "activeEdges": [
          "e-p0-pf"
        ]
      },
      "reveal": {
        "activeNodes": [
          "p0",
          "pf",
          "ploop"
        ],
        "activeEdges": [
          "e-p0-pf",
          "e-pf-pl",
          "e-pl-pf"
        ],
        "goodNodes": [
          "p0"
        ],
        "badNodes": [
          "pf",
          "ploop"
        ]
      },
      "previewNote": "Primary blue DFS reaches accepting product state.",
      "revealNote": "Nested red DFS closes cycle: lasso found on-the-fly in linear time."
    }
  ],
  "previous": {
    "label": "Kamp's theorem",
    "href": "/proofs/chapter-11/kamp-theorem.html"
  },
  "next": {
    "label": "CTL fixed points",
    "href": "/proofs/chapter-13/ctl-fixed-points.html"
  }
},

    "ctl-fixed-points": {
  "slug": "ctl-fixed-points",
  "chapter": 13,
  "title": "CTL fixed-point characterizations",
  "theorem": "In CTL model checking over a finite Kripke structure \\(\\mathcal{M}=(S, R, L)\\), temporal operators are characterized as least (\\(\\mu\\)) and greatest (\\(\\nu\\)) fixed points of monotone predicate transformers: \\(\\llbracket \\mathsf{EF}\\,\\varphi \\rrbracket = \\mu Z.\\,(\\llbracket\\varphi\\rrbracket \\cup \\textit{Pre}_E(Z))\\) and \\(\\llbracket \\mathsf{EG}\\,\\varphi \\rrbracket = \\nu Z.\\,(\\llbracket\\varphi\\rrbracket \\cap \\textit{Pre}_E(Z))\\).",
  "intro": "Branching-time logic CTL quantifies over paths branching from each state. Rather than searching graph paths individually, symbolic CTL model checking evaluates formulas by computing fixed points of set transformers over the power set lattice \\((2^S, \\subseteq)\\). The Knaster–Tarski theorem guarantees that reachability operators (\\(\\\\mathsf{EF}, \\\\mathsf{AF}, \\\\mathsf{EU}\\)) correspond to least fixed points, while safety/invariance operators (\\(\\\\mathsf{EG}, \\\\mathsf{AG}\\)) correspond to greatest fixed points.",
  "application": "This fixed-point characterization is the theoretical engine behind symbolic model checking with Binary Decision Diagrams (BDDs) and SAT-based model checkers. It allows evaluating properties over systems with \\(10^{20}\\) states without ever building explicit state graphs.",
  "strategy": "Step 1: Set up the complete lattice \\((2^S, \\subseteq)\\) and prove that the existential predecessor transformer \\(\\textit{Pre}_E(Z) = \\{s \\in S \\mid \\exists s'.\\; (s, s') \\in R \\land s' \\in Z\\}\\) is monotonic. Step 2: Formulate \\(\\mathsf{EF}\\,\\varphi\\) as the least fixed point \\(\\mu Z.\\, \\tau_{\\mathsf{EF}}(Z)\\) with \\(\\tau_{\\mathsf{EF}}(Z) = \\llbracket\\varphi\\rrbracket \\cup \\textit{Pre}_E(Z)\\); show that the iteration starting from \\(Z_0 = \\emptyset\\) discovers states at distance \\(\\le k\\) from \\(\\llbracket\\varphi\\rrbracket\\). Step 3: Formulate \\(\\mathsf{EG}\\,\\varphi\\) as the greatest fixed point \\(\\nu Z.\\, \\tau_{\\mathsf{EG}}(Z)\\) with \\(\\tau_{\\mathsf{EG}}(Z) = \\llbracket\\varphi\\rrbracket \\cap \\textit{Pre}_E(Z)\\); show that the iteration starting from \\(Z_0 = S\\) prunes states from which no infinite \\(\\varphi\\)-path can continue. Step 4: Bound convergence at \\(\\le |S|\\) steps by finiteness of \\(S\\), and link to BDD operations.",
  "invariant": "\\(\\text{For } \\mathsf{EF}: Z_k = \\{s \\mid \\text{dist}(s, \\llbracket\\varphi\\rrbracket) \\le k\\}\\). \\(\\text{For } \\mathsf{EG}: Z_k = \\{s \\mid \\exists \\text{ path of length } k \\text{ satisfying } \\varphi\\}\\)",
  "synthesis": "Let \\(\\mathcal{M}=(S, R, L)\\) be a finite Kripke structure. The powerset \\(\\mathcal{P}(S)\\) ordered by \\(\\subseteq\\) is a complete lattice. The operator \\(\\tau_{\\mathsf{EF}}(Z) = \\llbracket\\varphi\\rrbracket \\cup \\textit{Pre}_E(Z)\\) is monotonic: \\(A \\subseteq B \\implies \\tau_{\\mathsf{EF}}(A) \\subseteq \\tau_{\\mathsf{EF}}(B)\\). By the Knaster–Tarski theorem, \\(\\tau_{\\mathsf{EF}}\\) possesses a unique least fixed point \\(\\mu Z.\\,\\tau_{\\mathsf{EF}}(Z) = \\bigcup_{k \\ge 0} \\tau_{\\mathsf{EF}}^k(\\emptyset)\\). By induction on \\(k\\), \\(\\tau_{\\mathsf{EF}}^k(\\emptyset)\\) contains all states that can reach \\(\\llbracket\\varphi\\rrbracket\\) in at most \\(k\\) steps; since \\(S\\) is finite, the sequence stabilizes at some \\(k^* \\le |S|\\), exactly equal to \\(\\llbracket\\mathsf{EF}\\,\\varphi\\rrbracket\\). Dually, \\(\\tau_{\\mathsf{EG}}(Z) = \\llbracket\\varphi\\rrbracket \\cap \\textit{Pre}_E(Z)\\) is monotonic; its unique greatest fixed point is \\(\\nu Z.\\,\\tau_{\\mathsf{EG}}(Z) = \\bigcap_{k \\ge 0} \\tau_{\\mathsf{EG}}^k(S)\\). By induction on \\(k\\), \\(\\tau_{\\mathsf{EG}}^k(S)\\) contains states from which there exists a path of length \\(k\\) entirely in \\(\\llbracket\\varphi\\rrbracket\\). Stabilization occurs at \\(k^* \\le |S|\\), where remaining states possess a cycle in \\(\\llbracket\\varphi\\rrbracket\\), proving equality with \\(\\llbracket\\mathsf{EG}\\,\\varphi\\rrbracket\\).",
  "diagram": {
    "description": "Fixed-point evaluation in the subset lattice: least fixed point expansion from empty set for EF versus greatest fixed point pruning from S for EG.",
    "viewBox": [
      0,
      0,
      1000,
      520
    ],
    "lanes": [
      {
        "y": 160,
        "label": "Least Fixed Point μZ (∅ ↗ Reachability EF)",
        "labelX": 35,
        "labelY": 45
      },
      {
        "y": 340,
        "label": "Greatest Fixed Point νZ (S ↘ Invariance EG)",
        "labelX": 35,
        "labelY": 220
      },
      {
        "y": 490,
        "label": "State Lattice (2^S, ⊆): Convergence in ≤ |S| Iterations",
        "labelX": 35,
        "labelY": 390
      }
    ],
    "nodes": [
      {
        "id": "phi_seed",
        "x": 200,
        "y": 100,
        "label": "⟦φ⟧ (Seed)",
        "detail": "base target",
        "shape": "circle",
        "r": 48,
        "accepting": true
      },
      {
        "id": "ef_step1",
        "x": 450,
        "y": 100,
        "label": "Z₁ = ⟦φ⟧ ∪ Pre(Z₀)",
        "detail": "distance ≤ 1",
        "shape": "rect",
        "width": 170,
        "height": 56
      },
      {
        "id": "ef_fix",
        "x": 750,
        "y": 100,
        "label": "μZ.τ_EF (Fixed Point)",
        "detail": "⟦EF φ⟧ computed",
        "shape": "rect",
        "width": 180,
        "height": 60,
        "accepting": true
      },
      {
        "id": "eg_seed",
        "x": 200,
        "y": 260,
        "label": "Z₀ = S",
        "detail": "entire state space",
        "shape": "rect",
        "width": 150,
        "height": 56
      },
      {
        "id": "eg_prune",
        "x": 450,
        "y": 260,
        "label": "Z₁ = ⟦φ⟧ ∩ Pre(S)",
        "detail": "pruned dead ends",
        "shape": "rect",
        "width": 170,
        "height": 56
      },
      {
        "id": "eg_fix",
        "x": 750,
        "y": 260,
        "label": "νZ.τ_EG (Fixed Point)",
        "detail": "⟦EG φ⟧ cycle safe",
        "shape": "rect",
        "width": 180,
        "height": 60,
        "accepting": true
      }
    ],
    "edges": [
      {
        "id": "e-ef0-ef1",
        "from": "phi_seed",
        "to": "ef_step1",
        "label": "τ_EF(∅)",
        "labelY": 80
      },
      {
        "id": "e-ef1-effix",
        "from": "ef_step1",
        "to": "ef_fix",
        "label": "stabilize ≤ |S|",
        "labelY": 80
      },
      {
        "id": "e-eg0-eg1",
        "from": "eg_seed",
        "to": "eg_prune",
        "label": "τ_EG(S)",
        "labelY": 240
      },
      {
        "id": "e-eg1-egfix",
        "from": "eg_prune",
        "to": "eg_fix",
        "label": "prune transient",
        "labelY": 240
      }
    ],
    "annotations": [
      {
        "x": 500,
        "y": 505,
        "text": "Knaster–Tarski Theorem: μ expands from ∅; ν shrinks from S. Evaluated symbolically with BDDs.",
        "anchor": "middle"
      }
    ]
  },
  "steps": [
    {
      "label": "Lattice Monotonicity",
      "title": "Monotone predicate transformers on the powerset lattice",
      "exposition": "Let \\(\\mathcal{M}=(S, R, L)\\) be a finite Kripke structure. The powerset \\(\\mathcal{P}(S) = 2^S\\) ordered by subset inclusion \\(\\subseteq\\) forms a complete lattice. The predecessor operator \\(\\textit{Pre}_E(Z) = \\{s \\in S \\mid \\exists s'.\\; (s, s') \\in R \\land s' \\in Z\\}\\) maps state sets to state sets.",
      "question": "Why is the predecessor operator Pre_E monotonic on the lattice (2^S, ⊆)?",
      "choices": [
        {
          "text": "Because if \\(A \\subseteq B\\), any state that has a successor in \\(A\\) automatically has that same successor in \\(B\\), ensuring \\(\\textit{Pre}_E(A) \\subseteq \\textit{Pre}_E(B)\\).",
          "correct": true,
          "feedback": "Correct. Monotonicity is preserved because expanding the target set can only add new qualifying states, never remove states that already qualified."
        },
        {
          "text": "Because \\(\\textit{Pre}_E\\) inverts the subset ordering: \\(A \\subseteq B \\implies \\textit{Pre}_E(B) \\subseteq \\textit{Pre}_E(A)\\).",
          "correct": false,
          "causalFailure": "Inverting the order would make the operator antitone (like negation); \\(\\textit{Pre}_E\\) is strictly monotone."
        },
        {
          "text": "Because \\(\\textit{Pre}_E(Z)\\) is always equal to the empty set.",
          "correct": false,
          "causalFailure": "\\(\\textit{Pre}_E(Z)\\) is non-empty whenever some state has transitions leading into \\(Z\\)."
        }
      ],
      "hint": "If you enlarge the set of destinations B ⊇ A, does the set of states that can reach B get larger or smaller?",
      "formal": "\\(A \\subseteq B \\implies \\textit{Pre}_E(A) \\subseteq \\textit{Pre}_E(B)\\). Monotonicity guarantees existence of fixed points via Knaster–Tarski.",
      "preview": {
        "activeNodes": [
          "phi_seed"
        ],
        "activeEdges": []
      },
      "reveal": {
        "activeNodes": [
          "phi_seed",
          "ef_step1"
        ],
        "activeEdges": [
          "e-ef0-ef1"
        ],
        "goodNodes": [
          "phi_seed",
          "ef_step1"
        ]
      },
      "previewNote": "Seed set of states.",
      "revealNote": "Pre_E expansion is strictly monotone on the subset lattice."
    },
    {
      "label": "Least Fixed Point (EF)",
      "title": "Reachability as a least fixed point μ expanding from the empty set",
      "exposition": "The CTL formula \\(\\mathsf{EF}\\,\\varphi\\) asserts that there exists a path reaching a state satisfying \\(\\varphi\\). We formulate this as the least fixed point of \\(\\tau_{\\mathsf{EF}}(Z) = \\llbracket\\varphi\\rrbracket \\cup \\textit{Pre}_E(Z)\\).",
      "question": "Why does iterating tau_EF starting from the empty set Z_0 = ∅ compute the exact set of states satisfying EF φ?",
      "choices": [
        {
          "text": "Because \\(Z_0 = \\emptyset\\), \\(Z_1 = \\llbracket\\varphi\\rrbracket\\) (distance 0), and each round adds states that can reach the previous set in one step, discovering all states at finite distance from \\(\\llbracket\\varphi\\rrbracket\\).",
          "correct": true,
          "feedback": "Spot on. By induction on \\(k\\), \\(\\tau_{\\mathsf{EF}}^k(\\emptyset)\\) contains states having a path of length \\(\\le k\\) to \\(\\llbracket\\varphi\\rrbracket\\). Finite reachability demands a finite path, which is precisely captured by the least fixed point."
        },
        {
          "text": "Because starting from the empty set forces all states to be deleted.",
          "correct": false,
          "causalFailure": "Iterating \\(\\tau_{\\mathsf{EF}}\\) accumulates states monotonically; it never deletes anything."
        },
        {
          "text": "Because \\(\\mathsf{EF}\\,\\varphi\\) requires \\(\\varphi\\) to hold in all reachable states simultaneously.",
          "correct": false,
          "causalFailure": "Holding in all reachable states is the universal invariant \\(\\mathsf{AG}\\,\\varphi\\), not existential reachability \\(\\mathsf{EF}\\,\\varphi\\)."
        }
      ],
      "hint": "Think of backward BFS reachability: you start with target states, then add 1-step predecessors, then 2-step predecessors...",
      "formal": "\\(\\llbracket \\mathsf{EF}\\,\\varphi \\rrbracket = \\mu Z.\\, (\\llbracket\\varphi\\rrbracket \\cup \\textit{Pre}_E(Z)) = \\bigcup_{k \\ge 0} \\tau_{\\mathsf{EF}}^k(\\emptyset)\\).",
      "preview": {
        "activeNodes": [
          "phi_seed",
          "ef_step1"
        ],
        "activeEdges": [
          "e-ef0-ef1"
        ]
      },
      "reveal": {
        "activeNodes": [
          "phi_seed",
          "ef_step1",
          "ef_fix"
        ],
        "activeEdges": [
          "e-ef0-ef1",
          "e-ef1-effix"
        ],
        "goodNodes": [
          "ef_fix"
        ]
      },
      "previewNote": "Z₁ contains states at distance ≤ 1.",
      "revealNote": "Stabilization reaches least fixed point ⟦EF φ⟧: finite reachability proved."
    },
    {
      "label": "Greatest Fixed Point (EG)",
      "title": "Global safety as a greatest fixed point ν shrinking from S",
      "exposition": "The CTL formula \\(\\mathsf{EG}\\,\\varphi\\) asserts that there exists an infinite path along which \\(\\varphi\\) holds globally at every step. We formulate this as the greatest fixed point of \\(\\tau_{\\mathsf{EG}}(Z) = \\llbracket\\varphi\\rrbracket \\cap \\textit{Pre}_E(Z)\\).",
      "question": "Why must EG φ be computed as a greatest fixed point starting from Z_0 = S rather than the empty set?",
      "choices": [
        {
          "text": "Because starting from \\(Z_0 = \\emptyset\\) would yield \\(\\tau_{\\mathsf{EG}}(\\emptyset) = \\llbracket\\varphi\\rrbracket \\cap \\emptyset = \\emptyset\\); starting from \\(S\\) systematically prunes states that cannot sustain an infinite path in \\(\\llbracket\\varphi\\rrbracket\\).",
          "correct": true,
          "feedback": "Precisely. If we started from \\(\\emptyset\\), the least fixed point of \\(\\tau_{\\mathsf{EG}}\\) would be trivially empty. Safety/invariance is about survival: start with all states, and iteratively remove states that hit dead-ends or non-\\(\\varphi\\) regions."
        },
        {
          "text": "Because greatest fixed points cannot be evaluated on finite systems.",
          "correct": false,
          "causalFailure": "On finite systems, greatest fixed points stabilize in at most \\(|S|\\) iterations, just like least fixed points."
        },
        {
          "text": "Because \\(\\mathsf{EG}\\,\\varphi\\) is the logical negation of \\(\\top\\).",
          "correct": false,
          "causalFailure": "\\(\\mathsf{EG}\\,\\varphi\\) is the negation of \\(\\mathsf{AF}\\,\\neg\\varphi\\), which is a meaningful temporal property."
        }
      ],
      "hint": "What happens if you plug Z = ∅ into tau_EG(Z) = [[phi]] ∩ Pre(Z)? It gives ∅ immediately!",
      "formal": "\\(\\llbracket \\mathsf{EG}\\,\\varphi \\rrbracket = \\nu Z.\\, (\\llbracket\\varphi\\rrbracket \\cap \\textit{Pre}_E(Z)) = \\bigcap_{k \\ge 0} \\tau_{\\mathsf{EG}}^k(S)\\).",
      "preview": {
        "activeNodes": [
          "eg_seed"
        ],
        "activeEdges": []
      },
      "reveal": {
        "activeNodes": [
          "eg_seed",
          "eg_prune",
          "eg_fix"
        ],
        "activeEdges": [
          "e-eg0-eg1",
          "e-eg1-egfix"
        ],
        "goodNodes": [
          "eg_fix"
        ]
      },
      "previewNote": "Z₀ = S contains all candidate states.",
      "revealNote": "Greatest fixed point prunes states lacking infinite φ-successors: ⟦EG φ⟧ established."
    },
    {
      "label": "Symbolic BDDs",
      "title": "Finite convergence and symbolic model checking",
      "exposition": "Since the state space \\(S\\) is finite, any chain \\(Z_0 \\subseteq Z_1 \\subseteq \\dots\\) or \\(Z_0 \\supseteq Z_1 \\supseteq \\dots\\) must stabilize in at most \\(|S|\\) steps. In symbolic model checking, state sets are represented as Boolean characteristic functions encoded as Binary Decision Diagrams (BDDs).",
      "question": "How do fixed-point characterizations enable symbolic verification of systems with 10^20 states?",
      "choices": [
        {
          "text": "Because operations like intersection, union, and Pre_E are computed as polynomial-time Boolean operations on BDDs, avoiding explicit enumeration of individual states.",
          "correct": true,
          "feedback": "Spot on. A BDD of a few hundred nodes can represent sets of \\(10^{20}\\) states. Computing \\(\\textit{Pre}_E\\) reduces to relational product (\\(\\exists \\vec{s}'.\\, R(\\vec{s}, \\vec{s}') \\land Z(\\vec{s}')\\)), enabling fixed-point computation at massive scale."
        },
        {
          "text": "Because BDDs compress the state space into a single integer.",
          "correct": false,
          "causalFailure": "BDDs are directed acyclic graphs representing Boolean formulas, not single integers."
        },
        {
          "text": "Because symbolic model checking only checks the first 10 states of the system.",
          "correct": false,
          "causalFailure": "Symbolic model checking is completely exhaustive; it evaluates the property across all states simultaneously."
        }
      ],
      "hint": "BDDs represent characteristic functions of sets symbolically, transforming graph reachability into Boolean manipulation.",
      "formal": "\\(\\text{Convergence in } k^* \\le |S| \\text{ steps}\\). Symbolic step: \\(\\textit{Pre}_E(Z)(\\vec{s}) = \\exists \\vec{s}'.\\, (R(\\vec{s}, \\vec{s}') \\land Z(\\vec{s}'))\\).",
      "preview": {
        "activeNodes": [
          "ef_fix",
          "eg_fix"
        ],
        "activeEdges": []
      },
      "reveal": {
        "activeNodes": [
          "phi_seed",
          "ef_step1",
          "ef_fix",
          "eg_seed",
          "eg_prune",
          "eg_fix"
        ],
        "activeEdges": [
          "e-ef0-ef1",
          "e-ef1-effix",
          "e-eg0-eg1",
          "e-eg1-egfix"
        ],
        "goodNodes": [
          "ef_fix",
          "eg_fix"
        ]
      },
      "previewNote": "Fixed points stabilized.",
      "revealNote": "Symbolic CTL model checking: fixpoint transformers computed directly on BDDs."
    }
  ],
  "previous": {
    "label": "LTL model checking",
    "href": "/proofs/chapter-12/ltl-model-checking.html"
  },
  "next": {
    "label": "Angluin L* learning",
    "href": "/proofs/chapter-14/angluin-learning.html"
  }
},

    "angluin-learning": {
  "slug": "angluin-learning",
  "chapter": 14,
  "title": "Angluin's L* active learning algorithm correctness",
  "theorem": "Given a Minimally Adequate Teacher (membership queries \\(\\mathrm{MQ}\\) and equivalence queries \\(\\mathrm{EQ}\\)), Angluin's \\(L^*\\) algorithm synthesizes the unique minimal DFA for a regular target language \\(L\\) in polynomial time: each closed and consistent observation table defines a candidate DFA, and each counterexample strictly increases the number of Myhill–Nerode states.",
  "intro": "How can an algorithm discover the internal state machine of a black-box system knowing only its external input/output behavior? Dana Angluin's 1987 landmark \\(L^*\\) algorithm pioneered active grammatical inference. By organizing queries into an Observation Table \\((S, E, T)\\), the learner systematically discovers the equivalence classes of the Myhill–Nerode relation, guaranteeing polynomial-time convergence to the minimal DFA.",
  "application": "Active automata learning is the foundation of black-box software verification, network protocol reverse engineering (e.g. learning TLS/SSH state machines to find security flaws), and compositional assume-guarantee reasoning.",
  "strategy": "Step 1: The Observation Table \\((S, E, T)\\): prefixes \\(S \\subseteq \\Sigma^*\\) represent candidate states, boundary prefixes \\(S \\cdot \\Sigma\\) represent transitions, suffixes \\(E \\subseteq \\Sigma^*\\) represent distinguishing experiments, and table entries \\(T(w, e) \\in \\{0, 1\\}\\) record membership queries (\\(w e \\in L\\)). Define row vectors \\(\\operatorname{row}(s) = \\lambda e \\in E.\\, T(s, e)\\). Step 2: Table properties: closedness (\\(\\forall t \\in S \\cdot \\Sigma.\\, \\exists s \\in S.\\, \\operatorname{row}(t) = \\operatorname{row}(s)\\) — every transition leads to a known state) and consistency (\\(\\forall s_1, s_2 \\in S.\\, \\operatorname{row}(s_1) = \\operatorname{row}(s_2) \\implies \\forall a \\in \\Sigma.\\, \\operatorname{row}(s_1 a) = \\operatorname{row}(s_2 a)\\) — identical states make identical moves). Step 3: Candidate DFA construction: states \\(Q = \\{\\operatorname{row}(s) \\mid s \\in S\\}\\), initial state \\(\\operatorname{row}(\\varepsilon)\\), transitions \\(\\delta(\\operatorname{row}(s), a) = \\operatorname{row}(s a)\\), and accepting states \\(F = \\{\\operatorname{row}(s) \\mid T(s, \\varepsilon) = 1\\}\\). Prove well-definedness from closedness and consistency. Step 4: Counterexample processing and convergence: if an equivalence query returns a counterexample \\(w\\), adding all prefixes of \\(w\\) to \\(S\\) exposes an inconsistency or new row; the number of distinct rows strictly increases, bounded by the Myhill–Nerode index \\(n\\).",
  "invariant": "|\\{\\operatorname{row}(s) \\mid s \\in S\\}| \\le n \\text{ and each counterexample increases } |\\{\\operatorname{row}(s)\\}| \\text{ by at least 1}",
  "synthesis": "Let \\(L \\subseteq \\Sigma^*\\) be a regular language with Myhill–Nerode index \\(n\\). The observation table \\((S, E, T)\\) has \\(S, E\\) finite prefix-closed subsets of \\(\\Sigma^*\\). If the table is closed and consistent, we define the candidate DFA \\(\\mathcal{M} = (Q, \\Sigma, \\delta, q_0, F)\\) with \\(Q = \\{\\operatorname{row}(s) \\mid s \\in S\\}\\), \\(q_0 = \\operatorname{row}(\\varepsilon)\\), \\(\\delta(\\operatorname{row}(s), a) = \\operatorname{row}(sa)\\), and \\(F = \\{\\operatorname{row}(s) \\mid T(s, \\varepsilon) = 1\\}\\). Closedness guarantees \\(\\operatorname{row}(sa)\\) exists in \\(Q\\); consistency guarantees \\(\\delta\\) is a well-defined function independent of the chosen prefix representative \\(s\\). By induction on \\(|u|\\), \\(\\widehat{\\delta}(q_0, u) = \\operatorname{row}(u)\\). If \\(\\mathcal{M}\\) is correct, the algorithm terminates with the minimal DFA. If an equivalence query returns counterexample \\(w \\in L \\oplus L(\\mathcal{M})\\), adding \\(w\\) and all its prefixes to \\(S\\) forces the discovery of at least one new distinct row vector. Since every distinct row vector corresponds to a distinct Myhill–Nerode equivalence class of \\(L\\), the number of rows \\(|Q|\\) cannot exceed \\(n\\). Thus \\(L^*\\) performs at most \\(n\\) equivalence queries and at most \\(O(|\\Sigma| \\cdot n^2 + n \\cdot m)\\) membership queries, where \\(m\\) is the maximum counterexample length.",
  "diagram": {
    "description": "Angluin's Observation Table (S, E, T) showing closedness check (S·Σ into S) and consistency check leading to the minimal DFA.",
    "viewBox": [
      0,
      0,
      1000,
      520
    ],
    "lanes": [
      {
        "y": 160,
        "label": "Prefix Space S (Candidate States)",
        "labelX": 35,
        "labelY": 45
      },
      {
        "y": 340,
        "label": "Boundary S · Σ (One-Step Lookahead)",
        "labelX": 35,
        "labelY": 220
      },
      {
        "y": 490,
        "label": "Synthesized Minimal DFA (Myhill–Nerode Classes)",
        "labelX": 35,
        "labelY": 390
      }
    ],
    "nodes": [
      {
        "id": "row_eps",
        "x": 200,
        "y": 100,
        "label": "row(ε) = [0, 1]",
        "detail": "state [q₀]",
        "shape": "rect",
        "width": 170,
        "height": 56
      },
      {
        "id": "row_a",
        "x": 500,
        "y": 100,
        "label": "row(a) = [1, 0]",
        "detail": "state [q₁]",
        "shape": "rect",
        "width": 170,
        "height": 56
      },
      {
        "id": "row_b",
        "x": 800,
        "y": 100,
        "label": "row(b) = [0, 0]",
        "detail": "state [q_sink]",
        "shape": "rect",
        "width": 170,
        "height": 56
      },
      {
        "id": "row_aa",
        "x": 350,
        "y": 260,
        "label": "row(aa) = row(ε)",
        "detail": "closed: matches S",
        "shape": "rect",
        "width": 180,
        "height": 56
      },
      {
        "id": "row_ab",
        "x": 650,
        "y": 260,
        "label": "row(ab) = row(b)",
        "detail": "closed: matches S",
        "shape": "rect",
        "width": 180,
        "height": 56
      },
      {
        "id": "dfa_synth",
        "x": 500,
        "y": 430,
        "label": "Minimal DFA ℳ (n states)",
        "detail": "verified by Teacher",
        "shape": "rect",
        "width": 260,
        "height": 64,
        "accepting": true
      }
    ],
    "edges": [
      {
        "id": "e-eps-a",
        "from": "row_eps",
        "to": "row_a",
        "label": "read a",
        "labelY": 80
      },
      {
        "id": "e-a-aa",
        "from": "row_a",
        "to": "row_aa",
        "label": "trans a",
        "labelX": 410,
        "labelY": 180
      },
      {
        "id": "e-a-ab",
        "from": "row_a",
        "to": "row_ab",
        "label": "trans b",
        "labelX": 590,
        "labelY": 180
      },
      {
        "id": "e-aa-eps",
        "from": "row_aa",
        "to": "row_eps",
        "label": "matches row(ε)",
        "labelX": 260,
        "labelY": 200
      },
      {
        "id": "e-ab-b",
        "from": "row_ab",
        "to": "row_b",
        "label": "matches row(b)",
        "labelX": 740,
        "labelY": 200
      },
      {
        "id": "e-synth",
        "from": "row_aa",
        "to": "dfa_synth",
        "label": "table closed & consistent",
        "labelX": 410,
        "labelY": 360
      }
    ],
    "annotations": [
      {
        "x": 500,
        "y": 505,
        "text": "L* converges in ≤ n equivalence queries, producing the canonical minimal DFA.",
        "anchor": "middle"
      }
    ]
  },
  "steps": [
    {
      "label": "Observation Table",
      "title": "Prefixes, distinguishing suffixes, and membership queries",
      "exposition": "The learner maintains an observation table \\((S, E, T)\\) over alphabet \\(\\Sigma\\). \\(S \\subset \\Sigma^*\\) is a set of prefixes (representing states), and \\(E \\subset \\Sigma^*\\) is a set of suffixes (representing distinguishing experiments). For every \\(w \\in S \\cup (S \\cdot \\Sigma)\\) and \\(e \\in E\\), the entry \\(T(w, e) = 1\\) if \\(we \\in L\\), and \\(0\\) otherwise.",
      "question": "What does the row vector row(s) = lambda e in E. T(s, e) characterize about prefix s?",
      "choices": [
        {
          "text": "It summarizes the behavior of prefix \\(s\\) under all currently known test suffixes \\(E\\), approximating its Myhill–Nerode equivalence class.",
          "correct": true,
          "feedback": "Correct. Two prefixes \\(s_1, s_2\\) that have different row vectors are provably in different Myhill–Nerode equivalence classes, because some suffix in \\(E\\) distinguishes them."
        },
        {
          "text": "It counts the number of letters in the string s.",
          "correct": false,
          "causalFailure": "The row vector records binary membership answers for suffixes, not string length."
        },
        {
          "text": "It stores the IP address of the teacher.",
          "correct": false,
          "causalFailure": "The table stores formal language query results, completely unrelated to network addresses."
        }
      ],
      "hint": "Remember Myhill–Nerode equivalence: s_1 ~ s_2 iff for all suffixes z, s_1 z in L <=> s_2 z in L. What does row(s) test?",
      "formal": "\\(\\operatorname{row}(s) \\in \\{0, 1\\}^E\\). \\(\\operatorname{row}(s_1) \\neq \\operatorname{row}(s_2) \\implies s_1 \\not\\sim_L s_2\\).",
      "preview": {
        "activeNodes": [
          "row_eps",
          "row_a"
        ],
        "activeEdges": []
      },
      "reveal": {
        "activeNodes": [
          "row_eps",
          "row_a",
          "row_b"
        ],
        "activeEdges": [
          "e-eps-a"
        ],
        "goodNodes": [
          "row_eps",
          "row_a",
          "row_b"
        ]
      },
      "previewNote": "Prefix rows in table.",
      "revealNote": "Distinct row vectors correspond to provably distinct Myhill–Nerode states."
    },
    {
      "label": "Closedness and Consistency",
      "title": "Table closedness and consistency conditions",
      "exposition": "Before synthesizing a candidate DFA, the learner must verify two structural conditions on the table. A table is closed if for every \\(t \\in S \\cdot \\Sigma\\), there exists \\(s \\in S\\) such that \\(\\operatorname{row}(t) = \\operatorname{row}(s)\\). A table is consistent if whenever \\(\\operatorname{row}(s_1) = \\operatorname{row}(s_2)\\), we have \\(\\operatorname{row}(s_1 a) = \\operatorname{row}(s_2 a)\\) for all \\(a \\in \\Sigma\\).",
      "question": "What failure occurs in the candidate DFA if the table is NOT closed?",
      "choices": [
        {
          "text": "A state \\(\\operatorname{row}(s)\\) would have a transition on letter \\(a\\) leading to an unknown row vector not present among the states \\(S\\).",
          "correct": true,
          "feedback": "Precisely. If \\(\\operatorname{row}(sa)\\) does not match any row in \\(S\\), the automaton has no state to transition into! Closedness ensures every transition lands on a known state."
        },
        {
          "text": "The initial state of the DFA would be undefined.",
          "correct": false,
          "causalFailure": "The initial state is always \\(\\operatorname{row}(\\varepsilon)\\), which is in \\(S\\) from the very beginning."
        },
        {
          "text": "The alphabet \\(\\Sigma\\) would become infinite.",
          "correct": false,
          "causalFailure": "The alphabet is fixed and finite; table properties do not change the alphabet."
        }
      ],
      "hint": "Transitions are defined as delta(row(s), a) = row(sa). What if row(sa) is not in S?",
      "formal": "\\(\\text{Closed: } \\forall t \\in S \\cdot \\Sigma.\\, \\exists s \\in S.\\, \\operatorname{row}(t) = \\operatorname{row}(s)\\). \\(\\text{Consistent: } \\operatorname{row}(s_1)=\\operatorname{row}(s_2) \\implies \\forall a.\\, \\operatorname{row}(s_1 a)=\\operatorname{row}(s_2 a)\\).",
      "preview": {
        "activeNodes": [
          "row_aa",
          "row_ab"
        ],
        "activeEdges": []
      },
      "reveal": {
        "activeNodes": [
          "row_aa",
          "row_ab",
          "row_eps",
          "row_b"
        ],
        "activeEdges": [
          "e-aa-eps",
          "e-ab-b"
        ],
        "goodNodes": [
          "row_aa",
          "row_ab"
        ]
      },
      "previewNote": "Boundary rows S · Σ checked.",
      "revealNote": "Every boundary row matches a prefix row in S: table is closed."
    },
    {
      "label": "Candidate DFA",
      "title": "Synthesizing the canonical candidate DFA",
      "exposition": "When the table is closed and consistent, we construct the candidate DFA \\(\\mathcal{M} = (Q, \\Sigma, \\delta, q_0, F)\\) by taking \\(Q = \\{\\operatorname{row}(s) \\mid s \\in S\\}\\), \\(q_0 = \\operatorname{row}(\\varepsilon)\\), \\(\\delta(\\operatorname{row}(s), a) = \\operatorname{row}(sa)\\), and \\(F = \\{\\operatorname{row}(s) \\mid T(s, \\varepsilon) = 1\\}\\).",
      "question": "Why does consistency ensure that the transition function delta is well-defined?",
      "choices": [
        {
          "text": "Because if two different prefixes \\(s_1, s_2\\) have the same row vector (\\(\\operatorname{row}(s_1) = \\operatorname{row}(s_2)\\)), consistency guarantees that \\(\\operatorname{row}(s_1 a) = \\operatorname{row}(s_2 a)\\), so the transition does not depend on the choice of prefix.",
          "correct": true,
          "feedback": "Spot on. In a quotient construction, well-definedness requires that equivalent inputs produce equivalent outputs. Consistency precisely prevents non-deterministic ambiguity in \\(\\delta\\)."
        },
        {
          "text": "Because the candidate DFA has no loops.",
          "correct": false,
          "causalFailure": "Learned DFAs routinely contain loops and cycles."
        },
        {
          "text": "Because consistency forces the automaton to have exactly 2 states.",
          "correct": false,
          "causalFailure": "The candidate DFA can have any finite number of states, bounded by the target language complexity."
        }
      ],
      "hint": "What if two prefixes represent the same state, but moving by 'a' gives different results? That would make delta non-deterministic!",
      "formal": "\\(\\delta(\\operatorname{row}(s), a) = \\operatorname{row}(sa)\\) is well-defined \\(\\iff \\text{table is consistent}\\). \\(\\widehat{\\delta}(q_0, u) = \\operatorname{row}(u)\\).",
      "preview": {
        "activeNodes": [
          "dfa_synth"
        ],
        "activeEdges": []
      },
      "reveal": {
        "activeNodes": [
          "dfa_synth",
          "row_eps",
          "row_a",
          "row_b"
        ],
        "activeEdges": [
          "e-synth"
        ],
        "goodNodes": [
          "dfa_synth"
        ]
      },
      "previewNote": "Candidate DFA synthesized.",
      "revealNote": "DFA successfully constructed from table rows: ready for Equivalence Query (EQ)."
    },
    {
      "label": "Polynomial Convergence",
      "title": "Counterexample processing and polynomial query complexity",
      "exposition": "The learner presents the candidate DFA \\(\\mathcal{M}\\) to the Teacher via an Equivalence Query. If the Teacher confirms \\(\\mathcal{M}\\) is correct, the algorithm terminates. If not, the Teacher returns a counterexample string \\(w \\in L \\oplus L(\\mathcal{M})\\).",
      "question": "How does processing counterexample w guarantee progress towards the target DFA?",
      "choices": [
        {
          "text": "Adding \\(w\\) and all its prefixes to \\(S\\) exposes an inconsistency or adds a new distinct row vector; since \\(|Q| \\le n\\) (the Myhill–Nerode index), at most \\(n\\) counterexamples can ever be returned.",
          "correct": true,
          "feedback": "Precisely. Each counterexample witnesses an undiscovered distinction between states. Adding its prefixes increases the number of distinct row vectors by at least 1, strictly climbing the Myhill–Nerode hierarchy until convergence."
        },
        {
          "text": "The counterexample deletes all previously learned states and restarts from scratch.",
          "correct": false,
          "causalFailure": "Angluin's algorithm never discards learned information; it monotonically expands the observation table."
        },
        {
          "text": "The counterexample forces the teacher to change the target language.",
          "correct": false,
          "causalFailure": "The target language is fixed throughout the execution of the algorithm."
        }
      ],
      "hint": "How many states can the minimal DFA have? What happens to the number of distinct rows when a counterexample is added?",
      "formal": "\\(\\text{Max equivalence queries} \\le n\\). \\(\\text{Membership queries} = O(|\\Sigma| \\cdot n^2 + n \\cdot m)\\). Convergence to minimal DFA guaranteed in polynomial time.",
      "preview": {
        "activeNodes": [
          "dfa_synth"
        ],
        "activeEdges": []
      },
      "reveal": {
        "activeNodes": [
          "row_eps",
          "row_a",
          "row_b",
          "row_aa",
          "row_ab",
          "dfa_synth"
        ],
        "activeEdges": [
          "e-eps-a",
          "e-a-aa",
          "e-a-ab",
          "e-aa-eps",
          "e-ab-b",
          "e-synth"
        ],
        "goodNodes": [
          "dfa_synth"
        ]
      },
      "previewNote": "Equivalence query submitted.",
      "revealNote": "Teacher confirms equivalence: unique minimal DFA learned in polynomial time."
    }
  ],
  "previous": {
    "label": "CTL fixed points",
    "href": "/proofs/chapter-13/ctl-fixed-points.html"
  },
  "next": null
}
  };
})();
