import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

const DIR = "frontend/src/app/webmcp";

export default function Page() {
  return (
    <>
      <RouteHeader path="/webmcp" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          One frontend tool, two callers. With <code>webmcp</code> set,
          CopilotKit mirrors the tool (name, description, schema, annotations
          and handler) onto <code>document.modelContext</code>, so a
          WebMCP-aware browser agent can discover and call it directly. The
          same handler stays available to the CopilotKit agent. The core-only
          path registers it with no provider, Runtime or agent at all.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "In the chat: which of my orders have shipped?",
              "In Chrome's Model Context Tool Inspector: call searchOrders with { status: \"open\" }",
              "Switch to 'CopilotKitCore only' and call it from the inspector again",
            ]}
            expect="The chat agent calls searchOrders and lists A-1002 and A-1004. With Chrome 149+ and the WebMCP flag, the status line reads 'document.modelContext: present', the inspector lists searchOrders with the readOnlyHint annotation, and a call returns the JSON order list, in both paths."
            fail="'absent' in an enabled Chrome, or the tool missing from the inspector while present: check the tool has a description and webmcp is set. In any other browser, 'absent' is expected, and the chat path still works."
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCodeGroup
          files={[
            { file: `${DIR}/order-search.tsx` },
            { file: `${DIR}/webmcp.ts` },
            { file: `${DIR}/demo-chat/page.tsx` },
          ]}
        />
      </Panel>

      <Callout tone="warn" title="Harness-authored pieces">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <code>searchOrders</code> (<code>search-orders.ts</code>): a stub
            returning four fixed orders. Both snippets call it, and the page
            never defines it.
          </li>
          <li>
            The chat runs on this repo&apos;s generic{" "}
            <code>agentic_chat</code> agent. The page says no agent is needed
            for the WebMCP path itself.
          </li>
          <li>
            <code>@copilotkit/core</code> is now a direct dependency, because{" "}
            <code>webmcp.ts</code> imports it. It was already installed as a
            dependency of <code>@copilotkit/react-core</code>.
          </li>
        </ul>
      </Callout>
    </>
  );
}
