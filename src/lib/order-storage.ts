// Temporary in-memory order storage
// In production, replace this with Firebase Firestore via Admin SDK

type Order = {
  id: string;
  customerId: string;
  orderDate: string;
  status: string;
  totalAmount: number;
  shippingFee: number;
  tax: number;
  discount: number;
  shippingAddress: any;
  orderItems: any[];
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
};

const ordersStorage: Map<string, Order> = new Map();

export function saveOrder(order: Order) {
  ordersStorage.set(order.id, order);
  // Also save to a file or use a proper database in production
  return order;
}

export function getOrder(orderId: string): Order | undefined {
  return ordersStorage.get(orderId);
}

export function getOrdersByCustomer(customerId: string): Order[] {
  return Array.from(ordersStorage.values()).filter(
    order => order.customerId === customerId
  );
}

export function getAllOrders(): Order[] {
  return Array.from(ordersStorage.values());
}

export function clearOrders() {
  ordersStorage.clear();
}


