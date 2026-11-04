// Harness-authored. The State and Actions page reads `cart.items` and calls
// `cart.addItem(productId, quantity)` on a `Cart` it never defines. Plain React
// state, not CopilotKit.
import { useCallback, useMemo, useState } from "react";

export interface Cart {
  items: { productId: string; quantity: number }[];
  addItem: (productId: string, quantity: number) => void;
}

export function useCart(): Cart {
  const [items, setItems] = useState<Cart["items"]>([]);
  const addItem = useCallback((productId: string, quantity: number) => {
    setItems((prev) => {
      const found = prev.find((i) => i.productId === productId);
      return found
        ? prev.map((i) => (i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i))
        : [...prev, { productId, quantity }];
    });
  }, []);
  return useMemo(() => ({ items, addItem }), [items, addItem]);
}
