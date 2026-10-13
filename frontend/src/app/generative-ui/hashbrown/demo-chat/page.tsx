"use client";

import { useState } from "react";

import { DemoErrorBoundary } from "@/components/demo-error-boundary";
import { DemoFrame } from "@/components/demo-frame";

import ByocHashbrownDemo from "../byoc-hashbrown-demo";
import ByocHashbrownFixedDemo from "../hashbrown-fixed";

type Mode = "as published" | "fixed";

/**
 * The page's demo exactly as published, which throws on the first reply, next
 * to a working version (../hashbrown-fixed.tsx). Both bring their own
 * `<CopilotKit>` against /api/copilotkit-byoc-hashbrown, so switching
 * remounts the provider and starts a fresh conversation.
 */
export default function Page() {
  const [mode, setMode] = useState<Mode>("as published");

  return (
    <DemoFrame parentPath="/generative-ui/hashbrown" subtitle="agent: byoc_hashbrown">
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
              <ByocHashbrownDemo />
            </DemoErrorBoundary>
          ) : (
            <ByocHashbrownFixedDemo key="fixed" />
          )}
        </div>
      </div>
    </DemoFrame>
  );
}
