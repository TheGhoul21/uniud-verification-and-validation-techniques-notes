(() => {
  const dataElement = document.getElementById("mindmap-data");
  const svgElement = document.getElementById("chapter-mindmap");
  if (!dataElement || !svgElement || !window.d3) return;

  const chapterData = JSON.parse(dataElement.textContent);
  const escapeHtml = (value) => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
  const svg = d3.select(svgElement);
  const width = 1120;
  const height = 850;
  const duration = 400;

  const root = d3.hierarchy(chapterData);
  let serial = 0;
  root.each((node) => {
    node.uid = ++serial;
    const section = node.ancestors().find((ancestor) => ancestor.data.kind === "Section");
    node.data.resolvedColor = node.data.color || section?.data.color || "#303036";
  });

  const allNodes = root.descendants();
  const sectionCount = allNodes.filter((node) => node.data.kind === "Section").length;
  const topicCount = allNodes.filter((node) => !["Chapter", "Section"].includes(node.data.kind)).length;
  const leafCount = root.leaves().length;
  const radius = Math.min(390, Math.max(320, leafCount * 11));
  svg.attr("viewBox", [-width / 2, -height / 2, width, height]);

  const viewport = svg.append("g");
  const linkLayer = viewport.append("g");
  const nodeLayer = viewport.append("g");
  const tree = d3.tree()
    .size([2 * Math.PI, radius])
    .separation((a, b) => (a.parent === b.parent ? 1 : 1.22) / Math.max(1, a.depth));
  const radialLink = d3.linkRadial().angle((node) => node.x).radius((node) => node.y);
  const zoom = d3.zoom()
    .scaleExtent([0.55, 3])
    .on("zoom", (event) => viewport.attr("transform", event.transform));
  svg.call(zoom);

  let selectedNode = root;

  function fold(node) {
    if (node.children) {
      node._children = node.children;
      node.children = null;
    }
  }

  function unfold(node) {
    if (node._children) {
      node.children = node._children;
      node._children = null;
    }
  }

  function shortLabel(node) {
    if (node.data.kind === "Chapter") return `Chapter ${chapterData.number}`;
    const text = node.data.name;
    return text.length > 46 ? `${text.slice(0, 45)}…` : text;
  }

  function labelLines(text, maximum) {
    const words = text.split(/\s+/);
    const lines = [];
    let current = "";
    words.forEach((word) => {
      const candidate = current ? `${current} ${word}` : word;
      if (candidate.length <= maximum || !current) current = candidate;
      else {
        lines.push(current);
        current = word;
      }
    });
    if (current) lines.push(current);
    if (lines.length > 2) {
      lines[1] = `${lines.slice(1).join(" ").slice(0, maximum - 1)}…`;
      return lines.slice(0, 2);
    }
    return lines;
  }

  function nodeRadius(node) {
    if (node.data.kind === "Chapter") return 10;
    if (node.data.kind === "Section") return 7;
    if (node.data.kind === "Topic") return 4.5;
    return 3.8;
  }

  function branchWidth(link) {
    if (link.target.data.kind === "Section") return 5.5;
    if (link.target.data.kind === "Topic") return 1.7;
    return 1.2;
  }

  function update() {
    tree(root);
    const nodes = root.descendants();
    const links = root.links();

    const linksJoin = linkLayer.selectAll(".mm-link")
      .data(links, (link) => link.target.uid);

    linksJoin.exit()
      .transition().duration(duration)
      .style("opacity", 0)
      .remove();

    linksJoin.enter()
      .append("path")
      .attr("class", "mm-link")
      .style("--branch-color", (link) => link.target.data.resolvedColor)
      .style("--branch-width", (link) => `${branchWidth(link)}px`)
      .attr("d", radialLink)
      .style("opacity", 0)
      .merge(linksJoin)
      .transition().duration(duration)
      .style("opacity", null)
      .style("--branch-color", (link) => link.target.data.resolvedColor)
      .style("--branch-width", (link) => `${branchWidth(link)}px`)
      .attr("d", radialLink);

    const nodesJoin = nodeLayer.selectAll(".mm-node")
      .data(nodes, (node) => node.uid);

    nodesJoin.exit()
      .transition().duration(duration)
      .style("opacity", 0)
      .remove();

    const enter = nodesJoin.enter()
      .append("g")
      .attr("class", "mm-node")
      .attr("data-kind", (node) => node.data.kind)
      .attr("tabindex", 0)
      .attr("role", "button")
      .attr("aria-label", (node) => `${node.data.kind}: ${node.data.name}`)
      .style("--node-color", (node) => node.data.resolvedColor)
      .style("opacity", 0)
      .on("click", (event, node) => {
        event.stopPropagation();
        activate(node, true);
      })
      .on("keydown", (event, node) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          activate(node, true);
        }
      });

    enter.append("circle");
    enter.append("text");

    const merge = enter.merge(nodesJoin)
      .classed("has-hidden-children", (node) => Boolean(node._children));

    merge.transition().duration(duration)
      .style("opacity", 1)
      .style("--node-color", (node) => node.data.resolvedColor)
      .attr("transform", (node) => `rotate(${node.x * 180 / Math.PI - 90}) translate(${node.y},0)`);

    merge.select("circle")
      .transition().duration(duration)
      .attr("r", nodeRadius);

    merge.select("text")
      .attr("x", (node) => node.x < Math.PI === !node.children && !node._children ? 11 : -11)
      .attr("text-anchor", (node) => node.x < Math.PI === !node.children && !node._children ? "start" : "end")
      .attr("transform", (node) => node.x >= Math.PI ? "rotate(180)" : null)
      .each(function(node) {
        const text = d3.select(this);
        const x = Number(text.attr("x"));
        const maximum = node.data.kind === "Section" ? 23 : node.data.kind === "Subtopic" ? 17 : 19;
        const lines = labelLines(shortLabel(node), maximum);
        text.selectAll("tspan")
          .data(lines)
          .join("tspan")
          .attr("x", x)
          .attr("dy", (_, index) => index === 0 ? (lines.length > 1 ? "-0.15em" : "0.31em") : "1.05em")
          .text((line) => line);
      });

    window.setTimeout(applySelection, duration + 20);
    const visibleTopics = nodes.filter((node) => !["Chapter", "Section"].includes(node.data.kind)).length;
    document.getElementById("mindmap-count").textContent =
      `${sectionCount} sections · ${topicCount} topics · ${visibleTopics} visible`;
  }

  function applySelection() {
    const pathNodes = new Set(selectedNode.ancestors());
    const pathTargets = new Set(selectedNode.ancestors().slice(0, -1));
    nodeLayer.selectAll(".mm-node")
      .classed("is-path", (node) => pathNodes.has(node))
      .classed("is-selected", (node) => node === selectedNode)
      .classed("is-muted", (node) => selectedNode !== root && !pathNodes.has(node));
    linkLayer.selectAll(".mm-link")
      .classed("is-path", (link) => pathTargets.has(link.target))
      .classed("is-muted", (link) => selectedNode !== root && !pathTargets.has(link.target));
  }

  function updatePanel(node) {
    const section = node.ancestors().find((ancestor) => ancestor.data.kind === "Section");
    document.getElementById("mindmap-kind").textContent =
      node.data.kind === "Chapter" ? `Chapter ${chapterData.number}` : node.data.kind;
    document.getElementById("mindmap-title").textContent = node.data.name;
    document.getElementById("mindmap-detail").textContent =
      node.data.detail ||
      (section
        ? `${node.data.kind} inside “${section.data.name}”.`
        : `Concept from Chapter ${chapterData.number}.`);
    document.getElementById("mindmap-path").innerHTML = node.ancestors()
      .reverse()
      .map((ancestor) => `<span>${escapeHtml(ancestor.data.kind === "Chapter" ? `Ch. ${chapterData.number}` : ancestor.data.name)}</span>`)
      .join("");

    const toggle = document.getElementById("mindmap-toggle");
    if (node.children || node._children) {
      toggle.hidden = false;
      toggle.textContent = node.children ? "Fold descendants" : "Reveal descendants";
      toggle.onclick = () => activate(node, true);
    } else {
      toggle.hidden = true;
      toggle.onclick = null;
    }
  }

  function activate(node, allowToggle) {
    if (allowToggle && node !== root && (node.children || node._children)) {
      if (node.children) fold(node);
      else unfold(node);
    } else if (!node.parent?.children) {
      unfold(node.parent);
    }
    selectedNode = node;
    update();
    updatePanel(node);
  }

  const searchInput = document.getElementById("mindmap-search");
  const searchResults = document.getElementById("mindmap-search-results");

  function hideResults() {
    searchResults.hidden = true;
    searchResults.innerHTML = "";
  }

  function revealSearchNode(node) {
    node.ancestors().forEach(unfold);
    selectedNode = node;
    searchInput.value = node.data.name;
    update();
    updatePanel(node);
    hideResults();
  }

  function renderResults(query) {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      hideResults();
      return;
    }
    const matches = allNodes
      .filter((node) => node !== root)
      .filter((node) => node.data.name.toLowerCase().includes(normalized))
      .slice(0, 9);
    searchResults.innerHTML = matches.length
      ? matches.map((node) => `
          <button class="mm-result" type="button" data-node="${node.uid}">
            <span class="mm-result-dot" style="--result-color: ${node.data.resolvedColor}"></span>
            <span>
              <strong>${escapeHtml(node.data.name)}</strong>
              <small>${escapeHtml(node.data.kind)}${node.parent ? ` · ${escapeHtml(node.parent.data.name)}` : ""}</small>
            </span>
          </button>`).join("")
      : `<div class="mm-result"><span></span><span>No matching topic</span></div>`;
    searchResults.hidden = false;
    searchResults.querySelectorAll("[data-node]").forEach((button) => {
      button.addEventListener("click", () => {
        const node = allNodes.find((candidate) => candidate.uid === Number(button.dataset.node));
        if (node) revealSearchNode(node);
      });
    });
  }

  searchInput.addEventListener("input", (event) => renderResults(event.target.value));
  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Escape") hideResults();
    if (event.key === "Enter") searchResults.querySelector("[data-node]")?.click();
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".mm-search-wrap")) hideResults();
  });

  function resetMap() {
    allNodes.forEach(unfold);
    selectedNode = root;
    searchInput.value = "";
    hideResults();
    update();
    updatePanel(root);
    svg.transition().duration(duration).call(zoom.transform, d3.zoomIdentity);
  }

  svg.on("click", () => {
    selectedNode = root;
    updatePanel(root);
    applySelection();
  });
  document.getElementById("mindmap-reset").addEventListener("click", resetMap);
  document.getElementById("mindmap-zoom-in").addEventListener("click", () => {
    svg.transition().duration(220).call(zoom.scaleBy, 1.25);
  });
  document.getElementById("mindmap-zoom-out").addEventListener("click", () => {
    svg.transition().duration(220).call(zoom.scaleBy, 0.8);
  });
  document.getElementById("mindmap-fit").addEventListener("click", () => {
    svg.transition().duration(duration).call(zoom.transform, d3.zoomIdentity);
  });

  update();
  updatePanel(root);
})();
