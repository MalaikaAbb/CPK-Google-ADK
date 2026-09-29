"use client";

import { CopilotChat } from "@copilotkit/react-core/v2";

/**
 * Harness-authored. Both doc snippets render `<Chat />` and neither page
 * defines it. The minimal snippet's own comment says a plain
 * `<CopilotChat />` is enough, so that is all this is; the agent comes from
 * the surrounding `<CopilotKit agent=…>`.
 */
export function Chat() {
  return <CopilotChat />;
}
