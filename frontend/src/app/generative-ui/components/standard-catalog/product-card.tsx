// Harness-authored. The Standard Catalog page's "Add your own components"
// snippet registers `ProductCard` with `productSchema`, and defines neither.
// Plain app code: a zod schema and the React component it describes.
import { z } from "zod";

export const productSchema = z.object({
  name: z.string(),
  price: z.number(),
  imageUrl: z.string(),
});

export function ProductCard({ name, price, imageUrl }: z.infer<typeof productSchema>) {
  return (
    <article className="w-48 rounded-lg border p-2 text-sm">
      <img src={imageUrl} alt={name} className="mb-1 rounded" />
      <p className="font-medium">{name}</p>
      <p>${price}</p>
    </article>
  );
}
