import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function POST() {
  try {
    // Check if categories already exist
    const categoriesRef = db.collection('categories');
    const snapshot = await categoriesRef.get();
    
    if (!snapshot.empty) {
      const existingCategories = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      return NextResponse.json({ 
        message: 'Categories already exist, no seeding performed.',
        categories: existingCategories 
      }, { status: 200 });
    }

    // Create default categories
    const categories = [
      {
        categoryName: 'Electronics',
        description: 'Electronic devices and accessories including headphones, watches, tablets, and more',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        categoryName: 'Fashion',
        description: 'Clothing, shoes, and fashion accessories for all styles',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        categoryName: 'Home & Garden',
        description: 'Home improvement, furniture, and garden essentials',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        categoryName: 'Gaming',
        description: 'Gaming consoles, accessories, and equipment for gamers',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Add categories to Firestore
    const batch = db.batch();
    categories.forEach((category) => {
      const docRef = categoriesRef.doc();
      batch.set(docRef, category);
    });
    await batch.commit();

    return NextResponse.json({ 
      message: 'Default categories seeded successfully.',
      count: categories.length
    }, { status: 201 });
  } catch (error: unknown) {
    console.error('Error seeding categories:', error);
    return NextResponse.json({ 
      error: 'Failed to seed categories',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
