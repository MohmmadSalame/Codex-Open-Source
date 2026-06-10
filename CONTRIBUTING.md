# Contributing to Codex Open Source

Thank you for your interest in contributing to Codex Open Source! As an early-stage project, we highly appreciate community feedback, issue reports, and code contributions.

By participating in this project, you agree to abide by our guidelines and maintain a professional, respectful environment.

---

## Zero-Dependency Policy
To ensure Codex Lite remains highly portable, lightweight, and easy to review, we maintain a strict **zero-dependency policy** for runtime code.
- All core logic must use standard built-in Node.js modules (`fs`, `path`, `https`, `crypto`, etc.).
- DevDependencies are allowed for testing, linting, and formatting (e.g., ESLint, Jest), but should be kept to a minimum.

---

## How Can I Contribute?

### 1. Reporting Bugs
- Search the issue tracker to see if the bug has already been reported.
- If not, open a new issue. Include clear steps to reproduce the issue, what environment/platform you are running on, and what behavior you expected.

### 2. Suggesting Enhancements
- Open an issue explaining the feature request.
- Detail why this feature is useful and provide examples of how it would look/act in the CLI.

### 3. Submitting Pull Requests (PRs)
- Fork the repository and create your branch from `main`.
- Write clean, documented ES Module code.
- Ensure your changes do not introduce third-party runtime dependencies.
- Update documentation or add examples if your changes add new commands or functionality.
- Open a PR targeting the `main` branch of this repository.

---

## Pull Request Guidelines
- **Keep PRs focused**: A PR should ideally fix one bug or implement one specific feature.
- **Run local checks**: Before submitting, test your changes using the local review command:
  ```bash
  node bin/codex.js review examples/math.js
  ```
- **Commit Messages**: Use clear, concise commit messages. We prefer prefixes like:
  - `feat:` for new features
  - `fix:` for bug fixes
  - `docs:` for documentation updates
  - `refactor:` for codebase organization changes without behavior edits

---

## Questions?
If you have any questions, feel free to open a discussion issue, and we will get back to you as soon as possible.
