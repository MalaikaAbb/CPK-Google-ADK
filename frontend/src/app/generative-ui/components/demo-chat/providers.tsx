"use client";
import { CopilotKitProvider } from "@copilotkit/react-core/v2";
import { standardUI } from "@copilotkit/react-core/v2/generative-ui";
import "@copilotkit/react-core/v2/styles.css";

// The page's app/providers.tsx. One harness change: runtimeUrl points at this
// route's runtime (/api/copilotkit-components) instead of /api/copilotkit,
// which in this repo is the main multi-agent runtime with no "default" agent.
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CopilotKitProvider runtimeUrl="/api/copilotkit-components" generativeUI={{ ui: standardUI }}>
      {children}
    </CopilotKitProvider>
  );
}
