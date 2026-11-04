// The "Combine catalogs" snippet of
// https://docs.copilotkit.ai/google-adk/generative-ui/components/catalogs
// verbatim inside `#region combine`.
//
// Harness-authored, outside the region: the `z`, `cartUI` and `Hero` imports
// the snippet relies on. `cartUI` and `Hero` are never shown on the page.
import { z } from "zod";

import { cartUI } from "./cart-ui";
import { Hero } from "./hero";

//#region combine
import { createGenerativeUI, standardUI } from "@copilotkit/react-core/v2/generative-ui";

export const appUI = createGenerativeUI({
  id: "acme/app@1",
  extends: [standardUI, cartUI],
  components: { Hero: { component: Hero, props: z.object({ title: z.string() }) } },
});
//#endregion
