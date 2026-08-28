"use client";

import { CopilotKitProvider } from "@copilotkit/react-core/v2";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { rootInspectorSetting } from "@/lib/inspector";

/**
 * One provider for the whole app, so a conversation survives navigation
 * between test routes.
 *
 * Three routes mount a second, nested `<CopilotKit>` of their own rather than
 * using this one — Voice (different runtime, because transcription only exists
 * on the v2 runtime) and the two A2UI routes (each needs its own catalog, and
 * dynamic-schema needs the runtime that still injects the A2UI tool). Those
 * are the cases where the doc page is specifically about the provider, so an
 * isolated instance is the honest thing to show.
 *
 * On the inspector prop name, which is genuinely confusing: the doc page says
 * `enableInspector`, and that prop exists — but only on `<CopilotKit>`, the v1
 * compatibility wrapper. All it does there is forward to this provider's
 * `showDevConsole`. As of 1.69.3 `enableInspector` exists on
 * `CopilotKitProvider` too, so the two are no longer distinguishable that way;
 * `showDevConsole` is kept here because it takes `"auto"` (localhost only),
 * which the boolean cannot express. See README §9.
 *
 * `inspectorDefaultAnchor` used to sit alongside it, pinning the inspector
 * button bottom-left so it would not cover the prebuilt Popup and Sidebar
 * launchers. 1.69.3 removed the prop with no replacement — the provider now
 * exposes no positioning control at all — so on routes that mount those
 * launchers the inspector button overlaps them again.
 */

const RUNTIME_URL = "/api/copilotkit";

/**
 * The identity `identifyUser` reads on the runtime.
 *
 * Threads are per-user, so without these headers every visitor of a deployed
 * copy would share one history. A real app derives this from a verified
 * session; a local harness has none, so it sends a fixed demo identity you can
 * override with NEXT_PUBLIC_DEMO_USER_ID to watch two thread lists diverge.
 */
const DEMO_USER_ID = process.env.NEXT_PUBLIC_DEMO_USER_ID ?? "harness-local";
const DEMO_USER_NAME = process.env.NEXT_PUBLIC_DEMO_USER_NAME ?? "Harness User";

/**
 * The client-side half of the license axis, and what the Threads Drawer doc's
 * own sample passes. The server-side half is `licenseToken` on the runtime.
 *
 * Either one unlocks the drawer's real UI; with neither, `<CopilotThreadsDrawer>`
 * renders its locked "Upgrade" view even when the runtime is in Intelligence
 * mode and threads work perfectly — it gates on the reported license status,
 * not on whether thread endpoints respond.
 *
 * Genuinely public, hence the NEXT_PUBLIC_ prefix — unlike
 * INTELLIGENCE_API_KEY, which is a server secret and must never be prefixed.
 */
const PUBLIC_LICENSE_KEY =
  process.env.NEXT_PUBLIC_COPILOTKIT_PUBLIC_LICENSE_KEY;

export function Providers({ children }: { children: ReactNode }) {
  // The inspector can only watch the core it is attached to, and two of them
  // on one page is fatal — so on routes that bring their own provider, this
  // one yields. `lib/inspector.ts` owns that decision.
  const pathname = usePathname();

  return (
    <CopilotKitProvider
      runtimeUrl={RUNTIME_URL}
      headers={{
        "x-user-id": DEMO_USER_ID,
        "x-user-name": DEMO_USER_NAME,
      }}
      // Spread rather than passed as `publicLicenseKey={undefined}`: an
      // explicit undefined is still a supplied prop, and the provider treats a
      // present-but-empty key differently from an absent one.
      {...(PUBLIC_LICENSE_KEY ? { publicLicenseKey: PUBLIC_LICENSE_KEY } : {})}
      showDevConsole={rootInspectorSetting(pathname)}
      onError={(event) => {
        console.error(`[CopilotKit ${event.code}]`, event.error);
      }}
    >
      {children}
    </CopilotKitProvider>
  );
}
