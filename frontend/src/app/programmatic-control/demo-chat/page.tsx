"use client";

import { useAgent, useCopilotKit } from "@copilotkit/react-core/v2";
import { useCallback, useState } from "react";

import { DemoFrame } from "@/components/demo-frame";
import {
  useAttachmentsConfig,
  useAutoScroll,
  buildContent,
} from "../headless-helpers";


const AGENT_ID = "programmatic-control";

const SUGGESTIONS = [
  "Write one sentence about agent-native apps.",
  "Explain the AG-UI protocol in about 200 words.",
];

/**
 * The doc's `headless-complete` send pipeline, run against this repo's agent.
 *
 * Everything between `useAgent` and `handleReset` is the page's own snippet.
 * What it demonstrates is the three primitives the page is actually about:
 *
 *   agent.addMessage(...)            append without running
 *   copilotkit.runAgent({ agent })   run — the entry point <CopilotChat> uses
 *   copilotkit.stopAgent({ agent })  cancel mid-run
 *
 * The scaffolding it leans on — `useAttachmentsConfig`, `useAutoScroll`,
 * `buildContent` — is never printed in the docs, so it lives in
 * `../headless-helpers.ts` and is why this route is marked Partial.
 */
export default function Page() {
  return (
    <DemoFrame parentPath="/programmatic-control" subtitle={`agent: ${AGENT_ID}`}>
      <Chat agentId={AGENT_ID} />
    </DemoFrame>
  );
}

function Chat({ agentId }: { agentId: string }) {
   const { agent } = useAgent({ agentId });
  const { copilotkit } = useCopilotKit();

  const {
    attachments,
    fileInputRef,
    containerRef,
    handleFileUpload,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    dragOver,
    removeAttachment,
    consumeAttachments,
  } = useAttachmentsConfig();

  const [input, setInput] = useState("");
  const messages = agent.messages;
  const { listRef, bottomRef, stickRef } = useAutoScroll(
    messages,
    agent.isRunning,
  );

  // Send pipeline: consume any ready attachments at submit time, build
  // the multimodal `content` array if needed, then dispatch the run.
  const sendText = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      // Consume queued uploads first so they get sent even if the user
      // didn't type any text alongside them.
      const ready = consumeAttachments();
      if (!trimmed && ready.length === 0) return;
      if (agent.isRunning) return;

      stickRef.current = true;

      const content = buildContent(trimmed, ready);
      agent.addMessage({
        id: crypto.randomUUID(),
        role: "user",
        content,
      });
      void copilotkit
        .runAgent({ agent })
        .catch((err) =>
          console.error("[headless-complete] runAgent failed", err),
        );
    },
    [agent, copilotkit, consumeAttachments],
  );

  const handleSend = useCallback(() => {
    sendText(input);
    setInput("");
  }, [input, sendText]);

  const handleSuggestion = useCallback(
    (text: string) => {
      sendText(text);
    },
    [sendText],
  );

  // Cancel mid-run without clearing the transcript — the doc's third
  // primitive, `copilotkit.stopAgent({ agent })`.
  const handleStop = useCallback(() => {
    void copilotkit
      .stopAgent({ agent })
      .catch((err) =>
        console.error("[headless-complete] stopAgent failed", err),
      );
  }, [agent, copilotkit]);

  const handleReset = useCallback(() => {
    if (agent.isRunning) {
      try {
        agent.abortRun();
      } catch {
        // no-op: some transports don't support abort
      }
    }
    agent.setMessages([]);
    setInput("");
    stickRef.current = true;
  }, [agent]);

  return (
    <div className="flex h-full flex-col">
      <div
        ref={containerRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex min-h-0 flex-1 flex-col ${
          dragOver ? "bg-blue-50 dark:bg-blue-950/30" : ""
        }`}
      >
        <div
          ref={listRef}
          className="flex-1 space-y-2 overflow-y-auto px-4 py-3 text-sm"
        >
          {messages.map((m) => (
            <div key={m.id} className="whitespace-pre-wrap">
              <span className="font-medium">{m.role}: </span>
              {typeof m.content === "string" ? m.content : JSON.stringify(m.content)}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {attachments.length > 0 && (
          <ul className="shrink-0 space-y-1 border-t px-4 py-2 text-xs">
            {attachments.map((a) => (
              <li key={a.id} className="flex items-center gap-2">
                {a.filename}
                <button type="button" onClick={() => removeAttachment(a.id)}>
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex shrink-0 items-center gap-2 border-t px-4 py-3">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileUpload}
          />
          <button type="button" onClick={() => fileInputRef.current?.click()}>
            📎
          </button>
          <input
            className="flex-1 rounded border px-2 py-1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            placeholder="Type a message…"
          />
          <button type="button" onClick={handleSend} disabled={agent.isRunning}>
            Send
          </button>
          <button
            type="button"
            onClick={handleStop}
            disabled={!agent.isRunning}
          >
            Stop
          </button>
          <button type="button" onClick={handleReset}>
            Reset
          </button>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2 border-t px-4 py-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              className="rounded border px-2 py-1 text-xs"
              onClick={() => handleSuggestion(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
