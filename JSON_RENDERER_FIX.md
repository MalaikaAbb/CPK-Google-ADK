# JSON Render — why the documented example fails, and how to fix it

Doc page: <https://docs.copilotkit.ai/google-adk/generative-ui/json-render>
Harness route: `/generative-ui/json-render` (demo has **as published** / **fixed** modes)

Tested against:

| Package | Version |
|---|---|
| `@copilotkit/react-core`, `@copilotkit/runtime` | 1.74.0 (slot typing also checked on 1.73.3) |
| `@json-render/react`, `@json-render/core` | 0.21.0 |
| `next` / `react` | 16.3.0 / 19.2.8 |
| `ag-ui-adk` / `google-adk` | 0.7.0 / 2.10.0 |

> **Verification status.** Every claim below about type errors was observed
> with `npx tsc --noEmit`. The runtime errors are predicted from the library
> source and have not yet been observed in a browser; neither has the fixed
> version rendering a dashboard. Confirm both before relying on this document.

---

## 1. What the page publishes

Three code blocks:

- **`page.tsx`** — calls `useConfigureSuggestions`, then renders
  `<CopilotKit runtimeUrl="/api/copilotkit-byoc-json-render" agent="byoc_json_render">`
  around `<CopilotChat messageView={{ assistantMessage: JsonRenderAssistantMessage }} />`.
- **`json-render-renderer.tsx`** — `parseSpec(message.content)` then
  `<Renderer spec={spec} catalog={catalog} />`.
- **`registry.tsx`** — a catalog mapping `MetricCard`, `BarChart`, `PieChart`
  to `{ component, propsSchema }` with Zod schemas.

It also shows the JSON the agent should emit: `{ root, elements }`, where each
element is `{ type, props, children }`.

## 2. Why it fails

There are two kinds of problem: code the page never publishes, and published
code that is wrong.

### 2a. Missing code (the example cannot compile as published)

| Missing | Referenced by |
|---|---|
| `stripCodeFencesAndPrelude`, `tolerantJsonParse`, `validateAgainstCatalog` | `parseSpec` in the renderer |
| `AssistantMessage` type import | the renderer's signature |
| `MetricCard`, `BarChart`, `PieChart` (`./metric-card`, `./charts/*`) | `registry.tsx` |
| A `Stack` component | the page's example output; absent from the catalog |
| `/api/copilotkit-byoc-json-render` runtime route | `page.tsx` |
| `byoc_json_render` agent, and a prompt asking for a `{ root, elements }` spec | `page.tsx` |

None of this is CopilotKit-specific. It is ordinary app code, plus a backend
agent. CopilotKit's only role on the page is the assistant-message slot.

### 2b. Wrong code (fails even once the missing code is supplied)

**1. `<Renderer>` has no `catalog` prop.** `@json-render/react` 0.21.0 takes
`registry`: a map of type name → React component receiving
`{ element, children }`.

```
TS2322: Property 'catalog' does not exist on type 'IntrinsicAttributes & RendererProps'.
```

**2. `<Renderer>` is rendered without its providers.** It reads visibility,
action and state contexts, which `<JSONUIProvider>` supplies. Without it, the
first valid spec throws (predicted from source):

```
Error: useVisibility must be used within a VisibilityProvider
```

Were the providers present, the next failure would be `registry` being
`undefined` (the renderer looks up `registry[element.type]`).

**3. The `assistantMessage` slot rejects a plain component (type level).**
CopilotKit types `messageView.assistantMessage` as
`typeof CopilotChatAssistantMessage`, including its static sub-components, so
the page's `({ message }) => …` fails the type check on both 1.73.3 and 1.74.0:

```
TS2322: ... is missing the following properties from type
'typeof CopilotChatAssistantMessage': MarkdownRenderer, Toolbar, ...
```

`next dev` does not type-check, so this only surfaces at `next build`.

**4. Suggestions register on the wrong provider.** `useConfigureSuggestions`
is called in the component that *renders* `<CopilotKit>`, i.e. outside it. The
suggestions attach to whichever provider is above (the app root, in this
harness) and never show in this chat. Nothing errors.

## 3. The fix

File: `frontend/src/app/generative-ui/json-render/json-render-fixed.tsx`.
It reuses the page's catalog, components and Zod schemas, and the harness's
parse helpers (`spec-helpers.ts`) unchanged.

### Fix 1 — build a `registry` from the page's catalog

```tsx
const registry: ComponentRegistry = {
  ...Object.fromEntries(
    Object.entries(catalog).map(([type, entry]) => {
      // Props were already checked against entry.propsSchema by
      // validateAgainstCatalog, so they can be passed through as-is.
      const Component = entry.component as unknown as ComponentType<
        Record<string, unknown>
      >;
      const Rendered: ComponentRegistry[string] = ({ element }) => (
        <Component {...element.props} />
      );
      Rendered.displayName = `JsonRender(${type})`;
      return [type, Rendered];
    }),
  ),
  Stack: ({ children }) => <div className="space-y-3">{children}</div>,
};
```

- Each catalog entry becomes a registry entry that spreads `element.props` onto
  the page's own component.
- The `as unknown as` cast is safe here because the props have already passed
  the entry's Zod schema.
- `Stack` is added so the page's own example output renders. The library
  renders child elements itself and passes them in as `children`.

### Fix 2 — wrap `<Renderer>` in `<JSONUIProvider>`

```tsx
<JSONUIProvider registry={registry}>
  <Renderer spec={spec} registry={registry} />
</JSONUIProvider>
```

### Fix 3 — plug into the chat in a type-safe way

There are two options. They differ in what the component receives:

| Slot | Your component receives |
|---|---|
| `assistantMessage.markdownRenderer` | `{ content }`, the raw text only |
| `assistantMessage` | `{ message, messages, isRunning, onThumbsUp, … }`, no `content` |

A component written for one slot gets `undefined` in the other. For example,
passing a `({ content })` component as `assistantMessage` makes
`stripCodeFencesAndPrelude(undefined)` throw
`TypeError: Cannot read properties of undefined (reading 'match')`.

**Option A (recommended): the `markdownRenderer` sub-slot.**

```tsx
function JsonRenderMarkdown({ content }: { content: string }) {
  const spec = validateAgainstCatalog(
    tolerantJsonParse(stripCodeFencesAndPrelude(content)),
  );
  if (!spec) return null;
  return (
    <JSONUIProvider registry={registry}>
      <Renderer spec={spec} registry={registry} />
    </JSONUIProvider>
  );
}

<CopilotChat
  messageView={{ assistantMessage: { markdownRenderer: JsonRenderMarkdown } }}
/>
```

- Type-checks with no cast. This sub-slot is typed to accept a plain component
  (the Markdown Rendering page documents it).
- Keeps the rest of the message: copy, thumbs and regenerate toolbar, and the
  tool-call view.

**Option B: replace the whole `assistantMessage`.** Use this when you want to
own the entire message layout, as the doc attempts.

```tsx
function JsonRenderAssistantMessage(
  props: ComponentProps<typeof CopilotChatAssistantMessage>,
) {
  const spec = validateAgainstCatalog(
    tolerantJsonParse(stripCodeFencesAndPrelude(props.message.content ?? "")),
  );
  // Not a spec (plain prose, or nothing parseable yet): show the normal message.
  if (!spec) return <CopilotChatAssistantMessage {...props} />;
  return (
    <JSONUIProvider registry={registry}>
      <Renderer spec={spec} registry={registry} />
    </JSONUIProvider>
  );
}

<CopilotChat
  messageView={{
    assistantMessage:
      JsonRenderAssistantMessage as unknown as typeof CopilotChatAssistantMessage,
  }}
/>
```

- Reads `props.message.content`, not `content`.
- Falls back to the default message for non-spec replies. Without that, prose
  replies render as nothing, which is also true of the doc's version.
- **Needs the `as unknown as typeof CopilotChatAssistantMessage` cast** (the
  pattern the Slots route uses). Without it, the file fails the type check.
- Loses the toolbar and tool-call view for any reply rendered as a dashboard.

> **Current state of `json-render-fixed.tsx`:** it uses Option B, but line 107
> passes `JsonRenderAssistantMessage` **without the cast**, so
> `npx tsc --noEmit` reports `TS2322` there and `next build` would fail. Add
> the cast, or switch back to Option A (the commented-out
> `JsonRenderMarkdown` is still in the file). The file's header comment still
> describes Option A.

### Fix 4 — call `useConfigureSuggestions` inside `<CopilotKit>`

```tsx
function Chat() {
  useConfigureSuggestions({
    suggestions: [
      { title: "Sales dashboard", message: "Show me a sales dashboard." },
      { title: "Region breakdown", message: "Break down sales by region." },
    ],
    available: "always",
  });
  return <CopilotChat className="h-full" messageView={/* Option A or B */} />;
}

export default function ByocJsonRenderFixedDemo() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit-byoc-json-render" agent="byoc_json_render">
      <Chat />
    </CopilotKit>
  );
}
```

## 4. How to verify

1. Start the backend and frontend as described in `README.md` §6.
2. Open `/generative-ui/json-render/demo-chat`.
3. **As published** (the default mode): send `Show me a sales dashboard.`
   - **Expected:** a red box inside the demo reading
     `The published code threw: Error: useVisibility must be used within a VisibilityProvider`.
   - If you see a different error, record it: it replaces the prediction above.
4. Switch to **fixed**.
   - **Expected:** two suggestion pills above the input. Then, for the same
     prompt, metric cards plus a bar or pie chart that fill in as the JSON
     streams, with no error.
   - **If raw JSON or nothing appears:** check in the Inspector that the reply
     is a `{ root, elements }` object. A missing card means its props failed
     the catalog's Zod schema and were dropped.
   - **If using Option B:** a plain-prose reply (e.g. `hello`) should render as
     a normal message, not disappear.
5. Run `npx tsc --noEmit` in `frontend/`. There should be no errors in
   `json-render-fixed.tsx`. The errors that remain elsewhere (the `HttpAgent`
   vs `AbstractAgent` mismatch on every runtime route, and two shared-state
   demos) predate this work.

## 5. Files

| File | Origin |
|---|---|
| `frontend/src/app/generative-ui/json-render/byoc-json-render-demo.tsx` | Doc, verbatim. The `messageView` line carries a `@ts-expect-error` |
| `frontend/src/app/generative-ui/json-render/json-render-renderer.tsx` | Doc, verbatim. The `<Renderer>` line carries a `@ts-expect-error`; imports added above |
| `frontend/src/app/generative-ui/json-render/registry.tsx` | Doc, verbatim |
| `frontend/src/app/generative-ui/json-render/json-render-fixed.tsx` | Harness: the working version |
| `frontend/src/app/generative-ui/json-render/spec-helpers.ts` | Harness: the three missing helpers |
| `frontend/src/app/generative-ui/json-render/metric-card.tsx`, `charts/*.tsx` | Harness: re-exports at the doc's import paths |
| `frontend/src/components/byoc-dashboard.tsx` | Harness: `MetricCard`, `BarChart`, `PieChart` |
| `frontend/src/components/demo-error-boundary.tsx` | Harness: shows the published code's error inside the demo |
| `frontend/src/app/api/copilotkit-byoc-json-render/[[...slug]]/route.ts` | Harness: runtime route |
| `backend/src/agents/chat_agents.py` (`#region byoc-agents`) | Harness: agent and prompt |

## 6. Suggested doc changes

1. Replace `catalog={catalog}` with a `registry` (Fix 1), and show
   `<JSONUIProvider>` (Fix 2). State the `@json-render/react` version targeted.
2. Show the three helpers, or link the full example source. Add `Stack` to the
   catalog, or drop it from the example output.
3. Use `assistantMessage.markdownRenderer` (Option A). Or, if the whole message
   is meant to be replaced, show the cast and the fallback (Option B).
   Alternatively, widen the slot type in `@copilotkit/react-core` so a plain
   component is accepted.
4. Move `useConfigureSuggestions` into a child of `<CopilotKit>`.
5. Show the runtime route and the agent, with the prompt that makes it emit a
   `{ root, elements }` spec.
