// Doc snippets shown as reference on this route, byte-exact from the
// rendered page (https://docs.copilotkit.ai/google-adk/generative-ui/a2ui,
// fetched 2026-11-11). Generated, not hand-typed.

export const PYTHON_HELPERS = "from copilotkit import a2ui\n\na2ui.create_surface(surface_id, catalog_id=...)\na2ui.update_components(surface_id, components)\na2ui.update_data_model(surface_id, {\"items\": data})\na2ui.render(operations=[...])  # wraps in a2ui_operations and serializes";

export const PROVIDER_CATALOG = "import { CopilotKit } from \"@copilotkit/react-core/v2\";\n\n<CopilotKit runtimeUrl=\"/api/copilotkit\" a2ui={{ catalog: myCatalog }}>\n  {children}\n</CopilotKit>;";

export const RUNTIME_NO_CATALOG = "import { CopilotRuntime, InMemoryAgentRunner } from \"@copilotkit/runtime/v2\";\n\nconst runtime = new CopilotRuntime({\n  agents: { default: myAgent },\n  a2ui: { injectA2UITool: true },\n  runner: new InMemoryAgentRunner(),\n});";

export const SURFACE_COLORS = ".a2ui-surface {\n  --a2ui-color-surface: #fafafa; /* card, modal, chip and button backgrounds */\n  --a2ui-color-border: #e5e5e5; /* borders, tab rule, divider */\n  --a2ui-color-muted: #737373; /* captions and secondary text */\n  --a2ui-color-error: #dc2626; /* validation errors */\n  --a2ui-primary-color: #2563eb; /* primary buttons, selected chips, active tab */\n}";
