import { HttpAgent } from "@ag-ui/client";
import {
  CopilotRuntime,
  createCopilotRuntimeHandler,
} from "@copilotkit/runtime/v2";

import { AGENT_URL } from "@/lib/agents";

/**
 * The runtime for the eight Components & surfaces routes.
 *
 * `#region runtime` is the Transports page's `app/api/copilotkit/route.ts`
 * snippet, verbatim. `generativeUI: true` adds the `render_ui` tool and its
 * guide to every run that carries a tool-transport catalog.
 *
 * Harness-authored: `agent` (the page leaves it undefined — here, the ADK
 * `genui` agent over AG-UI) and the handler around it, the same shape as this
 * repo's other secondary runtimes. It lives at its own path because the
 * component routes point their providers here instead of /api/copilotkit.
 */
const agent = new HttpAgent({ url: `${AGENT_URL}/genui` });

//#region runtime
const runtime = new CopilotRuntime({
  agents: { default: agent },
  generativeUI: true,
});
//#endregion

const handler = createCopilotRuntimeHandler({
  runtime,
  basePath: "/api/copilotkit-genui",
});

export {
  handler as GET,
  handler as POST,
  handler as PATCH,
  handler as DELETE,
};
