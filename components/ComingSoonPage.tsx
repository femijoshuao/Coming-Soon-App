import React, { useState, useEffect, useCallback } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase-config';
import { usePageContent } from '../hooks/usePageContent';
import type { PageContent, TimeLeft, Theme } from '../types';
import CountdownUnit from './CountdownUnit';
import Icon from './Icon';
import SettingsPanel from './SettingsPanel';
import SubscribeModal from './SubscribeModal';
import MobileImageDisplay from './MobileImageDisplay';

// URLs for the Google Fonts available in the settings panel.
const GOOGLE_FONTS: Record<string, string> = {
  'Inter': 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap',
  'Roboto': 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap',
  'Playfair Display': 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&display=swap',
  'Roboto Mono': 'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;700&display=swap',
};

// Helper function to determine if text should be light or dark based on background color.
const getContrastingTextColor = (hexColor: string): string => {
  if (!hexColor || hexColor.length < 7) return '#000000';
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  // Calculate luminance (YIQ formula)
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  // Return black for light backgrounds, white for dark backgrounds
  return (yiq >= 128) ? '#000000' : '#FFFFFF';
};

// Helper function to determine the current theme (light/dark) for logo selection
const getCurrentTheme = (themeMode: Theme): 'light' | 'dark' => {
  if (themeMode === 'light') return 'light';
  if (themeMode === 'dark') return 'dark';
  
  // For 'system' mode, check the document's dark class or media query
  if (typeof window !== 'undefined') {
    const isDarkMode = document.documentElement.classList.contains('dark') ||
                      window.matchMedia('(prefers-color-scheme: dark)').matches;
    return isDarkMode ? 'dark' : 'light';
  }
  
  return 'light'; // Default fallback
};

// Helper function to get the appropriate logo URL based on theme
const getLogoImageUrl = (content: PageContent, currentTheme: 'light' | 'dark'): string => {
  if (currentTheme === 'dark' && content.logoDarkImageUrl) {
    return content.logoDarkImageUrl;
  }
  if (currentTheme === 'light' && content.logoLightImageUrl) {
    return content.logoLightImageUrl;
  }
  // Fall back to legacy logoImageUrl if theme-specific images aren't available
  return content.logoImageUrl || content.logoLightImageUrl || content.logoDarkImageUrl || '';
};

// Default content if nothing is saved in Firebase
const getDefaultContent = (): PageContent => ({
  logoType: 'text',
  logoText: 'IChanneTech',
  logoSize: 28,
  logoImageUrl: 'https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600', // Legacy for backward compatibility
  logoLightImageUrl: 'https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600',
  logoDarkImageUrl: 'https://tailwindui.com/img/logos/mark.svg?color=white&shade=100',
  logoImageWidth: 150,
  heading: 'Our website is under construction, follow us for update now!',
  headingSize: 48,
  headingFontFamily: 'Inter',
  countdownTarget: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
  description: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>',
  socials: [
    { id: '1', icon: 'x', url: 'https://twitter.com', label: 'X (Twitter)' },
    { id: '2', icon: 'instagram', url: 'https://instagram.com', label: 'Instagram' },
    { id: '3', icon: 'youtube', url: 'https://youtube.com', label: 'YouTube' },
    { id: '4', icon: 'github', url: 'https://github.com', label: 'GitHub' },
  ],
  socialIconSize: 20,
  interests: ['JavaScript', 'TypeScript', 'Node.js'],
  footerText: 'Made by IChanneTech with love.',
  sideImageUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop',
  fontFamily: 'Inter',
  accentColor: '#fce7f3',
  countdownAccentColor: '#000000',
  subscribeButtonText: 'Subscribe',
  themeMode: 'system',
  showCountdown: true,
  showLogo: true,
  subscribeModal: {
    title: 'Stay Updated',
    subtitle: 'Subscribe to get notified when we launch. We promise not to spam you!',
    successTitle: '🎉 Success!',
    successMessage: 'Thank you for subscribing! We\'ll keep you updated.',
    privacyNote: 'We respect your privacy. Unsubscribe at any time.',
  },
  seo: {
    title: 'Coming Soon - IChanneTech',
    description: 'Our website is under construction. Subscribe to get notified when we launch!',
    keywords: 'coming soon, launch, website, under construction',
    author: 'IChanneTech',
    ogImage: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop',
  },
  mobileImages: {
    enabled: false,
    displayType: 'single',
    images: []
  }
});

const ComingSoonPage: React.FC = () => {
  // Firebase authentication state
  const [user, authLoading] = useAuthState(auth);
  
  // Load content from Firebase
  const { content: firebaseContent, saveContent, loading: contentLoading } = usePageContent();
  
  // Use Firebase content if available, otherwise use default
  const [content, setContent] = useState<PageContent>(getDefaultContent());

  // Update local content when Firebase content loads
  useEffect(() => {
    if (firebaseContent) {
      console.log('ComingSoonPage: Firebase content loaded:', {
        mobileImages: firebaseContent.mobileImages
      });
      
      const defaultContent = getDefaultContent();
      // Merge Firebase content with defaults to ensure all properties exist
      const mergedContent = {
        ...defaultContent,
        ...firebaseContent,
        // Ensure mobileImages has default structure if not present
        mobileImages: firebaseContent.mobileImages || {
          enabled: false,
          displayType: 'single',
          images: []
        },
        // Handle migration from old single logo to light/dark logos
        logoLightImageUrl: firebaseContent.logoLightImageUrl || firebaseContent.logoImageUrl || defaultContent.logoLightImageUrl,
        logoDarkImageUrl: firebaseContent.logoDarkImageUrl || defaultContent.logoDarkImageUrl,
        logoImageUrl: firebaseContent.logoImageUrl || defaultContent.logoImageUrl,
        // Handle migration for new heading properties
        headingSize: firebaseContent.headingSize || defaultContent.headingSize,
        headingFontFamily: firebaseContent.headingFontFamily || defaultContent.headingFontFamily
      };
      
      console.log('ComingSoonPage: Merged content mobileImages:', mergedContent.mobileImages);
      setContent(mergedContent);
    }
  }, [firebaseContent]);

  // State for the calculated time remaining for the countdown.
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  // State to control the visibility of the settings panel.
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  // State to control the visibility of the subscribe modal.
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);

  // --- Effects ---

  // Effect for handling theme changes (light/dark mode).
  useEffect(() => {
    const root = window.document.documentElement;
    const applyTheme = () => {
      if (content.themeMode === 'dark') {
        root.classList.add('dark');
      } else if (content.themeMode === 'light') {
        root.classList.remove('dark');
      } else if (content.themeMode === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    };

    applyTheme();

    if (content.themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', applyTheme);
      return () => mediaQuery.removeEventListener('change', applyTheme);
    }
  }, [content.themeMode]);

  // Effect for dynamically loading Google Fonts.
  useEffect(() => {
    if (!content.fontFamily || !GOOGLE_FONTS[content.fontFamily]) return;

    const link = document.createElement('link');
    link.href = GOOGLE_FONTS[content.fontFamily];
    link.rel = 'stylesheet';
    link.id = `font-${content.fontFamily}`;

    // Remove existing font link if it exists
    const existingLink = document.getElementById(`font-${content.fontFamily}`);
    if (existingLink) {
      document.head.removeChild(existingLink);
    }

    document.head.appendChild(link);

    return () => {
      const linkToRemove = document.getElementById(`font-${content.fontFamily}`);
      if (linkToRemove) {
        document.head.removeChild(linkToRemove);
      }
    };
  }, [content.fontFamily]);

  // Effect for updating page metadata
  useEffect(() => {
    document.title = content.seo.title;
    
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        if (isProperty) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    updateMetaTag('description', content.seo.description);
    updateMetaTag('keywords', content.seo.keywords);
    updateMetaTag('author', content.seo.author);
    
    // Open Graph tags
    updateMetaTag('og:title', content.seo.title, true);
    updateMetaTag('og:description', content.seo.description, true);
    updateMetaTag('og:image', content.seo.ogImage, true);
    updateMetaTag('og:type', 'website', true);
    
    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', content.seo.title);
    updateMetaTag('twitter:description', content.seo.description);
    updateMetaTag('twitter:image', content.seo.ogImage);
  }, [content.seo]);

  // Effect for calculating countdown time.
  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetDate = new Date(content.countdownTarget);
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [content.countdownTarget]);

  // --- Handlers ---

  // Handler for updating content and saving to Firebase.
  const handleContentChange = useCallback(async (newContent: PageContent) => {
    setContent(newContent);
    const result = await saveContent(newContent);
    return result;
  }, [saveContent]);

  // Function to toggle theme mode between light/dark/system.
  const toggleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(content.themeMode);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    handleContentChange({ ...content, themeMode: nextTheme });
  };

  // Show loading spinner while authentication or content is loading
  if (authLoading || contentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen text-gray-800 dark:text-gray-200 transition-colors duration-300"
      style={{ fontFamily: `'${content.fontFamily}', sans-serif` }}
    >
      <main className="lg:grid lg:grid-cols-2 min-h-screen">
        <div className="flex flex-col justify-between p-6 sm:p-8 md:p-12 lg:p-16">
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Conditional Logo Rendering */}
            {content.showLogo && (
              content.logoType === 'text' ? (
                <h1 className="font-bold tracking-tight" style={{ fontSize: `${content.logoSize}px` }}>
                  {content.logoText}
                </h1>
              ) : (
                <img 
                  src={getLogoImageUrl(content, getCurrentTheme(content.themeMode))} 
                  alt="Logo" 
                  style={{ width: `${content.logoImageWidth}px`, height: 'auto' }}
                />
              )
            )}
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              {content.socials.map((social) => (
                social.url && <a 
                  key={social.id} 
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-gray-500 dark:hover:text-gray-400 transition-colors" 
                  style={{ fontSize: `${content.socialIconSize}px` }}
                  aria-label={social.label}
                >
                  <Icon name={social.icon as any} />
                </a>
              ))}
            </div>
          </header>

          <section className="flex flex-col justify-center flex-grow py-8 sm:py-12">
            <h2 
              className="font-extrabold mb-6 sm:mb-8 max-w-lg leading-tight"
              style={{ 
                fontSize: `${content.headingSize}px`, 
                fontFamily: `'${content.headingFontFamily}', sans-serif` 
              }}
            >
              {content.heading}
            </h2>
            {content.showCountdown && (
              <div className="flex flex-wrap gap-2 sm:gap-4 mb-6 sm:mb-8">
                <CountdownUnit value={timeLeft.days} label="Days" accentColor={content.countdownAccentColor} />
                <CountdownUnit value={timeLeft.hours} label="Hours" accentColor={content.countdownAccentColor} />
                <CountdownUnit value={timeLeft.minutes} label="Minutes" accentColor={content.countdownAccentColor} />
                <CountdownUnit value={timeLeft.seconds} label="Seconds" accentColor={content.countdownAccentColor} />
              </div>
            )}
            <div 
              className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-8 sm:mb-12 max-w-lg leading-relaxed prose prose-lg dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: content.description }}
            />
            <div className="flex flex-col sm:flex-row gap-4 max-w-md">
              <button 
                onClick={() => setIsSubscribeModalOpen(true)}
                className="px-6 py-3 text-white font-semibold rounded-md transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-900"
                style={{ 
                  backgroundColor: content.accentColor,
                  color: getContrastingTextColor(content.accentColor),
                  borderColor: content.accentColor,
                  '--tw-ring-color': content.accentColor
                } as React.CSSProperties}
              >
                {content.subscribeButtonText}
              </button>
            </div>
          </section>

          {/* Mobile Images Display (before footer on mobile) */}
          {content.mobileImages.enabled && (
            <div className="lg:hidden mt-4 mb-8">
              <MobileImageDisplay settings={content.mobileImages} />
            </div>
          )}

          <footer className="text-center sm:text-left">
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4">
              {content.interests.map((interest, index) => (
                <span key={index} className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm">
                  {interest}
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {content.footerText}
            </p>
          </footer>
        </div>

        {/* Right Column - Side Image (hidden on mobile when mobile images are enabled) */}
        <div className={`relative ${content.mobileImages.enabled ? 'hidden lg:block' : 'hidden lg:block'}`}>
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${content.sideImageUrl})` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          </div>
        </div>
      </main>

      {/* Fixed Controls */}
      <div className="fixed top-4 right-4 flex flex-col space-y-2 z-50">
          {user && (
            // Show settings button only for authenticated users
            <button onClick={() => setIsSettingsOpen(true)} aria-label="Open settings" className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
              <Icon name="gear" className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>
          )}
          <button onClick={toggleTheme} aria-label="Toggle theme" className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
            <Icon name={document.documentElement.classList.contains('dark') ? 'sun' : 'moon'} className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
      </div>

      {/* Settings Panel (modal) - Only accessible when authenticated */}
      {isSettingsOpen && user && (
        <SettingsPanel 
          content={content} 
          onContentChange={handleContentChange} 
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {/* Subscribe Modal */}
      {isSubscribeModalOpen && (
        <SubscribeModal 
          isOpen={isSubscribeModalOpen}
          onClose={() => setIsSubscribeModalOpen(false)}
          accentColor={content.accentColor}
          content={content.subscribeModal}
        />
      )}
    </div>
  );
};

export default ComingSoonPage;