// The `webmcp.ts` snippet of https://docs.copilotkit.ai/google-adk/webmcp,
// verbatim inside `#region webmcp`. The `searchOrders` import is
// harness-authored (see search-orders.ts).
import { searchOrders } from "./search-orders";

//#region webmcp
import { CopilotKitCore } from "@copilotkit/core";
import { z } from "zod";

export const copilotkit = new CopilotKitCore({
  tools: [
    {
      name: "searchOrders",
      description: "Search the signed-in user's orders by status",
      parameters: z.object({
        status: z.enum(["open", "shipped", "delivered"]),
      }),
      handler: async ({ status }) => {
        const orders = await searchOrders(status);
        return JSON.stringify(orders);
      },
      webmcp: {
        annotations: {
          readOnlyHint: true,
        },
      },
    },
  ],
});
//#endregion
