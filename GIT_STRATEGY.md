# Git Strategy & Workflow

**Project:** Noise Environment Monitor App
**Team:** Group 4 (GMU)
**Last Updated:** 2025-11-20
**Current Branch:** `phase/1-core-app`

---

## 📋 Table of Contents

1. [Repository Structure](#repository-structure)
2. [Branching Strategy](#branching-strategy)
3. [Commit Conventions](#commit-conventions)
4. [Pull Request Workflow](#pull-request-workflow)
5. [Code Review Guidelines](#code-review-guidelines)
6. [Release Management](#release-management)

---

## 🗂️ Repository Structure

### **Repository Name**
`noise-environment-monitor` or `INFS-group4-noise-app`

### **Directory Structure**
```
noise-environment-monitor/
├── .github/
│   ├── workflows/          # GitHub Actions CI/CD
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── ISSUE_TEMPLATE.md
│
├── docs/                   # All documentation
│   ├── architecture/
│   ├── testing/
│   └── design/
│
├── mobile-app/             # React Native application
│   ├── android/
│   ├── ios/
│   ├── src/
│   ├── tests/
│   ├── .gitignore
│   ├── package.json
│   └── README.md
│
├── backend/                # Backend API (Phase 3)
│   ├── src/
│   ├── tests/
│   └── package.json
│
├── ml-models/              # Machine learning components
│   ├── training/
│   ├── models/
│   └── requirements.txt
│
├── research/               # Prototypes and experiments
│   ├── audio-samples/
│   ├── notebooks/
│   └── prototypes/
│
├── .gitignore              # Root gitignore
├── README.md               # Repository overview
├── PROJECT_CONTEXT.md      # Master context file
├── PROJECT_PLAN.md         # Development plan
├── PROGRESS_REPORT.md      # Progress tracking
├── GIT_STRATEGY.md         # This file
└── LICENSE                 # MIT License

```

---

## 🌿 Branching Strategy

We use **Git Flow** adapted for academic project timeline.

### **Main Branches**

#### **1. `main` (protected)**
- **Purpose:** Production-ready code only
- **Protection Rules:**
  - No direct commits
  - Requires pull request
  - Requires 1+ review approval
  - CI checks must pass
- **Naming:** `main`
- **Lifetime:** Permanent

#### **2. `develop` (protected)**
- **Purpose:** Integration branch for ongoing development
- **Protection Rules:**
  - No direct commits (except minor hotfixes)
  - Requires pull request for features
  - CI checks must pass
- **Naming:** `develop`
- **Lifetime:** Permanent

---

### **Feature Branches**

**Convention:** `feature/<description>`

**Examples:**
- `feature/audio-capture`
- `feature/gps-integration`
- `feature/noise-heatmap`

**Workflow:**
```bash
# Create feature branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/audio-capture

# Work on feature
git add .
git commit -m "feat(audio): implement microphone permission"

# Push to remote
git push origin feature/audio-capture

# Open pull request to develop
```

**Rules:**
- Always branch from `develop`
- One feature per branch
- Delete after merging
- Keep branches short-lived (1-3 days)

---

### **Bugfix Branches**

**Convention:** `bugfix/<description>`

**Examples:**
- `bugfix/decibel-calculation-error`
- `bugfix/map-crash-on-zoom`

**Workflow:**
```bash
# Create bugfix branch from develop
git checkout develop
git checkout -b bugfix/decibel-calculation-error

# Fix bug and commit
git commit -m "fix(audio): correct dB calculation for silent audio"

# Push and create PR
git push origin bugfix/decibel-calculation-error
```

---

### **Hotfix Branches**

**Convention:** `hotfix/<description>`

**Purpose:** Critical fixes for production (main branch)

**Examples:**
- `hotfix/app-crash-on-startup`

**Workflow:**
```bash
# Create from main (emergency fix)
git checkout main
git checkout -b hotfix/app-crash-on-startup

# Fix critical bug
git commit -m "fix(app): prevent crash on startup with no permissions"

# Merge to BOTH main and develop
git checkout main
git merge hotfix/app-crash-on-startup
git checkout develop
git merge hotfix/app-crash-on-startup

# Tag the hotfix
git tag -a v1.0.1 -m "Hotfix: Startup crash"
```

---

### **Release Branches**

**Convention:** `release/<version>`

**Examples:**
- `release/v1.0.0`
- `release/v1.1.0`

**Purpose:** Prepare for production release (testing, bug fixes, version bumps)

**Workflow:**
```bash
# Create release branch from develop
git checkout develop
git checkout -b release/v1.0.0

# Final testing, version bumps, changelog updates
git commit -m "chore(release): bump version to 1.0.0"

# Merge to main AND develop
git checkout main
git merge release/v1.0.0
git tag -a v1.0.0 -m "Release version 1.0.0"

git checkout develop
git merge release/v1.0.0
```

---

### **Phase-Specific Branches**

**Convention:** `phase/<number>-<name>`

**Examples:**
- `phase/0-research`
- `phase/1-core-app`
- `phase/2-gps-mapping`

**Purpose:** Long-running branches for major development phases

**Workflow:**
```bash
# Create phase branch from develop
git checkout develop
git checkout -b phase/1-core-app

# All feature branches for Phase 1 branch from here
git checkout -b feature/audio-capture
# ... work ...
git checkout phase/1-core-app
git merge feature/audio-capture

# When phase is complete, merge to develop
git checkout develop
git merge phase/1-core-app
```

---

### **Branch Naming Examples**

| Branch Type | Example | Base Branch | Merge To |
|-------------|---------|-------------|----------|
| Feature | `feature/fft-implementation` | `develop` | `develop` |
| Bugfix | `bugfix/gps-null-check` | `develop` | `develop` |
| Hotfix | `hotfix/critical-memory-leak` | `main` | `main` + `develop` |
| Release | `release/v1.0.0` | `develop` | `main` + `develop` |
| Phase | `phase/2-gps-mapping` | `develop` | `develop` |
| Experimental | `experiment/new-fft-algorithm` | `develop` | (may be discarded) |

---

## 📝 Commit Conventions

We follow **Conventional Commits** specification.

### **Commit Message Format**

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Example:**
```
feat(audio): implement FFT signal processing

- Add FFT.js library for frequency analysis
- Extract spectral features from audio samples
- Calculate spectral centroid and energy distribution

Closes #23
```

---

### **Commit Types**

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(gps): add location tagging to noise readings` |
| `fix` | Bug fix | `fix(audio): correct decibel calculation for edge cases` |
| `docs` | Documentation only | `docs(readme): update installation instructions` |
| `style` | Code style (formatting, no logic change) | `style(ui): fix indentation in HomeScreen` |
| `refactor` | Code refactoring (no behavior change) | `refactor(audio): extract processor to separate service` |
| `perf` | Performance improvement | `perf(fft): optimize FFT computation with caching` |
| `test` | Adding or updating tests | `test(classifier): add unit tests for classification` |
| `chore` | Build process, dependencies, etc. | `chore(deps): update react-native to 0.72.5` |
| `ci` | CI/CD changes | `ci(github): add automated test workflow` |
| `build` | Build system changes | `build(android): configure release signing` |
| `revert` | Revert previous commit | `revert: feat(audio): implement FFT (caused crashes)` |

---

### **Scope Examples**

**By Component:**
- `audio` - Audio capture and processing
- `gps` - GPS and location services
- `classifier` - Noise classification logic
- `ui` - User interface components
- `map` - Map and heatmap features
- `storage` - Data persistence
- `api` - Backend API (Phase 3)

**By File/Feature:**
- `home-screen` - Specific screen
- `fft-processor` - Specific service
- `noise-marker` - Specific component

---

### **Commit Message Rules**

1. **Subject line:**
   - Max 72 characters
   - Imperative mood ("add" not "added" or "adds")
   - No period at the end
   - Lowercase after type and scope

2. **Body (optional):**
   - Explain **what** and **why**, not **how**
   - Wrap at 72 characters
   - Separate from subject with blank line

3. **Footer (optional):**
   - Reference issues: `Closes #42`, `Fixes #15`, `Relates to #8`
   - Breaking changes: `BREAKING CHANGE: API endpoint changed`

---

### **Good Commit Examples**

✅ **Good:**
```
feat(audio): implement moving average filter

- Add sliding window filter with configurable window size
- Default window size set to 10 samples
- Reduces noise spikes in decibel readings

Closes #12
```

✅ **Good (simple):**
```
fix(gps): handle null location gracefully
```

✅ **Good (breaking change):**
```
feat(api): change noise reading endpoint structure

BREAKING CHANGE: /api/readings now requires authentication token
```

❌ **Bad:**
```
fixed bug
```

❌ **Bad:**
```
WIP audio stuff
```

❌ **Bad:**
```
feat: Added the audio capture feature and also fixed some bugs in GPS and updated the UI
```

---

## 🔄 Pull Request Workflow

### **1. Before Creating PR**

```bash
# Ensure branch is up to date with base
git checkout develop
git pull origin develop
git checkout feature/your-feature
git merge develop  # or rebase if preferred

# Run tests
npm test

# Fix linting issues
npm run lint -- --fix

# Push latest changes
git push origin feature/your-feature
```

---

### **2. Creating Pull Request**

**Title Format:**
```
<type>(<scope>): <description>
```

**Examples:**
- `feat(audio): Implement FFT signal processing`
- `fix(gps): Resolve crash when location is unavailable`

**Description Template:**
```markdown
## Description
Brief description of what this PR does.

## Changes Made
- [ ] Implemented X feature
- [ ] Fixed Y bug
- [ ] Updated Z documentation

## Related Issues
Closes #42
Relates to #38

## Testing
- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] Tested on Android
- [ ] Tested on iOS

## Screenshots (if UI changes)
[Add screenshots or GIFs]

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated (if needed)
- [ ] No console.log statements left
- [ ] Tests pass locally
```

---

### **3. Code Review Process**

**Reviewers should check:**
- ✅ Code follows conventions (TypeScript style, naming)
- ✅ Tests are included and passing
- ✅ No unnecessary code or comments
- ✅ Documentation updated (if needed)
- ✅ Changes align with project plan
- ✅ No security vulnerabilities (hardcoded secrets, etc.)

**Review Comments:**
- Use GitHub review features (Comment, Approve, Request Changes)
- Be constructive and specific
- Suggest improvements with examples

**Example Comments:**
```markdown
✅ Good: "This FFT implementation looks correct. Consider adding a comment
explaining why window size is 2048."

❌ Bad: "This is wrong"
```

---

### **4. Addressing Review Feedback**

```bash
# Make requested changes
git add .
git commit -m "refactor(audio): extract FFT params to constants"

# Push updates
git push origin feature/your-feature

# Comment on PR: "Addressed feedback - ready for re-review"
```

---

### **5. Merging Pull Request**

**Merge Strategy:**
- **Squash and Merge:** For feature branches (keep history clean)
- **Merge Commit:** For release/hotfix branches (preserve history)
- **Rebase and Merge:** For small fixes (linear history)

**After Merge:**
```bash
# Delete remote branch (done automatically on GitHub)
# Delete local branch
git checkout develop
git branch -d feature/your-feature

# Pull latest changes
git pull origin develop
```

---

## 👥 Code Review Guidelines

### **As a Reviewer:**

**What to Look For:**
1. **Correctness** - Does the code do what it's supposed to?
2. **Performance** - Are there any obvious performance issues?
3. **Readability** - Is the code easy to understand?
4. **Testing** - Are there adequate tests?
5. **Security** - Any security concerns (hardcoded keys, SQL injection)?
6. **Style** - Follows project conventions?

**Review Turnaround:**
- Aim to review within 24 hours
- If unavailable, notify team

**Approval Criteria:**
- At least 1 approval required before merging
- All CI checks must pass
- No unresolved conversations

---

### **As an Author:**

**Before Requesting Review:**
- Self-review your own code first
- Ensure all tests pass
- Write clear PR description
- Link related issues

**Responding to Feedback:**
- Be open to suggestions
- Ask questions if feedback is unclear
- Don't take criticism personally
- Push fixes promptly

---

## 🚀 Release Management

### **Version Numbering**

We use **Semantic Versioning (SemVer):** `MAJOR.MINOR.PATCH`

**Examples:**
- `1.0.0` - Initial release
- `1.1.0` - New features (backward compatible)
- `1.1.1` - Bug fixes (backward compatible)
- `2.0.0` - Breaking changes

**Pre-release versions:**
- `1.0.0-alpha.1` - Alpha testing
- `1.0.0-beta.2` - Beta testing
- `1.0.0-rc.1` - Release candidate

---

### **Release Process**

#### **Step 1: Create Release Branch**
```bash
git checkout develop
git pull origin develop
git checkout -b release/v1.0.0
```

#### **Step 2: Prepare Release**
```bash
# Update version in package.json
npm version 1.0.0 --no-git-tag-version

# Update CHANGELOG.md
# Run final tests
npm test

# Commit changes
git commit -m "chore(release): prepare v1.0.0"
```

#### **Step 3: Merge to Main**
```bash
git checkout main
git merge release/v1.0.0

# Tag the release
git tag -a v1.0.0 -m "Release v1.0.0 - MVP Launch"
git push origin main --tags
```

#### **Step 4: Merge Back to Develop**
```bash
git checkout develop
git merge release/v1.0.0
git push origin develop
```

#### **Step 5: Create GitHub Release**
- Go to GitHub Releases
- Click "Create a new release"
- Select tag `v1.0.0`
- Add release notes (changelog)
- Attach APK/IPA files (if applicable)
- Publish release

---

### **Release Schedule**

| Version | Phase | Target Date | Features |
|---------|-------|-------------|----------|
| `v0.1.0` | Phase 0 Complete | Week 2 | Python prototype |
| `v0.5.0` | Phase 1 Complete | Week 5 | Audio capture & classification |
| `v0.8.0` | Phase 2 Complete | Week 8 | GPS & heatmap |
| `v0.9.0` | Phase 3 Complete | Week 10 | ML & backend (optional) |
| `v1.0.0` | MVP Release | Week 12 | Production-ready app |
| `v1.1.0` | Final Release | Week 14 | Polished & tested |

---

## 📊 Git Workflow Diagram

```
main ──────────●─────────●──────────●─────────────────→ (Production)
               │         │          │
               v1.0.0    v1.1.0     v1.2.0
               │         │          │
develop ───────┴─────────┴──────────┴─────────────────→ (Integration)
               ↑         ↑          ↑
               │         │          │
feature/audio ─┘         │          │
                         │          │
feature/gps ─────────────┘          │
                                    │
bugfix/crash ───────────────────────┘
```

---

## 🔒 Repository Settings

### **Branch Protection Rules**

**For `main` branch:**
```yaml
Require pull request before merging: ✅
  Require approvals: 1
Require status checks to pass: ✅
  Require branches to be up to date: ✅
Require conversation resolution: ✅
Do not allow bypassing: ✅
```

**For `develop` branch:**
```yaml
Require pull request before merging: ✅
  Require approvals: 1
Require status checks to pass: ✅
Allow force pushes: ❌
```

---

### **CI/CD Checks (GitHub Actions)**

**On Pull Request:**
- Run unit tests (`npm test`)
- Run linter (`npm run lint`)
- Check TypeScript compilation
- Check code coverage (>70%)

**On Push to `main`:**
- All above checks
- Build Android APK
- Build iOS IPA (if Mac runner available)

---

## 🛠️ Git Commands Cheatsheet

### **Daily Workflow**
```bash
# Start new feature
git checkout develop
git pull origin develop
git checkout -b feature/new-feature

# Save work
git add .
git commit -m "feat(scope): description"

# Update with latest develop
git fetch origin develop
git merge origin/develop

# Push to remote
git push origin feature/new-feature

# After PR is merged
git checkout develop
git pull origin develop
git branch -d feature/new-feature
```

---

### **Syncing with Remote**
```bash
# Get latest from all branches
git fetch --all

# Update current branch
git pull origin <branch-name>

# View all branches
git branch -a

# Switch branches
git checkout <branch-name>
```

---

### **Undoing Changes**
```bash
# Discard local changes (unstaged)
git checkout -- <file>

# Unstage changes
git reset HEAD <file>

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes) ⚠️ DANGEROUS
git reset --hard HEAD~1

# Revert a commit (safe, creates new commit)
git revert <commit-hash>
```

---

### **Viewing History**
```bash
# View commit history
git log --oneline --graph --all

# View changes in a commit
git show <commit-hash>

# View file history
git log -p <file>

# View who changed what
git blame <file>
```

---

## 📚 Resources

**Git Learning:**
- [Git Official Documentation](https://git-scm.com/doc)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Flow Cheatsheet](https://danielkummer.github.io/git-flow-cheatsheet/)

**Tools:**
- [GitHub Desktop](https://desktop.github.com/) - GUI for Git
- [GitKraken](https://www.gitkraken.com/) - Advanced Git GUI
- [Sourcetree](https://www.sourcetreeapp.com/) - Free Git GUI

---

## 🆘 Common Issues & Solutions

### **Issue: Merge Conflicts**
```bash
# Pull latest changes
git pull origin develop

# Conflicts appear - open files and resolve manually
# Look for <<<<<<< HEAD markers

# After resolving
git add .
git commit -m "fix: resolve merge conflicts"
```

---

### **Issue: Accidentally Committed to Wrong Branch**
```bash
# If not pushed yet
git reset --soft HEAD~1  # Undo commit, keep changes
git stash                # Save changes
git checkout correct-branch
git stash pop            # Apply changes
git commit -m "correct commit message"
```

---

### **Issue: Need to Change Last Commit Message**
```bash
# If not pushed yet
git commit --amend -m "new message"

# If already pushed (avoid if possible)
git commit --amend -m "new message"
git push --force origin <branch>  # ⚠️ Use with caution
```

---

### **Issue: Large File Committed Accidentally**
```bash
# Remove from last commit
git rm --cached <large-file>
git commit --amend -m "chore: remove large file"

# Add to .gitignore
echo "<large-file>" >> .gitignore
```

---

## ✅ Git Checklist

**Before Every Commit:**
- [ ] Code works and tests pass
- [ ] No console.log or debug statements
- [ ] No commented-out code
- [ ] Follows commit message convention
- [ ] Commit is focused (one logical change)

**Before Creating Pull Request:**
- [ ] Branch is up to date with base
- [ ] All tests pass
- [ ] Linter shows no errors
- [ ] PR description is clear
- [ ] Related issues are linked

**Before Merging:**
- [ ] At least 1 approval
- [ ] All CI checks pass
- [ ] Conflicts resolved
- [ ] Documentation updated (if needed)

---

## 📞 Git Support

**Questions?**
- Check this guide first
- Ask in team chat
- Consult [Git documentation](https://git-scm.com/doc)

**Git Issues?**
- Don't panic!
- Don't force push without asking
- Ask team for help before doing risky operations

---

**🔗 Navigation:**
- ← [Back to Project Context](PROJECT_CONTEXT.md)
- ← [View Project Plan](PROJECT_PLAN.md)
- ← [Check Progress Report](PROGRESS_REPORT.md)

---

**Document Version:** 1.0.0
**Last Updated:** 2025-10-14 by Claude AI
