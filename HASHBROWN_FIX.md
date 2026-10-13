# QA Report — Google ADK · Generative UI · Hashbrown

Five issues, one report each. Where a line says *(to confirm in browser)*, the
behaviour is predicted from the library source and has not yet been observed in
the app. Type-check results were observed with `npx tsc --noEmit`. Rendering
results marked *(server-rendered)* were observed by rendering the UI kit with
`react-dom/server` in Node, outside the app.

---

**Area / surface:** Google ADK - Generative UI - Hashbrown (`useJsonParser` / `useUiKit` calls)

- **Problem:** Nothing renders. All three Hashbrown calls in the doc's renderer disagree with `@hashbrownai/react`: `useJsonParser` is called without a schema, `useUiKit` is given `{ catalog, value }` instead of `{ components }`, and the returned kit object is placed straight into JSX. The snippet fails type-check, and throws at runtime on the first assistant message.
- **Observed:** After setting up the project with the doc's `page.tsx` and `hashbrown-renderer.tsx` copied as published (plus the missing code from the third report, so it could compile), the following was observed.
1. The published renderer is:

```jsx
export function HashBrownAssistantMessage({ message }: { message: AssistantMessage }) {
  const parsed = useJsonParser(message.content ?? "");
  const ui = useUiKit({ catalog, value: parsed });
  return <div className="space-y-3">{ui}</div>;
}
```

2. `npx tsc --noEmit` was run on the frontend, and all three lines failed:

```jsx
hashbrown-renderer.tsx(26,18): error TS2554: Expected 2 arguments, but got 1.
hashbrown-renderer.tsx(27,25): error TS2353: Object literal may only specify known properties,
  and 'catalog' does not exist in type 'UiKitOptions<ExposedComponent<any>>'.
hashbrown-renderer.tsx(28,37): error TS2322: Type 'UiKit<ExposedComponent<any>>' is not assignable to type 'ReactNode'.
```

3. With a `@ts-expect-error` above each line so the build passes, the agent was prompted 'Show me a sales dashboard.'
4. The first assistant message throws, before any JSON arrives, because `useUiKit` calls `components.forEach(...)` on `undefined` *(to confirm in browser)*:

```jsx
TypeError: Cannot read properties of undefined (reading 'forEach')
```

- **Expected / impact:** The expectation is that the streamed reply renders progressively as a dashboard of metric cards and charts. Instead the chat crashes on every assistant reply. This is a blocker: the page's central code can't be used as written.

- **Likely cause / fix direction:**
1. The snippet targets a different Hashbrown API. In `@hashbrownai/react` 0.6.1, each component is wrapped with `exposeComponent(component, { name, description, props })`, with props described by Hashbrown's `s.*` builders, and the list is passed as `useUiKit({ components })`:

```jsx
const COMPONENTS = [
  exposeComponent(Stack, { name: "Stack", description: "Lays out its children vertically.", children: "any" }),
  exposeComponent(HashbrownMetricCard, {
    name: "MetricCard",
    description: "A single headline number, with an optional change ratio.",
    props: {
      title: s.string("What the number measures"),
      value: s.number("The number"),
      delta: s.anyOf([s.number("Change as a ratio, e.g. 0.07 for +7%"), s.nullish()]),
    },
  }),
  exposeComponent(BarChart, { name: "BarChart", description: "…", props: { data: dataSchema } }),
  exposeComponent(PieChart, { name: "PieChart", description: "…", props: { data: dataSchema } }),
];
```

2. Parse against the kit's own schema, and draw the result with `kit.render(value)`. Guard against moments mid-stream when there's no `ui` yet, and against a complete reply that fails the kit's final check:

```jsx
const kit = useUiKit({ components: COMPONENTS });
const { value } = useJsonParser(cleaned, kit.schema);
if (!value?.ui) return null;
return <div className="space-y-3">{kit.render(value)}</div>;
```

3. Define `COMPONENTS` at module level. `useUiKit` rebuilds the kit whenever it's given a new array.
4. Applied in `frontend/src/app/generative-ui/hashbrown/hashbrown-fixed.tsx` (the demo's **fixed** tab). It type-checks with no suppression, and renders progressively when server-rendered with a partial reply *(server-rendered)*. Browser verification is pending. Please update the doc snippet, and state the `@hashbrownai/react` version it targets.

- **Tested context:**

Docs URL: Google ADK - Generative UI - Hashbrown (https://docs.copilotkit.ai/google-adk/generative-ui/hashbrown)

Framework: Google ADK (Python backend)

OS: Ubuntu 24.04.4 LTS

Package Manager and versions: npm 12.0.1, Node v24.16.0

```json
BACKEND (Python, uv)
    ag-ui-adk==0.7.0
    google-adk==2.10.0

FRONTEND
    "@ag-ui/client": "^1.0.0",
    "@ag-ui/core": "^1.0.0",
    "@copilotkit/a2ui-renderer": "^1.75.0",
    "@copilotkit/react-core": "^1.75.0",   (installed: 1.75.0)
    "@copilotkit/runtime": "^1.75.0",
    "@hashbrownai/core": "^0.6.1",
    "@hashbrownai/react": "^0.6.1",
    "next": "16.3.0",
    "react": "19.2.8",
    "zod": "^3.25.76",
```

- **Loom Video:** *[add link]*

---

**Area / surface:** Google ADK - Generative UI - Hashbrown (example agent output)

- **Problem:** The page tells the agent to reply in a shape Hashbrown can't render. Even with every hook call fixed, an agent that follows the page produces an empty chat.
- **Observed:** After building the UI kit correctly (per the first report), the following was observed.
1. The page's example agent output keys each element by `type`, with props as siblings:

```jsx
{
  "type": "Stack",
  "children": [
    { "type": "MetricCard", "title": "Total revenue", "value": 184302 },
    { "type": "BarChart",   "data": [...] }
  ]
}
```

2. Hashbrown 0.6.1's UI kit builds its schema as a `{ "ui": [...] }` envelope. Each element is keyed by component name, with props under `props` and children under `children`:

```jsx
{ "ui": [
  { "Stack": { "props": {}, "children": [
    { "MetricCard": { "props": { "title": "Total revenue", "value": 184302, "delta": 0.07 } } },
    { "BarChart":   { "props": { "data": [{ "label": "North", "value": 52000 }] } } }
  ] } }
] }
```

3. Both shapes were rendered through the same kit *(server-rendered)*. The envelope rendered the stack, both cards and the chart, and filled in progressively when cut off mid-stream. The page's shape rendered nothing, with no error.
4. The example also uses `Stack`, which the page's catalog doesn't include. Hashbrown throws `Unknown element type. Stack` for any name it wasn't given.

- **Expected / impact:** The expectation is that an agent prompted as the page shows produces a reply Hashbrown can render. Currently the documented shape renders nothing and gives no error, so a reader has no clue why. This is a blocker.

- **Likely cause / fix direction:**
1. The example output looks like it was written for a different renderer and never checked against Hashbrown. Please replace it with the `{ "ui": [...] }` envelope above.
2. Add `Stack` to the catalog (exposed with `children: "any"`), or drop it from the example.
3. The harness prompts its agent for the envelope, in `backend/src/agents/chat_agents.py` (`#region byoc-agents`).
4. Hashbrown can express "number or null" but not "number or missing", so an optional prop such as `delta` arrives as `null`. The harness maps `null` back to "no delta" in a small `MetricCard` adapter; otherwise the card would show "▲ 0.0%". Worth a note in the doc if the catalog keeps optional props.

- **Tested context:** Same as the first report.

- **Loom Video:** *[add link]*

---

**Area / surface:** Google ADK - Generative UI - Hashbrown (unpublished code)

- **Problem:** The example can't be assembled from the page. Several things the published code imports or points at are never shown.
- **Observed:** After copying every code block on the page into the project, the following was observed.
1. The renderer imports `MetricCard` from `./metric-card` and `PieChart`, `BarChart` from `./charts`. Neither file is published.
2. The renderer uses the `AssistantMessage` type but never imports it.
3. The frontend points at `runtimeUrl="/api/copilotkit-byoc-hashbrown"`, which the page never shows.
4. The page's backend section says only that it depends on your framework, then shows example output. No ADK agent or instruction is published for `agent="byoc_hashbrown"`.

5. Nothing on the page removes prose or code fences before parsing. Hashbrown's parser expects JSON from the first character, so a "Here's your dashboard:" line or a ```` ```json ```` fence from the model breaks it.

- **Expected / impact:** The expectation is that a reader can build a working example from the page. Currently they have to write the chart components, the runtime route, the agent and its instruction, and the input cleanup themselves. This is a major issue: the page reads as complete but can't be run.

- **Likely cause / fix direction:**
1. The snippets appear to be excerpts from a larger demo app, published without their dependencies.
2. The harness wrote the missing pieces and labelled them as not from the docs:
   - `components/byoc-dashboard.tsx`: the three components, re-exported at the doc's import paths `./metric-card` and `./charts`
   - `app/api/copilotkit-byoc-hashbrown/[[...slug]]/route.ts`: the runtime route
   - `backend/src/agents/chat_agents.py` (`#region byoc-agents`): the `byoc_hashbrown` agent, the same `AGUIToolset()` shape as the repo's other chat agents, with a harness-written instruction asking for the envelope in the second report
   - `hashbrown-fixed.tsx`: strips prose and code fences before parsing, reusing the JSON Render route's helper
3. Please publish these (or link the full example source), including an ADK agent and the instruction that makes it reply with the `{ "ui": [...] }` envelope.

- **Tested context:** Same as the first report.

- **Loom Video:** *[add link]*

---

**Area / surface:** Google ADK - Generative UI - Hashbrown (`messageView.assistantMessage` slot)

- **Problem:** The doc passes a plain component as `messageView.assistantMessage`, but CopilotKit types that slot as `typeof CopilotChatAssistantMessage`, including its static sub-components. The documented line fails type-check.
- **Observed:** After copying the doc's `page.tsx` as published, the following was observed.
1. The published line is:

```jsx
<CopilotChat messageView={{ assistantMessage: HashBrownAssistantMessage }} />
```

2. `npx tsc --noEmit` was run on `@copilotkit/react-core` 1.75.0 (the same error on 1.73.3 and 1.74.0):

```jsx
byoc-hashbrown-demo.tsx(21,24): error TS2322: Type '({ message }: { message: {...} }) => Element'
is not assignable to type 'SlotValue<typeof CopilotChatAssistantMessage>'.
  ... is missing the following properties from type 'typeof CopilotChatAssistantMessage': MarkdownRenderer, Toolbar, ...
```

3. `next dev` doesn't type-check, so this only shows at `next build`.

- **Expected / impact:** The expectation is that a custom component can be used as the slot value, as the doc shows. Currently `next build` fails for anyone who copies the snippet. This is a major issue for deployment.

- **Likely cause / fix direction:**
1. The slot's type demands the default component's full static shape. Widening it in `@copilotkit/react-core` to accept any `ComponentType<CopilotChatAssistantMessageProps>` would fix the doc as written.
2. The harness's fixed tab keeps the doc's approach of replacing the whole `assistantMessage`, with no markdown renderer involved. It:
   - reads `props.message.content` (this slot passes `message`, `messages`, `isRunning`, …, not `content`)
   - falls back to the default message for replies with no JSON
   - is passed with a cast:

```jsx
function HashbrownAssistantMessage(props: ComponentProps<typeof CopilotChatAssistantMessage>) {
  const kit = useUiKit({ components: COMPONENTS });
  const cleaned = stripCodeFencesAndPrelude(props.message.content ?? "");
  const { value } = useJsonParser(cleaned, kit.schema);
  if (!cleaned) return <CopilotChatAssistantMessage {...props} />;
  // … render as in the first report
}

<CopilotChat
  messageView={{
    assistantMessage:
      HashbrownAssistantMessage as unknown as typeof CopilotChatAssistantMessage,
  }}
/>
```

3. Please document the cast, and that a reply rendered this way has no copy, thumbs or regenerate toolbar, since the default message isn't rendered for it.

- **Tested context:** Same as the first report.

- **Loom Video:** *[add link]*

---

**Area / surface:** Google ADK - Generative UI - Hashbrown (suggestions)

- **Problem:** The page's two suggestions ("Sales overview", "Region split") never appear in its chat.
- **Observed:** After copying the doc's `page.tsx` as published, the following was observed.
1. The component calls `useConfigureSuggestions(...)`, then renders its own provider:

```jsx
export default function ByocHashbrownDemo() {
  useConfigureSuggestions({ suggestions: [...], available: "always" });
  return (
    <CopilotKit runtimeUrl="/api/copilotkit-byoc-hashbrown" agent="byoc_hashbrown">
      <CopilotChat ... />
    </CopilotKit>
  );
}
```

2. The hook runs outside that `<CopilotKit>`, so the suggestions register on the app's root provider and the page's chat shows no suggestion pills *(to confirm in browser)*. In an app with no outer provider, the hook has no provider at all.
3. Nothing errors, so it goes unnoticed.

- **Expected / impact:** The expectation is that the two documented suggestions show above the chat input. Currently they are silently lost. This is minor, but the snippet is misleading. The JSON Render page has the same bug.

- **Likely cause / fix direction:**
1. Move the hook into a child rendered inside `<CopilotKit>`:

```jsx
function Chat() {
  useConfigureSuggestions({ suggestions: [...], available: "always" });
  return <CopilotChat messageView={...} />;
}

export default function Demo() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit-byoc-hashbrown" agent="byoc_hashbrown">
      <Chat />
    </CopilotKit>
  );
}
```

2. Applied in the harness's fixed tab; browser verification is pending. Please update the doc snippet.

- **Tested context:** Same as the first report.

- **Loom Video:** *[add link]*
