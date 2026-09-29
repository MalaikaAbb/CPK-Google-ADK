import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

const DIR = "frontend/src/app/generative-ui/open-generative-ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/open-generative-ui" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          One runtime flag, <code>openGenerativeUI.agents</code>, lets an
          agent build HTML, CSS and JS through a <code>generateSandboxedUi</code>{" "}
          tool call. The runtime middleware turns that call into activity
          events, and the provider&apos;s built-in renderer draws the result
          in a sandboxed iframe as it streams. The <em>advanced</em> mode also
          registers two host functions the generated page can call back into.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "build me a simple greeting card",
              "(advanced) Build a calculator whose = button calls evaluateExpression on the host",
              "(advanced) Build a button that sends 'hello from the sandbox' with notifyHost",
            ]}
            expect={
              <>
                An iframe preview appears in the chat. Placeholder text shows
                first, then styles, then the HTML fills in, then scripts run.
                In advanced mode, using the generated UI logs{" "}
                <code>[open-gen-ui/advanced] evaluateExpression …</code> or{" "}
                <code>notifyHost: …</code> in the browser console.
              </>
            }
            fail={
              <>
                A plain text reply with no iframe. Either the model didn&apos;t
                call <code>generateSandboxedUi</code> (the agent has no
                page-specific prompt, so ask for a UI explicitly), or the
                middleware isn&apos;t engaged. Check that the Network tab shows
                requests going to <code>/api/copilotkit-ogui</code>.
              </>
            }
          />
        </div>
      </Panel>

      <Panel title="Doc gaps filled or left out">
        <Callout tone="warn" title="What the page does not publish">
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Both agents.</strong> The runtime points at{" "}
              <code>/open_gen_ui</code> and <code>/open_gen_ui_advanced</code>{" "}
              but no agent code is shown. This repo mounts its generic{" "}
              <code>AGUIToolset()</code> agent at both paths, with no
              page-specific prompt.
            </li>
            <li>
              <strong>
                <code>headers</code>
              </strong>{" "}
              is used in the runtime snippet but never defined. Here it&apos;s
              an empty object.
            </li>
            <li>
              <strong>
                <code>Chat</code>
              </strong>{" "}
              is rendered by both frontend snippets but never defined. Here
              it&apos;s a bare <code>&lt;CopilotChat /&gt;</code>.
            </li>
            <li>
              <strong>
                <code>VISUALIZATION_DESIGN_SKILL</code>
              </strong>{" "}
              is never defined, so the minimal demo drops its{" "}
              <code>designSkill</code> line and uses the default design skill.
            </li>
            <li>
              <strong>
                <code>./suggestions</code>
              </strong>{" "}
              is imported by the advanced snippet but never published, so that
              import is removed. The snippet never used it.
            </li>
            <li>
              <strong>The advanced snippet is cut off.</strong> It ends at{" "}
              <code>&lt;/CopilotKit&gt;</code> with no closing{" "}
              <code>);</code> or <code>{"}"}</code>.
            </li>
          </ul>
        </Callout>
      </Panel>

      <Panel title="The runtime">
        <SourceCode file="frontend/src/app/api/copilotkit-ogui/[[...slug]]/route.ts" />
      </Panel>

      <Panel title="The frontend">
        <SourceCodeGroup
          files={[
            { file: `${DIR}/open-gen-ui.tsx` },
            { file: `${DIR}/open-gen-ui-advanced.tsx` },
            { file: `${DIR}/sandbox-functions.ts` },
            { file: `${DIR}/chat.tsx` },
          ]}
        />
      </Panel>

      <Panel title="The agents">
        <SourceCode file="backend/src/agents/chat_agents.py" region="doc-gap-agents" />
      </Panel>
    </>
  );
}
