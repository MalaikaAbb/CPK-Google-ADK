"use client";

import { CopilotChat } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

/**
 * The page's "Tool-call approval with `useHumanInTheLoop`" pattern.
 *
 * Every region below is copied from the doc as published: the `GovernedAction`
 * envelope, the `GovernedActionTool` hook component, and the
 * `GovernedActionCard` from the `useInterrupt` block (the HITL block renders
 * it but does not define it). They share a file so none of them needs an
 * `export` the page does not have.
 *
 * The `useInterrupt` half itself is not mounted — ag-ui-adk never emits an
 * AG-UI interrupt, so it could not fire. The route page shows it as text.
 *
 * Harness-authored: only `Page` at the bottom.
 */

// #region envelope — verbatim from "Action envelope"
type GovernedAction = {
  id: string;
  summary: string;
  tool: string;
  reference: string;
  verdict: "allow" | "deny" | "require_approval";
  arguments: Record<string, unknown>;
};
// #endregion

// #region hitl — verbatim from "Tool-call approval with useHumanInTheLoop"
import { ToolCallStatus, useHumanInTheLoop } from "@copilotkit/react-core/v2";
import { z } from "zod";

const governedActionSchema = z.object({
  id: z.string(),
  summary: z.string(),
  tool: z.string(),
  reference: z.string(),
  verdict: z.enum(["allow", "deny", "require_approval"]),
  arguments: z.record(z.unknown()),
});

function GovernedActionTool() {
  useHumanInTheLoop(
    {
      name: "approve_governed_action",
      description:
        "Ask the user to approve a governed side-effect action before it runs.",
      parameters: governedActionSchema,
      render: ({ args, status, respond }) => {
        if (status !== ToolCallStatus.Executing || !respond) {
          return null;
        }

        return (
          <GovernedActionCard
            action={args}
            onApprove={() =>
              respond({
                approved: true,
                actionId: args.id,
                reference: args.reference,
              })
            }
            onReject={() =>
              respond({
                approved: false,
                actionId: args.id,
                reference: args.reference,
              })
            }
            onBlock={() =>
              respond({
                approved: false,
                actionId: args.id,
                reference: args.reference,
              })
            }
          />
        );
      },
    },
    [],
  );

  return null;
}
// #endregion

// #region card — verbatim from "Inline approval with useInterrupt"
import { useEffect } from "react";

function GovernedActionCard({
  action,
  onApprove,
  onReject,
  onBlock,
}: {
  action: GovernedAction;
  onApprove: () => void;
  onReject: () => void;
  onBlock: () => void;
}) {
  useEffect(() => {
    if (action.verdict === "allow") onApprove();
    if (action.verdict === "deny") onBlock();
  }, [action.id, action.verdict]);

  const status =
    action.verdict === "allow"
      ? "Allowed by policy"
      : action.verdict === "deny"
        ? "Blocked by policy"
        : "User approval required";

  return (
    <section className="rounded-lg border p-4 shadow-sm">
      <div className="space-y-1">
        <p className="text-sm font-medium">{status}</p>
        <h3 className="text-base font-semibold">{action.summary}</h3>
        <p className="text-sm text-muted-foreground">Tool: {action.tool}</p>
        <p className="text-sm text-muted-foreground">
          Reference: {action.reference}
        </p>
      </div>

      <pre className="mt-3 overflow-auto rounded bg-muted p-3 text-xs">
        {JSON.stringify(action.arguments, null, 2)}
      </pre>

      {action.verdict === "require_approval" && (
        <div className="mt-4 flex gap-2">
          <button type="button" onClick={onApprove}>
            Approve and run
          </button>
          <button type="button" onClick={onReject}>
            Reject
          </button>
        </div>
      )}
    </section>
  );
}
// #endregion

const AGENT_ID = "governed-actions";

export default function Page() {
  return (
    <DemoFrame
      parentPath="/human-in-the-loop/governed-actions"
      subtitle={`agent: ${AGENT_ID}`}
    >
      <GovernedActionTool />
      <CopilotChat agentId={AGENT_ID} className="h-full" />
    </DemoFrame>
  );
}
