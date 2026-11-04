import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";
import { RenderUiGeminiIssue } from "../_shop/render-ui-gemini-issue";

const DIR = "frontend/src/app/generative-ui/components/standard-catalog";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components/standard-catalog" />

      <RenderUiGeminiIssue />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <code>standardUI</code> is a ready-made catalog of 69 components
          (layout, text, inputs, tables, charts, media and more), including the
          A2UI 1.0 basic catalog under its own names. The demo uses it as is,
          then with the page&apos;s three changes: adding your own component
          with <code>extends</code>, dropping components with{" "}
          <code>omit</code>, and swapping one component&apos;s React
          implementation with <code>overrides</code>.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "(standardUI) Show a table of three running shoes with prices, and a bar chart of the prices",
              "(extends) Show me the cheapest running shoe as a product card",
              "(overrides) Put a short summary of our return policy in a card",
            ]}
            expect="Real tables, charts and cards rendered from the standard catalog. In extends mode, a ProductCard alongside standard components. In overrides mode, every Card has the rounded, shadowed MyCard look, while the agent still uses the same Card component."
            fail="Plain text only, or a Map or Video appearing in the omit mode, which should no longer offer them."
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCodeGroup
          files={[
            { file: `${DIR}/demo-chat/page.tsx` },
            { file: `${DIR}/app-ui-extends.tsx` },
            { file: `${DIR}/app-ui-omit.tsx` },
            { file: `${DIR}/app-ui-overrides.tsx` },
          ]}
        />
      </Panel>

      <Callout tone="info" title="Map and Chart">
        <p>
          <code>Chart</code> works out of the box (it uses <code>recharts</code>,
          which ships with CopilotKit). <code>Map</code> needs{" "}
          <code>maplibre-gl</code>, which this repo doesn&apos;t install. The
          page says a map then falls back to a list of the places, so expect
          that here.
        </p>
      </Callout>

      <Callout tone="warn" title="Harness-authored pieces">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <code>ProductCard</code> and <code>productSchema</code> (
            <code>product-card.tsx</code>). The &ldquo;Add your own
            components&rdquo; snippet registers them without defining them.
          </li>
          <li>
            The import line of the <code>omit</code> snippet, which relies on
            the one above it on the page.
          </li>
          <li>The runtime and the ADK agent (see Surfaces).</li>
        </ul>
        <p className="mt-2">
          This page has no framework prefix in the link you were given (
          <code>/generative-ui/components/standard-catalog</code>). The{" "}
          <code>/google-adk/…</code> URL serves the same content.
        </p>
      </Callout>
    </>
  );
}
