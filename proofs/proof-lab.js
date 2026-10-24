(() => {
  "use strict";

  const SVG_NS = "http://www.w3.org/2000/svg";
  let mathTypesetQueue = Promise.resolve();

  function setMathText(node, text) {
    if (window.MathJax && typeof window.MathJax.typesetClear === "function") {
      window.MathJax.typesetClear([node]);
    }
    node.textContent = text;
  }

  function queueMathTypeset(nodes) {
    mathTypesetQueue = mathTypesetQueue
      .then(async () => {
        const mathJax = window.MathJax;
        if (!mathJax || typeof mathJax.typesetPromise !== "function") return;
        if (mathJax.startup && mathJax.startup.promise) {
          await mathJax.startup.promise;
        }
        const connectedNodes = nodes.filter((node) => node.isConnected);
        if (connectedNodes.length > 0) {
          await mathJax.typesetPromise(connectedNodes);
        }
      })
      .catch(() => {});
  }

  function element(name, className, text) {
    const node = document.createElement(name);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function svgElement(name, attributes = {}) {
    const node = document.createElementNS(SVG_NS, name);
    Object.entries(attributes).forEach(([key, value]) => {
      node.setAttribute(key, String(value));
    });
    return node;
  }

  function stateSet(state, key) {
    return new Set((state && state[key]) || []);
  }

  function nodeOffset(node, dx, dy) {
    if (node.shape === "circle") return Number(node.r || 42);
    const length = Math.hypot(dx, dy) || 1;
    const unitX = Math.abs(dx / length);
    const unitY = Math.abs(dy / length);
    const halfWidth = Number(node.width || 150) / 2;
    const halfHeight = Number(node.height || 72) / 2;
    return 1 / Math.sqrt(
      (unitX * unitX) / (halfWidth * halfWidth)
      + (unitY * unitY) / (halfHeight * halfHeight)
    );
  }

  function edgeGeometry(edge, nodesById) {
    if (edge.path) return edge.path;
    const from = nodesById.get(edge.from);
    const to = nodesById.get(edge.to);
    if (!from || !to) return "";
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const length = Math.hypot(dx, dy) || 1;
    const fromOffset = nodeOffset(from, dx, dy) + 4;
    const toOffset = nodeOffset(to, dx, dy) + 12;
    const x1 = from.x + (dx / length) * fromOffset;
    const y1 = from.y + (dy / length) * fromOffset;
    const x2 = to.x - (dx / length) * toOffset;
    const y2 = to.y - (dy / length) * toOffset;
    return `M ${x1} ${y1} L ${x2} ${y2}`;
  }

  function drawDiagram(svg, diagram, visualState) {
    svg.replaceChildren();
    const viewBox = diagram.viewBox || [0, 0, 1000, 520];
    svg.setAttribute("viewBox", viewBox.join(" "));
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", diagram.description || "Interactive proof diagram");

    const title = svgElement("title");
    title.textContent = diagram.description || "Interactive proof diagram";
    svg.append(title);

    const defs = svgElement("defs");
    const marker = svgElement("marker", {
      id: `${svg.id}-arrow`,
      viewBox: "0 0 10 10",
      refX: 9,
      refY: 5,
      markerWidth: 7,
      markerHeight: 7,
      orient: "auto-start-reverse"
    });
    marker.append(svgElement("path", { d: "M 0 0 L 10 5 L 0 10 z", fill: "context-stroke" }));
    defs.append(marker);
    svg.append(defs);

    (diagram.lanes || []).forEach((lane) => {
      const line = svgElement("line", {
        x1: lane.x1 || 80,
        y1: lane.y,
        x2: lane.x2 || 950,
        y2: lane.y,
        class: "proof-lab__lane"
      });
      const label = svgElement("text", {
        x: lane.labelX || 22,
        y: lane.labelY || lane.y - 10,
        class: "proof-lab__lane-label"
      });
      label.textContent = lane.label;
      svg.append(line, label);
    });

    const nodesById = new Map((diagram.nodes || []).map((node) => [node.id, node]));
    const activeEdges = stateSet(visualState, "activeEdges");
    const dimEdges = stateSet(visualState, "dimEdges");

    (diagram.edges || []).forEach((edge) => {
      const path = svgElement("path", {
        d: edgeGeometry(edge, nodesById),
        class: [
          "proof-lab__edge",
          activeEdges.has(edge.id) ? "is-active" : "",
          dimEdges.has(edge.id) ? "is-dim" : ""
        ].filter(Boolean).join(" "),
        "marker-end": `url(#${svg.id}-arrow)`
      });
      svg.append(path);

      if (edge.label) {
        const from = nodesById.get(edge.from);
        const to = nodesById.get(edge.to);
        const label = svgElement("text", {
          x: edge.labelX !== undefined ? edge.labelX : (from.x + to.x) / 2,
          y: edge.labelY !== undefined ? edge.labelY : (from.y + to.y) / 2 - 10,
          class: "proof-lab__edge-label",
          "text-anchor": "middle"
        });
        label.textContent = edge.label;
        svg.append(label);
      }
    });

    const activeNodes = stateSet(visualState, "activeNodes");
    const goodNodes = stateSet(visualState, "goodNodes");
    const badNodes = stateSet(visualState, "badNodes");
    const dimNodes = stateSet(visualState, "dimNodes");

    (diagram.nodes || []).forEach((node) => {
      const group = svgElement("g", {
        class: [
          "proof-lab__node",
          activeNodes.has(node.id) ? "is-active" : "",
          goodNodes.has(node.id) ? "is-good" : "",
          badNodes.has(node.id) ? "is-bad" : "",
          dimNodes.has(node.id) ? "is-dim" : "",
          node.accepting ? "is-accepting" : ""
        ].filter(Boolean).join(" "),
        transform: `translate(${node.x} ${node.y})`
      });

      let shape;
      if (node.shape === "circle") {
        shape = svgElement("circle", {
          r: node.r || 42,
          class: "proof-lab__node-shape"
        });
      } else {
        const width = node.width || 160;
        const height = node.height || 74;
        shape = svgElement("rect", {
          x: -width / 2,
          y: -height / 2,
          width,
          height,
          rx: node.radius || 14,
          class: "proof-lab__node-shape"
        });
      }
      group.append(shape);

      const lines = String(node.label).split("|");
      const text = svgElement("text", {
        x: 0,
        y: lines.length === 1 ? (node.detail ? -5 : 5) : -7,
        class: "proof-lab__node-text"
      });
      lines.forEach((line, index) => {
        const span = svgElement("tspan", {
          x: 0,
          dy: index === 0 ? 0 : 19
        });
        span.textContent = line;
        text.append(span);
      });
      group.append(text);

      if (node.detail) {
        const detail = svgElement("text", {
          x: 0,
          y: Math.max(18, lines.length * 10 + 13),
          class: "proof-lab__node-detail"
        });
        detail.textContent = node.detail;
        group.append(detail);
      }

      svg.append(group);
    });

    (diagram.annotations || []).forEach((annotation) => {
      const text = svgElement("text", {
        x: annotation.x,
        y: annotation.y,
        class: "proof-lab__annotation",
        "text-anchor": annotation.anchor || "middle"
      });
      text.textContent = annotation.text;
      svg.append(text);
    });
  }

  // Choices may be plain strings (legacy labs: step.correct is the index,
  // step.feedback/step.incorrect are shared by every wrong choice) or
  // objects { text, correct, feedback, causalFailure, consequence,
  // consequenceNote } (richer labs: each choice owns its own outcome and,
  // optionally, its own diagram state). Both formats are read through the
  // helpers below so existing lab content keeps working untouched.
  function choiceText(choice) {
    return typeof choice === "string" ? choice : choice.text;
  }

  function choiceIsCorrect(step, choice, index) {
    if (choice && typeof choice === "object" && "correct" in choice) {
      return !!choice.correct;
    }
    return index === step.correct;
  }

  function choiceOutcomeText(step, choice, wasCorrect) {
    if (choice && typeof choice === "object") {
      const specific = wasCorrect ? choice.feedback : choice.causalFailure;
      if (specific) return specific;
    }
    return wasCorrect ? step.feedback : step.incorrect;
  }

  function choiceConsequence(choice) {
    return (choice && typeof choice === "object") ? choice.consequence : null;
  }

  function choiceConsequenceNote(choice) {
    return (choice && typeof choice === "object") ? choice.consequenceNote : null;
  }

  function linkFor(item, direction) {
    if (!item) return null;
    const link = element("a", "", `${direction === "previous" ? "←" : ""}${item.label}${direction === "next" ? " →" : ""}`);
    link.href = item.href;
    return link;
  }

  function mount(root, config) {
    let stepIndex = 0;
    let selectedChoice = null;
    let solved = false;
    let hintVisible = false;
    let phase = "context"; // "context" | "question" | "result"

    root.classList.add("proof-lab");
    root.replaceChildren();

    // ── Header ──
    const header = element("header", "proof-lab__header");
    header.append(
      element("h1", "", config.title),
      element("p", "proof-lab__statement", config.theorem)
    );

    // Long-form context (overview, running example, strategy) lives below the
    // workspace as collapsed panels, so the interactive card stays the hero at
    // the top of the viewport instead of being pushed down a full screen.
    const brief = element("section", "proof-lab__brief");
    const briefItem = (label, text) => {
      const item = element("details", "proof-lab__brief-item");
      item.append(element("summary", "", label), element("p", "", text));
      return item;
    };
    if (config.intro) brief.append(briefItem("Overview", config.intro));
    if (config.application) brief.append(briefItem("Running example", config.application));
    if (config.strategy) brief.append(briefItem("Proof strategy", config.strategy));

    // ── Workspace card ──
    const workspace = element("section", "proof-lab__workspace");

    // ── Topbar ──
    const topbar = element("div", "proof-lab__topbar");
    const stepLabel = element("span", "proof-lab__step-label");
    const progress = element("div", "proof-lab__progress");
    config.steps.forEach(() => progress.append(element("span")));
    const stepCounter = element("span", "proof-lab__step-counter");
    const phaseBadge = element("span", "proof-lab__phase-badge");
    topbar.append(stepLabel, progress, stepCounter, phaseBadge);

    // ── Canvas (diagram) ──
    const canvas = element("div", "proof-lab__canvas");
    const diagram = svgElement("svg", {
      id: `proof-diagram-${config.slug}`,
      class: "proof-lab__diagram"
    });
    const canvasNote = element("p", "proof-lab__canvas-note");
    canvas.append(diagram, canvasNote);

    // ── Body (scrollable, holds all three phase sections) ──
    const body = element("div", "proof-lab__body");

    // ── Context phase ──
    const ctxPhase = element("div", "proof-lab__phase proof-lab__phase--context");
    const stepTitle = element("h2");
    const exposition = element("div", "proof-lab__exposition");
    const ctxActions = element("div", "proof-lab__actions");
    const ctxBack = element("button", "proof-lab__button proof-lab__button--back");
    ctxBack.type = "button";
    ctxBack.textContent = "← Previous step";
    const readyBtn = element("button", "proof-lab__button proof-lab__button--primary");
    readyBtn.type = "button";
    readyBtn.textContent = "Examine Invariant Challenge →";
    ctxActions.append(ctxBack, readyBtn);
    ctxPhase.append(stepTitle, exposition, ctxActions);

    // ── Question phase ──
    const qPhase = element("div", "proof-lab__phase proof-lab__phase--question");
    const question = element("p", "proof-lab__question");
    const choices = element("div", "proof-lab__choices");
    const hint = element("p", "proof-lab__hint");
    hint.hidden = true;
    const qActions = element("div", "proof-lab__actions");
    const qBack = element("button", "proof-lab__button proof-lab__button--back");
    qBack.type = "button";
    qBack.textContent = "← Return to Exposition";
    const hintButton = element("button", "proof-lab__button");
    hintButton.type = "button";
    hintButton.textContent = "Hint";
    qActions.append(qBack, hintButton);
    qPhase.append(question, choices, hint, qActions);

    // ── Result phase ──
    const rPhase = element("div", "proof-lab__phase proof-lab__phase--result");
    const feedback = element("p", "proof-lab__feedback");
    feedback.setAttribute("aria-live", "polite");
    const formal = element("details", "proof-lab__formal");
    formal.open = true;
    formal.append(element("summary", "", "Formal Derivation & Proof Mechanics"), element("p"));
    const invariant = element("div", "proof-lab__invariant");
    invariant.append(element("strong", "", "Persistent Inductive Invariant"), element("span", "", config.invariant));
    const rActions = element("div", "proof-lab__actions");
    const tryAgainBtn = element("button", "proof-lab__button proof-lab__button--back");
    tryAgainBtn.type = "button";
    const nextBtn = element("button", "proof-lab__button proof-lab__button--primary");
    nextBtn.type = "button";
    rActions.append(tryAgainBtn, nextBtn);
    rPhase.append(feedback, formal, invariant, rActions);

    body.append(ctxPhase, qPhase, rPhase);
    workspace.append(topbar, canvas, body);

    // ── Synthesis + nav ──
    const synthesis = element("details", "proof-lab__synthesis");
    synthesis.append(
      element("summary", "", "Read the complete proof"),
      element("p", "", config.synthesis)
    );

    const nav = element("nav", "proof-lab__nav");
    nav.setAttribute("aria-label", "Proof Lab navigation");
    const previous = linkFor(config.previous, "previous");
    const nextLab = linkFor(config.next, "next");
    if (previous) nav.append(previous);
    if (nextLab) nav.append(nextLab);

    // header + workspace share one viewport-tall stage: the header takes its
    // natural height and the workspace flexes to fill the rest, so the card
    // always fits the screen regardless of how far the theorem wraps.
    const stage = element("div", "proof-lab__stage");
    stage.append(header, workspace);
    root.append(stage, brief, synthesis, nav);
    queueMathTypeset([header, brief, synthesis]);

    // ── Phase transitions ──

    readyBtn.addEventListener("click", () => {
      phase = "question";
      render();
    });

    ctxBack.addEventListener("click", () => {
      if (stepIndex === 0) return;
      stepIndex -= 1;
      selectedChoice = null;
      solved = false;
      hintVisible = false;
      phase = "context";
      render();
    });

    qBack.addEventListener("click", () => {
      phase = "context";
      hintVisible = false;
      render();
    });

    hintButton.addEventListener("click", () => {
      hintVisible = !hintVisible;
      render();
    });

    tryAgainBtn.addEventListener("click", () => {
      if (solved) {
        // "← Back" when solved: go to question
        phase = "question";
      } else {
        // "← Try again": reset choice and go to question
        selectedChoice = null;
      }
      phase = "question";
      render();
    });

    nextBtn.addEventListener("click", () => {
      if (!solved) return;
      stepIndex = stepIndex === config.steps.length - 1 ? 0 : stepIndex + 1;
      selectedChoice = null;
      solved = false;
      hintVisible = false;
      phase = "context";
      render();
    });

    // ── Render ──

    function render() {
      workspace.dataset.phase = phase;

      const step = config.steps[stepIndex];
      const chosen = selectedChoice === null ? null : step.choices[selectedChoice];
      const consequence = chosen ? choiceConsequence(chosen) : null;

      // Diagram state depends on phase
      let visualState;
      if (phase === "result" && solved) {
        visualState = step.reveal;
      } else if (phase === "result" && consequence) {
        visualState = consequence;
      } else {
        visualState = step.preview || step.reveal;
      }
      drawDiagram(diagram, config.diagram, visualState || {});

      // Canvas note
      if (phase === "result" && solved) {
        canvasNote.textContent = step.revealNote || "";
      } else if (phase === "result" && chosen) {
        canvasNote.textContent = choiceConsequenceNote(chosen) || step.previewNote || "";
      } else {
        canvasNote.textContent = step.previewNote || "";
      }

      // Topbar
      stepLabel.textContent = step.label;
      stepCounter.textContent = `${stepIndex + 1} / ${config.steps.length}`;
      phaseBadge.textContent = phase === "context" ? "Exposition & Setup" : phase === "question" ? "Verification Challenge" : "Formal Derivation";
      [...progress.children].forEach((dot, i) => {
        dot.className = i < stepIndex ? "is-done" : i === stepIndex ? "is-current" : "";
      });

      // Context phase content
      stepTitle.textContent = step.title;
      setMathText(exposition, step.exposition);
      ctxBack.disabled = stepIndex === 0;
      ctxBack.hidden = stepIndex === 0;

      // Question phase content
      setMathText(question, step.question);
      if (window.MathJax && typeof window.MathJax.typesetClear === "function") {
        window.MathJax.typesetClear([...choices.children]);
      }
      choices.replaceChildren();
      step.choices.forEach((choice, index) => {
        const button = element("button", "proof-lab__choice", choiceText(choice));
        button.type = "button";
        button.addEventListener("click", () => {
          selectedChoice = index;
          solved = choiceIsCorrect(step, choice, index);
          phase = "result";
          render();
        });
        choices.append(button);
      });
      setMathText(hint, step.hint);
      hint.hidden = !hintVisible;
      hintButton.textContent = hintVisible ? "Hide hint" : "Hint";

      // Result phase content
      if (selectedChoice !== null) {
        setMathText(feedback, choiceOutcomeText(step, chosen, solved));
        feedback.classList.toggle("is-error", !solved);
      }
      setMathText(formal.lastElementChild, step.formal);
      tryAgainBtn.textContent = solved ? "← Review Challenge" : "← Try Another Argument";
      nextBtn.disabled = !solved;
      nextBtn.textContent = stepIndex === config.steps.length - 1 ? "Restart Proof from Step 1" : "Proceed to Next Step →";

      // MathJax
      queueMathTypeset([
        exposition,
        question,
        feedback,
        hint,
        formal.lastElementChild,
        invariant.lastElementChild,
        canvasNote,
        ...choices.children
      ]);

      // Scroll body to top on phase change
      body.scrollTo({ top: 0, behavior: "instant" });
    }

    render();
  }

  function initialize() {
    const configs = window.PROOF_LABS || {};
    document.querySelectorAll("[data-proof-lab]").forEach((root) => {
      const slug = root.getAttribute("data-proof-lab");
      if (!configs[slug]) {
        root.textContent = `Proof Lab configuration not found: ${slug}`;
        return;
      }
      mount(root, configs[slug]);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();
