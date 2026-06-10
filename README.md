# Codex Lite

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-blue.svg)](https://nodejs.org)

**Codex Lite** is a lightweight, zero-dependency developer companion CLI tool designed to automate code documentation, scaffold unit tests, and review code structure. It works entirely offline using rule-based parsing and can optionally connect to the OpenAI API for intelligent, LLM-powered suggestions.

> [!IMPORTANT]
> **Project Status: Early-Stage Prototype**
> This repository is currently an early-stage open-source prototype (`v0.1.0-prototype`) undergoing public review. It is not yet ready for production environments.

---

## What It Does
Codex Lite scans JavaScript, TypeScript, and Python source files to extract functions, classes, imports, and block comments. It performs three primary tasks:
1. **`doc`**: Generates a clean Markdown documentation summary of all exported structures and internal functions.
2. **`test`**: Automatically scaffolds a boilerplate unit test file targeting the file's API surface.
3. **`review`**: Evaluates files against static structure rules (e.g., function length, lack of comments, nested complexity) and provides code health scores.

## Why It Exists
We believe that AI-assisted code tools should be transparent, lightweight, and accessible. Codex Lite serves as a modular prototype showcasing:
- How developer workflows (docs, tests, analysis) can be unified in a zero-dependency package.
- How rule-based parsers can serve as a fast local fallback for AI-driven development.
- Clean integration with OpenAI's API models.

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) version 16.0.0 or higher.
- No heavy package installations or standard NPM dependencies required.

### Installation
Clone the repository:
```bash
git clone https://github.com/MohmmadSalame/Codex-Open-Source.git
cd Codex-Open-Source
```

You can run Codex Lite directly using Node.js or link it globally for local development.

---

## Usage Examples

### 1. Generate Markdown Documentation
Run the documentation tool on a file to extract its API surface:
```bash
node bin/codex.js doc examples/math.js
```
*Creates `examples/math_doc.md` detailing all functions and classes.*

### 2. Scaffold a Unit Test File
Generate an ESM-compatible test file with pre-filled test suites:
```bash
node bin/codex.js test examples/math.js
```
*Generates `examples/math.test.js` importing the target functions with mock test cases.*

### 3. Review Code Structure & Health
Run static structure rules to score code complexity and documentation coverage:
```bash
node bin/codex.js review examples/math.js
```
*Outputs a detailed CLI report with line-by-line warnings and a global codebase health score.*

### 4. Enable AI-Assisted Mode (Optional)
Provide an `OPENAI_API_KEY` to run LLM-powered context generation instead of the rule-based local parser:
```bash
# On Windows PowerShell
$env:OPENAI_API_KEY="your-api-key"
node bin/codex.js doc examples/math.js --ai

# On Linux/macOS
OPENAI_API_KEY="your-api-key" node bin/codex.js doc examples/math.js --ai
```

---

## Architecture and Design
Codex Lite is split into four distinct modules under `src/`:
- [parser.js](file:///C:/Projects/Codex-Open-Source/src/parser.js): A lightweight regex lexer extracting functions, classes, and parameter structures.
- [reviewer.js](file:///C:/Projects/Codex-Open-Source/src/reviewer.js): Static code check engine mapping lines to rule violations.
- [generator.js](file:///C:/Projects/Codex-Open-Source/src/generator.js): Formats internal node trees into documentation tables or test boilerplates.
- [llm.js](file:///C:/Projects/Codex-Open-Source/src/llm.js): Handles HTTP connections to the OpenAI API without external library overhead.

---

## Roadmap
For the full plan and milestones, see [ROADMAP.md](file:///C:/Projects/Codex-Open-Source/ROADMAP.md).
- **v0.1.0** (Current): Core rule-based engine, CLI wrapper, and basic static review.
- **v0.2.0**: AST parsing using standard lightweight parser, expanded language support (Go/Rust).
- **v0.3.0**: Bi-directional syncing (updating code directly based on generated doc edits).

---

## Contributing
We welcome contributions to Codex Lite! Please see [CONTRIBUTING.md](file:///C:/Projects/Codex-Open-Source/CONTRIBUTING.md) for guidelines on how to submit pull requests, report issues, and suggest features.

---

## License
Distributed under the MIT License. See [LICENSE](file:///C:/Projects/Codex-Open-Source/LICENSE) for more information.
