"use client";

import { useState } from "react";
import { CopilotChat, CopilotKitProvider } from "@copilotkit/react-core/v2";
import { standardUI } from "@copilotkit/react-core/v2/generative-ui";

import { DemoFrame } from "@/components/demo-frame";
import { nestedInspectorSetting } from "@/lib/inspector";

import { theme } from "../theme";

type Mode = "option" | "typed" | "per-mode" | "css";

const LABELS: Record<Mode, string> = {
  option: "theme option",
  typed: "GenerativeUITheme file",
  "per-mode": "light + dark values",
  css: "CSS variables only",
};

//#region color-scheme-script
const colorSchemeScript = `(() => {
  const media = matchMedia("(prefers-color-scheme: dark)");
  const apply = () => document.documentElement.classList.toggle("dark", media.matches);
  apply();
  media.addEventListener("change", apply);
})();`;
//#endregion

/**
 * Every theming snippet of the page on a standardUI chat. Verbatim: the
 * provider `theme` objects (the first three modes), `colorSchemeScript`, and
 * the `.a2ui-surface` CSS (fourth mode).
 *
 * Harness-authored: `runtimeUrl`, the mode switch, and the "dark ancestor"
 * checkbox. The page's script follows the system setting. The checkbox puts a
 * `dark` class on a wrapper, so both modes can be checked without changing the
 * OS theme. The page's script goes in `<head>`; here it runs in the body,
 * which only matters for the first-paint flash it exists to prevent.
 */
export default function Page() {
  const [mode, setMode] = useState<Mode>("option");
  const [forceDark, setForceDark] = useState(false);

  return (
    <DemoFrame parentPath="/generative-ui/components/theming" subtitle="agent: genui">
      <script dangerouslySetInnerHTML={{ __html: colorSchemeScript }} />
      {mode === "css" && (
        <style>{`
.a2ui-surface {
  --a2ui-color-accent: #d97706;
}
`}</style>
      )}
      <div className="flex h-full flex-col">
        <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-slate-200 px-4 py-2 dark:border-slate-800">
          {(Object.keys(LABELS) as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-md px-3 py-1 text-xs font-medium ${
                mode === m
                  ? "bg-[var(--accent)] text-white"
                  : "border border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-300"
              }`}
            >
              {LABELS[m]}
            </button>
          ))}
          <label className="ml-auto flex items-center gap-1.5 text-xs">
            <input type="checkbox" checked={forceDark} onChange={(e) => setForceDark(e.target.checked)} />
            dark ancestor
          </label>
        </div>
        <div className={`min-h-0 flex-1 ${forceDark ? "dark bg-slate-950" : ""}`}>
          {mode === "option" && (
            <CopilotKitProvider
              key="option"
              runtimeUrl="/api/copilotkit-genui"
              enableInspector={nestedInspectorSetting}
              generativeUI={{
                ui: standardUI,
                theme: {
                  "--a2ui-color-accent": "#d97706",
                  "--a2ui-font-family": "Inter, sans-serif",
                  "--a2ui-radius-md": "10px",
                },
              }}
            >
              <CopilotChat className="h-full" />
            </CopilotKitProvider>
          )}
          {mode === "typed" && (
            <CopilotKitProvider key="typed" runtimeUrl="/api/copilotkit-genui" enableInspector={nestedInspectorSetting} generativeUI={{ ui: standardUI, theme }}>
              <CopilotChat className="h-full" />
            </CopilotKitProvider>
          )}
          {mode === "per-mode" && (
            <CopilotKitProvider
              key="per-mode"
              runtimeUrl="/api/copilotkit-genui"
              enableInspector={nestedInspectorSetting}
              generativeUI={{
                ui: standardUI,
                theme: {
                  "--a2ui-color-accent": "#d97706",
                  dark: {
                    "--a2ui-color-panel": "#1f2937",
                    "--a2ui-color-surface": "#111827",
                  },
                },
              }}
            >
              <CopilotChat className="h-full" />
            </CopilotKitProvider>
          )}
          {mode === "css" && (
            <CopilotKitProvider key="css" runtimeUrl="/api/copilotkit-genui" enableInspector={nestedInspectorSetting} generativeUI={{ ui: standardUI }}>
              <CopilotChat className="h-full" />
            </CopilotKitProvider>
          )}
        </div>
      </div>
    </DemoFrame>
  );
}
