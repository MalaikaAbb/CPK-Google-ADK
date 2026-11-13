// Doc snippets shown as reference on this route, byte-exact from the
// rendered page. Generated, not hand-typed.

export const INTELLIGENCE_ROUTE = "import {\n  BuiltInAgent,\n  CopilotKitIntelligence,\n  CopilotRuntime,\n  createCopilotRuntimeHandler,\n} from \"@copilotkit/runtime/v2\";\n\nconst agent = new BuiltInAgent({\n  model: \"openai/gpt-6-luna\",\n  prompt: \"You are a helpful assistant.\",\n});\n\nconst runtime = new CopilotRuntime({\n  agents: { default: agent },\n  // Intelligence stores threads and runs. Do not pass `runner` as well.\n  intelligence: new CopilotKitIntelligence({\n    apiKey: process.env.CPK_INTELLIGENCE_API_KEY!,\n  }),\n  // Replace this fixed user with the user from your verified session.\n  identifyUser: () => ({ id: \"demo-user\", name: \"Demo User\" }),\n  // Unchanged from the in-memory setup.\n  mcpApps: {\n    servers: [\n      {\n        type: \"http\",\n        url: \"https://mcp.excalidraw.com/mcp\",\n        serverId: \"excalidraw\",\n      },\n    ],\n  },\n});\n\nconst handler = createCopilotRuntimeHandler({\n  runtime,\n  basePath: \"/api/copilotkit\",\n});\n\nexport const GET = handler;\nexport const POST = handler;\nexport const PATCH = handler;\nexport const DELETE = handler;";

export const SAME_ORIGIN = "<CopilotKit runtimeUrl=\"/api/copilotkit\" mcpApps={{ allowSameOriginFallback: true }}>\n  {children}\n</CopilotKit>";

export const HTTP_SERVER = "{\n  type: \"http\",\n  url: \"http://localhost:3101/mcp\",\n  serverId: \"my-http-server\"\n}";

export const SSE_SERVER = "{\n  type: \"sse\",\n  url: \"https://mcp.example.com/sse\",\n  headers: {\n    \"Authorization\": \"Bearer token\"\n  },\n  serverId: \"my-sse-server\"\n}";
