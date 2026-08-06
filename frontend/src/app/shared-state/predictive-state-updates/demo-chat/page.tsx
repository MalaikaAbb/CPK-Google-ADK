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
  // const { agent } = useAgent({
  //   agentId: AGENT_ID,
  //   updates: [UseAgentUpdate.OnStateChanged, UseAgentUpdate.OnRunStatusChanged],
  // });

  // const state = agent.state as Partial<AgentState> | undefined;
  // const steps = state?.observed_steps ?? [];

  // Get access to both predicted and final states
    const { agent } = useAgent({ agentId: AGENT_ID });
    // Add a state renderer to observe predictions
    useAgent({
        agentId: AGENT_ID,
        render: ({ state }) => {
            if (!state.observed_steps?.length) return null;
            return (
                <div>
                    <h3>Current Progress:</h3>
                    <ul>
                        {state.observed_steps.map((step, i) => (
                            <li key={i}>{step}</li>
                        ))}
                    </ul>
                </div>
            );
        },
    });
  return (
    <main className="flex h-full min-h-0 flex-col overflow-hidden p-8">

      <div>
            <h1>Agent Progress</h1>
            {agent.state?.observed_steps?.length > 0 && (
                <div>
                    <h3>Final Steps:</h3>
                    <ul>
                        {agent.state.observed_steps.map((step, i) => (
                            <li key={i}>{step}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    </main>
  );
}
