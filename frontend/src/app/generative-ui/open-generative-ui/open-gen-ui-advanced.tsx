"use client";

/**
 * "Register sandbox functions on the provider", as published, with three
 * harness changes:
 *
 * - `import { openGenUiSuggestions } from "./suggestions";` is removed. The
 *   page never publishes `./suggestions`, so the import cannot resolve, and
 *   the snippet never uses the value anyway.
 * - `Chat` is imported from `./chat`. The page renders it without defining it.
 * - The closing `);` and `}` are added. The published block stops after
 *   `</CopilotKit>` and runs straight into `sandbox-functions.ts`.
 *
 * `./sandbox-functions` is the page's file, verbatim.
 */

import { Chat } from "./chat";

// #region advanced — verbatim except the changes listed above
// src/app/demos/open-gen-ui-advanced/page.tsx
import React from "react";
import {
  CopilotKit,
  CopilotChat,
  useConfigureSuggestions,
} from "@copilotkit/react-core/v2";
import { openGenUiSandboxFunctions } from "./sandbox-functions";

export default function OpenGenUiAdvancedDemo() {
  return (
    // Pass the sandbox-function array on the `openGenerativeUI` provider prop.
    // The built-in `OpenGenerativeUIActivityRenderer` wires these as callable
    // remotes inside the agent-authored iframe.
    <CopilotKit
      runtimeUrl="/api/copilotkit-ogui"
      agent="open-gen-ui-advanced"
      openGenerativeUI={{ sandboxFunctions: openGenUiSandboxFunctions }}
    >
      <div className="flex justify-center items-center h-screen w-full">
        <div className="h-full w-full max-w-4xl">
          <Chat />
        </div>
      </div>
    </CopilotKit>
  );
}
// #endregion
