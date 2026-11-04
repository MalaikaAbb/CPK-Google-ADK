import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

import { ALLOWED_CALLERS } from "./doc-snippets";
import { RenderUiGeminiIssue } from "../_shop/render-ui-gemini-issue";

const DIR = "frontend/src/app/generative-ui/components/state-and-actions";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components/state-and-actions" />

      <RenderUiGeminiIssue />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Three ways generated UI connects to the app. <code>state</code> +{" "}
          <code>bind</code> fill a prop from live app data that the agent
          never sets or sees. <code>functions</code> + <code>events</code> run
          app code on a click, with no message to the agent.{" "}
          <code>writable</code> props keep what the user types, even against
          later agent updates. An event that matches no function becomes a
          visible user message instead.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "(Functions) Show me running shoes with add-to-cart buttons",
              "Click Add to cart on two cards",
              "(App state) Show me the same running shoes",
              "(Writable + click to agent) Show a checkout form with my email prefilled as a@b.co, and buttons for the Starter and Team plans",
            ]}
            expect="Functions: each click adds to the cart in the top bar, and nothing is sent to the agent. App state: each card shows 'In cart: N' from the cart, not from the agent. Writable: edits to the email field stay put. A plan click appears as a user message and the agent answers it."
            fail="Add to cart sends a chat message, inCart is always 0 after adding, or a plan click does nothing."
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCodeGroup
          files={[
            { file: `${DIR}/demo-chat/page.tsx` },
            { file: `${DIR}/catalog-functions.tsx` },
            { file: `${DIR}/catalog-state.tsx` },
            { file: `${DIR}/catalog-extras.tsx` },
            { file: `${DIR}/cart.ts` },
          ]}
        />
      </Panel>

      <Panel title="Who may call a function — shown, not run">
        <p className="mb-3 text-sm text-slate-700 dark:text-slate-300">
          A fragment of a <code>functions</code> block, and the page says the
          agent can&apos;t call renderer functions in this version anyway, so
          there is nothing to exercise.
        </p>
        <CodeBlock code={ALLOWED_CALLERS} filename="allowedCallers" language="ts" />
      </Panel>

      <Callout tone="warn" title="Harness-authored pieces">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <code>Cart</code> and <code>useCart</code>. The page reads{" "}
            <code>cart.items</code> and calls <code>cart.addItem</code> without
            defining them.
          </li>
          <li>
            The state catalog&apos;s <code>ProductCard</code>, which the page
            registers but only defines for the functions catalog.
          </li>
          <li>
            <code>catalog-extras.tsx</code>, an approved CopilotKit wrapper.
            The <code>CheckoutForm</code> entry and the <code>onChoose</code>{" "}
            event are bare fragments on the page, so the harness puts them in a
            catalog, with a minimal <code>PlanButton</code> carrying{" "}
            <code>onChoose</code>.
          </li>
          <li>
            One provider per catalog: the page declares <code>shopUI</code>{" "}
            more than once, and a provider takes one UI.
          </li>
        </ul>
      </Callout>
    </>
  );
}
