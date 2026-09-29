"use client";

import { CopilotSidebar } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

/**
 * The Quickstart's `app/page.tsx`, which is a heading and a `<CopilotSidebar />`.
 *
 * The doc names the agent once, on the provider (`agent="my_agent"`), so the
 * sidebar here is bare too. That works because this route renders the doc's
 * own `providers.tsx` via `layout.tsx` rather than the app-wide provider.
 * `defaultOpen` is the one harness addition, so the chat is visible on load.
 */
export default function Page() {
  return (
    <DemoFrame parentPath="/quickstart" subtitle="agent: my_agent">
      <main className="h-full overflow-y-auto p-10">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Your App
        </h1>
        <p className="mt-3 max-w-prose text-sm text-slate-600 dark:text-slate-400">
          The sidebar on the right is talking to an ADK <code>LlmAgent</code>{" "}
          running in the Python server on port 8000. Ask it anything.
        </p>
        <CopilotSidebar defaultOpen />
      </main>
    </DemoFrame>
  );
}
