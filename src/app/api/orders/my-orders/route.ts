import { NextResponse } from 'next/server';
import { getOrdersByCustomer } from '@/lib/order-storage';

export async function GET(request: Request) {
  try {
    // Get customer ID from query params
    const url = new URL(request.url);
    const customerId = url.searchParams.get('customerId');

    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      );
    }

    // Get orders from storage for this customer
    let customerOrders = getOrdersByCustomer(customerId);
    
    // If no orders in server storage, return empty array
    // Client-side will check localStorage as backup
    if (customerOrders.length === 0) {
      return NextResponse.json([]);
    }

    // Format orders to match expected structure
    const formattedOrders = customerOrders.map(order => ({
      id: order.id,
      orderDate: order.orderDate,
      status: order.status,
      totalAmount: order.totalAmount,
      shippingFee: order.shippingFee || 0,
      tax: order.tax || 0,
      discount: order.discount || 0,
      orderItems: order.orderItems.map((item: any) => ({
        id: `item_${item.productId}_${order.id}`,
        quantity: item.quantity,
        subtotal: item.subtotal || item.price * item.quantity,
        product: {
          productName: `Product ${item.productId}`,
          price: item.price,
          productImages: [],
        },
      })),
      payments: [{
        paymentMethod: order.paymentMethod || 'credit_card',
        amount: order.totalAmount,
        paymentDate: order.createdAt,
      }],
      shipments: [{
        status: 'pending',
        trackingNumber: null,
        shipmentDate: order.createdAt,
      }],
    }));

    return NextResponse.json(formattedOrders);
  } catch (error: unknown) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
