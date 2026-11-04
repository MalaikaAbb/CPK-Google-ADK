import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

import { EXPORT, VALIBOT, ZOD } from "./doc-snippets";
import { ExportPreview } from "./export-preview";
import { RenderUiGeminiIssue } from "../_shop/render-ui-gemini-issue";

const DIR = "frontend/src/app/generative-ui/components";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components/catalogs" />

      <RenderUiGeminiIssue />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A catalog, built with <code>createGenerativeUI</code>, declares the
          components the agent may render. Each entry pairs a React component
          with a description and a props schema. The agent gets the
          descriptions and JSON Schema; your components get typed props.{" "}
          <code>extends</code> merges catalogs, and{" "}
          <code>exportA2UICatalog</code> writes the result as an A2UI 1.0
          catalog definition.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "(shopUI) Show me running shoes",
              "(appUI) Show a hero titled 'Spring sale', then a cart summary of 3 items for $150",
            ]}
            expect="shopUI: a ProductGrid of ProductCards whose names, prices and images match the search_products result. appUI: the gradient Hero and a CartSummary line, plus any standard components the agent picks."
            fail="Plain text only, or cards with invented prices. Check the Inspector's Catalog tab (Generative UI pane) to see whether the run carried the catalog."
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCodeGroup
          files={[
            { file: `${DIR}/catalogs/demo-chat/page.tsx` },
            { file: `${DIR}/_shop/catalog.tsx` },
            { file: `${DIR}/catalogs/app-ui.tsx` },
          ]}
        />
      </Panel>

      <Panel
        title="Exported catalogs"
        description="exportA2UICatalog, run live. The parameterOrder view should list Panel's properties as component, title, children, color."
      >
        <ExportPreview />
        <div className="mt-4">
          <SourceCodeGroup
            files={[
              { file: `${DIR}/catalogs/export-preview.tsx` },
              { file: `${DIR}/catalogs/panel-ui.tsx` },
            ]}
          />
        </div>
        <div className="mt-4">
          <CodeBlock code={EXPORT} filename="The page's export snippet" language="ts" />
        </div>
      </Panel>

      <Panel title="Typed props (compile-time check)">
        <p className="mb-3 text-sm text-slate-700 dark:text-slate-300">
          The page&apos;s <code>props.color</code> line sits under a{" "}
          <code>@ts-expect-error</code>. If <code>color</code> ever stopped
          being a type error, the build would fail.
        </p>
        <SourceCode file={`${DIR}/catalogs/typing-check.tsx`} />
      </Panel>

      <Panel title="Schema libraries">
        <p className="mb-3 text-sm text-slate-700 dark:text-slate-300">
          The demo uses the zod tab. The Valibot tab needs{" "}
          <code>valibot</code> and <code>@valibot/to-json-schema</code>,
          which this repo doesn&apos;t install, so it is shown, not run.
        </p>
        <div className="grid gap-4 lg:grid-cols-2">
          <CodeBlock code={ZOD} filename="zod (used)" language="ts" />
          <CodeBlock code={VALIBOT} filename="Valibot (not installed)" language="ts" />
        </div>
      </Panel>

      <Callout tone="warn" title="Harness-authored pieces">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <code>cartUI</code> (a one-component catalog) and <code>Hero</code>.
            The page extends and registers both without showing them.
          </li>
          <li>
            <code>Panel</code> for the <code>parameterOrder</code> snippet.
          </li>
          <li>
            The export preview shows the JSON instead of calling{" "}
            <code>fs.writeFileSync</code>, which doesn&apos;t exist in a
            browser.
          </li>
          <li>
            The runtime and the ADK agent with <code>search_products</code>.
            See the{" "}
            <a href="/generative-ui/components/surfaces" className="text-[var(--accent)] underline underline-offset-4">
              Surfaces
            </a>{" "}
            route.
          </li>
        </ul>
      </Callout>
    </>
  );
}
