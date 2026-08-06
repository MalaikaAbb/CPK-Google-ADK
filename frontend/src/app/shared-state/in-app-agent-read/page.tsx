import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/shared-state/in-app-agent-read" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The read half, at its smallest. The agent has one stateful tool,{" "}
          <code>set_language</code>, which writes into{" "}
          <code>tool_context.state</code>. A component elsewhere on the page
          reads <code>agent.state?.language</code> and re-renders whenever it
          changes — no props threaded through, no event bus.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Switch to Spanish", "Now back to English"]}
            expect="The Language panel updates the moment the tool call lands, and the agent's replies switch language to match."
            fail="The agent claims to have switched but the panel stays put — the tool wrote to state the UI is not subscribed to."
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/shared-state/in-app-agent-read/demo-chat/page.tsx" />
      </Panel>

      <Panel title="The agent">
        <SourceCode file="backend/src/agents/shared_state_language_agent.py" region="agent" />
      </Panel>

      <Callout tone="warn" title="Two departures from the doc's samples">
        <p>
          <strong>
            <code>useAgent</code> has no <code>initialState</code>.
          </strong>{" "}
          Both this page and its write-side sibling seed the hook with{" "}
          <code>useAgent({"{ agentId, initialState: { language: \"english\" } }"})</code>
          . <code>UseAgentProps</code> in 1.66.2 has no such field — the type
          admits exactly two shapes, neither including it. The default is
          applied in the render here, and the agent&apos;s Pydantic{" "}
          <code>AgentState</code> already defaults it server-side.
        </p>
        <p className="mt-2">
          <strong>
            <code>useAgent</code> has no <code>render</code> either.
          </strong>{" "}
          The page&apos;s &quot;Rendering agent state in the chat&quot; section
          passes a <code>render</code> function to the hook. That prop does not
          exist. To draw state inside the transcript, register a renderer for
          the tool that writes it — see{" "}
          <a
            href="/generative-ui/tool-rendering"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            Tool Call Rendering
          </a>
          .
        </p>
      </Callout>

      <Callout tone="info" title="The agent id, and why it is not my_agent">
        <p>
          The doc calls this agent <code>my_agent</code>, which is also what the
          Quickstart calls its own — two different agents, one name. They are
          separate demos in the docs, but this harness serves both at once, so
          this one is registered as{" "}
          <code>shared-state-language</code>. The Python{" "}
          <code>LlmAgent</code>&apos;s <code>name</code> field is still{" "}
          <code>my_agent</code>, as the page has it.
        </p>
      </Callout>

      <Panel title="The write side">
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/shared-state/in-app-agent-write/demo-chat/page.tsx" },
          ]}
          note="Same agent, opposite direction — see the Writing agent state route."
        />
      </Panel>
    </>
  );
}
