// Harness-authored stub. Both WebMCP snippets call `searchOrders(status)` and
// the page never defines it. Fixed orders, filtered by status, so the tool has
// something real to return.
export type OrderStatus = "open" | "shipped" | "delivered";

const ORDERS = [
  { id: "A-1001", status: "open", item: "Road Glide 3", total: 89 },
  { id: "A-1002", status: "shipped", item: "Wind Shell", total: 79 },
  { id: "A-1003", status: "delivered", item: "Insulated Bottle", total: 25 },
  { id: "A-1004", status: "shipped", item: "Cushion Socks (3 pack)", total: 18 },
] as const;

export async function searchOrders(status: OrderStatus) {
  return ORDERS.filter((order) => order.status === status);
}
