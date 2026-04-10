# Fetch Design

Retrieve the Figma design for the current story.

Use the Figma URL from the story brief. If no URL was found in the story, ask for it before proceeding.

## Steps

1. Use the Figma MCP to fetch the design file or specific frame/component at the given URL
2. Extract and document:
   - Component structure and layout (what sections, cards, lists exist)
   - Typography (font sizes, weights used)
   - Color values (reference brand tokens where possible: `#081757` navy, `#085ED7` blue)
   - Spacing and sizing
   - Interactive states if shown (hover, error, empty state)
   - Icons referenced
3. Output a design brief for use in the frontend step:

```
DESIGN BRIEF
============
Layout:
  <describe overall page/component layout>

Components:
  - <component name>: <description>

Colors:
  - <element>: <hex value>

Typography:
  - <element>: <size / weight>

Spacing:
  - <notes on padding, gaps, margins>

Icons:
  - <icon name / description>

Notes:
  <anything unusual or important for implementation>
```

Do not begin any code changes. This step is read-only.
