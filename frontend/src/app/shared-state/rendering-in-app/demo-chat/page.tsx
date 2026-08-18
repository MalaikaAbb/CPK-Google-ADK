"use client";

import {
  CopilotSidebar,
  UseAgentUpdate,
  useAgent,
} from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

import { NotesCard, PreferencesCard, type Preferences } from "../../notes-card";

const AGENT_ID = "shared-state-read-write";

type RWAgentState = {
  notes?: string[];
  preferences?: Preferences;
};

const DEFAULT_PREFERENCES: Preferences = { tone: "neutral", detail: "normal" };

/**
 * The same agent and the same state as /shared-state, laid out the other way
 * round: the canvas is the primary content and the chat is docked beside it.
 *
 * That is the entire point of the page. `<Canvas>` and `<CopilotSidebar>` both
 * call `useAgent` for the same id, so they share one agent instance and one
 * state object. There is nothing chat-specific about reading `agent.state` —
 * the sidebar is not special.
 *
 * The doc's `Canvas` sample types state as a placeholder `{ title, items }`
 * shape for illustration only — it was never meant to be copied verbatim
 * against a real agent. This route's agent (`shared-state-read-write`) only
 * ever writes `notes`/`preferences` (see `set_notes` in
 * shared_state_read_write_agent.py), so the canvas renders those through the
 * same `NotesCard`/`PreferencesCard` components `/shared-state` uses —
 * otherwise `state.items` is always undefined and nothing renders.
 */
export default function Page() {
  return (
    <DemoFrame
      parentPath="/shared-state/rendering-in-app"
      subtitle={`agent: ${AGENT_ID}`}
    >
      <div className="grid h-full grid-cols-1 lg:grid-cols-[1fr_24rem]">
        <Canvas />
        <div className="min-h-0 border-t border-slate-200 lg:border-l lg:border-t-0 dark:border-slate-800">
          <CopilotSidebar agentId={AGENT_ID} defaultOpen />
        </div>
      </div>
    </DemoFrame>
  );
}

function Canvas() {
  // Subscribe this component to agent state changes, same as `/shared-state`.
  // The chat can be a sidebar, a popup, or absent — the canvas updates the
  // same way either way, which is the doc's actual point.
  const { agent } = useAgent({
    agentId: AGENT_ID,
    updates: [UseAgentUpdate.OnStateChanged],
  });

  const agentState = agent.state as RWAgentState | undefined;
  const notes = agentState?.notes ?? [];
  const preferences = agentState?.preferences ?? DEFAULT_PREFERENCES;

  // Writing back from the main view: the doc's `toggleItem` pattern, applied
  // to this agent's real state shape instead of the placeholder `items` list.
  const handlePreferencesChange = (next: Preferences) => {
    agent.setState({
      ...(agentState as object | undefined),
      preferences: next,
      notes: agentState?.notes ?? [],
    } as RWAgentState);
  };

  const handleClearNotes = () => {
    agent.setState({
      ...(agentState as object | undefined),
      notes: [],
    } as RWAgentState);
  };

  return (
    <main className="canvas min-h-0 space-y-4 overflow-y-auto p-6">
      <NotesCard notes={notes} onClear={handleClearNotes} />
      <PreferencesCard
        preferences={preferences}
        onChange={handlePreferencesChange}
      />
    </main>
  );
}
