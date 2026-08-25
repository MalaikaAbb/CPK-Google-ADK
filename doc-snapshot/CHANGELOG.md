# Doc drift changelog

What the CopilotKit docs changed under this repo, written by the sync on
`/doc-sync`. Only pages that actually moved are recorded — a sync that finds
everything unchanged writes nothing here at all.

Holds the 3 most recent dated entries. When a change lands on a fourth
date, the oldest entry is dropped. Entries are counted, not aged, so a gap of
weeks between changes does not expire anything.

## 2026-08-21

### 15:51 UTC — 15 pages, highest severity high

**High — Agent Config**

`/google-adk/agent-config` · route `/agent-config` · under “When to use this”

16 code lines, 1 heading, 20 prose lines changed. The number of fenced code blocks changed.

````diff
- <WhenFrameworkHas flag="agent_config_pattern" equals="shared-state">
+ 
- </WhenFrameworkHas>
- <WhenFrameworkHas flag="agent_config_pattern" equals="runtime-properties">
- ## How it works
- The runtime owns the agent in-process, so config travels through frontend
- runtime properties rather than agent state. There's no separate backend service
- to push state into: the typed object becomes the input to the agent factory
````

**High — Copilot Runtime**

`/google-adk/backend/copilot-runtime` · route `/backend/copilot-runtime` · under “Setting up the runtime”

23 code lines, 1 heading, 28 prose lines changed. The number of fenced code blocks changed.

````diff
+ 
+ <Callout type="warn" title="Switching to a v2 handler also switches the transport">
+ The legacy factories are single-route; the v2 handlers are multi-route by
+ default. The `<CopilotKit>` above sets no transport, so it detects the switch
+ on its own — but if you have pinned `useSingleEndpoint={true}` anywhere, drop
+ it or flip it to `{false}` when you move to a v2 handler. See
+ [Provider and handler pairs](/google-adk/backend/runtime-endpoints#provider-and-handler-pairs).
+ </Callout>
````

**High — A2UI · Fixed Schema**

`/google-adk/generative-ui/a2ui/fixed-schema` · route `/generative-ui/a2ui/fixed-schema` · under “Compositional schemas”

39 code lines, 3 headings, 84 prose lines changed. The number of fenced code blocks changed.

````diff
- renderer props are typed as their resolved values (plain `z.string()`,
- not a path-or-literal union).
+ your renderer receives the resolved value and never sees the path — but
+ the *definition* still has to declare that prop as a literal-or-binding
+ union, because that union is the only signal the binder has that the
+ prop is bindable. See [Declare the component
+ definitions](#declare-the-component-definitions).
+ ### Install the renderer package
````

**High — Tool Call Rendering**

`/google-adk/generative-ui/tool-rendering` · route `/generative-ui/tool-rendering` · under “What is this?”

105 code lines, 16 prose lines changed. The number of fenced code blocks changed.

````diff
- **Free course:** See this pattern built end-to-end in [Build Interactive Agents with Generative UI](https://www.deeplearning.ai/short-courses/build-interactive-agents-with-generative-ui/) — a free DeepLearning.AI short course taught by CopilotKit's CEO covering the full Generative UI spectrum (Controlled, Declarative, and Open-Ended).
+ **Free course:** See this pattern built end-to-end in [Build Interactive
+ Agents with Generative
+ UI](https://www.deeplearning.ai/short-courses/build-interactive-agents-with-generative-ui/)
+ — a free DeepLearning.AI short course taught by CopilotKit's CEO covering the
+ full Generative UI spectrum (Controlled, Declarative, and Open-Ended).
- ```typescript
- // src/app/demos/tool-rendering/page.tsx
````

**High — Programmatic Control**

`/google-adk/programmatic-control` · route `/programmatic-control` · under “What is this?”

85 code lines, 1 heading, 26 prose lines changed. The number of fenced code blocks changed.

````diff
- Every example on this page is pulled from two live cells:
- `headless-complete` (full chat surface, shown here for the message-send
- path) and `interrupt-headless` (button-driven interrupt resolver, shown
- here for the subscribe + resume path).
+ The send-and-stop example below is intentionally self-contained. The
+ later subscription and interrupt examples are pulled from the live
+ `interrupt-headless` cell.
- The message-send path in `headless-complete` is the canonical pattern:
````

**High — Render state in your app**

`/google-adk/shared-state/rendering-in-app` · route `/shared-state/rendering-in-app` · under “The pattern” · in a `tsx` block

29 code lines, 6 prose lines changed.

````diff
+ import { useEffect } from "react";
+ const INITIAL_CANVAS_STATE: CanvasState = {
+ title: "Project launch",
+ items: [
+ { id: "research", label: "Research user needs", done: true },
+ { id: "prototype", label: "Build a prototype", done: false },
+ ],
+ };
````

**Medium — Introduction**

`/google-adk` · routes `/`, `/doc-sync` · under “🎉 Start chatting!”

2 headings, 26 prose lines changed.

````diff
+ 
+ <Step>
+ ### Open Inspector and confirm setup
+ 
+ On localhost, click the Inspector button in the corner of the app.
+ 
+ 1. Open **Agents**, then **Agent**. Your agent is listed.
+ 2. Send a chat message. Open **Agents**, then **AG-UI Events**. Events are moving.
````

**Medium — Inspector**

`/google-adk/inspector` · route `/inspector` · under “Pop out”

1 heading, 14 prose lines changed.

````diff
+ ## Pop out
+ 
+ The Inspector sits on top of your app. If it covers the UI you need to see,
+ click the pop-out control in the Inspector header.
+ 
+ A real browser window opens. It shows the same live Inspector session.
+ The app page hides the Inspector and the floating button.
+ 
````

**Medium — Quickstart**

`/google-adk/quickstart` · route `/quickstart` · under “🎉 Start chatting!”

2 headings, 26 prose lines changed.

````diff
+ 
+ <Step>
+ ### Open Inspector and confirm setup
+ 
+ On localhost, click the Inspector button in the corner of the app.
+ 
+ 1. Open **Agents**, then **Agent**. Your agent is listed.
+ 2. Send a chat message. Open **Agents**, then **AG-UI Events**. Events are moving.
````

**Low — Frontend Tools**

`/google-adk/frontend-tools` · route `/frontend-tools` · under “Frontend Tools”

9 prose lines changed.

````diff
+ 
+ 
+ 
+ <Callout type="info" title="See this in Inspector">
+ Open Inspector on localhost. Go to **Agents**, then **Frontend Tools**.
+ Your tool and its schema are listed.
+ 
+ More detail: [Inspector](/google-adk/inspector).
````

**Low — Human in the Loop**

`/google-adk/human-in-the-loop` · route `/human-in-the-loop` · under “HITL Overview”

9 prose lines changed.

````diff
+ 
+ 
+ 
+ <Callout type="info" title="See this in Inspector">
+ Open Inspector on localhost. Go to **Agents**, then **Frontend Tools**.
+ Your tool and its schema are listed.
+ 
+ More detail: [Inspector](/google-adk/inspector).
````

**Low — Open, close, and feedback**

`/google-adk/prebuilt-components/chat-controls` · route `/prebuilt-components/chat-controls` · under “Capture message feedback (thumbs up / down)”

11 prose lines changed.

````diff
- slot**. The buttons only render when a handler is provided:
+ When the slot is rendered through `CopilotChatMessageView`, a live assistant
+ message created by a direct AG-UI `TEXT_MESSAGE_START` can also include that
+ event's opaque `rawEvent` value. The join happens when the thumbs callback runs;
+ canonical messages and future run input stay unchanged. Chunk, snapshot,
+ persisted, legacy, and direct `CopilotChatAssistantMessage` paths don't provide
+ this callback metadata.
+ 
````

**Low — Shared State**

`/google-adk/shared-state` · route `/shared-state` · under “What is shared state?”

8 prose lines changed.

````diff
+ 
+ <Callout type="info" title="See this in Inspector">
+ Open Inspector on localhost. Open a thread, then click **State**.
+ Agent state updates here as the run proceeds.
+ 
+ More detail: [Inspector](/google-adk/inspector).
+ </Callout>
+ 
````

**Low — Agent Read-Only Context**

`/google-adk/shared-state/agent-readonly` · route `/shared-state/agent-readonly` · under “Agent Read-Only Context”

9 prose lines changed.

````diff
+ 
+ 
+ 
+ <Callout type="info" title="See this in Inspector">
+ Open Inspector on localhost. Go to **Agents**, then **Context**.
+ The values you publish with `useAgentContext` appear here.
+ 
+ More detail: [Inspector](/google-adk/inspector).
````

**Low — Voice**

`/google-adk/voice` · route `/voice` · under “Next.js API route”

4 prose lines changed.

````diff
- <WhenFrameworkHas flag="voice_backend_pattern" equals="adk-fastapi-agent-path">
+ 
- </WhenFrameworkHas>
+ 
````

---

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
