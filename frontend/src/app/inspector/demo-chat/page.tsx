"use client";

import {
  CopilotChat,
  useAgentContext,
  useFrontendTool,
} from "@copilotkit/react-core/v2";
import { useState } from "react";
import { z } from "zod";

import { DemoFrame } from "@/components/demo-frame";

const AGENT_ID = "shared-state-read-write";

/**
 * A surface deliberately built to give the Inspector something in every tab.
 *
 * The Inspector itself is not mounted here — it comes from the app-wide
 * provider (`showDevConsole="auto"` in `components/providers.tsx`) and floats
 * above whatever route you are on. So this route's job is not to *render* it
 * but to give it data worth looking at:
 *
 *   AG-UI Events     any conversation
 *   Available Agents all 29, from the runtime handshake
 *   Agent State      shared-state-read-write owns `notes` + `preferences`
 *   Frontend Tools   `highlight_panel`, registered below
 *   Context          the two useAgentContext entries below
 *
 * Without the last two, those tabs are empty and the route would be a weaker
 * test than it looks.
 */
export default function Page() {
  return (
    <DemoFrame parentPath="/inspector" subtitle={`agent: ${AGENT_ID}`}>
      <Surface />
    </DemoFrame>
  );
}

function Surface() {
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const [panel] = useState("Revenue overview");

  // Populates the Inspector's Context tab.
  useAgentContext({
    description: "The panel the user is currently looking at",
    value: panel,
  });
  useAgentContext({
    description: "Which panel is highlighted right now, or none",
    value: highlighted ?? "none",
  });

  // Populates the Inspector's Frontend Tools tab — name, description and the
  // parameter schema all show up there before the agent ever calls it.
  useFrontendTool({
    name: "highlight_panel",
    description:
      "Highlight one of the panels on the page so the user can see which one you mean.",
    parameters: z.object({
      panel: z
        .enum(["revenue", "churn", "pipeline"])
        .describe("Which panel to highlight"),
    }),
    handler: async ({ panel }) => {
      setHighlighted(panel);
      return { status: "success", highlighted: panel };
    },
    agentId: AGENT_ID,
  });

  return (
    <div className="grid h-full grid-cols-1 lg:grid-cols-[1fr_24rem]">
      <main className="min-h-0 overflow-y-auto p-8">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Inspector
        </h1>
         
      </main>

      <div className="min-h-0 border-t border-slate-200 lg:border-l lg:border-t-0 dark:border-slate-800">
        <CopilotChat agentId={AGENT_ID} className="h-full" />
      </div>
    </div>
  );
}
