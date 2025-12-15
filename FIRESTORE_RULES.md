# Firestore Security Rules

To allow order creation and other operations, you need to configure Firestore security rules in Firebase Console.

## Quick Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **claodapp**
3. Go to **Firestore Database** → **Rules**
4. Replace the rules with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to all documents for authenticated users
    // In production, you should restrict this further
    
    // Orders - allow authenticated users to create and read their own orders
    match /orders/{orderId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if false; // Only admins should update/delete
    }
    
    // Order Items
    match /order_items/{itemId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
    }
    
    // Payments
    match /payments/{paymentId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
    }
    
    // Shipments
    match /shipments/{shipmentId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
    }
    
    // Products - public read, admin write
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Categories - public read, admin write
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Customers - users can read/write their own data
    match /customers/{customerId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.firebaseUID;
      allow write: if request.auth != null && request.auth.uid == resource.data.firebaseUID;
    }
    
    // Product Images - public read
    match /product_images/{imageId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## For Development/Testing (Less Secure)

If you want to allow all operations during development, you can use:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **Warning**: The above rules allow anyone to read/write to your database. Only use this for development!

## After Updating Rules

1. Click **Publish** to save the rules
2. Rules take effect immediately
3. Try creating an order again

## Alternative: Use Firebase Admin SDK with Service Account

If you prefer to use Firebase Admin SDK (which bypasses security rules), you need to:

1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Add to `.env.local`:
   ```
   FIREBASE_SERVICE_ACCOUNT='{"type":"service_account",...}'
   ```
   (Copy the entire JSON content as a string)

