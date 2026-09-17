import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocFromServer,
  writeBatch,
} from 'firebase/firestore';
import firebaseConfigJson from '../../firebase-applet-config.json';
import { Article, Journalist } from '../types';
import { Donor } from '../data/donors';
import { MediaItem } from './mediaStorage';

// Support both embedded firebase-applet-config.json and Vercel/Vite environment variables
export const firebaseConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseConfigJson.projectId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseConfigJson.appId,
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseConfigJson.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfigJson.authDomain,
  firestoreDatabaseId:
    import.meta.env.VITE_FIREBASE_DATABASE_ID ||
    firebaseConfigJson.firestoreDatabaseId ||
    '(default)',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfigJson.storageBucket,
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfigJson.messagingSenderId,
};

export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Test connection on boot as mandated by Firebase skill
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('[Six Pourcent Firebase] Connecté à Firestore avec succès');
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[Six Pourcent Firebase] Client hors-ligne, utilisation du cache local');
    }
  }
}
testConnection();

/* =========================================================================
   ARTICLES FIRESTORE SYNCHRONIZATION
   ========================================================================= */

export function subscribeArticles(
  onUpdate: (articles: Article[]) => void,
  initialFallback: Article[]
): () => void {
  const articlesCol = collection(db, 'articles');
  let hasSeeded = false;

  const unsubscribe = onSnapshot(
    articlesCol,
    async (snapshot) => {
      if (snapshot.empty && !hasSeeded) {
        hasSeeded = true;
        try {
          // First time initialization: seed Firestore with official articles
          const batch = writeBatch(db);
          initialFallback.forEach((art) => {
            const ref = doc(db, 'articles', art.id);
            batch.set(ref, art);
          });
          await batch.commit();
          console.log('[Firebase] Articles initiaux synchronisés dans Firestore');
        } catch (err) {
          console.error('[Firebase] Erreur lors du seeding des articles:', err);
        }
        onUpdate(initialFallback);
        return;
      }

      if (!snapshot.empty) {
        const loaded = snapshot.docs.map((d) => d.data() as Article);
        // Sort by order or date if needed, preserving editorial order
        onUpdate(loaded);
      }
    },
    (err) => {
      console.warn('[Firebase] Erreur d\'écoute des articles Firestore:', err);
      onUpdate(initialFallback);
    }
  );

  return unsubscribe;
}

export async function saveArticleToCloud(article: Article): Promise<void> {
  const ref = doc(db, 'articles', article.id);
  await setDoc(ref, {
    ...article,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteArticleFromCloud(articleId: string): Promise<void> {
  const ref = doc(db, 'articles', articleId);
  await deleteDoc(ref);
}

/* =========================================================================
   JOURNALISTS FIRESTORE SYNCHRONIZATION
   ========================================================================= */

export function subscribeJournalists(
  onUpdate: (journalists: Journalist[]) => void,
  initialFallback: Journalist[]
): () => void {
  const journalistsCol = collection(db, 'journalists');
  let hasSeeded = false;

  const unsubscribe = onSnapshot(
    journalistsCol,
    async (snapshot) => {
      if (snapshot.empty && !hasSeeded) {
        hasSeeded = true;
        try {
          const batch = writeBatch(db);
          initialFallback.forEach((j) => {
            const ref = doc(db, 'journalists', j.id);
            batch.set(ref, j);
          });
          await batch.commit();
          console.log('[Firebase] Journalistes synchronisés dans Firestore');
        } catch (err) {
          console.error('[Firebase] Erreur lors du seeding des journalistes:', err);
        }
        onUpdate(initialFallback);
        return;
      }

      if (!snapshot.empty) {
        const loaded = snapshot.docs.map((d) => d.data() as Journalist);
        onUpdate(loaded);
      }
    },
    (err) => {
      console.warn('[Firebase] Erreur d\'écoute des journalistes Firestore:', err);
      onUpdate(initialFallback);
    }
  );

  return unsubscribe;
}

export async function saveJournalistToCloud(journalist: Journalist): Promise<void> {
  const ref = doc(db, 'journalists', journalist.id);
  await setDoc(ref, journalist);
}

export async function deleteJournalistFromCloud(journalistId: string): Promise<void> {
  const ref = doc(db, 'journalists', journalistId);
  await deleteDoc(ref);
}

/* =========================================================================
   DONORS FIRESTORE SYNCHRONIZATION
   ========================================================================= */

export function subscribeDonors(
  onUpdate: (donors: Donor[]) => void,
  initialFallback: Donor[]
): () => void {
  const donorsCol = collection(db, 'donors');
  let hasSeeded = false;

  const unsubscribe = onSnapshot(
    donorsCol,
    async (snapshot) => {
      if (snapshot.empty && !hasSeeded) {
        hasSeeded = true;
        try {
          const batch = writeBatch(db);
          initialFallback.forEach((d) => {
            const ref = doc(db, 'donors', d.id);
            batch.set(ref, d);
          });
          await batch.commit();
          console.log('[Firebase] Donateurs synchronisés dans Firestore');
        } catch (err) {
          console.error('[Firebase] Erreur lors du seeding des donateurs:', err);
        }
        onUpdate(initialFallback);
        return;
      }

      if (!snapshot.empty) {
        const loaded = snapshot.docs.map((d) => d.data() as Donor);
        onUpdate(loaded);
      }
    },
    (err) => {
      console.warn('[Firebase] Erreur d\'écoute des donateurs Firestore:', err);
      onUpdate(initialFallback);
    }
  );

  return unsubscribe;
}

export async function saveDonorToCloud(donor: Donor): Promise<void> {
  const ref = doc(db, 'donors', donor.id);
  await setDoc(ref, donor);
}

export async function deleteDonorFromCloud(donorId: string): Promise<void> {
  const ref = doc(db, 'donors', donorId);
  await deleteDoc(ref);
}

/* =========================================================================
   MEDIA LIBRARY FIRESTORE SYNCHRONIZATION
   ========================================================================= */

export function subscribeMedia(
  onUpdate: (items: MediaItem[]) => void,
  initialFallback: MediaItem[]
): () => void {
  const mediaCol = collection(db, 'media_items');
  let hasSeeded = false;

  const unsubscribe = onSnapshot(
    mediaCol,
    async (snapshot) => {
      if (snapshot.empty && !hasSeeded) {
        hasSeeded = true;
        try {
          const batch = writeBatch(db);
          initialFallback.forEach((m) => {
            const ref = doc(db, 'media_items', m.id);
            batch.set(ref, m);
          });
          await batch.commit();
          console.log('[Firebase] Photothèque synchronisée dans Firestore');
        } catch (err) {
          console.error('[Firebase] Erreur lors du seeding des médias:', err);
        }
        onUpdate(initialFallback);
        return;
      }

      if (!snapshot.empty) {
        const loaded = snapshot.docs.map((d) => d.data() as MediaItem);
        onUpdate(loaded);
      }
    },
    (err) => {
      console.warn('[Firebase] Erreur d\'écoute des médias Firestore:', err);
      onUpdate(initialFallback);
    }
  );

  return unsubscribe;
}

export async function saveMediaToCloud(item: MediaItem): Promise<void> {
  const ref = doc(db, 'media_items', item.id);
  await setDoc(ref, item);
}

export async function deleteMediaFromCloud(mediaId: string): Promise<void> {
  const ref = doc(db, 'media_items', mediaId);
  await deleteDoc(ref);
}

/* =========================================================================
   RESET TO EDITORIAL DEFAULTS (Admin tool)
   ========================================================================= */

export async function resetAllCloudData(
  defaultArticles: Article[],
  defaultJournalists: Journalist[],
  defaultDonors: Donor[],
  defaultMedia: MediaItem[]
): Promise<void> {
  // Clear and rewrite articles
  const artSnap = await getDocs(collection(db, 'articles'));
  const b1 = writeBatch(db);
  artSnap.docs.forEach((d) => b1.delete(d.ref));
  defaultArticles.forEach((a) => b1.set(doc(db, 'articles', a.id), a));
  await b1.commit();

  // Clear and rewrite journalists
  const jourSnap = await getDocs(collection(db, 'journalists'));
  const b2 = writeBatch(db);
  jourSnap.docs.forEach((d) => b2.delete(d.ref));
  defaultJournalists.forEach((j) => b2.set(doc(db, 'journalists', j.id), j));
  await b2.commit();

  // Clear and rewrite donors
  const donSnap = await getDocs(collection(db, 'donors'));
  const b3 = writeBatch(db);
  donSnap.docs.forEach((d) => b3.delete(d.ref));
  defaultDonors.forEach((d) => b3.set(doc(db, 'donors', d.id), d));
  await b3.commit();

  // Clear and rewrite media
  const medSnap = await getDocs(collection(db, 'media_items'));
  const b4 = writeBatch(db);
  medSnap.docs.forEach((d) => b4.delete(d.ref));
  defaultMedia.forEach((m) => b4.set(doc(db, 'media_items', m.id), m));
  await b4.commit();
}
