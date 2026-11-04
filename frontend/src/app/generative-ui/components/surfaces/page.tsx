import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";
import { RenderUiGeminiIssue } from "../_shop/render-ui-gemini-issue";

const DIR = "frontend/src/app/generative-ui/components";

const LIMIT_SNIPPET = `<GenerativeUISurface id="featured" ui={shopUI} components={["ProductGrid", "ProductCard"]} />`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components/surfaces" />

      <RenderUiGeminiIssue />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Generated UI outside the chat. <code>GenerativeUISurface</code> marks
          an area of the page as a named target. While it is on screen, the
          agent sees its id, its description and the components allowed in it,
          and can render, update or delete a surface there. Until it does, the
          target shows its <code>fallback</code>.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Show me cheap running shoes in the featured row",
              "Show the featured products again",
              "Pick Wind Shell above, then ask: recommend something to go with this",
              "Put a short note about sizing in the notes area",
            ]}
            expect="The featured row's three default cards are replaced by a ProductGrid of running shoes under $100, and the page scrolls to it if needed. Asking for the featured products again deletes the surface and the default row returns. Recommendations land under the selected product, without that product itself. The note renders in the notes area with no scroll."
            fail="The agent answers only in the chat, or the row never changes. Check the Surfaces tab of the Inspector's Generative UI pane: if no targets are listed, the run carried no catalog."
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCodeGroup
          files={[
            { file: `${DIR}/surfaces/demo-chat/page.tsx` },
            { file: `${DIR}/surfaces/featured-products.tsx` },
            { file: `${DIR}/_shop/catalog.tsx` },
          ]}
        />
      </Panel>

      <Panel title="Not mounted separately">
        <p className="mb-3 text-sm text-slate-700 dark:text-slate-300">
          The &ldquo;Limit the components&rdquo; snippet is the same target as{" "}
          <code>FeaturedProducts</code> with fewer props. A second surface with
          id <code>featured</code> would collide, so <code>FeaturedProducts</code>{" "}
          is what exercises <code>components</code>.
        </p>
        <CodeBlock code={LIMIT_SNIPPET} filename="Limit the components" language="tsx" />
      </Panel>

      <Callout tone="warn" title="Harness-authored pieces">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <code>Product</code>, <code>ProductRow</code> and the sample
            products (<code>_shop/products.tsx</code>). The page uses them
            without defining them.
          </li>
          <li>
            The selected <code>product</code> for the per-item target, and the
            page layout around the snippets.
          </li>
          <li>
            The runtime (<code>/api/copilotkit-genui</code>) and the ADK agent
            with its <code>search_products</code> tool. No Components page
            shows a Google ADK agent.
          </li>
        </ul>
      </Callout>

      <Panel title="The agent and runtime">
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/api/copilotkit-genui/[[...slug]]/route.ts" },
            { file: "backend/src/agents/genui_agent.py" },
          ]}
        />
      </Panel>
    </>
  );
}
