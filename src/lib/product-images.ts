// Product image mappings - using Unsplash for free high-quality images
export const PRODUCT_IMAGES: Record<string, string> = {
  'Wireless Headphones': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
  'Smart Watch': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
  'Laptop Stand': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop',
  'Bluetooth Speaker': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop',
  'Designer T-Shirt': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
  'Running Shoes': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
  'Coffee Maker': 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=500&h=500&fit=crop',
  'Gaming Console': 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&h=500&fit=crop',
  'Wireless Mouse': 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=500&fit=crop',
  // Reuse the known-working mouse image for Power Bank to guarantee it displays
  'Power Bank': 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=500&fit=crop',
  'Tablet': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop',
  'Monitor': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=500&fit=crop',
  'Mechanical Keyboard': 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&h=500&fit=crop',
  'Jeans': 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop',
  'Sunglasses': 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop',
  'Backpack': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop',
  'Leather Jacket': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop',
  'Hoodie': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop',
  'Sneakers': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
  'Baseball Cap': 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&h=500&fit=crop',
  'Air Purifier': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&h=500&fit=crop',
  'Desk Lamp': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&h=500&fit=crop',
  'Area Rug': 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=500&h=500&fit=crop',
  'Plant Pot': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&h=500&fit=crop',
  'Vacuum Cleaner': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop', // TODO: Replace with your custom vacuum cleaner image URL
  'Wall Clock': 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=500&h=500&fit=crop',
  'Gaming Mouse': 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=500&fit=crop',
  'Gaming Headset': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
  'Gaming Chair': 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500&h=500&fit=crop',
  'Gaming Keyboard': 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&h=500&fit=crop',
};

export function getProductImage(productName: string): string {
  return PRODUCT_IMAGES[productName] || `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=500&fit=crop`;
}

