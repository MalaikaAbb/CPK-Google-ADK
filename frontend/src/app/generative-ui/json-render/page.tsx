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
          The page replaces the assistant message slot with a renderer that
          reads the reply as a <code>{"{ root, elements }"}</code> spec,
          checks each element against a Zod catalog, and draws it with{" "}
          <code>@json-render/react</code>. Here, all the code the page
          leaves out has been written in, but its call into the library is
          kept exactly as published. So this route shows what happens when
          you follow the page as written.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["(as published) Show me a sales dashboard.", "(as published) Break down sales by region."]}
            expect={
              <>
                <strong>An error is expected.</strong> Once the reply has a
                valid root element, <code>&lt;Renderer&gt;</code> throws,
                most likely{" "}
                <code>
                  useVisibility must be used within a VisibilityProvider
                </code>
                . The page never wraps it in <code>JSONUIProvider</code>. If
                the providers were there, the next failure would be{" "}
                <code>registry</code> being <code>undefined</code>, because
                the page passes <code>catalog</code>.
              </>
            }
            fail={
              <>
                The chat shows nothing and no error. The reply never became a
                valid spec, so the renderer returned <code>null</code> before
                reaching the library. Check the raw reply in the Inspector.
              </>
            }
          />
        </div>
      </Panel>

      <Panel title="The fix — switch the demo to “fixed”">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A working version sits next to the published one. It reuses the
          page&apos;s catalog, components, Zod schemas and helpers, and makes
          four changes:
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
            It plugs in through{" "}
            <code>assistantMessage.markdownRenderer</code>, which gets the raw{" "}
            <code>content</code> and type-checks, instead of replacing the
            whole <code>assistantMessage</code>.
          </li>
          <li>
            It calls <code>useConfigureSuggestions</code> inside{" "}
            <code>&lt;CopilotKit&gt;</code>, so the suggestions show up.
          </li>
        </ol>
        <div className="mt-4">
          <TryIt
            prompts={["(fixed) Show me a sales dashboard."]}
            expect="Two suggestion pills above the input. The reply renders as metric cards and a bar or pie chart that fill in as the JSON streams, with no error."
            fail="Raw JSON or nothing. Check in the Inspector that the reply is a { root, elements } object. If a card is missing, its props failed the catalog's Zod schema and were dropped."
          />
        </div>
        <div className="mt-4">
          <SourceCodeGroup files={[{ file: `${DIR}/json-render-fixed.tsx` }]} />
        </div>
      </Panel>

      <Panel title="Left as published — the library call">
        <Callout tone="warn" title="Not fixed on purpose">
          <code>&lt;Renderer spec=&#123;spec&#125; catalog=&#123;catalog&#125; /&gt;</code>{" "}
          doesn&apos;t match <code>@json-render/react</code> 0.21. That
          version takes <code>registry</code> (a map from name to render
          function, built with <code>defineRegistry</code>) and needs its
          providers around it. A <code>@ts-expect-error</code> above the line
          lets the build pass, so the error surfaces at runtime.
        </Callout>
        <div className="mt-4">
          <Callout tone="warn" title="Also from the page: the slot type">
            <code>messageView.assistantMessage</code> is typed as{" "}
            <code>typeof CopilotChatAssistantMessage</code> in CopilotKit
            1.74.0. The page&apos;s plain component doesn&apos;t satisfy it,
            so that line also carries a <code>@ts-expect-error</code>.
          </Callout>
        </div>
        <div className="mt-4">
          <SourceCodeGroup
            files={[
              { file: `${DIR}/byoc-json-render-demo.tsx` },
              { file: `${DIR}/json-render-renderer.tsx` },
              { file: `${DIR}/registry.tsx` },
            ]}
          />
        </div>
      </Panel>

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
            <code>&lt;CopilotKit&gt;</code> it renders. The suggestions
            therefore register on the app&apos;s root provider, so they
            won&apos;t appear in this chat.
          </li>
        </ul>
      </Panel>
    </>
  );
}
