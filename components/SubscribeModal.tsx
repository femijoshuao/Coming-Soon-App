import React, { useState } from 'react';
import Icon from './Icon';
import type { SubscribeModalContent } from '../types';
import { saveSubscriber } from '../hooks/usePageContent';

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  accentColor: string;
  content: SubscribeModalContent;
}

/**
 * A beautiful modal for collecting subscriber information.
 * Features smooth animations, form validation, and responsive design.
 */
const SubscribeModal: React.FC<SubscribeModalProps> = ({ isOpen, onClose, accentColor, content }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Don't render if modal is not open
  if (!isOpen) return null;

  // Format phone number to international standard
  const formatPhoneNumber = (value: string) => {
    // Remove all non-numeric characters
    const cleaned = value.replace(/\D/g, '');
    
    // Format as international number with country code
    if (cleaned.length === 0) return '';
    if (cleaned.length <= 3) return `+${cleaned}`;
    if (cleaned.length <= 6) return `+${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    if (cleaned.length <= 10) return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)} ${cleaned.slice(10, 14)}`;
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = { name: '', email: '', phone: '' };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    // Phone is optional, but if provided, validate it
    if (formData.phone.trim()) {
      const cleaned = formData.phone.replace(/\D/g, '');
      if (cleaned.length < 10) {
        newErrors.phone = 'Please enter a valid phone number';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Save to Firebase with phone number
    const result = await saveSubscriber(formData.name, formData.email, formData.phone || undefined);
    
    setIsSubmitting(false);

    if (result.success) {
      setIsSuccess(true);

      // Reset form and close after success message
      setTimeout(() => {
        setFormData({ name: '', email: '', phone: '' });
        setErrors({ name: '', email: '', phone: '' });
        setIsSuccess(false);
        onClose();
      }, 2500);
    } else {
      // Show error if save failed
      setErrors({ ...errors, email: result.message || 'Failed to save. Please try again.' });
    }
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Format phone number as user types
    if (name === 'phone') {
      const formatted = formatPhoneNumber(value);
      setFormData(prev => ({ ...prev, [name]: formatted }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 transform transition-all animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
            {isSuccess ? content.successTitle : content.title}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close modal"
          >
            <Icon name="close" className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {isSuccess ? (
          // Success Message
          <div className="text-center py-8">
            <div className="text-6xl mb-4 animate-bounce">✨</div>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              {content.successMessage}
            </p>
          </div>
        ) : (
          // Subscription Form
          <>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {content.subtitle}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field */}
              <div>
                <label 
                  htmlFor="name" 
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border-2 ${
                    errors.name 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                  } bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all`}
                  placeholder="John Doe"
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500 animate-shake">{errors.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border-2 ${
                    errors.email 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                  } bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all`}
                  placeholder="john@example.com"
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500 animate-shake">{errors.email}</p>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <label 
                  htmlFor="phone" 
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Phone Number <span className="text-gray-500 text-xs">(Optional)</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border-2 ${
                    errors.phone 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                  } bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all`}
                  placeholder="+1 234 567 8900"
                  disabled={isSubmitting}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500 animate-shake">{errors.phone}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-lg font-semibold text-white transition-all transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                style={{ backgroundColor: accentColor }}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Subscribing...
                  </span>
                ) : (
                  'Subscribe Now'
                )}
              </button>
            </form>

            {/* Privacy Note */}
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
              {content.privacyNote}
            </p>
          </>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        .animate-shake {
          animation: shake 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SubscribeModal;
