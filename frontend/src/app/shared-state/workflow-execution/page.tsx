import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/shared-state/workflow-execution" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Organising state by purpose rather than dumping everything into one
          bag. Three slots, three different roles:
        </p>
        <ul className="mt-3 space-y-1 text-sm text-slate-700 dark:text-slate-300">
          <li>
            <code>question</code> — input, written by the UI
          </li>
          <li>
            <code>answer</code> — output, written by the agent and read by the
            UI
          </li>
          <li>
            <code>resources</code> — internal working notes the agent keeps for
            itself
          </li>
        </ul>
        <div className="mt-4">
          <TryIt
            prompts={[
              "What's the capital of France?",
              "Why is the sky blue?",
            ]}
            expect="The question card fills immediately, then the answer card fills once the agent calls answer_question. The resources card stays as placeholder text throughout."
            fail="The answer card stays empty while the agent clearly replied — it answered in prose instead of calling answer_question."
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/shared-state/workflow-execution/demo-chat/page.tsx" />
      </Panel>

      <Panel title="The agent">
        <SourceCode file="backend/src/agents/workflow_execution_agent.py" region="agent" />
      </Panel>
     
    </>
  );
}
