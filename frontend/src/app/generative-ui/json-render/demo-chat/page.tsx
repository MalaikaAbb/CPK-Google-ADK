"use client";

import { useState } from "react";

import { DemoErrorBoundary } from "@/components/demo-error-boundary";
import { DemoFrame } from "@/components/demo-frame";

import ByocJsonRenderDemo from "../byoc-json-render-demo";
import ByocJsonRenderFixedDemo from "../json-render-fixed";

type Mode = "as published" | "fixed";

/**
 * The page's demo exactly as published, which throws on the first spec, next
 * to a working version (../json-render-fixed.tsx). Both bring their own
 * `<CopilotKit>` against /api/copilotkit-byoc-json-render, so switching
 * remounts the provider and starts a fresh conversation.
 */
export default function Page() {
  const [mode, setMode] = useState<Mode>("as published");

  return (
    <DemoFrame parentPath="/generative-ui/json-render" subtitle="agent: byoc_json_render">
      <div className="flex h-full flex-col">
        <div className="flex shrink-0 items-center gap-2 border-b border-slate-200 px-4 py-2 dark:border-slate-800">
          {(["as published", "fixed"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-md px-3 py-1 text-xs font-medium ${
                mode === m
                  ? "bg-[var(--accent)] text-white"
                  : "border border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-300"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <div className="min-h-0 flex-1">
          {mode === "as published" ? (
            <DemoErrorBoundary key="as-published">
              <ByocJsonRenderDemo />
            </DemoErrorBoundary>
          ) : (
            <ByocJsonRenderFixedDemo key="fixed" />
          )}
        </div>
      </div>
    </DemoFrame>
  );
}
