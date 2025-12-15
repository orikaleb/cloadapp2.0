import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function GET() {
  try {
    // Fetch categories from Firestore
    const categoriesRef = db.collection('categories');
    const snapshot = await categoriesRef.get();
    
    if (snapshot.empty) {
      return NextResponse.json([]);
    }

    const categories = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(categories);
  } catch (error: unknown) {
    console.error('Failed to fetch categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
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
