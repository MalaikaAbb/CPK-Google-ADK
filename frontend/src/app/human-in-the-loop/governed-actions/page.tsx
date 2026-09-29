import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

import { HANDLE_APPROVAL_SNIPPET, USE_INTERRUPT_SNIPPET } from "./doc-snippets";

export default function Page() {
  return (
    <>
      <RouteHeader path="/human-in-the-loop/governed-actions" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A frontend tool, <code>approve_governed_action</code>, that pauses
          the run on an approval card before a side effect. The card shows
          the action, the tool, its reference and the exact arguments. It
          acts on the verdict: <code>allow</code> resolves on its own,{" "}
          <code>deny</code> blocks, and <code>require_approval</code> waits
          for Approve or Reject.
        </p>
        <div className="mt-4">
          <Callout tone="warn" title="The governance is not real">
            The page publishes no policy engine, no agent and no{" "}
            <code>executeSideEffect</code>. The agent is this repo&apos;s
            generic one with no page-specific prompt, so <code>id</code>,{" "}
            <code>reference</code> and <code>verdict</code> are whatever the
            model puts in the tool call. The approval mechanism is real, but
            the decision it gates is invented.
          </Callout>
        </div>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Before emailing carol@northwind.test about her $420 refund, get my approval with approve_governed_action (verdict require_approval).",
              "Use approve_governed_action to apply a 30% discount to account NW-8812, verdict require_approval.",
            ]}
            expect={
              <>
                A card appears reading &quot;User approval required&quot;,
                with the summary, tool, reference and a JSON block of
                arguments, plus two unstyled buttons (the doc gives them no
                classes). The run waits. Approve or Reject resumes it, and the
                agent replies based on <code>approved</code>.
              </>
            }
            fail={
              <>
                No card, and the agent answers in prose. With no instruction
                the model decides when to call the tool, so name it explicitly
                as in the prompts above.
              </>
            }
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/human-in-the-loop/governed-actions/demo-chat/page.tsx" />
      </Panel>

      <Panel title="Inline approval with useInterrupt — not runnable on ADK">
        <Callout tone="warn" title="ag-ui-adk never raises an interrupt">
          This half needs the backend to pause the run with an AG-UI
          interrupt. The installed <code>ag_ui_adk</code> never emits one, and
          the page shows no ADK code that would. The block is shown as
          published and isn&apos;t mounted; its <code>GovernedActionCard</code>{" "}
          is what the demo above renders.
        </Callout>
        <div className="mt-4">
          <CodeBlock code={USE_INTERRUPT_SNIPPET} language="tsx" />
        </div>
      </Panel>

      <Panel title="Resume handling — reference only">
        <Callout tone="warn" title="executeSideEffect is never defined">
          The server-side check the page shows calls{" "}
          <code>executeSideEffect</code>, which no page defines. There&apos;s
          also no agent to put it in.
        </Callout>
        <div className="mt-4">
          <CodeBlock code={HANDLE_APPROVAL_SNIPPET} language="ts" />
        </div>
      </Panel>
    </>
  );
}
