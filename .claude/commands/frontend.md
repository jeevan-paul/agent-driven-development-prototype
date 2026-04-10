# Frontend Implementation

Implement the feature described in the story brief and design brief from the previous steps.

Follow all conventions in CLAUDE.md exactly. Do not deviate from the existing codebase patterns.

## Step 0 — Mark story In Progress + checkout feature branch (mandatory, before any code changes)

### 0a — Update Notion status to In Progress

Using the Notion MCP, update the story's **Status** property from `To Do` to `In Progress`.
Use the Notion Page ID from the story brief. Confirm the update succeeded before continuing.

### 0b — Checkout feature branch

Check the current git branch:

```bash
git branch --show-current
```

If already on the correct feature branch (e.g. `feature/STORY-123-...`), continue.

If on `main`, `master`, or any other branch, create and checkout the feature branch now using the `Branch` value from the story brief:

```bash
git checkout -b feature/<story-id>-<short-slug>
# e.g. git checkout -b feature/STORY-123-leave-request-form
```

Do not write a single line of code until you are on the feature branch.

## Pre-implementation checklist

- [ ] Confirmed on feature branch (not main)
- [ ] Re-read the story brief (acceptance criteria must all be met)
- [ ] Re-read the design brief (match layout, colors, and typography)
- [ ] Identify which files need to be created or modified
- [ ] Plan the component structure before writing any code

## Files to create / modify (as applicable)

| File | When |
|---|---|
| `src/pages/<FeatureName>Page.tsx` | Every new page/route |
| `src/components/common/<Name>.tsx` | Reusable components used in 2+ places |
| `src/atoms/<feature>Atom.ts` | If new global or feature state is needed |
| `src/routes/AppRouter.tsx` | Add the new route |
| `src/components/layout/Sidebar.tsx` | Add entry to `navItems` array |
| `src/components/layout/AppLayout.tsx` | Add page title to `pageTitles` map |
| `src/pages/DashboardPage.tsx` | Remove `cursor: 'not-allowed'` and "Coming soon" chip from the matching Quick Access card |

## MUI v9 — mandatory rules

- **No `fontWeight` prop on `<Typography>`** — always `sx={{ fontWeight: ... }}`
- **No `InputProps` on `<TextField>`** — always `slotProps={{ input: { ... } }}`
- **No `primaryTypographyProps` on `<ListItemText>`** — always `slotProps={{ primary: { ... } }}`
- All styles via `sx` — no new CSS files

## Code quality checklist

- [ ] No `console.log` statements
- [ ] All component props typed — no `any`
- [ ] Mock/demo data defined at the top of the file, above the component
- [ ] One component per file
- [ ] No inline arrow functions for complex logic — extract to named handlers

## After implementation

List every file that was created or modified with a one-line description of the change.
