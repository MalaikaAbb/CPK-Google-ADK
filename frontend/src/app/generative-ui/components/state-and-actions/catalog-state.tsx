// "Show live app state" from
// https://docs.copilotkit.ai/google-adk/generative-ui/components/state-and-actions
// Both snippets verbatim inside `#region state` and `#region cart-state`.
//
// Harness-authored outside the regions: the imports, and `ProductCard`, which
// this snippet registers but never defines (the page's only ProductCard
// component belongs to the functions catalog).
import { z } from "zod";
import {
  createGenerativeUI,
  type GenerativeUIComponentProps,
} from "@copilotkit/react-core/v2/generative-ui";

import type { Cart } from "./cart";

function ProductCard({ name, inCart }: GenerativeUIComponentProps<typeof shopUI, "ProductCard">) {
  return (
    <article className="rounded-lg border p-3 text-sm">
      <h4 className="font-medium">{name}</h4>
      <p>In cart: {inCart}</p>
    </article>
  );
}

//#region state
const cartSchema = z.object({
  items: z.array(z.object({ productId: z.string(), quantity: z.number() })),
});

export const shopUI = createGenerativeUI({
  id: "acme/shop@1",
  state: { cart: cartSchema },
  components: {
    ProductCard: {
      component: ProductCard,
      props: z.object({ productId: z.string(), name: z.string(), inCart: z.number() }),
      bind: {
        inCart: (state, { productId }) =>
          state.cart.items.find((item) => item.productId === productId)?.quantity ?? 0,
      },
    },
  },
});
//#endregion

//#region cart-state
import { useGenerativeUIState } from "@copilotkit/react-core/v2/generative-ui";

export function CartState({ cart }: { cart: Cart }) {
  useGenerativeUIState(shopUI, "cart", { items: cart.items });
  return null;
}
//#endregion
