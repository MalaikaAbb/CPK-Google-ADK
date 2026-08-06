import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/programmatic-control" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Driving an agent from code rather than from a composer — a button, a
          form, a cron job, a keyboard shortcut. This route runs the page&apos;s
          own <code>headless-complete</code> send pipeline verbatim, so what you
          see is the doc&apos;s code against this repo&apos;s agent.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Press the second suggestion, then press Stop while it streams",
            ]}
            expect="Status flips to Running, the transcript grows token by token and follows the bottom. Stop halts it mid-sentence; Reset aborts and clears."
            fail="The first press silently no-ops — the runtime handshake had not resolved yet, so runAgent raced it."
          />
        </div>
      </Panel>

      <Panel title="The three primitives">
        <dl className="space-y-2 text-sm">
          {[
            [
              "agent.addMessage(…)",
              "Append to the conversation without running. Pair with runAgent when the appended message should kick off a turn.",
            ],
            [
              "copilotkit.runAgent({ agent })",
              "The same entry point <CopilotChat> calls. Orchestrates frontend tools, follow-up runs, and the subscriber lifecycle.",
            ],
            [
              "copilotkit.stopAgent({ agent })",
              "Cancel mid-run. agent.abortRun() is the lower-level form the reset handler falls back to.",
            ],
          ].map(([name, desc]) => (
            <div key={name} className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
              <dt className="shrink-0 font-mono text-xs text-slate-900 sm:w-56 dark:text-slate-100">
                {name}
              </dt>
              <dd className="text-slate-600 dark:text-slate-400">{desc}</dd>
            </div>
          ))}
        </dl>
      </Panel>

      

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/programmatic-control/demo-chat/page.tsx" />
      </Panel>

      {/* <Panel title="The reconstructed helpers">
        <SourceCode file="frontend/src/app/programmatic-control/headless-helpers.ts" />
      </Panel> */}

      <Panel title="The agent">
        <SourceCodeGroup
          files={[{ file: "backend/src/agents/shared_chat.py", region: "builders" }]}
          note="Nothing special server-side — programmatic control drives the same agent a chat component would."
        />
      </Panel>

      <Callout tone="info" title="copilotkit.runAgent vs agent.runAgent">
        <p>
          Both trigger the agent, at different levels.{" "}
          <code>copilotkit.runAgent({"{ agent }"})</code> is the one to reach
          for: it executes frontend tools, chains follow-up runs, and routes
          errors through the subscriber system.{" "}
          <code>agent.runAgent(options)</code> sends the request and does none
          of that — useful only when you specifically want the raw send.
        </p>
      </Callout>

      <Callout tone="warn" title="The interrupt-resolution half does not apply">
        <p>
          A large part of the doc page covers resolving a paused run from a
          button, via <code>agent.subscribe</code> plus{" "}
          <code>copilotkit.runAgent({"{ agent, forwardedProps: { command: { resume } } }"})</code>
          . That is gated on the runtime exposing an interrupt primitive, and
          ADK has none — the page&apos;s own fallback text says to use{" "}
          <a
            href="/human-in-the-loop"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            useHumanInTheLoop
          </a>{" "}
          instead. The three primitives above are unaffected; only the resume
          path is framework-specific.
        </p>
      </Callout>
    </>
  );
}
