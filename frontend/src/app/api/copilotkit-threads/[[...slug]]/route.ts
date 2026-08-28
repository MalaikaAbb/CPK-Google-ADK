import { HttpAgent } from "@ag-ui/client";
import { createCopilotRuntimeHandler } from "@copilotkit/runtime/v2";

import { AGENT_URL, THREADS_AGENT_ID } from "@/lib/agents";
import { buildRuntime } from "@/lib/copilot-runtime";

/**
 * The only Intelligence-mode runtime in this harness, and the only one that
 * registers a single agent.
 *
 * Both facts are the same decision. The client starts a thread adapter for
 * every agent a runtime advertises — a list fetch, a subscribe, and a retrying
 * WebSocket each — so pointing the 28-agent runtime at Intelligence made every
 * page load open 28 channels. Registering one agent here keeps that at one, and
 * only the three Rich Threads routes ever talk to this endpoint.
 *
 * See `lib/copilot-runtime.ts` for the long version.
 */
const handler = createCopilotRuntimeHandler({
  runtime: buildRuntime({
    intelligence: true,
    agents: {
      [THREADS_AGENT_ID]: new HttpAgent({
        url: `${AGENT_URL}/${THREADS_AGENT_ID}`,
      }),
    },
  }),
  basePath: "/api/copilotkit-threads",
});

export {
  handler as GET,
  handler as POST,
  handler as PATCH,
  handler as DELETE,
};
