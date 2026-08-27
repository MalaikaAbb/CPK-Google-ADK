"use client";

import {
  CopilotKit,
  CopilotChat,
  CopilotChatConfigurationProvider,
  CopilotThreadsDrawer,
} from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";
import { nestedInspectorSetting } from "@/lib/inspector";

/** The runtime id this demo binds to. Also shown in the demo header. */
/**
 * Its own provider on purpose, pointed at the one Intelligence-mode runtime.
 *
 * The app-wide provider talks to /api/copilotkit, which registers 28 agents and
 * runs in SSE mode. An Intelligence runtime makes the client open a thread
 * channel per advertised agent, so pointing 28 agents at it froze the machine —
 * see `lib/copilot-runtime.ts`. This endpoint registers exactly one.
 *
 * `enableInspector={false}` because the root provider already owns the
 * inspector on non-nested routes; `lib/inspector.ts` yields it to this one.
 */
const AGENT_ID = "my_agent";

/**
 * The doc's whole integration: a drawer and a chat inside one shared
 * `CopilotChatConfigurationProvider`.
 *
 * The shared configuration is the point. It holds the active thread, so
 * selecting a row connects the chat to that thread and replays its history, and
 * the "New Conversation" row resets the chat to a fresh welcome screen — with
 * no `threadId` state, no selection handler, and no props passed between the
 * two components.
 *
 * `CopilotKitProvider` is not repeated here; the app already mounts one at the
 * root. The doc nests one because its sample is a whole standalone page, and
 * that is also where its `publicLicenseKey` goes — this harness passes it on
 * the root provider instead. See `components/providers.tsx`.
 *
 * One departure, and it is presentational only. The doc's wrapper is
 * `<div style={{ display: "flex", height: "100dvh" }}>` with the two components
 * as bare children. In a flex row `CopilotChat` has no flex basis of its own,
 * so it collapses to min-content — one word per line beside a full-width
 * drawer. `flex: 1` plus `minWidth: 0` gives it the remaining space;
 * `minWidth` matters because a flex item's default `min-width: auto` refuses to
 * shrink below its content and would push the layout wider than the viewport.
 */
export default function Page() {
  return (
    <DemoFrame
      parentPath="/prebuilt-components/copilot-threads-drawer"
      subtitle={`agent: ${AGENT_ID} · CopilotThreadsDrawer + CopilotChat`}
    >
      <CopilotKit
        runtimeUrl="/api/copilotkit-threads"
        agent={AGENT_ID}
        enableInspector={nestedInspectorSetting}
      >
      <CopilotChatConfigurationProvider agentId={AGENT_ID}>
        <div style={{ display: "flex", height: "100%" }}>
          <CopilotThreadsDrawer />
          <div style={{ flex: 1, minWidth: 0 }}>
            <CopilotChat />
          </div>
        </div>
      </CopilotChatConfigurationProvider>
      </CopilotKit>
    </DemoFrame>
  );
}
