import {
  saveMediaToCloud,
  deleteMediaFromCloud,
  db,
} from './firebase';
import { collection, getDocs, doc, setDoc, writeBatch } from 'firebase/firestore';

// Media Storage engine using IndexedDB with Firebase Cloud Firestore synchronization
export interface MediaItem {
  id: string;
  name: string;
  url: string; // Base64 Data URL or public URL
  sizeBytes: number;
  sizeFormatted: string;
  width?: number;
  height?: number;
  dimensions?: string;
  uploadedAt: string;
  category: 'Articles' | 'Enquêtes' | 'Auteurs' | 'Documents' | 'Général';
  isPreset?: boolean;
}

const DB_NAME = 'six_pourcent_media_db';
const DB_VERSION = 1;
const STORE_NAME = 'media_items';

// Starter / Default editorial media from the site
export const INITIAL_MEDIA_PRESETS: MediaItem[] = [
  {
    id: 'media-preset-1',
    name: 'Concessions Océaniques & Mines',
    url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=85',
    sizeBytes: 420000,
    sizeFormatted: '410 Ko',
    dimensions: '1600 × 1067',
    uploadedAt: '15 Septembre 2026',
    category: 'Enquêtes',
    isPreset: true,
  },
  {
    id: 'media-preset-2',
    name: 'Serveurs & Données Algorithmiques',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=85',
    sizeBytes: 390000,
    sizeFormatted: '381 Ko',
    dimensions: '1600 × 1067',
    uploadedAt: '12 Septembre 2026',
    category: 'Enquêtes',
    isPreset: true,
  },
  {
    id: 'media-preset-3',
    name: 'Hémicycle & Lobbying Européen',
    url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1600&q=85',
    sizeBytes: 450000,
    sizeFormatted: '439 Ko',
    dimensions: '1600 × 1066',
    uploadedAt: '10 Septembre 2026',
    category: 'Enquêtes',
    isPreset: true,
  },
  {
    id: 'media-preset-4',
    name: 'Laboratoire Pharmaceutique & Brevets',
    url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1600&q=85',
    sizeBytes: 380000,
    sizeFormatted: '371 Ko',
    dimensions: '1600 × 1067',
    uploadedAt: '08 Septembre 2026',
    category: 'Enquêtes',
    isPreset: true,
  },
  {
    id: 'media-preset-5',
    name: 'Aprilia Narducci (Grand Reporter — Portrait au musée)',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85',
    sizeBytes: 195000,
    sizeFormatted: '190 Ko',
    dimensions: '800 × 1067',
    uploadedAt: '17 Septembre 2026',
    category: 'Auteurs',
    isPreset: true,
  },
  {
    id: 'media-preset-6',
    name: 'Forêt Boréale & Exploitation',
    url: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1600&q=85',
    sizeBytes: 470000,
    sizeFormatted: '459 Ko',
    dimensions: '1600 × 1067',
    uploadedAt: '05 Septembre 2026',
    category: 'Enquêtes',
    isPreset: true,
  },
  {
    id: 'media-preset-7',
    name: 'Équipe de Rédaction Six Pourcent (Galerie d\'Apollon — Musée du Louvre)',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=85',
    sizeBytes: 540000,
    sizeFormatted: '527 Ko',
    dimensions: '1600 × 1067',
    uploadedAt: '17 Septembre 2026',
    category: 'Général',
    isPreset: true,
  },
];

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getMediaLibrary(): Promise<MediaItem[]> {
  // 1. Tenter de charger depuis Cloud Firestore (données globales pour tous les visiteurs)
  try {
    const snap = await getDocs(collection(db, 'media_items'));
    if (!snap.empty) {
      const cloudItems = snap.docs.map((d) => d.data() as MediaItem);
      // Synchroniser en tâche de fond dans IndexedDB pour le cache local
      try {
        const idb = await openDB();
        const tx = idb.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        cloudItems.forEach((item) => store.put(item));
      } catch {
        // Ignorer l'erreur de cache
      }
      return cloudItems;
    } else {
      // Si la collection Firestore est vide, injecter les visuels par défaut
      const batch = writeBatch(db);
      INITIAL_MEDIA_PRESETS.forEach((p) => {
        batch.set(doc(db, 'media_items', p.id), p);
      });
      await batch.commit();
      return INITIAL_MEDIA_PRESETS;
    }
  } catch (err) {
    console.warn('[Firebase Media] Mode hors-ligne ou erreur, repli vers IndexedDB local:', err);
  }

  // 2. Repli vers le stockage local IndexedDB
  try {
    const idb = await openDB();
    return new Promise((resolve) => {
      const tx = idb.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();

      req.onsuccess = () => {
        const stored = (req.result as MediaItem[]) || [];
        if (stored.length === 0) {
          seedInitialPresets().then((seeded) => resolve(seeded));
        } else {
          const missing = INITIAL_MEDIA_PRESETS.filter(
            (p) => !stored.some((item) => item.id === p.id)
          );
          if (missing.length > 0) {
            try {
              const writeTx = idb.transaction(STORE_NAME, 'readwrite');
              const writeStore = writeTx.objectStore(STORE_NAME);
              missing.forEach((item) => writeStore.put(item));
            } catch {
              // ignore write error
            }
            resolve([...stored, ...missing]);
          } else {
            resolve(stored);
          }
        }
      };

      req.onerror = () => {
        resolve(INITIAL_MEDIA_PRESETS);
      };
    });
  } catch (err) {
    console.warn('IndexedDB unavailable, using memory presets', err);
    return INITIAL_MEDIA_PRESETS;
  }
}

async function seedInitialPresets(): Promise<MediaItem[]> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    for (const item of INITIAL_MEDIA_PRESETS) {
      store.put(item);
    }
    return INITIAL_MEDIA_PRESETS;
  } catch {
    return INITIAL_MEDIA_PRESETS;
  }
}

export async function saveMediaItem(item: MediaItem): Promise<void> {
  // 1. Sauvegarder dans Cloud Firestore (pour que l'image soit accessible mondialement)
  try {
    await saveMediaToCloud(item);
  } catch (err) {
    console.warn('[Firebase Media] Erreur de sauvegarde Cloud Firestore:', err);
  }

  // 2. Sauvegarder dans IndexedDB local (cache immédiat)
  try {
    const idb = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = idb.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(item);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('[IndexedDB] Erreur sauvegarde locale:', err);
  }
}

export async function deleteMediaItem(id: string): Promise<void> {
  // 1. Supprimer de Cloud Firestore
  try {
    await deleteMediaFromCloud(id);
  } catch (err) {
    console.warn('[Firebase Media] Erreur suppression Cloud Firestore:', err);
  }

  // 2. Supprimer d'IndexedDB local
  try {
    const idb = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = idb.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('[IndexedDB] Erreur suppression locale:', err);
  }
}

export async function resetMediaLibrary(): Promise<MediaItem[]> {
  try {
    const snap = await getDocs(collection(db, 'media_items'));
    const batch = writeBatch(db);
    snap.docs.forEach((d) => batch.delete(d.ref));
    INITIAL_MEDIA_PRESETS.forEach((p) => {
      batch.set(doc(db, 'media_items', p.id), p);
    });
    await batch.commit();
  } catch (err) {
    console.warn('[Firebase Media] Erreur réinitialisation Cloud:', err);
  }

  const idb = await openDB();
  return new Promise((resolve, reject) => {
    const tx = idb.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.clear();
    for (const item of INITIAL_MEDIA_PRESETS) {
      store.put(item);
    }
    tx.oncomplete = () => resolve(INITIAL_MEDIA_PRESETS);
    tx.onerror = () => reject(tx.error);
  });
}

// Convert File to compressed DataURL with dimensions detection
export function processUploadedImage(
  file: File,
  category: MediaItem['category'] = 'Enquêtes'
): Promise<MediaItem> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Le fichier sélectionné n\'est pas une image valide.'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const rawDataUrl = e.target?.result as string;
      const img = new Image();

      img.onload = () => {
        // Redimensionnement optimisé pour Cloud Firestore (haute définition 1600px max)
        const maxWidth = 1600;
        const maxHeight = 1200;
        let width = img.width;
        let height = img.height;

        let needsResize = false;
        if (width > maxWidth || height > maxHeight) {
          needsResize = true;
          if (width / maxWidth > height / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        let finalUrl = rawDataUrl;
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          finalUrl = canvas.toDataURL('image/jpeg', 0.84);
        }

        // Format file size
        const approxBytes = Math.round((finalUrl.length * 3) / 4);
        const sizeFormatted =
          approxBytes > 1024 * 1024
            ? `${(approxBytes / (1024 * 1024)).toFixed(1)} Mo`
            : `${Math.round(approxBytes / 1024)} Ko`;

        const cleanName = file.name
          .replace(/\.[^/.]+$/, '')
          .replace(/[-_]+/g, ' ')
          .trim();

        const item: MediaItem = {
          id: `media-custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          name: cleanName || 'Image importée',
          url: finalUrl,
          sizeBytes: approxBytes,
          sizeFormatted,
          width,
          height,
          dimensions: `${width} × ${height}`,
          uploadedAt: new Date().toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
          category,
          isPreset: false,
        };

        resolve(item);
      };

      img.onerror = () => {
        reject(new Error('Impossible de décoder cette image.'));
      };

      img.src = rawDataUrl;
    };

    reader.onerror = () => {
      reject(new Error('Erreur lors de la lecture du fichier.'));
    };

    reader.readAsDataURL(file);
  });
}
