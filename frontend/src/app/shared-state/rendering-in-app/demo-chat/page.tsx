"use client";

import {
  CopilotSidebar,
  UseAgentUpdate,
  useAgent,
} from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

import { type Preferences } from "../../notes-card";
import { useEffect } from "react";

const AGENT_ID = "shared-state-read-write";

type CanvasState = {
  title: string;
  items: { id: string; label: string; done: boolean }[];
};
const INITIAL_CANVAS_STATE: CanvasState = {
  title: "Project launch",
  items: [
    { id: "research", label: "Research user needs", done: true },
    { id: "prototype", label: "Build a prototype", done: false },
  ],
};


/**
 * The same agent and the same state as /shared-state, laid out the other way
 * round: the canvas is the primary content and the chat is docked beside it.
 *
 * That is the entire point of the page. `<Canvas>` and `<CopilotSidebar>` both
 * call `useAgent` for the same id, so they share one agent instance and one
 * state object. There is nothing chat-specific about reading `agent.state` —
 * the sidebar is not special.
 */
export default function Page() {


  return (
    <DemoFrame
      parentPath="/shared-state/rendering-in-app"
      subtitle={`agent: ${AGENT_ID}`}
    >
      <div className="h-full overflow-hidden">
        <Canvas />
        <CopilotSidebar agentId={AGENT_ID} defaultOpen />
      </div>
    </DemoFrame>
  );
}

export function Canvas() {
  // No agentId means the "default" agent. Pass { agentId } to target another.
  const { agent, isReady } = useAgent({agentId: AGENT_ID});
  const state = (agent.state ?? {}) as Partial<CanvasState>;
  useEffect(() => {
    if (!isReady) return;
    const current = (agent.state ?? {}) as Partial<CanvasState>;
    const updates: Partial<CanvasState> = {};
    if (current.title === undefined) {
      updates.title = INITIAL_CANVAS_STATE.title;
    }
    if (current.items === undefined) {
      updates.items = INITIAL_CANVAS_STATE.items;
    }
    if (Object.keys(updates).length > 0) {
      agent.setState({ ...(agent.state ?? {}), ...updates });
    }
  }, [agent, isReady, state.title, state.items]);

  function toggleItem(id: string) {
  agent.setState({
    ...agent.state,
    items: (agent.state?.items ?? []).map((it) =>
      it.id === id ? { ...it, done: !it.done } : it,
    ),
  });
}

  return (
    <main className="canvas">
      <h1>{state.title ?? "Untitled"}</h1>
      <ul>
        {(state.items ?? []).map((item) => (
          <li key={item.id} data-done={item.done} onClick={() => toggleItem(item.id)} className={item.done ? "line-through" : ""}>
            {item.label}
          </li>
        ))}
      </ul>
    </main>
  );
}
