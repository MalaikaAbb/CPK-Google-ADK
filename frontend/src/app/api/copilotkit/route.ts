import {
  CopilotRuntime,
  ExperimentalEmptyAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { HttpAgent } from "@ag-ui/client";
import { NextRequest } from "next/server";

import { AGENT_IDS, AGENT_URL, A2UI_FIXED_AGENT_ID } from "@/lib/agents";

// The Quickstart's runtime, widened from one agent to the whole registry.
//
// It registers `my_agent: new HttpAgent({ url: "http://localhost:8000/" })`
// because it has exactly one agent and mounts it at the server root. This
// harness has one agent per doc route, so the Python server mounts each at
// `/{agent_id}` and each gets its own HttpAgent pointed there. The ids are the
// same strings routes pass as `agentId`.
const serviceAdapter = new ExperimentalEmptyAdapter();

const agents = Object.fromEntries(
  AGENT_IDS.map((id) => [id, new HttpAgent({ url: `${AGENT_URL}/${id}` })]),
);

const runtime = new CopilotRuntime({
  agents,
  // A2UI, scoped to the fixed-schema agent with tool injection off. That agent
  // owns its own `display_flight` tool and returns the operations container
  // itself, so injecting `generate_a2ui` alongside it would give the model two
  // ways to draw the same card. The middleware still detects the operations
  // and renders the surface.
  //
  // The dynamic-schema route deliberately does not go through this runtime —
  // it has its own at /api/copilotkit-declarative-gen-ui, where the catalog on
  // the provider is what turns A2UI on.
  a2ui: { injectA2UITool: false, agents: [A2UI_FIXED_AGENT_ID] },
});

export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};
