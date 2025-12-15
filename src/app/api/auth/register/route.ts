import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, password, phone, address } = await request.json();

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'First name, last name, email, and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Get Firebase API key
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyB6EWuoBJsbnJLpevOkSR0Cml1jbyv5lRg";
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Firebase API key not configured' },
        { status: 500 }
      );
    }

    try {
      // Use Firebase Auth REST API to create user
      const authResponse = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            returnSecureToken: true,
          }),
        }
      );

      const authData = await authResponse.json();

      if (!authResponse.ok) {
        if (authData.error?.message?.includes('EMAIL_EXISTS')) {
          return NextResponse.json(
            { error: 'An account with this email already exists. Please sign in instead.' },
            { status: 409 }
          );
        }
        if (authData.error?.message?.includes('WEAK_PASSWORD')) {
          return NextResponse.json(
            { error: 'Password is too weak. Please use a stronger password.' },
            { status: 400 }
          );
        }
        if (authData.error?.message?.includes('INVALID_EMAIL')) {
          return NextResponse.json(
            { error: 'Invalid email format.' },
            { status: 400 }
          );
        }
        throw new Error(authData.error?.message || 'Registration failed');
      }

      // User created successfully in Firebase Auth
      const firebaseUID = authData.localId;
      const idToken = authData.idToken;

      // Hash password for storage in Firestore (backup)
      const hashedPassword = await bcrypt.hash(password, 8);

      // Create customer document in Firestore using REST API
      const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'claodapp'}/databases/(default)/documents/customers`;
      
      const customerData = {
        fields: {
          name: { stringValue: `${firstName} ${lastName}` },
          email: { stringValue: email },
          hashedPassword: { stringValue: hashedPassword },
          phone: phone ? { stringValue: phone } : { nullValue: null },
          address: address ? { stringValue: address } : { nullValue: null },
          isActive: { booleanValue: true },
          firebaseUID: { stringValue: firebaseUID },
          createdAt: { timestampValue: new Date().toISOString() },
          updatedAt: { timestampValue: new Date().toISOString() },
        },
      };

      // Try to save to Firestore (optional - if it fails, user is still created in Auth)
      try {
        const firestoreResponse = await fetch(firestoreUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
          },
          body: JSON.stringify(customerData),
        });

        if (!firestoreResponse.ok) {
          console.warn('Failed to save customer to Firestore, but user was created in Auth');
        }
      } catch (firestoreError) {
        console.warn('Firestore save error (non-critical):', firestoreError);
      }

      // Return user data (without password)
      return NextResponse.json({
        id: firebaseUID, // Use Firebase UID as ID
        email: email,
        name: `${firstName} ${lastName}`,
        phone: phone || null,
        address: address || null,
        firebaseToken: idToken,
      }, { status: 201 });

    } catch (error: any) {
      console.error('Registration API error:', error);
      throw error;
    }
  } catch (error: unknown) {
    console.error('Registration error:', error);
    
    if (error instanceof Error) {
      // Log the full error for debugging
      console.error('Error details:', {
        message: error.message,
        code: (error as any).code,
        stack: error.stack,
      });

      // Return the actual error message for debugging
      return NextResponse.json(
        { 
          error: error.message || 'An error occurred during registration. Please try again.',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'An error occurred during registration. Please try again.' },
      { status: 500 }
    );
  }
}
