"use client";

import { useState } from "react";
import {
  CopilotKit,
  CopilotChat,
  CopilotChatConfigurationProvider,
  CopilotThreadsDrawer,
  useCopilotChatConfiguration,
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

type Mode = "shared" | "controlled";

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
 * On top of that, the doc's "Add your own New conversation button" section:
 * a header button calling `startNewThread()` (shared mode), the
 * `threadId`-controlled variant where the app owns the thread (controlled
 * mode), and the CSS parts that hide the drawer's own new-conversation
 * controls. The two modes remount the provider via `key`, so switching starts
 * clean.
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
  const [mode, setMode] = useState<Mode>("shared");
  const [hideDrawerNew, setHideDrawerNew] = useState(false);

  return (
    <DemoFrame
      parentPath="/prebuilt-components/copilot-threads-drawer"
      subtitle={`agent: ${AGENT_ID} · CopilotThreadsDrawer + CopilotChat`}
    >
      {/* The doc's CSS, verbatim, behind a toggle so both states are testable. */}
      {hideDrawerNew && (
        <style>{`
copilotkit-threads-drawer::part(new-thread-button),
copilotkit-threads-drawer::part(launcher-new-thread) {
  display: none;
}
`}</style>
      )}
      <CopilotKit
        runtimeUrl="/api/copilotkit-threads"
        agent={AGENT_ID}
        enableInspector={nestedInspectorSetting}
      >
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <div className="flex shrink-0 flex-wrap items-center gap-4 border-b border-slate-200 px-4 py-1.5 text-xs text-slate-600 dark:border-slate-800 dark:text-slate-400">
            <label className="flex items-center gap-1.5">
              Thread ownership
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as Mode)}
                className="rounded border border-slate-300 bg-transparent px-1 py-0.5 dark:border-slate-700"
              >
                <option value="shared">shared configuration (startNewThread)</option>
                <option value="controlled">controlled (threadId prop)</option>
              </select>
            </label>
            <label className="flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={hideDrawerNew}
                onChange={(e) => setHideDrawerNew(e.target.checked)}
              />
              Hide the drawer&apos;s own new-conversation controls
            </label>
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            {mode === "shared" ? (
              <SharedChat key="shared" />
            ) : (
              <ControlledChat key="controlled" />
            )}
          </div>
        </div>
      </CopilotKit>
    </DemoFrame>
  );
}

/** The doc's button: same `startNewThread()` the drawer's own row calls. */
function NewConversationButton() {
  const configuration = useCopilotChatConfiguration();

  return (
    <button
      type="button"
      onClick={() => configuration?.startNewThread()}
      className="rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-700"
    >
      New conversation
    </button>
  );
}

function SharedChat() {
  return (
    <CopilotChatConfigurationProvider agentId={AGENT_ID}>
      <div style={{ display: "flex", height: "100%" }}>
        <CopilotThreadsDrawer />
        <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
          <header className="flex shrink-0 justify-end px-3 py-2">
            <NewConversationButton />
          </header>
          <div style={{ flex: 1, minHeight: 0 }}>
            <CopilotChat />
          </div>
        </main>
      </div>
    </CopilotChatConfigurationProvider>
  );
}

/**
 * The doc's controlled variant. With `threadId` set on the provider, the
 * app owns the thread: `startNewThread()` and the drawer's built-in row
 * selection become no-ops (with a console warning), so the drawer gets
 * `onThreadSelect` / `onNewThread` and the button shares `startNew`.
 *
 * Additions to the doc's snippet: `agentId` on the provider (the doc's sample
 * relies on the default agent) and the flex layout from the shared mode.
 */
function ControlledChat() {
  const [threadId, setThreadId] = useState(() => crypto.randomUUID());
  const startNew = () => setThreadId(crypto.randomUUID());

  return (
    <CopilotChatConfigurationProvider agentId={AGENT_ID} threadId={threadId}>
      <div style={{ display: "flex", height: "100%" }}>
        <CopilotThreadsDrawer
          onThreadSelect={(id) => setThreadId(id)}
          onNewThread={startNew}
        />
        <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
          <header className="flex shrink-0 items-center justify-end gap-3 px-3 py-2">
            <span className="font-mono text-[10px] text-slate-500">
              threadId: {threadId.slice(0, 8)}…
            </span>
            <button
              type="button"
              onClick={startNew}
              className="rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-700"
            >
              New conversation
            </button>
          </header>
          <div style={{ flex: 1, minHeight: 0 }}>
            <CopilotChat />
          </div>
        </main>
      </div>
    </CopilotChatConfigurationProvider>
  );
}
