import React, { useState, useEffect, useCallback } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase-config';
import { usePageContent } from './hooks/usePageContent';
import type { PageContent, TimeLeft, Theme } from './types';
import CountdownUnit from './components/CountdownUnit';
import Icon from './components/Icon';
import SettingsPanel from './components/SettingsPanel';
import SubscribeModal from './components/SubscribeModal';
import AdminLogin from './components/AdminLogin';
import MobileImageDisplay from './components/MobileImageDisplay';
import { parseMarkdown } from './utils/markdown';

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
  countdownTarget: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
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

const App: React.FC = () => {
  // Firebase authentication state
  const [user, authLoading] = useAuthState(auth);
  
  // Load content from Firebase
  const { content: firebaseContent, saveContent, loading: contentLoading } = usePageContent();
  
  // Use Firebase content if available, otherwise use default
  const [content, setContent] = useState<PageContent>(getDefaultContent());

  // Update local content when Firebase content loads
  useEffect(() => {
    if (firebaseContent) {
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
        logoImageUrl: firebaseContent.logoImageUrl || defaultContent.logoImageUrl
      };
      setContent(mergedContent);
    }
  }, [firebaseContent]);

  // State for the calculated time remaining for the countdown.
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  // State to control the visibility of the settings panel.
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  // State to control the visibility of the subscribe modal.
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  // State for showing admin login modal
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  // --- Effects ---

  // Effect for handling theme changes (light/dark mode).
  useEffect(() => {
    const root = window.document.documentElement;
    const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (content.themeMode === 'dark' || (content.themeMode === 'system' && systemIsDark)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [content.themeMode]);
  
  // Effect for dynamically loading Google Font stylesheets.
  useEffect(() => {
    // Remove the previous dynamic font stylesheet, if it exists.
    const existingLink = document.getElementById('dynamic-font-stylesheet');
    if (existingLink) {
      existingLink.remove();
    }

    const fontUrl = GOOGLE_FONTS[content.fontFamily];
    if (fontUrl) {
      // Create a new <link> element for the selected font.
      const link = document.createElement('link');
      link.id = 'dynamic-font-stylesheet';
      link.rel = 'stylesheet';
      link.href = fontUrl;
      // Append the link to the document's head to load the font.
      document.head.appendChild(link);
    }
  }, [content.fontFamily]);


  // --- Logic and Handlers ---

  // Callback to calculate the time left until the target date. Memoized for efficiency.
  const calculateTimeLeft = useCallback(() => {
    const difference = +new Date(content.countdownTarget) - +new Date();
    let newTimeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

    if (difference > 0) {
      newTimeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return newTimeLeft;
  }, [content.countdownTarget]);

  // Effect for the countdown timer. It recalculates the time left every second.
  useEffect(() => {
    setTimeLeft(calculateTimeLeft()); // Set initial time
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer); // Cleanup on component unmount
  }, [calculateTimeLeft]);

  // Effect for updating SEO meta tags dynamically
  useEffect(() => {
    // Update document title
    document.title = content.seo.title;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.content = content;
    };

    updateMetaTag('description', content.seo.description);
    updateMetaTag('keywords', content.seo.keywords);
    updateMetaTag('author', content.seo.author);
    updateMetaTag('og:title', content.seo.title, true);
    updateMetaTag('og:description', content.seo.description, true);
    updateMetaTag('og:image', content.seo.ogImage, true);
    updateMetaTag('og:type', 'website', true);
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', content.seo.title);
    updateMetaTag('twitter:description', content.seo.description);
    updateMetaTag('twitter:image', content.seo.ogImage);
  }, [content.seo]);

  // Toggles the theme between light and dark.
  const toggleTheme = () => {
    const isCurrentlyDark = document.documentElement.classList.contains('dark');
    const newTheme: Theme = isCurrentlyDark ? 'light' : 'dark';
    setContent(prev => ({ ...prev, themeMode: newTheme }));
  };

  // Handler to update the main content state from the settings panel.
  const handleContentChange = async (newContent: PageContent) => {
    setContent(newContent);
    // Save to Firebase only if user is authenticated
    if (user) {
      await saveContent(newContent);
    }
  };

  // --- Render ---

  // Show loading state while checking authentication
  if (authLoading || contentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
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
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 sm:mb-8 max-w-lg leading-tight">
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
              className="max-w-lg text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(content.description) }}
            />
            <button 
              onClick={() => setIsSubscribeModalOpen(true)}
              className="w-fit bg-transparent text-gray-800 dark:text-gray-200 border-2 border-gray-800 dark:border-gray-200 rounded-full px-6 py-2 sm:px-8 sm:py-3 font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 hover:text-white dark:hover:text-gray-900 transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm sm:text-base"
            >
              {content.subscribeButtonText}
            </button>

            {/* Mobile Images - Only visible on mobile */}
            {content.mobileImages && <MobileImageDisplay settings={content.mobileImages} />}
          </section>

          <footer className="space-y-4">
             {content.interests.length > 0 && content.interests[0] !== "" && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <span className="text-gray-500 dark:text-gray-400 font-medium text-sm">Interests</span>
                <div className="flex flex-wrap gap-2">
                   {content.interests.map((interest, index) => (
                    <span key={index} className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: content.accentColor, color: getContrastingTextColor(content.accentColor) }}>
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">{content.footerText}</p>
          </footer>
        </div>

        {/* Side Image */}
        <div 
          className="hidden lg:block bg-cover bg-center"
          style={{ backgroundImage: `url(${content.sideImageUrl})` }}
        ></div>
      </main>

      {/* Floating Action Buttons for Settings and Theme */}
      <div className="fixed top-4 right-4 flex flex-col space-y-2 z-50">
          {user ? (
            // Show settings button only for authenticated users
            <button onClick={() => setIsSettingsOpen(true)} aria-label="Open settings" className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
              <Icon name="gear" className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>
          ) : (
            // Show admin login button for guests
            <button onClick={() => setShowAdminLogin(true)} aria-label="Admin login" className="px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all text-sm font-medium text-gray-700 dark:text-gray-300">
              Admin
            </button>
          )}
          <button onClick={toggleTheme} aria-label="Toggle theme" className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
            <Icon name={document.documentElement.classList.contains('dark') ? 'sun' : 'moon'} className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
      </div>

      {/* Admin Login Modal for Guests */}
      {showAdminLogin && !user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative max-w-md w-full mx-4">
            <button 
              onClick={() => setShowAdminLogin(false)}
              className="absolute -top-2 -right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Close admin login"
            >
              <Icon name="x" className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
            <AdminLogin onClose={() => setShowAdminLogin(false)} />
          </div>
        </div>
      )}

      {/* Settings Panel (modal) - Only accessible when authenticated */}
      {isSettingsOpen && user && (
        <SettingsPanel 
          content={content} 
          onContentChange={handleContentChange} 
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {/* Subscribe Modal */}
      <SubscribeModal 
        isOpen={isSubscribeModalOpen}
        onClose={() => setIsSubscribeModalOpen(false)}
        accentColor={content.countdownAccentColor}
        content={content.subscribeModal}
      />
    </div>
  );
};

export default App;