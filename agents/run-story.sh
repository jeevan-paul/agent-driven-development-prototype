#!/bin/bash
# run-story.sh
#
# Full end-to-end Agent Driven Development workflow.
# Runs every step sequentially, passing context between agents via temp files.
# The verify step (lint + tests + build) runs agents in parallel internally.
#
# Usage:
#   ./agents/run-story.sh <notion-story-id>
#
# Example:
#   ./agents/run-story.sh abc123def456
#
# Run from the project root.

set -euo pipefail

STORY_ID="${1:-}"

if [ -z "$STORY_ID" ]; then
  echo ""
  echo "Usage:   ./agents/run-story.sh <notion-story-id>"
  echo "Example: ./agents/run-story.sh abc123def456"
  echo ""
  exit 1
fi

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SESSION_DIR="/tmp/add-session-$$"
mkdir -p "$SESSION_DIR"

cd "$PROJECT_ROOT"

# ── Helpers ────────────────────────────────────────────────────────────────────
step() {
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  Step $1 of 6 — $2"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
}

# ── Banner ─────────────────────────────────────────────────────────────────────
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Agent Driven Development — Full Workflow"
echo "  Story: $STORY_ID"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ── Step 1: Fetch story ────────────────────────────────────────────────────────
step 1 "Fetch Story (Notion MCP)"

claude --print "$(cat .claude/commands/fetch-story.md)" "$STORY_ID" \
  | tee "$SESSION_DIR/story.txt"

STORY_CONTEXT=$(cat "$SESSION_DIR/story.txt")

# ── Step 2: Fetch design ───────────────────────────────────────────────────────
step 2 "Fetch Design (Figma MCP)"

claude --print "
Context from previous step:
$STORY_CONTEXT

---

$(cat .claude/commands/fetch-design.md)
" | tee "$SESSION_DIR/design.txt"

DESIGN_CONTEXT=$(cat "$SESSION_DIR/design.txt")

# ── Step 3: Implement feature ──────────────────────────────────────────────────
step 3 "Implement Feature"

claude --print "
Story brief:
$STORY_CONTEXT

Design brief:
$DESIGN_CONTEXT

---

$(cat .claude/commands/frontend.md)
"

# ── Step 4: Write unit tests ───────────────────────────────────────────────────
step 4 "Write Unit Tests"

claude --print "$(cat .claude/commands/unit-test.md)"

# ── Step 5: Verify — parallel lint + tests + build ────────────────────────────
step 5 "Verify — Lint + Tests + Build (parallel)"

bash "$PROJECT_ROOT/agents/verify-all.sh"

# ── Step 6: Raise PR + update Notion ──────────────────────────────────────────
step 6 "Raise Pull Request"

claude --print "
Story brief (for PR body and Notion update):
$STORY_CONTEXT

---

$(cat .claude/commands/raise-pr.md)
"

# ── Cleanup ────────────────────────────────────────────────────────────────────
rm -rf "$SESSION_DIR"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🎉  Story $STORY_ID complete"
echo "      Notion → Ready for Review"
echo "      GitHub → PR raised"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
