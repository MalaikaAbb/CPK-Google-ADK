# Doc drift changelog

What the CopilotKit docs changed under this repo, written by the sync on
`/doc-sync`. Only pages that actually moved are recorded — a sync that finds
everything unchanged writes nothing here at all.

Holds the 3 most recent dated entries. When a change lands on a fourth
date, the oldest entry is dropped. Entries are counted, not aged, so a gap of
weeks between changes does not expire anything.

## 2026-09-29

### 08:11 UTC — 1 page, highest severity medium

**Medium — Inspector**

`/google-adk/inspector` · route `/inspector` · under “What's New”

1 heading, 24 prose lines changed.

````diff
+ ## What's New
+ 
+ What's New lists updates that match your stable frontend SDK version and confirmed
+ runtime configuration. A single preview beside the launcher highlights an update.
+ Read it or close its preview to quiet the updates already available to you. They remain
+ in What's New for later reading. Reading a different update does not dismiss the highlight.
+ 
+ New updates can show a preview later. Copy edits to an update you already read stay quiet.
````

---

## 2026-09-28

### 09:52 UTC — 6 pages, highest severity none

**Info — Agent App Context**

`/google-adk/agent-app-context` · route `/agent-app-context`

Now tracked for the first time.

**Info — Markdown Rendering**

`/google-adk/custom-look-and-feel/markdown` · route `/custom-look-and-feel/markdown`

Now tracked for the first time.

**Info — Hashbrown**

`/google-adk/generative-ui/hashbrown` · route `/generative-ui/hashbrown`

Now tracked for the first time.

**Info — JSON Render**

`/google-adk/generative-ui/json-render` · route `/generative-ui/json-render`

Now tracked for the first time.

**Info — Open Generative UI**

`/google-adk/generative-ui/open-generative-ui` · route `/generative-ui/open-generative-ui`

Now tracked for the first time.

**Info — Governed Action Approval UI**

`/google-adk/human-in-the-loop/governed-actions` · route `/human-in-the-loop/governed-actions`

Now tracked for the first time.

---

---

## 2026-09-24

### 11:54 UTC — 1 page, highest severity low

**Low — A2UI · Fixed Schema**

`/google-adk/generative-ui/a2ui/fixed-schema` · route `/generative-ui/a2ui/fixed-schema` · under “Fixed Schema A2UI”

35 prose lines changed.

````diff
- - **Schema-loading** (langgraph-python, langgraph-typescript,
- langgraph-fastapi, llamaindex, crewai-crews, pydantic-ai,
- ms-agent-python, google-adk), the schema is saved as a `.json`
- file next to the agent and loaded once at startup.
+ - **Schema-loading** (including Strands TypeScript), the schema is saved
+ as a `.json` file next to the agent and loaded once at startup.
- - **LLM-driven** (mastra, strands), the agent runs a secondary LLM
- call to produce the operations container per-request. The catalog
````

---

---
