# Contributing to PassForge

Thank you for your interest in contributing to PassForge. We welcome bug reports, feature proposals, and high-quality pull requests.

---

## 1. Reporting Bugs

Before submitting a bug report:
1. Search existing issues to ensure the problem has not already been reported.
2. Provide a clear, reproducible test case.
3. Include:
   - Operating system and Node.js version.
   - Exact steps to reproduce.
   - Expected behavior vs. actual behavior.
   - Relevant terminal logs or browser console errors.
   - If reporting a CSV parsing issue, include an anonymized sample row.

---

## 2. Proposing Features

When proposing architectural changes or new ticket designs:
1. Open an issue describing the problem your feature solves.
2. Explain why this capability benefits event organizers.
3. Outline proposed API or template changes before writing code.

---

## 3. Code Quality Standards

- **Strict TypeScript:** All code across `apps/frontend`, `apps/backend`, and `packages/shared` must compile with 0 TypeScript diagnostics (`npm run build`).
- **Shared Schemas:** Validate external data (HTTP payloads, CSV inputs) using **Zod** in `packages/shared`. Never bypass type boundaries with `any`.
- **Hyper Elements Primitives:** Ticket templates must use official `@hyper-elements/react` primitives (`Heading`, `Text`, `Column`, `Row`, `Section`) rather than raw unstyled HTML elements.
- **Pure Functions:** Business logic (data transformation, sanitization) should be pure and separated from Express controllers or React UI components.

---

## 4. Testing Expectations

Before opening a pull request, run the automated verification suites:

```bash
# 1. Run core verification & bulk queue tests (all 33 assertions must pass)
npm test

# 2. Verify frontend compilation and bundle integrity
npm run build
```

Any PR modifying ticket templates or rendering logic must ensure that magic bytes (`%PDF-`, `\x89PNG`) and HTML diagnostics continue to pass.

---

## 5. Pull Request Guidelines

1. Create a focused branch from `master` or `main` (e.g., `fix/csv-quote-parsing` or `feat/badge-template`).
2. Keep pull requests focused on a single change. Avoid bundling unrelated refactors.
3. Ensure commit messages describe the operational change clearly (e.g., `fix: handle empty seat values in editorial document`).
4. Update relevant documentation in `API_REFERENCE.md` or `HYPER_ELEMENTS.md` if endpoints or template interfaces change.
