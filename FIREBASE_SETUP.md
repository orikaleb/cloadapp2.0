# Firebase Setup Guide

This application has been migrated from MongoDB/Prisma to Firebase (Firestore + Firebase Auth).

## Setup Instructions

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter your project name (e.g., "CloudStore")
4. Follow the setup wizard

### 2. Enable Authentication

1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Enable "Email/Password" sign-in method
4. Save

### 3. Create Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in production mode" (or test mode for development)
4. Select a location for your database
5. Click "Enable"

### 4. Get Firebase Configuration

1. In Firebase Console, go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon (`</>`) to add a web app
4. Register your app and copy the configuration

### 5. Set Environment Variables

Create or update `.env.local` file:

```bash
# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Firebase Admin SDK (Optional - for server-side operations)
# Option 1: Service Account JSON (recommended)
FIREBASE_SERVICE_ACCOUNT='{"type":"service_account","project_id":"..."}'

# Option 2: Individual credentials
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
```

### 6. Get Firebase Admin SDK Credentials

1. In Firebase Console, go to Project Settings
2. Click "Service accounts" tab
3. Click "Generate new private key"
4. Download the JSON file
5. Either:
   - Set `FIREBASE_SERVICE_ACCOUNT` to the entire JSON content as a string, OR
   - Extract `private_key`, `client_email`, and `project_id` and set them individually

### 7. Firestore Security Rules

Set up Firestore security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Customers collection
    match /customers/{customerId} {
      // Users can read/write their own data
      allow read, write: if request.auth != null && request.auth.uid == resource.data.firebaseUID;
      // Allow server-side access
      allow read, write: if request.auth == null;
    }
    
    // Products collection (public read, admin write)
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null; // Add admin check in production
    }
    
    // Orders collection
    match /orders/{orderId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.customerId;
    }
    
    // Categories collection (public read)
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null; // Add admin check in production
    }
  }
}
```

### 8. Install Dependencies

Dependencies are already installed:
- `firebase` - Client SDK
- `firebase-admin` - Server SDK

### 9. Test the Connection

1. Start your development server: `npm run dev`
2. Try to register a new account
3. Check Firebase Console to see if the user was created in Authentication
4. Check Firestore to see if the customer document was created

## Migration Notes

- **Authentication**: Now uses Firebase Auth instead of custom password hashing
- **Database**: Uses Firestore instead of MongoDB
- **Collections**: 
  - `customers` - User accounts
  - `products` - Product catalog
  - `categories` - Product categories
  - `orders` - Customer orders
  - `order_items` - Items in orders
  - `payments` - Payment records
  - `shipments` - Shipping information

## Troubleshooting

### "Firebase API key not configured"
- Make sure all `NEXT_PUBLIC_FIREBASE_*` environment variables are set in `.env.local`

### "Permission denied" errors
- Check Firestore security rules
- Ensure Firebase Admin SDK credentials are set correctly

### Authentication errors
- Verify Email/Password is enabled in Firebase Console
- Check that the API key is correct

## Next Steps

After setup, you may need to:
1. Migrate existing data from MongoDB to Firestore
2. Update other API routes to use Firestore
3. Test all authentication flows
4. Update admin panel to use Firestore

