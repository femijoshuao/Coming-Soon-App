import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, deleteDoc } from 'firebase/firestore';
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
          setContent(docSnap.data() as PageContent);
        } else {
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
      const docRef = doc(db, 'sites', SITE_ID, 'settings', 'pageContent');
      await setDoc(docRef, {
        ...newContent,
        updatedAt: serverTimestamp(),
        siteId: SITE_ID
      });
      setContent(newContent);
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
    const subscribersRef = collection(db, 'sites', SITE_ID, 'subscribers');
    await addDoc(subscribersRef, {
      name,
      email,
      phone: phone || '',
      subscribedAt: serverTimestamp(),
      siteId: SITE_ID
    });
    return { success: true, message: 'Subscription successful!' };
  } catch (err: any) {
    console.error('Error saving subscriber:', err);
    return { success: false, message: err.message || 'Failed to subscribe' };
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
