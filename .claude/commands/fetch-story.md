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

Figma URL:  <url or "not specified" or "NA">
Status:     <current status — do not change it>
```

This step is fully read-only. Do not update the Notion status here.

## Auto-fetch design

After outputting the story brief, check the **Figma URL** field:

- If a Figma URL is present — immediately run `/fetch-design` using that URL and append the resulting **DESIGN BRIEF** below the story brief. Do not ask the user to run it separately.
- If the Figma URL is `"not specified"` — skip this step and note that no design was found.
