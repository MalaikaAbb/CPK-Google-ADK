import Link from "next/link";

import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

import {
  APPROVAL_INTERRUPT,
  CODE_TAB_AGENT,
  CODE_TAB_PAGE,
  CODE_TAB_ROUTE,
  CODE_TAB_TIME_PICKER,
  MULTI_INTERRUPT,
  OUTCOME,
} from "./doc-snippets";

/**
 * Reference-only route. The rendered Google ADK page says `useInterrupt` is
 * not available on this framework, and its Code tab demo imports modules the
 * page never publishes. Everything is shown verbatim from ./doc-snippets.ts;
 * nothing is imported or run.
 */
export default function Page() {
  const link = "text-[var(--accent)] underline underline-offset-4";
  return (
    <>
      <RouteHeader path="/human-in-the-loop/useInterrupt" />

      <Callout tone="warn" title="Not available on Google ADK — the page says so itself">
        <p>
          <code>useInterrupt</code> listens for a run that ends with an AG-UI
          interrupt (or a legacy <code>on_interrupt</code> event). ADK has no{" "}
          <code>interrupt(...)</code> primitive and <code>ag_ui_adk</code>{" "}
          never emits one, so the hook would never fire. The rendered page
          points ADK users to <code>useHumanInTheLoop</code>, which{" "}
          <Link href="/human-in-the-loop" className={link}>
            /human-in-the-loop
          </Link>{" "}
          already runs.
        </p>
      </Callout>

      <Callout tone="warn" title="Doc gaps: the Code tab demo can't be built as published">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <code>page.tsx</code> imports <code>generateFallbackSlots</code> /{" "}
            <code>TimeSlot</code> from <code>../_shared/interrupt-fallback-slots</code>{" "}
            and <code>useGenUiInterruptSuggestions</code> from{" "}
            <code>./suggestions</code>; neither file is published.
          </li>
          <li>
            <code>time-picker-card.tsx</code> imports <code>./card</code>,{" "}
            <code>./button</code> and <code>./badge</code>, which are not in the
            tab.
          </li>
          <li>
            <code>route.ts</code> imports <code>@/lib/header-forwarding</code>{" "}
            (unpublished) and lists about forty showcase agents.{" "}
            <code>interrupt_agent.py</code> imports{" "}
            <code>agents.shared_chat.get_model</code>, which no page defines.
          </li>
          <li>
            The demo itself is not <code>useInterrupt</code>: it is the{" "}
            <code>useHumanInTheLoop</code> fallback (&quot;Strategy B&quot;)
            with a frontend <code>schedule_meeting</code> tool.
          </li>
        </ul>
        <p className="mt-2">
          Nothing is filled in. The missing modules would stop the files
          compiling, so they are shown as text, not built (README §9 #32).
        </p>
      </Callout>

      <Panel title="The page's hook snippets">
        <div className="space-y-4">
          <CodeBlock code={OUTCOME} filename="Standard flow: RUN_FINISHED outcome" language="ts" />
          <CodeBlock code={APPROVAL_INTERRUPT} filename="Approve / cancel example" language="tsx" />
          <CodeBlock code={MULTI_INTERRUPT} filename="Multiple interrupts" language="tsx" />
        </div>
      </Panel>

      <Panel title="The Code tab (Google ADK)">
        <div className="space-y-4">
          <CodeBlock code={CODE_TAB_AGENT} filename="src/agents/interrupt_agent.py" language="python" />
          <CodeBlock code={CODE_TAB_PAGE} filename="src/app/demos/gen-ui-interrupt/page.tsx" language="tsx" />
          <CodeBlock
            code={CODE_TAB_TIME_PICKER}
            filename="src/app/demos/gen-ui-interrupt/_components/time-picker-card.tsx"
            language="tsx"
          />
          <CodeBlock code={CODE_TAB_ROUTE} filename="src/app/api/copilotkit/route.ts" language="ts" />
        </div>
      </Panel>
    </>
  );
}
