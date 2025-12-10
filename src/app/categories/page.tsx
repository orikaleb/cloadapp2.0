'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/lib/cart-context';

type Category = {
  id: string;
  categoryName: string;
  description?: string | null;
  parentCategoryId?: string | null;
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

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <a
              key={category.id}
              href="/products"
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow block"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {category.categoryName}
                  </h2>
                  {category.description && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                </div>
                <div className="text-2xl">📁</div>
              </div>
              <div className="mt-4">
                <span className="inline-block text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View Products →
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}


