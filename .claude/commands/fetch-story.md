# Fetch Story

Fetch the Notion story with ID or URL: $ARGUMENTS

## Steps

1. Use the Notion MCP to retrieve the page with the given ID
2. Extract:
   - Story title
   - **Story ID** — the dedicated `Story ID` field in Notion (format: `STORY-123`)
   - Description / background
   - Acceptance criteria
   - Any linked Figma design URL
   - Current status
3. Output a structured story brief for use in subsequent steps:

```
STORY BRIEF
===========
Notion Page ID: <notion page id>
Story ID:       <STORY-123 from the Story ID field>
Branch:         feature/<story-id>-<2-4 word slug of title, lowercase, hyphenated>
Title:          <title>
Description:
  <description>

Acceptance Criteria:
  - <criterion 1>
  - <criterion 2>

Figma URL:  <url or "not specified">
Status:     <current status — do not change it>
```

This step is fully read-only. Do not update the Notion status here.
