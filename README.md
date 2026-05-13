# Agent Driven Development — Prototype

This repository is a **proof of concept for Agent Driven Development (ADD)** — a workflow where AI agents powered by Claude Code autonomously handle the full software development lifecycle, from reading a GitHub issue to raising a pull request, without human intervention between steps.

The application used as the subject is **PeopleDesk**, a fictional Employee Self-Service Portal built with React, TypeScript, and MUI. It exists purely as a realistic, relatable codebase for agents to develop features on.

---

## How It Works

Open a GitHub issue. That's it. The pipeline takes over from there.

```
You open an issue
    └─► Claude assesses if there's enough info
            ├─► Not enough → asks clarifying question → you reply → resumes
            └─► Enough → expands story → implements → tests → raises PR
                                                                  └─► Claude reviews PR
                                                                          └─► Auto-fixes issues
                                                                                  └─► You approve
                                                                                          └─► Auto-merges to develop
                                                                                                  └─► Deploys
```

---

## GitHub Actions Workflows

Six workflows cover the full lifecycle:

### `01-issue-to-pr.yml` — Issue → Implement → PR
**Trigger:** Issue opened

1. Assesses whether the issue has enough information to implement
   - If not → posts a clarifying question on the issue and stops
   - If yes → proceeds
2. Expands the issue into a full user story (preserves original description, appends story below a divider)
3. Creates a feature branch `feature/GH-<number>-<slug>`
4. Implements the feature following all CLAUDE.md conventions
5. Downloads any attached images into `src/assets/` — never uses CDN URLs
6. Writes unit tests for every new or changed component
7. Runs quality gate: `lint --fix && build && test`
8. Opens a PR targeting `develop`
9. Updates README.md if the feature adds new routes, components, or behaviour worth documenting
10. Updates CLAUDE.md if new patterns or conventions are discovered

---

### `02-pr-review.yml` — PR Review & Auto-Fix
**Trigger:** PR opened or pushed, targeting `develop`

- **First run:** Full code review against CLAUDE.md conventions, auto-fixes what it can (lint, TypeScript errors), commits fixes, posts a detailed review report
- **Follow-up runs** (triggered by its own fix commit): Posts a short confirmation comment only — no repeated full report

---

### `03-deploy.yml` — Deploy on Develop
**Trigger:** Push to `develop`

Runs `npm run build`. Replace the deploy step with your actual deployment target (Vercel, Netlify, AWS S3, etc.).

---

### `04-merge-on-approval.yml` — Auto-Merge on Approval
**Trigger:** PR review submitted with state `approved`

Automatically squash-merges the PR to `develop`. No GitHub paid plan required — uses `gh pr merge` directly.

---

### `05-pr-comment.yml` — PR Comment Actions
**Trigger:** Comment on a PR (conversation or inline review)

Classifies the comment and acts:
- **Change request** ("fix X", "rename to Y") → implements, commits, replies "✅ Done"
- **Vague request** → asks a specific clarifying question back
- **Reply to a clarification** → resumes with new context and implements
- **Discussion / praise** → brief acknowledgment or nothing

Always builds on existing branch work — never restarts from scratch.

---

### `06-issue-comment.yml` — Issue Comment — Clarification & Resume
**Trigger:** Comment on a GitHub issue (not a PR)

Handles the clarification loop started by `01`:
- User's answer provides enough info → runs full implementation (expand → implement → test → PR)
- Still not enough info → asks one more focused follow-up
- No clarification pending → brief acknowledgment, no code changes

---

## Setup

### Prerequisites

| Requirement | Detail |
|---|---|
| GitHub repository | Personal account (free Actions minutes included) |
| Claude subscription | Pro or Max at claude.ai |
| Claude GitHub App | Install at https://github.com/apps/claude — grant access to this repo |

### Secrets

Add in: **Repo → Settings → Secrets and Variables → Actions → New repository secret**

| Secret | How to get it |
|---|---|
| `CLAUDE_CODE_OAUTH_TOKEN` | Run `claude setup-token` locally — valid for 1 year |
| `GH_PAT` | GitHub → Profile → Settings → Developer settings → Personal access tokens (classic) → scopes: `repo` + `workflow` |

### Permissions

**Repo → Settings → Actions → General:**
- Workflow permissions → **Read and write permissions**
- Check **Allow GitHub Actions to create and approve pull requests**

### Branches

The pipeline targets `develop`. Ensure it exists on the remote:
```bash
git checkout -b develop
git push origin develop
```

---

## Conversation Loop

Write naturally — no commands or prefixes needed.

**On an issue:**
```
You:    "Add a leave request form"
Claude: "Before I start I need a few details:
         - Should it show remaining balance?
         - Is approval required or instant?"
You:    "Show balance, approval required from manager"
Claude: [implements, raises PR]
```

**On a PR:**
```
Claude: [posts full review report]
You:    "The success message should use green not blue"
Claude: [makes the change, commits, replies "✅ Done"]
You:    [approves PR]
Claude: [auto-merges to develop → deploy runs]
```

---

## Self-Updating Docs

When implementing a feature the pipeline automatically:
- Updates **README.md** if the change adds new routes, pages, or user-facing behaviour
- Updates **CLAUDE.md** if a new pattern or convention is discovered that future agents should follow

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | React | 19 |
| Build Tool | Vite | 8 |
| Language | TypeScript | 6 |
| UI Components | MUI (Material UI) | 9 |
| Styling | Tailwind CSS | 4 |
| State Management | Jotai | 2 |
| Routing | React Router | 7 |
| Testing | Vitest + React Testing Library | — |

---

## Project Structure

```
src/
  atoms/              # Jotai atoms — one file per domain
  components/
    layout/           # Sidebar, Header, AppLayout
    common/           # Reusable UI primitives
  pages/              # One file per route
  routes/             # AppRouter.tsx
  assets/             # Static assets (images from issues land here)
  theme/              # MUI theme + brand tokens
.github/
  workflows/
    01-issue-to-pr.yml       # Issue → story expansion → implement → PR
    02-pr-review.yml         # PR review + auto-fix + report
    03-deploy.yml            # Build + deploy on develop push
    04-merge-on-approval.yml # Auto-merge on human approval
    05-pr-comment.yml        # PR comment → act / ask / acknowledge
    06-issue-comment.yml     # Issue comment → clarification loop → resume
```

---

## Running Locally

```bash
npm install
npm run dev      # development server
npm run build    # production build
npm test         # run unit tests
npm run lint     # ESLint check
```

**Demo login:**
- Email: `alex.morgan@company.com`
- Password: `password`
