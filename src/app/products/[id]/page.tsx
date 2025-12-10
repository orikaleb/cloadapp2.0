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

// Legacy mock data for backward compatibility (will be removed once all products are in DB)
const getProduct = (id: string) => {
  const products: Record<string, any> = {
    '1': {
      id: 1,
      name: 'Wireless Headphones',
      price: 199.99,
      originalPrice: 249.99,
      category: 'Electronics',
      brand: 'AudioTech',
      rating: 4.5,
      reviews: 128,
      inStock: true,
      stockCount: 15,
      description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound quality. Perfect for music lovers and professionals.',
      features: [
        'Active Noise Cancellation',
        '30-hour battery life',
        'Quick charge (5 min = 3 hours)',
        'Bluetooth 5.0 connectivity',
        'Premium sound quality',
        'Comfortable over-ear design'
      ],
      specifications: {
        'Battery Life': '30 hours',
        'Charging Time': '2 hours',
        'Connectivity': 'Bluetooth 5.0',
        'Weight': '250g',
        'Frequency Response': '20Hz - 20kHz',
        'Impedance': '32 ohms'
      },
      images: ['🎧', '🎧', '🎧', '🎧'],
      relatedProducts: [
        { id: 2, name: 'Smart Watch', price: 299.99, image: '⌚' },
        { id: 4, name: 'Bluetooth Speaker', price: 129.99, image: '🔊' },
        { id: 3, name: 'Laptop Stand', price: 79.99, image: '💻' },
      ]
    },
    '2': {
      id: 2,
      name: 'Smart Watch',
      price: 299.99,
      category: 'Electronics',
      brand: 'TechWear',
      rating: 4.8,
      reviews: 89,
      inStock: true,
      stockCount: 22,
      description: 'Advanced smartwatch with fitness tracking, heart rate monitoring, and smartphone connectivity. Stay connected and healthy on the go.',
      features: [
        'Fitness tracking',
        'Heart rate monitor',
        'Water resistant',
        '7-day battery life',
        'Smartphone notifications',
        'GPS tracking'
      ],
      specifications: {
        'Display': '1.4" AMOLED',
        'Battery Life': '7 days',
        'Water Resistance': '5 ATM',
        'Connectivity': 'Bluetooth 5.0, WiFi',
        'Weight': '45g',
        'Compatibility': 'iOS & Android'
      },
      images: ['⌚', '⌚', '⌚', '⌚'],
      relatedProducts: [
        { id: 1, name: 'Wireless Headphones', price: 199.99, image: '🎧' },
        { id: 11, name: 'Tablet', price: 349.99, image: '📱' },
        { id: 9, name: 'Wireless Mouse', price: 39.99, image: '🖱️' },
      ]
    },
    '3': {
      id: 3,
      name: 'Laptop Stand',
      price: 79.99,
      category: 'Electronics',
      brand: 'ErgoDesk',
      rating: 4.3,
      reviews: 45,
      inStock: true,
      stockCount: 30,
      description: 'Ergonomic aluminum laptop stand that improves posture and airflow. Adjustable height for perfect viewing angle.',
      features: [
        'Adjustable height',
        'Aluminum construction',
        'Improved airflow',
        'Portable design',
        'Fits all laptop sizes',
        'Ergonomic benefits'
      ],
      specifications: {
        'Material': 'Aluminum',
        'Weight': '1.2kg',
        'Height Range': '10-20cm',
        'Max Load': '10kg',
        'Compatibility': 'All laptops',
        'Color': 'Silver'
      },
      images: ['💻', '💻', '💻', '💻'],
      relatedProducts: [
        { id: 13, name: 'Mechanical Keyboard', price: 119.99, image: '⌨️' },
        { id: 9, name: 'Wireless Mouse', price: 39.99, image: '🖱️' },
        { id: 22, name: 'Desk Lamp', price: 34.99, image: '💡' },
      ]
    },
    '4': {
      id: 4,
      name: 'Bluetooth Speaker',
      price: 129.99,
      category: 'Electronics',
      brand: 'SoundWave',
      rating: 4.6,
      reviews: 67,
      inStock: true,
      stockCount: 18,
      description: 'Portable Bluetooth speaker with 360-degree sound, waterproof design, and 20-hour battery life. Perfect for outdoor adventures.',
      features: [
        '360-degree sound',
        'Waterproof IPX7',
        '20-hour battery',
        'Bluetooth 5.0',
        'Built-in microphone',
        'Compact design'
      ],
      specifications: {
        'Battery Life': '20 hours',
        'Water Resistance': 'IPX7',
        'Connectivity': 'Bluetooth 5.0',
        'Weight': '600g',
        'Dimensions': '18x7x7cm',
        'Power': '20W'
      },
      images: ['🔊', '🔊', '🔊', '🔊'],
      relatedProducts: [
        { id: 1, name: 'Wireless Headphones', price: 199.99, image: '🎧' },
        { id: 28, name: 'Gaming Headset', price: 149.99, image: '🎧' },
        { id: 10, name: 'USB-C Cable', price: 19.99, image: '🔌' },
      ]
    },
    '6': {
      id: 6,
      name: 'Running Shoes',
      price: 149.99,
      category: 'Fashion',
      brand: 'SportMax',
      rating: 4.7,
      reviews: 156,
      inStock: true,
      stockCount: 25,
      description: 'Premium running shoes with advanced cushioning technology, breathable mesh upper, and durable rubber outsole. Perfect for daily runs.',
      features: [
        'Advanced cushioning',
        'Breathable mesh',
        'Lightweight design',
        'Durable outsole',
        'Multiple color options',
        'Comfortable fit'
      ],
      specifications: {
        'Weight': '280g',
        'Drop': '8mm',
        'Cushioning': 'High',
        'Upper Material': 'Mesh',
        'Outsole': 'Rubber',
        'Sizes': '6-13'
      },
      images: ['👟', '👟', '👟', '👟'],
      relatedProducts: [
        { id: 5, name: 'Designer T-Shirt', price: 49.99, image: '👕' },
        { id: 19, name: 'Winter Boots', price: 179.99, image: '🥾' },
        { id: 16, name: 'Backpack', price: 89.99, image: '🎒' },
      ]
    },
    '8': {
      id: 8,
      name: 'Gaming Console',
      price: 499.99,
      category: 'Gaming',
      brand: 'GamePro',
      rating: 4.9,
      reviews: 203,
      inStock: false,
      stockCount: 0,
      description: 'Next-generation gaming console with 4K gaming, ray tracing, and ultra-fast SSD. Experience gaming like never before.',
      features: [
        '4K gaming',
        'Ray tracing',
        'Ultra-fast SSD',
        'Backward compatible',
        '8K video output',
        'Advanced cooling'
      ],
      specifications: {
        'CPU': 'Custom 8-core',
        'GPU': 'Custom RDNA 2',
        'Memory': '16GB GDDR6',
        'Storage': '1TB SSD',
        'Video Output': '8K',
        'Connectivity': 'WiFi 6, Bluetooth 5.1'
      },
      images: ['🎮', '🎮', '🎮', '🎮'],
      relatedProducts: [
        { id: 27, name: 'Gaming Mouse', price: 79.99, image: '🖱️' },
        { id: 30, name: 'Gaming Keyboard', price: 129.99, image: '⌨️' },
        { id: 29, name: 'Gaming Chair', price: 299.99, image: '🪑' },
      ]
    },
    '9': {
      id: 9,
      name: 'Wireless Mouse',
      price: 39.99,
      category: 'Electronics',
      brand: 'ClickTech',
      rating: 4.5,
      reviews: 92,
      inStock: true,
      stockCount: 50,
      description: 'Ergonomic wireless mouse with precision tracking, long battery life, and comfortable design. Perfect for work and gaming.',
      features: [
        'Wireless connectivity',
        'Precision tracking',
        'Long battery life',
        'Ergonomic design',
        'Multi-device support',
        'Silent clicks'
      ],
      specifications: {
        'Connectivity': '2.4GHz wireless',
        'Battery Life': '12 months',
        'DPI': '1600',
        'Buttons': '3',
        'Weight': '85g',
        'Compatibility': 'Windows, Mac, Linux'
      },
      images: ['🖱️', '🖱️', '🖱️', '🖱️'],
      relatedProducts: [
        { id: 13, name: 'Mechanical Keyboard', price: 119.99, image: '⌨️' },
        { id: 3, name: 'Laptop Stand', price: 79.99, image: '💻' },
        { id: 10, name: 'USB-C Cable', price: 19.99, image: '🔌' },
      ]
    },
    '13': {
      id: 13,
      name: 'Mechanical Keyboard',
      price: 119.99,
      category: 'Electronics',
      brand: 'KeyMaster',
      rating: 4.7,
      reviews: 201,
      inStock: true,
      stockCount: 35,
      description: 'Premium mechanical keyboard with RGB backlighting, tactile switches, and durable construction. Ideal for typing and gaming.',
      features: [
        'Mechanical switches',
        'RGB backlighting',
        'Durable construction',
        'Anti-ghosting',
        'Programmable keys',
        'USB-C connectivity'
      ],
      specifications: {
        'Switch Type': 'Mechanical',
        'Key Layout': 'Full-size',
        'Backlighting': 'RGB',
        'Connectivity': 'USB-C',
        'Weight': '1.2kg',
        'Dimensions': '44x13x4cm'
      },
      images: ['⌨️', '⌨️', '⌨️', '⌨️'],
      relatedProducts: [
        { id: 9, name: 'Wireless Mouse', price: 39.99, image: '🖱️' },
        { id: 3, name: 'Laptop Stand', price: 79.99, image: '💻' },
        { id: 12, name: 'Webcam HD', price: 69.99, image: '📹' },
      ]
    },
    '14': {
      id: 14,
      name: 'Jeans',
      price: 79.99,
      category: 'Fashion',
      brand: 'DenimCo',
      rating: 4.5,
      reviews: 167,
      inStock: true,
      stockCount: 40,
      description: 'Classic fit jeans made from premium denim. Comfortable, durable, and stylish. Available in multiple washes and sizes.',
      features: [
        'Premium denim',
        'Classic fit',
        'Multiple washes',
        'Durable construction',
        'Comfortable wear',
        'Timeless style'
      ],
      specifications: {
        'Material': '98% Cotton, 2% Elastane',
        'Fit': 'Classic',
        'Rise': 'Mid-rise',
        'Leg Opening': 'Straight',
        'Sizes': '28-40',
        'Care': 'Machine wash'
      },
      images: ['👖', '👖', '👖', '👖'],
      relatedProducts: [
        { id: 5, name: 'Designer T-Shirt', price: 49.99, image: '👕' },
        { id: 18, name: 'Dress Shirt', price: 64.99, image: '👔' },
        { id: 17, name: 'Leather Jacket', price: 249.99, image: '🧥' },
      ]
    },
    '27': {
      id: 27,
      name: 'Gaming Mouse',
      price: 79.99,
      category: 'Gaming',
      brand: 'GameTech',
      rating: 4.8,
      reviews: 234,
      inStock: true,
      stockCount: 28,
      description: 'High-performance gaming mouse with adjustable DPI, customizable RGB lighting, and ergonomic design. Built for competitive gaming.',
      features: [
        'Adjustable DPI',
        'RGB lighting',
        'Ergonomic design',
        'Programmable buttons',
        'Precision sensor',
        'Gaming software'
      ],
      specifications: {
        'DPI Range': '200-12000',
        'Sensor': 'Optical',
        'Buttons': '6 programmable',
        'Connectivity': 'Wired USB',
        'Weight': '95g',
        'Polling Rate': '1000Hz'
      },
      images: ['🖱️', '🖱️', '🖱️', '🖱️'],
      relatedProducts: [
        { id: 30, name: 'Gaming Keyboard', price: 129.99, image: '⌨️' },
        { id: 28, name: 'Gaming Headset', price: 149.99, image: '🎧' },
        { id: 8, name: 'Gaming Console', price: 499.99, image: '🎮' },
      ]
    },
    '30': {
      id: 30,
      name: 'Gaming Keyboard',
      price: 129.99,
      category: 'Gaming',
      brand: 'GameTech',
      rating: 4.9,
      reviews: 267,
      inStock: true,
      stockCount: 32,
      description: 'Professional gaming keyboard with mechanical switches, per-key RGB lighting, and anti-ghosting technology. Dominate the competition.',
      features: [
        'Mechanical switches',
        'Per-key RGB',
        'Anti-ghosting',
        'Macro support',
        'Durable build',
        'Gaming software'
      ],
      specifications: {
        'Switch Type': 'Mechanical',
        'Key Layout': 'Full-size',
        'Backlighting': 'Per-key RGB',
        'Connectivity': 'USB-C',
        'Weight': '1.3kg',
        'Response Time': '1ms'
      },
      images: ['⌨️', '⌨️', '⌨️', '⌨️'],
      relatedProducts: [
        { id: 27, name: 'Gaming Mouse', price: 79.99, image: '🖱️' },
        { id: 28, name: 'Gaming Headset', price: 149.99, image: '🎧' },
        { id: 29, name: 'Gaming Chair', price: 299.99, image: '🪑' },
      ]
    }
  };
  return products[id] || null;
};

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { addToCart, getCartCount } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState('description');
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${params.id}`);
        if (!res.ok) {
          if (res.status === 404) {
            // Try legacy mock data as fallback
            const mockProduct = getProduct(params.id);
            if (mockProduct) {
              setProduct(mockProduct);
              setLoading(false);
              return;
            }
          }
          throw new Error('Product not found');
        }
        const apiProduct: ApiProduct = await res.json();
        
        // Map API product to display format
        const primaryImage = apiProduct.productImages?.find(img => img.isPrimary)?.imageUrl || 
                            getProductEmoji(apiProduct.productName, apiProduct.category?.categoryName);
        const allImages = apiProduct.productImages?.length 
          ? apiProduct.productImages.map(img => img.imageUrl)
          : [primaryImage, primaryImage, primaryImage, primaryImage]; // Repeat if only one image
        
        const displayProduct = {
          id: apiProduct.id,
          name: apiProduct.productName,
          price: apiProduct.price,
          originalPrice: null, // Can be added to database later
          category: apiProduct.category?.categoryName || 'Uncategorized',
          brand: apiProduct.brand || 'CloudStore',
          rating: 4.5, // Default rating (can be added to database later)
          reviews: Math.floor(Math.random() * 200) + 20, // Default reviews (can be added to database later)
          inStock: apiProduct.stockQuantity > 0,
          stockCount: apiProduct.stockQuantity,
          description: apiProduct.description || 'No description available.',
          features: apiProduct.description 
            ? apiProduct.description.split('.').filter(f => f.trim()).slice(0, 6).map(f => f.trim())
            : ['Quality product', 'Great value', 'Customer favorite'],
          specifications: {
            'SKU': apiProduct.sku,
            'Category': apiProduct.category?.categoryName || 'Uncategorized',
            'Stock': `${apiProduct.stockQuantity} available`,
          },
          images: allImages,
          relatedProducts: [], // Can be fetched separately if needed
        };
        
        setProduct(displayProduct);
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-600">Loading product...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <a href="/products" className="text-blue-600 hover:text-blue-700">← Back to Products</a>
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
                <a href="/products" className="text-gray-600 hover:text-blue-600">Products</a>
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
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <a href="/" className="hover:text-blue-600">Home</a>
            <span>›</span>
            <a href="/products" className="hover:text-blue-600">Products</a>
            <span>›</span>
            <span className="text-gray-900">{product.name}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-6xl">
              {product.images[selectedImage]}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-2xl ${
                    selectedImage === index ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  {image}
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <span className="text-sm text-gray-600">{product.brand}</span>
              <h1 className="text-3xl font-bold text-gray-900 mt-1">{product.name}</h1>
            </div>

            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}>
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-2">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-blue-600">₵{product.price}</span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-500 line-through">₵{product.originalPrice}</span>
                )}
                {product.originalPrice && (
                  <span className="bg-red-100 text-red-800 text-sm px-2 py-1 rounded">
                    Save ₵{(product.originalPrice - product.price).toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.inStock ? (
                <div className="flex items-center text-green-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <span>In Stock ({product.stockCount} available)</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  <span>Out of Stock</span>
                </div>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            <div className="mb-8">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => {
                    if (product.inStock) {
                      // Add the product with the selected quantity
                      const productToAdd = {
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.images[0] || '📦',
                        inStock: product.inStock,
                      };
                      // Add quantity times
                      for (let i = 0; i < quantity; i++) {
                        addToCart(productToAdd);
                      }
                      setAddedToCart(true);
                      setTimeout(() => setAddedToCart(false), 2000);
                    }
                  }}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
                    product.inStock
                      ? addedToCart
                        ? 'bg-green-600 text-white'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={!product.inStock}
                >
                  {addedToCart ? 'Added to Cart! ✓' : product.inStock ? `Add to Cart (${quantity})` : 'Out of Stock'}
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-3">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {['description', 'specifications', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    selectedTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {selectedTab === 'description' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            {selectedTab === 'specifications' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-200">
                      <span className="font-medium text-gray-900">{key}</span>
                      <span className="text-gray-600">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === 'reviews' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Reviews</h3>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">John D.</span>
                      <div className="flex text-yellow-400">★★★★★</div>
                    </div>
                    <p className="text-gray-600">Excellent sound quality and very comfortable to wear for long periods.</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Sarah M.</span>
                      <div className="flex text-yellow-400">★★★★☆</div>
                    </div>
                    <p className="text-gray-600">Great headphones, battery life is amazing. Only minor issue is the case could be more compact.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {product.relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-48 bg-gray-100 flex items-center justify-center text-4xl">
                  {relatedProduct.image}
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{relatedProduct.name}</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-blue-600">₵{relatedProduct.price}</span>
                    <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}





