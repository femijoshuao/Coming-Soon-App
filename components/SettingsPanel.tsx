import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase-config';
import type { PageContent, SocialLink } from '../types';
import Icon from './Icon';
import SubscriberManagement from './SubscriberManagement';
import TinyMCEEditor from './TinyMCEEditor';

interface SettingsPanelProps {
  content: PageContent;
  // Return a promise so save success/failure can be handled properly
  onContentChange: (newContent: PageContent) => Promise<{ success: boolean; message: string }>;
  onClose: () => void;
}

// A list of Google Fonts to choose from.
const FONT_OPTIONS = ['Inter', 'Roboto', 'Playfair Display', 'Roboto Mono'];

// Available social media icons
const SOCIAL_ICON_OPTIONS = [
  'x', 'instagram', 'youtube', 'whatsapp', 'facebook', 'linkedin', 
  'github', 'tiktok', 'snapchat', 'pinterest', 'reddit', 'discord', 
  'telegram', 'twitch', 'spotify', 'medium', 'dribbble', 'behance'
];

/**
 * A slide-out panel for editing the page's content in real-time.
 * It holds its own form state and calls `onContentChange` to update the parent App component.
 */
const SettingsPanel: React.FC<SettingsPanelProps> = ({ content, onContentChange, onClose }) => {
  // Ensure mobileImages is properly initialized
  const initialContent = {
    ...content,
    mobileImages: content.mobileImages || {
      enabled: false,
      displayType: 'single' as const,
      images: []
    }
  };
  
  // Local state for the form, initialized with the content from props.
  const [formData, setFormData] = useState<PageContent>(initialContent);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [showSubscribers, setShowSubscribers] = useState(false);

  // Effect to sync local form state if the parent's content changes.
  useEffect(() => {
    const updatedContent = {
      ...content,
      mobileImages: content.mobileImages || {
        enabled: false,
        displayType: 'single' as const,
        images: []
      }
    };
    setFormData(updatedContent);
  }, [content]);

  // FIX: Widened the type to include HTMLSelectElement to handle onChange for the font family dropdown.
  // Generic handler for most text, textarea, and select inputs.
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateContent({ [name]: value });
  };
  
  // Handler for numeric inputs like range sliders.
  const handleNumericInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateContent({ [name]: parseInt(value, 10) });
  };

  // Handler for image file uploads - converts to base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size should be less than 2MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      updateContent({ [fieldName]: base64String });
    };
    reader.readAsDataURL(file);
  };

  // Handler for nested image uploads (e.g., seo.ogImage)
  const handleNestedImageUpload = (e: React.ChangeEvent<HTMLInputElement>, parentKey: 'seo' | 'subscribeModal', childKey: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size should be less than 2MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      handleNestedChange(parentKey, childKey, base64String);
    };
    reader.readAsDataURL(file);
  };
  
  // Handler for adding a new social link.
  const handleAddSocialLink = () => {
    const newSocial: SocialLink = {
      id: Date.now().toString(),
      icon: 'x',
      url: '',
      label: 'New Social Link',
    };
    updateContent({ socials: [...formData.socials, newSocial] });
  };

  // Handler for updating a social link.
  const handleSocialChange = (id: string, field: keyof SocialLink, value: string) => {
    const updatedSocials = formData.socials.map(social =>
      social.id === id ? { ...social, [field]: value } : social
    );
    updateContent({ socials: updatedSocials });
  };

  // Handler for removing a social link.
  const handleRemoveSocialLink = (id: string) => {
    const updatedSocials = formData.socials.filter(social => social.id !== id);
    updateContent({ socials: updatedSocials });
  };

  // Handler for the comma-separated interests input.
  const handleInterestsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const interestsArray = e.target.value.split(',').map(item => item.trim());
    updateContent({ interests: interestsArray });
  };

  // Handler for radio button changes (e.g., logo type).
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateContent({ [name]: value });
  };

  // Handler for checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    updateContent({ [name]: checked });
  };

  // Handler for nested object changes (SEO and Subscribe Modal)
  const handleNestedChange = (parent: 'seo' | 'subscribeModal', field: string, value: string) => {
    updateContent({
      [parent]: { ...formData[parent], [field]: value }
    });
  };

  // Centralized function to update form state and notify the parent.
  const updateContent = (newValues: Partial<PageContent>) => {
    console.log('updateContent called with:', newValues);
    const newFormData = { ...formData, ...newValues };
    console.log('New formData after update:', {
      mobileImages: newFormData.mobileImages
    });
    setFormData(newFormData);
    // Don't auto-save, just update local state
  };

  // Save changes to Firebase
  const handleSave = async () => {
    setSaving(true);
    setSaveMessage('');
    
    console.log('SettingsPanel: Attempting to save formData:', {
      mobileImages: formData.mobileImages,
      mobileImagesEnabled: formData.mobileImages?.enabled,
      imagesCount: formData.mobileImages?.images?.length
    });
    
    const result = await onContentChange(formData);
    
    setSaving(false);
    if (result?.success) {
      setSaveMessage('✓ Saved successfully!');
    } else {
      setSaveMessage(`✗ Save failed: ${result?.message || 'Unknown error'}`);
      console.error('SettingsPanel: Save failed', result);
    }
    
    // Clear success message after 3 seconds
    setTimeout(() => setSaveMessage(''), 3000);
  };

  // Logout handler
  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await signOut(auth);
      onClose();
    }
  };

  return (
    <>
      {showSubscribers && (
        <SubscriberManagement onClose={() => setShowSubscribers(false)} />
      )}
      
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-end" onClick={onClose}>
        <div 
          className="w-full sm:max-w-md h-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-2xl p-4 sm:p-6 overflow-y-auto transform transition-transform duration-300 ease-in-out flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4 sm:mb-6 border-b dark:border-gray-700 pb-3 sm:pb-4">
            <h2 className="text-xl sm:text-2xl font-bold">Settings</h2>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowSubscribers(true)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title="View Subscribers"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </button>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                <Icon name="close" className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>

        <div className="space-y-6 sm:space-y-8">
          {/* General Settings */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold">General Settings</legend>
            
            <div>
              <label className="block text-sm font-medium mb-1">Theme Mode</label>
              <select 
                name="themeMode" 
                value={formData.themeMode} 
                onChange={handleInputChange} 
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700"
              >
                <option value="system">Automatic (System)</option>
                <option value="light">Light Mode</option>
                <option value="dark">Dark Mode</option>
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Choose between light, dark, or automatic theme based on system preference.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                id="showLogo" 
                name="showLogo" 
                checked={formData.showLogo} 
                onChange={handleCheckboxChange}
                className="w-4 h-4 rounded border-gray-300 dark:border-gray-600"
              />
              <label htmlFor="showLogo" className="text-sm font-medium cursor-pointer">
                Show Logo
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                id="showCountdown" 
                name="showCountdown" 
                checked={formData.showCountdown} 
                onChange={handleCheckboxChange}
                className="w-4 h-4 rounded border-gray-300 dark:border-gray-600"
              />
              <label htmlFor="showCountdown" className="text-sm font-medium cursor-pointer">
                Show Countdown Timer
              </label>
            </div>
          </fieldset>

          {/* Logo Settings */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold">Logo</legend>
            <div className="flex space-x-4">
              <label><input type="radio" name="logoType" value="text" checked={formData.logoType === 'text'} onChange={handleRadioChange}/> Text</label>
              <label><input type="radio" name="logoType" value="image" checked={formData.logoType === 'image'} onChange={handleRadioChange}/> Image</label>
            </div>
            {formData.logoType === 'text' ? (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Logo Text</label>
                  <input type="text" name="logoText" value={formData.logoText} onChange={handleInputChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700"/>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Logo Font Size: {formData.logoSize}px</label>
                  <input type="range" name="logoSize" min="16" max="64" value={formData.logoSize} onChange={handleNumericInputChange} className="w-full"/>
                </div>
              </>
            ) : (
               <>
                {/* Light Mode Logo */}
                <div>
                  <label className="block text-sm font-medium mb-1">Light Mode Logo</label>
                  <div className="space-y-2">
                    {/* Image Preview */}
                    {formData.logoLightImageUrl && (
                      <div className="relative inline-block">
                        <img 
                          src={formData.logoLightImageUrl} 
                          alt="Light mode logo preview" 
                          className="max-h-24 border border-gray-300 dark:border-gray-600 rounded bg-white p-2"
                        />
                        <span className="absolute -top-2 -right-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Light</span>
                      </div>
                    )}
                    
                    {/* URL Input */}
                    <input 
                      type="text" 
                      name="logoLightImageUrl" 
                      value={formData.logoLightImageUrl || ''} 
                      onChange={handleInputChange} 
                      placeholder="https://example.com/light-logo.png"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700"
                    />
                    
                    {/* File Upload */}
                    <div className="flex items-center gap-2">
                      <label className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md hover:border-yellow-500 dark:hover:border-yellow-400 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                          <span className="text-sm">Upload Light Logo</span>
                        </div>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleImageUpload(e, 'logoLightImageUrl')}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Dark Mode Logo */}
                <div>
                  <label className="block text-sm font-medium mb-1">Dark Mode Logo</label>
                  <div className="space-y-2">
                    {/* Image Preview */}
                    {formData.logoDarkImageUrl && (
                      <div className="relative inline-block">
                        <img 
                          src={formData.logoDarkImageUrl} 
                          alt="Dark mode logo preview" 
                          className="max-h-24 border border-gray-300 dark:border-gray-600 rounded bg-gray-800 p-2"
                        />
                        <span className="absolute -top-2 -right-2 text-xs bg-gray-800 text-white px-2 py-1 rounded">Dark</span>
                      </div>
                    )}
                    
                    {/* URL Input */}
                    <input 
                      type="text" 
                      name="logoDarkImageUrl" 
                      value={formData.logoDarkImageUrl || ''} 
                      onChange={handleInputChange} 
                      placeholder="https://example.com/dark-logo.png"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700"
                    />
                    
                    {/* File Upload */}
                    <div className="flex items-center gap-2">
                      <label className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md hover:border-gray-500 dark:hover:border-gray-400 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                          </svg>
                          <span className="text-sm">Upload Dark Logo</span>
                        </div>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleImageUpload(e, 'logoDarkImageUrl')}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Legacy Logo (for backward compatibility) */}
                <div className="border-t pt-4">
                  <label className="block text-sm font-medium mb-1">Legacy Logo (Fallback)</label>
                  <div className="space-y-2">
                    {/* Image Preview */}
                    {formData.logoImageUrl && (
                      <div className="relative inline-block">
                        <img 
                          src={formData.logoImageUrl} 
                          alt="Legacy logo preview" 
                          className="max-h-20 border border-gray-300 dark:border-gray-600 rounded opacity-75"
                        />
                        <span className="absolute -top-2 -right-2 text-xs bg-gray-500 text-white px-2 py-1 rounded">Legacy</span>
                      </div>
                    )}
                    
                    {/* URL Input */}
                    <input 
                      type="text" 
                      name="logoImageUrl" 
                      value={formData.logoImageUrl || ''} 
                      onChange={handleInputChange} 
                      placeholder="https://example.com/legacy-logo.png"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700"
                    />
                    
                    {/* File Upload */}
                    <div className="flex items-center gap-2">
                      <label className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <span className="text-sm">Upload Legacy Logo</span>
                        </div>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleImageUpload(e, 'logoImageUrl')}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Upload separate logos for light and dark modes, or use legacy logo as fallback. Max size: 2MB each.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Logo Image Width: {formData.logoImageWidth}px</label>
                  <input type="range" name="logoImageWidth" min="50" max="300" value={formData.logoImageWidth} onChange={handleNumericInputChange} className="w-full"/>
                </div>
              </>
            )}
          </fieldset>
          
          {/* Main Content Settings */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold">Main Content</legend>
            <div>
              <label className="block text-sm font-medium mb-1">Main Heading</label>
              <textarea name="heading" value={formData.heading} onChange={handleInputChange} rows={3} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700"/>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Heading Font Size: {formData.headingSize || 48}px</label>
              <input type="range" name="headingSize" min="24" max="80" value={formData.headingSize || 48} onChange={handleNumericInputChange} className="w-full"/>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Heading Font Family</label>
              <select name="headingFontFamily" value={formData.headingFontFamily || 'Inter'} onChange={handleInputChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700">
                {FONT_OPTIONS.map((font) => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Countdown Target Date</label>
              <input type="datetime-local" name="countdownTarget" value={formData.countdownTarget} onChange={handleInputChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700"/>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <TinyMCEEditor
                value={formData.description}
                onChange={(content) => updateContent({ description: content })}
                placeholder="Enter your description using the rich text editor..."
                height={250}
              />
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                <p>Use the rich text editor above to format your content with bold, italic, lists, links, and more.</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subscribe Button Text</label>
              <input type="text" name="subscribeButtonText" value={formData.subscribeButtonText} onChange={handleInputChange} placeholder="e.g., Subscribe, Notify Me, Join Waitlist" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700"/>
            </div>
          </fieldset>

          {/* Style Settings */}
          <fieldset className="space-y-4">
             <legend className="text-lg font-semibold">Styles</legend>
             <div>
                <label className="block text-sm font-medium mb-1">Font Family</label>
                <select name="fontFamily" value={formData.fontFamily} onChange={handleInputChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700">
                  {FONT_OPTIONS.map(font => <option key={font} value={font}>{font}</option>)}
                </select>
             </div>
             <div>
                <label className="block text-sm font-medium mb-1">Accent Color (Interests Tags)</label>
                <input type="color" name="accentColor" value={formData.accentColor} onChange={handleInputChange} className="w-full h-10 p-1 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700"/>
             </div>
             <div>
                <label className="block text-sm font-medium mb-1">Countdown Timer Color</label>
                <input type="color" name="countdownAccentColor" value={formData.countdownAccentColor} onChange={handleInputChange} className="w-full h-10 p-1 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700"/>
             </div>
          </fieldset>

          {/* Social Links */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold">Social Links</legend>
            <div>
              <label className="block text-sm font-medium mb-1">Icon Size: {formData.socialIconSize}px</label>
              <input type="range" name="socialIconSize" min="16" max="32" value={formData.socialIconSize} onChange={handleNumericInputChange} className="w-full"/>
            </div>
            
            <div className="space-y-3">
              {formData.socials.map((social) => (
                <div key={social.id} className="p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium">Social Link</label>
                    <button
                      type="button"
                      onClick={() => handleRemoveSocialLink(social.id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                      aria-label="Remove social link"
                    >
                      <Icon name="trash" className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium mb-1">Label</label>
                    <input
                      type="text"
                      value={social.label}
                      onChange={(e) => handleSocialChange(social.id, 'label', e.target.value)}
                      placeholder="e.g., Twitter, Instagram"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium mb-1">Icon</label>
                    <select
                      value={social.icon}
                      onChange={(e) => handleSocialChange(social.id, 'icon', e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
                    >
                      {SOCIAL_ICON_OPTIONS.map(icon => (
                        <option key={icon} value={icon}>
                          {icon.charAt(0).toUpperCase() + icon.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium mb-1">URL</label>
                    <input
                      type="url"
                      value={social.url}
                      onChange={(e) => handleSocialChange(social.id, 'url', e.target.value)}
                      placeholder="https://..."
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <button
              type="button"
              onClick={handleAddSocialLink}
              className="w-full p-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md hover:border-gray-400 dark:hover:border-gray-500 transition-colors flex items-center justify-center gap-2"
            >
              <Icon name="plus" className="w-4 h-4" />
              Add Social Link
            </button>
          </fieldset>
          
          {/* Footer and Meta Settings */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold">Footer & Meta</legend>
            <div>
              <label className="block text-sm font-medium mb-1">Interests (comma-separated)</label>
              <input type="text" name="interests" value={formData.interests.join(', ')} onChange={handleInterestsChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700"/>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Footer Text</label>
              <input type="text" name="footerText" value={formData.footerText} onChange={handleInputChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700"/>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Background/Side Image</label>
              <div className="space-y-2">
                {/* Image Preview */}
                {formData.sideImageUrl && (
                  <div className="relative inline-block">
                    <img 
                      src={formData.sideImageUrl} 
                      alt="Background preview" 
                      className="max-h-32 border border-gray-300 dark:border-gray-600 rounded"
                    />
                  </div>
                )}
                
                {/* URL Input */}
                <input 
                  type="text" 
                  name="sideImageUrl" 
                  value={formData.sideImageUrl} 
                  onChange={handleInputChange} 
                  placeholder="https://example.com/background.jpg"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700"
                />
                
                {/* File Upload */}
                <div className="flex items-center gap-2">
                  <label className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span className="text-sm">Upload Image</span>
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleImageUpload(e, 'sideImageUrl')}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Upload an image or paste a URL. Recommended: Vertical images (9:16 aspect ratio). Max size: 2MB
                </p>
              </div>
            </div>
          </fieldset>

          {/* Subscribe Modal Content */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold">Subscribe Modal Content</legend>
            <div>
              <label className="block text-sm font-medium mb-1">Modal Title</label>
              <input 
                type="text" 
                value={formData.subscribeModal.title} 
                onChange={(e) => handleNestedChange('subscribeModal', 'title', e.target.value)}
                placeholder="e.g., Stay Updated"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Modal Subtitle</label>
              <textarea 
                value={formData.subscribeModal.subtitle} 
                onChange={(e) => handleNestedChange('subscribeModal', 'subtitle', e.target.value)}
                placeholder="Subscribe to get notified..."
                rows={3}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Success Title</label>
              <input 
                type="text" 
                value={formData.subscribeModal.successTitle} 
                onChange={(e) => handleNestedChange('subscribeModal', 'successTitle', e.target.value)}
                placeholder="e.g., 🎉 Success!"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Success Message</label>
              <textarea 
                value={formData.subscribeModal.successMessage} 
                onChange={(e) => handleNestedChange('subscribeModal', 'successMessage', e.target.value)}
                placeholder="Thank you for subscribing..."
                rows={2}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Privacy Note</label>
              <input 
                type="text" 
                value={formData.subscribeModal.privacyNote} 
                onChange={(e) => handleNestedChange('subscribeModal', 'privacyNote', e.target.value)}
                placeholder="We respect your privacy..."
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700"
              />
            </div>
          </fieldset>

          {/* SEO Settings */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold">SEO Settings</legend>
            <div>
              <label className="block text-sm font-medium mb-1">Page Title</label>
              <input 
                type="text" 
                value={formData.seo.title} 
                onChange={(e) => handleNestedChange('seo', 'title', e.target.value)}
                placeholder="Coming Soon - Your Brand"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Appears in browser tab and search results.</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Meta Description</label>
              <textarea 
                value={formData.seo.description} 
                onChange={(e) => handleNestedChange('seo', 'description', e.target.value)}
                placeholder="Brief description for search engines..."
                rows={3}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Keep it under 160 characters for best results.</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Keywords (comma-separated)</label>
              <input 
                type="text" 
                value={formData.seo.keywords} 
                onChange={(e) => handleNestedChange('seo', 'keywords', e.target.value)}
                placeholder="coming soon, launch, website"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Author</label>
              <input 
                type="text" 
                value={formData.seo.author} 
                onChange={(e) => handleNestedChange('seo', 'author', e.target.value)}
                placeholder="Your Name or Brand"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Social Share Image (OG Image)</label>
              <div className="space-y-2">
                {/* Image Preview */}
                {formData.seo.ogImage && (
                  <div className="relative inline-block">
                    <img 
                      src={formData.seo.ogImage} 
                      alt="OG Image preview" 
                      className="max-h-32 border border-gray-300 dark:border-gray-600 rounded"
                    />
                  </div>
                )}
                
                {/* URL Input */}
                <input 
                  type="text" 
                  value={formData.seo.ogImage} 
                  onChange={(e) => handleNestedChange('seo', 'ogImage', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700"
                />
                
                {/* File Upload */}
                <div className="flex items-center gap-2">
                  <label className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span className="text-sm">Upload Image</span>
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleNestedImageUpload(e, 'seo', 'ogImage')}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Image shown when shared on social media (1200x630px recommended). Max size: 2MB
                </p>
              </div>
            </div>
          </fieldset>

          {/* Mobile Images Settings */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold">Mobile Images (Below Subscribe Button)</legend>
            
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                id="mobileImagesEnabled" 
                checked={formData.mobileImages?.enabled || false} 
                onChange={(e) => updateContent({
                  mobileImages: {
                    ...(formData.mobileImages || { enabled: false, displayType: 'single', images: [] }),
                    enabled: e.target.checked
                  }
                })}
                className="w-4 h-4 rounded border-gray-300 dark:border-gray-600"
              />
              <label htmlFor="mobileImagesEnabled" className="text-sm font-medium cursor-pointer">
                Enable Mobile Images (Only visible on mobile devices)
              </label>
            </div>

            {formData.mobileImages?.enabled && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Display Type</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="mobileImageDisplayType" 
                        value="single" 
                        checked={formData.mobileImages?.displayType === 'single'} 
                        onChange={() => updateContent({
                          mobileImages: {
                            ...(formData.mobileImages || { enabled: true, displayType: 'single', images: [] }),
                            displayType: 'single'
                          }
                        })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Single Image</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="mobileImageDisplayType" 
                        value="gallery" 
                        checked={formData.mobileImages?.displayType === 'gallery'} 
                        onChange={() => updateContent({
                          mobileImages: {
                            ...(formData.mobileImages || { enabled: true, displayType: 'gallery', images: [] }),
                            displayType: 'gallery'
                          }
                        })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Gallery (Grid)</span>
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Single image or grid gallery with lightbox effect
                  </p>
                </div>

                {/* Image List */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium">
                    Images {formData.mobileImages?.displayType === 'single' ? '(Only first image will be shown)' : ''}
                  </label>
                  
                  {formData.mobileImages?.images?.map((image, index) => (
                    <div key={index} className="p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Image {index + 1}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = (formData.mobileImages?.images || []).filter((_, i) => i !== index);
                            updateContent({
                              mobileImages: {
                                ...(formData.mobileImages || { enabled: true, displayType: 'single', images: [] }),
                                images: newImages
                              }
                            });
                          }}
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                          aria-label="Remove image"
                        >
                          <Icon name="trash" className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Image Preview */}
                      {image.url && (
                        <div className="relative inline-block">
                          <img 
                            src={image.url} 
                            alt={image.description || `Mobile image ${index + 1}`}
                            className="max-h-32 border border-gray-300 dark:border-gray-600 rounded"
                          />
                        </div>
                      )}

                      {/* URL Input */}
                      <div>
                        <label className="block text-xs font-medium mb-1">Image URL</label>
                        <input 
                          type="text" 
                          value={image.url} 
                          onChange={(e) => {
                            const newImages = [...(formData.mobileImages?.images || [])];
                            newImages[index] = { ...newImages[index], url: e.target.value };
                            updateContent({
                              mobileImages: {
                                ...(formData.mobileImages || { enabled: true, displayType: 'single', images: [] }),
                                images: newImages
                              }
                            });
                          }}
                          placeholder="https://example.com/image.jpg"
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
                        />
                      </div>

                      {/* File Upload */}
                      <div className="flex items-center gap-2">
                        <label className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-center gap-2 px-3 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                            <Icon name="upload" className="w-4 h-4" />
                            <span className="text-xs">Upload Image</span>
                          </div>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              
                              if (file.size > 2 * 1024 * 1024) {
                                alert('Image size should be less than 2MB');
                                return;
                              }
                              
                              if (!file.type.startsWith('image/')) {
                                alert('Please upload an image file');
                                return;
                              }

                              const reader = new FileReader();
                              reader.onloadend = () => {
                                const base64String = reader.result as string;
                                const newImages = [...(formData.mobileImages?.images || [])];
                                newImages[index] = { ...newImages[index], url: base64String };
                                updateContent({
                                  mobileImages: {
                                    ...(formData.mobileImages || { enabled: true, displayType: 'single', images: [] }),
                                    images: newImages
                                  }
                                });
                              };
                              reader.readAsDataURL(file);
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-xs font-medium mb-1">Description (Optional)</label>
                        <input 
                          type="text" 
                          value={image.description} 
                          onChange={(e) => {
                            const newImages = [...(formData.mobileImages?.images || [])];
                            newImages[index] = { ...newImages[index], description: e.target.value };
                            updateContent({
                              mobileImages: {
                                ...(formData.mobileImages || { enabled: true, displayType: 'single', images: [] }),
                                images: newImages
                              }
                            });
                          }}
                          placeholder="Describe this image..."
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
                        />
                      </div>
                    </div>
                  ))}

                  {/* Add Image Button */}
                  <button
                    type="button"
                    onClick={() => {
                      const newImages = [...((formData.mobileImages?.images) || []), { url: '', description: '' }];
                      updateContent({
                        mobileImages: {
                          ...(formData.mobileImages || { enabled: true, displayType: 'single', images: [] }),
                          images: newImages
                        }
                      });
                    }}
                    className="w-full p-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md hover:border-gray-400 dark:hover:border-gray-500 transition-colors flex items-center justify-center gap-2"
                  >
                    <Icon name="plus" className="w-4 h-4" />
                    Add Image
                  </button>

                  {formData.mobileImages?.displayType === 'single' && (formData.mobileImages?.images?.length || 0) > 1 && (
                    <p className="text-xs text-yellow-600 dark:text-yellow-400">
                      ⚠️ Only the first image will be displayed in single image mode
                    </p>
                  )}
                </div>
              </>
            )}
          </fieldset>
        </div>

        {/* Footer with Save and Logout buttons */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t dark:border-gray-700 pt-4 pb-2 mt-6 space-y-3">
          {/* Save Message */}
          {saveMessage && (
            <div className="text-center text-sm text-green-600 dark:text-green-400 font-medium">
              {saveMessage}
            </div>
          )}

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </span>
            ) : (
              'Save Changes'
            )}
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default SettingsPanel;