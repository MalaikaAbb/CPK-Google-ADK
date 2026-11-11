# Doc drift changelog

What the CopilotKit docs changed under this repo, written by the sync on
`/doc-sync`. Only pages that actually moved are recorded — a sync that finds
everything unchanged writes nothing here at all.

Holds the 3 most recent dated entries. When a change lands on a fourth
date, the oldest entry is dropped. Entries are counted, not aged, so a gap of
weeks between changes does not expire anything.

## 2026-11-11

### 14:09 UTC — 13 pages, highest severity high

**High — Components · Standard catalog**

`/generative-ui/components/standard-catalog` · route `/generative-ui/components/standard-catalog` · under “What is this?” · in a `tsx` block

93 code lines, 24 prose lines changed. The number of fenced code blocks changed.

````diff
- ```tsx
- import { standardUI } from "@copilotkit/react-core/v2/generative-ui";
+ <Tabs groupId="frontend_framework" items={["React", "Angular"]} persist>
+ <Tab value="React">
+ ```tsx
+ import { standardUI } from "@copilotkit/react-core/v2/generative-ui";
- <CopilotKitProvider runtimeUrl="/api/copilotkit" generativeUI={{ ui: standardUI }}>
- ```
````

**High — Copilot Runtime**

`/google-adk/backend/copilot-runtime` · route `/backend/copilot-runtime` · under “The default agent” · in a `ts` block

2 code lines changed.

````diff
- default: new BuiltInAgent({ model: "openai:gpt-4.1" }),
+ default: new BuiltInAgent({ model: "openai:gpt-6-luna" }),
````

**High — A2UI · Dynamic Schema**

`/google-adk/generative-ui/a2ui/dynamic-schema` · route `/generative-ui/a2ui/dynamic-schema` · under “The A2UI agent tool” · in a `python` block

2 code lines changed.

````diff
- "model": ChatOpenAI(model="gpt-4o"),
+ "model": ChatOpenAI(model="gpt-6-luna", reasoning_effort="none"),
````

**High — Components · Catalogs**

`/google-adk/generative-ui/components/catalogs` · route `/generative-ui/components/catalogs` · under “What is this?”

85 code lines, 20 prose lines changed. The number of fenced code blocks changed.

````diff
- A **catalog** lists the components that the agent can use. For each component it holds the React component, a description, and a schema of its props. The agent gets the descriptions and the schemas. Your app gets typed props.
+ A **catalog** lists the components that the agent can use. For each component it holds the component, a description, and a schema of its props. The agent gets the descriptions and the schemas. Your app gets typed props.
- ```tsx title="app/catalog.tsx"
- import { z } from "zod";
- import {
- createGenerativeUI,
- type GenerativeUIComponentProps,
- } from "@copilotkit/react-core/v2/generative-ui";
````

**High — Components · Adopt from A2UI**

`/google-adk/generative-ui/components/from-a2ui` · route `/generative-ui/components/from-a2ui` · under “What is this?”

61 code lines, 21 prose lines changed. The number of fenced code blocks changed.

````diff
- The `a2ui` provider option and `@copilotkit/a2ui-renderer` render A2UI v0.9: you build a catalog with `createCatalog`, and the agent streams a fixed or a generated schema into it. Components and surfaces is the A2UI 1.0 engine. The idea is the same: the agent writes operations, and the browser renders your React components. The engine adds typed catalogs, the [standard catalog](/generative-ui/components/standard-catalog), areas of the page as targets, two transports, dynamic values that compute in the browser, and functions the agent can call. This page maps one to the other.
+ The `a2ui` provider option and `@copilotkit/a2ui-renderer` render A2UI v0.9: you build a catalog with `createCatalog`, and the agent streams a fixed or a generated schema into it. Components and surfaces is the A2UI 1.0 engine. The idea is the same: the agent writes operations, and the browser renders your components. The engine adds typed catalogs, the [standard catalog](/generative-ui/components/standard-catalog), areas of the page as targets, two transports, dynamic values that compute in the browser, and functions the agent can call. This page maps one to the other.
- ```tsx title="Before"
- <CopilotKit runtimeUrl="/api/copilotkit" a2ui={{ catalog: myCatalog }}>
- ```
+ <Tabs groupId="frontend_framework" items={["React", "Angular"]} persist>
+ <Tab value="React">
+ ```tsx title="Before"
````

**High — Components · Markdown mode**

`/google-adk/generative-ui/components/markdown-mode` · route `/generative-ui/components/markdown-mode` · under “What is this?” · in a `markdown` block

45 code lines, 17 prose lines changed. The number of fenced code blocks changed.

````diff
- {"version":"v1.0","createSurface":{"surfaceId":"plan-estimator","dataModel":{"seats":10,"price":"$290 / month"},"components":[{"id":"root","component":"Card","children":["seats","price"]}]}}
- {"version":"v1.0","updateComponents":{"surfaceId":"plan-estimator","components":[{"id":"seats","component":"Slider","label":"Seats","min":1,"max":50,"value":{"@path":"/seats"}},{"id":"price","component":"Text","text":{"@path":"/price"}}]}}
+ {"version":"1.0","createSurface":{"surfaceId":"plan-estimator","dataModel":{"seats":10,"price":"$290 / month"},"components":[{"id":"root","component":"Card","children":["seats","price"]}]}}
+ {"version":"1.0","updateComponents":{"surfaceId":"plan-estimator","components":[{"id":"seats","component":"Slider","label":"Seats","min":1,"max":50,"value":{"@path":"/seats"}},{"id":"price","component":"Text","text":{"@path":"/price"}}]}}
- ```tsx title="app/providers.tsx"
- import { CopilotKitProvider } from "@copilotkit/react-core/v2";
- import { standardUI } from "@copilotkit/react-core/v2/generative-ui";
+ <Tabs groupId="frontend_framework" items={["React", "Angular"]} persist>
````

**High — Components · State and actions**

`/google-adk/generative-ui/components/state-and-actions` · route `/generative-ui/components/state-and-actions` · under “Show live app state” · in a `tsx` block

117 code lines, 18 prose lines changed. The number of fenced code blocks changed.

````diff
- ```tsx title="app/catalog.tsx"
- const cartSchema = z.object({
- items: z.array(z.object({ productId: z.string(), quantity: z.number() })),
- });
+ <Tabs groupId="frontend_framework" items={["React", "Angular"]} persist>
+ <Tab value="React">
+ ```tsx title="app/catalog.tsx"
+ const cartSchema = z.object({
````

**High — Components · Surfaces**

`/google-adk/generative-ui/components/surfaces` · route `/generative-ui/components/surfaces` · under “What is this?”

102 code lines, 31 prose lines changed. The number of fenced code blocks changed.

````diff
- - **A page target.** An area of your page that you mark with `GenerativeUISurface`. The agent sees it only while it is on screen.
+ - **A page target.** An area of your page that you mark with `GenerativeUISurface`, or `<copilot-generative-ui-surface>` in Angular. The agent sees it only while it is on screen.
- Wrap an area of your page in `GenerativeUISurface`. Give it an id, and tell the agent what the area is for:
+ Wrap an area of your page in a target. Give it an id, and tell the agent what the area is for:
- ```tsx title="app/page.tsx"
- import { GenerativeUISurface } from "@copilotkit/react-core/v2/generative-ui";
- import { shopUI } from "./catalog";
+ <Tabs groupId="frontend_framework" items={["React", "Angular"]} persist>
````

**High — Components · Theming**

`/google-adk/generative-ui/components/theming` · route `/generative-ui/components/theming` · under “What is this?” · in a `tsx` block

82 code lines, 21 prose lines changed. The number of fenced code blocks changed.

````diff
- ```tsx
- <CopilotKitProvider
- runtimeUrl="/api/copilotkit"
- generativeUI={{
- ui: standardUI,
- theme: {
- "--a2ui-color-accent": "#d97706",
- "--a2ui-font-family": "Inter, sans-serif",
````

**High — Components · Transports**

`/google-adk/generative-ui/components/transports` · route `/generative-ui/components/transports` · under “Tool transport” · in a `tsx` block

33 code lines, 18 prose lines changed. The number of fenced code blocks changed.

````diff
- ```tsx
- <CopilotKitProvider runtimeUrl="/api/copilotkit" generativeUI={{ ui: standardUI }}>
- ```
+ <Tabs groupId="frontend_framework" items={["React", "Angular"]} persist>
+ <Tab value="React">
+ ```tsx
+ <CopilotKitProvider runtimeUrl="/api/copilotkit" generativeUI={{ ui: standardUI }}>
+ ```
````

**High — MCP Apps**

`/google-adk/generative-ui/mcp-apps` · route `/generative-ui/mcp-apps` · under “MCP Apps with Intelligence” · in a `typescript` block

2 code lines changed.

````diff
- model: "openai/gpt-5.4",
+ model: "openai/gpt-6-luna",
````

**Low — Reasoning Messages**

`/google-adk/custom-look-and-feel/reasoning-messages` · route `/custom-look-and-feel/reasoning-messages` · under “Reasoning Messages”

4 prose lines changed.

````diff
- > Customize how reasoning (thinking) tokens from models like o1, o3, and o4-mini are displayed.
+ > Customize how reasoning (thinking) tokens from models like `gpt-6-luna` are displayed.
- Some models (like OpenAI's o1, o3, and o4-mini) emit **reasoning tokens**: internal
+ Some models (like `gpt-6-luna`) emit **reasoning tokens**: internal
````

**Low — Reasoning**

`/google-adk/generative-ui/reasoning` · route `/generative-ui/reasoning` · under “What is this?”

2 prose lines changed.

````diff
- Some models (OpenAI's `o1`, `o3`, and `o4-mini`, Anthropic's thinking
+ Some models (`gpt-6-luna`, Anthropic's thinking
````

---

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
