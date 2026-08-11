import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/shared-state" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          One object that both sides can read and write. In ADK it lives in{" "}
          <code>tool_context.state</code>: tools write to it directly and the
          runtime forwards updates to the UI, while <code>agent.setState</code>{" "}
          pushes values the other way for the agent to read on its next turn.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The demo shows both directions at once — the agent writes{" "}
          <code>notes</code>, you write <code>preferences</code>, and neither
          goes through the chat thread.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Hi, I'm a backend engineer and I mostly work in Rust",
              "Then set Tone to playful and Detail to brief, and ask: what should I read next?",
            ]}
            expect="The scratch pad fills with observations about you as the agent learns them. After changing the preferences, the next reply visibly changes register and length — that is the write side working, not just the panel updating."
            fail="The panel updates but the agent's voice does not change — the before-model callback is not reading the state back."
          />
        </div>
      </Panel>

      <Panel title="ISSUES - LIST">
        <Callout tone="warn" title="Missing tools/imports">
          <p>
           <ul>
            <li>set_notes is missing - it was self defined</li>
            <li>_inject_preferences is also missing, it was self defined</li>
           </ul>
           
          </p>
        </Callout>
      </Panel>      

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/shared-state/demo-chat/page.tsx" />
      </Panel>

      <Panel title="The cards">
        <SourceCode file="frontend/src/app/shared-state/notes-card.tsx" />
      </Panel>

      <Panel
        title="The agent"
        description="A tool for the write side, a before-model callback for the read side."
      >
        <SourceCodeGroup
          files={[
            { file: "backend/src/agents/shared_state_read_write_agent.py", region: "set-notes" },
            { file: "backend/src/agents/shared_state_read_write_agent.py", region: "inject-preferences" },
            { file: "backend/src/agents/shared_state_read_write_agent.py", region: "agent" },
          ]}
        />
      </Panel>

      <Callout tone="warn" title="The doc shows the agent but not its parts">
        <p>
          The page prints the <code>LlmAgent(...)</code> literal — including{" "}
          <code>tools=[set_notes, AGUIToolset()]</code> and{" "}
          <code>before_model_callback=_inject_preferences</code> — and describes
          both in prose, but neither function body appears anywhere on it. Both
          are written here to the shape it describes. See README §9.
        </p>
      </Callout>

      <Panel title="Where the rest of this section goes">
        <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
          <li>
            <a href="/shared-state/rendering-in-app" className="text-[var(--accent)] underline underline-offset-4">
              Render state in your app
            </a>{" "}
            — the same state as a main-view canvas rather than a chat sidebar.
          </li>
          <li>
            <a href="/shared-state/streaming" className="text-[var(--accent)] underline underline-offset-4">
              State streaming
            </a>{" "}
            — updates arriving mid-tool instead of at checkpoints.
          </li>
          <li>
            <a href="/shared-state/agent-readonly" className="text-[var(--accent)] underline underline-offset-4">
              Agent read-only context
            </a>{" "}
            — when the agent should read a value but never write it.
          </li>
        </ul>
      </Panel>
    </>
  );
}
