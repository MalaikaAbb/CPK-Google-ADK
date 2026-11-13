import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

import {
  CATALOG_BEFORE,
  PROVIDER_BEFORE,
  RUNTIME_AFTER,
  RUNTIME_BEFORE,
  V1_CUSTOM_CATALOG,
  V1_PROVIDER,
} from "./doc-snippets";
import { RenderUiGeminiIssue } from "../_shop/render-ui-gemini-issue";

const DIR = "frontend/src/app/generative-ui/components/from-a2ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components/from-a2ui" />

      <RenderUiGeminiIssue />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The migration from the A2UI v0.9 renderer (
          <code>@copilotkit/a2ui-renderer</code>, <code>createCatalog</code>,
          the <code>a2ui</code> provider option) to components and surfaces
          (A2UI 1.0). The demo runs the page&apos;s &ldquo;After&rdquo; catalog:
          plain zod props, a description per component, and{" "}
          <code>extends: [standardUI]</code> in place of{" "}
          <code>includeBasicCatalog</code>.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Show my flight from SFO (San Francisco) to JFK (New York) as airports with an arrow between them"]}
            expect="Two Airport tiles (code over city) with an Arrow between them, laid out with a standard Row. No v0.9 { path } bindings: the agent writes 1.0 operations."
            fail="Nothing renders, and the Inspector shows operations rejected with a reason naming the 1.0 form. That means the agent wrote v0.9 shapes."
          />
        </div>
      </Panel>

      <Panel title="After — the demo">
        <SourceCodeGroup
          files={[
            { file: `${DIR}/demo-chat/page.tsx` },
            { file: `${DIR}/app-ui.tsx` },
          ]}
        />
      </Panel>

      <Panel title="Before — shown, not run">
        <div className="grid gap-4 lg:grid-cols-2">
          <CodeBlock code={PROVIDER_BEFORE} filename="Provider, before" language="tsx" />
          <CodeBlock code={CATALOG_BEFORE} filename="Catalog, before" language="ts" />
          <CodeBlock code={RUNTIME_BEFORE} filename="Runtime, before" language="ts" />
          <CodeBlock code={RUNTIME_AFTER} filename="Runtime, after" language="ts" />
        </div>
        <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">
          The demo&apos;s runtime is the Transports page&apos;s, with{" "}
          <code>generativeUI: true</code>. For a run that carries a catalog,
          that matches the page&apos;s empty &ldquo;after&rdquo; runtime.
        </p>
      </Panel>

      <Panel title="1.0 with the React a2ui renderer — shown, not run">
        <div className="grid gap-4 lg:grid-cols-2">
          <CodeBlock code={V1_PROVIDER} filename="Native 1.0 basic catalog" language="tsx" />
          <CodeBlock code={V1_CUSTOM_CATALOG} filename="Custom 1.0 catalog" language="tsx" />
        </div>
        <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">
          Text only: this repo pins <code>@copilotkit/a2ui-renderer</code>{" "}
          1.84.0, which exports neither <code>basicCatalogV1</code> nor{" "}
          <code>DynamicStringSchemaV1</code> (nor <code>protocolVersion</code>{" "}
          on <code>createCatalog</code>). Running them needs a newer
          CopilotKit, which the page doesn&apos;t name, and an ADK agent that
          emits native 1.0 <code>a2ui_operations</code>, which it doesn&apos;t
          show.
        </p>
      </Panel>

      <Callout tone="warn" title="Harness-authored pieces">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <code>Airport</code> and <code>Arrow</code> (
            <code>flight-components.tsx</code>), which the page registers
            without defining.
          </li>
          <li>The runtime and the ADK agent (see Surfaces).</li>
        </ul>
      </Callout>
    </>
  );
}
