"use client";

import { useState } from "react";
import { CopilotChat } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

import { MarkdownProviders, OwnPromptProviders } from "../providers";

type Mode = "context" | "own-prompt";

/**
 * The page's markdown-transport provider, and its `sendContext: false`
 * variant for backends that build their own prompt. Switching remounts the
 * provider and starts a fresh conversation.
 */
export default function Page() {
  const [mode, setMode] = useState<Mode>("context");

  return (
    <DemoFrame parentPath="/generative-ui/components/markdown-mode" subtitle="agent: genui">
      <div className="flex h-full flex-col">
        <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-slate-200 px-4 py-2 dark:border-slate-800">
          {(["context", "own-prompt"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-md px-3 py-1 font-mono text-xs font-medium ${
                mode === m
                  ? "bg-[var(--accent)] text-white"
                  : "border border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-300"
              }`}
            >
              {m === "context" ? 'transport: "markdown"' : "sendContext: false"}
            </button>
          ))}
        </div>
        <div className="min-h-0 flex-1">
          {mode === "context" ? (
            <MarkdownProviders key="context">
              <CopilotChat className="h-full" />
            </MarkdownProviders>
          ) : (
            <OwnPromptProviders key="own-prompt">
              <CopilotChat className="h-full" />
            </OwnPromptProviders>
          )}
        </div>
      </div>
    </DemoFrame>
  );
}
