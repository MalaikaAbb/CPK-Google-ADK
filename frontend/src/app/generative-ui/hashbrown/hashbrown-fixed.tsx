/**
 * Harness-authored: a working version of the page, for comparison with the
 * published one (./byoc-hashbrown-demo.tsx + ./hashbrown-renderer.tsx, which
 * are left as published and throw).
 *
 * What changes, and why:
 *
 * 1. Components are exposed with `exposeComponent(component, { name,
 *    description, props })`, and `useUiKit` gets `{ components }`. The page
 *    passes a bare `{ MetricCard, PieChart, BarChart }` map as `catalog`, which
 *    0.6.1 does not accept. Props are described with Hashbrown's own `s.*`
 *    builders.
 * 2. `Stack` is exposed too, with `children: "any"`. The page's own example
 *    output uses it, and Hashbrown throws `Unknown element type` for any name
 *    it has not been given.
 * 3. `useJsonParser(content, kit.schema)`. The page passes no schema; the kit's
 *    own schema is the one the reply must match.
 * 4. `kit.render(value)` instead of placing the kit object in JSX, guarded for
 *    the moments mid-stream when there is no `ui` yet, and wrapped so a reply
 *    that fails the kit's final validation shows a note instead of crashing.
 * 5. Prose and code fences are stripped before parsing, with the helper the
 *    JSON Render route already uses. Hashbrown's parser expects JSON from the
 *    first character. A reply with no JSON at all falls back to CopilotKit's
 *    default assistant message.
 * 6. Replaces the whole `assistantMessage` slot, as the page does, with no
 *    markdown renderer involved. The component therefore receives the message
 *    props (`message`, `messages`, `isRunning`, …), not `content`, and reads
 *    `props.message.content`. CopilotKit 1.74 and 1.75 type this slot as
 *    `typeof CopilotChatAssistantMessage`, so passing it needs an
 *    `as unknown as` cast — the same thing the page's plain component trips
 *    over. A dashboard reply loses the message toolbar (copy, thumbs,
 *    regenerate), since the default message is not rendered for it.
 * 7. `useConfigureSuggestions` inside `<CopilotKit>`, so its suggestions reach
 *    this chat.
 *
 * The agent must also reply in Hashbrown's shape, `{ "ui": [ { "MetricCard":
 * { "props": { … } } } ] }`, not the `{ "type": …, … }` shape the page shows.
 * That is the backend half — see `#region byoc-agents` in
 * `backend/src/agents/chat_agents.py`.
 */

import {
  CopilotChat,
  CopilotChatAssistantMessage,
  CopilotKit,
  useConfigureSuggestions,
} from "@copilotkit/react-core/v2";
import { s } from "@hashbrownai/core";
import { exposeComponent, useJsonParser, useUiKit } from "@hashbrownai/react";
import type { ComponentProps, ReactNode } from "react";

import { stripCodeFencesAndPrelude } from "../json-render/spec-helpers";
import { BarChart, PieChart } from "./charts";
import { MetricCard } from "./metric-card";

// Hashbrown can express "number or null" but not "number or absent", so an
// omitted delta arrives as null. MetricCard treats anything but undefined as a
// value, so null is mapped back to undefined here.
function HashbrownMetricCard({
  delta,
  ...props
}: {
  title: string;
  value: number;
  delta: number | null;
}) {
  return <MetricCard {...props} delta={delta ?? undefined} />;
}

function Stack({ children }: { children?: ReactNode }) {
  return <div className="space-y-3">{children}</div>;
}

const dataSchema = s.array(
  "Data points",
  s.object("A data point", {
    label: s.string("Category label"),
    value: s.number("Numeric value"),
  }),
);

// Fixes 1 and 2 — module-level, so useUiKit gets the same array every render
// and does not rebuild the kit.
const COMPONENTS = [
  exposeComponent(Stack, {
    name: "Stack",
    description: "Lays out its children vertically.",
    children: "any",
  }),
  exposeComponent(HashbrownMetricCard, {
    name: "MetricCard",
    description: "A single headline number, with an optional change ratio.",
    props: {
      title: s.string("What the number measures"),
      value: s.number("The number"),
      delta: s.anyOf([
        s.number("Change as a ratio, e.g. 0.07 for +7%"),
        s.nullish(),
      ]),
    },
  }),
  exposeComponent(BarChart, {
    name: "BarChart",
    description: "Horizontal bars comparing values across categories.",
    props: { data: dataSchema },
  }),
  exposeComponent(PieChart, {
    name: "PieChart",
    description: "A pie showing each category's share of the total.",
    props: { data: dataSchema },
  }),
];

// Fixes 3–6 — the whole assistant message, parsed against the kit's schema.
function HashbrownAssistantMessage(
  props: ComponentProps<typeof CopilotChatAssistantMessage>,
) {
  const kit = useUiKit({ components: COMPONENTS });
  const cleaned = stripCodeFencesAndPrelude(props.message.content ?? "");
  const { value } = useJsonParser(cleaned, kit.schema);

  // No JSON (plain prose, or nothing streamed yet): the default message.
  if (!cleaned) return <CopilotChatAssistantMessage {...props} />;
  if (!value?.ui) return null;

  let nodes: ReactNode;
  try {
    nodes = kit.render(value);
  } catch (error) {
    return (
      <p className="text-sm text-rose-600">
        The reply did not match the UI kit:{" "}
        {error instanceof Error ? error.message : String(error)}
      </p>
    );
  }
  return <div className="space-y-3">{nodes}</div>;
}

// Fix 7 — suggestions registered on the provider the chat actually uses.
function Chat() {
  useConfigureSuggestions({
    suggestions: [
      { title: "Sales overview", message: "Show me a sales dashboard." },
      { title: "Region split", message: "Break down sales by region." },
    ],
    available: "always",
  });

  return (
    <CopilotChat
      className="h-full"
      messageView={{
        assistantMessage:
          HashbrownAssistantMessage as unknown as typeof CopilotChatAssistantMessage,
      }}
    />
  );
}

export default function ByocHashbrownFixedDemo() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit-byoc-hashbrown" agent="byoc_hashbrown">
      <Chat />
    </CopilotKit>
  );
}
