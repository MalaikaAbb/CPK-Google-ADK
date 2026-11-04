/**
 * Harness-authored: the working version of the page. The doc's code as
 * published throws against @json-render/react 0.21, so only this version is
 * kept on the route.
 *
 * Four changes, each fixing one thing the published code gets wrong:
 *
 * 1. `registry`, not `catalog`. @json-render/react 0.21 renders through a map
 *    of type name → component receiving `{ element, children }`. It is built
 *    here from the page's own catalog, so the components and Zod schemas are
 *    still the page's. `Stack`, which the page's example output uses but its
 *    catalog omits, is added as a plain container.
 * 2. `<JSONUIProvider>` around `<Renderer>`. The renderer reads visibility,
 *    action and state contexts, and throws without them.
 * 3. Replaces the whole `assistantMessage`, as the page does, but reads
 *    `props.message.content` and falls back to the default message when the
 *    reply is not a spec. The slot is typed `typeof
 *    CopilotChatAssistantMessage`, so it is passed with an `as unknown as`
 *    cast (Option B in JSON_RENDERER_FIX.md; the commented-out
 *    `markdownRenderer` variant below is Option A).
 * 4. `useConfigureSuggestions` inside `<CopilotKit>`. The page calls it
 *    outside, so its suggestions go to a different provider.
 *
 * Parsing and validation reuse ./spec-helpers.ts unchanged.
 */

import {
  CopilotChat,
  CopilotKit,
  useConfigureSuggestions,
} from "@copilotkit/react-core/v2";
import {
  JSONUIProvider,
  Renderer,
  type ComponentRegistry,
} from "@json-render/react";
import type { ComponentType } from "react";
import { CopilotChatAssistantMessage } from "@copilotkit/react-core/v2";
import type { ComponentProps } from "react";
import { catalog } from "./registry";
import {
  stripCodeFencesAndPrelude,
  tolerantJsonParse,
  validateAgainstCatalog,
} from "./spec-helpers";

// Fix 1 — a registry built from the page's catalog.
const registry: ComponentRegistry = {
  ...Object.fromEntries(
    Object.entries(catalog).map(([type, entry]) => {
      // Props were already checked against entry.propsSchema by
      // validateAgainstCatalog, so they can be passed through as-is.
      const Component = entry.component as unknown as ComponentType<
        Record<string, unknown>
      >;
      const Rendered: ComponentRegistry[string] = ({ element }) => (
        <Component {...element.props} />
      );
      Rendered.displayName = `JsonRender(${type})`;
      return [type, Rendered];
    }),
  ),
  Stack: ({ children }) => <div className="space-y-3">{children}</div>,
};

// // Fixes 2 and 3 — a markdownRenderer that draws the spec inside the providers.
// function JsonRenderMarkdown({ content }: { content: string }) {
//   const spec = validateAgainstCatalog(
//     tolerantJsonParse(stripCodeFencesAndPrelude(content)),
//   );
//   if (!spec) return null;
//   return (
//     <JSONUIProvider registry={registry}>
//       <Renderer spec={spec} registry={registry} />
//     </JSONUIProvider>
//   );
// }


function JsonRenderAssistantMessage(
  props: ComponentProps<typeof CopilotChatAssistantMessage>,
) {
  const spec = validateAgainstCatalog(
    tolerantJsonParse(stripCodeFencesAndPrelude(props.message.content ?? "")),
  );
  // Not a spec (plain prose, or nothing parseable yet): show the normal message.
  if (!spec) return <CopilotChatAssistantMessage {...props} />;
  return (
    <JSONUIProvider registry={registry}>
      <Renderer spec={spec} registry={registry} />
    </JSONUIProvider>
  );
}


function Chat() {
  useConfigureSuggestions({
    suggestions: [
      { title: "Sales dashboard", message: "Show me a sales dashboard." },
      { title: "Region breakdown", message: "Break down sales by region." },
    ],
    available: "always",
  });

  return (
    <CopilotChat
      className="h-full"
      //messageView={{ assistantMessage: { markdownRenderer: JsonRenderMarkdown } }}
      messageView={{
        assistantMessage:
          JsonRenderAssistantMessage as unknown as typeof CopilotChatAssistantMessage,
      }}
    />
  );
}

export default function ByocJsonRenderFixedDemo() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit-byoc-json-render" agent="byoc_json_render">
      <Chat />
    </CopilotKit>
  );
}
