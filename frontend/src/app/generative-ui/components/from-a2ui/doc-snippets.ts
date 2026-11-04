// Doc snippets shown as reference on this route, byte-exact from the
// rendered page. Generated, not hand-typed.

export const PROVIDER_BEFORE = "<CopilotKit runtimeUrl=\"/api/copilotkit\" a2ui={{ catalog: myCatalog }}>";

export const RUNTIME_BEFORE = "const runtime = new CopilotRuntime({\n  agents,\n  a2ui: { injectA2UITool: false, agents: [\"shop\"] },\n});";

export const RUNTIME_AFTER = "// Nothing: a run that carries a catalog gets the render_ui tool and the guide.\n// To force or limit it: generativeUI: true, or generativeUI: { agents: [\"shop\"] }.\nconst runtime = new CopilotRuntime({ agents });";

export const CATALOG_BEFORE = "import { createCatalog, DynamicStringSchema } from \"@copilotkit/a2ui-renderer\";\n\nconst definitions = {\n  Airport: {\n    props: z.object({ code: DynamicStringSchema, city: DynamicStringSchema }),\n  },\n  Arrow: { props: z.object({}) },\n};\nconst renderers = { Airport, Arrow };\nexport const myCatalog = createCatalog(definitions, renderers, {\n  catalogId: \"acme/flights\",\n  includeBasicCatalog: true,\n});";
