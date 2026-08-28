import {
  CopilotKitIntelligence,
  CopilotRuntime,
  InMemoryAgentRunner,
  type AgentsConfig,
  type CopilotRuntimeOptions,
} from "@copilotkit/runtime/v2";

/**
 * One place that decides whether this harness runs on CopilotKit Intelligence,
 * shared by all three runtime routes.
 *
 * `CopilotRuntimeOptions` is a **union**, not one object with optional fields:
 * Intelligence mode requires both `intelligence` and `identifyUser`, and SSE
 * mode requires `intelligence` to be absent entirely. So the two shapes are
 * built in separate branches below rather than spread conditionally into one
 * literal — TypeScript rejects the conditional-spread version.
 */

/**
 * Server-side only, and deliberately not `NEXT_PUBLIC_`. A project key prefixed
 * for the browser would ship in the JS bundle.
 */
const INTELLIGENCE_API_KEY = process.env.INTELLIGENCE_API_KEY;

/**
 * A SECOND, SEPARATE credential — and the one that unlocks the Threads Drawer.
 *
 * `INTELLIGENCE_API_KEY` authorizes the runtime against the platform: it is what
 * makes `/info` report intelligence mode and what makes the thread REST
 * endpoints return real rows. It does NOT advertise a license.
 *
 * `licenseToken` is what does. The runtime builds a licence checker from it (or
 * from `COPILOTKIT_LICENSE_TOKEN`), and `/info` reports `licenseStatus` off
 * that checker — `"none"` when there is no checker at all. Client-side feature
 * UIs read that field: `<CopilotThreadsDrawer>` renders its locked "Threads are
 * a CopilotKit Intelligence feature" view unless the status is valid, whether
 * or not threads actually work.
 *
 * So a runtime can serve threads perfectly while every drawer in the app shows
 * an Upgrade button. Set both to avoid that.
 */
const LICENSE_TOKEN = process.env.COPILOTKIT_LICENSE_TOKEN;

/** True when `INTELLIGENCE_API_KEY` is set. Read by the Quickstart route. */
export const INTELLIGENCE_ENABLED = Boolean(INTELLIGENCE_API_KEY);

/**
 * THE COST OF INTELLIGENCE SCALES WITH THE AGENT COUNT — read this before
 * enabling it on a runtime that registers many agents.
 *
 * When a provider connects to an Intelligence-mode runtime, the client starts a
 * thread adapter for **every agent the runtime advertises on `/info`** — not
 * just the one the page is chatting with, and not only on pages that mount a
 * chat. Each adapter does a `GET /threads?agentId=…`, then a
 * `POST /threads/subscribe` to fetch realtime credentials, then opens a
 * WebSocket channel. If that channel cannot join it retries
 * (`MAX_SOCKET_RETRIES = 5`, 15s timeout, exponential backoff).
 *
 * This harness registers 28 agents on its main runtime. Turning Intelligence on
 * there meant every page load — including the landing page, which has no chat
 * at all — fired 28 list fetches and 28 subscribe/retry loops, ~170 requests
 * and 28 concurrent sockets. That is enough to lock up a laptop, especially in
 * dev where Next mirrors every browser console warning back to the server.
 *
 * So Intelligence is scoped to ONE endpoint that registers ONE agent, used only
 * by the three Rich Threads routes. Everything else runs in SSE mode, which is
 * exactly what those routes do not need.
 */

/** The options every route shares — everything except the mode-specific keys. */
type SharedRuntimeOptions = {
  agents: AgentsConfig;
  a2ui?: CopilotRuntimeOptions["a2ui"];
  transcriptionService?: CopilotRuntimeOptions["transcriptionService"];
};

/**
 * Build a runtime in whichever mode the environment supports.
 *
 * Without `INTELLIGENCE_API_KEY` the runtime falls back to SSE with an
 * in-memory runner. Chat still works on every route in this harness; Threads
 * and the Inspector's thread tab stay locked, and the key is never read. That
 * degradation is deliberate — the harness has to be runnable by someone who
 * only has a Gemini key.
 */
export function buildRuntime(
  options: SharedRuntimeOptions & {
    /**
     * Opt in to Intelligence. Defaults to `false` — see the note above on why
     * this is not simply "on whenever the key is present".
     */
     intelligence?: boolean;
  },
): CopilotRuntime {
  const { intelligence: wantsIntelligence = false, ...runtimeOptions } = options;

  if (!wantsIntelligence || !INTELLIGENCE_API_KEY) {
    return new CopilotRuntime({
      ...runtimeOptions,
      runner: new InMemoryAgentRunner(),
      ...(LICENSE_TOKEN ? { licenseToken: LICENSE_TOKEN } : {}),
    });
  }

  return new CopilotRuntime({
    ...runtimeOptions,
    ...(LICENSE_TOKEN ? { licenseToken: LICENSE_TOKEN } : {}),
    intelligence: new CopilotKitIntelligence({
      // apiUrl and wsUrl default to the managed platform — leave them unset.
      apiKey: INTELLIGENCE_API_KEY,
    }),
    // Threads are per-user. Without this, every visitor shares one history.
    // `Providers` sends these headers so the harness has a stable identity to
    // key threads on; a real app would read them from a verified session.
    identifyUser: (request) => ({
      id: request.headers.get("x-user-id") ?? "anonymous",
      name: request.headers.get("x-user-name") ?? "Anonymous",
    }),
  });
}
