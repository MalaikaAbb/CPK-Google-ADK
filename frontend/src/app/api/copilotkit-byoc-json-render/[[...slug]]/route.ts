import { HttpAgent } from "@ag-ui/client";
import { createCopilotRuntimeHandler } from "@copilotkit/runtime/v2";

import { AGENT_URL } from "@/lib/agents";
import { buildRuntime } from "@/lib/copilot-runtime";

/**
 * Harness-authored. The page's frontend points at `runtimeUrl="/api/copilotkit-byoc-json-render"`
 * with `agent="byoc_json_render"`, but the page never shows this route. It is the
 * same shape as the repo's other secondary runtimes: one agent, no extra
 * middleware.
 */
const handler = createCopilotRuntimeHandler({
  runtime: buildRuntime({
    agents: {
      byoc_json_render: new HttpAgent({
        url: `${AGENT_URL}/byoc_json_render`,
      }),
    },
  }),
  basePath: "/api/copilotkit-byoc-json-render",
});

export {
  handler as GET,
  handler as POST,
  handler as PATCH,
  handler as DELETE,
};
