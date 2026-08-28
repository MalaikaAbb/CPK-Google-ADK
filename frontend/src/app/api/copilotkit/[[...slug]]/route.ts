import { HttpAgent } from "@ag-ui/client";
import { createCopilotRuntimeHandler } from "@copilotkit/runtime/v2";

import { AGENT_IDS, AGENT_URL, A2UI_FIXED_AGENT_ID } from "@/lib/agents";
import { buildRuntime } from "@/lib/copilot-runtime";

/**
 * The app-wide Copilot Runtime, as the Quickstart now builds it.
 *
 * Three things moved when the doc switched to the v2 runtime surface, and all
 * three are load-bearing:
 *
 *   - The import is `@copilotkit/runtime/v2`, not `@copilotkit/runtime`. There
 *     is no `serviceAdapter` on this surface — `ExperimentalEmptyAdapter`
 *     belonged to the v1 GraphQL runtime and has no counterpart here.
 *   - `createCopilotRuntimeHandler` returns a plain fetch handler rather than a
 *     `{ handleRequest }` wrapper, so the route is just the verb exports below.
 *   - The file lives at `[[...slug]]/route.ts`, not `route.ts`. The handler
 *     serves a subtree — `/info`, agent runs, thread list/rename/delete — so a
 *     single-segment route 404s everything except the bare URL while `/info`
 *     keeps answering 200. The app looks connected and never replies, which is
 *     the failure mode worth knowing about: it produces no error anywhere.
 *
 * Intelligence, the license token and `identifyUser` are not here. They are in
 * `lib/copilot-runtime.ts`, shared with the voice and declarative-gen-ui
 * endpoints so all three agree on the mode and on who the user is — otherwise
 * threads created on one endpoint would be invisible to another.
 *
 * The agent map is unchanged from the v1 version: the Quickstart registers one
 * `my_agent` at the server root, and this harness has one agent per doc route,
 * so the Python server mounts each at `/{agent_id}` and each gets its own
 * `HttpAgent` pointed there.
 */
const handler = createCopilotRuntimeHandler({
  runtime: buildRuntime({
    agents: Object.fromEntries(
      AGENT_IDS.map((id) => [id, new HttpAgent({ url: `${AGENT_URL}/${id}` })]),
    ),
    // A2UI, scoped to the fixed-schema agent with tool injection off. That
    // agent owns its own `display_flight` tool and returns the operations
    // container itself, so injecting `generate_a2ui` alongside it would give
    // the model two ways to draw the same card. The middleware still detects
    // the operations and renders the surface.
    //
    // `a2ui` sits on the options shared by both runtime modes, so it survived
    // the v1 → v2 move unchanged. The dynamic-schema route deliberately does
    // not come through here — it has its own endpoint where the provider's
    // catalog is what turns A2UI on.
    a2ui: { injectA2UITool: false, agents: [A2UI_FIXED_AGENT_ID] },
  }),
  basePath: "/api/copilotkit",
});

// Four verbs, not the doc's two. The Quickstart exports GET and POST because
// its app has no thread UI; PATCH and DELETE are how threads are renamed,
// archived and deleted, which the three Rich Threads routes need.
export {
  handler as GET,
  handler as POST,
  handler as PATCH,
  handler as DELETE,
};
