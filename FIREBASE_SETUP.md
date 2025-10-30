# Firebase Setup Guide

Complete guide to set up Firebase authentication and database for your Coming Soon page.

## 📋 Prerequisites

- Firebase account (free tier is sufficient)
- Node.js installed

## 🚀 Step-by-Step Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name (e.g., `coming-soon-pages`)
4. Disable Google Analytics (optional)
5. Click **"Create project"**

### 2. Enable Firebase Authentication

1. In your Firebase project, click **"Authentication"** in the left sidebar
2. Click **"Get started"**
3. Click on **"Email/Password"** under Sign-in providers
4. Toggle **"Enable"**
5. Click **"Save"**

### 3. Create Admin User

1. Still in Authentication, click on the **"Users"** tab
2. Click **"Add user"**
3. Enter admin email: `admin@yourdomain.com`
4. Enter a strong password
5. Click **"Add user"**

💡 **This email/password will be used to login to your admin panel**

### 4. Enable Firestore Database

1. Click **"Firestore Database"** in the left sidebar
2. Click **"Create database"**
3. Select **"Start in production mode"** (we'll set rules next)
4. Choose your preferred location
5. Click **"Enable"**

### 5. Set Firestore Security Rules

1. Go to **"Firestore Database"** → **"Rules"** tab
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read and write to their site's data
    match /sites/{siteId}/{document=**} {
      allow read: if true; // Anyone can view the coming soon page
      allow write: if request.auth != null; // Only authenticated admins can edit
    }
  }
}
```

3. Click **"Publish"**

### 6. Get Firebase Configuration

1. Click the **gear icon** ⚙️ next to "Project Overview"
2. Click **"Project settings"**
3. Scroll down to **"Your apps"**
4. Click the **web icon** `</>`
5. Enter app nickname: `coming-soon-app`
6. **Don't check** "Also set up Firebase Hosting"
7. Click **"Register app"**
8. Copy the configuration values (you'll need these next)

### 7. Configure Your Application

1. In your project root, copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in the Firebase values:
   ```env
   VITE_FIREBASE_API_KEY=
   VITE_FIREBASE_AUTH_DOMAIN=
   VITE_FIREBASE_PROJECT_ID=
   VITE_FIREBASE_STORAGE_BUCKET=
   VITE_FIREBASE_MESSAGING_SENDER_ID=
   VITE_FIREBASE_APP_ID=
   
   # Change this for each website you deploy
   VITE_SITE_ID=
   ```

3. **IMPORTANT**: Add `.env` to `.gitignore` (it should already be there)

## 🎨 For Multiple Websites

To use this for multiple client websites:

### Option 1: Different Site IDs (Recommended)

1. Use the **same Firebase project** for all sites
2. Change `VITE_SITE_ID` for each deployment:
   - Website 1: `VITE_SITE_ID=client-abc`
   - Website 2: `VITE_SITE_ID=client-xyz`
   - Website 3: `VITE_SITE_ID=project-123`

3. Each site will have isolated data in Firebase:
   ```
   Firestore Structure:
   /sites
     /client-abc
       /settings
       /subscribers
     /client-xyz
       /settings
       /subscribers
     /project-123
       /settings
       /subscribers
   ```

### Option 2: Separate Firebase Projects

1. Create a new Firebase project for each client
2. Repeat steps 1-7 for each project
3. Use different `.env` files for each deployment

## 🔒 Security Best Practices

1. **Never commit `.env` file** to Git
2. **Use strong passwords** for admin accounts
3. **Keep Firebase API keys secure** (though they're safe to expose in client-side code)
4. **Review Firestore rules** periodically

## 🚀 Deployment

### Netlify

1. Go to Netlify dashboard
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your Git repository
4. Add environment variables in **Site settings** → **Environment variables**
5. Deploy!

### Vercel

1. Go to Vercel dashboard
2. Click **"Add New"** → **"Project"**
3. Import your Git repository
4. Add environment variables in **Settings** → **Environment Variables**
5. Deploy!

### Cloudflare Pages

1. Go to Cloudflare Pages dashboard
2. Create a new project
3. Connect your Git repository
4. Add environment variables in settings
5. Deploy!

## 📧 Managing Subscribers

1. **Login** with your admin credentials
2. Click the **gear icon** to open settings
3. Click the **people icon** to view subscribers
4. **Export CSV**: Download all subscribers (includes name, email, phone, and subscription date)
5. **Delete**: Remove individual subscribers
6. **Search**: Filter subscribers by name, email, or phone number

### Subscriber Information Collected

- **Name** (Required)
- **Email** (Required)
- **Phone Number** (Optional) - Formatted in international standard format (+XXX XXX XXXX XXXX)

## 📱 Mobile Images Feature

Display images below the subscribe button on mobile devices only (screens < 1024px).

### Configuration Options

1. **Enable/Disable**: Toggle mobile images on or off
2. **Display Types**:
   - **Single Image**: Shows one large image with optional description
   - **Gallery**: Shows a grid of images with lightbox viewer

### Image Settings

- **Upload Method**: URL or file upload (max 2MB per image)
- **Image Description**: Optional text overlay/caption for each image
- **Gallery Features**:
  - 2-column grid layout optimized for mobile
  - Click any image to open full-screen lightbox
  - Swipe or arrow navigation between images
  - Thumbnail strip for quick navigation
  - Touch-friendly interface

### How to Add Mobile Images

1. Login to admin panel
2. Open Settings (gear icon)
3. Scroll to "Mobile Images" section
4. Enable the feature
5. Choose display type (Single or Gallery)
6. Click "Add Image" to upload images
7. Add optional descriptions
8. Save changes

**Note**: Images are only visible on mobile devices to maintain the desktop's clean two-column layout.

## 🔑 Admin Login Credentials

- **Email**: The email you created in step 3
- **Password**: The password you set in step 3

## 🆘 Troubleshooting

### "Cannot find module 'firebase'" error
```bash
npm install
```

### Login not working
1. Check Firebase Console → Authentication → Users
2. Verify email and password are correct
3. Check browser console for errors

### Data not saving
1. Check Firestore rules are published
2. Verify you're logged in
3. Check browser console for errors

### Environment variables not loading
1. Restart dev server after adding `.env`
2. Verify all variables start with `VITE_`
3. Check for typos in variable names

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
