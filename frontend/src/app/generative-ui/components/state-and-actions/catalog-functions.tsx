// "Run your code on a click" from
// https://docs.copilotkit.ai/google-adk/generative-ui/components/state-and-actions
// All three snippets verbatim inside `#region functions`, `#region
// cart-actions` and `#region product-card`. Harness-authored outside them: the
// `z`, `createGenerativeUI` and `Cart` imports.
import { z } from "zod";
import { createGenerativeUI } from "@copilotkit/react-core/v2/generative-ui";

import type { Cart } from "./cart";

//#region functions
export const shopUI = createGenerativeUI({
  id: "acme/shop@1",
  functions: {
    addToCart: {
      description: "Add a product to the cart",
      parameters: z.object({ productId: z.string(), quantity: z.number().default(1) }),
    },
  },
  components: {
    ProductCard: {
      component: ProductCard,
      props: z.object({ productId: z.string(), name: z.string() }),
      events: { onAddToCart: {} },
    },
  },
});
//#endregion

//#region cart-actions
import { useGenerativeUIFunction } from "@copilotkit/react-core/v2/generative-ui";

export function CartActions({ cart }: { cart: Cart }) {
  useGenerativeUIFunction(shopUI, "addToCart", ({ productId, quantity }) => {
    cart.addItem(productId, quantity);
    return { added: productId };
  });
  return null;
}
//#endregion

//#region product-card
import { useState } from "react";
import type { GenerativeUIComponentProps } from "@copilotkit/react-core/v2/generative-ui";

function ProductCard({ productId, name, onAddToCart }: GenerativeUIComponentProps<typeof shopUI, "ProductCard">) {
  const [error, setError] = useState<string>();
  return (
    <article>
      <h4>{name}</h4>
      <button
        onClick={async () => {
          const result = await onAddToCart?.({ productId });
          if (result) setError(result.ok ? undefined : result.error.message);
        }}
      >
        Add to cart
      </button>
      {error ? <p role="alert">{error}</p> : null}
    </article>
  );
}
//#endregion
