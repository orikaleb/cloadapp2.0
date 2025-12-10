'use client';

import { useCart } from '@/lib/cart-context';

export default function Home() {
  const { getCartCount } = useCart();
  
  return (
    <div className="min-h-screen bg-white">
      {/* Simple Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-blue-600">CloudStore</h1>
            <div className="flex items-center space-x-4">
              <a href="/cart" className="text-gray-600 hover:text-blue-600">Cart ({getCartCount()})</a>
              <a href="/admin/login" className="text-gray-600 hover:text-blue-600 text-sm">Admin</a>
              <a href="/auth/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Sign In</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to CloudStore
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Modern e-commerce platform built with Next.js, Prisma, and MongoDB Atlas
          </p>
          <a href="/products" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-block">
            Start Shopping
          </a>
        </div>
      </section>

      {/* Quick Features */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-semibold mb-2">Fast</h3>
              <p className="text-sm text-gray-600">Built with Next.js for optimal performance</p>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl mb-2">🔒</div>
              <h3 className="font-semibold mb-2">Secure</h3>
              <p className="text-sm text-gray-600">MongoDB Atlas ensures data safety</p>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl mb-2">📱</div>
              <h3 className="font-semibold mb-2">Responsive</h3>
              <p className="text-sm text-gray-600">Works perfectly on all devices</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Products */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="h-32 bg-blue-100 rounded mb-4 flex items-center justify-center text-4xl">
                🎧
              </div>
              <h3 className="font-semibold mb-2">Wireless Headphones</h3>
              <p className="text-gray-600 text-sm mb-3">Premium quality with noise cancellation</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-blue-600">₵199.99</span>
                <a href="/products/1" className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                  View
                </a>
              </div>
            </div>

            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="h-32 bg-green-100 rounded mb-4 flex items-center justify-center text-4xl">
                ⌚
              </div>
              <h3 className="font-semibold mb-2">Smart Watch</h3>
              <p className="text-gray-600 text-sm mb-3">Fitness tracking and notifications</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-blue-600">₵299.99</span>
                <a href="/products/2" className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                  View
                </a>
              </div>
            </div>

            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="h-32 bg-purple-100 rounded mb-4 flex items-center justify-center text-4xl">
                💻
              </div>
              <h3 className="font-semibold mb-2">Laptop Stand</h3>
              <p className="text-gray-600 text-sm mb-3">Ergonomic aluminum design</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-blue-600">₵79.99</span>
                <a href="/products/3" className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                  View
                </a>
              </div>
            </div>

            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="h-32 bg-yellow-100 rounded mb-4 flex items-center justify-center text-4xl">
                🎮
              </div>
              <h3 className="font-semibold mb-2">Gaming Console</h3>
              <p className="text-gray-600 text-sm mb-3">Next-gen 4K gaming experience</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-blue-600">₵499.99</span>
                <a href="/products/8" className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                  View
                </a>
              </div>
            </div>

            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="h-32 bg-red-100 rounded mb-4 flex items-center justify-center text-4xl">
                👟
              </div>
              <h3 className="font-semibold mb-2">Running Shoes</h3>
              <p className="text-gray-600 text-sm mb-3">Advanced cushioning technology</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-blue-600">₵149.99</span>
                <a href="/products/6" className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                  View
                </a>
              </div>
            </div>

            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="h-32 bg-indigo-100 rounded mb-4 flex items-center justify-center text-4xl">
                ⌨️
              </div>
              <h3 className="font-semibold mb-2">Gaming Keyboard</h3>
              <p className="text-gray-600 text-sm mb-3">Mechanical switches with RGB</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-blue-600">₵129.99</span>
                <a href="/products/30" className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                  View
                </a>
              </div>
            </div>

            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="h-32 bg-pink-100 rounded mb-4 flex items-center justify-center text-4xl">
                🧥
              </div>
              <h3 className="font-semibold mb-2">Leather Jacket</h3>
              <p className="text-gray-600 text-sm mb-3">Premium quality leather</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-blue-600">₵249.99</span>
                <a href="/products" className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                  View
                </a>
              </div>
            </div>

            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="h-32 bg-teal-100 rounded mb-4 flex items-center justify-center text-4xl">
                📱
              </div>
              <h3 className="font-semibold mb-2">Tablet</h3>
              <p className="text-gray-600 text-sm mb-3">High-resolution display</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-blue-600">₵349.99</span>
                <a href="/products" className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                  View
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-lg font-semibold mb-4">CloudStore</h3>
          <p className="text-gray-400 mb-4">
            Your trusted e-commerce platform
          </p>
          <p className="text-sm text-gray-500">
            © 2024 CloudStore. Built with Next.js, Prisma, and MongoDB Atlas.
          </p>
        </div>
      </footer>
    </div>
  );
}
