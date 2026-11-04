// The `OrderSearch.tsx` snippet of https://docs.copilotkit.ai/google-adk/webmcp,
// verbatim inside `#region order-search`. The `searchOrders` import is
// harness-authored (see search-orders.ts).
import { searchOrders } from "./search-orders";

//#region order-search
"use client";

import { useFrontendTool } from "@copilotkit/react-core/v2";
import { z } from "zod";

export function OrderSearch() {
  useFrontendTool({
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
  });

  return null;
}
//#endregion
