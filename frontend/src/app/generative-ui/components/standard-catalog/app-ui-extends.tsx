// The "Add your own components" snippet of
// https://docs.copilotkit.ai/google-adk/generative-ui/components/standard-catalog,
// verbatim inside `#region extends`. The `ProductCard` / `productSchema`
// import is harness-authored.
import { ProductCard, productSchema } from "./product-card";

//#region extends
import { createGenerativeUI, standardUI } from "@copilotkit/react-core/v2/generative-ui";

export const appUI = createGenerativeUI({
  id: "acme/app@1",
  extends: [standardUI],
  components: {
    ProductCard: { component: ProductCard, props: productSchema },
  },
});
//#endregion
