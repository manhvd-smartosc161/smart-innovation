# Git Workflow

This document outlines the git workflow for the project, including branching strategies, commit message conventions, and the pull request process.

## Branching Strategy

We follow a **Feature Branch Workflow**.

- **`main`**: The main branch containing production-ready code.
- **Feature Branches**: Created from `main` for new features, bug fixes, or improvements.
  - Naming convention: `type/short-description`
  - Examples:
    - `feat/user-authentication`
    - `fix/login-bug`
    - `chore/update-dependencies`
    - `docs/update-readme`

### Workflow Steps

1.  **Pull latest changes**: `git checkout main && git pull origin main`
2.  **Create a branch**: `git checkout -b feat/your-feature-name`
3.  **Make changes**: Write code and commit changes.
4.  **Push branch**: `git push origin feat/your-feature-name`
5.  **Open Pull Request**: Create a PR to merge your branch into `main`.

## Commit Message Convention

We use [Conventional Commits](https://www.conventionalcommits.org/) to ensure consistent and readable commit messages. This is enforced by `commitlint`.

### Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
- **ci**: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

### Examples

- `feat: add user login page`
- `fix(auth): handle token expiration`
- `docs: update installation instructions`
- `chore: update dependencies`

## Pull Request Process

1.  Ensure your code passes all linting and formatting checks.
2.  Update documentation if necessary.
3.  Provide a clear description of your changes in the PR.
4.  Request review from at least one team member.
5.  Address feedback and merge once approved.
