import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

import { TOOLS_SNIPPET } from "./doc-snippets";

export default function Page() {
  return (
    <>
      <RouteHeader path="/agent-app-context" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <code>useAgentContext</code> sends three sample colleagues from the
          page to the agent. For ADK the adapter only stores them in session
          state under <code>CONTEXT_STATE_KEY</code>. They reach the prompt
          only because the agent&apos;s instruction is an{" "}
          <code>InstructionProvider</code> that renders them in.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Who are my colleagues?",
              "What does Jane do?",
              "Draft an email to Alice in finance",
            ]}
            expect={
              <>
                The agent names John Doe (Developer), Jane Smith (Designer)
                and Bob Wilson (Product Manager), and nobody else. For Alice it
                says she isn&apos;t in the list and names the three it was
                sent.
              </>
            }
            fail={
              <>
                The agent makes up colleagues, or says the page sent none. In
                that case the context isn&apos;t reaching the prompt. Check the
                Inspector for the context entry on the run input.
              </>
            }
          />
        </div>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
          The literal &quot;...&quot; above the chat is the doc&apos;s{" "}
          <code>&lt;&gt;...&lt;/&gt;</code> placeholder, kept as published.
          The page also suggests a control run with an empty context, but
          publishes no code for it, so this demo has none.
        </p>
      </Panel>

      <Panel title="Step 1 — the frontend">
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/agent-app-context/your-component.tsx" },
            { file: "frontend/src/app/agent-app-context/demo-chat/page.tsx" },
          ]}
        />
      </Panel>

      <Panel title="Step 2 — the ADK agent">
        <SourceCode
          file="backend/src/agents/agent_app_context_agent.py"
          region="agent"
        />
        <div className="mt-4">
          <Callout tone="info" title="Two unused lines, kept as published">
            <code>add_adk_fastapi_endpoint</code> is imported and never
            called, and <code>adk_agent</code> is built and never mounted. This
            repo&apos;s server wraps <code>colleagues_agent</code> in its own{" "}
            <code>ADKAgent</code> with the same settings.
          </Callout>
        </div>
      </Panel>

      <Panel title="Step 3 — reading it inside a tool (not wired)">
        <Callout tone="warn" title="Stub on the page">
          The doc&apos;s tool reads the entries but leaves the lookup as a{" "}
          <code># ...</code> comment and always returns{" "}
          <code>{"{\"found\": False}"}</code>. It&apos;s shown here as text.
          Wiring it in would add a tool that can never find anyone.
        </Callout>
        <div className="mt-4">
          <CodeBlock code={TOOLS_SNIPPET} filename="tools.py" language="python" />
        </div>
      </Panel>
    </>
  );
}
