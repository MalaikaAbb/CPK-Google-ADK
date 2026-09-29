/**
 * The page's hashbrown-renderer.tsx, verbatim between the region markers.
 *
 * Harness-authored, above the region: the `AssistantMessage` import the page
 * leaves out. The components come from ./metric-card and ./charts.
 *
 * NOT fixed, on purpose: in @hashbrownai/react 0.6.1 `useJsonParser` needs a
 * schema, `useUiKit` takes `{ components }` built with `exposeComponent`, and
 * its result is rendered with `.render(value)`. The calls are left as
 * published so the route shows the error they throw.
 */
import type { AssistantMessage } from "@copilotkit/react-core/v2";

// #region renderer — verbatim
import { useJsonParser, useUiKit } from "@hashbrownai/react";
import { MetricCard } from "./metric-card";
import { PieChart, BarChart } from "./charts";

const catalog = {
  MetricCard,
  PieChart,
  BarChart,
};

export function HashBrownAssistantMessage({ message }: { message: AssistantMessage }) {
  // @ts-expect-error harness: doc API mismatch, not fixed — useJsonParser(json, schema) needs a schema
  const parsed = useJsonParser(message.content ?? "");
  // @ts-expect-error harness: doc API mismatch, not fixed — useUiKit takes { components }, not { catalog, value }
  const ui = useUiKit({ catalog, value: parsed });
  // @ts-expect-error harness: doc API mismatch, not fixed — useUiKit returns a kit object, rendered via ui.render(value)
  return <div className="space-y-3">{ui}</div>;
}
// #endregion
