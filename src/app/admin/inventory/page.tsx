'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

type Product = {
  id: string;
  sku: string;
  productName: string;
  brand?: string;
  price: number;
  stockQuantity: number;
  category?: {
    categoryName: string;
  };
};

function InventoryContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>(searchParams.get('filter') || 'all');
  const [sortBy, setSortBy] = useState<string>('name');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      setProducts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800', priority: 1 };
    if (quantity <= 10) return { label: 'Low Stock', color: 'bg-orange-100 text-orange-800', priority: 2 };
    if (quantity <= 50) return { label: 'Medium Stock', color: 'bg-yellow-100 text-yellow-800', priority: 3 };
    return { label: 'In Stock', color: 'bg-green-100 text-green-800', priority: 4 };
  };

  const filteredProducts = products.filter(product => {
    if (filter === 'low') return product.stockQuantity > 0 && product.stockQuantity <= 10;
    if (filter === 'out') return product.stockQuantity === 0;
    if (filter === 'medium') return product.stockQuantity > 10 && product.stockQuantity <= 50;
    if (filter === 'good') return product.stockQuantity > 50;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const statusA = getStockStatus(a.stockQuantity);
    const statusB = getStockStatus(b.stockQuantity);
    
    if (sortBy === 'stock') {
      // Sort by stock status priority first, then by quantity
      if (statusA.priority !== statusB.priority) {
        return statusA.priority - statusB.priority;
      }
      return a.stockQuantity - b.stockQuantity;
    }
    if (sortBy === 'value') {
      return (b.price * b.stockQuantity) - (a.price * a.stockQuantity);
    }
    return a.productName.localeCompare(b.productName);
  });

  const totalInventoryValue = filteredProducts.reduce(
    (sum, p) => sum + (p.price * p.stockQuantity),
    0
  );

  if (loading) {
    return <div className="text-center py-12 text-gray-600">Loading inventory...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
        <p className="mt-2 text-gray-600">Track and manage your product inventory</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="bg-blue-500 rounded-md p-3">
                <span className="text-2xl">📦</span>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Total Products</p>
                <p className="text-2xl font-semibold text-gray-900">{filteredProducts.length}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="bg-orange-500 rounded-md p-3">
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Low Stock</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {products.filter(p => p.stockQuantity > 0 && p.stockQuantity <= 10).length}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="bg-red-600 rounded-md p-3">
                <span className="text-2xl">❌</span>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Out of Stock</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {products.filter(p => p.stockQuantity === 0).length}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="bg-teal-500 rounded-md p-3">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Inventory Value</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ₵{totalInventoryValue.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('out')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'out'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Out of Stock
            </button>
            <button
              onClick={() => setFilter('low')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'low'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Low Stock (≤10)
            </button>
            <button
              onClick={() => setFilter('medium')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'medium'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Medium (11-50)
            </button>
            <button
              onClick={() => setFilter('good')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'good'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Good Stock (&gt;50)
            </button>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 bg-white text-sm"
          >
            <option value="name">Sort by Name</option>
            <option value="stock">Sort by Stock Level</option>
            <option value="value">Sort by Inventory Value</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SKU
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedProducts.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            ) : (
              sortedProducts.map((product) => {
                const stockStatus = getStockStatus(product.stockQuantity);
                const itemValue = product.price * product.stockQuantity;
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {product.productName}
                      </div>
                      {product.brand && (
                        <div className="text-sm text-gray-500">{product.brand}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.category?.categoryName || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₵{product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {product.stockQuantity}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${stockStatus.color}`}>
                        {stockStatus.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₵{itemValue.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <a
                        href={`/admin/products/${product.id}/edit`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </a>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function InventoryPage() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-gray-600">Loading inventory...</div>}>
      <InventoryContent />
    </Suspense>
  );
}

