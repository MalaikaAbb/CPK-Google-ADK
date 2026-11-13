import Link from "next/link";

import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

import {
  PROVIDER_CATALOG,
  PYTHON_HELPERS,
  RUNTIME_NO_CATALOG,
  SURFACE_COLORS,
} from "./doc-snippets";

/**
 * The A2UI overview page. It has no demo of its own: it introduces the two
 * approaches and the two ways to switch A2UI on, which the Dynamic Schema and
 * Fixed Schema routes already run. The page's snippets are shown verbatim from
 * ./doc-snippets.ts; they are fragments (myCatalog, myAgent and children are
 * never defined on the page), so they are not compiled.
 */
export default function Page() {
  const link = "text-[var(--accent)] underline underline-offset-4";
  return (
    <>
      <RouteHeader path="/generative-ui/a2ui" />

      <Panel title="What the page covers">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A surface is built from three operations, in order:{" "}
          <code>createSurface</code>, <code>updateComponents</code> (the tree)
          and <code>updateDataModel</code> (the data, bound by JSON Pointer).
          Two approaches produce them:{" "}
          <Link href="/generative-ui/a2ui/dynamic-schema" className={link}>
            Dynamic Schema
          </Link>
          , where a secondary LLM designs tree and data, and{" "}
          <Link href="/generative-ui/a2ui/fixed-schema" className={link}>
            Fixed Schema
          </Link>
          , where the tree is authored up front and the agent sends data only.
          A2UI is switched on by a catalog on the provider or by an{" "}
          <code>a2ui</code> block on the runtime, and the basic catalog can be
          recolored with CSS variables.
        </p>
      </Panel>

      <Panel title="The operations, through the CopilotKit Python SDK">
        <CodeBlock code={PYTHON_HELPERS} filename="Python helpers" language="python" />
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          Shown, not run. This ADK backend doesn&apos;t install the{" "}
          <code>copilotkit</code> Python package; its Fixed Schema tool builds
          the <code>a2ui_operations</code> container as a plain dict (
          <code>backend/src/agents/a2ui_fixed_agent.py</code>).
        </p>
      </Panel>

      <Panel title="Setup 1: a catalog on the provider (recommended)">
        <CodeBlock code={PROVIDER_CATALOG} filename="app/page.tsx" language="tsx" />
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          Runs on{" "}
          <Link href="/generative-ui/a2ui/dynamic-schema" className={link}>
            /generative-ui/a2ui/dynamic-schema
          </Link>
          : its demo passes <code>a2ui=&#123;&#123; catalog: myCatalog &#125;&#125;</code>{" "}
          and its runtime (<code>/api/copilotkit-declarative-gen-ui</code>) has
          no <code>a2ui</code> block, so <code>generate_a2ui</code> is injected
          from the catalog alone.
        </p>
      </Panel>

      <Panel title="Setup 2: enable on the runtime without a catalog">
        <CodeBlock code={RUNTIME_NO_CATALOG} filename="app/api/copilotkit/[[...slug]]/route.ts" language="ts" />
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          Not run as printed. This repo&apos;s main runtime uses an{" "}
          <code>a2ui</code> block the other way round,{" "}
          <code>&#123; injectA2UITool: false, agents: [&quot;a2ui-fixed-schema&quot;] &#125;</code>
          , for the Fixed Schema agent that owns its own tool (the page&apos;s
          &quot;opt out&quot; case). No route runs the no-catalog, auto-inject
          combination shown here.
        </p>
      </Panel>

      <Panel title="Colors and dark mode">
        <CodeBlock code={SURFACE_COLORS} filename=".a2ui-surface variables" language="css" />
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          Shown, not applied: no route in this repo sets these variables.
        </p>
      </Panel>

      <Callout tone="info" title="Fragments, not files">
        <p>
          The setup snippets use <code>myCatalog</code>, <code>myAgent</code>{" "}
          and <code>children</code> without defining them, so they are kept as
          text rather than compiled. The working forms are on the two schema
          routes.
        </p>
      </Callout>
    </>
  );
}
