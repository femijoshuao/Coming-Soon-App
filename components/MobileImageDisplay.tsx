import React, { useState } from 'react';
import Icon from './Icon';
import type { MobileImageSettings } from '../types';

interface MobileImageDisplayProps {
  settings: MobileImageSettings;
}

/**
 * Mobile-only image display component that shows either a single image or gallery
 * Only visible on mobile devices (< 1024px)
 */
const MobileImageDisplay: React.FC<MobileImageDisplayProps> = ({ settings }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Don't render if disabled, no settings, or no images
  if (!settings || !settings.enabled || !settings.images || settings.images.length === 0) {
    return null;
  }

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % settings.images.length);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev - 1 + settings.images.length) % settings.images.length);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!lightboxOpen) return;
    
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'ArrowLeft') goToPrevious();
  };

  return (
    <>
      {/* Mobile Image Display - Only visible on screens < 1024px */}
      <div className="lg:hidden mt-8 px-6 sm:px-8">
        {settings.displayType === 'single' ? (
          // Single Image Display
          <div 
            className="relative rounded-2xl overflow-hidden shadow-lg cursor-pointer transform transition-transform hover:scale-[1.02] active:scale-[0.98]"
            onClick={() => openLightbox(0)}
          >
            <img 
              src={settings.images[0].url} 
              alt={settings.images[0].description || 'Display image'}
              className="w-full h-auto object-cover"
              style={{ maxHeight: '400px' }}
            />
            {settings.images[0].description && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-white text-sm">{settings.images[0].description}</p>
              </div>
            )}
            {/* Zoom hint */}
            <div className="absolute top-4 right-4 bg-black/50 rounded-full p-2">
              <Icon name="search" className="w-5 h-5 text-white" />
            </div>
          </div>
        ) : (
          // Gallery Display
          <div className="space-y-4">
            {/* Gallery Grid */}
            <div className="grid grid-cols-2 gap-3">
              {settings.images.map((image, index) => (
                <div
                  key={index}
                  className="relative rounded-xl overflow-hidden shadow-md cursor-pointer transform transition-all hover:scale-[1.05] active:scale-[0.95]"
                  onClick={() => openLightbox(index)}
                >
                  <div className="aspect-square">
                    <img 
                      src={image.url} 
                      alt={image.description || `Gallery image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
                    <Icon name="search" className="w-6 h-6 text-white opacity-0 hover:opacity-100 transition-opacity" />
                  </div>
                  {/* Image counter badge */}
                  <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                    {index + 1}/{settings.images.length}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 animate-fadeIn"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            aria-label="Close lightbox"
          >
            <Icon name="close" className="w-6 h-6 text-white" />
          </button>

          {/* Navigation Buttons - Only show for gallery with multiple images */}
          {settings.displayType === 'gallery' && settings.images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
                aria-label="Previous image"
              >
                <Icon name="chevron-left" className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
                aria-label="Next image"
              >
                <Icon name="chevron-right" className="w-6 h-6 text-white" />
              </button>
            </>
          )}

          {/* Image Counter */}
          {settings.displayType === 'gallery' && settings.images.length > 1 && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium">
              {currentImageIndex + 1} / {settings.images.length}
            </div>
          )}

          {/* Main Image */}
          <div 
            className="relative max-w-5xl max-h-[85vh] animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={settings.images[currentImageIndex].url} 
              alt={settings.images[currentImageIndex].description || `Image ${currentImageIndex + 1}`}
              className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-lg"
            />
            {/* Image Description */}
            {settings.images[currentImageIndex].description && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                <p className="text-white text-center text-sm sm:text-base">
                  {settings.images[currentImageIndex].description}
                </p>
              </div>
            )}
          </div>

          {/* Thumbnail strip for gallery */}
          {settings.displayType === 'gallery' && settings.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 p-2 bg-black/60 rounded-lg max-w-[90vw] overflow-x-auto">
              {settings.images.map((image, index) => (
                <button
                  key={index}
                  onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(index); }}
                  className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                    index === currentImageIndex 
                      ? 'border-white scale-110' 
                      : 'border-white/30 hover:border-white/60'
                  }`}
                >
                  <img 
                    src={image.url} 
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default MobileImageDisplay;
