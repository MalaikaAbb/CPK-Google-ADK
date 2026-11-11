"use client";
import { CopilotChat } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

// The page's app/page.tsx (`<CopilotChat />`), inside the harness's DemoFrame.
export default function Page() {
  return (
    <DemoFrame parentPath="/generative-ui/components" subtitle="agent: components">
      <div className="h-full min-h-0 flex-1">
        <CopilotChat />
      </div>
    </DemoFrame>
  );
}
