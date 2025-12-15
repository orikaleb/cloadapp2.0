# Deployment Guide

This guide will help you deploy CloudStore to various platforms.

## Quick Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Easiest)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository

3. **Configure Project**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `cloud-app` (if your repo has this folder)
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)

4. **Add Environment Variables**
   - Click "Environment Variables"
   - Add all Firebase configuration variables:
     - `NEXT_PUBLIC_FIREBASE_API_KEY`
     - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
     - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
     - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
     - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
     - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - Optional: Add Firebase Admin SDK credentials if needed

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live!

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
cd cloud-app
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name? cloudstore (or your choice)
# - Directory? ./
# - Override settings? No
```

## Environment Variables

You need to set these in your deployment platform:

### Required

- `NEXT_PUBLIC_FIREBASE_API_KEY` - Your Firebase API key
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` - Your Firebase auth domain
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` - Your Firebase project ID
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` - Your Firebase storage bucket
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` - Your Firebase messaging sender ID
- `NEXT_PUBLIC_FIREBASE_APP_ID` - Your Firebase app ID

### Optional (for server-side operations)

- `FIREBASE_SERVICE_ACCOUNT` - Firebase Admin SDK service account JSON (as string)
- Or individual credentials:
  - `FIREBASE_PRIVATE_KEY` - Firebase Admin SDK private key
  - `FIREBASE_CLIENT_EMAIL` - Firebase Admin SDK client email

## Firebase Configuration

### Get Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings (gear icon)
4. Scroll to "Your apps"
5. Click the web icon (`</>`) to view your config
6. Copy the configuration values

### Enable Required Services

1. **Authentication**: Enable Email/Password sign-in method
2. **Firestore Database**: Create database and set security rules
3. **Storage** (optional): If using file uploads

## Platform-Specific Instructions

### Vercel

✅ **Recommended** - Best for Next.js apps

- Automatic deployments on git push
- Built-in CI/CD
- Edge functions support
- Free tier available

**Steps:**
1. Import GitHub repo
2. Add Firebase environment variables
3. Deploy!

### Netlify

1. Connect GitHub repository
2. Build settings:
   - Build command: `cd cloud-app && npm run build`
   - Publish directory: `cloud-app/.next`
3. Add Firebase environment variables
4. Deploy

### Railway

1. Connect GitHub repository
2. Railway auto-detects Next.js
3. Add Firebase environment variables
4. Deploy automatically

### Docker

Build and run with Docker:

```bash
# Build image
docker build -t cloudstore .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_FIREBASE_API_KEY="your-key" \
  -e NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project" \
  # ... add other env vars
  cloudstore
```

## Post-Deployment Checklist

- [ ] Environment variables are set correctly
- [ ] Firebase project is configured
- [ ] Authentication is enabled in Firebase
- [ ] Firestore database is created
- [ ] Firestore security rules are configured
- [ ] Build completes successfully
- [ ] Application loads without errors
- [ ] Authentication works (test sign up/login)
- [ ] Products display correctly
- [ ] Cart functionality works

## Troubleshooting

### Build Fails

**Error: Cannot find module**
- Solution: Ensure all dependencies are in `package.json` and run `npm install`

**Error: Firebase not initialized**
- Solution: Check that all `NEXT_PUBLIC_FIREBASE_*` environment variables are set

### Database Connection Issues

**Error: Firebase connection failed**
- Check Firebase project ID is correct
- Verify API key is valid
- Ensure Firebase services are enabled

**Error: Permission denied**
- Check Firestore security rules
- Verify Firebase Admin SDK credentials (if using server-side)

### Runtime Errors

**Error: Firebase not configured**
- Ensure all Firebase environment variables are set in deployment platform
- Check that variables start with `NEXT_PUBLIC_` for client-side access

## Monitoring

After deployment, monitor:

1. **Vercel Dashboard**: View logs, analytics, and performance
2. **Firebase Console**: Monitor database usage, authentication, and errors
3. **Application Logs**: Check for runtime errors

## Custom Domain

### Vercel

1. Go to Project Settings → Domains
2. Add your domain
3. Follow DNS configuration instructions
4. SSL certificate is automatic

## Support

For issues:
1. Check deployment platform logs
2. Verify Firebase environment variables
3. Test Firebase connection
4. Review build logs for errors
5. Check Firebase Console for service status
