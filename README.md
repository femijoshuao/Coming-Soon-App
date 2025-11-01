<div align="center">

# 🚀 Coming Soon App

**A Modern, Fully-Featured "Under Construction" Landing Page**

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-12.4.0-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

*Build beautiful coming soon pages with countdown timer, subscriber management, and real-time admin customization.*

[Features](#-features) • [Quick Start](#-quick-start) • [Demo](#-demo) • [Documentation](#-documentation) • [Deployment](#-deployment)

</div>

---
![App Screenshot](https://github.com/femijoshuao/Coming-Soon-App/blob/main/Screenshot.jpeg)


## ✨ Features

### 🎨 **Stunning Design & Customization**
- **Light/Dark/Auto Theme Mode** with seamless transitions
- **Customizable Logo** - Upload image or use text-based logo
- **Google Fonts Integration** - Choose from hundreds of fonts
- **Color Customization** - Brand colors for all UI elements
- **Responsive Design** - Perfect on desktop, tablet, and mobile

### ⏱️ **Countdown Timer**
- Animated countdown to launch date
- Customizable timer colors
- Shows days, hours, minutes, and seconds
- Auto-adjusts when launch date is reached

### 📧 **Subscriber Management**
- Email subscription with real-time Firebase storage
- Collect name, email, and phone number
- View all subscribers in admin panel
- Export subscribers to CSV
- Search and filter functionality
- Delete individual subscribers

### 🔐 **Admin Panel**
- Secure Firebase authentication
- Real-time settings editor
- TinyMCE rich text editor for content
- No-code configuration interface
- Instant preview of changes
- Settings persist to Firebase database

### 📱 **Mobile-Optimized Images**
- Display images on mobile devices only
- Single image or gallery mode
- Lightbox viewer with touch navigation
- Optional image descriptions
- Automatic image optimization

### 🔌 **Social Media Integration**
- Add unlimited social media links
- Font Awesome icon support
- Customizable link colors
- Opens in new tabs

### 🌐 **SEO & Performance**
- Meta tags configuration
- Open Graph support
- Twitter Card integration
- Edge functions for bot rendering
- Fast page loads with Vite
- PWA-ready architecture

### 🏢 **Multi-Site Support**
- Single Firebase project for multiple sites
- Unique site ID per deployment
- Isolated data per website
- Perfect for agencies managing multiple clients

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **Firebase Account** (free tier works great)
- **npm** or **yarn**

### Installation

```bash
# Clone the repository
git clone https://github.com/femijoshuao/Coming-Soon-App.git
cd Coming-Soon-App

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

### Firebase Setup

1. **Create a Firebase project** at [Firebase Console](https://console.firebase.google.com/)
2. **Enable Email/Password authentication**
3. **Enable Firestore Database**
4. **Create an admin user** in Authentication
5. **Copy your Firebase config** to `.env`

📖 **Detailed instructions**: See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

### Configure Environment

Edit `.env` with your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123

# Unique identifier for this website
VITE_SITE_ID=my-website
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser! 🎉

### Login & Configure

1. Navigate to `/login` or wait for the admin login prompt
2. Login with your Firebase admin credentials
3. Click the **⚙️ gear icon** to open settings
4. Customize everything to match your brand
5. Click **Save Changes** to persist to Firebase

---

## 🎯 Demo

### Public Coming Soon Page
- Beautiful countdown timer
- Subscribe modal for collecting leads
- Social media links
- Fully responsive design

### Admin Features
- **Settings Panel**: Full control over appearance and content
- **Subscriber Management**: View, export, and manage subscribers
- **Rich Text Editor**: TinyMCE integration for content editing
- **Real-time Updates**: Changes saved instantly to Firebase

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19.2** | UI framework with latest features |
| **TypeScript 5.8** | Type-safe development |
| **Vite 6.2** | Lightning-fast build tool |
| **Tailwind CSS** | Utility-first styling |
| **Firebase** | Authentication & database |
| **React Router 7** | Client-side routing |
| **TinyMCE 8** | Rich text editing (self-hosted) |
| **Font Awesome 6** | Icon library |
| **Google Fonts** | Typography |

---

## 📦 Build & Deployment

### Build for Production

```bash
npm run build
```

The `dist/` folder contains your production-ready files.

### Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

```bash
# Using Netlify CLI
npm install -g netlify-cli
netlify deploy --prod
```

**Don't forget to add environment variables in Netlify dashboard!**

### Deploy to Vercel

```bash
# Using Vercel CLI
npm install -g vercel
vercel --prod
```

### Deploy to Cloudflare Pages

Connect your GitHub repository in the Cloudflare Pages dashboard.

**Build settings:**
- **Build command**: `npm run build`
- **Output directory**: `dist`

📖 **Full deployment guide**: See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md#-deployment)

---

## 📁 Project Structure

```
Coming-Soon-App/
├── components/              # React components
│   ├── ComingSoonPage.tsx   # Main public page
│   ├── LoginPage.tsx        # Admin login
│   ├── SettingsPanel.tsx    # Admin settings UI
│   ├── SubscriberManagement.tsx
│   ├── SubscribeModal.tsx   # Email subscription
│   ├── CountdownUnit.tsx    # Timer component
│   ├── MobileImageDisplay.tsx
│   └── TinyMCEEditor.tsx    # Rich text editor
├── hooks/                   # Custom React hooks
├── utils/                   # Utility functions
├── netlify/                 # Netlify edge functions
│   └── edge-functions/      # SEO & OG image generation
├── App.tsx                  # Main app with routing
├── index.tsx               # App entry point
├── firebase-config.ts      # Firebase initialization
├── types.ts                # TypeScript types
├── vite.config.ts          # Vite configuration
└── .env.example            # Environment template
```

---

## 🔧 Configuration

### Customization Options

Through the admin panel, you can customize:

- ✅ **Theme**: Light, Dark, or Auto (system preference)
- ✅ **Logo**: Text or image URL
- ✅ **Colors**: All brand colors
- ✅ **Fonts**: Any Google Font
- ✅ **Countdown Timer**: Launch date and color
- ✅ **Social Links**: Add/remove/edit unlimited links
- ✅ **Subscribe Modal**: Headline, subheadline, content
- ✅ **SEO Settings**: Title, description, keywords, OG image
- ✅ **Mobile Images**: Gallery or single image display

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /sites/{siteId}/{document=**} {
      allow read: if true;  // Public can view
      allow write: if request.auth != null;  // Only admins can edit
    }
  }
}
```

---

## 🌍 Multi-Site Deployment

Perfect for agencies managing multiple client websites!

### Setup

1. **Use the same Firebase project** for all sites
2. **Different `VITE_SITE_ID`** for each deployment:
   ```
   Client A: VITE_SITE_ID=client-a
   Client B: VITE_SITE_ID=client-b
   Client C: VITE_SITE_ID=client-c
   ```
3. Each site has **isolated data** in Firebase

### Firestore Structure

```
/sites
  /client-a
    /settings/pageContent
    /subscribers/{subscriberId}
  /client-b
    /settings/pageContent
    /subscribers/{subscriberId}
  /client-c
    /settings/pageContent
    /subscribers/{subscriberId}
```

📖 **Multi-site guide**: See [QUICKSTART.md](./QUICKSTART.md#-multi-site-deployment)

---

## 📚 Documentation

- **[Quick Start Guide](./QUICKSTART.md)** - Get up and running in 5 minutes
- **[Firebase Setup](./FIREBASE_SETUP.md)** - Detailed Firebase configuration
- **[TinyMCE Setup](./TINYMCE_SETUP.md)** - Rich text editor documentation
- **[Mobile Images](./MOBILE_IMAGES_DEBUG.md)** - Mobile-specific image features

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Maintain responsive design
- Test on multiple devices
- Update documentation

---

## 🐛 Troubleshooting

### Common Issues

**Login not working?**
- Verify admin user exists in Firebase Console
- Check environment variables are set correctly
- Clear browser cache and cookies

**Data not saving?**
- Ensure Firestore security rules are published
- Check you're logged in
- View browser console for errors

**Build errors?**
- Run `npm install` again
- Delete `node_modules` and reinstall
- Check Node.js version (v16+)

**Environment variables not loading?**
- Restart dev server after editing `.env`
- Ensure variables start with `VITE_`
- Don't commit `.env` to Git

📖 **More solutions**: See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md#-troubleshooting)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Firebase** for backend infrastructure
- **Tailwind CSS** for the utility-first approach
- **Font Awesome** for beautiful icons
- **TinyMCE** for the rich text editor
- **Vite** for blazing fast builds

---

## 💬 Support

- **Issues**: [GitHub Issues](https://github.com/femijoshuao/Coming-Soon-App/issues)
- **Discussions**: [GitHub Discussions](https://github.com/femijoshuao/Coming-Soon-App/discussions)

---

<div align="center">

**Built with ❤️ for developers and agencies**

⭐ **Star this repo** if you find it useful!

[Report Bug](https://github.com/femijoshuao/Coming-Soon-App/issues) • [Request Feature](https://github.com/femijoshuao/Coming-Soon-App/issues) • [Documentation](./QUICKSTART.md)

</div>
