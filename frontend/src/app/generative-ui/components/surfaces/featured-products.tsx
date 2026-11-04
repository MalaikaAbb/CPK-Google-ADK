// Verbatim: the `app/page.tsx` block of
// https://docs.copilotkit.ai/google-adk/generative-ui/components/surfaces
// The `Product` / `ProductRow` import is harness-authored; the page uses both
// without defining them.
import { GenerativeUISurface } from "@copilotkit/react-core/v2/generative-ui";
import { shopUI } from "../_shop/catalog";
import { type Product, ProductRow } from "../_shop/products";

export function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <GenerativeUISurface
      id="featured"
      ui={shopUI}
      description="The Featured Products row of the home page. When the customer asks to see products here, show them as a ProductGrid with one ProductCard for each product. When they ask for the featured products again, delete this surface."
      components={["ProductGrid", "ProductCard"]}
      fallback={<ProductRow products={products} />}
    />
  );
}
