import type { ReactNode } from "react";

import { Providers } from "./providers";

/**
 * The page's `app/layout.tsx`, scoped to this demo route. The
 * `<html>`/`<body>` shell already lives in the harness's root layout and a
 * nested layout cannot re-declare it, so only the `Providers` wrap is kept.
 * The root provider stands down here via `NESTED_PROVIDER_ROUTES` in
 * `lib/inspector.ts`, so only this provider's inspector mounts.
 */
export default function ComponentsLayout({ children }: { children: ReactNode }) {
  return <Providers>{children}</Providers>;
}
