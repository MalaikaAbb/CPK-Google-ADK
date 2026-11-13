# Doc drift changelog

What the CopilotKit docs changed under this repo, written by the sync on
`/doc-sync`. Only pages that actually moved are recorded — a sync that finds
everything unchanged writes nothing here at all.

Holds the 3 most recent dated entries. When a change lands on a fourth
date, the oldest entry is dropped. Entries are counted, not aged, so a gap of
weeks between changes does not expire anything.

## 2026-11-13

### 11:10 UTC — 18 pages, highest severity high

**High — A2UI · Dynamic Schema**

`/google-adk/generative-ui/a2ui/dynamic-schema` · route `/generative-ui/a2ui/dynamic-schema` · under “Declare your custom component definitions” · in a `typescript` block

54 code lines changed.

````diff
+ // Keep `children` first. A2UI Express maps positional arguments in
+ // property order, so `Row([...], gap=16)` must bind the list to it.
+ children: z
+ .array(z.string())
+ .describe("REF:common_types.json#/$defs/ChildList"),
- children: z.array(z.string()),
+ // Keep `children` first. A2UI Express maps positional arguments in
+ // property order, so `Column([...], gap=16)` must bind the list to it.
````

**High — A2UI · Fixed Schema**

`/google-adk/generative-ui/a2ui/fixed-schema` · route `/generative-ui/a2ui/fixed-schema` · under “Declare the component definitions” · in a `typescript` block

83 code lines changed.

````diff
- const DynString = z.union([z.string(), z.object({ path: z.string() })]);
+ const DynString = z
+ .union([z.string(), z.object({ path: z.string() })])
+ .describe("REF:common_types.json#/$defs/DynamicString");
- child: z.string(),
+ child: z.string().describe("REF:common_types.json#/$defs/ComponentId"),
- "The ID of the child component (e.g. a Text component for the label).",
+ "REF:common_types.json#/$defs/ComponentId|The ID of the child component for the label.",
````

**High — Components · Catalogs**

`/google-adk/generative-ui/components/catalogs` · route `/generative-ui/components/catalogs` · under “Create a catalog”

128 code lines, 43 prose lines changed. The number of fenced code blocks changed.

````diff
- <Tabs groupId="frontend_framework" items={["React", "Angular"]} persist>
+ <Tabs groupId="frontend_framework" items={["React", "Angular", "React Native", "Vue"]} persist>
+ <Tab value="React Native">
+ A component of the catalog is a React Native component. It renders native views, and a slot arrives as React nodes:
+ 
+ ```tsx title="src/shopUI.tsx"
+ import { Image, StyleSheet, Text, View } from "react-native";
+ import { z } from "zod";
````

**High — Components · Adopt from A2UI**

`/google-adk/generative-ui/components/from-a2ui` · route `/generative-ui/components/from-a2ui` · under “Adopt from A2UI”

49 code lines, 1 heading, 35 prose lines changed. The number of fenced code blocks changed.

````diff
- > Move an app from the a2ui renderer (A2UI v0.9) to components and surfaces (A2UI 1.0): the provider, the catalog, the operations, and what the agent receives.
+ > Move an app from the a2ui renderer to components and surfaces: the provider, the catalog, the operations, and what the agent receives.
- The `a2ui` provider option and `@copilotkit/a2ui-renderer` render A2UI v0.9: you build a catalog with `createCatalog`, and the agent streams a fixed or a generated schema into it. Components and surfaces is the A2UI 1.0 engine. The idea is the same: the agent writes operations, and the browser renders your components. The engine adds typed catalogs, the [standard catalog](/generative-ui/components/standard-catalog), areas of the page as targets, two transports, dynamic values that compute in the browser, and functions the agent can call. This page maps one to the other.
+ The `a2ui` provider option and `@copilotkit/a2ui-renderer` render A2UI v0.9 by default, with explicit A2UI 1.0 support in React: you build a catalog with `createCatalog`, and the agent streams a fixed or a generated schema into it. Components and surfaces is a separate A2UI 1.0 engine. The idea is the same: the agent writes operations, and the browser renders your components. The engine adds typed catalogs, the [standard catalog](/generative-ui/components/standard-catalog), areas of the page as targets, two transports, dynamic values that compute in the browser, and functions the agent can call. This page maps one to the other.
+ ## Use 1.0 with the React a2ui renderer
+ 
+ You can keep the `a2ui` provider option and opt into the native 1.0 basic catalog:
+ 
````

**High — Components · Markdown mode**

`/google-adk/generative-ui/components/markdown-mode` · route `/generative-ui/components/markdown-mode` · under “What is this?”

18 code lines, 14 prose lines changed. The number of fenced code blocks changed.

````diff
+ <Callout type="info" title="React Native">
+ Markdown mode is not available on React Native yet. `GenerativeUIProvider` from `@copilotkit/react-native/generative-ui` uses the [tool transport](/google-adk/generative-ui/components/transports#tool-transport) only: `transport: "markdown"` is a type error, and passed from JavaScript it is dropped, with a warning in development.
+ </Callout>
+ 
- <Tabs groupId="frontend_framework" items={["React", "Angular"]} persist>
+ <Tabs groupId="frontend_framework" items={["React", "Angular", "Vue"]} persist>
+ <Tab value="Vue">
+ ```vue title="src/App.vue"
````

**High — Components · State and actions**

`/google-adk/generative-ui/components/state-and-actions` · route `/generative-ui/components/state-and-actions` · under “Show live app state”

175 code lines, 52 prose lines changed. The number of fenced code blocks changed.

````diff
- <Tabs groupId="frontend_framework" items={["React", "Angular"]} persist>
+ <Tabs groupId="frontend_framework" items={["React", "Angular", "React Native", "Vue"]} persist>
+ <Tab value="React Native">
+ ```tsx title="src/shopUI.tsx"
+ const cartSchema = z.object({
+ items: z.array(z.object({ productId: z.string(), quantity: z.number() })),
+ });
+ 
````

**High — Components · Surfaces**

`/google-adk/generative-ui/components/surfaces` · route `/generative-ui/components/surfaces` · under “What is this?”

149 code lines, 59 prose lines changed. The number of fenced code blocks changed.

````diff
- - **The chat.** Always there. The agent can use every component of the catalog.
- - **A page target.** An area of your page that you mark with `GenerativeUISurface`, or `<copilot-generative-ui-surface>` in Angular. The agent sees it only while it is on screen.
+ - **The chat.** Always there. The agent can use every component of the catalog. On React Native, you draw chat surfaces yourself, with `GenerativeUIActivity`; see [Chat surfaces on React Native](#chat-surfaces-on-react-native). The agent is offered the chat target even when the app shows no chat, so a React Native app that renders only `GenerativeUISurface` targets, or only the prebuilt `CopilotChat` (which does not draw surfaces yet), never shows a surface aimed at the chat.
+ - **A page target.** An area of your page that you mark with `GenerativeUISurface`, or `<copilot-generative-ui-surface>` in Angular. The agent sees it only while it is mounted.
- <Tabs groupId="frontend_framework" items={["React", "Angular"]} persist>
+ <Tabs groupId="frontend_framework" items={["React", "Angular", "React Native", "Vue"]} persist>
+ <Tab value="React Native">
+ ```tsx title="src/FeaturedProducts.tsx"
````

**High — Components · Theming**

`/google-adk/generative-ui/components/theming` · route `/generative-ui/components/theming` · under “What is this?”

35 code lines, 18 prose lines changed. The number of fenced code blocks changed.

````diff
- <Tabs groupId="frontend_framework" items={["React", "Angular"]} persist>
+ <Tabs groupId="frontend_framework" items={["React", "Angular", "Vue"]} persist>
+ <Tab value="Vue">
+ ```vue
+ <script setup lang="ts">
+ import { CopilotKitProvider } from "@copilotkit/vue/v2";
+ import { standardUI, type GenerativeUITheme } from "@copilotkit/vue/v2/generative-ui";
+ 
````

**High — Components · Transports**

`/google-adk/generative-ui/components/transports` · route `/generative-ui/components/transports` · under “What is this?”

18 code lines, 29 prose lines changed. The number of fenced code blocks changed.

````diff
- The agent must send the UI to the browser somehow. Some agents are good at tool calls. Others only stream text, or you build their prompt yourself. A **transport** is the way the UI travels:
+ The agent must send the UI to the app somehow: the browser, or a React Native app. Some agents are good at tool calls. Others only stream text, or you build their prompt yourself. A **transport** is the way the UI travels:
- Both transports use the same catalogs, surfaces, and components. Only the path between the agent and the browser changes.
+ Both transports use the same catalogs, surfaces, and components. Only the path between the agent and the app changes.
- | Checked before the browser gets it | yes, by the runtime, and again in the browser | in the browser |
+ | Checked before the app gets it | yes, by the runtime, and again in the app | in the app |
- <Tabs groupId="frontend_framework" items={["React", "Angular"]} persist>
+ <Tabs groupId="frontend_framework" items={["React", "Angular", "React Native", "Vue"]} persist>
````

**High — Reasoning**

`/google-adk/generative-ui/reasoning` · route `/generative-ui/reasoning` · under “Custom reasoning rendering” · in a `typescript` block

10 code lines changed.

````diff
- className="my-2 rounded-xl border border-[#DBDBE5] bg-[#BEC2FF1A] px-3.5 py-2.5 text-sm"
+ className="my-2 rounded-xl border border-[#DBDBE5] bg-[#BEC2FF1A] px-3.5 py-2.5 text-sm dark:border-border"
- <div className="flex items-center gap-2 font-medium text-[#010507]">
- <span className="inline-block rounded-full border border-[#BEC2FF] bg-white px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-[#57575B]">
+ <div className="flex items-center gap-2 font-medium text-[#010507] dark:text-foreground">
+ <span className="inline-block rounded-full border border-[#BEC2FF] bg-white px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-[#57575B] dark:bg-card dark:text-muted-foreground">
- <span className="text-[#57575B]">
+ <span className="text-[#57575B] dark:text-muted-foreground">
````

**High — Sub-Agents**

`/google-adk/multi-agent/subagents` · route `/multi-agent/subagents` · under “Rendering a live delegation log” · in a `typescript` block

30 code lines changed.

````diff
- className="w-full h-full flex flex-col bg-white rounded-2xl shadow-sm border border-[#DBDBE5] overflow-hidden"
+ className="w-full h-full flex flex-col bg-white rounded-2xl shadow-sm border border-[#DBDBE5] overflow-hidden dark:bg-card dark:border-border"
- <div className="flex items-center justify-between px-6 py-3 border-b border-[#E9E9EF] bg-[#FAFAFC]">
+ <div className="flex items-center justify-between px-6 py-3 border-b border-[#E9E9EF] bg-[#FAFAFC] dark:border-border dark:bg-muted">
- <span className="text-lg font-semibold text-[#010507]">
+ <span className="text-lg font-semibold text-[#010507] dark:text-foreground">
- className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-[#BEC2FF] bg-[#BEC2FF1A] text-[#010507] text-[10px] font-semibold uppercase tracking-[0.12em]"
+ className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-[#BEC2FF] bg-[#BEC2FF1A] text-[#010507] text-[10px] font-semibold uppercase tracking-[0.12em] dark:text-foreground"
````

**High — Shared State**

`/google-adk/shared-state` · route `/shared-state` · under “Rendering shared state in the UI” · in a `typescript` block

10 code lines changed.

````diff
- <code className="font-mono text-[11px] text-[#010507]">
+ <code className="font-mono text-[11px] text-[#010507] dark:text-foreground">
- className="text-sm text-[#838389] italic min-h-[160px] flex items-center justify-center text-center px-4 border border-dashed border-[#E9E9EF] rounded-xl bg-[#FAFAFC]"
+ className="text-sm text-[#838389] italic min-h-[160px] flex items-center justify-center text-center px-4 border border-dashed border-[#E9E9EF] rounded-xl bg-[#FAFAFC] dark:text-muted-foreground dark:border-border dark:bg-muted"
- className="space-y-2 text-sm text-[#010507]"
+ className="space-y-2 text-sm text-[#010507] dark:text-foreground"
- className="flex gap-2 rounded-lg border border-[#E9E9EF] bg-[#FAFAFC] px-3 py-2"
+ className="flex gap-2 rounded-lg border border-[#E9E9EF] bg-[#FAFAFC] px-3 py-2 dark:border-border dark:bg-muted"
````

**Info — A2UI**

`/google-adk/generative-ui/a2ui` · route `/generative-ui/a2ui`

Now tracked for the first time.

**Info — Components and surfaces**

`/google-adk/generative-ui/components` · route `/generative-ui/components`

Now tracked for the first time.

**Info — Components · Standard catalog**

`/google-adk/generative-ui/components/standard-catalog` · route `/generative-ui/components/standard-catalog`

Now tracked for the first time.

**Info — Headless Interrupts**

`/google-adk/human-in-the-loop/headless` · route `/human-in-the-loop/headless`

Now tracked for the first time.

**Info — Human in the Loop**

`/google-adk/human-in-the-loop/index` · route `/human-in-the-loop`

Now tracked for the first time.

**Info — Pausing the Agent for Input**

`/google-adk/human-in-the-loop/useInterrupt` · route `/human-in-the-loop/useInterrupt`

Now tracked for the first time.

---

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
