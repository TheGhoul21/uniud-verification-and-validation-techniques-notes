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

    root.classList.add("proof-lab");
    root.replaceChildren();

    const header = element("header", "proof-lab__header");
    header.append(
      element("p", "proof-lab__breadcrumb", `Proof Labs · Chapter ${config.chapter}`),
      element("h1", "", config.title),
      element("p", "proof-lab__statement", config.theorem),
      element("p", "proof-lab__intro", config.intro)
    );

    const theoremDetails = element("details", "proof-lab__theorem-details");
    theoremDetails.append(
      element("summary", "", "Proof strategy"),
      element("p", "", config.strategy)
    );
    header.append(theoremDetails);

    const workspace = element("section", "proof-lab__workspace");
    const canvas = element("div", "proof-lab__canvas");
    const canvasBar = element("div", "proof-lab__canvas-bar");
    const canvasState = element("strong");
    const canvasCount = element("span");
    canvasBar.append(canvasState, canvasCount);
    const diagram = svgElement("svg", {
      id: `proof-diagram-${config.slug}`,
      class: "proof-lab__diagram"
    });
    const canvasNote = element("p", "proof-lab__canvas-note");
    canvas.append(canvasBar, diagram, canvasNote);

    const rail = element("div", "proof-lab__rail");
    rail.setAttribute("role", "complementary");
    rail.setAttribute("aria-label", "Guided proof steps");
    const progress = element("div", "proof-lab__progress");
    config.steps.forEach(() => progress.append(element("span")));
    const stepLabel = element("p", "proof-lab__step-label");
    const stepTitle = element("h2");
    const exposition = element("p", "proof-lab__exposition");
    const question = element("p", "proof-lab__question");
    const choices = element("div", "proof-lab__choices");
    const feedback = element("p", "proof-lab__feedback");
    feedback.setAttribute("aria-live", "polite");
    const hint = element("p", "proof-lab__hint");
    hint.hidden = true;

    const actions = element("div", "proof-lab__actions");
    const back = element("button", "proof-lab__button", "← Back");
    back.type = "button";
    const hintButton = element("button", "proof-lab__button", "Hint");
    hintButton.type = "button";
    const next = element("button", "proof-lab__button proof-lab__button--primary", "Continue →");
    next.type = "button";
    actions.append(back, hintButton, next);

    const formal = element("details", "proof-lab__formal");
    formal.append(element("summary", "", "Why this step is valid"), element("p"));
    const invariant = element("div", "proof-lab__invariant");
    invariant.append(element("strong", "", "Persistent invariant"), element("span", "", config.invariant));
    rail.append(progress, stepLabel, stepTitle, exposition, question, choices, feedback, hint, actions, formal, invariant);
    workspace.append(canvas, rail);

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

    root.append(header, workspace, synthesis, nav);
    queueMathTypeset([header, synthesis]);

    function render() {
      const step = config.steps[stepIndex];
      const visualState = solved ? step.reveal : (step.preview || step.reveal);
      drawDiagram(diagram, config.diagram, visualState || {});

      canvasState.textContent = step.visualLabel || step.label;
      canvasCount.textContent = `Step ${stepIndex + 1} of ${config.steps.length}`;
      canvasNote.textContent = solved ? step.revealNote : step.previewNote;
      stepLabel.textContent = step.label;
      stepTitle.textContent = step.title;
      setMathText(exposition, step.exposition);
      setMathText(question, step.question);

      [...progress.children].forEach((dot, index) => {
        dot.className = index < stepIndex ? "is-done" : index === stepIndex ? "is-current" : "";
      });

      choices.replaceChildren();
      step.choices.forEach((choice, index) => {
        const button = element("button", "proof-lab__choice", choice);
        button.type = "button";
        button.setAttribute("aria-pressed", selectedChoice === index ? "true" : "false");
        if (selectedChoice === index) {
          button.classList.add(index === step.correct ? "is-correct" : "is-wrong");
        }
        button.addEventListener("click", () => {
          selectedChoice = index;
          solved = index === step.correct;
          render();
        });
        choices.append(button);
      });

      if (selectedChoice === null) {
        setMathText(feedback, "Predict before revealing the next proof state.");
        feedback.classList.remove("is-error");
      } else {
        setMathText(feedback, solved ? step.feedback : step.incorrect);
        feedback.classList.toggle("is-error", !solved);
      }

      setMathText(hint, step.hint);
      hint.hidden = !hintVisible;
      setMathText(formal.lastElementChild, step.formal);
      back.disabled = stepIndex === 0;
      next.disabled = !solved;
      next.textContent = stepIndex === config.steps.length - 1 ? "Replay proof ↺" : "Continue →";
      hintButton.textContent = hintVisible ? "Hide hint" : "Hint";
      queueMathTypeset([exposition, question, feedback, hint, formal.lastElementChild]);
    }

    back.addEventListener("click", () => {
      if (stepIndex === 0) return;
      stepIndex -= 1;
      selectedChoice = null;
      solved = false;
      hintVisible = false;
      render();
    });

    hintButton.addEventListener("click", () => {
      hintVisible = !hintVisible;
      render();
    });

    next.addEventListener("click", () => {
      if (!solved) return;
      stepIndex = stepIndex === config.steps.length - 1 ? 0 : stepIndex + 1;
      selectedChoice = null;
      solved = false;
      hintVisible = false;
      render();
    });

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
