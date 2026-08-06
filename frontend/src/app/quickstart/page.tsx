import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/quickstart" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The bring-your-own-agent path, end to end. A{" "}
          <code>google.adk.agents.LlmAgent</code> is wrapped by{" "}
          <code>ADKAgent</code> and exposed over AG-UI by{" "}
          <code>add_adk_fastapi_endpoint</code>; the Next runtime reaches it
          with an <code>HttpAgent</code>. Two processes, two ports — unlike the
          TypeScript integrations, ADK is Python, so the agent genuinely lives
          somewhere else.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Can you tell me a joke?",
              "What do you think about React?",
            ]}
            expect="Tokens stream in a word at a time and the reply renders as markdown."
            fail="An error banner. Check that the Python server is up on :8000 and that GOOGLE_API_KEY is set in its environment."
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/quickstart/demo-chat/page.tsx" />
      </Panel>

      <Panel
        title="The three files that make it work"
        description="Read from this repo, so they can be diffed against the doc's samples directly."
      >
        <SourceCodeGroup
          files={[
            { file: "backend/src/agents/quickstart_agent.py", region: "agent" },
            { file: "backend/src/agent_server.py", region: "mount" },
            { file: "frontend/src/app/api/copilotkit/route.ts" },
          ]}
        />
      </Panel>
    </>
  );
}
