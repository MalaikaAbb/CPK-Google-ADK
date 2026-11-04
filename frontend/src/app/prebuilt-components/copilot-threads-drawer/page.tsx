import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/prebuilt-components/copilot-threads-drawer" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A conversation sidebar with <em>no active-thread state of your own</em>.
          The drawer and the chat sit inside one{" "}
          <code>CopilotChatConfigurationProvider</code>, and that shared
          configuration holds the active thread — so selecting a row connects
          the chat to that thread and replays its history, and
          &ldquo;New Conversation&rdquo; resets it to a welcome screen. No
          <code> threadId</code> state, no selection handler, no props between
          the two components.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Under the hood it wraps a self-contained{" "}
          <code>copilotkit-threads-drawer</code> web component fed by{" "}
          <code>useThreads</code> — the same data the{" "}
          <a
            href="/headless-threads"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            Headless Threads
          </a>{" "}
          route reads directly.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Send a message, then press New Conversation and send another",
              "Click back to the first row",
              "Press the header's own 'New conversation' button",
              "Tick 'Hide the drawer's own new-conversation controls'",
              "Switch Thread ownership to 'controlled' and repeat",
            ]}
            expect="Two rows in the drawer. Clicking the first replays its messages into the chat without a page reload. The row menu offers archive and delete. The header button shows the welcome screen with no row highlighted, and the new thread only gets a row after its first run. With the checkbox ticked, the drawer's New Conversation row and the collapsed launcher's (+) disappear. In controlled mode the threadId shown in the header changes on every new conversation and row click."

            fail="A locked panel offering an upgrade instead of a list — that is the license gate, not a wiring bug. See the two switches below."
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/prebuilt-components/copilot-threads-drawer/demo-chat/page.tsx" />
      </Panel>

      <Callout tone="warn" title="Two independent switches, and they fail differently">
        <p>
          Threads need <strong>Intelligence mode</strong> — the runtime built
          with <code>INTELLIGENCE_API_KEY</code>. Without it the runtime falls
          back to SSE with an in-memory runner: the list answers locally,
          nothing survives a restart, and mutations are off.
        </p>
        <p className="mt-2">
          The drawer&apos;s <em>UI</em> needs a <strong>license</strong> —
          either <code>publicLicenseKey</code> on the provider (what the doc&apos;s
          own sample passes) or <code>licenseToken</code> on the runtime. The
          drawer gates on the reported license status, <em>not</em> on whether
          thread endpoints respond. So a runtime can serve threads perfectly
          while every drawer shows an Upgrade button.
        </p>
        <p className="mt-2">
          Set both. This harness reads them from{" "}
          <code>INTELLIGENCE_API_KEY</code> and{" "}
          <code>NEXT_PUBLIC_COPILOTKIT_PUBLIC_LICENSE_KEY</code> —{" "}
          see <code>.env.example</code>.
        </p>
      </Callout>

      <Panel
        title="What makes it work"
        description="The runtime that serves threads, and the provider that identifies whose they are."
      >
        <SourceCodeGroup
          files={[
            { file: "frontend/src/lib/copilot-runtime.ts" },
            { file: "frontend/src/components/providers.tsx" },
          ]}
          note={
            <>
              Threads are per-user: <code>identifyUser</code> on the runtime
              reads the <code>x-user-id</code> header the provider sends.
              Without that pairing every visitor of a deployed copy shares one
              history.
            </>
          }
        />
      </Panel>

      <Callout tone="info" title="Your own New conversation button">
        <p>
          The header button calls <code>startNewThread()</code> from{" "}
          <code>useCopilotChatConfiguration()</code>, which is the same function
          the drawer&apos;s own row calls. It only works inside the shared{" "}
          <code>CopilotChatConfigurationProvider</code>. Outside one, the hook
          returns <code>null</code> and the click does nothing.
        </p>
        <p className="mt-2">
          Once the provider gets a <code>threadId</code> prop (the
          &ldquo;controlled&rdquo; mode), the app owns the thread.{" "}
          <code>startNewThread()</code> and the drawer&apos;s built-in row
          selection become no-ops that log a warning, so the drawer needs{" "}
          <code>onThreadSelect</code> and <code>onNewThread</code>. The
          drawer&apos;s own controls can be hidden through the{" "}
          <code>new-thread-button</code> and <code>launcher-new-thread</code>{" "}
          CSS parts.
        </p>
      </Callout>

      <Callout tone="info" title="Which agent's threads it lists">
        <p>
          One agent only, resolved in this order: the drawer&apos;s{" "}
          <code>agentId</code> prop, then the nearest{" "}
          <code>CopilotChatConfigurationProvider</code>&apos;s{" "}
          <code>agentId</code> (<code>&lt;CopilotKit agent&gt;</code> renders
          one), then <code>agentId</code> on <code>CopilotKitProvider</code>,
          then <code>&quot;default&quot;</code>. Here the provider pins{" "}
          <code>my_agent</code>, so the drawer and the chat move together.
          Passing <code>agentId</code> to the drawer alone would split them.
        </p>
      </Callout>

      <Callout tone="info" title="Rename is missing on purpose">
        <p>
          The drawer&apos;s row menu covers archive, unarchive and delete — but
          not rename. The doc names that as the main reason to drop to{" "}
          <code>useThreads</code>, which is exactly what the{" "}
          <a
            href="/headless-threads"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            Headless Threads
          </a>{" "}
          route does.
        </p>
      </Callout>
    </>
  );
}
