/**
 * Harness-authored. The Surfaces page uses `Product`, `ProductRow` and a
 * `products` list without defining them. These are plain app code, not
 * CopilotKit: the app's own product row that `GenerativeUISurface` shows as its
 * `fallback`, and the same products the backend's `search_products` returns.
 */

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
}

// Labelled placeholders (name + category), the same URLs the backend's
// `search_products` returns, so the fallback row and agent-rendered cards match.
const placeholder = (name: string, category: string) =>
  `https://placehold.co/320x200/png?text=${encodeURIComponent(`${name}\n${category}`).replace(/%20/g, "+")}`;

export const SAMPLE_PRODUCTS: Product[] = [
  { id: "shoe-002", name: "Road Glide 3", price: 89, imageUrl: placeholder("Road Glide 3", "running shoes"), category: "running shoes" },
  { id: "jacket-001", name: "Wind Shell", price: 79, imageUrl: placeholder("Wind Shell", "jackets"), category: "jackets" },
  { id: "bottle-001", name: "Insulated Bottle", price: 25, imageUrl: placeholder("Insulated Bottle", "accessories"), category: "accessories" },
];

export function ProductRow({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {products.map((p) => (
        <article
          key={p.id}
          className="rounded-lg border border-slate-200 p-2 text-sm dark:border-slate-800"
        >
          <img src={p.imageUrl} alt={p.name} className="mb-1 rounded" />
          <p className="font-medium">{p.name}</p>
          <p className="text-slate-500">${p.price}</p>
        </article>
      ))}
    </div>
  );
}
