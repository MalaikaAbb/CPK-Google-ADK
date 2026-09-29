/**
 * The page's json-render-renderer.tsx, verbatim between the region markers.
 *
 * Harness-authored, above the region: the two imports the page leaves out
 * (`AssistantMessage`, and the three helpers `parseSpec` calls). The helpers
 * themselves are in ./spec-helpers.ts.
 *
 * NOT fixed, on purpose: `<Renderer spec catalog>`. @json-render/react 0.21
 * takes `registry`, not `catalog`, and needs its providers around it. The
 * call is left as published so the route shows the error it throws.
 */
import type { AssistantMessage } from "@copilotkit/react-core/v2";

import {
  stripCodeFencesAndPrelude,
  tolerantJsonParse,
  validateAgainstCatalog,
} from "./spec-helpers";

// #region renderer — verbatim
import { Renderer } from "@json-render/react";
import { catalog } from "./registry";

export function JsonRenderAssistantMessage({ message }: { message: AssistantMessage }) {
  const spec = parseSpec(message.content ?? "");
  if (!spec) return null;
  // @ts-expect-error harness: doc API mismatch, not fixed — @json-render/react 0.21 takes `registry`, not `catalog`
  return <Renderer spec={spec} catalog={catalog} />;
}

function parseSpec(content: string) {
  const cleaned = stripCodeFencesAndPrelude(content);
  const partial = tolerantJsonParse(cleaned);
  return validateAgainstCatalog(partial);
}
// #endregion
