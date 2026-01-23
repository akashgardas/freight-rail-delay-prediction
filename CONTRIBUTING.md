# Contributing Guidelines

Thank you for your interest in contributing to this project.
These guidelines ensure code quality, reproducibility, and smooth collaboration across the team.

---

## 📌 Branch Protection Policy

The `main` branch is **protected** and follows strict rules:

- Direct pushes to `main` are **not allowed**
- The `main` branch **cannot be deleted**
- Force pushes to `main` are **blocked**
- All changes must go through **Pull Requests (PRs)**

These rules preserve project integrity and maintain a stable codebase.

---

## 🌿 Branching Strategy

### Permanent Branches

- `main` → Stable, production-ready code
- `dev` → Integration and testing branch

### Temporary Branches

Create all work in short-lived branches:

```text
feature/<short-description>
fix/<short-description>
docs/<short-description>
```

**Examples**

```text
feature/data-preprocessing
fix/handle-missing-values
docs/readme-update
```

---

## 🔄 Contribution Workflow

1. **Fork or clone** the repository
2. Create a new branch from `dev`

   ```bash
   git checkout dev
   git checkout -b feature/your-feature-name
   ```

3. Make changes with clear, logical commits
4. Push your branch to GitHub

   ```bash
   git push origin feature/your-feature-name
   ```

5. Open a **Pull Request (PR)** targeting `dev`
6. Address review comments if any
7. After approval, the branch will be merged
8. **Delete the branch after merge**

---

## 📝 Commit Message Guidelines

This project follows **Conventional Commits**.

### Format

```text
type(scope): short description
```

### Common Types

- `feat:` – New feature
- `fix:` – Bug fix
- `docs:` – Documentation changes
- `refactor:` – Code restructuring
- `test:` – Tests
- `chore:` – Maintenance tasks

**Examples**

```text
feat(model): add baseline delay prediction model
fix(data): handle missing arrival time values
docs(readme): update project overview
```

---

## ✅ Pull Request Requirements

Before submitting a PR, ensure:

- Code builds and runs successfully
- Changes are limited to a single purpose
- Commit messages follow the defined format
- Documentation is updated where applicable
- At least **one approval** is required before merge

---

## 🚫 What Not to Do

- ❌ Do not push directly to `main`
- ❌ Do not force-push to protected branches
- ❌ Do not merge without review (if approvals are required)

---

## 📄 Licensing

By contributing to this project, you agree that your contributions will be licensed under the **MIT License**.

---

## 🙌 Acknowledgement

We appreciate all contributions that help improve the quality, clarity, and impact of this research project.
