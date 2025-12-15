import { NextResponse } from 'next/server';
import { saveOrder, getAllOrders } from '@/lib/order-storage';

export async function GET() {
  try {
    // Return orders from storage (for development)
    const orders = getAllOrders();
    return NextResponse.json(orders);
  } catch (error: unknown) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    console.log('Creating order with data:', JSON.stringify(data, null, 2));
    
    // Validate required fields
    if (!data.customerId) {
      return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 });
    }
    if (!data.totalAmount) {
      return NextResponse.json({ error: 'Total amount is required' }, { status: 400 });
    }
    if (!data.orderItems || !Array.isArray(data.orderItems) || data.orderItems.length === 0) {
      return NextResponse.json({ error: 'Order items are required' }, { status: 400 });
    }

    // Generate order ID
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create order object
    const orderData = {
      id: orderId,
      customerId: data.customerId,
      orderDate: data.orderDate || new Date().toISOString(),
      status: 'pending',
      totalAmount: data.totalAmount,
      shippingFee: data.shippingFee || 0,
      tax: data.tax || 0,
      discount: data.discount || 0,
      shippingAddress: data.shippingAddress || {},
      orderItems: data.orderItems,
      paymentMethod: data.paymentMethod || 'credit_card',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Store order in memory (for development)
    // In production, this should be saved to Firestore via Admin SDK
    saveOrder(orderData);
    
    console.log('Order created successfully:', orderId);
    console.log('Note: Order is stored in memory. For persistence across server restarts, configure Firebase Admin SDK.');
    
    return NextResponse.json({
      ...orderData,
      message: 'Order created successfully',
      note: 'Order stored temporarily. Configure Firebase Admin SDK for persistent storage.',
    }, { status: 201 });
  } catch (error: unknown) {
    console.error('Failed to create order:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ 
      error: 'Failed to create order',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    }, { status: 500 });
  }
}
