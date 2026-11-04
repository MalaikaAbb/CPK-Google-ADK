"use client";

import { useState } from "react";
import { CopilotChat, CopilotKitProvider } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";
import { nestedInspectorSetting } from "@/lib/inspector";

import { shopUI } from "../../_shop/catalog";
import { appUI } from "../app-ui";

type Mode = "shopUI" | "appUI";

/**
 * The page's provider line, `generativeUI={{ ui: shopUI }}`, verbatim, and the
 * same with the combined `appUI` (standard catalog + cartUI + Hero).
 * `runtimeUrl` is this repo's components runtime. Switching remounts the
 * provider, so each catalog starts a fresh conversation.
 */
export default function Page() {
  const [mode, setMode] = useState<Mode>("shopUI");

  return (
    <DemoFrame parentPath="/generative-ui/components/catalogs" subtitle="agent: genui">
      <div className="flex h-full flex-col">
        <div className="flex shrink-0 items-center gap-2 border-b border-slate-200 px-4 py-2 dark:border-slate-800">
          {(["shopUI", "appUI"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-md px-3 py-1 font-mono text-xs font-medium ${
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
          {mode === "shopUI" ? (
            <CopilotKitProvider key="shop" runtimeUrl="/api/copilotkit-genui" enableInspector={nestedInspectorSetting} generativeUI={{ ui: shopUI }}>
              <CopilotChat className="h-full" />
            </CopilotKitProvider>
          ) : (
            <CopilotKitProvider key="app" runtimeUrl="/api/copilotkit-genui" enableInspector={nestedInspectorSetting} generativeUI={{ ui: appUI }}>
              <CopilotChat className="h-full" />
            </CopilotKitProvider>
          )}
        </div>
      </div>
    </DemoFrame>
  );
}
