import { Callout } from "@/components/ui";

/**
 * Shown on every Components route that uses the tool transport. With Google
 * ADK + Gemini, `render_ui` cannot work as published. See README §9 #29.
 */
export function RenderUiGeminiIssue({ markdownWorks = false }: { markdownWorks?: boolean }) {
  return (
    <Callout tone="warn" title="Broken on Google ADK: render_ui arguments come back malformed">
      <p>
        The runtime&apos;s <code>render_ui</code> tool declares{" "}
        <code>operations</code> as an array of objects with no properties.{" "}
        <code>ag_ui_adk</code> passes client tools to Gemini through its
        generic schema conversion, and Gemini&apos;s function calling can&apos;t
        fill property-less nested objects. <code>ag_ui_adk</code>&apos;s own
        A2UI tool documents the same limit and works around it by declaring
        its payload as a JSON string. No doc publishes a fix for{" "}
        <code>render_ui</code>, and none is applied here.
      </p>
      <p className="mt-2">
        <strong>What actually happens:</strong> the agent calls{" "}
        <code>search_products</code>, then <code>render_ui</code> with malformed
        operations (<code>&quot;dataModel&quot;: null</code>, component ids as
        bare strings, <code>&quot;components&quot;: [true, …]</code>). The
        runtime rejects them (<code>createSurface.dataModel must be a JSON
        object</code>, <code>updateComponents.surfaceId is required</code>) and
        nothing renders.
        {markdownWorks
          ? " The markdown mode is unaffected: the agent writes the UI as reply text, with no tool call."
          : " The Markdown Mode route is unaffected: the agent writes the UI as reply text, with no tool call."}
      </p>
    </Callout>
  );
}
