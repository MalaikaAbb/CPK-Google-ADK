import { HttpAgent } from "@ag-ui/client";
import { createCopilotRuntimeHandler } from "@copilotkit/runtime/v2";

import { AGENT_URL } from "@/lib/agents";
import { buildRuntime } from "@/lib/copilot-runtime";

/**
 * A second runtime for the A2UI dynamic-schema route, matching the doc's
 * `runtimeUrl="/api/copilotkit-declarative-gen-ui"`.
 *
 * Note the absence of an `a2ui` block. That is the whole point of the page:
 * passing a catalog to the provider auto-enables A2UI and injects the
 * `generate_a2ui` tool, so the runtime needs no configuration at all. It has
 * to be a separate endpoint from /api/copilotkit because that one turns
 * injection off for the fixed-schema agent.
 *
 * It shares `buildRuntime`, so Intelligence and per-user threads are wired the
 * same way here as on the main endpoint.
 */
const handler = createCopilotRuntimeHandler({
  runtime: buildRuntime({
    agents: {
      "declarative-gen-ui": new HttpAgent({
        url: `${AGENT_URL}/declarative-gen-ui`,
      }),
    },
  }),
  basePath: "/api/copilotkit-declarative-gen-ui",
});

export {
  handler as GET,
  handler as POST,
  handler as PATCH,
  handler as DELETE,
};
