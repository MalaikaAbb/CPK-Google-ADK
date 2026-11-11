import Link from "next/link";

import { RouteHeader } from "@/components/route-header";
import { Callout, Panel } from "@/components/ui";

/**
 * Reference-only route. Rendered for Google ADK, the Headless Interrupts page
 * shows a "Not supported on Google ADK" banner and prints no code at all, so
 * there is nothing to reproduce here.
 */
export default function Page() {
  const link = "text-[var(--accent)] underline underline-offset-4";
  return (
    <>
      <RouteHeader path="/human-in-the-loop/headless" />

      <Callout tone="warn" title="Not supported on Google ADK — the page says so itself">
        <p>
          The rendered page opens with a &quot;Not supported on Google
          ADK&quot; banner and a note that headless interrupts need either a
          native <code>interrupt(...)</code> primitive or a Promise-resolving
          frontend-tool path. Every code block on the page is left out for
          this framework: no agent, no hook, no demo. Nothing was invented in
          their place (README §9 #33).
        </p>
      </Callout>

      <Panel title="What the page is about">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Resolving an agent interrupt from any part of the UI without the
          chat transcript: <code>useInterrupt</code> with{" "}
          <code>renderInChat: false</code>, or the raw{" "}
          <code>agent.subscribe</code> + <code>copilotkit.runAgent(&#123; resume &#125;)</code>{" "}
          primitives underneath it. Both need a run that pauses with an
          interrupt, which <code>ag_ui_adk</code> never produces. The page
          sends ADK users to{" "}
          <Link href="/human-in-the-loop" className={link}>
            useHumanInTheLoop
          </Link>
          ; see also{" "}
          <Link href="/human-in-the-loop/useInterrupt" className={link}>
            Pausing the Agent for Input
          </Link>
          .
        </p>
      </Panel>
    </>
  );
}
