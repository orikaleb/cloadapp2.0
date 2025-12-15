import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const { uid, email, firstName, lastName, photoURL } = await request.json();

    // Validate input
    if (!uid || !email) {
      return NextResponse.json(
        { error: 'UID and email are required' },
        { status: 400 }
      );
    }

    const fullName = `${firstName || ''} ${lastName || ''}`.trim() || email.split('@')[0];

    // Check if user already exists in Firestore
    const customersRef = db.collection('customers');
    const existingUserQuery = await customersRef.where('firebaseUID', '==', uid).limit(1).get();

    let customerId: string;
    let customerData: any;

    if (!existingUserQuery.empty) {
      // User exists, update their data
      const existingDoc = existingUserQuery.docs[0];
      customerId = existingDoc.id;
      
      await existingDoc.ref.update({
        name: fullName,
        email: email,
        photoURL: photoURL || null,
        updatedAt: new Date(),
      });

      customerData = {
        id: customerId,
        ...existingDoc.data(),
        name: fullName,
        email: email,
        photoURL: photoURL || null,
      };
    } else {
      // Create new user in Firestore
      const newCustomerData = {
        name: fullName,
        email: email,
        phone: null,
        address: null,
        isActive: true,
        firebaseUID: uid,
        photoURL: photoURL || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await customersRef.add(newCustomerData);
      customerId = docRef.id;
      
      customerData = {
        id: customerId,
        ...newCustomerData,
      };
    }

    // Return user data
    return NextResponse.json({
      id: customerId,
      email: email,
      name: fullName,
      phone: customerData.phone || null,
      address: customerData.address || null,
      photoURL: customerData.photoURL || null,
    }, { status: 200 });

  } catch (error: unknown) {
    console.error('Google sign-in API error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          error: error.message || 'An error occurred during Google sign-in. Please try again.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'An error occurred during Google sign-in. Please try again.' },
      { status: 500 }
    );
  }
}

