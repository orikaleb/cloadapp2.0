import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function GET() {
  try {
    // Fetch products from Firestore
    const productsRef = db.collection('products');
    const snapshot = await productsRef.get();
    
    if (snapshot.empty) {
      return NextResponse.json([]);
    }

    // Fetch all products with their related data
    const products = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const productData = doc.data();
        const productId = doc.id;

        // Fetch product images
        const imagesRef = db.collection('product_images').where('productId', '==', productId);
        const imagesSnapshot = await imagesRef.get();
        const productImages = imagesSnapshot.docs.map((imgDoc) => ({
          id: imgDoc.id,
          ...imgDoc.data(),
        }));

        // Fetch category
        let category = null;
        if (productData.categoryId) {
          const categoryDoc = await db.collection('categories').doc(productData.categoryId).get();
          if (categoryDoc.exists) {
            category = {
              id: categoryDoc.id,
              ...categoryDoc.data(),
            };
          }
        }

        return {
          id: productId,
          ...productData,
          productImages,
          category,
        };
      })
    );

    return NextResponse.json(products);
  } catch (error: unknown) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Extract productImages if present
    const { productImages, ...productData } = data;
    
    // Add timestamps
    const productWithTimestamps = {
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Create product in Firestore
    const docRef = await db.collection('products').add(productWithTimestamps);
    
    // If productImages are provided, create them
    if (productImages && Array.isArray(productImages)) {
      const imagePromises = productImages.map((image: any) =>
        db.collection('product_images').add({
          productId: docRef.id,
          imageUrl: image.imageUrl || image,
          isPrimary: image.isPrimary || false,
        })
      );
      await Promise.all(imagePromises);
    }

    // Fetch the created product with images
    const createdProduct = await db.collection('products').doc(docRef.id).get();
    const productData_result = createdProduct.data();
    
    const imagesSnapshot = await db.collection('product_images')
      .where('productId', '==', docRef.id)
      .get();
    const images = imagesSnapshot.docs.map((imgDoc) => ({
      id: imgDoc.id,
      ...imgDoc.data(),
    }));

    return NextResponse.json({
      id: docRef.id,
      ...productData_result,
      productImages: images,
    }, { status: 201 });
  } catch (error: unknown) {
    console.error('Failed to create product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
