"use client";

import { useState } from "react";
import { CopilotChat, CopilotKitProvider } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";
import { nestedInspectorSetting } from "@/lib/inspector";

import { useCart } from "../cart";
import { CartActions, shopUI as functionsUI } from "../catalog-functions";
import { CartState, shopUI as stateUI } from "../catalog-state";
import { shopUI as extrasUI } from "../catalog-extras";

type Mode = "state" | "functions" | "extras";

const LABELS: Record<Mode, string> = {
  state: "App state (bind)",
  functions: "Functions (events)",
  extras: "Writable + click to agent",
};

/**
 * One provider per catalog, because the page declares `shopUI` more than once
 * and a provider takes one UI. The cart lives above the providers, so items
 * added in "Functions" show as `inCart` in "App state". `runtimeUrl` is this
 * repo's components runtime; switching remounts the provider and starts a
 * fresh conversation.
 */
export default function Page() {
  const [mode, setMode] = useState<Mode>("functions");
  const cart = useCart();

  return (
    <DemoFrame parentPath="/generative-ui/components/state-and-actions" subtitle="agent: genui">
      <div className="flex h-full flex-col">
        <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-slate-200 px-4 py-2 dark:border-slate-800">
          {(Object.keys(LABELS) as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-md px-3 py-1 text-xs font-medium ${
                mode === m
                  ? "bg-[var(--accent)] text-white"
                  : "border border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-300"
              }`}
            >
              {LABELS[m]}
            </button>
          ))}
          <span className="ml-auto font-mono text-xs text-slate-500">
            cart: {cart.items.length === 0
              ? "empty"
              : cart.items.map((i) => `${i.productId}×${i.quantity}`).join(", ")}
          </span>
        </div>
        <div className="min-h-0 flex-1">
          {mode === "state" && (
            <CopilotKitProvider key="state" runtimeUrl="/api/copilotkit-genui" enableInspector={nestedInspectorSetting} generativeUI={{ ui: stateUI }}>
              <CartState cart={cart} />
              <CopilotChat className="h-full" />
            </CopilotKitProvider>
          )}
          {mode === "functions" && (
            <CopilotKitProvider key="functions" runtimeUrl="/api/copilotkit-genui" enableInspector={nestedInspectorSetting} generativeUI={{ ui: functionsUI }}>
              <CartActions cart={cart} />
              <CopilotChat className="h-full" />
            </CopilotKitProvider>
          )}
          {mode === "extras" && (
            <CopilotKitProvider key="extras" runtimeUrl="/api/copilotkit-genui" enableInspector={nestedInspectorSetting} generativeUI={{ ui: extrasUI }}>
              <CopilotChat className="h-full" />
            </CopilotKitProvider>
          )}
        </div>
      </div>
    </DemoFrame>
  );
}
