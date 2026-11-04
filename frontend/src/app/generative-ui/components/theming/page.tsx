import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

import { HTML_DARK, MAP_STYLE } from "./doc-snippets";
import { RenderUiGeminiIssue } from "../_shop/render-ui-gemini-issue";

const DIR = "frontend/src/app/generative-ui/components/theming";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components/theming" />

      <RenderUiGeminiIssue />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Every color, radius, shadow and font of the standard components is a
          CSS variable. The provider&apos;s <code>theme</code> sets them (typed,
          so a misspelled key fails the build), a nested <code>dark</code>{" "}
          object overrides values in dark mode only, and the same variables
          can be set in CSS on <code>.a2ui-surface</code>. Dark mode switches
          on when an ancestor has the <code>dark</code> class.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Show a form with a name field, a slider and a submit button",
              "Toggle 'dark ancestor', then switch between the four modes",
            ]}
            expect="Buttons, the slider and focus rings use amber #d97706 in every mode. 'theme option' also uses Inter and 10px medium radii. With 'dark ancestor' on, components turn dark, and in 'light + dark values' the panel and surface colors become #1f2937 / #111827."
            fail="Components keep the default neutral accent, or stay light under the dark class."
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCodeGroup
          files={[
            { file: `${DIR}/demo-chat/page.tsx` },
            { file: `${DIR}/theme.ts` },
          ]}
        />
      </Panel>

      <Panel title="Shown, not run">
        <p className="mb-3 text-sm text-slate-700 dark:text-slate-300">
          <code>mapStyle</code> points at placeholder tile URLs, and{" "}
          <code>Map</code> needs <code>maplibre-gl</code>, which this repo
          doesn&apos;t install. The <code>&lt;html class=&quot;dark&quot;&gt;</code>{" "}
          line is what the page&apos;s script produces.
        </p>
        <div className="grid gap-4 lg:grid-cols-2">
          <CodeBlock code={MAP_STYLE} filename="The map" language="ts" />
          <CodeBlock code={HTML_DARK} filename="Dark mode" language="html" />
        </div>
      </Panel>

      <Callout tone="warn" title="Harness-authored pieces">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            The &ldquo;dark ancestor&rdquo; checkbox, which puts a{" "}
            <code>dark</code> class on a wrapper so dark mode can be checked
            without changing the system setting.
          </li>
          <li>
            The page&apos;s <code>colorSchemeScript</code> runs in the demo
            body rather than <code>&lt;head&gt;</code>. Only the first-paint
            flash it prevents is affected.
          </li>
          <li>The runtime and the ADK agent (see Surfaces).</li>
        </ul>
      </Callout>
    </>
  );
}
