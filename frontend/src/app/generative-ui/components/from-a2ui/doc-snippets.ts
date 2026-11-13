// Doc snippets shown as reference on this route, byte-exact from the
// rendered page. Generated, not hand-typed.

export const PROVIDER_BEFORE = "<CopilotKit runtimeUrl=\"/api/copilotkit\" a2ui={{ catalog: myCatalog }}>";

export const RUNTIME_BEFORE = "const runtime = new CopilotRuntime({\n  agents,\n  a2ui: { injectA2UITool: false, agents: [\"shop\"] },\n});";

export const RUNTIME_AFTER = "// Nothing: a run that carries a catalog gets the render_ui tool and the guide.\n// To force or limit it: generativeUI: true, or generativeUI: { agents: [\"shop\"] }.\nconst runtime = new CopilotRuntime({ agents });";

export const CATALOG_BEFORE = "import { createCatalog, DynamicStringSchema } from \"@copilotkit/a2ui-renderer\";\n\nconst definitions = {\n  Airport: {\n    props: z.object({ code: DynamicStringSchema, city: DynamicStringSchema }),\n  },\n  Arrow: { props: z.object({}) },\n};\nconst renderers = { Airport, Arrow };\nexport const myCatalog = createCatalog(definitions, renderers, {\n  catalogId: \"acme/flights\",\n  includeBasicCatalog: true,\n});";

export const V1_PROVIDER = "import { basicCatalogV1 } from \"@copilotkit/a2ui-renderer\";\n\n<CopilotKit runtimeUrl=\"/api/copilotkit\" a2ui={{ catalog: basicCatalogV1 }}>\n  {/* Your app */}\n</CopilotKit>";

export const V1_CUSTOM_CATALOG = "import { z } from \"zod\";\nimport {\n  createCatalog,\n  DynamicStringSchemaV1,\n} from \"@copilotkit/a2ui-renderer\";\n\nconst myCatalog = createCatalog(\n  { Greeting: { props: z.object({ name: DynamicStringSchemaV1 }) } },\n  { Greeting: ({ props }) => <p>Hello {props.name}</p> },\n  {\n    catalogId: \"acme/greetings@1\",\n    protocolVersion: \"1.0\",\n    includeBasicCatalog: true,\n  },\n);";
