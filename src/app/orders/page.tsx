'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/lib/auth-context';
import Navigation from '@/components/Navigation';
import Toast from '@/components/Toast';
import { useRouter } from 'next/navigation';

type OrderItem = {
  id: string;
  quantity: number;
  subtotal: number;
  product: {
    id: string;
    productName: string;
    price: number;
    productImages: Array<{
      imageUrl: string;
    }>;
  };
};

type Order = {
  id: string;
  orderDate: string;
  status: string;
  totalAmount: number;
  shippingFee: number;
  tax: number;
  discount: number;
  orderItems: OrderItem[];
  payments: Array<{
    paymentMethod: string;
    amount: number;
    paymentDate: string;
  }>;
  shipments: Array<{
    status: string;
    trackingNumber: string | null;
    shipmentDate: string;
  }>;
};

function OrdersPageContent() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; isVisible: boolean }>({
    message: '',
    type: 'info',
    isVisible: false,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/orders');
      return;
    }

    fetchOrders();
  }, [isAuthenticated, router]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Get user ID from localStorage
      const authData = localStorage.getItem('userAuth');
      if (!authData) {
        window.location.href = '/auth/login';
        return;
      }

      const userData = JSON.parse(authData);
      if (!userData.id) {
        setToast({ message: 'User ID not found. Please sign in again.', type: 'error', isVisible: true });
        setLoading(false);
        return;
      }

      // Try to fetch from API
      const response = await fetch(`/api/orders/my-orders?customerId=${userData.id}`);
      
      let data = [];
      if (response.ok) {
        data = await response.json();
      }
      
      // Also check localStorage as backup (for orders created but not yet in server storage)
      if (typeof window !== 'undefined') {
        const localOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
        // Filter orders for this customer and format them
        const userLocalOrders = localOrders
          .filter((order: any) => order.customerId === userData.id)
          .map((order: any) => ({
            id: order.id,
            orderDate: order.orderDate || order.createdAt,
            status: order.status || 'pending',
            totalAmount: order.totalAmount,
            shippingFee: order.shippingFee || 0,
            tax: order.tax || 0,
            discount: order.discount || 0,
            orderItems: (order.orderItems || []).map((item: any) => ({
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
              paymentDate: order.createdAt || new Date().toISOString(),
            }],
            shipments: [{
              status: 'pending',
              trackingNumber: null,
              shipmentDate: order.createdAt || new Date().toISOString(),
            }],
          }));
        
        // Merge and deduplicate orders
        const allOrders = [...data, ...userLocalOrders];
        const uniqueOrders = allOrders.filter((order, index, self) => 
          index === self.findIndex((o) => o.id === order.id)
        );
        
        // Sort by date (newest first)
        uniqueOrders.sort((a, b) => {
          const dateA = new Date(a.orderDate || a.createdAt).getTime();
          const dateB = new Date(b.orderDate || b.createdAt).getTime();
          return dateB - dateA;
        });
        
        setOrders(uniqueOrders);
      } else {
        setOrders(data);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      // Try to load from localStorage as fallback
      if (typeof window !== 'undefined') {
        const authData = localStorage.getItem('userAuth');
        if (authData) {
          const userData = JSON.parse(authData);
          const localOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
          const userLocalOrders = localOrders.filter((order: any) => order.customerId === userData.id);
          setOrders(userLocalOrders);
        }
      }
      if (orders.length === 0) {
        setToast({ message: 'Failed to load orders. Please try again.', type: 'error', isVisible: true });
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <div className="text-gray-600">Loading your orders...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">View and track your order history</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-6">You haven't placed any orders. Start shopping to see your orders here!</p>
            <a
              href="/products"
              className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden animate-fade-in">
                {/* Order Header */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">Order #{order.id.slice(-8).toUpperCase()}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">Placed on {formatDate(order.orderDate)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">₵{order.totalAmount.toFixed(2)}</p>
                      {order.shipments.length > 0 && order.shipments[0].trackingNumber && (
                        <p className="text-sm text-gray-600 mt-1">
                          Tracking: {order.shipments[0].trackingNumber}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.orderItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {item.product.productImages && item.product.productImages.length > 0 ? (
                            <img
                              src={item.product.productImages[0].imageUrl}
                              alt={item.product.productName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-3xl">📦</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate">{item.product.productName}</h4>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          <p className="text-sm text-gray-600">Price: ₵{item.product.price.toFixed(2)} each</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">₵{item.subtotal.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">₵{(order.totalAmount - order.shippingFee - order.tax + order.discount).toFixed(2)}</span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between items-center text-sm mb-2 text-green-600">
                        <span>Discount</span>
                        <span className="font-medium">-₵{order.discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">₵{order.shippingFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">₵{order.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold pt-2 border-t border-gray-200">
                      <span>Total</span>
                      <span className="text-blue-600">₵{order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Payment & Shipping Info */}
                  {order.payments.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Payment:</span> {order.payments[0].paymentMethod} - ₵{order.payments[0].amount.toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    }>
      <OrdersPageContent />
    </Suspense>
  );
}
