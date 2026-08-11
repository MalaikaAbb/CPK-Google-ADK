"use client";

import { useAgent, useCopilotKit } from "@copilotkit/react-core/v2";
import { useCallback, useState } from "react";

import { DemoFrame } from "@/components/demo-frame";


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

  return (<></>)
}
