export interface SocialLink {
  id: string;
  icon: string;
  url: string;
  label: string;
}

export interface SEOSettings {
  title: string;
  description: string;
  keywords: string;
  author: string;
  ogImage: string;
}

export interface SubscribeModalContent {
  title: string;
  subtitle: string;
  successTitle: string;
  successMessage: string;
  privacyNote: string;
}

export interface MobileImage {
  url: string;
  description: string;
}

export interface MobileImageSettings {
  enabled: boolean;
  displayType: 'single' | 'gallery';
  images: MobileImage[];
}

export interface PageContent {
  logoType: 'text' | 'image';
  logoText: string;
  logoSize: number; // For text
  logoImageUrl: string; // Legacy field for backward compatibility
  logoLightImageUrl: string; // Light mode logo
  logoDarkImageUrl: string; // Dark mode logo
  logoImageWidth: number; // For image
  heading: string;
  headingSize: number; // Size of the main heading
  headingFontFamily: string; // Font family for the main heading
  countdownTarget: string;
  description: string;
  socials: SocialLink[];
  socialIconSize: number;
  interests: string[];
  footerText: string;
  sideImageUrl: string;
  fontFamily: string;
  accentColor: string;
  countdownAccentColor: string;
  subscribeButtonText: string;
  themeMode: Theme;
  showCountdown: boolean;
  showLogo: boolean;
  subscribeModal: SubscribeModalContent;
  seo: SEOSettings;
  mobileImages: MobileImageSettings;
}

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export type Theme = 'light' | 'dark' | 'system';