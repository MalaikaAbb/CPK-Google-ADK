import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

const DIR = "frontend/src/app/generative-ui/hashbrown";

const HASHBROWN_SHAPE = `{ "ui": [
  { "Stack": { "props": {}, "children": [
    { "MetricCard": { "props": { "title": "Total revenue", "value": 184302, "delta": 0.07 } } },
    { "BarChart":   { "props": { "data": [{ "label": "North", "value": 52000 }] } } }
  ] } }
] }`;

const PAGE_SHAPE = `{
  "type": "Stack",
  "children": [
    { "type": "MetricCard", "title": "Total revenue", "value": 184302 },
    { "type": "BarChart",   "data": [...] }
  ]
}`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/hashbrown" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The assistant message slot is replaced with a renderer that feeds
          the streaming reply to Hashbrown&apos;s partial-JSON parser and
          renders each finished node through a component catalog. Only the
          working version is on this route. The page&apos;s hook calls, as
          published, throw against <code>@hashbrownai/react</code> 0.6.1 (see
          below), so they were dropped.
        </p>
      </Panel>

      <Panel title="The working version">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          It keeps the page&apos;s components and suggestions and changes the
          following:
        </p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li>
            Each component is wrapped with{" "}
            <code>exposeComponent(component, {"{ name, description, props }"})</code>
            , with props described by Hashbrown&apos;s <code>s.*</code>{" "}
            builders, and <code>useUiKit</code> gets{" "}
            <code>{"{ components }"}</code>.
          </li>
          <li>
            <code>Stack</code> is exposed with <code>children: &quot;any&quot;</code>
            . The page&apos;s example uses it, and Hashbrown throws{" "}
            <code>Unknown element type</code> for any name it wasn&apos;t
            given.
          </li>
          <li>
            The parser is called as{" "}
            <code>useJsonParser(content, kit.schema)</code>, with the
            kit&apos;s own schema.
          </li>
          <li>
            The result is drawn with <code>kit.render(value)</code>, guarded
            for the moments mid-stream when there is no <code>ui</code> yet.
          </li>
          <li>
            Prose and code fences are stripped before parsing, because
            Hashbrown&apos;s parser expects JSON from the first character.
          </li>
          <li>
            Like the page, it replaces the whole <code>assistantMessage</code>,
            with no markdown renderer involved. It reads{" "}
            <code>props.message.content</code>, falls back to the default
            message for replies with no JSON, and is passed with an{" "}
            <code>as unknown as typeof CopilotChatAssistantMessage</code> cast,
            because CopilotKit&apos;s slot type (1.74 and 1.75) rejects a plain component.
            A dashboard reply has no copy, thumbs or regenerate toolbar.
          </li>
          <li>
            It calls <code>useConfigureSuggestions</code> inside{" "}
            <code>&lt;CopilotKit&gt;</code>, as on the JSON Render route.
          </li>
          <li>
            The agent is asked for Hashbrown&apos;s JSON shape, not the
            page&apos;s (see the next panel).
          </li>
        </ol>
        <div className="mt-4">
          <TryIt
            prompts={["Show me a sales dashboard.", "Break down sales by region."]}
            expect="Two suggestion pills above the input. The reply fills in progressively: an empty stack first, then each metric card and chart as its props finish streaming, with no error."
            fail={
              <>
                Nothing renders: check in the Inspector that the reply starts
                with <code>{'{"ui": [ … ]}'}</code>. A red note saying the reply
                did not match the UI kit means the model broke the schema, for
                example by using a component name that isn&apos;t exposed.
              </>
            }
          />
        </div>
        <div className="mt-4">
          <SourceCodeGroup files={[{ file: `${DIR}/hashbrown-fixed.tsx` }]} />
        </div>
      </Panel>

      <Panel title="The page's example output can't be rendered by Hashbrown">
        <Callout tone="warn" title="Wrong shape for Hashbrown 0.6.1">
          The page tells the agent to emit elements as{" "}
          <code>{"{ \"type\": …, …props }"}</code>. Hashbrown&apos;s UI kit
          parses a <code>{"{ \"ui\": [ … ] }"}</code> envelope, where each
          element is keyed by its component name and its props sit under{" "}
          <code>props</code>. Given the page&apos;s shape, the fixed renderer
          draws nothing. That was checked by rendering both shapes through the
          kit on the server. The agent here is prompted for the envelope
          instead.
        </Callout>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <CodeBlock code={PAGE_SHAPE} filename="The page's example output" language="json" />
          <CodeBlock code={HASHBROWN_SHAPE} filename="What Hashbrown parses" language="json" />
        </div>
      </Panel>

      <Callout tone="warn" title="Why the published version was removed">
        All three of the page&apos;s hook calls disagree with{" "}
        <code>@hashbrownai/react</code> 0.6.1. <code>useJsonParser</code>{" "}
        needs a schema, <code>useUiKit</code> takes{" "}
        <code>{"{ components }"}</code> built with{" "}
        <code>exposeComponent</code> rather than{" "}
        <code>{"{ catalog, value }"}</code>, and the kit is drawn with{" "}
        <code>kit.render(value)</code>. As published, the first assistant
        message threw{" "}
        <code>Cannot read properties of undefined (reading &apos;forEach&apos;)</code>
        . Details are in <code>HASHBROWN_FIX.md</code>.
      </Callout>

      <Panel title="Written in — what the page leaves out">
        <ul className="mb-4 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li>
            <code>MetricCard</code>, <code>BarChart</code> and{" "}
            <code>PieChart</code> (shared with JSON Render), plus files at the
            paths the renderer imports from
          </li>
          <li>
            The <code>AssistantMessage</code> import and the runtime route
          </li>
          <li>
            The <code>byoc_hashbrown</code> agent and its prompt. The page
            shows no ADK agent at all, only example output, and in the wrong
            shape (see above)
          </li>
        </ul>
        <SourceCodeGroup
          files={[
            { file: "frontend/src/components/byoc-dashboard.tsx" },
            { file: "frontend/src/app/api/copilotkit-byoc-hashbrown/[[...slug]]/route.ts" },
            { file: "backend/src/agents/chat_agents.py", region: "byoc-agents" },
          ]}
        />
      </Panel>

    </>
  );
}
