import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";
import { IntelligenceStatus } from "@/components/intelligence-status";

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

      <Panel
        title="Intelligence, live"
        description="Read from this app's own runtime at render time — not a description of it."
      >
        <IntelligenceStatus />
      </Panel>

      <Callout tone="warn" title="The Quickstart moved to the v2 runtime">
        <p>
          Three things changed when the doc switched surfaces, and all three
          are load-bearing:
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            The import is <code>@copilotkit/runtime/v2</code>, not{" "}
            <code>@copilotkit/runtime</code>. There is no{" "}
            <code>serviceAdapter</code> on this surface at all —{" "}
            <code>ExperimentalEmptyAdapter</code> belonged to the v1 GraphQL
            runtime and has no counterpart.
          </li>
          <li>
            <code>createCopilotRuntimeHandler</code> returns a plain fetch
            handler rather than a <code>{"{ handleRequest }"}</code> wrapper, so
            the route is just its verb exports.
          </li>
          <li>
            The file moved to{" "}
            <code>api/copilotkit/[[...slug]]/route.ts</code>. The handler serves
            a whole subtree — <code>/info</code>, agent runs, thread
            list/rename/delete — so the old single-segment route would 404
            everything except the bare URL.
          </li>
        </ul>
        <p className="mt-2">
          It also exports four verbs, not one:{" "}
          <code>GET</code> serves <code>/info</code> and the thread list,{" "}
          <code>POST</code> runs agents, and <code>PATCH</code>/
          <code>DELETE</code> are how threads are renamed, archived and deleted.
        </p>
      </Callout>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/quickstart/demo-chat/page.tsx" />
      </Panel>

      <Panel
        title="The four files that make it work"
        description="Read from this repo, so they can be diffed against the doc's samples directly."
      >
        <SourceCodeGroup
          files={[
            { file: "backend/src/agents/quickstart_agent.py", region: "agent" },
            { file: "backend/src/agent_server.py", region: "mount" },
            { file: "frontend/src/lib/copilot-runtime.ts" },
            { file: "frontend/src/app/api/copilotkit/[[...slug]]/route.ts" },
          ]}
        />
      </Panel>

      <Callout tone="info" title="Two credentials, two different jobs">
        <p>
          <code>INTELLIGENCE_API_KEY</code> puts the runtime in Intelligence
          mode — that is what makes threads persist and the Inspector&apos;s
          Threads tab fill. <code>COPILOTKIT_LICENSE_TOKEN</code> is separate:
          it is what <code>/info</code> reports <code>licenseStatus</code> from,
          and client-side feature UIs read that field. A runtime can serve
          threads perfectly while every drawer still shows an Upgrade button.
          Neither is required to chat — without them the runtime falls back to
          SSE with an in-memory runner, which is why this harness stays runnable
          with only a Gemini key.
        </p>
      </Callout>
    </>
  );
}
