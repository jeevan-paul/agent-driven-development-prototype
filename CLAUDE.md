# PeopleDesk — Agent Driven Development Prototype

## What This Is

This repository is a **proof of concept for Agent Driven Development (ADD)**. You are a developer agent. Your job is to receive a story from a GitHub issue, implement the feature, verify quality, and raise a pull request — exactly as a human developer would.

The application is **PeopleDesk**, a fictional Employee Self-Service Portal. It is the subject of development, not the product being showcased. The showcase is the workflow you follow.

---

## Agent Behaviour

Regardless of role, when given a task:

1. Do not ask unnecessary questions
2. Follow the workflow in order — no skipping steps
3. Produce clean, production-quality output consistent with the existing codebase
4. Verify your own work before raising or approving a PR

---

## Workflow — Follow This Order Every Time

When assigned a story via GitHub issue, execute these steps in sequence:

```
1. Assess          → Does the issue have enough info? If not, ask — don't guess.
2. Expand story    → Update issue body with full user story (preserve original at top)
3. Implement       → Create feature branch, write the feature
4. Unit tests      → Write tests for every new/changed component
5. Quality gate    → npm run lint -- --fix && npm run build && npm test -- --run
6. Raise PR        → Commit, push, open PR targeting develop
7. Self-update     → Update README.md and/or CLAUDE.md if needed (see below)
```

Do not proceed to the next step if the current step has unresolved errors.

---

## Self-Learning — Updating README and CLAUDE.md

After every implementation, before committing:

### Update README.md if:
- A new route or page was added (document it in the Project Structure section)
- A new user-facing feature exists that someone reading the README should know about
- Setup steps have changed

Do not update README for internal refactors, test-only changes, or bug fixes with no visible behaviour change.

### Update CLAUDE.md if:
- A new coding pattern was used that differs from or extends what's documented
- A new MUI component was used with non-obvious conventions
- An edge case was encountered that future agents should know to handle
- A convention was found to be wrong or incomplete — correct it

When updating CLAUDE.md, add to the relevant section. Do not duplicate existing rules. If a rule needs correcting, edit it in place rather than adding a conflicting one.

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
  atoms/              # Jotai atoms — one file per domain (authAtom.ts, uiAtom.ts)
  components/
    layout/           # Sidebar, Header, AppLayout — shared chrome
    common/           # Reusable UI primitives (StatCard, PageHeader, etc.)
  pages/              # One file per route (DashboardPage, ProfilePage, etc.)
  routes/             # AppRouter.tsx — route definitions and protected routes
  assets/             # Static assets (images downloaded from issues go here)
  theme/              # theme.ts — MUI theme, brand tokens
```

New features follow this pattern:
- New page → `src/pages/FeaturePage.tsx` + route added in `AppRouter.tsx`
- Reusable component → `src/components/common/ComponentName.tsx`
- New state → `src/atoms/featureAtom.ts`
- New nav item → add to `navItems` array in `src/components/layout/Sidebar.tsx`
- New page title → add to `pageTitles` map in `AppLayout.tsx`

---

## Assets

When an image is referenced or attached (e.g. from a GitHub issue):
- Never use the remote URL directly in code (no GitHub CDN links, no external image URLs)
- Always download the image and save it to `src/assets/` using curl:
  ```bash
  curl -L "<url>" -o src/assets/<meaningful-name>.<ext>
  ```
- Name the file descriptively based on its purpose (e.g. `default-avatar.png`, `company-logo.svg`)
- Import it in code as a local module: `import avatarImg from '../assets/default-avatar.png'`

---

## Coding Conventions

### MUI v9 — Critical Rules

- **Never pass `fontWeight` directly on `<Typography>`** — it is not a valid prop in MUI v9. Always use `sx={{ fontWeight: ... }}`.
- **Never use `InputProps` on `<TextField>`** — use `slotProps={{ input: { ... } }}` instead.
- **Never use `primaryTypographyProps` on `<ListItemText>`** — use `slotProps={{ primary: { ... } }}` instead.
- Use `sx` for all one-off styles. Do not create new CSS files for component styles.
- Use the MUI theme tokens (`primary.main`, `secondary.main`) rather than hardcoding brand colors where possible.

### Brand Colors
```
Navy (primary dark):  #081757
Blue (interactive):   #085ED7
```

### TypeScript
- All props must be typed — no `any`.
- Prefer `interface` for component props, `type` for unions/atoms.
- All Jotai atoms must be typed explicitly.

### State Management (Jotai)
- Global UI state (sidebar open/closed, modals) → `uiAtom.ts`
- Auth state → `authAtom.ts`
- Feature-specific state → create a new `featureAtom.ts`
- Use `useAtom` for read+write, `useAtomValue` for read-only, `useSetAtom` for write-only.

### Component Rules
- One component per file.
- No inline arrow functions for complex logic — extract to named handlers.
- No `console.log` left in committed code.
- Mock data for demo purposes goes at the top of the page file, above the component.

### Routing
- All authenticated routes are nested inside the `<AppLayout />` protected route in `AppRouter.tsx`.
- Add new page titles to the `pageTitles` map in `AppLayout.tsx`.

---

## Git Conventions

### Branch Naming
```
feature/GH-<issue-number>-<short-description>
e.g. feature/GH-12-leave-request-form
```

### Commit Message Format
```
feat(scope): short description
```

### PR Title Format
```
[GH-XX] Short description of the feature
```

### PR Body Must Include
- Summary (what was added and why)
- Description of UI changes
- Test plan (what was tested)
- Link to the GitHub issue (`Closes #XX`)

---

## Quality Standards

Before raising a PR, all of the following must pass:

- `npm run build` — zero TypeScript errors, zero build errors
- `npm run lint` — zero ESLint violations
- Unit tests — all pass, no skipped tests
- No hardcoded secrets, API keys, or personal data

If any check fails, fix it before proceeding. Do not raise a PR with known failures.

---

## Demo Notes

The following Quick Access cards on the Dashboard are intentionally placeholders — each is a story waiting to be developed:

| Card | Story |
|---|---|
| Leave Request | Add leave request form + balance widget |
| Payslips | Add payslip list with download |
| Team Directory | Add searchable employee directory |
| Documents | Add company document center |

When implementing any of these, remove the `cursor: 'not-allowed'` and `"Coming soon"` chip from the corresponding card in `DashboardPage.tsx` and wire it to the new route.
