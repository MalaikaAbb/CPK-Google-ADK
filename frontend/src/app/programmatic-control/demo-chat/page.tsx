"use client";

import { CopilotSidebar, useAgent, useCopilotKit } from "@copilotkit/react-core/v2";
import { useCallback, useState } from "react";

import { DemoFrame } from "@/components/demo-frame";

import {
  buildContent,
  useAttachmentsConfig,
  useAutoScroll,
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
  const run = async () => {
    if (agent.isRunning) return;
    agent.addMessage({
      id: crypto.randomUUID(),
      role: "user",
      content: "Summarize the latest sales data",
    });
    try {
      await copilotkit.runAgent({ agent });
    } catch (error) {
      console.error("CopilotKit runAgent failed:", error);
    }
  };
  return (
    <>
      <button onClick={run} disabled={agent.isRunning}>
        Run agent
      </button>
      <button
        onClick={() => copilotkit.stopAgent({ agent })}
        disabled={!agent.isRunning}
      >
        Stop
      </button>
      <CopilotSidebar agentId={agentId} defaultOpen={true} />
    </>
  );
}
