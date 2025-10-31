import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, deleteDoc, runTransaction } from 'firebase/firestore';
import { db, SITE_ID } from '../firebase-config';
import type { PageContent } from '../types';

/**
 * Hook for managing page content from Firebase Firestore
 */
export const usePageContent = () => {
  const [content, setContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load page content for this specific site
  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, 'sites', SITE_ID, 'settings', 'pageContent');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const loadedContent = docSnap.data() as PageContent;
          console.log('usePageContent: Loaded from Firebase:', {
            mobileImages: loadedContent.mobileImages,
            hasData: docSnap.exists()
          });
          setContent(loadedContent);
        } else {
          console.log('usePageContent: No content in Firebase, using defaults');
          // If no content exists, use default content from App.tsx
          setContent(null);
        }
        setError(null);
      } catch (err: any) {
        console.error('Error loading content:', err);
        setError(err.message || 'Failed to load content');
        setContent(null);
      } finally {
        setLoading(false);
      }
    };
    
    loadContent();
  }, []);

  // Save page content to Firebase
  const saveContent = async (newContent: PageContent) => {
    try {
      console.log('usePageContent: Saving content to Firebase:', {
        mobileImages: newContent.mobileImages,
        fullContent: newContent
      });
      
      // Ensure mobileImages is properly structured before saving
      const contentToSave = {
        ...newContent,
        mobileImages: newContent.mobileImages ? {
          enabled: Boolean(newContent.mobileImages.enabled),
          displayType: newContent.mobileImages.displayType || 'single',
          images: Array.isArray(newContent.mobileImages.images) 
            ? newContent.mobileImages.images.map(img => ({
                url: String(img.url || ''),
                description: String(img.description || '')
              }))
            : []
        } : {
          enabled: false,
          displayType: 'single',
          images: []
        }
      };
      
      // Guard against Firestore 1MB document limit when users paste base64 images
      const estimatedSize = JSON.stringify(contentToSave).length;
      if (estimatedSize > 900_000) {
        const message = 'Settings payload is too large to save (likely due to embedded images). Please use hosted image URLs or reduce image size/quantity.';
        console.error('usePageContent: Save aborted - payload too large (~bytes):', estimatedSize);
        return { success: false, message };
      }

      console.log('usePageContent: Sanitized content:', {
        mobileImages: contentToSave.mobileImages
      });
      
      const docRef = doc(db, 'sites', SITE_ID, 'settings', 'pageContent');
      await setDoc(docRef, {
        ...contentToSave,
        updatedAt: serverTimestamp(),
        siteId: SITE_ID
      });
      // Ensure local hook state mirrors the sanitized content that was actually saved
      setContent(contentToSave as PageContent);
      
      console.log('usePageContent: Content saved successfully');
      return { success: true, message: 'Settings saved successfully!' };
    } catch (err: any) {
      console.error('Error saving content:', err);
      return { success: false, message: err.message || 'Failed to save settings' };
    }
  };

  return { content, saveContent, loading, error };
};

/**
 * Interface for subscriber data
 */
export interface Subscriber {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subscribedAt: any;
  siteId: string;
}

/**
 * Save a new subscriber to Firebase
 */
export const saveSubscriber = async (name: string, email: string, phone?: string) => {
  try {
    // Normalize email for uniqueness
    const normalizedEmail = email.trim().toLowerCase();
    const docId = encodeURIComponent(normalizedEmail);
    const subscriberRef = doc(db, 'sites', SITE_ID, 'subscribers', docId);

    // Use a transaction to guarantee one subscription per email (per site)
    await runTransaction(db, async (trx) => {
      const existing = await trx.get(subscriberRef);
      if (existing.exists()) {
        throw new Error('ALREADY_SUBSCRIBED');
      }
      trx.set(subscriberRef, {
        name,
        email: normalizedEmail,
        phone: phone || '',
        subscribedAt: serverTimestamp(),
        siteId: SITE_ID
      });
    });

    return { success: true, message: 'Subscription successful!' };
  } catch (err: any) {
    if (err?.message === 'ALREADY_SUBSCRIBED') {
      return { success: false, message: 'This email is already subscribed.' };
    }
    console.error('Error saving subscriber:', err);
    return { success: false, message: err?.message || 'Failed to subscribe' };
  }
};

/**
 * Hook for managing subscribers from Firebase
 */
export const useSubscribers = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const subscribersRef = collection(db, 'sites', SITE_ID, 'subscribers');
    const q = query(subscribersRef, orderBy('subscribedAt', 'desc'));

    // Real-time listener
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const subscribersList: Subscriber[] = [];
        querySnapshot.forEach((doc) => {
          subscribersList.push({
            id: doc.id,
            ...doc.data()
          } as Subscriber);
        });
        setSubscribers(subscribersList);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching subscribers:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Delete a subscriber
  const deleteSubscriber = async (subscriberId: string) => {
    try {
      const docRef = doc(db, 'sites', SITE_ID, 'subscribers', subscriberId);
      await deleteDoc(docRef);
      return { success: true, message: 'Subscriber deleted' };
    } catch (err: any) {
      console.error('Error deleting subscriber:', err);
      return { success: false, message: err.message || 'Failed to delete subscriber' };
    }
  };

  return { subscribers, loading, error, deleteSubscriber };
};
