"use client";

import { Suspense, useEffect, useState, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import { CopilotChat } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

import { OrderSearch } from "../order-search";

const AGENT_ID = "agentic_chat";

/**
 * Both WebMCP paths from the page, one at a time.
 *
 * - React (default): the page's `OrderSearch` inside the app's existing
 *   `CopilotKitProvider`, next to a chat on this repo's generic
 *   `agentic_chat` agent, so the same tool is callable by the CopilotKit agent
 *   and by a WebMCP browser agent.
 * - Core only (`?mode=core`): the page's `webmcp.ts`, a bare `CopilotKitCore`
 *   with no Runtime or agent. It is loaded on demand, because a module-level
 *   core stays alive once imported.
 *
 * Switching is a full page load (plain `<a href>`): a core cannot be
 * unregistered, and both paths register the same `searchOrders` name.
 * Harness-authored: this page, the mode switch and the status line.
 */
export default function Page() {
  return (
    <DemoFrame parentPath="/webmcp" subtitle={`agent: ${AGENT_ID}`}>
      <Suspense>
        <WebMcpDemo />
      </Suspense>
    </DemoFrame>
  );
}

function WebMcpDemo() {
  const core = useSearchParams().get("mode") === "core";
  // `null` while server-rendering; `document` only exists in the browser.
  const hasModelContext = useSyncExternalStore(
    () => () => {},
    () => "modelContext" in document,
    () => null,
  );
  const [coreLoaded, setCoreLoaded] = useState(false);

  useEffect(() => {
    if (core) void import("../webmcp").then(() => setCoreLoaded(true));
  }, [core]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 flex-wrap items-center gap-3 border-b border-slate-200 px-4 py-2 text-xs text-slate-600 dark:border-slate-800 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          Path:
          <a href="?" className={!core ? "font-semibold text-slate-900 dark:text-slate-100" : "underline underline-offset-4"}>
            React useFrontendTool
          </a>
          ·
          <a href="?mode=core" className={core ? "font-semibold text-slate-900 dark:text-slate-100" : "underline underline-offset-4"}>
            CopilotKitCore only
          </a>
        </span>
        <span className="ml-auto font-mono">
          document.modelContext:{" "}
          {hasModelContext === null ? "…" : hasModelContext ? "present" : "absent (WebMCP calls are a no-op)"}
          {core && ` · core ${coreLoaded ? "loaded" : "loading…"}`}
        </span>
      </div>
      <div className="min-h-0 flex-1">
        {core ? (
          <div className="p-6 text-sm text-slate-600 dark:text-slate-400">
            Only the core is registered here. No chat: this path has no agent.
            Call <code>searchOrders</code> from Chrome&apos;s Model Context Tool
            Inspector.
          </div>
        ) : (
          <>
            <OrderSearch />
            <CopilotChat agentId={AGENT_ID} className="h-full" />
          </>
        )}
      </div>
    </div>
  );
}
