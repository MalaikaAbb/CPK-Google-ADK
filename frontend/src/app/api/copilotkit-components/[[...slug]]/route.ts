import { HttpAgent } from "@ag-ui/client";
import {
  CopilotRuntime,
  createCopilotRuntimeHandler,
  InMemoryAgentRunner,
} from "@copilotkit/runtime/v2";

import { AGENT_URL } from "@/lib/agents";

/**
 * The Components and surfaces page's `app/api/copilotkit/[[...slug]]/route.ts`.
 *
 * Swapped (doc gap): the page builds a TanStack-factory `BuiltInAgent` on
 * OpenAI. This harness runs ADK agents, so `agent` is the ADK `components`
 * agent over AG-UI, carrying the snippet's system prompt and no tools of its
 * own (`backend/src/agents/components_agent.py`). Everything from
 * `new CopilotRuntime` down is the page's, except `basePath`, which is this
 * route's own path so it can sit next to the harness's main runtime.
 */
const agent = new HttpAgent({ url: `${AGENT_URL}/components` });

const runtime = new CopilotRuntime({
  agents: { default: agent },
  runner: new InMemoryAgentRunner(),
});

const handler = createCopilotRuntimeHandler({ runtime, basePath: "/api/copilotkit-components" });

export const GET = handler;
export const POST = handler;
