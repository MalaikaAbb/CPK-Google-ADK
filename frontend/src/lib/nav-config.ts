/**
 * The nav, the route headers, and the README status table all read from here,
 * so a doc page and its implementation status are described exactly once.
 *
 * Route paths mirror the doc URLs under docs.copilotkit.ai/google-adk.
 * `agentId` is the id the agent is registered under in
 * `backend/src/agents/registry.py`, which is also the FastAPI path it is
 * mounted at — so a route, its doc page, and its agent line up in one place.
 */

/**
 * There is exactly one doc-sync date in this repo, and it is not here: it is
 * `syncedAt` in `doc-snapshot/manifest.json`, written every time the sync
 * button runs. A hand-maintained date alongside it only ever drifted out of
 * agreement with the machine one, so it was removed — `/doc-sync` is the
 * single place that answers "how current are these docs".
 */
export const DOCS_ROOT = "https://docs.copilotkit.ai/google-adk";

export type RouteStatus = "working" | "partial" | "reference" | "broken" | "not-started";

export interface RouteMeta {
  path: string;
  title: string;
  docPath: string;
  summary: string;
  status: RouteStatus;
  statusNote?: string;
  offNav?: boolean;
  /** Owns a live surface at `<path>/demo-chat`. */
  hasDemo?: boolean;
  /** Agent id from `backend/src/agents/registry.py`. */
  agentId?: string;
}

export function demoPath(route: RouteMeta): string | undefined {
  if (!route.hasDemo) return undefined;
  return route.path === "/" ? "/demo-chat" : `${route.path}/demo-chat`;
}

export interface NavGroup {
  title: string;
  routes: RouteMeta[];
}

export const NAV: NavGroup[] = [
  {
    title: "Getting Started",
    routes: [
      {
        path: "/",
        title: "Introduction",
        docPath: "/google-adk",
        summary: "What this harness covers and how the pieces fit together.",
        status: "reference",
        statusNote: "Landing page — orientation and a live agent roster.",
      },
      {
        path: "/quickstart",
        hasDemo: true,
        agentId: "my_agent",
        title: "Quickstart",
        docPath: "/google-adk/quickstart?agent=bring-your-own",
        summary:
          "The bring-your-own-agent path: an ADK LlmAgent behind ag-ui-adk, reached over HTTP by the Copilot Runtime.",
        status: "working",
      },
    ],
  },
  {
    title: "Rich Threads",
    routes: [
      {
        path: "/prebuilt-components/copilot-threads-drawer",
        hasDemo: true,
        agentId: "my_agent",
        title: "Threads Drawer",
        docPath: "/google-adk/prebuilt-components/copilot-threads-drawer",
        summary:
          "The drop-in conversation sidebar, wired with no active-thread state of its own.",
        status: "partial",
        statusNote:
          "Needs the runtime in Intelligence mode for real rows, and a license (publicLicenseKey or licenseToken) for the drawer to render anything but its locked Upgrade view. Those are two separate switches.",
      },
      {
        path: "/headless-threads",
        hasDemo: true,
        agentId: "my_agent",
        title: "Headless Threads",
        docPath: "/google-adk/headless-threads",
        summary:
          "The same thread data through useThreads, with a hand-built list — including rename, which the drawer omits.",
        status: "partial",
        statusNote:
          "Needs Intelligence mode. In SSE mode /info reports mutations: false, so rename/archive/delete have no endpoint to call.",
      },
      {
        path: "/threads-lifecycle",
        hasDemo: true,
        agentId: "my_agent",
        title: "Thread & History Lifecycle",
        docPath: "/google-adk/threads-lifecycle",
        summary:
          "Where a threadId comes from, how history replays, and how switching differs from starting fresh.",
        status: "partial",
        statusNote:
          "Switch and start are live regardless of mode; history replay needs a server-side store to replay from, so it is inert in SSE mode.",
      },
    ],
  },
  {
    title: "Prebuilt Components",
    routes: [
      {
        path: "/prebuilt-components/chat",
        hasDemo: true,
        agentId: "agentic_chat",
        title: "CopilotChat",
        docPath: "/google-adk/prebuilt-components/chat",
        summary:
          "The base inline chat surface, sized to fill whatever container you give it.",
        status: "working",
      },
      {
        path: "/prebuilt-components/sidebar",
        hasDemo: true,
        agentId: "prebuilt-sidebar",
        title: "CopilotSidebar",
        docPath: "/google-adk/prebuilt-components/sidebar",
        summary:
          "The collapsible docked chat that wraps your main content rather than covering it.",
        status: "working",
      },
      {
        path: "/prebuilt-components/popup",
        hasDemo: true,
        agentId: "prebuilt-popup",
        title: "CopilotPopup",
        docPath: "/google-adk/prebuilt-components/popup",
        summary:
          "The floating launcher that opens an overlay chat on top of the page.",
        status: "working",
      },
      {
        path: "/prebuilt-components/chat-controls",
        hasDemo: true,
        agentId: "chat-controls",
        title: "Open, close, and feedback",
        docPath: "/google-adk/prebuilt-components/chat-controls",
        summary:
          "Driving modal state from your own UI with useCopilotChatConfiguration, and capturing thumbs up/down.",
        status: "working",
      },
    ],
  },
  {
    title: "Custom Look and Feel",
    routes: [
      {
        path: "/custom-look-and-feel/css",
        hasDemo: true,
        agentId: "chat-customization-css",
        title: "CSS Customization",
        docPath: "/google-adk/custom-look-and-feel/css",
        summary:
          "Re-skinning the chat with the v2 shadcn design tokens and the .copilotKit* class hooks.",
        status: "working",
      },
      {
        path: "/custom-look-and-feel/slots",
        hasDemo: true,
        agentId: "chat-slots",
        title: "Slots",
        docPath: "/google-adk/custom-look-and-feel/slots",
        summary:
          "Overriding chat sub-components at all three levels: class strings, prop objects, and whole components.",
        status: "working",
      },
      {
        path: "/custom-look-and-feel/markdown",
        hasDemo: true,
        agentId: "chat-slots",
        title: "Markdown Rendering",
        docPath: "/google-adk/custom-look-and-feel/markdown",
        summary:
          "The markdownRenderer slot in its three forms: a Streamdown components map, a class string, and a full replacement.",
        status: "partial",
        statusNote:
          "Not yet checked in a browser. The my-link/my-heading CSS is harness-only because the doc never defines those classes. Reuses the chat-slots agent because the doc names no backend.",
      },
      {
        path: "/custom-look-and-feel/headless-ui",
        hasDemo: true,
        agentId: "headless-simple",
        title: "Headless UI",
        docPath: "/google-adk/custom-look-and-feel/headless-ui",
        summary:
          "A chat built from useAgent, useCopilotKit and useRenderToolCall alone, with no CopilotKit chrome.",
        status: "working",
      },
      {
        path: "/custom-look-and-feel/reasoning-messages",
        hasDemo: true,
        agentId: "reasoning-default",
        title: "Reasoning Messages",
        docPath: "/google-adk/custom-look-and-feel/reasoning-messages",
        summary:
          "The built-in reasoning card, and the header/content sub-slots that replace parts of it.",
        status: "working",
        statusNote:
          "Depends on Gemini returning thought parts; the docs never show an ADK agent that emits them, so this repo enables thinking itself.",
      },
    ],
  },
  {
    title: "Input Modalities",
    routes: [
      {
        path: "/multimodal-attachments",
        hasDemo: true,
        agentId: "multimodal",
        title: "Multimodal Attachments",
        docPath: "/google-adk/multimodal-attachments",
        summary:
          "Drag-and-drop file attachments sent to the agent as AG-UI content parts.",
        status: "working",
      },
      {
        path: "/voice",
        hasDemo: true,
        agentId: "voice",
        title: "Voice",
        docPath: "/google-adk/voice",
        summary:
          "A second runtime carrying a TranscriptionService, which is what makes the composer grow a mic button.",
        status: "working",
        statusNote:
          "The mic transcribes through OpenAI Whisper, so it needs OPENAI_API_KEY. Without one the route still runs via the doc's sample-audio button.",
      },
    ],
  },
  {
    title: "Generative UI",
    routes: [
      {
        path: "/generative-ui/reasoning",
        hasDemo: true,
        agentId: "reasoning-custom",
        title: "Reasoning",
        docPath: "/google-adk/generative-ui/reasoning",
        summary:
          "Replacing the whole reasoning card through the messageView.reasoningMessage slot.",
        status: "working",
        statusNote: "Same Gemini thinking dependency as Reasoning Messages.",
      },
      {
        path: "/generative-ui/tool-based",
        hasDemo: true,
        agentId: "gen-ui-tool-based",
        title: "Components as Tools",
        docPath: "/google-adk/generative-ui/tool-based",
        summary:
          "useComponent registering a React component as a tool the agent calls to render it.",
        status: "working",
      },
      {
        path: "/generative-ui/tool-rendering",
        hasDemo: true,
        agentId: "tool-rendering",
        title: "Tool Call Rendering",
        docPath: "/google-adk/generative-ui/tool-rendering",
        summary:
          "A named renderer for the get_weather tool, plus the wildcard catch-all from useDefaultRenderTool.",
        status: "working",
        statusNote:
          "get_weather only — it is the sole backend tool the page defines.",
      },
      {
        path: "/generative-ui/state-rendering",
        hasDemo: true,
        agentId: "shared-state-streaming",
        title: "State Rendering",
        docPath: "/google-adk/generative-ui/state-rendering",
        summary:
          "Rendering agent state as it changes, driven by the same PredictStateMapping as State Streaming.",
        status: "working",
      },
      {
        path: "/generative-ui/a2ui/dynamic-schema",
        hasDemo: true,
        agentId: "declarative-gen-ui",
        title: "A2UI · Dynamic Schema",
        docPath: "/google-adk/generative-ui/a2ui/dynamic-schema",
        summary:
          "A bring-your-own-catalog dashboard where a secondary LLM designs the surface per request.",
        status: "working",
        statusNote:
          "The catalog is the doc's; the leaf UI components it renders into are this repo's — see the page for the list.",
      },
      {
        path: "/generative-ui/a2ui/fixed-schema",
        hasDemo: true,
        agentId: "a2ui-fixed-schema",
        title: "A2UI · Fixed Schema",
        docPath: "/google-adk/generative-ui/a2ui/fixed-schema",
        summary:
          "A flight card whose component tree is authored as JSON up front; the tool supplies only the data.",
        status: "working",
        statusNote:
          "The Book button is inert: a2ui.render in the Python SDK does not yet accept action_handlers.",
      },
      {
        path: "/generative-ui/open-generative-ui",
        hasDemo: true,
        agentId: "open_gen_ui",
        title: "Open Generative UI",
        docPath: "/google-adk/generative-ui/open-generative-ui",
        summary:
          "The agent writes sandboxed HTML/CSS/JS that streams into an iframe, optionally calling back into host functions.",
        status: "partial",
        statusNote:
          "Not yet checked in a browser. The page publishes no agent, and uses headers, Chat and VISUALIZATION_DESIGN_SKILL without defining them. It imports an unpublished ./suggestions, and the advanced snippet is cut off. The route lists each gap and what fills it.",
      },
      {
        path: "/generative-ui/json-render",
        hasDemo: true,
        agentId: "byoc_json_render",
        title: "JSON Render",
        docPath: "/google-adk/generative-ui/json-render",
        summary:
          "An agent-emitted { root, elements } spec, meant to be validated against a Zod catalog and drawn by @json-render/react.",
        status: "broken",
        statusNote:
          "As published it throws: the missing custom code is filled in, but the doc's <Renderer spec catalog> call is kept. @json-render/react 0.21 takes registry and needs JSONUIProvider. The demo's \"fixed\" mode has the working version, not yet checked in a browser.",
      },
      {
        path: "/generative-ui/hashbrown",
        hasDemo: true,
        agentId: "byoc_hashbrown",
        title: "Hashbrown",
        docPath: "/google-adk/generative-ui/hashbrown",
        summary:
          "Streamed JSON meant to be parsed progressively by @hashbrownai/react and rendered through a component catalog.",
        status: "broken",
        statusNote:
          "Broken by design: the missing custom code is filled in, but the doc's hook calls are kept as published. In 0.6.1 useJsonParser needs a schema and useUiKit takes { components }, so the first reply throws.",
      },
    ],
  },
  {
    title: "App Control",
    routes: [
      {
        path: "/frontend-tools",
        hasDemo: true,
        agentId: "frontend_tools",
        title: "Frontend Tools",
        docPath: "/google-adk/frontend-tools",
        summary:
          "A tool the agent calls that executes in the browser and changes the page.",
        status: "working",
      },
      {
        path: "/human-in-the-loop",
        hasDemo: true,
        agentId: "hitl-in-chat",
        title: "Human in the Loop",
        docPath: "/google-adk/human-in-the-loop",
        summary:
          "useHumanInTheLoop suspending the run behind a picker until the user answers.",
        status: "working",
      },
      {
        path: "/human-in-the-loop/governed-actions",
        hasDemo: true,
        agentId: "governed-actions",
        title: "Governed Action Approval UI",
        docPath: "/google-adk/human-in-the-loop/governed-actions",
        summary:
          "Gating a side-effecting action behind an approve/reject card, driven by the action's verdict.",
        status: "partial",
        statusNote:
          "Not yet checked in a browser. Only the useHumanInTheLoop half can run. useInterrupt needs an AG-UI interrupt, which ag-ui-adk never emits. No policy engine, agent or executeSideEffect is published, so the verdict is whatever the model writes.",
      },
      {
        path: "/programmatic-control",
        hasDemo: true,
        agentId: "programmatic-control",
        title: "Programmatic Control",
        docPath: "/google-adk/programmatic-control",
        summary:
          "Driving runs from code with addMessage, runAgent, stopAgent and subscribe — no chat component.",
        status: "partial",
        statusNote:
          "Built on the page's headless-complete snippet, which opens by destructuring three helpers it never defines. Two of them are this repo's.",
      },
    ],
  },
  {
    title: "Shared State",
    routes: [
      {
        path: "/shared-state",
        hasDemo: true,
        agentId: "shared-state-read-write",
        title: "Shared State",
        docPath: "/google-adk/shared-state",
        summary:
          "The two-way channel: the agent writes notes through a tool, the UI writes preferences through setState.",
        status: "working",
      },
      {
        path: "/shared-state/rendering-in-app",
        hasDemo: true,
        agentId: "shared-state-read-write",
        title: "Render state in your app",
        docPath: "/google-adk/shared-state/rendering-in-app",
        summary:
          "The same agent state rendered as a main-view canvas rather than inside the chat.",
        status: "working",
      },
      {
        path: "/shared-state/streaming",
        hasDemo: true,
        agentId: "shared-state-streaming",
        title: "State Streaming",
        docPath: "/google-adk/shared-state/streaming",
        summary:
          "PredictStateMapping forwarding a tool argument into a state key while it is still being generated.",
        status: "working",
      },
      {
        path: "/shared-state/agent-readonly",
        hasDemo: true,
        agentId: "readonly-state-agent-context",
        title: "Agent Read-Only Context",
        docPath: "/google-adk/shared-state/agent-readonly",
        summary:
          "useAgentContext as a one-way UI-to-agent channel — props for the agent, with no setter.",
        status: "working",
      },
      {
        path: "/shared-state/in-app-agent-read",
        hasDemo: true,
        agentId: "shared-state-language",
        title: "Reading agent state",
        docPath: "/google-adk/shared-state/in-app-agent-read",
        summary:
          "Reading agent.state in your own components as the agent's set_language tool mutates it.",
        status: "working",
      },
      {
        path: "/shared-state/in-app-agent-write",
        hasDemo: true,
        agentId: "shared-state-language",
        title: "Writing agent state",
        docPath: "/google-adk/shared-state/in-app-agent-write",
        summary:
          "agent.setState writing back, plus the hint-message-then-runAgent re-run the page describes.",
        status: "working",
      },
      {
        path: "/shared-state/workflow-execution",
        hasDemo: true,
        agentId: "workflow-execution",
        title: "Workflow Execution",
        docPath: "/google-adk/shared-state/workflow-execution",
        summary:
          "Splitting state by purpose: question in, answer out, resources internal.",
        status: "working",
      },
      {
        path: "/shared-state/predictive-state-updates",
        hasDemo: true,
        agentId: "predictive-state-updates",
        title: "Predictive state updates",
        docPath: "/google-adk/shared-state/predictive-state-updates",
        summary:
          "A step_progress tool reporting intermediate steps so the UI is never just a spinner.",
        statusNote:
          "The demo currently holds the doc's sample verbatim, which calls useAgent({ render }) — a prop that does not exist. It does not compile.",
        status: "broken",
      },
    ],
  },
  {
    title: "Multi-Agent",
    routes: [
      {
        path: "/multi-agent/subagents",
        hasDemo: true,
        agentId: "subagents",
        title: "Sub-Agents",
        docPath: "/google-adk/multi-agent/subagents",
        summary:
          "A supervisor delegating to research, writing and critique sub-agents, with a live delegation log.",
        status: "working",
      },
    ],
  },
  {
    title: "Agent Config",
    routes: [
      {
        path: "/agent-config",
        hasDemo: true,
        agentId: "agent-config",
        title: "Agent Config",
        docPath: "/google-adk/agent-config",
        summary:
          "A typed config object the UI owns, published with useAgentContext and rebuilt into the system prompt each turn.",
        status: "working",
      },
      {
        path: "/agent-app-context",
        hasDemo: true,
        agentId: "agent-app-context",
        title: "Agent App Context",
        docPath: "/google-adk/agent-app-context",
        summary:
          "useAgentContext sending app data, read into an ADK prompt through an InstructionProvider.",
        status: "partial",
        statusNote:
          "Not yet checked in a browser. Frontend and agent are the doc's, verbatim. The tool-reading example is a stub on the page and is shown as text only.",
      },
    ],
  },
  {
    title: "Observe & Operate",
    routes: [
      {
        path: "/inspector",
        hasDemo: true,
        agentId: "shared-state-read-write",
        title: "Inspector",
        docPath: "/google-adk/inspector",
        summary:
          "The built-in debugging overlay: AG-UI events, available agents, agent state, frontend tools, and context.",
        status: "working",
        statusNote:
          "Four of its five tabs work locally. Threads is the default tab and needs an Enterprise Intelligence Platform key.",
      },
    ],
  },
  {
    title: "Backend",
    routes: [
      {
        path: "/backend/copilot-runtime",
        hasDemo: true,
        agentId: "agentic_chat",
        title: "Copilot Runtime",
        docPath: "/google-adk/backend/copilot-runtime",
        summary:
          "This repo's live runtime config, all 29 agents it routes to, and a raw AG-UI event capture.",
        status: "working",
      },
    ],
  },
  {
    title: "Doc Sync",
    routes: [
      {
        path: "/doc-sync",
        title: "Doc drift",
        docPath: "/google-adk",
        summary:
          "Re-fetches the markdown behind every tracked doc page and diffs it against the stored snapshot, flagging changes inside code blocks.",
        status: "reference",
      },
    ],
  },
];

export const ALL_ROUTES: RouteMeta[] = NAV.flatMap((g) => g.routes);

export function findRoute(path: string): RouteMeta | undefined {
  return ALL_ROUTES.find((r) => r.path === path);
}

export function docUrl(route: RouteMeta): string {
  return `https://docs.copilotkit.ai${route.docPath}`;
}

export const STATUS_LABEL: Record<RouteStatus, string> = {
  working: "Working",
  partial: "Partial",
  reference: "Reference",
  broken: "Broken",
  "not-started": "Not started",
};
