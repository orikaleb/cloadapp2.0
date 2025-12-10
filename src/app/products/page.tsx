'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/lib/cart-context';

// Type definitions for API data
type ApiProduct = {
  id: string;
  sku: string;
  productName: string;
  brand?: string;
  description?: string;
  price: number;
  stockQuantity: number;
  categoryId: string;
  category?: {
    id: string;
    categoryName: string;
  };
  productImages?: Array<{
    imageUrl: string;
    isPrimary: boolean;
  }>;
};

type ApiCategory = {
  id: string;
  categoryName: string;
};

// Product type for UI display
type DisplayProduct = {
  id: string | number;
  name: string;
  price: number;
  category: string;
  categoryId: string;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
};

// Helper function to get emoji based on product name or category
const getProductEmoji = (productName: string, categoryName?: string): string => {
  const name = productName.toLowerCase();
  if (name.includes('headphone') || name.includes('earphone')) return '🎧';
  if (name.includes('watch')) return '⌚';
  if (name.includes('laptop') || name.includes('stand')) return '💻';
  if (name.includes('speaker')) return '🔊';
  if (name.includes('shirt') || name.includes('t-shirt')) return '👕';
  if (name.includes('shoe') || name.includes('boot')) return '👟';
  if (name.includes('coffee')) return '☕';
  if (name.includes('console') || name.includes('gaming')) return '🎮';
  if (name.includes('mouse')) return '🖱️';
  if (name.includes('cable') || name.includes('charger')) return '🔌';
  if (name.includes('tablet') || name.includes('phone')) return '📱';
  if (name.includes('camera') || name.includes('webcam')) return '📹';
  if (name.includes('keyboard')) return '⌨️';
  if (name.includes('jean')) return '👖';
  if (name.includes('sunglass')) return '🕶️';
  if (name.includes('backpack') || name.includes('bag')) return '🎒';
  if (name.includes('jacket')) return '🧥';
  if (name.includes('shirt') && !name.includes('t-shirt')) return '👔';
  if (name.includes('cap') || name.includes('hat')) return '🧢';
  if (name.includes('purifier') || name.includes('air')) return '💨';
  if (name.includes('lamp') || name.includes('light')) return '💡';
  if (name.includes('pillow')) return '🛋️';
  if (name.includes('plant') || name.includes('pot')) return '🪴';
  if (name.includes('vacuum') || name.includes('cleaner')) return '🧹';
  if (name.includes('clock')) return '🕐';
  if (name.includes('chair')) return '🪑';
  return '📦'; // Default emoji
};

const slugifyCategory = (name: string) => name.toLowerCase().replace(/\s+/g, '-');

const STATIC_CATEGORIES = [
  { id: 'electronics', name: 'Electronics' },
  { id: 'fashion', name: 'Fashion' },
  { id: 'home', name: 'Home & Garden' },
  { id: 'gaming', name: 'Gaming' },
];

const STATIC_PRODUCTS: DisplayProduct[] = [
  { id: 1, name: 'Wireless Headphones', price: 199.99, category: 'electronics', categoryId: 'electronics', image: '🎧', rating: 4.5, reviews: 128, inStock: true },
  { id: 2, name: 'Smart Watch', price: 299.99, category: 'electronics', categoryId: 'electronics', image: '⌚', rating: 4.8, reviews: 89, inStock: true },
  { id: 3, name: 'Laptop Stand', price: 79.99, category: 'electronics', categoryId: 'electronics', image: '💻', rating: 4.3, reviews: 45, inStock: true },
  { id: 4, name: 'Bluetooth Speaker', price: 129.99, category: 'electronics', categoryId: 'electronics', image: '🔊', rating: 4.6, reviews: 67, inStock: true },
  { id: 5, name: 'Designer T-Shirt', price: 49.99, category: 'fashion', categoryId: 'fashion', image: '👕', rating: 4.4, reviews: 23, inStock: true },
  { id: 6, name: 'Running Shoes', price: 149.99, category: 'fashion', categoryId: 'fashion', image: '👟', rating: 4.7, reviews: 156, inStock: true },
  { id: 7, name: 'Coffee Maker', price: 89.99, category: 'home', categoryId: 'home', image: '☕', rating: 4.2, reviews: 34, inStock: true },
  { id: 8, name: 'Gaming Console', price: 499.99, category: 'gaming', categoryId: 'gaming', image: '🎮', rating: 4.9, reviews: 203, inStock: false },
  { id: 9, name: 'Wireless Mouse', price: 39.99, category: 'electronics', categoryId: 'electronics', image: '🖱️', rating: 4.5, reviews: 92, inStock: true },
  { id: 10, name: 'USB-C Cable', price: 19.99, category: 'electronics', categoryId: 'electronics', image: '🔌', rating: 4.3, reviews: 156, inStock: true },
  { id: 11, name: 'Tablet', price: 349.99, category: 'electronics', categoryId: 'electronics', image: '📱', rating: 4.6, reviews: 78, inStock: true },
  { id: 12, name: 'Webcam HD', price: 69.99, category: 'electronics', categoryId: 'electronics', image: '📹', rating: 4.4, reviews: 134, inStock: true },
  { id: 13, name: 'Mechanical Keyboard', price: 119.99, category: 'electronics', categoryId: 'electronics', image: '⌨️', rating: 4.7, reviews: 201, inStock: true },
  { id: 14, name: 'Jeans', price: 79.99, category: 'fashion', categoryId: 'fashion', image: '👖', rating: 4.5, reviews: 167, inStock: true },
  { id: 15, name: 'Sunglasses', price: 59.99, category: 'fashion', categoryId: 'fashion', image: '🕶️', rating: 4.6, reviews: 89, inStock: true },
  { id: 16, name: 'Backpack', price: 89.99, category: 'fashion', categoryId: 'fashion', image: '🎒', rating: 4.4, reviews: 112, inStock: true },
  { id: 17, name: 'Leather Jacket', price: 249.99, category: 'fashion', categoryId: 'fashion', image: '🧥', rating: 4.8, reviews: 45, inStock: true },
  { id: 18, name: 'Dress Shirt', price: 64.99, category: 'fashion', categoryId: 'fashion', image: '👔', rating: 4.3, reviews: 78, inStock: true },
  { id: 19, name: 'Winter Boots', price: 179.99, category: 'fashion', categoryId: 'fashion', image: '🥾', rating: 4.6, reviews: 93, inStock: true },
  { id: 20, name: 'Baseball Cap', price: 24.99, category: 'fashion', categoryId: 'fashion', image: '🧢', rating: 4.2, reviews: 201, inStock: true },
  { id: 21, name: 'Air Purifier', price: 159.99, category: 'home', categoryId: 'home', image: '💨', rating: 4.5, reviews: 67, inStock: true },
  { id: 22, name: 'Desk Lamp', price: 34.99, category: 'home', categoryId: 'home', image: '💡', rating: 4.4, reviews: 145, inStock: true },
  { id: 23, name: 'Throw Pillow', price: 29.99, category: 'home', categoryId: 'home', image: '🛋️', rating: 4.3, reviews: 89, inStock: true },
  { id: 24, name: 'Plant Pot', price: 19.99, category: 'home', categoryId: 'home', image: '🪴', rating: 4.6, reviews: 123, inStock: true },
  { id: 25, name: 'Vacuum Cleaner', price: 199.99, category: 'home', categoryId: 'home', image: '🧹', rating: 4.7, reviews: 156, inStock: true },
  { id: 26, name: 'Wall Clock', price: 44.99, category: 'home', categoryId: 'home', image: '🕐', rating: 4.2, reviews: 67, inStock: true },
  { id: 27, name: 'Gaming Mouse', price: 79.99, category: 'gaming', categoryId: 'gaming', image: '🖱️', rating: 4.8, reviews: 234, inStock: true },
  { id: 28, name: 'Gaming Headset', price: 149.99, category: 'gaming', categoryId: 'gaming', image: '🎧', rating: 4.7, reviews: 189, inStock: true },
  { id: 29, name: 'Gaming Chair', price: 299.99, category: 'gaming', categoryId: 'gaming', image: '🪑', rating: 4.6, reviews: 98, inStock: true },
  { id: 30, name: 'Gaming Keyboard', price: 129.99, category: 'gaming', categoryId: 'gaming', image: '⌨️', rating: 4.9, reviews: 267, inStock: true },
];

const buildCategoryList = (combinedProducts: DisplayProduct[], apiCategories: ApiCategory[]) => {
  const map = new Map<string, { id: string; name: string; count: number }>();

  STATIC_CATEGORIES.forEach((cat) => {
    map.set(cat.id, { ...cat, count: 0 });
  });

  apiCategories.forEach((cat) => {
    const slug = slugifyCategory(cat.categoryName);
    const existing = map.get(slug);
    if (existing) {
      existing.name = cat.categoryName;
    } else {
      map.set(slug, { id: slug, name: cat.categoryName, count: 0 });
    }
  });

  combinedProducts.forEach((product) => {
    const slug = typeof product.category === 'string' ? product.category : slugifyCategory(String(product.category));
    const entry = map.get(slug);
    if (entry) {
      entry.count += 1;
    } else {
      map.set(slug, {
        id: slug,
        name: slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()),
        count: 1,
      });
    }
  });

  return [
    { id: 'all', name: 'All Products', count: combinedProducts.length },
    ...Array.from(map.values()),
  ];
};

const priceRanges = [
  { label: 'Under ₵50', min: 0, max: 50 },
  { label: '₵50 - ₵100', min: 50, max: 100 },
  { label: '₵100 - ₵200', min: 100, max: 200 },
  { label: '₵200 - ₵500', min: 200, max: 500 },
  { label: 'Over ₵500', min: 500, max: Infinity },
];

export default function ProductsPage() {
  const { addToCart, getCartCount } = useCart();
  const [products, setProducts] = useState<DisplayProduct[]>(STATIC_PRODUCTS);
  const [categories, setCategories] = useState<Array<{ id: string; name: string; count: number }>>(() =>
    buildCategoryList(STATIC_PRODUCTS, [])
  );
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedToCart, setAddedToCart] = useState<string | number | null>(null);

  // Fetch products and categories from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories'),
        ]);

        const apiProducts: ApiProduct[] = productsRes.ok ? await productsRes.json() : [];
        const apiCategories: ApiCategory[] = categoriesRes.ok ? await categoriesRes.json() : [];

        const displayProducts: DisplayProduct[] = apiProducts.map((p) => ({
          id: p.id,
          name: p.productName,
          price: p.price,
          category: p.category?.categoryName ? slugifyCategory(p.category.categoryName) : 'uncategorized',
          categoryId: p.categoryId,
          image:
            p.productImages?.find((img) => img.isPrimary)?.imageUrl ||
            getProductEmoji(p.productName, p.category?.categoryName),
          rating: 4.5,
          reviews: Math.floor(Math.random() * 200) + 20,
          inStock: p.stockQuantity > 0,
        }));

        const combinedProducts = [...STATIC_PRODUCTS, ...displayProducts];
        setProducts(combinedProducts);
        setCategories(buildCategoryList(combinedProducts, apiCategories));
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setProducts(STATIC_PRODUCTS);
        setCategories(buildCategoryList(STATIC_PRODUCTS, []));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesPrice = true;
    if (selectedPriceRange) {
      const range = priceRanges.find(r => r.label === selectedPriceRange);
      if (range) {
        matchesPrice = product.price >= range.min && product.price <= range.max;
      }
    }
    
    return matchesCategory && matchesSearch && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-8">
                <a href="/" className="text-xl font-bold text-blue-600">CloudStore</a>
                <div className="hidden md:flex space-x-6">
                  <a href="/" className="text-gray-600 hover:text-blue-600">Home</a>
                  <a href="/products" className="text-blue-600 font-medium">Products</a>
                  <a href="/categories" className="text-gray-600 hover:text-blue-600">Categories</a>
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
          <div className="text-center py-20 text-gray-600">Loading products...</div>
        </div>
      </div>
    );
  }

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
                <a href="/products" className="text-blue-600 font-medium">Products</a>
                <a href="/categories" className="text-gray-600 hover:text-blue-600">Categories</a>
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
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
              {/* Search */}
              <div>
                <h3 className="font-semibold mb-3">Search</h3>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Categories */}
              <div>
                <h3 className="font-semibold mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex justify-between">
                        <span>{category.name}</span>
                        <span className="text-sm text-gray-500">({category.count})</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-semibold mb-3">Price Range</h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <button
                      key={range.label}
                      onClick={() => setSelectedPriceRange(selectedPriceRange === range.label ? '' : range.label)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                        selectedPriceRange === range.label
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                <p className="text-gray-600 mt-1">
                  Showing {sortedProducts.length} of {products.length} products
                </p>
              </div>
              
              {/* Sort */}
              <div className="mt-4 sm:mt-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-48 bg-gray-100 flex items-center justify-center text-4xl">
                    {typeof product.image === 'string' &&
                    (product.image.startsWith('http://') ||
                      product.image.startsWith('https://') ||
                      product.image.startsWith('data:')) ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      product.image || '📦'
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                    
                    {/* Rating */}
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}>
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-2">
                        {product.rating} ({product.reviews})
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-blue-600">₵{product.price}</span>
                      <button 
                        onClick={() => {
                          if (product.inStock) {
                            addToCart({
                              id: product.id,
                              name: product.name,
                              price: product.price,
                              image: product.image,
                              inStock: product.inStock,
                            });
                            setAddedToCart(product.id);
                            setTimeout(() => setAddedToCart(null), 2000);
                          }
                        }}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          product.inStock
                            ? addedToCart === product.id
                              ? 'bg-green-600 text-white'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={!product.inStock}
                      >
                        {addedToCart === product.id ? 'Added! ✓' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No Results */}
            {sortedProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}





