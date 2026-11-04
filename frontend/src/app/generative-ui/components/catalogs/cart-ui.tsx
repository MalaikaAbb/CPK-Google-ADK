// Harness-authored. The Catalogs page's "Combine catalogs" snippet extends
// `cartUI` but never shows it. This is the smallest CopilotKit catalog that
// fills the gap: one component.
import { z } from "zod";
import { createGenerativeUI } from "@copilotkit/react-core/v2/generative-ui";

function CartSummary({ itemCount, total }: { itemCount: number; total: number }) {
  return (
    <div className="rounded-lg border p-3 text-sm">
      {itemCount} item{itemCount === 1 ? "" : "s"} · ${total}
    </div>
  );
}

export const cartUI = createGenerativeUI({
  id: "acme/cart@1",
  components: {
    CartSummary: {
      component: CartSummary,
      description: "A one-line summary of the cart: item count and total price.",
      props: z.object({ itemCount: z.number(), total: z.number() }),
    },
  },
});
