"use client";

import { DemoFrame } from "@/components/demo-frame";

import ByocHashbrownDemo from "../byoc-hashbrown-demo";

/**
 * Mounts the page's demo component as published. It brings its own
 * `<CopilotKit>` pointed at its own runtime route, so this route is listed in
 * `NESTED_PROVIDER_ROUTES`.
 *
 * Expected: the first assistant reply throws. The renderer calls the library
 * the way the doc does, which the installed version does not accept. See the
 * route page for the exact error.
 */
export default function Page() {
  return (
    <DemoFrame parentPath="/generative-ui/hashbrown" subtitle="agent: byoc_hashbrown">
      <div className="h-full">
        <ByocHashbrownDemo />
      </div>
    </DemoFrame>
  );
}
