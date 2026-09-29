/**
 * The agent ids this app can address.
 *
 * Mirrors the keys of `REGISTRY` in `backend/src/agents/registry.py`, which is
 * also where each agent is mounted: id `tool-rendering` is served at
 * `${AGENT_URL}/tool-rendering`. Keeping the list here rather than fetching it
 * means the runtime route can be built synchronously at module load.
 *
 * If you add an agent to the Python registry, add its id here too — the
 * `/backend/copilot-runtime` route cross-checks the two lists at runtime and
 * reports any drift.
 */

export const AGENT_IDS = [
  "my_agent",
  "agentic_chat",
  "prebuilt-sidebar",
  "prebuilt-popup",
  "chat-controls",
  "chat-customization-css",
  "chat-slots",
  "headless-simple",
  "headless-complete",
  "reasoning-default",
  "reasoning-custom",
  "multimodal",
  "voice",
  "tool-rendering",
  "gen-ui-tool-based",
  "a2ui-fixed-schema",
  "declarative-gen-ui",
  "open_gen_ui",
  "open_gen_ui_advanced",
  "byoc_json_render",
  "byoc_hashbrown",
  "frontend_tools",
  "hitl-in-chat",
  "governed-actions",
  "programmatic-control",
  "shared-state-read-write",
  "shared-state-streaming",
  "readonly-state-agent-context",
  "shared-state-language",
  "predictive-state-updates",
  "workflow-execution",
  "subagents",
  "agent-config",
  "agent-app-context",
] as const;

export type AgentId = (typeof AGENT_IDS)[number];

/** Where the Python agent server is listening. */
export const AGENT_URL = process.env.AGENT_URL ?? "http://localhost:8000";

/** The one agent the A2UI fixed-schema route scopes its runtime middleware to. */
export const A2UI_FIXED_AGENT_ID = "a2ui-fixed-schema";

/**
 * The one agent the Rich Threads routes use.
 *
 * Threads are listed per agent, and the Intelligence runtime registers only
 * this one — see `lib/copilot-runtime.ts` for why the count matters.
 */
export const THREADS_AGENT_ID = "my_agent";
