"use client";

import { CopilotKit } from "@copilotkit/react-core/v2";

import { Chat } from "./chat";

/**
 * "Drop <CopilotChat /> into the page". The published block starts mid-function
 * at `return (`, so the function wrapper and imports are harness-authored.
 *
 * One line removed from the published code:
 *   openGenerativeUI={{ designSkill: VISUALIZATION_DESIGN_SKILL }}
 * `VISUALIZATION_DESIGN_SKILL` is never defined or imported on the page, so
 * the default shadcn design skill applies instead.
 */
export default function OpenGenUiDemo() {
  // #region minimal — verbatim except the line noted above
  // src/app/demos/open-gen-ui/page.tsx
  // Minimal Open Generative UI frontend: the built-in activity renderer is
  // registered by CopilotKitProvider, so a plain <CopilotChat /> is enough —
  // no custom tool renderers, no activity-renderer registration.
  // We DO pass `openGenerativeUI.designSkill` to swap in visualisation-tuned
  // guidance in place of the default shadcn design skill.
  return (
    <CopilotKit
      runtimeUrl="/api/copilotkit-ogui"
      agent="open-gen-ui"
    >
      <div className="flex justify-center items-center h-screen w-full">
        <div className="h-full w-full max-w-4xl flex flex-col p-3">
          <Chat />
        </div>
      </div>
    </CopilotKit>
  );
  // #endregion
}
