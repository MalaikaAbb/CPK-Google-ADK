import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

const DIR = "frontend/src/app/generative-ui/hashbrown";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/hashbrown" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The page replaces the assistant message slot with a renderer that
          feeds the streaming reply to Hashbrown&apos;s partial-JSON parser
          and renders each finished node through a component catalog. Here,
          all the code the page leaves out has been written in, but its hook
          calls are kept exactly as published. So this route shows what
          happens when you follow the page as written.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Show me a sales dashboard.", "Break down sales by region."]}
            expect={
              <>
                <strong>An error is expected</strong> as soon as the first
                assistant message renders:{" "}
                <code>
                  TypeError: Cannot read properties of undefined (reading
                  &apos;forEach&apos;)
                </code>{" "}
                from <code>useUiKit</code>, which received no{" "}
                <code>components</code>. This fires on every reply, even
                before any JSON arrives.
              </>
            }
            fail={
              <>
                A reply renders with no error. That would mean the installed
                Hashbrown accepts the page&apos;s calls, and this route needs
                re-checking against the new version.
              </>
            }
          />
        </div>
      </Panel>

      <Panel title="Left as published — the hook calls">
        <Callout tone="warn" title="Not fixed on purpose">
          All three calls disagree with <code>@hashbrownai/react</code> 0.6.1:
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li>
              <code>useJsonParser(json, schema)</code> needs a schema. The page
              passes only the text.
            </li>
            <li>
              <code>useUiKit</code> takes{" "}
              <code>{"{ components: [exposeComponent(…)] }"}</code>, not{" "}
              <code>{"{ catalog, value }"}</code>.
            </li>
            <li>
              Its result is a kit object, rendered with{" "}
              <code>ui.render(value)</code>, not placed straight into JSX.
            </li>
          </ul>
          Each line has a <code>@ts-expect-error</code> so the build passes
          and the failure happens at runtime.
        </Callout>
        <div className="mt-4">
          <Callout tone="warn" title="Also from the page: the slot type">
            <code>messageView.assistantMessage</code> is typed as{" "}
            <code>typeof CopilotChatAssistantMessage</code> in CopilotKit
            1.74.0. The page&apos;s plain component doesn&apos;t satisfy it,
            so that line also carries a <code>@ts-expect-error</code>.
          </Callout>
        </div>
        <div className="mt-4">
          <SourceCodeGroup
            files={[
              { file: `${DIR}/byoc-hashbrown-demo.tsx` },
              { file: `${DIR}/hashbrown-renderer.tsx` },
            ]}
          />
        </div>
      </Panel>

      <Panel title="Written in — what the page leaves out">
        <p className="mb-4 text-sm text-slate-700 dark:text-slate-300">
          The <code>MetricCard</code>, <code>BarChart</code> and{" "}
          <code>PieChart</code> components (shared with JSON Render), the{" "}
          <code>AssistantMessage</code> import, the runtime route, and the
          agent and its prompt.
        </p>
        <SourceCodeGroup
          files={[
            { file: "frontend/src/components/byoc-dashboard.tsx" },
            { file: "frontend/src/app/api/copilotkit-byoc-hashbrown/[[...slug]]/route.ts" },
            { file: "backend/src/agents/chat_agents.py", region: "byoc-agents" },
          ]}
        />
      </Panel>

      <Panel title="Other things to know">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          As on JSON Render, <code>useConfigureSuggestions</code> is called
          outside the page&apos;s own <code>&lt;CopilotKit&gt;</code>, so its
          suggestions don&apos;t reach this chat.
        </p>
      </Panel>
    </>
  );
}
