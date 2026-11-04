"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  CopilotChat,
  type CopilotChatToolCallDisplay,
  type CopilotChatToolCallGroupProps,
  useDefaultRenderTool,
  useRenderTool,
} from "@copilotkit/react-core/v2";
import { z } from "zod";

import { DemoFrame } from "@/components/demo-frame";

import {
  CustomCatchallRenderer,
  WeatherCard,
  parseJsonResult,
} from "../weather-card";

const AGENT_ID = "tool-rendering";

const DISPLAYS: CopilotChatToolCallDisplay[] = [
  "grouped",
  "line",
  "stacked",
  "turn",
  "separate",
];

interface WeatherResult {
  city?: string;
  temperature?: number;
  humidity?: number;
  wind_speed?: number;
  conditions?: string;
}

export default function Page() {
  return (
    <DemoFrame
      parentPath="/generative-ui/tool-rendering"
      subtitle={`agent: ${AGENT_ID}`}
    >
      {/* `useSearchParams` needs a Suspense boundary to prerender. */}
      <Suspense>
        <Chat />
      </Suspense>
    </DemoFrame>
  );
}

function Chat() {
  // Which renderers are registered. Switching is a full page load (plain
  // `<a href>`), not state: `useRenderTool` registers in an effect with no
  // cleanup, so a renderer stays registered after its component unmounts.
  const builtin = useSearchParams().get("renderers") === "builtin";

  // Live props on the message view, so these switch without a reload.
  const [display, setDisplay] = useState<CopilotChatToolCallDisplay>("grouped");
  const [timeline, setTimeline] = useState(false);

  return (
    <div className="flex h-full flex-col">
      {builtin ? <BuiltInRenderer /> : <CustomRenderers />}

      <div className="flex shrink-0 flex-wrap items-center gap-4 border-b border-slate-200 px-4 py-1.5 text-xs text-slate-600 dark:border-slate-800 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          Renderers:
          <a
            href="?"
            className={!builtin ? "font-semibold text-slate-900 dark:text-slate-100" : "underline underline-offset-4"}
          >
            custom (named + catch-all)
          </a>
          ·
          <a
            href="?renderers=builtin"
            className={builtin ? "font-semibold text-slate-900 dark:text-slate-100" : "underline underline-offset-4"}
          >
            built-in card only
          </a>
        </span>
        <label className="flex items-center gap-1.5">
          toolCallDisplay
          <select
            value={display}
            onChange={(e) => setDisplay(e.target.value as CopilotChatToolCallDisplay)}
            className="rounded border border-slate-300 bg-transparent px-1 py-0.5 font-mono dark:border-slate-700"
          >
            {DISPLAYS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-1.5">
          <input
            type="checkbox"
            checked={timeline}
            onChange={(e) => setTimeline(e.target.checked)}
          />
          Replace the <code>group</code> slot with ToolTimeline
        </label>
      </div>

      <div className="min-h-0 flex-1">
        <CopilotChat
          agentId={AGENT_ID}
          className="h-full"
          messageView={{
            toolCallDisplay: display,
            ...(timeline && {
              assistantMessage: { toolCallsView: { group: ToolTimeline } },
            }),
          }}
        />
      </div>
    </div>
  );
}

/**
 * The doc's zero-config entry point: CopilotKit's built-in card as the `*`
 * renderer. Its calls group by default, so this is the mode where
 * `toolCallDisplay` visibly changes something.
 */
function BuiltInRenderer() {
  useDefaultRenderTool();
  return null;
}

function CustomRenderers() {
  // Named renderer: `name` must equal the tool name the agent exposes — that
  // string is how the runtime routes the call to this component. It does not
  // opt into grouping, so every weather card shows on its own whatever the
  // `toolCallDisplay`.
  useRenderTool(
    {
      name: "get_weather",
      parameters: z.object({
        location: z.string(),
      }),
      render: ({ parameters, result, status }) => {
        const loading = status !== "complete";
        const parsed = parseJsonResult<WeatherResult>(result);
        return (
          <WeatherCard
            loading={loading}
            location={parameters?.location ?? parsed.city ?? ""}
            temperature={parsed.temperature}
            humidity={parsed.humidity}
            windSpeed={parsed.wind_speed}
            conditions={parsed.conditions}
          />
        );
      },
    },
    [],
  );

  // Wildcard catch-all for anything a named renderer above did not claim.
  // `useDefaultRenderTool` is a convenience wrapper around
  // `useRenderTool({ name: "*", ... })`. `group: true` is the doc's opt-in that
  // lets a custom renderer's calls join a group like the built-in card's.
  useDefaultRenderTool(
    {
      render: ({ name, parameters, status, result }) => (
        <CustomCatchallRenderer
          name={name}
          parameters={parameters}
          status={status}
          result={result}
        />
      ),
      group: true,
    },
    [],
  );

  return null;
}

/**
 * The doc names `ToolTimeline` as "your component" for the `group` slot but
 * gives no code, so this one is the harness's own. It gets the group's
 * `calls` and draws each through `renderCall`, the registered renderer.
 */
function ToolTimeline({ calls, renderCall, isActive }: CopilotChatToolCallGroupProps) {
  return (
    <ol className="my-2 border-l-2 border-amber-400 pl-3">
      <li className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
        slot: group · {calls.length} call{calls.length === 1 ? "" : "s"}
        {isActive ? " · running" : ""}
      </li>
      {calls.map((call) => (
        <li key={call.toolCall.id} className="py-0.5">
          {renderCall(call)}
        </li>
      ))}
    </ol>
  );
}
