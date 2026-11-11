// Doc snippets shown as reference on this route, byte-exact from the
// rendered page (https://docs.copilotkit.ai/google-adk/deploy-langsmith,
// fetched 2026-11-11), `[!code highlight]` markers stripped as the page
// renders them. Generated, not hand-typed. Repeated blocks appear once.

export const FLOW = "Browser → CopilotKit Runtime → LangSmith deployment → your agent";

export const INSTALL_CLI = "uv tool install langgraph-cli";

export const NEW_PROJECT = "langgraph new ./my-agent --template new-langgraph-project-python";

export const LANGGRAPH_JSON = "{\n  \"$schema\": \"https://langgra.ph/schema.json\",\n  \"dependencies\": [\".\"],\n  \"graphs\": {\n    \"agent\": \"./src/agent/graph.py:graph\"\n  },\n  \"env\": \".env\"\n}";

export const ADK_INSTALL = "pip install \"deployments-wrap-sdk[google-adk]\"";

export const ADK_AGENT = "from google.adk.agents import Agent\nfrom google.adk.runners import Runner\nfrom saf_sdk.adk import LangsmithSessionService, wrap\n\nagent = wrap(\n    Runner(\n        agent=Agent(\n            name=\"my_agent\",\n            model=\"gemini-3.8-flash\",\n            instruction=\"You are a helpful assistant.\",\n        ),\n        app_name=\"my_adk_agent\",\n        session_service=LangsmithSessionService(),\n    )\n)";

export const ADK_ENV = "LANGSMITH_API_KEY=lsv2_...";

export const DEPLOY = "langgraph deploy --name my-agent";

export const FRONTEND_INSTALL = "npm install @copilotkit/react-core @copilotkit/runtime";

export const ROUTE = "import {\n  CopilotRuntime,\n  createCopilotRuntimeHandler,\n  InMemoryAgentRunner,\n} from \"@copilotkit/runtime/v2\";\nimport { LangGraphAgent } from \"@copilotkit/runtime/langgraph\";\n\nconst runtime = new CopilotRuntime({\n  agents: {\n    my_agent: new LangGraphAgent({\n      deploymentUrl: process.env.LANGGRAPH_DEPLOYMENT_URL!, // your LangSmith API URL\n      graphId: \"agent\", // must match a key in your langgraph.json \"graphs\"\n      langsmithApiKey: process.env.LANGSMITH_API_KEY!,\n    }),\n  },\n  runner: new InMemoryAgentRunner(),\n});\n\nconst handler = createCopilotRuntimeHandler({\n  runtime,\n  basePath: \"/api/copilotkit\",\n});\n\nexport const GET = handler;\nexport const POST = handler;";

export const PROVIDERS = "\"use client\";\n\nimport { CopilotKit } from \"@copilotkit/react-core/v2\";\n\nexport function Providers({ children }: { children: React.ReactNode }) {\n  return (\n    <CopilotKit runtimeUrl=\"/api/copilotkit\" agent=\"my_agent\" useSingleEndpoint={false}>\n      {children}\n    </CopilotKit>\n  );\n}";

export const ENV_LOCAL = "LANGGRAPH_DEPLOYMENT_URL=https://<deployment-id>.<region>.langgraph.app\nLANGSMITH_API_KEY=lsv2_...";

export const DEV = "npm run dev";

export const ADK_LOCAL_DEV = "LANGGRAPH_API=true langgraph dev --host localhost --port 8000";

export const ADK_LANGGRAPH_JSON = "{\n  \"$schema\": \"https://langgra.ph/schema.json\",\n  \"dependencies\": [\".\"],\n  \"graphs\": {\n    \"my_agent\": \"./agent.py:agent\"\n  },\n  \"env\": \".env\"\n}";

export const LAYOUT = "import { Providers } from \"./providers\";\nimport \"@copilotkit/react-core/v2/styles.css\";\n\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <html lang=\"en\">\n      <body>\n        <Providers>\n          {children}\n        </Providers>\n      </body>\n    </html>\n  );\n}";

export const LOCAL_DEV_PYTHON = "# For Python 3.11 or above\nlanggraph dev --host localhost --port 8000";

export const LOCAL_DEV_TYPESCRIPT = "# For TypeScript with Node 20 or above\nnpx @langchain/langgraph-cli dev --host localhost --port 8000";

export const LOCAL_ENV = "LANGSMITH_API_KEY=your_langsmith_api_key";

export const SERVER = "import os\nfrom fastapi import FastAPI\nimport uvicorn\nfrom copilotkit import LangGraphAGUIAgent\nfrom ag_ui_langgraph import add_langgraph_fastapi_endpoint\nfrom sample_agent.agent import graph # the coagents-starter path, replace this if its different\n\nfrom dotenv import load_dotenv\nload_dotenv()\n\napp = FastAPI()\nadd_langgraph_fastapi_endpoint(\n  app=app,\n  agent=LangGraphAGUIAgent(\n    name=\"sample_agent\", # the name of your agent defined in langgraph.json\n    description=\"Describe your agent here, will be used for multi-agent orchestration\",\n    graph=graph, # the graph object from your langgraph import\n  ),\n  path=\"/your-agent-path\", # the endpoint you'd like to serve your agent on\n)\n\n# add new route for health check\n@app.get(\"/health\")\ndef health():\n    \"\"\"Health check.\"\"\"\n    return {\"status\": \"ok\"}\n\ndef main():\n    \"\"\"Run the uvicorn server.\"\"\"\n    port = int(os.getenv(\"PORT\", \"8000\"))\n    uvicorn.run(\n        \"sample_agent.demo:app\", # the path to your FastAPI file, replace this if its different\n        host=\"0.0.0.0\",\n        port=port,\n        reload=True,\n    )\n";

export const PAGE = "\"use client\";\n\nimport { CopilotSidebar } from \"@copilotkit/react-core/v2\";\n\nexport default function Page() {\n  return (\n    <main>\n      <h1>My App</h1>\n      <CopilotSidebar />\n    </main>\n  );\n}";
