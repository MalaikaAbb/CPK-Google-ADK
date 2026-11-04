"use client";

// The `app/providers.tsx` snippet of
// https://docs.copilotkit.ai/google-adk/generative-ui/components/markdown-mode
// and the page's `sendContext: false` variant. The JSX inside each
// `#region` is verbatim. Harness-authored: the two component wrappers, the
// `runtimeUrl` (this repo's components runtime) and `enableInspector`.
import type { ReactNode } from "react";

import { nestedInspectorSetting } from "@/lib/inspector";

//#region providers
import { CopilotKitProvider } from "@copilotkit/react-core/v2";
import { standardUI } from "@copilotkit/react-core/v2/generative-ui";
//#endregion

export function MarkdownProviders({ children }: { children: ReactNode }) {
  return (
    <CopilotKitProvider runtimeUrl="/api/copilotkit-genui" enableInspector={nestedInspectorSetting} generativeUI={{ ui: standardUI, transport: "markdown" }}>
      {children}
    </CopilotKitProvider>
  );
}

export function OwnPromptProviders({ children }: { children: ReactNode }) {
  return (
    <CopilotKitProvider
      runtimeUrl="/api/copilotkit-genui"
      enableInspector={nestedInspectorSetting}
      generativeUI={{ ui: standardUI, transport: "markdown", sendContext: false }}
    >
      {children}
    </CopilotKitProvider>
  );
}
