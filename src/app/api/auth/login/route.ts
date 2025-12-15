import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
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
      // Use Firebase Auth REST API to sign in
      const authResponse = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
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
        if (authData.error?.message?.includes('INVALID_PASSWORD') || 
            authData.error?.message?.includes('EMAIL_NOT_FOUND')) {
          return NextResponse.json(
            { error: 'Invalid email or password. If you do not have an account, please sign up.' },
            { status: 401 }
          );
        }
        if (authData.error?.message?.includes('USER_DISABLED')) {
          return NextResponse.json(
            { error: 'Your account has been deactivated. Please contact support.' },
            { status: 403 }
          );
        }
        throw new Error(authData.error?.message || 'Authentication failed');
      }

      // Get user info from Firebase Auth
      const userInfoResponse = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idToken: authData.idToken,
          }),
        }
      );

      const userInfo = await userInfoResponse.json();
      const user = userInfo.users?.[0];

      // Extract name from displayName or email
      const name = user?.displayName || user?.email?.split('@')[0] || 'User';

      // Return user data
      return NextResponse.json({
        id: authData.localId, // Firebase UID
        email: user?.email || email,
        name: name,
        phone: null, // Can be fetched from Firestore if needed
        address: null, // Can be fetched from Firestore if needed
        firebaseToken: authData.idToken,
      }, { status: 200 });

    } catch (error: any) {
      console.error('Login API error:', error);
      
      if (error.message?.includes('INVALID_PASSWORD') || error.message?.includes('EMAIL_NOT_FOUND')) {
        return NextResponse.json(
          { error: 'Invalid email or password. If you do not have an account, please sign up.' },
          { status: 401 }
        );
      }
      throw error;
    }
  } catch (error: unknown) {
    console.error('Login error:', error);
    
    if (error instanceof Error) {
      // Log the full error for debugging
      console.error('Error details:', {
        message: error.message,
        code: (error as any).code,
        stack: error.stack,
      });

      if (error.message.includes('connect') || error.message.includes('timeout')) {
        return NextResponse.json(
          { error: 'Unable to connect to database. Please check your connection and try again.' },
          { status: 503 }
        );
      }

      // Return the actual error message for debugging
      return NextResponse.json(
        { 
          error: error.message || 'An error occurred during login. Please try again.',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'An error occurred during login. Please try again.' },
      { status: 500 }
    );
  }
}
