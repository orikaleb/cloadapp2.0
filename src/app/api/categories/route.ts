import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

// Fallback static categories so the app works even if Firestore is not configured
const STATIC_CATEGORIES = [
  {
    id: 'electronics',
    categoryName: 'Electronics',
    description: 'Electronic devices and accessories including headphones, watches, tablets, and more',
  },
  {
    id: 'fashion',
    categoryName: 'Fashion',
    description: 'Clothing, shoes, and fashion accessories for all styles',
  },
  {
    id: 'home',
    categoryName: 'Home & Garden',
    description: 'Home improvement, furniture, and garden essentials',
  },
  {
    id: 'gaming',
    categoryName: 'Gaming',
    description: 'Gaming consoles, accessories, and equipment for gamers',
  },
];

export async function GET() {
  try {
    // If Firestore is not initialized, immediately return static categories
    if (!db) {
      return NextResponse.json(STATIC_CATEGORIES);
    }

    // Try to fetch categories from Firestore
    const categoriesRef = db.collection('categories');
    const snapshot = await categoriesRef.get();
    
    if (snapshot.empty) {
      // If no categories in Firestore, fall back to static ones
      return NextResponse.json(STATIC_CATEGORIES);
    }

    const categories = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(categories);
  } catch (error: unknown) {
    // On any error, log and fall back to static categories instead of 500
    console.error('Failed to fetch categories, using static fallback:', error);
    return NextResponse.json(STATIC_CATEGORIES);
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Add timestamps
    const categoryData = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Create category in Firestore
    const docRef = await db.collection('categories').add(categoryData);
    
    // Fetch the created category
    const createdCategory = await db.collection('categories').doc(docRef.id).get();
    
    return NextResponse.json({
      id: docRef.id,
      ...createdCategory.data(),
    }, { status: 201 });
  } catch (error: unknown) {
    console.error('Failed to create category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
