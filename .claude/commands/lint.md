# Lint Check

Run ESLint across the project and report all violations found.

```bash
npm run lint
```

List every violation in this format:

```
FILE: <relative file path>
LINE: <line number>
RULE: <eslint rule name>
MSG:  <message>
---
```

Do NOT fix anything. Output the findings only.

If there are no violations, output: `✓ No lint violations found.`
