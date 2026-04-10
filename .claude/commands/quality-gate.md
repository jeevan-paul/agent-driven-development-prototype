# Quality Gate

Run the full parallel verification suite — lint, tests, and build — and auto-fix any issues found.

## Steps

1. Run `agents/verify-all.sh` from the project root:

```bash
bash agents/verify-all.sh
```

The script spawns three Claude agents in parallel (lint, tests, build). If all pass, it exits cleanly. If any fail, a fix agent resolves all issues in a single pass and re-runs all three checks to confirm.

2. Do not proceed to `/raise-pr` unless the script exits with:

```
✅  All checks passed — ready for /raise-pr
```

or

```
✅  Verification complete — ready for /raise-pr
```

3. If the fix agent was invoked, list every file it modified before continuing.
