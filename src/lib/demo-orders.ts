export const DEMO_ORDERS_KEY = "arcplay-demo-orders";
export const DEMO_ORDER_EVENT = "arcplay:demo-order-created";
export const BALANCE_REFRESH_EVENT = "arcplay:balance-refresh";

export type DemoOrder = {
  id: string;
  product: string;
  playerId: string;
  transactionHash: string;
  createdAt: string;
};

export function readDemoOrders(): DemoOrder[] {
  try {
    const stored = window.localStorage.getItem(DEMO_ORDERS_KEY);
    return stored ? (JSON.parse(stored) as DemoOrder[]) : [];
  } catch {
    return [];
  }
}

export function saveDemoOrder(order: DemoOrder) {
  const orders = [order, ...readDemoOrders()].slice(0, 10);
  window.localStorage.setItem(DEMO_ORDERS_KEY, JSON.stringify(orders));
  window.dispatchEvent(new Event(DEMO_ORDER_EVENT));
  window.dispatchEvent(new Event(BALANCE_REFRESH_EVENT));
}
