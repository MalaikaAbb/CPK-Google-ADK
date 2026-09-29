"use client";

import { CopilotChat } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

import { YourComponent } from "../your-component";

const AGENT_ID = "agent-app-context";

/**
 * `YourComponent` is the doc's, verbatim — including its `<>...</>` body,
 * which is why a literal "..." sits above the chat. Mounting it is what sends
 * the colleagues as context; the chat is harness-authored.
 */
export default function Page() {
  return (
    <DemoFrame parentPath="/agent-app-context" subtitle={`agent: ${AGENT_ID}`}>
      <div className="flex h-full flex-col">
        <div className="shrink-0 border-b border-slate-200 px-4 py-2 text-sm dark:border-slate-800">
          <YourComponent />
        </div>
        <div className="min-h-0 flex-1">
          <CopilotChat agentId={AGENT_ID} className="h-full" />
        </div>
      </div>
    </DemoFrame>
  );
}
