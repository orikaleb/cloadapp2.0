'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/lib/cart-context';
import Navigation from '@/components/Navigation';
import Toast from '@/components/Toast';
import { getProductImage } from '@/lib/product-images';

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

// Static products data - matches STATIC_PRODUCTS from products page
const STATIC_PRODUCTS_DATA: Record<string, any> = {
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
      images: [getProductImage('Wireless Headphones'), getProductImage('Wireless Headphones'), getProductImage('Wireless Headphones'), getProductImage('Wireless Headphones')],
      relatedProducts: [
        { id: 2, name: 'Smart Watch', price: 299.99, image: getProductImage('Smart Watch') },
        { id: 4, name: 'Bluetooth Speaker', price: 129.99, image: getProductImage('Bluetooth Speaker') },
        { id: 3, name: 'Laptop Stand', price: 79.99, image: getProductImage('Laptop Stand') },
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
      images: [getProductImage('Smart Watch'), getProductImage('Smart Watch'), getProductImage('Smart Watch'), getProductImage('Smart Watch')],
      relatedProducts: [
        { id: 1, name: 'Wireless Headphones', price: 199.99, image: getProductImage('Wireless Headphones') },
        { id: 11, name: 'Tablet', price: 349.99, image: getProductImage('Tablet') },
        { id: 9, name: 'Wireless Mouse', price: 39.99, image: getProductImage('Wireless Mouse') },
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
      images: [getProductImage('Laptop Stand'), getProductImage('Laptop Stand'), getProductImage('Laptop Stand'), getProductImage('Laptop Stand')],
      relatedProducts: [
        { id: 13, name: 'Mechanical Keyboard', price: 119.99, image: getProductImage('Mechanical Keyboard') },
        { id: 9, name: 'Wireless Mouse', price: 39.99, image: getProductImage('Wireless Mouse') },
        { id: 22, name: 'Desk Lamp', price: 34.99, image: getProductImage('Desk Lamp') },
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
      images: [getProductImage('Bluetooth Speaker'), getProductImage('Bluetooth Speaker'), getProductImage('Bluetooth Speaker'), getProductImage('Bluetooth Speaker')],
      relatedProducts: [
        { id: 1, name: 'Wireless Headphones', price: 199.99, image: getProductImage('Wireless Headphones') },
        { id: 28, name: 'Gaming Headset', price: 149.99, image: getProductImage('Gaming Headset') },
        { id: 10, name: 'Power Bank', price: 39.99, image: getProductImage('Power Bank') },
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
      images: [getProductImage('Running Shoes'), getProductImage('Running Shoes'), getProductImage('Running Shoes'), getProductImage('Running Shoes')],
      relatedProducts: [
        { id: 5, name: 'Designer T-Shirt', price: 49.99, image: getProductImage('Designer T-Shirt') },
        { id: 19, name: 'Sneakers', price: 129.99, image: getProductImage('Sneakers') },
        { id: 16, name: 'Backpack', price: 89.99, image: getProductImage('Backpack') },
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
      images: [getProductImage('Gaming Console'), getProductImage('Gaming Console'), getProductImage('Gaming Console'), getProductImage('Gaming Console')],
      relatedProducts: [
        { id: 27, name: 'Gaming Mouse', price: 79.99, image: getProductImage('Gaming Mouse') },
        { id: 30, name: 'Gaming Keyboard', price: 129.99, image: getProductImage('Gaming Keyboard') },
        { id: 29, name: 'Gaming Chair', price: 299.99, image: getProductImage('Gaming Chair') },
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
      images: [getProductImage('Wireless Mouse'), getProductImage('Wireless Mouse'), getProductImage('Wireless Mouse'), getProductImage('Wireless Mouse')],
      relatedProducts: [
        { id: 13, name: 'Mechanical Keyboard', price: 119.99, image: getProductImage('Mechanical Keyboard') },
        { id: 3, name: 'Laptop Stand', price: 79.99, image: getProductImage('Laptop Stand') },
        { id: 10, name: 'Power Bank', price: 39.99, image: getProductImage('Power Bank') },
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
      images: [getProductImage('Mechanical Keyboard'), getProductImage('Mechanical Keyboard'), getProductImage('Mechanical Keyboard'), getProductImage('Mechanical Keyboard')],
      relatedProducts: [
        { id: 9, name: 'Wireless Mouse', price: 39.99, image: getProductImage('Wireless Mouse') },
        { id: 3, name: 'Laptop Stand', price: 79.99, image: getProductImage('Laptop Stand') },
        { id: 12, name: 'Monitor', price: 249.99, image: getProductImage('Monitor') },
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
      images: [getProductImage('Jeans'), getProductImage('Jeans'), getProductImage('Jeans'), getProductImage('Jeans')],
      relatedProducts: [
        { id: 5, name: 'Designer T-Shirt', price: 49.99, image: getProductImage('Designer T-Shirt') },
        { id: 18, name: 'Hoodie', price: 79.99, image: getProductImage('Hoodie') },
        { id: 17, name: 'Leather Jacket', price: 249.99, image: getProductImage('Leather Jacket') },
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
      images: [getProductImage('Wireless Mouse'), getProductImage('Wireless Mouse'), getProductImage('Wireless Mouse'), getProductImage('Wireless Mouse')],
      relatedProducts: [
        { id: 30, name: 'Gaming Keyboard', price: 129.99, image: getProductImage('Gaming Keyboard') },
        { id: 28, name: 'Gaming Headset', price: 149.99, image: getProductImage('Gaming Headset') },
        { id: 8, name: 'Gaming Console', price: 499.99, image: getProductImage('Gaming Console') },
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
      images: [getProductImage('Mechanical Keyboard'), getProductImage('Mechanical Keyboard'), getProductImage('Mechanical Keyboard'), getProductImage('Mechanical Keyboard')],
      relatedProducts: [
        { id: 27, name: 'Gaming Mouse', price: 79.99, image: getProductImage('Gaming Mouse') },
        { id: 28, name: 'Gaming Headset', price: 149.99, image: getProductImage('Gaming Headset') },
        { id: 29, name: 'Gaming Chair', price: 299.99, image: getProductImage('Gaming Chair') },
      ]
    }
  };

// Function to get product from static data
const getProduct = (id: string | number): any => {
  const idStr = String(id);
  const products = STATIC_PRODUCTS_DATA;
  
  // If product not found in detailed data, generate from static product list
  const staticProductsList = [
    { id: 1, name: 'Wireless Headphones', price: 199.99, category: 'Electronics', brand: 'AudioTech', image: getProductImage('Wireless Headphones'), inStock: true, stockCount: 15 },
    { id: 2, name: 'Smart Watch', price: 299.99, category: 'Electronics', brand: 'TechWear', image: getProductImage('Smart Watch'), inStock: true, stockCount: 22 },
    { id: 3, name: 'Laptop Stand', price: 79.99, category: 'Electronics', brand: 'ErgoDesk', image: getProductImage('Laptop Stand'), inStock: true, stockCount: 30 },
    { id: 4, name: 'Bluetooth Speaker', price: 129.99, category: 'Electronics', brand: 'SoundWave', image: getProductImage('Bluetooth Speaker'), inStock: true, stockCount: 18 },
    { id: 5, name: 'Designer T-Shirt', price: 49.99, category: 'Fashion', brand: 'FashionCo', image: getProductImage('Designer T-Shirt'), inStock: true, stockCount: 50 },
    { id: 6, name: 'Running Shoes', price: 149.99, category: 'Fashion', brand: 'SportMax', image: getProductImage('Running Shoes'), inStock: true, stockCount: 25 },
    { id: 7, name: 'Coffee Maker', price: 89.99, category: 'Home & Garden', brand: 'BrewMaster', image: getProductImage('Coffee Maker'), inStock: true, stockCount: 20 },
    { id: 8, name: 'Gaming Console', price: 499.99, category: 'Gaming', brand: 'GamePro', image: getProductImage('Gaming Console'), inStock: false, stockCount: 0 },
    { id: 9, name: 'Wireless Mouse', price: 39.99, category: 'Electronics', brand: 'ClickTech', image: getProductImage('Wireless Mouse'), inStock: true, stockCount: 50 },
    { id: 10, name: 'Power Bank', price: 39.99, category: 'Electronics', brand: 'PowerTech', image: getProductImage('Power Bank'), inStock: true, stockCount: 75 },
    { id: 11, name: 'Tablet', price: 349.99, category: 'Electronics', brand: 'TechTab', image: getProductImage('Tablet'), inStock: true, stockCount: 15 },
    { id: 12, name: 'Monitor', price: 249.99, category: 'Electronics', brand: 'DisplayPro', image: getProductImage('Monitor'), inStock: true, stockCount: 25 },
    { id: 13, name: 'Mechanical Keyboard', price: 119.99, category: 'Electronics', brand: 'KeyMaster', image: getProductImage('Mechanical Keyboard'), inStock: true, stockCount: 35 },
    { id: 14, name: 'Jeans', price: 79.99, category: 'Fashion', brand: 'DenimCo', image: getProductImage('Jeans'), inStock: true, stockCount: 40 },
    { id: 15, name: 'Sunglasses', price: 59.99, category: 'Fashion', brand: 'SunStyle', image: getProductImage('Sunglasses'), inStock: true, stockCount: 35 },
    { id: 16, name: 'Backpack', price: 89.99, category: 'Fashion', brand: 'PackPro', image: getProductImage('Backpack'), inStock: true, stockCount: 28 },
    { id: 17, name: 'Leather Jacket', price: 249.99, category: 'Fashion', brand: 'LeatherLux', image: getProductImage('Leather Jacket'), inStock: true, stockCount: 12 },
    { id: 18, name: 'Hoodie', price: 79.99, category: 'Fashion', brand: 'ComfortWear', image: getProductImage('Hoodie'), inStock: true, stockCount: 60 },
    { id: 19, name: 'Sneakers', price: 129.99, category: 'Fashion', brand: 'ShoeMax', image: getProductImage('Sneakers'), inStock: true, stockCount: 35 },
    { id: 20, name: 'Baseball Cap', price: 24.99, category: 'Fashion', brand: 'CapStyle', image: getProductImage('Baseball Cap'), inStock: true, stockCount: 60 },
    { id: 21, name: 'Air Purifier', price: 159.99, category: 'Home & Garden', brand: 'AirClean', image: getProductImage('Air Purifier'), inStock: true, stockCount: 18 },
    { id: 22, name: 'Desk Lamp', price: 34.99, category: 'Home & Garden', brand: 'LightPro', image: getProductImage('Desk Lamp'), inStock: true, stockCount: 40 },
    { id: 23, name: 'Area Rug', price: 149.99, category: 'Home & Garden', brand: 'HomeDecor', image: getProductImage('Area Rug'), inStock: true, stockCount: 15 },
    { id: 24, name: 'Plant Pot', price: 19.99, category: 'Home & Garden', brand: 'GardenPro', image: getProductImage('Plant Pot'), inStock: true, stockCount: 75 },
    { id: 25, name: 'Vacuum Cleaner', price: 199.99, category: 'Home & Garden', brand: 'CleanTech', image: getProductImage('Vacuum Cleaner'), inStock: true, stockCount: 15 },
    { id: 26, name: 'Wall Clock', price: 44.99, category: 'Home & Garden', brand: 'TimeStyle', image: getProductImage('Wall Clock'), inStock: true, stockCount: 30 },
    { id: 27, name: 'Gaming Mouse', price: 79.99, category: 'Gaming', brand: 'GameTech', image: getProductImage('Gaming Mouse'), inStock: true, stockCount: 28 },
    { id: 28, name: 'Gaming Headset', price: 149.99, category: 'Gaming', brand: 'GameTech', image: getProductImage('Gaming Headset'), inStock: true, stockCount: 22 },
    { id: 29, name: 'Gaming Chair', price: 299.99, category: 'Gaming', brand: 'GameTech', image: getProductImage('Gaming Chair'), inStock: true, stockCount: 10 },
    { id: 30, name: 'Gaming Keyboard', price: 129.99, category: 'Gaming', brand: 'GameTech', image: getProductImage('Gaming Keyboard'), inStock: true, stockCount: 32 },
  ];
  
  // Check if product exists in detailed data
  if (products[idStr]) {
    return products[idStr];
  }
  
  // Otherwise, generate from static list
  const staticProduct = staticProductsList.find(p => String(p.id) === idStr);
  if (staticProduct) {
    return {
      id: staticProduct.id,
      name: staticProduct.name,
      price: staticProduct.price,
      originalPrice: null,
      category: staticProduct.category,
      brand: staticProduct.brand,
      rating: 4.5,
      reviews: Math.floor(Math.random() * 200) + 20,
      inStock: staticProduct.inStock,
      stockCount: staticProduct.stockCount,
      description: `High-quality ${staticProduct.name.toLowerCase()} from ${staticProduct.brand}. Perfect for your needs with excellent value and customer satisfaction.`,
      features: [
        'Premium quality',
        'Great value',
        'Customer favorite',
        'Durable construction',
        'Satisfaction guaranteed',
        'Popular choice'
      ],
      specifications: {
        'Brand': staticProduct.brand,
        'Category': staticProduct.category,
        'Stock': `${staticProduct.stockCount} available`,
      },
      images: [getProductImage(staticProduct.name), getProductImage(staticProduct.name), getProductImage(staticProduct.name), getProductImage(staticProduct.name)],
      relatedProducts: staticProductsList
        .filter(p => p.category === staticProduct.category && p.id !== staticProduct.id)
        .slice(0, 3)
        .map(p => ({ id: p.id, name: p.name, price: p.price, image: getProductImage(p.name) })),
    };
  }
  
  return null;
};

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { addToCart, getCartCount } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState('description');
  const [addedToCart, setAddedToCart] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; isVisible: boolean }>({
    message: '',
    type: 'info',
    isVisible: false,
  });

  useEffect(() => {
    params.then((resolvedParams) => {
      setProductId(resolvedParams.id);
    });
  }, [params]);

  useEffect(() => {
    if (!productId) return;
    
    const fetchProduct = async () => {
      try {
        // First check if it's a numeric ID (static product)
        const numericId = parseInt(productId, 10);
        if (!isNaN(numericId) && numericId >= 1 && numericId <= 30) {
          // It's a static product, get from mock data
          const mockProduct = getProduct(productId);
          if (mockProduct) {
            setProduct(mockProduct);
            setLoading(false);
            return;
          }
        }
        
        // Otherwise, try to fetch from API
        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) {
          if (res.status === 404) {
            // Try legacy mock data as fallback
            const mockProduct = getProduct(productId);
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
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <div className="text-gray-600">Loading product...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center animate-fade-in">
            <div className="text-6xl mb-4">😕</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <a href="/products" className="text-blue-600 hover:text-blue-700 font-semibold">← Back to Products</a>
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
            <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden border border-gray-200">
              {typeof product.images[selectedImage] === 'string' &&
              (product.images[selectedImage].startsWith('http://') ||
                product.images[selectedImage].startsWith('https://') ||
                product.images[selectedImage].startsWith('data:')) ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-gray-50 to-gray-100">
                  {product.images[selectedImage] || '📦'}
                </div>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {typeof image === 'string' &&
                  (image.startsWith('http://') ||
                    image.startsWith('https://') ||
                    image.startsWith('data:')) ? (
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">
                      {image || '📦'}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
          <div>
              <div className="mb-2">
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">{product.brand}</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="text-sm text-gray-600">
                <span>Category: </span>
                <span className="font-medium text-blue-600">{product.category}</span>
              </div>
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
                  <span className="px-4 py-2 border-x border-gray-300 text-gray-900 font-semibold bg-white">{quantity}</span>
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
                      let allAdded = true;
                      for (let i = 0; i < quantity; i++) {
                        const added = addToCart(productToAdd, true);
                        if (!added) {
                          allAdded = false;
                          break;
                        }
                      }
                      if (allAdded) {
                        setAddedToCart(true);
                        setToast({ message: `${quantity} x ${product.name} added to cart!`, type: 'success', isVisible: true });
                        setTimeout(() => setAddedToCart(false), 2000);
                      } else {
                        setToast({ message: 'Please sign in to add items to cart', type: 'info', isVisible: true });
                      }
                    } else {
                      setToast({ message: 'Product is out of stock', type: 'error', isVisible: true });
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
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Key Features</h3>
              <ul className="space-y-3">
                {product.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-start text-gray-700">
                    <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{feature}</span>
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Description</h3>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">{product.description}</p>
                </div>
              </div>
            )}

            {selectedTab === 'specifications' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Product Specifications</h3>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="divide-y divide-gray-200">
                  {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center py-4 px-6 hover:bg-gray-50 transition-colors">
                        <span className="font-semibold text-gray-900">{key}</span>
                        <span className="text-gray-700 font-medium">{String(value)}</span>
                    </div>
                  ))}
                  </div>
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
            {product.relatedProducts.map((relatedProduct: any) => (
              <div key={relatedProduct.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-48 bg-gray-100 flex items-center justify-center text-4xl overflow-hidden">
                  {typeof relatedProduct.image === 'string' &&
                  (relatedProduct.image.startsWith('http://') ||
                    relatedProduct.image.startsWith('https://') ||
                    relatedProduct.image.startsWith('data:')) ? (
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{relatedProduct.image || '📦'}</span>
                  )}
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





