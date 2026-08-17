# Doc drift changelog

What the CopilotKit docs changed under this repo, written by the sync on
`/doc-sync`. Only pages that actually moved are recorded — a sync that finds
everything unchanged writes nothing here at all.

Holds the 3 most recent dated entries. When a change lands on a fourth
date, the oldest entry is dropped. Entries are counted, not aged, so a gap of
weeks between changes does not expire anything.

## 2026-08-17

### 13:32 UTC — 1 page, highest severity low

**Low — A2UI · Fixed Schema** · _local snapshot edit, not an upstream change_

`/google-adk/generative-ui/a2ui/fixed-schema` · route `/generative-ui/a2ui/fixed-schema` · under “Fixed Schema A2UI”

5 prose lines changed.

````diff
+ doesn't ship a `load_schema` JSON loader, so the structure is
+ compiled in directly.
+ - **LLM-driven** (mastra, strands), the agent runs a secondary LLM
+ call to produce the operations container per-request. The catalog
+ is still fixed; the schema is generated on demand.
````
