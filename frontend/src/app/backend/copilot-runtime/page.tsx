import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, KeyValue, Panel, TryIt } from "@/components/ui";
import { AGENT_IDS, AGENT_URL } from "@/lib/agents";

export default function Page() {
  return (
    <>
      <RouteHeader path="/backend/copilot-runtime" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The layer between the browser and the agents. It runs on your server,
          which is what makes it the right place for authentication, AG-UI
          middleware and agent routing — none of which can be trusted if they
          live in the client.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The demo is a raw capture of the protocol flowing through it, so the
          runtime is inspectable rather than merely described.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Hello"]}
            expect="RUN_STARTED → TEXT_MESSAGE_START → a collapsed TEXT_MESSAGE_CONTENT row whose delta count climbs → TEXT_MESSAGE_END → RUN_FINISHED."
            fail="RUN_FAILED, or nothing at all. Check that the Python server is reachable at the agent URL below."
          />
        </div>
      </Panel>

      <Panel title="This repo's runtime">
        <div className="mb-4">
          <KeyValue
            rows={[
              ["Main endpoint", <code key="a">/api/copilotkit</code>],
              ["Agent server", <code key="b">{AGENT_URL}</code>],
              ["Agents routed", `${AGENT_IDS.length}`],
              [
                "Extra endpoints",
                <span key="c">
                  <code>/api/copilotkit-voice</code> (v2 runtime, transcription)
                  {" · "}
                  <code>/api/copilotkit-declarative-gen-ui</code> (A2UI
                  auto-inject)
                </span>,
              ],
            ]}
          />
        </div>
        <SourceCode file="frontend/src/app/api/copilotkit/route.ts" />
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/backend/copilot-runtime/demo-chat/page.tsx" />
      </Panel>

      <Panel
        title="Why three runtimes and not one"
        description="Each extra endpoint exists because a doc page needs configuration the main one cannot carry."
      >
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="font-mono text-xs text-slate-900 dark:text-slate-100">
              /api/copilotkit
            </dt>
            <dd className="mt-0.5 text-slate-600 dark:text-slate-400">
              All 29 agents, plus{" "}
              <code>a2ui: {"{ injectA2UITool: false, agents: [\"a2ui-fixed-schema\"] }"}</code>{" "}
              — that agent owns its own tool and must not be handed a second
              one.
            </dd>
          </div>
          <div>
            <dt className="font-mono text-xs text-slate-900 dark:text-slate-100">
              /api/copilotkit-voice
            </dt>
            <dd className="mt-0.5 text-slate-600 dark:text-slate-400">
              <code>transcriptionService</code> exists only on the v2 runtime,
              and the v1 wrapper silently drops it. Needs a{" "}
              <code>[[...slug]]</code> catch-all so the v2 handler can own its
              sub-routing.
            </dd>
          </div>
          <div>
            <dt className="font-mono text-xs text-slate-900 dark:text-slate-100">
              /api/copilotkit-declarative-gen-ui
            </dt>
            <dd className="mt-0.5 text-slate-600 dark:text-slate-400">
              Needs A2UI tool injection <em>on</em>, which the main runtime
              turns off. Separate endpoint, no <code>a2ui</code> block at all.
            </dd>
          </div>
        </dl>
      </Panel>

      <Panel title="Registered agents">
        <div className="flex flex-wrap gap-1.5">
          {AGENT_IDS.map((id) => (
            <code
              key={id}
              className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              {id}
            </code>
          ))}
        </div>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
          The doc registers one agent at the server root. This harness needs one
          per route, so the Python server mounts each at{" "}
          <code>/&lt;agent-id&gt;</code> and the runtime builds one{" "}
          <code>HttpAgent</code> per id from the list below — which is also what
          the Voice page describes for the ADK showcase.
        </p>
        <div className="mt-4">
          <SourceCodeGroup
            files={[
              { file: "frontend/src/lib/agents.ts" },
              { file: "backend/src/agents/registry.py", region: "registry" },
            ]}
          />
        </div>
      </Panel>

      <Callout tone="info" title="No default agent here">
        <p>
          Registering an agent under the name <code>default</code> lets the
          prebuilt components use it without an <code>agentId</code> anywhere.
          That is the right call for an app with one primary agent; with 29 it
          would only hide mistakes, so every surface in this repo names its
          agent explicitly. The voice runtime is the exception — it aliases{" "}
          <code>default</code> to its one agent, per the doc.
        </p>
      </Callout>

      <Callout tone="warn" title="Legacy vs v2 endpoint factories">
        <p>
          <code>copilotRuntimeNextJSAppRouterEndpoint</code> from{" "}
          <code>@copilotkit/runtime</code> is the <strong>v1</strong> factory.
          The v2 equivalent is <code>createCopilotRuntimeHandler</code> from{" "}
          <code>@copilotkit/runtime/v2</code>. Both work in 1.66; the docs
          recommend v2 for new projects. This repo uses the v1 factory for the
          main endpoint — which is what the Quickstart and this page both show —
          and v2 for the voice endpoint, because <code>transcriptionService</code>{" "}
          leaves it no choice.
        </p>
      </Callout>

      <Panel title="What else the runtime provides">
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-slate-600 dark:text-slate-400">
          <li>
            <strong>Header forwarding.</strong> By default{" "}
            <code>authorization</code> and any <code>x-*</code> header forward
            to the agent, minus a denylist of proxy, CDN and platform headers.
            Tunable with <code>forwardHeaders</code>; server-configured headers
            always beat inbound ones of the same name.
          </li>
          <li>
            <strong>Middleware.</strong> <code>a2ui</code> and{" "}
            <code>mcpApps</code> are first-class options applied across
            registered agents; <code>agent.use(...)</code> is the manual form.
          </li>
          <li>
            <strong>Direct connection.</strong>{" "}
            <code>agents__unsafe_dev_only</code> on the provider skips the
            runtime entirely — development only, and it forfeits auth defaults
            and all server-side middleware.
          </li>
        </ul>
      </Panel>
    </>
  );
}
