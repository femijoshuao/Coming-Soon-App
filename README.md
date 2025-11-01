<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🚀 Coming Soon App

A modern, feature-rich **Coming Soon / Under Construction** page with a powerful admin panel, built with React, TypeScript, and Firebase. Perfect for agencies, freelancers, or anyone who needs to deploy customizable landing pages quickly.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2.0-61dafb.svg)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-12.4.0-orange.svg)](https://firebase.google.com/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646cff.svg)](https://vitejs.dev/)

## ✨ Features

### 🎨 **Fully Customizable Design**
- **Theme Modes**: Light, Dark, and Auto (system preference)
- **Dual Logo Support**: Choose between text or image logo with separate light/dark mode images
- **Custom Fonts**: Select from Google Fonts (Inter, Roboto, Playfair Display, Roboto Mono)
- **Color Customization**: Customize accent colors, countdown colors, and more
- **Responsive Design**: Optimized for all devices (desktop, tablet, mobile)

### ⏱️ **Countdown Timer**
- Configurable countdown to any future date
- Toggle countdown visibility
- Custom countdown accent color
- Real-time updates
- Beautiful animated display

### 📧 **Subscriber Management**
- **Email Collection**: Capture visitor emails with customizable subscribe modal
- **Data Fields**: Name, Email, and Phone Number (optional)
- **CSV Export**: Download all subscribers with one click
- **Search & Filter**: Easily find specific subscribers
- **Delete Management**: Remove individual subscribers
- **Real-time Updates**: Instant synchronization with Firebase

### 🖼️ **Mobile Image Gallery**
- Display images exclusively on mobile devices (< 1024px)
- **Two Display Modes**:
  - Single Image: Large image with optional description
  - Gallery: 2-column grid with lightbox viewer
- Touch-friendly navigation
- Swipe support for image browsing
- Optional image descriptions

### 🔐 **Admin Panel**
- **Secure Authentication**: Firebase-based email/password authentication
- **Settings Panel**: Click gear icon (⚙️) to access full customization
- **Subscriber Panel**: Click people icon (👥) to manage subscribers
- **Live Preview**: See changes in real-time before saving
- **One-Click Save**: Persist all settings to Firebase instantly

### 📝 **Rich Text Editor**
- **TinyMCE Integration**: Self-hosted, no API key required
- Format text with bold, italic, lists, links
- Color formatting and alignment
- Fully offline-capable

### 🌐 **SEO Optimized**
- Customizable meta title, description, and keywords
- Open Graph image support
- Author and social meta tags
- Netlify Edge Functions for bot/crawler optimization
- Dynamic SEO injection

### 🔗 **Social Media Integration**
- Add unlimited social media links
- Popular icon library (GitHub, Twitter, LinkedIn, Facebook, Instagram, etc.)
- Customizable icon size
- Easy URL management

### 🏢 **Multi-Site Support**
- **Single Firebase Project**: Manage multiple websites from one Firebase instance
- **Site Isolation**: Each deployment uses unique `VITE_SITE_ID` for data separation
- **Independent Settings**: Each site has its own settings and subscribers
- **Cost Effective**: Use Firebase free tier for multiple client websites

### 🚀 **Easy Deployment**
- **Netlify**: One-click deploy with environment variables
- **Vercel**: Git-based deployment support
- **Cloudflare Pages**: Static site hosting ready
- Pre-configured build scripts and redirects
- SPA routing handled automatically

## 🛠️ Technology Stack

- **Frontend Framework**: React 19.2.0 with TypeScript
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS with custom theme support
- **Backend**: Firebase (Authentication + Firestore Database)
- **Routing**: React Router DOM 7.9.5
- **Rich Text**: TinyMCE 8.2.0 (self-hosted)
- **Icons**: Custom Icon component with extensive library
- **Deployment**: Netlify/Vercel/Cloudflare Pages ready

## 📋 Prerequisites

- **Node.js**: Version 16+ (recommended: 18+)
- **Firebase Account**: Free tier is sufficient
- **Git**: For version control
- **npm**: Package manager (comes with Node.js)

## ⚡ Quick Start

### 1️⃣ Clone & Install

```bash
# Clone the repository
git clone https://github.com/femijoshuao/Coming-Soon-App.git
cd Coming-Soon-App

# Install dependencies
npm install
```

### 2️⃣ Firebase Setup (5 minutes)

Follow the detailed guide: **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)**

Quick checklist:
- [ ] Create Firebase project
- [ ] Enable Email/Password authentication
- [ ] Create admin user in Firebase Console
- [ ] Enable Firestore Database
- [ ] Set Firestore security rules
- [ ] Get Firebase configuration
- [ ] Copy `.env.example` to `.env`
- [ ] Add Firebase config to `.env`
- [ ] Set unique `VITE_SITE_ID` in `.env`

### 3️⃣ Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4️⃣ Login & Customize

1. Navigate to `/login` route
2. Login with Firebase admin credentials
3. Click gear icon (⚙️) to open settings
4. Customize your page
5. Click "Save Changes" to persist to Firebase

## 📁 Project Structure

```
Coming-Soon-App/
├── components/              # React components
│   ├── AdminLogin.tsx       # Admin authentication
│   ├── ComingSoonPage.tsx   # Main landing page
│   ├── CountdownUnit.tsx    # Countdown timer component
│   ├── Icon.tsx             # Icon component library
│   ├── LoginPage.tsx        # Login page wrapper
│   ├── MobileImageDisplay.tsx # Mobile-only image gallery
│   ├── SettingsPanel.tsx    # Admin settings panel
│   ├── SubscribeModal.tsx   # Email subscription modal
│   ├── SubscriberManagement.tsx # Subscriber management panel
│   └── TinyMCEEditor.tsx    # Rich text editor wrapper
├── hooks/                   # Custom React hooks
│   └── usePageContent.ts    # Firebase data hooks
├── utils/                   # Utility functions
│   └── markdown.ts          # Markdown processing
├── netlify/                 # Netlify Edge Functions
│   └── edge-functions/      # SEO and OG image functions
├── App.tsx                  # Main app with routing
├── firebase-config.ts       # Firebase initialization
├── types.ts                 # TypeScript type definitions
├── index.html               # HTML entry point
├── index.tsx                # React entry point
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
├── netlify.toml             # Netlify deployment config
├── package.json             # Dependencies and scripts
├── .env.example             # Environment variables template
├── FIREBASE_SETUP.md        # Firebase setup guide
├── QUICKSTART.md            # Quick start guide
├── TINYMCE_SETUP.md         # TinyMCE configuration guide
└── README.md                # This file
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# Site ID - Unique identifier for this website
# Change this for each deployment to isolate data
VITE_SITE_ID=default
```

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /sites/{siteId}/{document=**} {
      allow read: if true;  // Public can view
      allow write: if request.auth != null;  // Only authenticated admins can edit
    }
  }
}
```

## 📦 Build & Deploy

### Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` directory.

### Deploy to Netlify

1. **Via Netlify UI**:
   - Connect your Git repository
   - Add environment variables in Site Settings
   - Deploy automatically on push

2. **Via Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   npm run build
   netlify deploy --prod
   ```

### Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

### Deploy to Cloudflare Pages

Connect your GitHub repository in the Cloudflare Pages dashboard and add environment variables.

## 🏢 Multi-Site Deployment

Deploy the same codebase for multiple clients/websites using a single Firebase project:

### Setup

1. **Same Codebase**: Clone or branch for each client
2. **Same Firebase**: Use the same Firebase configuration
3. **Unique Site ID**: Change `VITE_SITE_ID` for each deployment

### Example

```env
# Client 1 (.env)
VITE_SITE_ID=client-abc

# Client 2 (.env)
VITE_SITE_ID=client-xyz

# Client 3 (.env)
VITE_SITE_ID=project-123
```

### Firestore Structure

```
/sites
  /client-abc
    /settings
      /pageContent (document)
    /subscribers (collection)
  /client-xyz
    /settings
      /pageContent (document)
    /subscribers (collection)
  /project-123
    /settings
      /pageContent (document)
    /subscribers (collection)
```

Each site's data is completely isolated while using the same Firebase project.

## 🎯 Usage

### Admin Access

1. Navigate to `/login` in your browser
2. Login with Firebase admin credentials
3. Access admin features:
   - **Settings (⚙️)**: Customize page appearance and content
   - **Subscribers (👥)**: View and manage email subscribers

### Customization Options

#### Logo Settings
- **Type**: Text or Image
- **Text Logo**: Custom text with adjustable size
- **Image Logo**: Upload different logos for light/dark modes
- **Size**: Adjustable width for image logos

#### Theme & Colors
- **Theme Mode**: Light, Dark, or System
- **Accent Color**: Primary brand color
- **Countdown Color**: Timer accent color
- **Font Family**: Choose from Google Fonts

#### Content
- **Heading**: Main page title with custom size
- **Description**: Subtitle or tagline (supports rich text)
- **Footer Text**: Bottom page text
- **Side Image**: Large background/side image URL

#### Countdown Timer
- **Target Date**: Set launch date/time
- **Visibility**: Show/hide countdown
- **Color**: Custom countdown accent color

#### Subscribe Modal
- **Title & Subtitle**: Modal header content
- **Success Message**: Post-subscription confirmation
- **Privacy Note**: GDPR/privacy compliance text
- **Button Text**: Customize CTA button

#### Social Links
- Add unlimited social media links
- Choose from extensive icon library
- Customize icon size

#### SEO Settings
- **Title**: Page title (appears in browser tab)
- **Description**: Meta description for search engines
- **Keywords**: SEO keywords
- **Author**: Content author
- **OG Image**: Social sharing preview image

#### Mobile Images
- **Enable/Disable**: Toggle mobile image display
- **Display Type**: Single or Gallery
- **Images**: Upload up to 2MB per image
- **Descriptions**: Optional captions

### Subscriber Management

1. Click **people icon (👥)** in admin panel
2. View all subscribers with:
   - Name
   - Email
   - Phone number (if provided)
   - Subscription date
3. **Search**: Filter by name, email, or phone
4. **Export CSV**: Download all subscriber data
5. **Delete**: Remove individual subscribers

## 📚 Additional Documentation

- **[QUICKSTART.md](./QUICKSTART.md)**: Fast setup guide with checklists
- **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)**: Detailed Firebase configuration
- **[TINYMCE_SETUP.md](./TINYMCE_SETUP.md)**: Rich text editor setup
- **[MOBILE_IMAGES_DEBUG.md](./MOBILE_IMAGES_DEBUG.md)**: Mobile image troubleshooting

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support & Troubleshooting

### Common Issues

**Login not working?**
- Verify admin user exists in Firebase Console
- Check Firebase Auth is enabled
- Verify credentials are correct

**Settings not saving?**
- Ensure you're logged in
- Check Firestore rules are published
- Check browser console for errors

**Build errors?**
- Run `npm install` again
- Delete `node_modules` and reinstall
- Check Node.js version (16+)

**Environment variables not loading?**
- Restart dev server after creating `.env`
- Verify all variables start with `VITE_`
- Check for typos in variable names

### Need Help?

- Check existing [documentation](./FIREBASE_SETUP.md)
- Review [Firebase documentation](https://firebase.google.com/docs)
- Open an issue on GitHub

## 🎉 Acknowledgments

- Built with [React](https://reactjs.org/)
- Powered by [Firebase](https://firebase.google.com/)
- Bundled with [Vite](https://vitejs.dev/)
- Rich text editing by [TinyMCE](https://www.tiny.cloud/)

---

**Made with ❤️ for developers and agencies who need beautiful, customizable coming soon pages.**
