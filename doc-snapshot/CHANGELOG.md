# Doc drift changelog

What the CopilotKit docs changed under this repo, written by the sync on
`/doc-sync`. Only pages that actually moved are recorded — a sync that finds
everything unchanged writes nothing here at all.

Holds the 3 most recent dated entries. When a change lands on a fourth
date, the oldest entry is dropped. Entries are counted, not aged, so a gap of
weeks between changes does not expire anything.

## 2026-11-03

### 15:33 UTC — 11 pages, highest severity high

**High — Sub-Agents**

`/google-adk/multi-agent/subagents` · route `/multi-agent/subagents` · under “Add `AGUIToolset()` to your supervisor agent” · in a `python` block

2 code lines changed.

````diff
- # @region[supervisor-delegation-tools]
- # @endregion[supervisor-delegation-tools]
````

**Info — Components · Standard catalog**

`/generative-ui/components/standard-catalog` · route `/generative-ui/components/standard-catalog`

Now tracked for the first time.

**Info — Components · Catalogs**

`/google-adk/generative-ui/components/catalogs` · route `/generative-ui/components/catalogs`

Now tracked for the first time.

**Info — Components · Adopt from A2UI**

`/google-adk/generative-ui/components/from-a2ui` · route `/generative-ui/components/from-a2ui`

Now tracked for the first time.

**Info — Components · Markdown mode**

`/google-adk/generative-ui/components/markdown-mode` · route `/generative-ui/components/markdown-mode`

Now tracked for the first time.

**Info — Components · State and actions**

`/google-adk/generative-ui/components/state-and-actions` · route `/generative-ui/components/state-and-actions`

Now tracked for the first time.

**Info — Components · Surfaces**

`/google-adk/generative-ui/components/surfaces` · route `/generative-ui/components/surfaces`

Now tracked for the first time.

**Info — Components · Theming**

`/google-adk/generative-ui/components/theming` · route `/generative-ui/components/theming`

Now tracked for the first time.

**Info — Components · Transports**

`/google-adk/generative-ui/components/transports` · route `/generative-ui/components/transports`

Now tracked for the first time.

**Info — MCP Apps**

`/google-adk/generative-ui/mcp-apps` · route `/generative-ui/mcp-apps`

Now tracked for the first time.

**Info — WebMCP**

`/google-adk/webmcp` · route `/webmcp`

Now tracked for the first time.

---

## 2026-11-02

### 12:43 UTC — 18 pages, highest severity high

**High — Introduction**

`/google-adk` · routes `/`, `/doc-sync` · under “Configure your environment”

2 code lines, 2 prose lines changed.

````diff
- This example uses Gemini 2.5 Flash, but you can modify it to use any language model supported by ADK.
+ This example uses Gemini 3.8 Flash, but you can modify it to use any language model supported by ADK.
- model="gemini-2.5-flash",
+ model="gemini-3.8-flash",
````

**High — Agent App Context**

`/google-adk/agent-app-context` · route `/agent-app-context` · under “Read the context in your ADK agent” · in a `python` block

2 code lines changed.

````diff
- model="gemini-2.5-flash",
+ model="gemini-3.8-flash",
````

**High — Slots**

`/google-adk/custom-look-and-feel/slots` · route `/custom-look-and-feel/slots` · under “Tool calls”

23 code lines, 1 heading, 15 prose lines changed. The number of fenced code blocks changed.

````diff
+ ### Tool calls
+ 
+ The `assistantMessage` slot holds `toolCallsView`, which renders the tool calls
+ of one assistant message. Wrap the default `CopilotChatToolCallsView` to change
+ the container while keeping your registered tool renderers:
+ 
+ ```tsx title="page.tsx"
+ import {
````

**High — Hashbrown**

`/google-adk/generative-ui/hashbrown` · route `/generative-ui/hashbrown` · under “Hashbrown”

36 code lines, 2 headings, 11 prose lines changed. The number of fenced code blocks changed.

````diff
- > Bring your own component library. Have the agent stream structured output and let Hashbrown's progressive JSON parser render it as React components in real time.
+ > Stream a structured sales dashboard through Hashbrown's UI kit and progressive JSON parser.
- 
- You have a chat surface and you want the agent to draw a dashboard, not just describe one in prose. By the end of this guide, the agent will stream a structured output object, [`@hashbrownai/react`](https://www.npmjs.com/package/@hashbrownai/react)'s progressive JSON parser will hand each finished slice to your renderer as it arrives, and the user sees the dashboard fill in live.
- 
- ## When to use this
- 
- - **Streaming dashboards** where partial state should render before the full payload arrives.
````

**High — JSON Render**

`/google-adk/generative-ui/json-render` · route `/generative-ui/json-render` · under “JSON Render”

53 code lines, 2 headings, 11 prose lines changed. The number of fenced code blocks changed.

````diff
- > Bring your own component library. Have the agent emit a JSON spec and let json-render render it against a Zod-validated catalog of React components.
+ > Bring your own component library. Have the agent emit a JSON spec and render allowed component types through a typed React registry.
- 
- You have a chat surface and you want the agent to draw a dashboard from a typed JSON spec. By the end of this guide, the agent will emit a `{ root, elements }` object, [`@json-render/react`](https://www.npmjs.com/package/@json-render/react) will validate it against a Zod-described catalog, and the user sees the dashboard render as a single React tree.
+ ```typescript
+ // src/app/demos/declarative-json-render/chat.tsx
+ "use client";
- ## When to use this
````

**High — Tool Call Rendering**

`/google-adk/generative-ui/tool-rendering` · route `/generative-ui/tool-rendering` · under “Default tool rendering (zero-config)”

15 code lines, 1 heading, 35 prose lines changed. The number of fenced code blocks changed.

````diff
- any UI.
+ any UI. Calls the agent makes in a row are grouped into one card; see
+ [Grouping tool calls](#grouping-tool-calls).
+ 
+ ## Grouping tool calls
+ 
+ Agents often call several tools in a row. By default, CopilotKit collapses
+ each run of calls drawn by the built-in card from `useDefaultRenderTool()` into
````

**High — Threads Drawer**

`/google-adk/prebuilt-components/copilot-threads-drawer` · route `/prebuilt-components/copilot-threads-drawer` · under “Add your own "New conversation" button”

41 code lines, 1 heading, 19 prose lines changed. The number of fenced code blocks changed.

````diff
+ ## Add your own "New conversation" button
+ 
+ The Drawer has its own "New Conversation" row. Your app can also keep its own
+ button, for example in a toolbar or a page header. To start a new conversation
+ from that button, call `startNewThread()` from
+ [`useCopilotChatConfiguration`](/reference/hooks/useCopilotChatConfiguration).
+ This is the same function the Drawer calls for its own row.
+ 
````

**High — Quickstart**

`/google-adk/quickstart` · route `/quickstart` · under “Configure your environment”

2 code lines, 2 prose lines changed.

````diff
- This example uses Gemini 2.5 Flash, but you can modify it to use any language model supported by ADK.
+ This example uses Gemini 3.8 Flash, but you can modify it to use any language model supported by ADK.
- model="gemini-2.5-flash",
+ model="gemini-3.8-flash",
````

**High — Reading agent state**

`/google-adk/shared-state/in-app-agent-read` · route `/shared-state/in-app-agent-read` · under “Define the Agent State” · in a `python` block

2 code lines changed.

````diff
- model="gemini-2.5-flash",
+ model="gemini-3.8-flash",
````

**High — Writing agent state**

`/google-adk/shared-state/in-app-agent-write` · route `/shared-state/in-app-agent-write` · under “Define the Agent State” · in a `python` block

2 code lines changed.

````diff
- model="gemini-2.5-flash",
+ model="gemini-3.8-flash",
````

**High — Predictive state updates**

`/google-adk/shared-state/predictive-state-updates` · route `/shared-state/predictive-state-updates` · under “Emit the intermediate state” · in a `python` block

2 code lines changed.

````diff
- model="gemini-2.5-flash",
+ model="gemini-3.8-flash",
````

**High — Workflow Execution**

`/google-adk/shared-state/workflow-execution` · route `/shared-state/workflow-execution` · under “Organize state by purpose” · in a `python` block

2 code lines changed.

````diff
- model="gemini-2.5-flash",
+ model="gemini-3.8-flash",
````

**High — Voice**

`/google-adk/voice` · route `/voice` · under “Next.js API route” · in a `typescript` block

101 code lines, 18 prose lines changed.

````diff
- TranscriptionService,
- import type { TranscribeFileOptions } from "@copilotkit/runtime/v2";
- import { TranscriptionServiceOpenAI } from "@copilotkit/voice";
- import OpenAI from "openai";
+ import { createTranscriptionService } from "@/lib/transcription-service";
- /**
- * Transcription service wrapper that pins `baseURL` to real OpenAI (or
- * `OPENAI_TRANSCRIPTION_BASE_URL` when explicitly set) instead of falling
````

**Low — Copilot Runtime**

`/google-adk/backend/copilot-runtime` · route `/backend/copilot-runtime` · under “CopilotKit Intelligence”

2 prose lines changed.

````diff
- [Threads](/google-adk/threads), the [inspector](/google-adk/inspector), and other CopilotKit Intelligence capabilities are provided through the runtime. These give you conversation persistence and debugging without extra setup.
+ [Threads](/google-adk/AG-UI-Streams), the [inspector](/google-adk/inspector), and other CopilotKit Intelligence capabilities are provided through the runtime. These give you conversation persistence and debugging without extra setup.
````

**Low — Reasoning Messages**

`/google-adk/custom-look-and-feel/reasoning-messages` · route `/custom-look-and-feel/reasoning-messages` · under “Custom Header”

3 prose lines changed.

````diff
- | `label` | `string` | `"Thinking…"` while streaming, `"Thought for X seconds"` after |
+ | `label` | `string` | `labels.reasoningMessageThinkingLabel` (`"Thinking…"`) while streaming, `"Thought for X seconds"` after |
+ | `elapsedSeconds` | `number` | Seconds spent reasoning, for building a localized label |
````

**Low — Open Generative UI**

`/google-adk/generative-ui/open-generative-ui` · route `/generative-ui/open-generative-ui` · under “Minimal setup”

24 prose lines changed.

````diff
- auto-registered by `CopilotKit`, so no extra wiring is needed.
+ auto-registered by `CopilotKit`, so no extra frontend wiring is needed. Your
+ agent must still give the run's frontend tools to its model (see the warning
+ below).
+ 
+ <Callout type="warn" title="Your agent must pass frontend tools to its model">
+ `generateSandboxedUi` reaches the agent as a frontend tool in the run input.
+ The agent calls it only if it gives the run's frontend tools to its model.
````

**Low — Inspector**

`/google-adk/inspector` · route `/inspector` · under “Follow a run from input to result”

34 prose lines changed.

````diff
- | Question                                      | Open                                                                | Related guide                                              |
- | --------------------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------- |
- | Which agent ran, and what did it do?          | **Agent**                                                           | [Agent configuration](/google-adk/agent-config)                       |
- | Which events crossed the AG-UI connection?    | **AG-UI Events**                                                    | [AG-UI protocol](/google-adk/agentic-protocols/ag-ui)                 |
- | Which browser-side tools are registered?      | **Frontend Tools**                                                  | [Frontend Tools](/google-adk/frontend-tools)                          |
- | What readable or document context was shared? | **Context**                                                         | [Agent read-only context](/google-adk/shared-state/agent-readonly)    |
- | What did a saved conversation contain?        | **Rich Threads** → **Conversation**, **AG-UI Events**, or **State** | [AG-UI Streams](/google-adk/threads) and [Shared State](/google-adk/shared-state) |
+ | Question                                                    | Open                                                                | Related guide                                               |
````

**Low — Open, close, and feedback**

`/google-adk/prebuilt-components/chat-controls` · route `/prebuilt-components/chat-controls` · under “Capture message feedback (thumbs up / down)”

12 prose lines changed.

````diff
- slot**. The buttons only render when a handler is provided:
+ slot**. Without Automatic Learning capture, the buttons only render when a
+ handler or a custom thumb slot is provided:
+ 
+ With [Automatic Learning capture](/google-adk/intelligence/capture-interactions#collect-reply-ratings)
+ on and a Trajectory started, the buttons appear without handlers in every chat
+ that renders messages with `CopilotChatMessageView` inside a
+ `CopilotChatConfigurationProvider`, as `CopilotChat`, `CopilotPopup`, and
````

---

---

## 2026-10-08

### 11:27 UTC — 5 pages, highest severity high

**High — Introduction**

`/google-adk` · routes `/`, `/doc-sync` · under “Install CopilotKit packages” · in a `npm` block

2 code lines changed.

````diff
- npm install @copilotkit/react-ui @copilotkit/react-core @copilotkit/runtime @ag-ui/client@1.0.1
+ npm install @copilotkit/react-ui @copilotkit/react-core @copilotkit/runtime @ag-ui/client@1.0.2
````

**High — Quickstart**

`/google-adk/quickstart` · route `/quickstart` · under “Install CopilotKit packages” · in a `npm` block

2 code lines changed.

````diff
- npm install @copilotkit/react-ui @copilotkit/react-core @copilotkit/runtime @ag-ui/client@1.0.1
+ npm install @copilotkit/react-ui @copilotkit/react-core @copilotkit/runtime @ag-ui/client@1.0.2
````

**Medium — Thread & History Lifecycle**

`/google-adk/threads-lifecycle` · route `/threads-lifecycle` · under “Future runs can remain durable in both places”

1 heading, 7 prose lines changed.

````diff
- After historical import, future conversations that run through CopilotKit are
- written to CopilotKit Intelligence as threads. If your LangGraph agent
+ Once Intelligence is connected, conversations that run through that runtime are
+ recorded automatically in Intelligence. Historical import is optional. If your LangGraph agent
+ 
+ ## Example: keep an existing LangGraph conversation
+ 
+ Follow [Bring your own thread system](/google-adk/intelligence/bring-your-own-thread-system#example-keep-an-existing-langgraph-conversation) for an example that keeps native persistence and continues the same conversation.
````

**Low — Copilot Runtime**

`/google-adk/backend/copilot-runtime` · route `/backend/copilot-runtime` · under “mcpApps”

2 prose lines changed.

````diff
- Per-tool filtering belongs to `@ag-ui/mcp-apps-middleware`. The runtime currently pins version `0.0.3`, which does not support `includeTools` or `excludeTools`. Supplying either key raises a configuration error instead of silently ignoring it; use a compatible middleware release when that upstream policy contract is available.
+ Per-tool filtering belongs to `@ag-ui/mcp-apps-middleware`. The release the runtime depends on does not support `includeTools` or `excludeTools`. Supplying either key raises a configuration error instead of silently ignoring it. A newer middleware release alone does not change this: the runtime has to adopt the policy first. Follow [#5930](https://github.com/CopilotKit/CopilotKit/issues/5930) for that work.
````

**Low — Programmatic Control**

`/google-adk/programmatic-control` · route `/programmatic-control` · under “What is this?”

4 prose lines changed.

````diff
- - `agent.subscribe(subscriber)` — low-level AG-UI event subscription (`onCustomEvent`, `onRunStartedEvent`, `onRunFinalized`, `onRunFailed`, …). Pairs with `copilotkit.runAgent({ agent, forwardedProps: { command: { resume, interruptEvent } } })` to drive interrupt resolution from arbitrary UI.
+ - `agent.subscribe(subscriber)` — low-level AG-UI event subscription (`onCustomEvent`, `onRunStartedEvent`, `onRunFinalized`, `onRunFailed`, …). Pairs with `copilotkit.runAgent({ agent, resume })` for standard AG-UI interrupts, or `copilotkit.runAgent({ agent, forwardedProps: { command: { resume, interruptEvent } } })` for legacy `on_interrupt` custom events, to drive interrupt resolution from arbitrary UI.
- - **`agent.runAgent(options)`** — low-level method on the agent instance. Sends the request to the runtime but does **not** execute frontend tools or chain follow-ups. Reach for this only when you need direct control. (For the interrupt-resume case, use `copilotkit.runAgent({ agent, forwardedProps: { command: { resume, interruptEvent } } })` — see the snippet below — so the subscriber lifecycle still wraps the resumed run.)
+ - **`agent.runAgent(options)`** — low-level method on the agent instance. Sends the request to the runtime but does **not** execute frontend tools or chain follow-ups. Reach for this only when you need direct control. (For the interrupt-resume case, use `copilotkit.runAgent({ agent, resume })` for standard AG-UI interrupts, or `copilotkit.runAgent({ agent, forwardedProps: { command: { resume, interruptEvent } } })` for legacy `on_interrupt` custom events — the snippet below shows the legacy form — so the subscriber lifecycle still wraps the resumed run.)
````

---

---
