"use client";

import { CopilotChat, CopilotKitProvider } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";
import { nestedInspectorSetting } from "@/lib/inspector";

import { appUI } from "../app-ui";

/**
 * The page's "After" provider, `generativeUI={{ ui: appUI }}`, verbatim apart
 * from `runtimeUrl` (this repo's components runtime).
 */
export default function Page() {
  return (
    <DemoFrame parentPath="/generative-ui/components/from-a2ui" subtitle="agent: genui">
      <CopilotKitProvider runtimeUrl="/api/copilotkit-genui" enableInspector={nestedInspectorSetting} generativeUI={{ ui: appUI }}>
        <CopilotChat className="h-full" />
      </CopilotKitProvider>
    </DemoFrame>
  );
}
