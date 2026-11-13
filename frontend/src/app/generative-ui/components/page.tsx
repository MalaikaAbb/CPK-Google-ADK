import Link from "next/link";

import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

const DIR = "frontend/src/app/generative-ui/components";

export default function Page() {
  const link = "text-[var(--accent)] underline underline-offset-4";
  return (
    <>
      <RouteHeader path="/generative-ui/components" />

      <Callout tone="warn" title="Broken on Google ADK: render_ui arguments come back malformed">
        <p>
          The provider&apos;s catalog makes the runtime add a{" "}
          <code>render_ui</code> tool whose <code>operations</code> are objects
          with no declared properties. <code>ag_ui_adk</code> hands that schema
          to Gemini unchanged, and Gemini can&apos;t fill it: the operations
          arrive malformed, the runtime rejects them, and nothing renders. No
          doc publishes a fix and none is applied here (README §9 #29). The{" "}
          <Link href="/generative-ui/components/markdown-mode" className={link}>
            Markdown mode
          </Link>{" "}
          route avoids the tool call.
        </p>
      </Callout>

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The page&apos;s &quot;Try it&quot; setup: a runtime with one default
          agent and no generative-UI option, and a provider given{" "}
          <code>standardUI</code>. Sending a catalog is enough for the runtime
          to hand that run a <code>render_ui</code> tool plus a guide to the
          components; the agent only has to pass both on to its model.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Compare the Starter, Team, and Enterprise plans in a table"]}
            expect="On Google ADK + Gemini: a render_ui tool call whose operations the runtime rejects, then no table (§9 #29). The page's own expectation, a table that fills in while streaming, is not met."
            fail="No render_ui call at all (the catalog didn't reach the runtime, or the agent dropped the run's tools), or a plain text table that never attempts the tool."
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/api/copilotkit-components/[[...slug]]/route.ts" },
            { file: `${DIR}/demo-chat/providers.tsx` },
            { file: `${DIR}/demo-chat/layout.tsx` },
            { file: `${DIR}/demo-chat/page.tsx` },
            { file: "backend/src/agents/components_agent.py", region: "agent" },
          ]}
        />
      </Panel>

      <Callout tone="warn" title="Doc gaps and harness changes">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Agent swapped.</strong> The page builds a TanStack-factory{" "}
            <code>BuiltInAgent</code> on OpenAI (<code>gpt-6-luna</code>). This
            harness runs ADK agents, so the runtime routes to the ADK{" "}
            <code>components</code> agent over AG-UI. It keeps the
            snippet&apos;s system prompt word for word and has no tools of its
            own. The page shows no Google ADK agent.
          </li>
          <li>
            <strong>Passing on tools and context.</strong> The page does it
            with <code>convertInputToTanStackAI</code>. On ADK the tools come
            through <code>AGUIToolset()</code>, and the context (the{" "}
            <code>render_ui</code> guide) has to be put into the prompt by an
            instruction provider, because <code>ag_ui_adk</code> keeps it in
            session state. That pattern is the Agent App Context page&apos;s,
            not this one&apos;s.
          </li>
          <li>
            <strong>Runtime URL.</strong> The page&apos;s provider points at{" "}
            <code>/api/copilotkit</code>; here that is the main multi-agent
            runtime with no <code>default</code> agent, so this demo uses its
            own <code>/api/copilotkit-components</code>.
          </li>
          <li>
            The page&apos;s layout <code>&lt;html&gt;</code>/
            <code>&lt;body&gt;</code> shell lives in the root layout; the demo
            layout keeps only the <code>Providers</code> wrap.
          </li>
        </ul>
      </Callout>
    </>
  );
}
