# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.0-prototype] - 2026-06-10

### Added
- Zero-dependency Node.js ESM executable entry point (`bin/codex.js`).
- Lexical parser (`src/parser.js`) to extract classes, functions, and import lists from JavaScript and Python code.
- Static analyzer (`src/reviewer.js`) containing rules for function length, nested nesting, and comment-to-code ratios.
- Markdown documentation creator and test runner scaffolder (`src/generator.js`).
- Direct OpenAI API integration layer (`src/llm.js`) with manual HTTP request handling (no SDK dependencies).
- Basic math verification example (`examples/math.js`).
- Open-source repo configuration: `.gitignore`, `LICENSE` (MIT), `README.md`, `CONTRIBUTING.md`, and `ROADMAP.md`.
