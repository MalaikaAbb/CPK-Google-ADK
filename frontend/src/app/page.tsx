import Link from "next/link";

import { KeyValue, Panel } from "@/components/ui";
import { DOCS_ROOT } from "@/lib/nav-config";

export default function Page() {
  return (
    <>
      <header className="border-b border-slate-200 pb-5 dark:border-slate-800">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          CopilotKit + Google ADK
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-400">
          A test harness for the Google ADK integration. Every doc page under{" "}
          <a
            href={DOCS_ROOT}
            target="_blank"
            rel="noreferrer"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            docs.copilotkit.ai/google-adk
          </a>{" "}
          that this repo tracks is a route here, and each route runs the thing
          its page teaches rather than describing it.
        </p>
      </header>

     <Panel title="What this is">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Every page in the Agno section of the CopilotKit docs has a route here,
          and each route runs the functionality that page describes against a real Agno
          agent.
        </p>
        <div className="mt-4">
          <KeyValue
            rows={[
              [
                "Docs tracked",
                <a
                  key="d"
                  href={DOCS_ROOT}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--accent)] underline underline-offset-4"
                >
                  {DOCS_ROOT}
                </a>,
              ]
            ]}
          />
        </div>
      </Panel>

      <Panel title="How a message travels">
        <ol className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <li>
            <strong>1.</strong> A chat component posts to{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-800">
              /api/copilotkit
            </code>{" "}
            in this Next app.
          </li>
          <li>
            <strong>2.</strong> The Copilot Runtime resolves the agent id and
            forwards the run to the Agno service over AG-UI.
          </li>
          <li>
            <strong>3.</strong> Agno executes the agent, calling OpenAI and any
            server-side tools.
          </li>
          <li>
            <strong>4.</strong> AG-UI events stream back as SSE. Browser-executed
            tools run here, and their results go back so the run can continue.
          </li>
        </ol>
      </Panel>

      <Panel title="Start here">
        <div className="space-y-3">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Sidebar dot colours mirror status: green working, amber partial, grey
            reference. The{" "}
            <Link
              href="/status"
              className="text-[var(--accent)] underline underline-offset-4"
            >
              status overview
            </Link>{" "}
            lists every route in one table.
          </p>
        </div>
      </Panel>
    </>
  );
}
