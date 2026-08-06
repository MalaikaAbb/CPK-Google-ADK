import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/custom-look-and-feel/reasoning-messages" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Reasoning is not a renderer you plug in — it is a first-class message
          type. When a <code>REASONING_MESSAGE_*</code> event arrives, the chat
          renders a collapsible card: pulsing &quot;Thinking…&quot; while the
          model works, auto-expanded so you can follow along, then collapsed to
          &quot;Thought for X seconds&quot; with a chevron to reopen. No
          configuration required.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The demo toggles between that default and a version with two sub-slots
          replaced, so the difference is visible on the same conversation.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "If a train leaves at 14:20 travelling 80 km/h and another leaves at 15:05 travelling 110 km/h from 60 km behind, when does the second catch the first?",
              "Which is heavier: 1kg of steel or 1.2kg of feathers? Work through it.",
            ]}
            expect="A reasoning card appears above the answer and streams. In 'sub-slots' mode the header shows 🧠/💡 with Show/Hide, and the reasoning text is mono with a blinking cursor."
            fail="No card at all — Gemini did not return thought parts for that prompt. Try a question that needs genuine multi-step working."
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/custom-look-and-feel/reasoning-messages/demo-chat/page.tsx" />
      </Panel>

      <Panel title="The agent that makes it possible">
        <SourceCodeGroup
          files={[
            { file: "backend/src/agents/shared_chat.py", region: "builders" },
            { file: "backend/src/agents/chat_agents.py", region: "reasoning-agents" },
          ]}
        />
      </Panel>

      <Panel title="The three sub-slots">
        <dl className="space-y-2 text-sm">
          {[
            ["header", "The clickable bar — icon, label, chevron. Gets isOpen, label, hasContent, isStreaming, onClick."],
            ["contentView", "The reasoning text area. Gets isStreaming, hasContent, and the raw text as children."],
            ["toggle", "The expand/collapse animation wrapper."],
          ].map(([name, desc]) => (
            <div key={name} className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
              <dt className="shrink-0 font-mono text-xs text-slate-900 sm:w-32 dark:text-slate-100">
                {name}
              </dt>
              <dd className="text-slate-600 dark:text-slate-400">{desc}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
          Passing a whole component to <code>reasoningMessage</code> instead of
          a sub-slot object replaces the card outright — that variant is on the{" "}
          <a
            href="/generative-ui/reasoning"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            Generative UI › Reasoning
          </a>{" "}
          route. There is also a render-prop form, where{" "}
          <code>&lt;CopilotChatReasoningMessage&gt;</code> hands you its
          pre-rendered <code>header</code>, <code>contentView</code> and{" "}
          <code>toggle</code> to rearrange without reimplementing.
        </p>
      </Panel>
    </>
  );
}
