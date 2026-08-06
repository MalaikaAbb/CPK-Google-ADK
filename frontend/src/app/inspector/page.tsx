import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/inspector" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A debugging overlay that floats above your app and shows what is
          actually happening between the frontend and the agents. It is mounted
          by the provider, not by any page — so it is present on{" "}
          <strong>every route in this harness</strong>, not just this one. Look
          for the button in the bottom-left corner.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The demo exists because an inspector with nothing to inspect proves
          very little: it deliberately registers a frontend tool and two context
          entries, and drives an agent that owns state, so all five tabs have
          content.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Open the inspector, then send: highlight the churn panel",
              "Then: I'm a data analyst working mostly in SQL",
            ]}
            expect="Events stream into the AG-UI tab; Frontend Tools already lists highlight_panel with its enum schema; Context shows both entries; Agent State fills with notes after the second message."
            fail="No inspector button at all — the provider is missing showDevConsole, or you are not on localhost / 127.0.0.1."
          />
        </div>
      </Panel>

      <Panel title="The five tabs">
        <dl className="space-y-2 text-sm">
          {[
            ["AG-UI Events", "The raw event stream between frontend and agent, live."],
            ["Available Agents", "Which agents are connected and addressable."],
            ["Agent State", "The current state object, updating as it changes."],
            ["Frontend Tools", "Tools defined in React, with their parameter schemas."],
            ["Context", "What you have published to the agent — readables and document context."],
          ].map(([name, desc]) => (
            <div key={name} className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
              <dt className="shrink-0 font-medium text-slate-900 sm:w-40 dark:text-slate-100">
                {name}
              </dt>
              <dd className="text-slate-600 dark:text-slate-400">{desc}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
          A sixth, <strong>Threads</strong>, is the tab the inspector opens on
          by default — and it needs an Enterprise Intelligence Platform key to
          show anything. That is why this route is marked Partial rather than
          Working: the tab you land on first is the one that will be empty.
        </p>
      </Panel>

      <Panel
        title="Where it is turned on"
        description="One prop on the app-wide provider — nothing per-route."
      >
        <SourceCode file="frontend/src/components/providers.tsx" />
      </Panel>

     

      <Panel title="The demo">
        <SourceCodeGroup
          files={[{ file: "frontend/src/app/inspector/demo-chat/page.tsx" }]}
          note="Nothing here mounts the inspector — it registers a frontend tool and two context entries so the inspector's tabs are not empty."
        />
      </Panel>

  

      <Panel title="Who owns it on which route">
        <SourceCode file="frontend/src/lib/inspector.ts" />
      </Panel>

      <Callout tone="info" title="How it disables itself">
        <p>
          The doc says it &quot;automatically disables when you create a
          production build&quot;. The mechanism is hostname, not{" "}
          <code>NODE_ENV</code>: <code>&quot;auto&quot;</code> renders the
          inspector only when{" "}
          <code>window.location.hostname</code> is <code>localhost</code> or{" "}
          <code>127.0.0.1</code>. A production build served from{" "}
          <code>localhost</code> still shows it; a dev build on a LAN IP does
          not. Pass <code>true</code> or <code>false</code> if you want the
          decision to be yours.
        </p>
      </Callout>

      <Callout tone="info" title="Nothing extra to install">
        <p>
          <code>CopilotKitInspector</code> lazy-imports{" "}
          <code>@copilotkit/web-inspector</code> on mount, and that package is a
          direct dependency of <code>@copilotkit/react-core</code> — so it is
          already in <code>node_modules</code> and does not appear in this
          repo&apos;s <code>package.json</code>. Also: never mount{" "}
          <code>&lt;CopilotKitInspector /&gt;</code> by hand. It forwards{" "}
          <code>core ?? null</code>, so a bare instance renders but reports that
          no core is attached. The provider is the supported path.
        </p>
      </Callout>
    </>
  );
}
