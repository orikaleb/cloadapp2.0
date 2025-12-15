'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/lib/cart-context';
import Navigation from '@/components/Navigation';
import { ProductGridSkeleton } from '@/components/LoadingSkeleton';
import Toast from '@/components/Toast';

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
  if (name.includes('cable') || name.includes('charger') || name.includes('power bank')) return '🔌';
  if (name.includes('tablet') || name.includes('phone')) return '📱';
  if (name.includes('camera') || name.includes('webcam')) return '📹';
  if (name.includes('monitor') || name.includes('screen')) return '🖥️';
  if (name.includes('keyboard')) return '⌨️';
  if (name.includes('jean')) return '👖';
  if (name.includes('sunglass')) return '🕶️';
  if (name.includes('hoodie') || name.includes('sweatshirt')) return '👕';
  if (name.includes('sneaker') || name.includes('sneakers')) return '👟';
  if (name.includes('backpack') || name.includes('bag')) return '🎒';
  if (name.includes('jacket')) return '🧥';
  if (name.includes('shirt') && !name.includes('t-shirt')) return '👔';
  if (name.includes('cap') || name.includes('hat')) return '🧢';
  if (name.includes('purifier') || name.includes('air')) return '💨';
  if (name.includes('lamp') || name.includes('light')) return '💡';
  if (name.includes('pillow')) return '🛋️';
  if (name.includes('plant') || name.includes('pot')) return '🪴';
  if (name.includes('rug') || name.includes('carpet')) return '🪑';
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
  { id: 1, name: 'Wireless Headphones', price: 199.99, category: 'electronics', categoryId: 'electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop', rating: 4.5, reviews: 128, inStock: true },
  { id: 2, name: 'Smart Watch', price: 299.99, category: 'electronics', categoryId: 'electronics', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop', rating: 4.8, reviews: 89, inStock: true },
  { id: 3, name: 'Laptop Stand', price: 79.99, category: 'electronics', categoryId: 'electronics', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop', rating: 4.3, reviews: 45, inStock: true },
  { id: 4, name: 'Bluetooth Speaker', price: 129.99, category: 'electronics', categoryId: 'electronics', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop', rating: 4.6, reviews: 67, inStock: true },
  { id: 5, name: 'Designer T-Shirt', price: 49.99, category: 'fashion', categoryId: 'fashion', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop', rating: 4.4, reviews: 23, inStock: true },
  { id: 6, name: 'Running Shoes', price: 149.99, category: 'fashion', categoryId: 'fashion', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop', rating: 4.7, reviews: 156, inStock: true },
  { id: 7, name: 'Coffee Maker', price: 89.99, category: 'home', categoryId: 'home', image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=500&h=500&fit=crop', rating: 4.2, reviews: 34, inStock: true },
  { id: 8, name: 'Gaming Console', price: 499.99, category: 'gaming', categoryId: 'gaming', image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&h=500&fit=crop', rating: 4.9, reviews: 203, inStock: false },
  { id: 9, name: 'Wireless Mouse', price: 39.99, category: 'electronics', categoryId: 'electronics', image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=500&fit=crop', rating: 4.5, reviews: 92, inStock: true },
  // Use the same known-working image as Wireless Mouse so the Power Bank image always shows
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
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; isVisible: boolean }>({
    message: '',
    type: 'info',
    isVisible: false,
  });

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

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, isVisible: true });
  };

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <ProductGridSkeleton count={12} />
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

      <div className="w-full py-8">
        <div className="flex flex-col lg:flex-row gap-0">
          {/* Sidebar Filters */}
          <div className="lg:w-56 flex-shrink-0 lg:pl-0 lg:pr-4">
            <div className="bg-white rounded-lg shadow-md p-5 space-y-5 sticky top-24 animate-fade-in ml-0">
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
          <div className="flex-1 min-w-0 lg:px-8">
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
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {sortedProducts.map((product, index) => (
                <a 
                  key={product.id} 
                  href={`/products/${product.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 block group animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="h-48 bg-gray-100 flex items-center justify-center text-4xl overflow-hidden">
                    {typeof product.image === 'string' &&
                    (product.image.startsWith('http://') ||
                      product.image.startsWith('https://') ||
                      product.image.startsWith('data:')) ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <span className="group-hover:scale-110 transition-transform duration-300">{product.image || '📦'}</span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{product.name}</h3>
                    
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
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (product.inStock) {
                            const added = addToCart({
                              id: product.id,
                              name: product.name,
                              price: product.price,
                              image: product.image,
                              inStock: product.inStock,
                            }, true);
                            if (added) {
                              setAddedToCart(product.id);
                              showToast(`${product.name} added to cart!`, 'success');
                              setTimeout(() => setAddedToCart(null), 2000);
                            } else {
                              showToast('Please sign in to add items to cart', 'info');
                            }
                          } else {
                            showToast('Product is out of stock', 'error');
                          }
                        }}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-all transform ${
                          product.inStock
                            ? addedToCart === product.id
                              ? 'bg-green-600 text-white scale-105'
                              : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 active:scale-95'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={!product.inStock}
                      >
                        {addedToCart === product.id ? 'Added! ✓' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </button>
                    </div>
                  </div>
                </a>
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





