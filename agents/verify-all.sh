#!/bin/bash
# verify-all.sh
#
# Runs lint, tests, and build in PARALLEL using three separate Claude instances.
# Once all three complete, a single fix agent resolves every issue in one pass.
#
# Usage:
#   ./agents/verify-all.sh
#
# Run from the project root.

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SESSION_DIR="/tmp/add-verify-$$"
mkdir -p "$SESSION_DIR"

cd "$PROJECT_ROOT"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Agent Driven Development — Parallel Verification"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "▶  Spawning 3 check agents in parallel..."
echo ""

# ── Agent 1: Lint ──────────────────────────────────────────────────────────────
claude --print "
Run 'npm run lint' in the current project directory.
List every ESLint violation in this exact format:

FILE: <relative path>
LINE: <line number>
RULE: <rule name>
MSG:  <message>
---

Do NOT fix anything. Report findings only.
If there are no violations output exactly: NO_LINT_ISSUES
" > "$SESSION_DIR/lint.txt" 2>&1 &
LINT_PID=$!
echo "  [1] Lint agent    — PID $LINT_PID"

# ── Agent 2: Tests ─────────────────────────────────────────────────────────────
claude --print "
Run 'npm test -- --passWithNoTests' in the current project directory.
List every test failure in this exact format:

TEST:  <test name>
FILE:  <file path>
ERROR: <error message>
---

Do NOT fix anything. Report findings only.
If all tests pass output exactly: NO_TEST_FAILURES
" > "$SESSION_DIR/tests.txt" 2>&1 &
TEST_PID=$!
echo "  [2] Test agent    — PID $TEST_PID"

# ── Agent 3: Build ─────────────────────────────────────────────────────────────
claude --print "
Run 'npm run build' in the current project directory.
List every TypeScript and build error in this exact format:

FILE:  <relative path>
LINE:  <line number>
ERROR: <message>
---

Do NOT fix anything. Report findings only.
If the build passes cleanly output exactly: NO_BUILD_ERRORS
" > "$SESSION_DIR/build.txt" 2>&1 &
BUILD_PID=$!
echo "  [3] Build agent   — PID $BUILD_PID"

echo ""
echo "⏳  Waiting for all agents to complete..."
wait $LINT_PID $TEST_PID $BUILD_PID
echo "✓   All agents done."
echo ""

# ── Display results ────────────────────────────────────────────────────────────
LINT_REPORT=$(cat "$SESSION_DIR/lint.txt")
TEST_REPORT=$(cat "$SESSION_DIR/tests.txt")
BUILD_REPORT=$(cat "$SESSION_DIR/build.txt")

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━  LINT  ━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "$LINT_REPORT"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━  TESTS ━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "$TEST_REPORT"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━  BUILD ━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "$BUILD_REPORT"
echo ""

# ── All clear? ─────────────────────────────────────────────────────────────────
if echo "$LINT_REPORT"  | grep -q "NO_LINT_ISSUES"   && \
   echo "$TEST_REPORT"  | grep -q "NO_TEST_FAILURES"  && \
   echo "$BUILD_REPORT" | grep -q "NO_BUILD_ERRORS"; then
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  ✅  All checks passed — ready for /raise-pr"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  rm -rf "$SESSION_DIR"
  exit 0
fi

# ── Fix agent — single pass over all issues ────────────────────────────────────
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🔧  Issues found — spawning fix agent..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

claude --print "
Fix ALL of the following issues found across lint, tests, and build.
Fix everything in a single pass — do not fix one category and leave others.

After fixing, run all three checks to confirm they pass:
  npm run lint
  npm test -- --passWithNoTests
  npm run build

═══════════════════════════════
LINT VIOLATIONS
═══════════════════════════════
$LINT_REPORT

═══════════════════════════════
TEST FAILURES
═══════════════════════════════
$TEST_REPORT

═══════════════════════════════
BUILD ERRORS
═══════════════════════════════
$BUILD_REPORT

Output a summary of every fix applied and confirm all three checks pass.
"

rm -rf "$SESSION_DIR"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅  Verification complete — ready for /raise-pr"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
