"use client";

import { useState } from "react";
import { CopilotChat, CopilotKitProvider } from "@copilotkit/react-core/v2";
import { standardUI } from "@copilotkit/react-core/v2/generative-ui";

import { DemoFrame } from "@/components/demo-frame";
import { nestedInspectorSetting } from "@/lib/inspector";

type Mode = "tool" | "markdown" | "agentIds";

const LABELS: Record<Mode, string> = {
  tool: "tool (default)",
  markdown: 'transport: "markdown"',
  agentIds: 'agentIds: ["shop"]',
};

/**
 * The page's three provider snippets, verbatim apart from `runtimeUrl` (this
 * repo's components runtime, built from the page's `generativeUI: true`
 * runtime snippet). The agent is registered as `default`, so the
 * `agentIds: ["shop"]` mode is the page's "other agents get nothing" case.
 * Switching remounts the provider and starts a fresh conversation.
 */
export default function Page() {
  const [mode, setMode] = useState<Mode>("tool");

  return (
    <DemoFrame parentPath="/generative-ui/components/transports" subtitle="agent: genui (registered as default)">
      <div className="flex h-full flex-col">
        <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-slate-200 px-4 py-2 dark:border-slate-800">
          {(Object.keys(LABELS) as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-md px-3 py-1 font-mono text-xs font-medium ${
                mode === m
                  ? "bg-[var(--accent)] text-white"
                  : "border border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-300"
              }`}
            >
              {LABELS[m]}
            </button>
          ))}
        </div>
        <div className="min-h-0 flex-1">
          {mode === "tool" && (
            <CopilotKitProvider key="tool" runtimeUrl="/api/copilotkit-genui" enableInspector={nestedInspectorSetting} generativeUI={{ ui: standardUI }}>
              <CopilotChat className="h-full" />
            </CopilotKitProvider>
          )}
          {mode === "markdown" && (
            <CopilotKitProvider key="markdown" runtimeUrl="/api/copilotkit-genui" enableInspector={nestedInspectorSetting} generativeUI={{ ui: standardUI, transport: "markdown" }}>
              <CopilotChat className="h-full" />
            </CopilotKitProvider>
          )}
          {mode === "agentIds" && (
            <CopilotKitProvider
              key="agentIds"
              runtimeUrl="/api/copilotkit-genui"
              enableInspector={nestedInspectorSetting}
              generativeUI={{ ui: standardUI, agentIds: ["shop"] }}
            >
              <CopilotChat className="h-full" />
            </CopilotKitProvider>
          )}
        </div>
      </div>
    </DemoFrame>
  );
}
