"use client";

import { useAgent, useCopilotKit } from "@copilotkit/react-core/v2";
import { useEffect, useRef, useState } from "react";

import { DemoFrame } from "@/components/demo-frame";

const AGENT_ID = "agentic_chat";

type Captured = { seq: number; type: string; detail?: string };

/**
 * A raw capture of the AG-UI event stream flowing through the runtime.
 *
 * `agent.subscribe` takes every protocol callback, so this is the honest
 * answer to "what is actually going over the wire" — the same events
 * <CopilotChat> consumes, just printed instead of rendered. Text deltas are
 * counted rather than listed, since a single reply produces hundreds and the
 * interesting structure is the lifecycle around them.
 */
export default function Page() {
  return (
    <DemoFrame parentPath="/backend/copilot-runtime" subtitle={`agent: ${AGENT_ID}`}>
      <Capture />
    </DemoFrame>
  );
}

function Capture() {
  const { agent } = useAgent({ agentId: AGENT_ID });
  const { copilotkit } = useCopilotKit();
  const [events, setEvents] = useState<Captured[]>([]);
  const [input, setInput] = useState("Hello");
  const seq = useRef(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const push = (type: string, detail?: string) =>
      setEvents((e) => [...e, { seq: seq.current++, type, detail }]);

    const sub = agent.subscribe({
      onRunStartedEvent: () => push("RUN_STARTED"),
      onTextMessageStartEvent: () => push("TEXT_MESSAGE_START"),
      onTextMessageContentEvent: ({ event }) =>
        setEvents((e) => {
          // Collapse the delta burst into one counted row.
          const last = e[e.length - 1];
          if (last?.type === "TEXT_MESSAGE_CONTENT") {
            const n = Number(last.detail?.match(/\d+/)?.[0] ?? 0) + 1;
            return [...e.slice(0, -1), { ...last, detail: `${n} deltas` }];
          }
          return [
            ...e,
            {
              seq: seq.current++,
              type: "TEXT_MESSAGE_CONTENT",
              detail: `1 delta (${event.delta?.length ?? 0} chars)`,
            },
          ];
        }),
      onTextMessageEndEvent: () => push("TEXT_MESSAGE_END"),
      onToolCallStartEvent: ({ event }) =>
        push("TOOL_CALL_START", event.toolCallName),
      onToolCallEndEvent: () => push("TOOL_CALL_END"),
      onStateSnapshotEvent: () => push("STATE_SNAPSHOT"),
      onStateDeltaEvent: () => push("STATE_DELTA"),
      onCustomEvent: ({ event }) => push("CUSTOM", event.name),
      onRunFinishedEvent: () => push("RUN_FINISHED"),
      onRunFailed: () => push("RUN_FAILED"),
    });
    return () => sub.unsubscribe();
  }, [agent]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [events.length]);

  const send = () => {
    if (!input.trim() || agent.isRunning) return;
    agent.addMessage({
      id: crypto.randomUUID(),
      role: "user",
      content: input,
    });
    void copilotkit
      .runAgent({ agent })
      .catch((err) => console.error("[copilot-runtime] runAgent", err));
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-slate-200 p-4 dark:border-slate-800">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
        />
        <button
          onClick={send}
          disabled={agent.isRunning}
          className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
        >
          Run
        </button>
        <button
          onClick={() => setEvents([])}
          className="text-xs text-slate-500 underline underline-offset-4"
        >
          Clear
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {events.length === 0 ? (
          <p className="py-16 text-center text-sm text-slate-400">
            Press Run and watch the protocol.
          </p>
        ) : (
          <ol className="space-y-0.5">
            {events.map((e) => (
              <li
                key={e.seq}
                className="flex items-baseline gap-3 rounded px-2 py-1 font-mono text-xs odd:bg-slate-50 dark:odd:bg-slate-800/40"
              >
                <span className="w-8 shrink-0 text-right text-slate-400">
                  {e.seq}
                </span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {e.type}
                </span>
                {e.detail && (
                  <span className="text-slate-500">{e.detail}</span>
                )}
              </li>
            ))}
          </ol>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
