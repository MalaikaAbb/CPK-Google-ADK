import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

const DIR = "frontend/src/app/generative-ui/json-render";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/json-render" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The assistant message slot is replaced with a renderer that reads
          the reply as a <code>{"{ root, elements }"}</code> spec, checks each
          element against a Zod catalog, and draws it with{" "}
          <code>@json-render/react</code>. Only the working version is on this
          route. The page&apos;s library call, as published, throws against
          0.21 (see below), so it was dropped.
        </p>
      </Panel>

      <Panel title="The working version">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          It reuses the page&apos;s catalog, components, Zod schemas and
          helpers, and makes four changes:
        </p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li>
            It passes <code>registry</code> instead of <code>catalog</code>,
            built from the page&apos;s catalog as a map from type name to{" "}
            <code>({"{ element }"}) =&gt; &lt;Component {"{...element.props}"} /&gt;</code>
            , plus a <code>Stack</code> container.
          </li>
          <li>
            It wraps <code>&lt;Renderer&gt;</code> in{" "}
            <code>&lt;JSONUIProvider registry&gt;</code>.
          </li>
          <li>
            Like the page, it replaces the whole <code>assistantMessage</code>
            , but reads <code>props.message.content</code> and falls back to
            the default message when the reply isn&apos;t a spec. The slot is
            typed <code>typeof CopilotChatAssistantMessage</code>, so it is
            passed with an <code>as unknown as</code> cast.
          </li>
          <li>
            It calls <code>useConfigureSuggestions</code> inside{" "}
            <code>&lt;CopilotKit&gt;</code>, so the suggestions show up.
          </li>
        </ol>
        <div className="mt-4">
          <TryIt
            prompts={["Show me a sales dashboard.", "Break down sales by region."]}
            expect="Two suggestion pills above the input. The reply renders as metric cards and a bar or pie chart that fill in as the JSON streams, with no error."
            fail="Raw JSON or nothing. Check in the Inspector that the reply is a { root, elements } object. If a card is missing, its props failed the catalog's Zod schema and were dropped."
          />
        </div>
        <div className="mt-4">
          <SourceCodeGroup files={[{ file: `${DIR}/json-render-fixed.tsx` }]} />
        </div>
      </Panel>

      <Callout tone="warn" title="Why the published version was removed">
        The page renders{" "}
        <code>&lt;Renderer spec=&#123;spec&#125; catalog=&#123;catalog&#125; /&gt;</code>
        . <code>@json-render/react</code> 0.21 takes <code>registry</code>{" "}
        instead and needs <code>JSONUIProvider</code> around it. As
        published, it threw{" "}
        <code>useVisibility must be used within a VisibilityProvider</code>{" "}
        once a valid spec arrived. Details are in{" "}
        <code>JSON_RENDERER_FIX.md</code>.
      </Callout>

      <Panel title="Written in — what the page leaves out">
        <ul className="mb-4 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li>
            <code>stripCodeFencesAndPrelude</code>,{" "}
            <code>tolerantJsonParse</code>, <code>validateAgainstCatalog</code>
          </li>
          <li>
            <code>MetricCard</code>, <code>BarChart</code>,{" "}
            <code>PieChart</code>, plus files at the paths the catalog imports
            from
          </li>
          <li>
            The <code>AssistantMessage</code> import, the runtime route, and
            the agent and its prompt
          </li>
        </ul>
        <SourceCodeGroup
          files={[
            { file: `${DIR}/registry.tsx` },
            { file: `${DIR}/spec-helpers.ts` },
            { file: "frontend/src/components/byoc-dashboard.tsx" },
            { file: "frontend/src/app/api/copilotkit-byoc-json-render/[[...slug]]/route.ts" },
            { file: "backend/src/agents/chat_agents.py", region: "byoc-agents" },
          ]}
        />
      </Panel>

      <Panel title="Other things to know">
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li>
            The page&apos;s example output uses a <code>Stack</code>, which
            isn&apos;t in its catalog. The validator keeps unknown types only
            when they have <code>children</code>.
          </li>
          <li>
            The page calls <code>useConfigureSuggestions</code> outside the{" "}
            <code>&lt;CopilotKit&gt;</code> it renders, so its suggestions
            would never reach this chat. The working version calls it inside.
          </li>
        </ul>
      </Panel>
    </>
  );
}
