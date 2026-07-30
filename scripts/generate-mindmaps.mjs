#!/usr/bin/env node

/**
 * Generate chapter-level web and PDF mind maps from the LaTeX heading tree.
 *
 * Inputs:
 *   chapters/NN-*.tex
 *
 * Outputs:
 *   mindmaps/index.qmd
 *   mindmaps/NN-*.qmd
 *   mindmaps/generated/chapter-NN.tex
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const chaptersDir = path.join(repoRoot, "chapters");
const mindmapsDir = path.join(repoRoot, "mindmaps");
const generatedDir = path.join(mindmapsDir, "generated");

const palette = [
  { web: "#30bced", latex: "brightsky" },
  { web: "#00897b", latex: "vvteal" },
  { web: "#7e57c2", latex: "vvviolet" },
  { web: "#f28e2c", latex: "vvorange" },
  { web: "#fc5130", latex: "tomato" },
  { web: "#167b9e", latex: "brightsky" },
  { web: "#6f7782", latex: "vvgray" },
];

function stripComments(source) {
  return source.split("\n").map((line) => {
    for (let index = 0; index < line.length; index += 1) {
      if (line[index] !== "%") continue;
      let backslashes = 0;
      for (let cursor = index - 1; cursor >= 0 && line[cursor] === "\\"; cursor -= 1) {
        backslashes += 1;
      }
      if (backslashes % 2 === 0) return line.slice(0, index);
    }
    return line;
  }).join("\n");
}

function readBalanced(source, start, open = "{", close = "}") {
  if (source[start] !== open) {
    throw new Error(`Expected ${open} at offset ${start}`);
  }
  let depth = 0;
  for (let index = start; index < source.length; index += 1) {
    const character = source[index];
    if (character === open && source[index - 1] !== "\\") depth += 1;
    if (character === close && source[index - 1] !== "\\") {
      depth -= 1;
      if (depth === 0) {
        return {
          value: source.slice(start + 1, index),
          end: index + 1,
        };
      }
    }
  }
  throw new Error(`Unclosed ${open} at offset ${start}`);
}

function extractHeadings(source) {
  const clean = stripComments(source);
  const commandPattern = /\\(chapter|section|subsection|subsubsection)\b/g;
  const headings = [];
  let match;

  while ((match = commandPattern.exec(clean)) !== null) {
    const command = match[1];
    let cursor = commandPattern.lastIndex;
    while (/\s/.test(clean[cursor] || "")) cursor += 1;

    let starred = false;
    if (clean[cursor] === "*") {
      starred = true;
      cursor += 1;
      while (/\s/.test(clean[cursor] || "")) cursor += 1;
    }

    if (clean[cursor] === "[") {
      cursor = readBalanced(clean, cursor, "[", "]").end;
      while (/\s/.test(clean[cursor] || "")) cursor += 1;
    }

    if (clean[cursor] !== "{") continue;
    const argument = readBalanced(clean, cursor);
    headings.push({
      command,
      starred,
      rawTitle: argument.value,
      line: clean.slice(0, match.index).split("\n").length,
      offset: match.index,
    });
    commandPattern.lastIndex = argument.end;
  }

  return headings;
}

function extractTopicBlocks(source) {
  const clean = stripComments(source);
  const environmentPattern =
    /\\begin\{(definition|theorem|proposition|lemma|corollary|example|formaldetails)\}/g;
  const blocks = [];
  let match;

  while ((match = environmentPattern.exec(clean)) !== null) {
    let cursor = environmentPattern.lastIndex;
    while (/\s/.test(clean[cursor] || "")) cursor += 1;
    if (clean[cursor] !== "[") continue;
    const argument = readBalanced(clean, cursor, "[", "]");
    blocks.push({
      rawTitle: argument.value,
      line: clean.slice(0, match.index).split("\n").length,
      offset: match.index,
    });
    environmentPattern.lastIndex = argument.end;
  }

  return blocks;
}

function replaceTexorpdfstring(input) {
  const command = "\\texorpdfstring";
  let output = input;
  let offset = output.indexOf(command);

  while (offset >= 0) {
    let cursor = offset + command.length;
    while (/\s/.test(output[cursor] || "")) cursor += 1;
    if (output[cursor] !== "{") break;
    const first = readBalanced(output, cursor);
    cursor = first.end;
    while (/\s/.test(output[cursor] || "")) cursor += 1;
    if (output[cursor] !== "{") break;
    const second = readBalanced(output, cursor);
    output = `${output.slice(0, offset)}${second.value}${output.slice(second.end)}`;
    offset = output.indexOf(command);
  }

  return output;
}

function plainText(rawTitle) {
  let text = replaceTexorpdfstring(rawTitle);

  for (let iteration = 0; iteration < 8; iteration += 1) {
    const previous = text;
    text = text.replace(
      /\\(?:texttt|textsf|textrm|textbf|textit|emph|mathrm|mathbf|mathsf|operatorname)\s*\{([^{}]*)\}/g,
      "$1",
    );
    if (text === previous) break;
  }

  const replacements = [
    [/B\\"uchi/g, "Büchi"],
    [/M\\"uller/g, "Müller"],
    [/G\\"odel/g, "Gödel"],
    [/\\omega\b/g, "ω"],
    [/\\varepsilon\b/g, "ε"],
    [/\\epsilon\b/g, "ε"],
    [/\\alpha\b/g, "α"],
    [/\\beta\b/g, "β"],
    [/\\phi\b/g, "φ"],
    [/\\psi\b/g, "ψ"],
    [/\\rho\b/g, "ρ"],
    [/\\Sigma\b/g, "Σ"],
    [/\\Delta\b/g, "Δ"],
    [/\\Longrightarrow\b/g, "⇒"],
    [/\\Rightarrow\b/g, "⇒"],
    [/\\longrightarrow\b/g, "→"],
    [/\\rightarrow\b/g, "→"],
    [/\\to\b/g, "→"],
    [/\\equiv\b/g, "≡"],
    [/\\cap\b/g, "∩"],
    [/\\infty\b/g, "∞"],
    [/\\in\b/g, "∈"],
    [/\\times\b/g, "×"],
    [/\\leq?\b/g, "≤"],
    [/\\geq?\b/g, "≥"],
    [/\\land\b/g, "∧"],
    [/\\lor\b/g, "∨"],
    [/\\neg\b/g, "¬"],
    [/\\Box\b/g, "□"],
    [/\\Diamond\b/g, "◇"],
    [/\\&/g, "&"],
    [/\\_/g, "_"],
    [/\\%/g, "%"],
    [/\\#/g, "#"],
    [/\\\{/g, "\uFFF0"],
    [/\\\}/g, "\uFFF1"],
    [/\\[ \t]+/g, " "],
    [/\\,/g, " "],
    [/\\;/g, " "],
    [/\\!/g, ""],
    [/~/g, " "],
    [/---/g, "—"],
    [/--/g, "–"],
  ];
  replacements.forEach(([pattern, replacement]) => {
    text = text.replace(pattern, replacement);
  });

  text = text
    .replace(/\$+/g, "")
    .replace(/\\[a-zA-Z@]+\*?/g, "")
    .replace(/[{}]/g, "")
    .replace(/\uFFF0/g, "{")
    .replace(/\uFFF1/g, "}")
    .replace(/\^\*/g, "*")
    .replace(/\^\s*([A-Za-z0-9*+-]+)/g, "^$1")
    .replace(/_\s*([A-Za-z0-9*+-]+)/g, "_$1")
    .replace(/\s+/g, " ")
    .trim();

  return text;
}

function shouldKeepHeading(name) {
  return !/^(summary|exercises?|notation(?: introduced| recap)?)/i.test(name);
}

function buildChapter(filePath) {
  const fileName = path.basename(filePath);
  const number = Number(fileName.slice(0, 2));
  const slug = fileName.replace(/\.tex$/, "");
  const source = fs.readFileSync(filePath, "utf8");
  const headings = extractHeadings(source);
  const topicBlocks = extractTopicBlocks(source);
  const chapterHeading = headings.find((heading) => heading.command === "chapter" && !heading.starred);
  if (!chapterHeading) throw new Error(`No chapter heading found in ${fileName}`);

  const chapter = {
    number,
    slug,
    name: plainText(chapterHeading.rawTitle),
    kind: "Chapter",
    source: `chapters/${fileName}`,
    line: chapterHeading.line,
    color: "#303036",
    children: [],
  };

  const events = [
    ...headings.map((heading) => ({ type: "heading", ...heading })),
    ...topicBlocks.map((block) => ({ type: "topic", ...block })),
  ].sort((left, right) => left.offset - right.offset);

  let currentSection = null;
  let currentSubsection = null;
  for (const event of events) {
    if (event.type === "topic") {
      if (!currentSection) continue;
      const name = plainText(event.rawTitle).replace(/\.$/, "");
      if (!name || !shouldKeepHeading(name)) continue;
      if (currentSection.semanticTopics.some((topic) => topic.name.toLowerCase() === name.toLowerCase())) {
        continue;
      }
      currentSection.semanticTopics.push({
        name,
        kind: "Topic",
        source: chapter.source,
        line: event.line,
      });
      continue;
    }

    const heading = event;
    if (heading.offset === chapterHeading.offset) continue;
    if (heading.starred) {
      if (heading.command === "section") {
        currentSection = null;
        currentSubsection = null;
      }
      continue;
    }
    const name = plainText(heading.rawTitle);
    if (!name || !shouldKeepHeading(name)) continue;

    if (heading.command === "section") {
      const color = palette[chapter.children.length % palette.length];
      currentSection = {
        name,
        kind: "Section",
        source: chapter.source,
        line: heading.line,
        color: color.web,
        latexColor: color.latex,
        children: [],
        semanticTopics: [],
      };
      chapter.children.push(currentSection);
      currentSubsection = null;
    } else if (heading.command === "subsection" && currentSection) {
      currentSubsection = {
        name,
        kind: "Topic",
        source: chapter.source,
        line: heading.line,
        children: [],
      };
      currentSection.children.push(currentSubsection);
    } else if (heading.command === "subsubsection" && currentSection) {
      const subtopic = {
        name,
        kind: "Subtopic",
        source: chapter.source,
        line: heading.line,
      };
      if (currentSubsection) currentSubsection.children.push(subtopic);
      else currentSection.children.push(subtopic);
    }
  }

  chapter.children.forEach((section) => {
    if (section.children.length === 0) section.children = section.semanticTopics;
    delete section.semanticTopics;
  });

  return chapter;
}

function countTopics(node) {
  return (node.children || []).reduce((total, child) => {
    const own = ["Topic", "Subtopic"].includes(child.kind) ? 1 : 0;
    return total + own + countTopics(child);
  }, 0);
}

function yamlString(value) {
  return JSON.stringify(value);
}

function htmlEscape(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function pageDescription(chapter) {
  return `Interactive radial mind map for Chapter ${chapter.number}: ${chapter.name}. Explore sections and individual topics.`;
}

function generatePage(chapter, previous, next) {
  const json = JSON.stringify(chapter, null, 2).replace(/</g, "\\u003c");
  const previousLink = previous
    ? `<a href="${previous.slug}.html"><i class="bi bi-arrow-left"></i> Chapter ${previous.number}</a>`
    : "<span></span>";
  const nextLink = next
    ? `<a href="${next.slug}.html">Chapter ${next.number} <i class="bi bi-arrow-right"></i></a>`
    : "<span></span>";

  return `<!-- GENERATED by scripts/generate-mindmaps.mjs — do not hand-edit. -->
---
title: ${yamlString(`Mind Map ${chapter.number}: ${chapter.name}`)}
pagetitle: ${yamlString(`Chapter ${chapter.number} Mind Map — VVT UniUD`)}
description: ${yamlString(pageDescription(chapter))}
format:
  html:
    toc: false
    page-layout: full
    title-block-style: none
    css: mindmap.css
---

\`\`\`{=html}
<div class="mm-shell">
  <div class="mm-heading">
    <div>
      <h1>Chapter ${chapter.number} · ${htmlEscape(chapter.name)}</h1>
      <p>Explore the chapter as a radial hierarchy of sections, topics, and nested subtopics.</p>
    </div>
    <span class="mm-count" id="mindmap-count">${chapter.children.length} sections · ${countTopics(chapter)} topics</span>
  </div>

  <div class="mm-toolbar">
    <div class="mm-search-wrap">
      <label class="visually-hidden" for="mindmap-search">Search chapter topics</label>
      <input class="mm-search" id="mindmap-search" type="search" autocomplete="off"
             placeholder="Search a section or topic…" />
      <i class="bi bi-search mm-search-icon" aria-hidden="true"></i>
      <div class="mm-search-results" id="mindmap-search-results" hidden></div>
    </div>
    <div class="mm-actions" aria-label="Map controls">
      <button class="mm-button" id="mindmap-reset" type="button">Reset</button>
      <button class="mm-button" id="mindmap-zoom-out" type="button" aria-label="Zoom out">−</button>
      <button class="mm-button" id="mindmap-fit" type="button" aria-label="Fit map">◎</button>
      <button class="mm-button" id="mindmap-zoom-in" type="button" aria-label="Zoom in">+</button>
    </div>
  </div>

  <div class="mm-stage">
    <div class="mm-canvas">
      <span class="mm-hint">Click any branch to fold it · drag and zoom</span>
      <svg id="chapter-mindmap" role="img"
           aria-label="Interactive radial mind map for Chapter ${chapter.number}"></svg>
    </div>
    <aside class="mm-side" aria-live="polite">
      <span class="mm-eyebrow" id="mindmap-kind">Chapter ${chapter.number}</span>
      <h2 id="mindmap-title">${htmlEscape(chapter.name)}</h2>
      <p id="mindmap-detail">Select a node to isolate its complete conceptual artery.</p>
      <div class="mm-path" id="mindmap-path"></div>
      <button class="mm-toggle" id="mindmap-toggle" type="button" hidden></button>

      <div class="mm-legend">
        <strong>How to read the map</strong>
        <div class="mm-legend-item">
          <span style="--legend-color: #303036"></span><span>Chapter root</span>
        </div>
        <div class="mm-legend-item">
          <span style="--legend-color: #30bced"></span><span>Sections form the main arteries</span>
        </div>
        <div class="mm-legend-item">
          <span style="--legend-color: #fc5130"></span><span>Outer nodes are individual topics</span>
        </div>
      </div>
    </aside>
  </div>

  <nav class="mm-page-nav" aria-label="Chapter mind maps">
    ${previousLink}
    <a href="index.html">All mind maps</a>
    ${nextLink}
  </nav>
</div>

<script id="mindmap-data" type="application/json">
${json}
</script>
<script src="https://cdn.jsdelivr.net/npm/d3@7.9.0/dist/d3.min.js"></script>
<script src="mindmap.js"></script>
\`\`\`
`;
}

function generateIndex(chapters) {
  const cards = chapters.map((chapter) => {
    const color = chapter.number <= 6 ? "#30bced" : "#7e57c2";
    return `    <a class="mindmap-index-card" href="${chapter.slug}.html" style="--card-color: ${color}">
      <span class="chapter-number">Chapter ${chapter.number}</span>
      <strong>${htmlEscape(chapter.name)}</strong>
      <small>${chapter.children.length} sections · ${countTopics(chapter)} topics</small>
    </a>`;
  }).join("\n");

  return `<!-- GENERATED by scripts/generate-mindmaps.mjs — do not hand-edit. -->
---
title: "Interactive Chapter Mind Maps"
pagetitle: "Interactive Chapter Mind Maps — VVT UniUD"
description: "Explore all fifteen chapters of the Verification and Validation Techniques notes as interactive radial mind maps."
format:
  html:
    toc: false
    page-layout: full
    css: mindmap.css
---

\`\`\`{=html}
<div class="mindmap-index">
  <h1>Interactive Chapter Mind Maps</h1>
  <p>
    Every map follows the actual chapter structure: sections become the main
    arteries, while nested headings and titled conceptual blocks form the
    topic-level outer rings.
  </p>
  <div class="mindmap-index-grid">
${cards}
  </div>
</div>
\`\`\`
`;
}

function latexEscape(text) {
  const mathSymbols = new Map([
    ["ω", "\\ensuremath{\\omega}"],
    ["ε", "\\ensuremath{\\varepsilon}"],
    ["α", "\\ensuremath{\\alpha}"],
    ["β", "\\ensuremath{\\beta}"],
    ["φ", "\\ensuremath{\\phi}"],
    ["ψ", "\\ensuremath{\\psi}"],
    ["ρ", "\\ensuremath{\\rho}"],
    ["Σ", "\\ensuremath{\\Sigma}"],
    ["Δ", "\\ensuremath{\\Delta}"],
    ["→", "\\ensuremath{\\to}"],
    ["⇒", "\\ensuremath{\\Rightarrow}"],
    ["≡", "\\ensuremath{\\equiv}"],
    ["∩", "\\ensuremath{\\cap}"],
    ["∞", "\\ensuremath{\\infty}"],
    ["∈", "\\ensuremath{\\in}"],
    ["×", "\\ensuremath{\\times}"],
    ["≤", "\\ensuremath{\\leq}"],
    ["≥", "\\ensuremath{\\geq}"],
    ["∧", "\\ensuremath{\\land}"],
    ["∨", "\\ensuremath{\\lor}"],
    ["¬", "\\ensuremath{\\neg}"],
    ["□", "\\ensuremath{\\Box}"],
    ["◇", "\\ensuremath{\\Diamond}"],
  ]);
  const special = new Map([
    ["\\", "\\textbackslash{}"],
    ["&", "\\&"],
    ["%", "\\%"],
    ["#", "\\#"],
    ["_", "\\_"],
    ["{", "\\{"],
    ["}", "\\}"],
    ["$", "\\$"],
    ["^", "\\textasciicircum{}"],
    ["—", "---"],
    ["–", "--"],
  ]);

  return [...text].map((character) => (
    mathSymbols.get(character) || special.get(character) || character
  )).join("");
}

function flattenTopics(section) {
  const topics = [];
  function visit(node) {
    topics.push(node);
    (node.children || []).forEach(visit);
  }
  (section.children || []).forEach(visit);
  return topics;
}

function formatNumber(value) {
  return Number(value.toFixed(2)).toString();
}

function generateTikz(chapter) {
  const sections = chapter.children;
  const sectionTopics = sections.map(flattenTopics);
  const totalSlots = sectionTopics.reduce((sum, topics) => sum + Math.max(1, topics.length), 0);
  const step = 360 / Math.max(1, totalSlots);
  const topicRadius = Math.max(9.8, Math.min(14.5, totalSlots * 0.36));
  const sectionRadius = topicRadius * 0.52;
  const topicSize = totalSlots > 32 ? 1.55 : totalSlots > 25 ? 1.72 : 1.92;
  const topicTextWidth = totalSlots > 32 ? 1.08 : totalSlots > 25 ? 1.24 : 1.46;
  const sectionSize = sections.length > 10 ? 2.15 : 2.42;
  const sectionTextWidth = sections.length > 10 ? 1.68 : 1.92;

  const nodes = [];
  const connections = [];
  let slot = 0;

  sections.forEach((section, sectionIndex) => {
    const topics = sectionTopics[sectionIndex];
    const slotCount = Math.max(1, topics.length);
    const topicAngles = Array.from({ length: slotCount }, (_, offset) => (
      90 - (slot + offset + 0.5) * step
    ));
    const sectionAngle = topicAngles.reduce((sum, angle) => sum + angle, 0) / topicAngles.length;
    const sectionId = `s${sectionIndex + 1}`;
    const latexColor = section.latexColor;

    nodes.push(`  \\node[mm section, concept color=${latexColor}] (${sectionId}) at (${formatNumber(sectionAngle)}:${formatNumber(sectionRadius)}cm) {${latexEscape(section.name)}};`);
    connections.push(`    \\draw[${latexColor}, line width=11pt] (root) -- (${sectionId});`);

    topics.forEach((topic, topicIndex) => {
      const topicId = `t${sectionIndex + 1}_${topicIndex + 1}`;
      const angle = topicAngles[topicIndex];
      nodes.push(`  \\node[mm topic, concept color=${latexColor}!44!white] (${topicId}) at (${formatNumber(angle)}:${formatNumber(topicRadius)}cm) {${latexEscape(topic.name)}};`);
      connections.push(`    \\draw[${latexColor}!60!white, line width=5.5pt] (${sectionId}) -- (${topicId});`);
    });

    slot += slotCount;
  });

  return `% GENERATED by scripts/generate-mindmaps.mjs — do not hand-edit.
\\begin{tikzpicture}[
  mindmap,
  every node/.style={
    concept,
    execute at begin node=\\hskip0pt,
    align=center,
    font=\\sffamily
  },
  mm root/.style={
    concept color=graphite,
    text=ghostwhite,
    font=\\sffamily\\bfseries,
    minimum size=3.35cm,
    text width=2.75cm
  },
  mm section/.style={
    font=\\sffamily\\bfseries\\scriptsize,
    minimum size=${formatNumber(sectionSize)}cm,
    text width=${formatNumber(sectionTextWidth)}cm
  },
  mm topic/.style={
    font=\\sffamily\\tiny,
    minimum size=${formatNumber(topicSize)}cm,
    text width=${formatNumber(topicTextWidth)}cm
  }
]
  \\node[mm root] (root) at (0,0) {Chapter ${chapter.number}\\\\${latexEscape(chapter.name)}};
${nodes.join("\n")}

  \\begin{scope}[on background layer, line cap=round]
${connections.join("\n")}
  \\end{scope}
\\end{tikzpicture}
`;
}

fs.mkdirSync(generatedDir, { recursive: true });

const chapterFiles = fs.readdirSync(chaptersDir)
  .filter((name) => /^\d{2}-.*\.tex$/.test(name))
  .sort()
  .map((name) => path.join(chaptersDir, name));

const chapters = chapterFiles.map(buildChapter);
if (chapters.length !== 15) {
  throw new Error(`Expected 15 chapters, found ${chapters.length}`);
}

chapters.forEach((chapter, index) => {
  const previous = chapters[index - 1] || null;
  const next = chapters[index + 1] || null;
  fs.writeFileSync(
    path.join(mindmapsDir, `${chapter.slug}.qmd`),
    generatePage(chapter, previous, next),
  );
  fs.writeFileSync(
    path.join(generatedDir, `chapter-${String(chapter.number).padStart(2, "0")}.tex`),
    generateTikz(chapter),
  );
});

fs.writeFileSync(path.join(mindmapsDir, "index.qmd"), generateIndex(chapters));

const totalSections = chapters.reduce((sum, chapter) => sum + chapter.children.length, 0);
const totalTopics = chapters.reduce((sum, chapter) => sum + countTopics(chapter), 0);
console.log(`Generated ${chapters.length} chapter maps (${totalSections} sections, ${totalTopics} topics).`);
