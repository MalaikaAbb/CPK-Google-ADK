import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";
import { RenderUiGeminiIssue } from "../_shop/render-ui-gemini-issue";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components/transports" />

      <RenderUiGeminiIssue markdownWorks />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The two ways generated UI travels from agent to browser. With the
          tool transport (default) the runtime adds a <code>render_ui</code>{" "}
          tool and validates each operation as it streams. With the markdown
          transport the agent writes <code>a2ui</code> code blocks inside its
          reply. <code>agentIds</code> limits generative UI to the listed
          agents.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Show a table of three running shoes with their prices"]}
            expect="tool: a render_ui tool call in the Inspector's event list, then a table in the chat. markdown: no tool call; the reply text contains the table inline. agentIds: plain text, no table. The agent is registered as 'default', not 'shop', so it gets no catalog, guide or render_ui tool."
            fail="A table appears in agentIds mode, or the tool mode renders nothing while the Inspector shows a render_ui call with rejected operations."
          />
        </div>
      </Panel>

      <Panel title="The demo and the runtime">
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/generative-ui/components/transports/demo-chat/page.tsx" },
            { file: "frontend/src/app/api/copilotkit-genui/[[...slug]]/route.ts" },
          ]}
        />
      </Panel>

      <Callout tone="warn" title="What the page leaves out for Google ADK">
        <p>
          The page says the agent &ldquo;must use the tools and the context
          entries of the run&rdquo;, and names the fix only for the built-in
          agent and LangGraph Python. For ADK, <code>AGUIToolset()</code>{" "}
          passes the run&apos;s tools (including <code>render_ui</code>), but{" "}
          <code>ag_ui_adk</code> puts context entries into session state, not
          the prompt. The harness agent reads them into its instruction with
          the pattern the{" "}
          <a href="/agent-app-context" className="text-[var(--accent)] underline underline-offset-4">
            Agent App Context
          </a>{" "}
          page publishes. The <code>agent</code> in the page&apos;s runtime
          snippet is undefined; here it is the ADK <code>genui</code> agent.
        </p>
      </Callout>
    </>
  );
}
