# 🚀 Quick Start Guide

Get your Coming Soon page with Firebase backend up and running in minutes!

## ⚡ Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

## 🔧 Firebase Setup (5 minutes)

Follow the detailed instructions in **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)**

Quick checklist:
- [ ] Create Firebase project
- [ ] Enable Email/Password authentication
- [ ] Create admin user
- [ ] Enable Firestore Database
- [ ] Set Firestore security rules
- [ ] Copy Firebase config to `.env`
- [ ] Set `VITE_SITE_ID` in `.env`

## 🏃 Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## 🔐 First Login

1. You'll see the admin login screen
2. Use the email/password you created in Firebase Console
3. Once logged in, click the **gear icon** to open settings

## ✨ Features

### Admin Panel
- **Settings Panel**: Click gear icon (⚙️) to customize everything
- **Subscriber Management**: Click people icon (👥) to view subscribers
- **Save Changes**: Click "Save Changes" button to persist to Firebase
- **Logout**: Click "Logout" button to sign out

### Customization Options
- ✅ Theme Mode (Light/Dark/Auto)
- ✅ Logo (Text or Image)
- ✅ Countdown Timer (with custom color)
- ✅ Social Media Links
- ✅ Subscribe Modal Content
- ✅ SEO Settings
- ✅ All colors and fonts

### Subscriber Features
- ✅ Real-time subscriber collection
- ✅ View all subscribers
- ✅ Export to CSV
- ✅ Delete subscribers
- ✅ Search functionality

## 🌍 Multi-Site Deployment

### For Each Website:

1. **Clone or Branch**:
   ```bash
   git clone <repo-url> client-website-name
   cd client-website-name
   ```

2. **Update `.env`**:
   ```env
   # Use the same Firebase project
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   # ... (same for all)
   
   # Change this for each site!
   VITE_SITE_ID=client-abc  # ← Unique for each website
   ```

3. **Deploy to Netlify/Vercel/Cloudflare**:
   - Add the same environment variables
   - Each site will have isolated data

## 📦 Build for Production

```bash
npm run build
```

The `dist/` folder is ready to deploy!

## 🎯 Common Use Cases

### Single Website
1. Set `VITE_SITE_ID=mywebsite`
2. Deploy once
3. Manage from admin panel

### Multiple Client Websites
1. Use same Firebase project
2. Different `VITE_SITE_ID` for each:
   - `client-1`
   - `client-2`
   - `client-3`
3. Each client has independent settings and subscribers

### Agency/Portfolio
1. One Firebase project for all
2. Unique site IDs per project
3. Single admin login for all sites
4. View all data from Firebase Console

## 🔑 Default Admin Credentials

Create your admin user in Firebase Console (see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md))

## 📊 Where is Data Stored?

Firebase Firestore structure:
```
/sites
  /{SITE_ID}
    /settings
      /pageContent (document) ← All your settings
    /subscribers (collection)
      /{subscriberId} ← Each subscriber
        - name
        - email
        - subscribedAt
```

## 🆘 Need Help?

- **Setup Issues**: See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
- **Firebase Errors**: Check Firebase Console → Authentication/Firestore
- **Build Errors**: Run `npm install` again
- **Login Not Working**: Verify admin user exists in Firebase Console

## 🎨 Customization Tips

1. **Logo**: Upload your logo to a CDN and paste the URL
2. **Colors**: Use color picker for brand colors
3. **Fonts**: Choose from Google Fonts
4. **Social Links**: Add as many as you need
5. **SEO**: Fill out all SEO fields for better visibility

## 🚀 Ready to Deploy?

### Netlify
```bash
# Build
npm run build

# Deploy via Netlify CLI
netlify deploy --prod
```

### Vercel
```bash
# Deploy via Vercel CLI
vercel --prod
```

### Cloudflare Pages
Connect your GitHub repo in Cloudflare Pages dashboard

---

**Happy Building! 🎉**
