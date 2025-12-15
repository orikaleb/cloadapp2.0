'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { getProductImage } from '@/lib/product-images';

type Category = {
  id: string;
  categoryName: string;
  description?: string | null;
  parentCategoryId?: string | null;
};

// Static products data - matches products page
const STATIC_PRODUCTS = [
  { id: 1, name: 'Wireless Headphones', price: 199.99, category: 'electronics', categoryId: 'electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop', rating: 4.5, reviews: 128, inStock: true },
  { id: 2, name: 'Smart Watch', price: 299.99, category: 'electronics', categoryId: 'electronics', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop', rating: 4.8, reviews: 89, inStock: true },
  { id: 3, name: 'Laptop Stand', price: 79.99, category: 'electronics', categoryId: 'electronics', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop', rating: 4.3, reviews: 45, inStock: true },
  { id: 4, name: 'Bluetooth Speaker', price: 129.99, category: 'electronics', categoryId: 'electronics', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop', rating: 4.6, reviews: 67, inStock: true },
  { id: 5, name: 'Designer T-Shirt', price: 49.99, category: 'fashion', categoryId: 'fashion', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop', rating: 4.4, reviews: 23, inStock: true },
  { id: 6, name: 'Running Shoes', price: 149.99, category: 'fashion', categoryId: 'fashion', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop', rating: 4.7, reviews: 156, inStock: true },
  { id: 7, name: 'Coffee Maker', price: 89.99, category: 'home', categoryId: 'home', image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=500&h=500&fit=crop', rating: 4.2, reviews: 34, inStock: true },
  { id: 8, name: 'Gaming Console', price: 499.99, category: 'gaming', categoryId: 'gaming', image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&h=500&fit=crop', rating: 4.9, reviews: 203, inStock: false },
  { id: 9, name: 'Wireless Mouse', price: 39.99, category: 'electronics', categoryId: 'electronics', image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=500&fit=crop', rating: 4.5, reviews: 92, inStock: true },
  { id: 10, name: 'Power Bank', price: 39.99, category: 'electronics', categoryId: 'electronics', image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=500&fit=crop', rating: 4.5, reviews: 203, inStock: true },
  { id: 11, name: 'Tablet', price: 349.99, category: 'electronics', categoryId: 'electronics', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop', rating: 4.6, reviews: 78, inStock: true },
  { id: 12, name: 'Monitor', price: 249.99, category: 'electronics', categoryId: 'electronics', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=500&fit=crop', rating: 4.6, reviews: 167, inStock: true },
  { id: 13, name: 'Mechanical Keyboard', price: 119.99, category: 'electronics', categoryId: 'electronics', image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&h=500&fit=crop', rating: 4.7, reviews: 201, inStock: true },
  { id: 14, name: 'Jeans', price: 79.99, category: 'fashion', categoryId: 'fashion', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop', rating: 4.5, reviews: 167, inStock: true },
  { id: 15, name: 'Sunglasses', price: 59.99, category: 'fashion', categoryId: 'fashion', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop', rating: 4.6, reviews: 89, inStock: true },
  { id: 16, name: 'Backpack', price: 89.99, category: 'fashion', categoryId: 'fashion', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop', rating: 4.4, reviews: 112, inStock: true },
  { id: 17, name: 'Leather Jacket', price: 249.99, category: 'fashion', categoryId: 'fashion', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop', rating: 4.8, reviews: 45, inStock: true },
  { id: 18, name: 'Hoodie', price: 79.99, category: 'fashion', categoryId: 'fashion', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop', rating: 4.5, reviews: 134, inStock: true },
  { id: 19, name: 'Sneakers', price: 129.99, category: 'fashion', categoryId: 'fashion', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop', rating: 4.7, reviews: 245, inStock: true },
  { id: 20, name: 'Baseball Cap', price: 24.99, category: 'fashion', categoryId: 'fashion', image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&h=500&fit=crop', rating: 4.2, reviews: 201, inStock: true },
  { id: 21, name: 'Air Purifier', price: 159.99, category: 'home', categoryId: 'home', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&h=500&fit=crop', rating: 4.5, reviews: 67, inStock: true },
  { id: 22, name: 'Desk Lamp', price: 34.99, category: 'home', categoryId: 'home', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&h=500&fit=crop', rating: 4.4, reviews: 145, inStock: true },
  { id: 23, name: 'Area Rug', price: 149.99, category: 'home', categoryId: 'home', image: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=500&h=500&fit=crop', rating: 4.4, reviews: 112, inStock: true },
  { id: 24, name: 'Plant Pot', price: 19.99, category: 'home', categoryId: 'home', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&h=500&fit=crop', rating: 4.6, reviews: 123, inStock: true },
  { id: 25, name: 'Vacuum Cleaner', price: 199.99, category: 'home', categoryId: 'home', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop', rating: 4.7, reviews: 156, inStock: true },
  { id: 26, name: 'Wall Clock', price: 44.99, category: 'home', categoryId: 'home', image: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=500&h=500&fit=crop', rating: 4.2, reviews: 67, inStock: true },
  { id: 27, name: 'Gaming Mouse', price: 79.99, category: 'gaming', categoryId: 'gaming', image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=500&fit=crop', rating: 4.8, reviews: 234, inStock: true },
  { id: 28, name: 'Gaming Headset', price: 149.99, category: 'gaming', categoryId: 'gaming', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop', rating: 4.7, reviews: 189, inStock: true },
  { id: 29, name: 'Gaming Chair', price: 299.99, category: 'gaming', categoryId: 'gaming', image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500&h=500&fit=crop', rating: 4.6, reviews: 98, inStock: true },
  { id: 30, name: 'Gaming Keyboard', price: 129.99, category: 'gaming', categoryId: 'gaming', image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&h=500&fit=crop', rating: 4.9, reviews: 267, inStock: true },
];

// Map category IDs to display names
const CATEGORY_MAP: Record<string, string> = {
  'electronics': 'Electronics',
  'fashion': 'Fashion',
  'home': 'Home & Garden',
  'gaming': 'Gaming',
};

export default function CategoriesPage() {
  const { getCartCount } = useCart();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);

  const seedCategories = async () => {
    setSeeding(true);
    try {
      const seedRes = await fetch('/api/seed-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (seedRes.ok) {
        // Reload categories after seeding
        const reloadRes = await fetch('/api/categories', { cache: 'no-store' });
        if (reloadRes.ok) {
          const reloadedData = await reloadRes.json();
          setCategories(reloadedData);
          setError(null);
        }
      } else {
        setError('Failed to seed categories. Please try again.');
      }
    } catch (seedError) {
      console.error('Failed to seed categories:', seedError);
      setError('Failed to seed categories. Please check your database connection.');
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const res = await fetch('/api/categories', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to load categories');
        const data = await res.json();
        
        // If no categories exist, seed them
        if (isMounted && data.length === 0) {
          try {
            const seedRes = await fetch('/api/seed-categories', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
            });
            if (seedRes.ok) {
              // Reload categories after seeding
              const reloadRes = await fetch('/api/categories', { cache: 'no-store' });
              if (reloadRes.ok) {
                const reloadedData = await reloadRes.json();
                if (isMounted) setCategories(reloadedData);
              }
            }
          } catch (seedError) {
            console.error('Failed to seed categories:', seedError);
          }
        } else if (isMounted) {
          setCategories(data);
        }
      } catch (e: unknown) {
        if (isMounted) setError('Could not fetch categories.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <a href="/" className="text-xl font-bold text-blue-600">CloudStore</a>
              <div className="hidden md:flex space-x-6">
                <a href="/" className="text-gray-600 hover:text-blue-600">Home</a>
                <a href="/products" className="text-gray-600 hover:text-blue-600">Products</a>
                <a href="/categories" className="text-blue-600 font-medium">Categories</a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/cart" className="text-gray-600 hover:text-blue-600">Cart ({getCartCount()})</a>
              <a href="/auth/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Sign In</a>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-2">Browse all product categories</p>
        </div>

        {/* Loading / Error */}
        {loading && (
          <div className="text-center py-20 text-gray-600">Loading categories…</div>
        )}
        {error && !loading && (
          <div className="text-center py-20 text-red-600">{error}</div>
        )}

        {/* Empty State */}
        {!loading && !error && categories.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📂</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-600 mb-6">Click the button below to create default categories.</p>
            <button
              onClick={seedCategories}
              disabled={seeding}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {seeding ? 'Creating Categories...' : 'Create Default Categories'}
            </button>
          </div>
        )}

        {/* Categories with Products */}
        {!loading && !error && categories.length > 0 && (
          <div className="space-y-12">
            {categories.map((category) => {
              // Find products for this category
              const categoryProducts = STATIC_PRODUCTS.filter(
                (product) => product.categoryId === category.id.toLowerCase() || 
                product.category.toLowerCase() === category.categoryName.toLowerCase()
              );

              return (
                <div key={category.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {category.categoryName}
                      </h2>
                      {category.description && (
                        <p className="text-gray-600 mt-1">{category.description}</p>
                      )}
                      <p className="text-sm text-gray-500 mt-2">
                        {categoryProducts.length} {categoryProducts.length === 1 ? 'product' : 'products'} available
                      </p>
                    </div>
                    <a
                      href={`/products?category=${category.id}`}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      View All →
                    </a>
                  </div>

                  {categoryProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {categoryProducts.map((product) => (
                        <a
                          key={product.id}
                          href={`/products/${product.id}`}
                          className="group bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-all"
                        >
                          <div className="aspect-square bg-white relative overflow-hidden">
                            {product.image && (
                              typeof product.image === 'string' &&
                              (product.image.startsWith('http://') ||
                                product.image.startsWith('https://') ||
                                product.image.startsWith('data:')) ? (
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl">
                                  {product.image || '📦'}
                                </div>
                              )
                            )}
                          </div>
                          <div className="p-3">
                            <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                              {product.name}
                            </h3>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-blue-600 font-bold">₵{product.price}</span>
                              {product.rating && (
                                <div className="flex items-center text-xs text-gray-500">
                                  <span className="text-yellow-400 mr-1">★</span>
                                  <span>{product.rating}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No products found in this category.</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Fallback: Show static categories if API categories are empty */}
        {!loading && !error && categories.length === 0 && (
          <div className="space-y-12">
            {Object.entries(CATEGORY_MAP).map(([categoryId, categoryName]) => {
              const categoryProducts = STATIC_PRODUCTS.filter(
                (product) => product.categoryId === categoryId
              );

              return (
                <div key={categoryId} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{categoryName}</h2>
                      <p className="text-sm text-gray-500 mt-2">
                        {categoryProducts.length} {categoryProducts.length === 1 ? 'product' : 'products'} available
                      </p>
                    </div>
                    <a
                      href={`/products?category=${categoryId}`}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      View All →
                    </a>
                  </div>

                  {categoryProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {categoryProducts.map((product) => (
                        <a
                          key={product.id}
                          href={`/products/${product.id}`}
                          className="group bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-all"
                        >
                          <div className="aspect-square bg-white relative overflow-hidden">
                            {product.image && (
                              typeof product.image === 'string' &&
                              (product.image.startsWith('http://') ||
                                product.image.startsWith('https://') ||
                                product.image.startsWith('data:')) ? (
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl">
                                  {product.image || '📦'}
                                </div>
                              )
                            )}
                          </div>
                          <div className="p-3">
                            <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                              {product.name}
                            </h3>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-blue-600 font-bold">₵{product.price}</span>
                              {product.rating && (
                                <div className="flex items-center text-xs text-gray-500">
                                  <span className="text-yellow-400 mr-1">★</span>
                                  <span>{product.rating}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}


