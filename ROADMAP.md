# Codex Open Source - Project Roadmap

This document outlines the milestones and planned feature updates for Codex Lite and the surrounding Codex Open Source project. As this is an early-stage prototype, timelines and features may evolve based on community feedback.

---

## Phase 1: Prototype & Core Validation (v0.1.0) - *Current*
- [x] **Zero-Dependency CLI Framework**: Set up the executable CLI interface without external packages.
- [x] **Lexical Symbol Parser**: Construct standard regular-expression parsers to safely extract symbols from JavaScript and Python files.
- [x] **Offline Generators**: Build rules for offline Markdown documentation generation and test suite scaffolding.
- [x] **Basic Code Quality Review**: Implement standard static reviews (evaluating complexity, comment density, line count).
- [x] **LLM Integration Layer**: Support optional API calls directly to OpenAI's completion models.

## Phase 2: Parser Robustness & Language Expansion (v0.2.0) - *Planned*
- [ ] **AST-Based Parser Integration**: Move from regex lexical scanning to a robust AST-like parsing process (using lightweight, built-in, or single-dependency parser tools like `acorn`).
- [ ] **Language Support Extension**:
  - [ ] Add parsing templates for TypeScript (`.ts`/`.tsx`).
  - [ ] Add parsing templates for Go (`.go`) and Rust (`.rs`).
- [ ] **Expanded Test Scaffolders**: Allow custom test framework configurations (e.g., generating tests specifically formatted for Vitest, Jest, or Pytest).
- [ ] **Config File Support**: Introduce a `.codexrc` JSON configuration file to allow customizing review limits, ignore patterns, and template directories.

## Phase 3: Bi-Directional Integration & Agentic Editing (v0.3.0) - *Future*
- [ ] **Interactive Console Mode**: Provide an interactive REPL or wizard prompt to run refactoring tasks line-by-line.
- [ ] **Bi-Directional Doc Sync**: Automatically update docstrings and source comments in code files based on edits made directly to the generated Markdown documentation.
- [ ] **Automatic Fix Command (`codex fix`)**: Enable the CLI to automatically repair static review violations (such as adding generic documentation blocks to undocumented public functions or formatting code lines).
