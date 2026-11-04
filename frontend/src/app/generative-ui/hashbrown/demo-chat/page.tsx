"use client";

import { DemoFrame } from "@/components/demo-frame";

import ByocHashbrownFixedDemo from "../hashbrown-fixed";

/**
 * The working version only (../hashbrown-fixed.tsx). It brings its own
 * `<CopilotKit>` against /api/copilotkit-byoc-hashbrown.
 */
export default function Page() {
  return (
    <DemoFrame parentPath="/generative-ui/hashbrown" subtitle="agent: byoc_hashbrown">
      <ByocHashbrownFixedDemo />
    </DemoFrame>
  );
}
