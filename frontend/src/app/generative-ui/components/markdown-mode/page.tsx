import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

import { EXAMPLE_REPLY, FORWARDED_UI, PYTHON_PROMPT } from "./doc-snippets";

const DIR = "frontend/src/app/generative-ui/components/markdown-mode";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components/markdown-mode" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          UI with no tool call. The provider sends the component schemas and a
          writing guide as context, and the agent writes A2UI 1.0 operations,
          one per line, in <code>a2ui</code> code blocks inside its reply. The
          chat renders each block as a live surface while the reply streams,
          with the surrounding text as normal markdown.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Give me a plan estimate I can play with: a slider for seats and the monthly price",
              "(sendContext: false) the same prompt",
            ]}
            expect="transport markdown: text, then a Card with a working Slider that fills in component by component as the reply streams, then more text. sendContext false: the agent gets no schema or guide, so it answers in plain text, or with a fenced block that renders as code."
            fail="The a2ui block shows as raw code in markdown mode, which means the agent's prompt never got the context entries."
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCodeGroup
          files={[
            { file: `${DIR}/demo-chat/page.tsx` },
            { file: `${DIR}/providers.tsx` },
            { file: "backend/src/agents/genui_agent.py", region: "agent" },
          ]}
        />
      </Panel>

      <Panel title="What the agent writes">
        <CodeBlock code={EXAMPLE_REPLY} filename="The page's example reply" language="markdown" />
      </Panel>

      <Panel title="Building your own prompt — shown, not run">
        <p className="mb-3 text-sm text-slate-700 dark:text-slate-300">
          With <code>sendContext: false</code>, the page reads the catalog from{" "}
          <code>forwardedProps.copilotkit.ui</code> in the backend. Its Python
          snippet uses <code>input.forwarded_props</code>, which an ADK{" "}
          <code>LlmAgent</code> doesn&apos;t receive, and{" "}
          <code>MY_PROMPT</code>, which the page never defines. No ADK version
          is shown, so the demo&apos;s second mode only shows what the agent
          gets without context.
        </p>
        <div className="grid gap-4 lg:grid-cols-2">
          <CodeBlock code={FORWARDED_UI} filename="forwardedProps.copilotkit.ui" language="json" />
          <CodeBlock code={PYTHON_PROMPT} filename="The page's Python" language="python" />
        </div>
      </Panel>

      <Callout tone="warn" title="Harness-authored pieces">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            The two component wrappers around the page&apos;s provider JSX, and{" "}
            <code>runtimeUrl</code>.
          </li>
          <li>
            The agent puts the run&apos;s context entries into its prompt, as
            the page requires of non-LangGraph agents but doesn&apos;t show for
            ADK. It uses the Agent App Context page&apos;s ADK pattern.
          </li>
        </ul>
      </Callout>
    </>
  );
}
