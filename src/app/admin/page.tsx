'use client';

import { useEffect, useState } from 'react';

type Stats = {
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  pendingOrders: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalInventoryValue: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    totalInventoryValue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all stats in parallel
        const [productsRes, categoriesRes, ordersRes, customersRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories'),
          fetch('/api/orders'),
          fetch('/api/customers'),
        ]);

        const products = await productsRes.json();
        const categories = await categoriesRes.json();
        const orders = await ordersRes.json();
        const customers = await customersRes.json();

        // Calculate revenue and pending orders
        const revenue = orders.reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0);
        const pending = orders.filter((order: any) => order.status === 'pending').length;

        // Calculate inventory stats
        const lowStock = products.filter((p: any) => p.stockQuantity > 0 && p.stockQuantity <= 10).length;
        const outOfStock = products.filter((p: any) => p.stockQuantity === 0).length;
        const inventoryValue = products.reduce((sum: number, p: any) => 
          sum + (p.price * (p.stockQuantity || 0)), 0);

        setStats({
          totalProducts: products.length || 0,
          totalCategories: categories.length || 0,
          totalOrders: orders.length || 0,
          totalCustomers: customers.length || 0,
          totalRevenue: revenue,
          pendingOrders: pending,
          lowStockItems: lowStock,
          outOfStockItems: outOfStock,
          totalInventoryValue: inventoryValue,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: '📦',
      color: 'bg-blue-500',
      href: '/admin/products',
    },
    {
      title: 'Total Categories',
      value: stats.totalCategories,
      icon: '📁',
      color: 'bg-green-500',
      href: '/admin/categories',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: '🛒',
      color: 'bg-yellow-500',
      href: '/admin/orders',
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: '👥',
      color: 'bg-purple-500',
      href: '/admin/customers',
    },
    {
      title: 'Total Revenue',
      value: `₵${stats.totalRevenue.toFixed(2)}`,
      icon: '💰',
      color: 'bg-indigo-500',
      href: '/admin/orders',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: '⏳',
      color: 'bg-red-500',
      href: '/admin/orders?status=pending',
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStockItems,
      icon: '⚠️',
      color: 'bg-orange-500',
      href: '/admin/inventory?filter=low',
    },
    {
      title: 'Out of Stock',
      value: stats.outOfStockItems,
      icon: '❌',
      color: 'bg-red-600',
      href: '/admin/inventory?filter=out',
    },
    {
      title: 'Inventory Value',
      value: `₵${stats.totalInventoryValue.toFixed(2)}`,
      icon: '📊',
      color: 'bg-teal-500',
      href: '/admin/inventory',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Overview of your e-commerce store</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <a
            key={stat.title}
            href={stat.href}
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className={`${stat.color} rounded-md p-3`}>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.title}
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <a
            href="/admin/products/new"
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
          >
            <div className="flex items-center">
              <span className="text-3xl mr-4">➕</span>
              <div>
                <h3 className="font-semibold text-gray-900">Add New Product</h3>
                <p className="text-sm text-gray-600">Create a new product listing</p>
              </div>
            </div>
          </a>
          <a
            href="/admin/categories/new"
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
          >
            <div className="flex items-center">
              <span className="text-3xl mr-4">📁</span>
              <div>
                <h3 className="font-semibold text-gray-900">Add New Category</h3>
                <p className="text-sm text-gray-600">Create a new product category</p>
              </div>
            </div>
          </a>
          <a
            href="/admin/orders"
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
          >
            <div className="flex items-center">
              <span className="text-3xl mr-4">📋</span>
              <div>
                <h3 className="font-semibold text-gray-900">View Orders</h3>
                <p className="text-sm text-gray-600">Manage customer orders</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

