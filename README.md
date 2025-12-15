# E-Commerce Cloud App - Next.js with Firebase

A modern e-commerce Next.js application with Firebase (Firestore + Firebase Auth).

## Features

- ⚡ Next.js 15 with App Router
- 🎨 Tailwind CSS for styling
- 🔥 Firebase Firestore for database
- 🔐 Firebase Authentication
- 📝 TypeScript support
- 🔧 ESLint configuration
- 🛒 Complete e-commerce functionality

## Database

The application uses Firebase Firestore for data storage with the following collections:

### Core Collections
- **customers**: User accounts with authentication and profile information
- **categories**: Product categories
- **products**: Product catalog with pricing and inventory management
- **product_images**: Multiple images per product

### Order Management
- **orders**: Customer orders with status tracking and financial details
- **order_items**: Individual products within orders
- **payments**: Payment transactions
- **sales**: Completed sales
- **shipments**: Shipping and delivery tracking

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env.local` file with your Firebase configuration:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

See `FIREBASE_SETUP.md` for detailed setup instructions.

### 3. Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Create Firestore Database
4. Copy your Firebase config to `.env.local`

### 4. Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API routes
│   └── page.tsx        # Home page
├── lib/                # Utility functions
│   ├── firebase.ts     # Firebase client configuration
│   └── firebase-admin.ts # Firebase Admin SDK configuration
```

## Deployment

### Prerequisites

1. **Firebase Project**: Set up your Firebase project with Firestore and Authentication
2. **Environment Variables**: Set up your Firebase environment variables in your deployment platform

### Environment Variables

Set the following in your deployment platform:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI** (optional):
   ```bash
   npm i -g vercel
   ```

2. **Deploy via Vercel Dashboard**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add Firebase environment variables
   - Deploy!

3. **Or deploy via CLI**:
   ```bash
   vercel
   ```

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Important Notes

- **Firebase**: Ensure your Firebase project is set up with Firestore and Authentication enabled
- **Environment Variables**: Never commit `.env.local` to version control
- **Security Rules**: Configure Firestore security rules in Firebase Console

## Next Steps

1. Set up your Firebase project
2. Configure Firestore security rules
3. Update environment variables in your deployment platform
4. Deploy and enjoy your e-commerce platform!
