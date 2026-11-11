import Link from "next/link";

import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

import {
  ADK_AGENT,
  ADK_ENV,
  ADK_INSTALL,
  ADK_LANGGRAPH_JSON,
  ADK_LOCAL_DEV,
  DEPLOY,
  DEV,
  ENV_LOCAL,
  FLOW,
  FRONTEND_INSTALL,
  INSTALL_CLI,
  LANGGRAPH_JSON,
  LAYOUT,
  LOCAL_DEV_PYTHON,
  LOCAL_DEV_TYPESCRIPT,
  LOCAL_ENV,
  NEW_PROJECT,
  PAGE,
  PROVIDERS,
  ROUTE,
  SERVER,
} from "./doc-snippets";

/**
 * Reference route. Deploying needs a LangSmith account, `langgraph deploy`
 * and the `deployments-wrap-sdk[google-adk]` package, none of which this
 * harness has. The page's code is shown verbatim from ./doc-snippets.ts and
 * nothing here is run.
 */
export default function Page() {
  return (
    <>
      <RouteHeader path="/deploy-langsmith" />

      <Callout tone="premium" title="Requires a LangSmith deployment — not testable locally">
        <p>
          The page hosts the ADK agent on LangSmith: a{" "}
          <code>saf_sdk.adk.wrap(Runner(...))</code> wrapper with{" "}
          <code>LangsmithSessionService</code>, pushed with{" "}
          <code>langgraph deploy</code>, then reached from the Copilot Runtime
          through a <code>LangGraphAgent</code> pointed at the deployment URL.
          That needs a LangSmith account and API key plus the{" "}
          <code>deployments-wrap-sdk[google-adk]</code> package, which this
          repo does not install. The snippets are shown, not run. This
          harness&apos;s own ADK agents are reached over AG-UI with{" "}
          <code>HttpAgent</code> instead (see{" "}
          <Link href="/quickstart" className="text-[var(--accent)] underline underline-offset-4">
            Quickstart
          </Link>
          ).
        </p>
      </Callout>

      <Panel title="What the page teaches">
        <p className="mb-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The request path once deployed. The runtime talks to the LangSmith
          deployment, which runs the wrapped ADK runner.
        </p>
        <CodeBlock code={FLOW} filename="Request path" />
      </Panel>

      <Panel title="Deploy">
        <div className="space-y-4">
          <CodeBlock code={INSTALL_CLI} filename="Install the LangGraph CLI" />
          <CodeBlock code={NEW_PROJECT} filename="Scaffold from the template" />
          <CodeBlock code={LANGGRAPH_JSON} filename="langgraph.json" language="json" />
          <CodeBlock code={ADK_INSTALL} filename="Google ADK wrapper" />
          <CodeBlock code={ADK_AGENT} filename="agent.py" language="python" />
          <CodeBlock code={ADK_ENV} filename=".env" />
          <CodeBlock code={DEPLOY} filename="Deploy" />
        </div>
      </Panel>

      <Panel title="Connect the frontend">
        <div className="space-y-4">
          <CodeBlock code={FRONTEND_INSTALL} filename="Install" />
          <CodeBlock code={ROUTE} filename="app/api/copilotkit/[[...slug]]/route.ts" language="ts" />
          <CodeBlock code={PROVIDERS} filename="app/providers.tsx" language="tsx" />
          <CodeBlock code={LAYOUT} filename="app/layout.tsx" language="tsx" />
          <CodeBlock code={PAGE} filename="app/page.tsx" language="tsx" />
          <CodeBlock code={ENV_LOCAL} filename=".env.local" />
          <CodeBlock code={DEV} filename="Run" />
        </div>
      </Panel>

      <Panel title="Verify locally first">
        <div className="space-y-4">
          <CodeBlock code={ADK_LOCAL_DEV} filename="Local LangGraph API server" />
          <CodeBlock code={ADK_LANGGRAPH_JSON} filename="langgraph.json" language="json" />
          <CodeBlock code={LOCAL_DEV_PYTHON} filename="Python" />
          <CodeBlock code={LOCAL_DEV_TYPESCRIPT} filename="TypeScript" />
          <CodeBlock code={LOCAL_ENV} filename=".env" />
          <CodeBlock code={SERVER} filename="server.py" language="python" />
        </div>
      </Panel>

      <Callout tone="warn" title="Doc gaps and things to check before copying">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            The runtime is a <code>LangGraphAgent</code> client for the
            LangSmith deployment, not one of this repo&apos;s ADK agents. It is
            not built here; the hosted half cannot be reached without an
            account.
          </li>
          <li>
            <code>route.ts</code> asks for <code>graphId: &quot;agent&quot;</code>{" "}
            (the template&apos;s <code>langgraph.json</code> key), while the ADK{" "}
            <code>langgraph.json</code> registers the wrapped agent as{" "}
            <code>my_agent</code>. Following the ADK path as printed, the
            runtime asks for a graph that does not exist.
          </li>
          <li>
            <code>server.py</code> self-hosts a LangGraph graph with{" "}
            <code>LangGraphAGUIAgent</code>; there is no ADK version of the
            self-host step. Its <code>main()</code> is never called, and{" "}
            <code>sample_agent.demo:app</code> does not match the snippet&apos;s
            own file.
          </li>
          <li>
            <code>route.ts</code> exports only <code>GET</code> and{" "}
            <code>POST</code>; thread rename and delete would also need{" "}
            <code>PATCH</code> and <code>DELETE</code>.
          </li>
        </ul>
      </Callout>
    </>
  );
}
