# Agent Driven Development — Prototype

This repository is a **proof of concept** that demonstrates **Agent Driven Development (ADD)** — a workflow where AI agents (powered by Claude Code) autonomously handle the full software development lifecycle, from reading a story to raising a pull request.

The application used as the subject is **PeopleDesk**, a fictional Employee Self-Service Portal built with React, TypeScript, and MUI. It exists purely as a realistic, relatable codebase that agents can develop features on — not as a product in itself.

---

## What is Agent Driven Development?

Agent Driven Development is the practice of using AI agents to mimic and automate the end-to-end workflow of a software developer:

```
Story (Notion)
    └─► Notion status → "In Progress"
            └─► Design (Figma)
                    └─► Code (Frontend skill)
                            └─► Unit Tests
                                    └─► Lint + Quality Gate
                                            └─► Git Push + Pull Request
                                                    └─► Notion status → "Ready for Review"
```

At each step, the agent uses the right tool — an MCP server, a Claude Code skill, or a CLI — just as a human developer would. The goal is to show that AI agents can participate in a real development process, not just generate isolated code snippets.

---

## How the Demo Works

1. **Open a story** — A Notion database has pre-written user stories (e.g. *"Add a Leave Request form to the portal"*).
2. **Extract the story via MCP** — The agent reads the story details using the Notion MCP server.
3. **Update Notion status → "In Progress"** — The agent moves the story from `To Do` to `In Progress` before touching any code.
4. **Pull the design via MCP** — The agent fetches the relevant Figma design to understand the expected UI.
5. **Develop the feature** — The `/frontend` skill scaffolds the component, wiring up state (Jotai) and styling (MUI + Tailwind) correctly.
6. **Write unit tests** — The `/unit-test` skill generates tests for the new component.
7. **Lint and quality check** — The `/lint` and `/quality-gate` skills validate the code meets standards.
8. **Push and raise a PR** — The agent commits, pushes, and opens a GitHub pull request.
9. **Update Notion status → "Ready for Review"** — The agent moves the story from `In Progress` to `Ready for Review` immediately after the PR is raised.

---

## Planned Demo Stories

These features are intentionally absent from the initial build — each one is a ready-made story for the live demo:

| # | Story | Feature Added |
|---|---|---|
| 1 | Add Leave Request & Balance | Leave form + balance widget on Dashboard |
| 2 | Add Team Directory | Searchable employee grid with filters |
| 3 | Add Payslip Section | Monthly payslip list with download |
| 4 | Add Notifications Panel | Bell icon in header with dropdown |
| 5 | Add Document Center | Company documents grouped by category |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 8 |
| Language | TypeScript 6 |
| UI Components | MUI v9 |
| Styling | Tailwind CSS v4 |
| State Management | Jotai |
| Routing | React Router v7 |

---

## Project Structure

```
src/
  atoms/          # Jotai state atoms (auth, UI)
  components/
    layout/       # Sidebar, Header, AppLayout
  pages/          # LoginPage, DashboardPage, ProfilePage
  routes/         # AppRouter with protected routes
  theme/          # MUI theme (brand colors: #081757, #085ED7)
```

---

## Running the App

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

**Demo login credentials:**
- Email: `alex.morgan@company.com`
- Password: `password`

---

## Agent Configuration (Coming Soon)

The following will be added to complete the ADD setup:

- `CLAUDE.md` — Global instructions for the agent (coding standards, conventions, PR format)
- `.mcp.json` — MCP server config for Notion, Figma, and GitHub
- `skills/` — Claude Code skills: `/frontend`, `/unit-test`, `/lint`, `/quality-gate`
