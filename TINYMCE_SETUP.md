# TinyMCE Self-Hosted Setup

This project uses TinyMCE in self-hosted mode, which means:

## ✅ **Benefits:**
- **Free to use** - No API key required
- **Works with Netlify** - All assets are bundled with the app
- **No external dependencies** - Fully self-contained
- **Offline capable** - Works without internet after initial load

## 🏗️ **How it works:**

1. **Development**: TinyMCE assets are copied to `public/tinymce/` 
2. **Build Process**: The `prebuild` script automatically copies TinyMCE assets
3. **Deployment**: Assets are included in the built application

## 📁 **File Structure:**
```
public/
  tinymce/           # TinyMCE assets (copied during build)
    themes/
    plugins/
    skins/
    tinymce.min.js

components/
  TinyMCEEditor.tsx  # Custom TinyMCE wrapper component
```

## 🔧 **Configuration:**

The editor is configured in `TinyMCEEditor.tsx` with:
- **License Key**: `gpl` (free GPL license for self-hosted)
- **Base URL**: `/tinymce` (points to public assets)
- **Plugins**: Lists, links, formatting, help, etc.
- **Theme**: Silver (default TinyMCE theme)
- **Skin**: Oxide (modern look)

## 🚀 **Netlify Deployment:**

The setup is fully compatible with Netlify:
1. Build process copies TinyMCE assets automatically
2. All assets are served statically
3. No external API calls required
4. Works perfectly with the redirect rules for SPA routing

## 📝 **Features Available:**
- Bold, italic, text formatting
- Bullet and numbered lists
- Text alignment
- Links insertion
- Undo/redo
- Block formatting (headings, paragraphs)
- Color formatting

## 🎨 **Styling:**
- Integrates with your app's light/dark theme
- Responsive design
- Clean, professional appearance
- Matches your app's design system

This self-hosted setup ensures your TinyMCE editor will work reliably in production without any external dependencies or API key requirements.