# Development Setup Guide

## Required Versions

- **Node.js**: 22.19.0
- **Yarn**: 1.22.19

## Quick Setup

### 1. Install Node.js with NVM (Recommended)

**macOS/Linux:**
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 22.19.0
nvm use 22.19.0
```

**Windows:** Download [nvm-windows](https://github.com/coreybutler/nvm-windows/releases)

**Or download directly:** [nodejs.org](https://nodejs.org/) (v22.19.0)

### 2. Install Yarn

```bash
corepack enable
# or
npm install -g yarn
```

### 3. Install Project

```bash
git clone <repository-url>
cd <project-name>
yarn install  # Husky hooks auto-installed
```

## Running the Project

```bash
# Development mode
yarn start

# Watch mode (auto-restart on file changes)
yarn start:dev

# Production mode
yarn start:prod

# Run tests
yarn test

# Run e2e tests
yarn test:e2e

# Test coverage
yarn test:cov
```

## Commit Message Format

```
<type>(<scope>): <description>
```

### Commit Types

| Type       | Use For          | Example                          |
|------------|------------------|----------------------------------|
| `feat`     | New feature      | `feat(auth): add login`          |
| `fix`      | Bug fix          | `fix(api): handle null`          |
| `refactor` | Code refactoring | `refactor(db): optimize queries` |
| `docs`     | Documentation    | `docs: update readme`            |
| `test`     | Tests            | `test(user): add unit tests`     |
| `style`    | Formatting       | `style: fix indentation`         |
| `chore`    | Maintenance      | `chore: update deps`             |

### Valid Examples

```bash
✅ git commit -m "feat: add user registration"
✅ git commit -m "fix(auth): resolve token issue"
✅ git commit -m "refactor(api): improve error handling"
```

### Invalid Examples

```bash
❌ git commit -m "added feature"
❌ git commit -m "fixed bug"
❌ git commit -m "updates"
```

## Husky Hooks

**Pre-commit:** Checks versions & runs linting  
**Commit-msg:** Validates commit format

## Troubleshooting

```bash
# Check versions
node -v
yarn -v

# Use correct Node version
nvm use

# Reinstall hooks
rm -rf .husky && yarn install

# Fix permissions
chmod +x .husky/pre-commit .husky/commit-msg

# Bypass hooks (emergency only)
git commit -m "message" --no-verify
```

## Quick Reference

```
Format: <type>(<scope>): <description>

Types: feat, fix, refactor, docs, test, style, chore

Examples:
feat(auth): add password reset
fix(api): handle edge case
refactor(user): optimize query
```