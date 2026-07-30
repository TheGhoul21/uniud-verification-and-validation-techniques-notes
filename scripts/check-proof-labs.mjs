import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
globalThis.window = {};
await import(path.join(repoRoot, "proofs/proof-lab-content.js"));

const labs = globalThis.window.PROOF_LABS || {};
const expectedSlugs = [
  "subset-construction",
  "epsilon-removal",
  "kleene-equivalence",
  "regular-closure",
  "small-model-property",
  "myhill-nerode",
  "omega-closure",
  "buchi-expression-equivalence",
  "buchi-complementation"
];

function fail(message) {
  throw new Error(`Proof Lab validation failed: ${message}`);
}

if (Object.keys(labs).length !== expectedSlugs.length) {
  fail(`expected ${expectedSlugs.length} configurations, found ${Object.keys(labs).length}`);
}

for (const slug of expectedSlugs) {
  const lab = labs[slug];
  if (!lab) fail(`missing configuration ${slug}`);
  if (!lab.title || !lab.theorem || !lab.invariant) fail(`${slug} lacks core copy`);
  if (!lab.strategy || lab.strategy.length < 140) fail(`${slug} lacks a developed proof strategy`);
  if (!lab.synthesis || lab.synthesis.length < 350) fail(`${slug} lacks a complete proof synthesis`);
  if (!lab.synthesis.includes("\\(") || !lab.synthesis.includes("\\)")) {
    fail(`${slug} proof synthesis lacks MathJax-delimited mathematics`);
  }
  if (!Array.isArray(lab.steps) || lab.steps.length < 3) fail(`${slug} needs at least three steps`);

  const nodeIds = new Set((lab.diagram.nodes || []).map((node) => node.id));
  const edgeIds = new Set((lab.diagram.edges || []).map((edge) => edge.id));
  if (nodeIds.size !== lab.diagram.nodes.length) fail(`${slug} has duplicate node IDs`);
  if (edgeIds.size !== lab.diagram.edges.length) fail(`${slug} has duplicate edge IDs`);

  for (const edge of lab.diagram.edges) {
    if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) {
      fail(`${slug} edge ${edge.id} references a missing node`);
    }
  }

  lab.steps.forEach((step, index) => {
    if (!Array.isArray(step.choices) || step.choices.length < 2) {
      fail(`${slug} step ${index + 1} needs at least two choices`);
    }
    if (!Number.isInteger(step.correct) || step.correct < 0 || step.correct >= step.choices.length) {
      fail(`${slug} step ${index + 1} has an invalid correct answer`);
    }
    if (!step.formal || !step.feedback || !step.incorrect || !step.hint) {
      fail(`${slug} step ${index + 1} lacks proof feedback`);
    }
    if (!step.exposition || step.exposition.length < 180) {
      fail(`${slug} step ${index + 1} lacks technical exposition`);
    }

    for (const visual of [step.preview, step.reveal]) {
      if (!visual) fail(`${slug} step ${index + 1} lacks a visual state`);
      for (const key of ["activeNodes", "goodNodes", "badNodes", "dimNodes"]) {
        for (const id of visual[key] || []) {
          if (!nodeIds.has(id)) fail(`${slug} step ${index + 1} references missing node ${id}`);
        }
      }
      for (const key of ["activeEdges", "dimEdges"]) {
        for (const id of visual[key] || []) {
          if (!edgeIds.has(id)) fail(`${slug} step ${index + 1} references missing edge ${id}`);
        }
      }
    }
  });
}

const qmdFiles = fs
  .readdirSync(path.join(repoRoot, "proofs"), { recursive: true })
  .filter((name) => name.endsWith(".qmd") && name.includes("chapter-"));

if (qmdFiles.length !== expectedSlugs.length) {
  fail(`expected ${expectedSlugs.length} theorem pages, found ${qmdFiles.length}`);
}

for (const slug of expectedSlugs) {
  const qmd = qmdFiles.find((name) => path.basename(name) === `${slug}.qmd`);
  if (!qmd) fail(`missing QMD route for ${slug}`);
  const source = fs.readFileSync(path.join(repoRoot, "proofs", qmd), "utf8");
  if (!source.includes(`data-proof-lab="${slug}"`)) fail(`${slug} route mounts the wrong configuration`);
  if (!source.includes(`class="proof-lab" data-proof-lab="${slug}"`)) {
    fail(`${slug} route lacks the Proof Lab layout container`);
  }

  const html = path.join(repoRoot, "_site", "proofs", qmd.replace(/\.qmd$/, ".html"));
  if (!fs.existsSync(html)) fail(`rendered page missing for ${slug}`);
  const rendered = fs.readFileSync(html, "utf8");
  if (!rendered.includes(`class="proof-lab" data-proof-lab="${slug}"`)) {
    fail(`${slug} rendered page lacks the Proof Lab layout container`);
  }
  if (!rendered.includes("tex-chtml-full.js")) {
    fail(`${slug} rendered page does not load MathJax`);
  }
}

for (const asset of ["proof-lab.css", "proof-lab-content.js", "proof-lab.js"]) {
  const sourceAsset = path.join(repoRoot, "proofs", asset);
  const renderedAsset = path.join(repoRoot, "_site", "proofs", asset);
  if (!fs.existsSync(renderedAsset)) {
    fail(`rendered asset missing: ${asset}`);
  }
  if (!fs.readFileSync(sourceAsset).equals(fs.readFileSync(renderedAsset))) {
    fail(`rendered asset is stale: ${asset}`);
  }
}

const omegaHtmlPath = path.join(repoRoot, "_site/proofs/chapter-03/omega-closure.html");
const omegaHtml = fs.readFileSync(omegaHtmlPath, "utf8");
const bootstrapHref = omegaHtml.match(
  /<link href="([^"]*site_libs\/bootstrap\/[^"]+\.css)"[^>]*id="quarto-bootstrap"/
)?.[1];
if (!bootstrapHref) fail("could not locate the rendered Quarto stylesheet");

const bootstrapCss = fs.readFileSync(path.resolve(path.dirname(omegaHtmlPath), bootstrapHref), "utf8");
const proofRuntime = fs.readFileSync(path.join(repoRoot, "proofs/proof-lab.js"), "utf8");
if (!proofRuntime.includes("typesetPromise")) {
  fail("Proof Lab runtime does not typeset dynamically inserted mathematics");
}
const quartoRehomesAside =
  /aside:not\(\.footnotes\):not\(\.sidebar\)[^{]*\{[^}]*grid-column:[^}]*!important/.test(bootstrapCss);
const proofRailUsesAside = /element\("aside",\s*"proof-lab__rail"\)/.test(proofRuntime);
if (quartoRehomesAside && proofRailUsesAside) {
  fail("Proof Lab rail uses an aside that Quarto rehomes into a margin column");
}

const proofMetadata = fs.readFileSync(path.join(repoRoot, "proofs/_metadata.yml"), "utf8");
if (!proofMetadata.includes("tex-chtml-full.js")) {
  fail("Proof Lab pages do not load MathJax");
}

const chapterText = ["01", "02", "03", "04"]
  .map((number) => {
    const file = fs.readdirSync(path.join(repoRoot, "chapters")).find((name) => name.startsWith(`${number}-`));
    return fs.readFileSync(path.join(repoRoot, "chapters", file), "utf8");
  })
  .join("\n");

const linkCount = (chapterText.match(/\\prooflablink\{/g) || []).length;
if (linkCount !== expectedSlugs.length) {
  fail(`expected ${expectedSlugs.length} LaTeX links, found ${linkCount}`);
}

console.log(`Validated ${expectedSlugs.length} Proof Labs, ${labs && Object.values(labs).reduce((sum, lab) => sum + lab.steps.length, 0)} guided steps, and ${linkCount} book links.`);
