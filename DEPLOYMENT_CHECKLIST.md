# Deployment Checklist

Use this checklist before deploying to ensure everything is ready.

## Pre-Deployment

- [ ] Code is committed and pushed to GitHub
- [ ] All environment variables are documented
- [ ] Firebase project is set up and configured
- [ ] All dependencies are in `package.json`

## Build Configuration

- [ ] `next.config.ts` is properly configured
- [ ] Build command works locally: `npm run build`
- [ ] No TypeScript errors: `npm run lint` (if configured)

## Environment Variables

- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY` is set in deployment platform
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` is set
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID` is set
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` is set
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` is set
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID` is set
- [ ] Firebase Admin SDK credentials are set (if using server-side operations)
- [ ] All required environment variables are documented

## Firebase Configuration

- [ ] Firebase project is created
- [ ] Authentication is enabled (Email/Password)
- [ ] Firestore Database is created
- [ ] Firestore security rules are configured
- [ ] Storage is enabled (if using file uploads)
- [ ] Firebase project ID matches environment variable

## Testing

- [ ] Application builds successfully: `npm run build`
- [ ] Production server starts: `npm start`
- [ ] Home page loads correctly
- [ ] Products page displays products
- [ ] User authentication works (sign up/login)
- [ ] Admin login works
- [ ] Cart functionality works
- [ ] Firebase connection works (test authentication)

## Deployment Platform Setup

### Vercel
- [ ] Repository is connected
- [ ] Framework preset is Next.js
- [ ] Environment variables are added
- [ ] Build settings are correct

### Netlify
- [ ] Repository is connected
- [ ] Build command: `cd cloud-app && npm run build`
- [ ] Publish directory: `cloud-app/.next`
- [ ] Environment variables are added

### Railway
- [ ] Repository is connected
- [ ] Environment variables are added
- [ ] Auto-deploy is configured (optional)

## Post-Deployment

- [ ] Application URL is accessible
- [ ] No console errors in browser
- [ ] Firebase connection works
- [ ] Authentication works (sign up/login)
- [ ] Images load correctly
- [ ] All pages are accessible
- [ ] Admin panel works
- [ ] Cart persists correctly
- [ ] Forms submit successfully

## Monitoring

- [ ] Error tracking is set up (optional)
- [ ] Analytics are configured (optional)
- [ ] Logs are accessible
- [ ] Performance monitoring is active (optional)
- [ ] Firebase Console shows active usage

## Security

- [ ] Environment variables are not exposed in client code
- [ ] Firebase credentials are secure
- [ ] Firestore security rules are properly configured
- [ ] Admin routes are protected
- [ ] API routes have proper error handling
- [ ] Authentication is working correctly

## Documentation

- [ ] README.md is updated
- [ ] Deployment guide is complete
- [ ] Environment variables are documented
- [ ] Troubleshooting guide is available
- [ ] Firebase setup guide is complete
