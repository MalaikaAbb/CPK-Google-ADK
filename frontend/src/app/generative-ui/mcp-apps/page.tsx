import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

import { HTTP_SERVER, INTELLIGENCE_ROUTE, SAME_ORIGIN, SSE_SERVER } from "./doc-snippets";

const DIR = "frontend/src/app/generative-ui/mcp-apps";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/mcp-apps" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          An MCP server whose tools come with UI. The runtime&apos;s{" "}
          <code>mcpApps.servers</code> entry attaches middleware that exposes
          the server&apos;s tools to the agent. When the agent calls one, the
          middleware fetches the tool&apos;s UI resource and emits an activity
          event. The built-in renderer draws it in the chat as a sandboxed
          iframe. The frontend is a plain chat with no renderer of its own.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Draw a diagram: Browser → Next.js runtime → ADK agent → Gemini"]}
            expect="One create_view tool call, then an interactive Excalidraw canvas inline in the chat showing 3-5 boxes joined by arrows, and a one-sentence reply."
            fail="The agent says it has no drawing tool (the middleware didn't attach, or mcp.excalidraw.com is unreachable), or a tool call with no canvas (the UI resource fetch failed). Check the Inspector's event list for the activity event."
          />
        </div>
      </Panel>

      <Panel title="The Code tab, as published" description="Agent, runtime route and demo page.">
        <SourceCodeGroup
          files={[
            { file: "backend/src/agents/mcp_apps_agent.py" },
            { file: "frontend/src/app/api/copilotkit-mcp-apps/route.ts" },
            { file: `${DIR}/mcp-apps-demo.tsx` },
          ]}
        />
      </Panel>

      <Callout tone="warn" title="Harness stand-ins for unpublished code">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <code>./chat</code>: a plain <code>&lt;CopilotChat /&gt;</code>{" "}
            (<code>chat.tsx</code>), which the page says is enough.
          </li>
          <li>
            <code>@/lib/header-forwarding</code>: commented out with its call
            site. It only forwards the showcase&apos;s aimock test headers.
          </li>
          <li>
            <code>get_model()</code>: added to <code>shared_chat.py</code>,
            returning the model every agent here uses.
          </li>
          <li>
            <code>headless-complete</code>: pointed at this repo&apos;s{" "}
            <code>/headless-complete</code> agent. The tab uses{" "}
            <code>/headless_complete</code>, which isn&apos;t mounted here.
          </li>
        </ul>
        <p className="mt-2">
          Two literals differ in the page&apos;s own code. The Code tab
          defaults to <code>https://mcp.excalidraw.com</code>, and the
          Intelligence snippet uses <code>https://mcp.excalidraw.com/mcp</code>.
          The demo runs the Code tab&apos;s value. Set{" "}
          <code>MCP_SERVER_URL</code> to try the other.
        </p>
      </Callout>

      <Panel title="Shown, not run">
        <p className="mb-3 text-sm text-slate-700 dark:text-slate-300">
          The Intelligence route uses a <code>BuiltInAgent</code> on OpenAI,
          not ADK. <code>allowSameOriginFallback</code> is only for widgets you
          wrote yourself, and the transport entries are config shapes.
        </p>
        <div className="space-y-4">
          <CodeBlock code={INTELLIGENCE_ROUTE} filename="app/api/copilotkit/[[...slug]]/route.ts" language="ts" />
          <div className="grid gap-4 lg:grid-cols-3">
            <CodeBlock code={SAME_ORIGIN} filename="allowSameOriginFallback" language="tsx" />
            <CodeBlock code={HTTP_SERVER} filename="HTTP server" language="ts" />
            <CodeBlock code={SSE_SERVER} filename="SSE server" language="ts" />
          </div>
        </div>
      </Panel>
    </>
  );
}
