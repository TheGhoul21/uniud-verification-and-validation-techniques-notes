# Repository Guidelines

## Project Structure & Module Organization

This repository contains course notes for Verification and Validation Techniques in two published forms: a LaTeX book and a Quarto website. The book entry point is `main.tex`, with shared macros and styling in `preamble.tex` and chapter files in `chapters/`. The website entry point is `index.qmd`; interactive notebooks live in `notebooks/`, and Quarto configuration is in `_quarto.yml`. Site styling is centralized in `custom.scss`. Generated outputs are written to `_site/` and `main.pdf`; avoid hand-editing generated HTML.

Reference planning documents include `BOOK_STRUCTURE.md`, `SOURCE_MAP.md`, and `STYLE-GUIDE.md`. Keep them aligned when adding or reorganizing chapters.

## Build, Test, and Development Commands

- `quarto render`: renders the Quarto website into `_site/`. This is also what the GitHub Pages workflow runs.
- `quarto preview`: starts a local preview server for the website.
- `latexmk -pdf main.tex`: compiles the full PDF book.
- `latexmk -c main.tex`: removes common LaTeX auxiliary files after a build.

There is no application test suite. Treat successful Quarto rendering and LaTeX compilation as the primary validation steps.

## Coding Style & Naming Conventions

Write chapters as pedagogical notes, not transcript dumps. Follow `STYLE-GUIDE.md`: introduce concrete examples before definitions, add intuition after formal blocks, and use bridge paragraphs between concepts. Chapter files use numeric prefixes, for example `chapters/11-linear-temporal-logic.tex`; notebooks follow the same pattern, for example `notebooks/02-nfa-reachable-states.qmd`.

Use ASCII unless the surrounding file already uses a specific mathematical or typographic convention. Keep LaTeX labels descriptive and scoped, such as `\label{sec:alphabets-words}` or `\label{def:alphabet-word}`.

## Testing Guidelines

Before submitting changes, run the renderer affected by your edits. For website or notebook changes, run `quarto render`. For book or macro changes, run `latexmk -pdf main.tex`. Check logs for unresolved references, missing files, and broken figures. If you update generated outputs, ensure they come from a fresh build.

## Commit & Pull Request Guidelines

Recent commits use short, imperative summaries such as `Add interactive NFA reachable states example` and `Align notebook colors with book palette`. Keep commit titles focused on one change.

Pull requests should describe the affected chapter, notebook, or site area; list the validation commands run; and note any source-map or structure updates. Include screenshots only for visible website or notebook UI changes.

