import { HttpAgent } from "@ag-ui/client";
import { createCopilotRuntimeHandler } from "@copilotkit/runtime/v2";

import { AGENT_URL } from "@/lib/agents";
import { buildRuntime } from "@/lib/copilot-runtime";

/**
 * Harness-authored. The page's frontend points at `runtimeUrl="/api/copilotkit-byoc-hashbrown"`
 * with `agent="byoc_hashbrown"`, but the page never shows this route. It is the
 * same shape as the repo's other secondary runtimes: one agent, no extra
 * middleware.
 */
const handler = createCopilotRuntimeHandler({
  runtime: buildRuntime({
    agents: {
      byoc_hashbrown: new HttpAgent({
        url: `${AGENT_URL}/byoc_hashbrown`,
      }),
    },
  }),
  basePath: "/api/copilotkit-byoc-hashbrown",
});

export {
  handler as GET,
  handler as POST,
  handler as PATCH,
  handler as DELETE,
};
