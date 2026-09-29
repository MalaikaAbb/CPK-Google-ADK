import { HttpAgent } from "@ag-ui/client";
import { CopilotRuntime, createCopilotRuntimeHandler } from "@copilotkit/runtime/v2";

import { AGENT_URL } from "@/lib/agents";

/**
 * The runtime for Open Generative UI, at the path the doc names.
 *
 * Harness-authored: the imports, `headers`, and the handler export. The
 * `const runtime = …` statement between the region markers is the doc's,
 * verbatim.
 *
 * `headers` is used by the doc snippet but never defined on the page. It is
 * set to an empty object here so the published statement compiles unchanged;
 * nothing in this repo needs forwarded headers on this route.
 *
 * Unlike the other runtime routes this does not go through `buildRuntime`, so
 * Intelligence and the license token are not applied here — the doc
 * constructs `CopilotRuntime` directly, and so does this file.
 */
const headers = {};

// #region runtime — verbatim
// src/app/api/copilotkit-ogui/route.ts
const runtime = new CopilotRuntime({
  agents: {
    "open-gen-ui": new HttpAgent({
      url: `${AGENT_URL}/open_gen_ui`,
      headers,
    }),
    "open-gen-ui-advanced": new HttpAgent({
      url: `${AGENT_URL}/open_gen_ui_advanced`,
      headers,
    }),
  },
  // The runtime's OpenGenerativeUIMiddleware turns each agent's streamed
  // `generateSandboxedUi` tool call into `open-generative-ui` activity
  // events that the provider's <CopilotKit openGenerativeUI={...}>
  // renderer mounts in a sandboxed iframe. Without this list, the
  // middleware never engages and the demo's iframe stays empty.
  openGenerativeUI: {
    agents: ["open-gen-ui", "open-gen-ui-advanced"],
  },
});
// #endregion

const handler = createCopilotRuntimeHandler({
  runtime,
  basePath: "/api/copilotkit-ogui",
});

export {
  handler as GET,
  handler as POST,
  handler as PATCH,
  handler as DELETE,
};
