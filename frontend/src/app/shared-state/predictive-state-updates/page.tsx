import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/shared-state/predictive-state-updates" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          An agent&apos;s state changes discontinuously — only when something
          explicitly writes it. But a single operation can take many seconds and
          contain sub-steps the user would want to see. Predictive state updates
          are the fix: the agent reports progress as it goes, through a tool
          whose only job is to write the running list into state.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Plan a three-course dinner party for six, including shopping and timings",
              "Walk through how you'd migrate a REST API to GraphQL",
            ]}
            expect="Steps appear in the left pane one at a time while the agent works, with a 'Working' badge, rather than all at once when it finishes."
            fail="Steps appear only after the reply completes — the agent batched its step_progress calls to the end instead of reporting as it went."
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/shared-state/predictive-state-updates/demo-chat/page.tsx" />
      </Panel>

      <Panel title="The agent">
        <SourceCode file="backend/src/agents/predictive_state_updates_agent.py" region="agent" />
      </Panel>

      <Callout tone="warn" title="useAgent takes no render prop">
        <p>
          The page&apos;s frontend sample calls{" "}
          <code>useAgent({"{ agentId, render: ({ state }) => … }"})</code> to
          add a &quot;state renderer&quot;, alongside a second{" "}
          <code>useAgent</code> reading <code>agent.state</code> for a separate
          &quot;Final Steps&quot; list. Neither works as written:{" "}
          <code>UseAgentProps</code> has no <code>render</code> field, and the
          two lists would read the same array anyway, since{" "}
          <code>step_progress</code> overwrites one key. This route renders one
          list with a live badge.
        </p>
      </Callout>

      <Callout tone="info" title="The final state wins">
        <p>
          Intermediate updates are for feedback, not for durability. When the
          run ends its final state is the single source of truth, so anything
          you want kept has to be in it — otherwise it is overwritten when the
          operation completes.
        </p>
      </Callout>

      <Callout tone="info" title="Related, and easy to confuse">
        <p>
          <a
            href="/shared-state/streaming"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            State streaming
          </a>{" "}
          forwards a tool argument into state <em>while the argument is being
          generated</em> — sub-token granularity, configured with{" "}
          <code>PredictStateMapping</code>. This route is coarser and needs no
          configuration: the model simply calls a tool more than once. Reach for
          streaming when one long value is being written, and for this when
          there are discrete steps to report.
        </p>
      </Callout>
    </>
  );
}
