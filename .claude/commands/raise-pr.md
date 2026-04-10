# Raise Pull Request

Commit all changes, push to GitHub, open a pull request, then update the Notion story status.

## Step 1 — Final quality gate

Before committing, verify all three checks pass:

```bash
npm run build   # must be zero errors
npm run lint    # must be zero violations
npm test        # must be zero failures
```

If any check fails, stop and fix the issues before continuing.

## Step 2 — Confirm branch

Check the current branch. It must follow the naming convention:

```
feature/<story-id>-<short-description>
e.g. feature/PD-12-leave-request-form
```

If not on a correctly named feature branch, create one:

```bash
git checkout -b feature/<story-id>-<short-description>
```

## Step 3 — Commit

Stage only the files changed for this story (do not use `git add -A` blindly):

```bash
git add <list each changed file>
git commit -m "feat(<scope>): <short description>

- <key change>
- <key change>

Story: <story title>"
```

## Step 4 — Push

```bash
git push -u origin <branch-name>
```

## Step 5 — Open pull request

Use `gh` CLI to create the PR:

```bash
gh pr create \
  --title "[<story-id>] <feature description>" \
  --body "$(cat <<'EOF'
## Summary
<what was added and why — 2-3 sentences>

## Changes
- <key change>
- <key change>

## UI Changes
<describe the new UI — what page/component was added, what it looks like>

## Test Plan
- [ ] Page renders correctly
- [ ] Key interactions work as expected
- [ ] No console errors
- [ ] Build passes (`npm run build`)
- [ ] Lint passes (`npm run lint`)
- [ ] Tests pass (`npm test`)

## Story
<Notion story URL>
EOF
)"
```

## Step 6 — Update Notion status

Use the Notion MCP to update the story's **Status** property from `In Progress` to `Ready for Review`.

Confirm the update succeeded, then output the PR URL.
