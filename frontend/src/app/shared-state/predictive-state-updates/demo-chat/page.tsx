"use client";

import {
  CopilotChat,
  UseAgentUpdate,
  useAgent,
} from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

const AGENT_ID = "predictive-state-updates";

type AgentState = {
  observed_steps: string[];
};

/**
 * Progress reported as it happens, rather than a spinner and then everything.
 *
 * The agent breaks a task into steps and calls `step_progress` after each one,
 * which overwrites `state["observed_steps"]` with the running list. Each call
 * is a state update the UI re-renders on.
 *
 * The doc's snippet renders this twice — once as "Current Progress" via a
 * `render` prop on `useAgent`, once as "Final Steps" from `agent.state`. That
 * prop does not exist on the shipped hook, and the two lists would show the
 * same array anyway, so there is one list here with a live indicator instead.
 */
export default function Page() {
  return (
    <DemoFrame
      parentPath="/shared-state/predictive-state-updates"
      subtitle={`agent: ${AGENT_ID}`}
    >
      <div className="grid h-full grid-cols-1 lg:grid-cols-[1fr_24rem]">
        <ProgressPane />
        <div className="min-h-0 border-t border-slate-200 lg:border-l lg:border-t-0 dark:border-slate-800">
          <CopilotChat agentId={AGENT_ID} className="h-full" />
        </div>
      </div>
    </DemoFrame>
  );
}

function ProgressPane() {
  const { agent } = useAgent({
    agentId: AGENT_ID,
    updates: [UseAgentUpdate.OnStateChanged, UseAgentUpdate.OnRunStatusChanged],
  });

  const state = agent.state as Partial<AgentState> | undefined;
  const steps = state?.observed_steps ?? [];

  return (
    <main className="flex h-full min-h-0 flex-col overflow-hidden p-8">
      <header className="flex shrink-0 flex-wrap items-center gap-2">
        <h1 className="font-mono text-sm font-semibold text-slate-900 dark:text-slate-100">
          state[&quot;observed_steps&quot;]
        </h1>
        {agent.isRunning && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            Live
          </span>
        )}
        <span className="ml-auto font-mono text-xs text-slate-400">
          {steps.length} steps
        </span>
      </header>

      <p className="mt-1 shrink-0 text-xs text-slate-500">
        Written by the agent&apos;s <code>step_progress</code> tool as it works,
        not after the run finishes.
      </p>

      <div className="mt-4 min-h-0 flex-1 overflow-y-auto rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        {steps.length > 0 ? (
          <ol className="space-y-2">
            {steps.map((step, i) => (
              <li
                key={`${i}-${step}`}
                className="flex gap-3 text-sm text-slate-800 dark:text-slate-200"
              >
                <span className="select-none font-mono text-xs text-slate-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="py-16 text-center text-sm text-slate-400">
            Give the agent a multi-step task and watch the plan arrive before
            the answer does.
          </p>
        )}
      </div>
    </main>
  );
}
