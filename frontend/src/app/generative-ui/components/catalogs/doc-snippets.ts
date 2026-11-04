// Doc snippets shown as reference on this route, byte-exact from the
// rendered page. Generated, not hand-typed.

export const VALIBOT = "import * as v from \"valibot\";\nimport { toStandardJsonSchema } from \"@valibot/to-json-schema\";\n\nprops: toStandardJsonSchema(v.object({ name: v.string(), price: v.number() })),";

export const ZOD = "import { z } from \"zod\";\n\nprops: z.object({ name: z.string(), price: z.number() }),";

export const EXPORT = "import { exportA2UICatalog } from \"@copilotkit/react-core/v2/generative-ui\";\n\nconst catalog = exportA2UICatalog(appUI, { title: \"Acme app\" });\nfs.writeFileSync(\"acme-catalog.json\", JSON.stringify(catalog, null, 2));";
