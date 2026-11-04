"use client";

import { useState } from "react";
import { CopilotChat, CopilotKitProvider } from "@copilotkit/react-core/v2";
import { standardUI } from "@copilotkit/react-core/v2/generative-ui";

import { DemoFrame } from "@/components/demo-frame";
import { nestedInspectorSetting } from "@/lib/inspector";

import { appUI as extendsUI } from "../app-ui-extends";
import { appUI as omitUI } from "../app-ui-omit";
import { appUI as overridesUI } from "../app-ui-overrides";

/**
 * The page's "use it as it is" provider, `generativeUI={{ ui: standardUI }}`,
 * and the same provider with each of the page's three `appUI` variants. Each
 * variant is the doc snippet verbatim in its own file. `runtimeUrl` is this
 * repo's components runtime. Switching remounts the provider and starts a
 * fresh conversation.
 */
const MODES = {
  standardUI: { label: "standardUI", ui: standardUI },
  extends: { label: "extends + ProductCard", ui: extendsUI },
  omit: { label: "omit Map / Video / HtmlView", ui: omitUI },
  overrides: { label: "overrides: Card → MyCard", ui: overridesUI },
} as const;

type Mode = keyof typeof MODES;

export default function Page() {
  const [mode, setMode] = useState<Mode>("standardUI");

  return (
    <DemoFrame parentPath="/generative-ui/components/standard-catalog" subtitle="agent: genui">
      <div className="flex h-full flex-col">
        <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-slate-200 px-4 py-2 dark:border-slate-800">
          {(Object.keys(MODES) as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-md px-3 py-1 text-xs font-medium ${
                mode === m
                  ? "bg-[var(--accent)] text-white"
                  : "border border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-300"
              }`}
            >
              {MODES[m].label}
            </button>
          ))}
        </div>
        <div className="min-h-0 flex-1">
          {mode === "standardUI" && (
            <CopilotKitProvider key="standardUI" runtimeUrl="/api/copilotkit-genui" enableInspector={nestedInspectorSetting} generativeUI={{ ui: standardUI }}>
              <CopilotChat className="h-full" />
            </CopilotKitProvider>
          )}
          {mode === "extends" && (
            <CopilotKitProvider key="extends" runtimeUrl="/api/copilotkit-genui" enableInspector={nestedInspectorSetting} generativeUI={{ ui: extendsUI }}>
              <CopilotChat className="h-full" />
            </CopilotKitProvider>
          )}
          {mode === "omit" && (
            <CopilotKitProvider key="omit" runtimeUrl="/api/copilotkit-genui" enableInspector={nestedInspectorSetting} generativeUI={{ ui: omitUI }}>
              <CopilotChat className="h-full" />
            </CopilotKitProvider>
          )}
          {mode === "overrides" && (
            <CopilotKitProvider key="overrides" runtimeUrl="/api/copilotkit-genui" enableInspector={nestedInspectorSetting} generativeUI={{ ui: overridesUI }}>
              <CopilotChat className="h-full" />
            </CopilotKitProvider>
          )}
        </div>
      </div>
    </DemoFrame>
  );
}
