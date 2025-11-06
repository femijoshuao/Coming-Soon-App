# Vercel Deployment Guide for Coming Soon App

## Environment Variables Setup

Set the following environment variables in your Vercel dashboard (Settings → Environment Variables):

### Required Firebase Configuration
```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com  
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_SITE_ID=your_unique_site_identifier
```

### How to get Firebase Configuration Values

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings (gear icon) → General Tab
4. Scroll down to "Your apps" section
5. Click on the web app (</> icon)
6. Copy the configuration values from the `firebaseConfig` object

### Example Configuration
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyABC123...",           // → VITE_FIREBASE_API_KEY
  authDomain: "myproject.firebaseapp.com", // → VITE_FIREBASE_AUTH_DOMAIN  
  projectId: "my-project-id",              // → VITE_FIREBASE_PROJECT_ID
  storageBucket: "myproject.appspot.com",  // → VITE_FIREBASE_STORAGE_BUCKET
  messagingSenderId: "123456789",          // → VITE_FIREBASE_MESSAGING_SENDER_ID
  appId: "1:123456789:web:abc123"          // → VITE_FIREBASE_APP_ID
};
```

## Deployment Steps

### 1. Deploy to Vercel
```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy from project directory
vercel

# Follow the prompts to link your project
```

### 2. Set Environment Variables
In your Vercel dashboard:
1. Go to your project
2. Settings → Environment Variables
3. Add each variable from the list above
4. Set them for Production, Preview, and Development

### 3. Redeploy
After setting environment variables, redeploy:
```bash
vercel --prod
```

## Firebase Authentication Setup

### 1. Enable Authentication
1. In Firebase Console → Authentication
2. Click "Get Started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" authentication

### 2. Add Admin User
1. Go to Authentication → Users tab
2. Click "Add User"
3. Enter admin email and password
4. Save the user

### 3. Configure Authorized Domains
1. Go to Authentication → Settings → Authorized domains
2. Add your Vercel domain (e.g., `your-app.vercel.app`)

## Debugging

### Health Check Route
Visit `/health` on your deployed app to check Firebase connectivity:
- `https://your-app.vercel.app/health`

### Debug Mode
Add `?debug=true` to any URL to see debug information:
- `https://your-app.vercel.app/login?debug=true`

### Common Issues

1. **"Firebase authentication not initialized"**
   - Check that all environment variables are set correctly
   - Verify the environment variables are available in the build

2. **"Network request failed"**
   - Check that your domain is added to Firebase Authorized domains
   - Verify Firebase project is active and billing is set up (if required)

3. **"Invalid credential"**
   - Make sure you've created an admin user in Firebase Authentication
   - Check that Email/Password authentication is enabled

4. **Route not found (404)**
   - Ensure `vercel.json` is present with proper rewrite rules
   - Check that the build completed successfully

## Testing Locally

### 1. Create .env.local file
```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_SITE_ID=local_dev
```

### 2. Test locally
```bash
npm run dev
# Visit http://localhost:3000/login
# Visit http://localhost:3000/health
```

## Support

If you continue to have issues:
1. Check the browser console for errors
2. Visit `/health` to see Firebase connectivity status
3. Use debug mode with `?debug=true`
4. Check Vercel function logs in the dashboard