// The "After" catalog of
// https://docs.copilotkit.ai/google-adk/generative-ui/components/from-a2ui
// verbatim inside `#region after`. Harness-authored outside it: the `z`,
// `Airport` and `Arrow` imports, which the snippet relies on but never shows.
import { z } from "zod";

import { Airport, Arrow } from "./flight-components";

//#region after
import {
  createGenerativeUI,
  standardUI,
} from "@copilotkit/react-core/v2/generative-ui";

export const appUI = createGenerativeUI({
  id: "acme/flights@1",
  extends: [standardUI],
  components: {
    Airport: {
      component: Airport,
      description: "An airport by IATA code, with its city under it.",
      props: z.object({ code: z.string(), city: z.string() }),
    },
    Arrow: { component: Arrow, description: "An arrow between two airports." },
  },
});
//#endregion
