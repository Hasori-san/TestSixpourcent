import {
  saveMediaToCloud,
  deleteMediaFromCloud,
  db,
} from './firebase';
import { collection, getDocs, doc, getDoc, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';

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

// Local storage keys for caching and quota protection
const LS_MEDIA_LAST_SYNC_TS = 'six_media_last_cloud_updated_at';
const LS_MEDIA_LAST_CHECK_TIME = 'six_media_last_meta_check_time';
const SS_QUOTA_COOLDOWN = 'six_firestore_quota_cooldown';

// Cooldown intervals
const METADATA_CHECK_THROTTLE_MS = 3 * 60 * 1000; // Only check metadata at most once every 3 minutes
const MEMORY_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes memory TTL
const QUOTA_COOLDOWN_MS = 15 * 60 * 1000; // 15 minutes circuit breaker cooldown when quota is exceeded

// In-memory cache & concurrency deduplication
let memoryMediaCache: MediaItem[] | null = null;
let lastMemoryFetchTime = 0;
let inFlightFetchPromise: Promise<MediaItem[]> | null = null;

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

function isQuotaError(err: unknown): boolean {
  if (!err) return false;
  const msg = err instanceof Error ? err.message : String(err);
  return (
    msg.includes('Quota') ||
    msg.includes('quota') ||
    msg.includes('resource-exhausted') ||
    msg.includes('RESOURCE_EXHAUSTED') ||
    msg.includes('exceeded')
  );
}

export function isQuotaCircuitBreakerActive(): boolean {
  try {
    const raw = sessionStorage.getItem(SS_QUOTA_COOLDOWN);
    if (!raw) return false;
    const expiry = parseInt(raw, 10);
    if (Date.now() < expiry) {
      return true;
    }
    sessionStorage.removeItem(SS_QUOTA_COOLDOWN);
    return false;
  } catch {
    return false;
  }
}

function tripQuotaCircuitBreaker() {
  try {
    sessionStorage.setItem(SS_QUOTA_COOLDOWN, String(Date.now() + QUOTA_COOLDOWN_MS));
  } catch {
    // Ignore storage errors
  }
}

export function getMediaCacheStatus(): {
  isQuotaCooldown: boolean;
  isCachedInMemory: boolean;
  itemCount: number;
} {
  return {
    isQuotaCooldown: isQuotaCircuitBreakerActive(),
    isCachedInMemory: memoryMediaCache !== null,
    itemCount: memoryMediaCache?.length || 0,
  };
}

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

async function readAllFromIndexedDB(): Promise<MediaItem[]> {
  try {
    const idb = await openDB();
    return new Promise((resolve) => {
      const tx = idb.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve((req.result as MediaItem[]) || []);
      req.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

async function writeAllToIndexedDB(items: MediaItem[]): Promise<void> {
  try {
    const idb = await openDB();
    const tx = idb.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    items.forEach((item) => store.put(item));
  } catch {
    // Ignore IDB write error
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

/**
 * Charge la médiathèque avec politique Local-First et Smart Invalidation:
 * 1. Retourne instantanément le cache mémoire si disponible (< 5 min).
 * 2. Sinon charge immédiatement depuis IndexedDB local (0 coût Firestore).
 * 3. Ne contacte Firestore que pour vérifier 1 seul document de métadonnées (settings/media_meta)
 *    au maximum une fois toutes les 3 minutes (1 lecture au lieu de 20-50).
 * 4. Ne télécharge la collection complète QUE si le cloud signale un changement réel.
 * 5. Si quota dépassé, active le disjoncteur (circuit breaker) pour 15 min sans erreur.
 */
export async function getMediaLibrary(forceRefresh = false): Promise<MediaItem[]> {
  // 1. Cache mémoire immédiat (0 lecture)
  if (!forceRefresh && memoryMediaCache && memoryMediaCache.length > 0 && Date.now() - lastMemoryFetchTime < MEMORY_CACHE_TTL_MS) {
    return memoryMediaCache;
  }

  // 2. Déduplication des requêtes concurrentes en vol
  if (inFlightFetchPromise && !forceRefresh) {
    return inFlightFetchPromise;
  }

  inFlightFetchPromise = (async () => {
    // 3. Charger d'abord depuis IndexedDB pour que l'affichage soit immédiat
    let localItems = await readAllFromIndexedDB();
    if (localItems.length === 0) {
      localItems = await seedInitialPresets();
    }

    // Mettre à jour le cache mémoire avec les données locales
    memoryMediaCache = localItems;
    lastMemoryFetchTime = Date.now();

    // 4. Si disjoncteur quota actif et pas de rafraîchissement forcé, rester en local pur
    if (isQuotaCircuitBreakerActive() && !forceRefresh) {
      return localItems;
    }

    // 5. Throttling de la vérification distante (au maximum 1 vérification toutes les 3 min)
    if (!forceRefresh) {
      const lastCheck = parseInt(localStorage.getItem(LS_MEDIA_LAST_CHECK_TIME) || '0', 10);
      if (Date.now() - lastCheck < METADATA_CHECK_THROTTLE_MS && localItems.length > 0) {
        return localItems;
      }
    }

    // 6. Vérification intelligente du Cloud Firestore
    try {
      localStorage.setItem(LS_MEDIA_LAST_CHECK_TIME, String(Date.now()));

      // Étape économique : lire UNIQUEMENT 1 document léger de métadonnées (1 lecture)
      let needsFullDownload = forceRefresh || localItems.length === 0;
      let cloudLastUpdated = 0;

      if (!needsFullDownload) {
        const metaSnap = await getDoc(doc(db, 'settings', 'media_meta'));
        if (metaSnap.exists()) {
          const metaData = metaSnap.data();
          cloudLastUpdated = metaData?.lastUpdatedAt || 0;
          const localLastSync = parseInt(localStorage.getItem(LS_MEDIA_LAST_SYNC_TS) || '0', 10);

          // Si les données cloud n'ont pas changé depuis la dernière synchronisation locale,
          // ON N'APPELLE PAS la collection complète ! (Économie de N lectures)
          if (cloudLastUpdated <= localLastSync && localItems.length > 0) {
            return localItems;
          }
          needsFullDownload = true;
        } else {
          // Si le document de métadonnées n'existe pas encore, vérifier la collection
          needsFullDownload = true;
        }
      }

      if (needsFullDownload) {
        const snap = await getDocs(collection(db, 'media_items'));
        if (!snap.empty) {
          const cloudItems = snap.docs.map((d) => d.data() as MediaItem);
          await writeAllToIndexedDB(cloudItems);
          memoryMediaCache = cloudItems;
          lastMemoryFetchTime = Date.now();
          const effectiveTs = cloudLastUpdated || Date.now();
          localStorage.setItem(LS_MEDIA_LAST_SYNC_TS, String(effectiveTs));
          return cloudItems;
        } else {
          // Collection vide, peupler avec les visuels initiaux
          const batch = writeBatch(db);
          INITIAL_MEDIA_PRESETS.forEach((p) => {
            batch.set(doc(db, 'media_items', p.id), p);
          });
          const now = Date.now();
          batch.set(doc(db, 'settings', 'media_meta'), {
            lastUpdatedAt: now,
            count: INITIAL_MEDIA_PRESETS.length,
          });
          await batch.commit();
          await writeAllToIndexedDB(INITIAL_MEDIA_PRESETS);
          localStorage.setItem(LS_MEDIA_LAST_SYNC_TS, String(now));
          return INITIAL_MEDIA_PRESETS;
        }
      }

      return localItems;
    } catch (err) {
      if (isQuotaError(err)) {
        tripQuotaCircuitBreaker();
        console.info('[Firebase Media] Quota Firestore temporairement atteint. Utilisation optimale du cache local IndexedDB (mode haute performance).');
      } else {
        console.warn('[Firebase Media] Mode hors-ligne ou erreur, utilisation du cache local:', err);
      }
      return localItems;
    }
  })();

  try {
    return await inFlightFetchPromise;
  } finally {
    inFlightFetchPromise = null;
  }
}

export async function saveMediaItem(item: MediaItem): Promise<void> {
  // 1. Sauvegarder dans IndexedDB local (cache immédiat et résilient)
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

  // 2. Mettre à jour le cache mémoire
  if (memoryMediaCache) {
    const idx = memoryMediaCache.findIndex((m) => m.id === item.id);
    if (idx >= 0) {
      memoryMediaCache[idx] = item;
    } else {
      memoryMediaCache = [item, ...memoryMediaCache];
    }
    lastMemoryFetchTime = Date.now();
  }

  const now = Date.now();
  localStorage.setItem(LS_MEDIA_LAST_SYNC_TS, String(now));

  // 3. Sauvegarder dans Cloud Firestore si le quota n'est pas bloqué
  if (!isQuotaCircuitBreakerActive()) {
    try {
      await saveMediaToCloud(item);
      // Mettre à jour les métadonnées pour signaler le changement aux autres clients
      await setDoc(
        doc(db, 'settings', 'media_meta'),
        {
          lastUpdatedAt: now,
          count: memoryMediaCache?.length || 1,
        },
        { merge: true }
      );
    } catch (err) {
      if (isQuotaError(err)) {
        tripQuotaCircuitBreaker();
        console.info('[Firebase Media] Quota Firestore atteint lors de l\'enregistrement, préservé en local avec succès.');
      } else {
        console.warn('[Firebase Media] Erreur de sauvegarde Cloud Firestore:', err);
      }
    }
  }
}

export async function deleteMediaItem(id: string): Promise<void> {
  // 1. Supprimer d'IndexedDB local
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

  // 2. Mettre à jour le cache mémoire
  if (memoryMediaCache) {
    memoryMediaCache = memoryMediaCache.filter((m) => m.id !== id);
    lastMemoryFetchTime = Date.now();
  }

  const now = Date.now();
  localStorage.setItem(LS_MEDIA_LAST_SYNC_TS, String(now));

  // 3. Supprimer de Cloud Firestore si possible
  if (!isQuotaCircuitBreakerActive()) {
    try {
      await deleteMediaFromCloud(id);
      await setDoc(
        doc(db, 'settings', 'media_meta'),
        {
          lastUpdatedAt: now,
          count: memoryMediaCache?.length || 0,
        },
        { merge: true }
      );
    } catch (err) {
      if (isQuotaError(err)) {
        tripQuotaCircuitBreaker();
      } else {
        console.warn('[Firebase Media] Erreur suppression Cloud Firestore:', err);
      }
    }
  }
}

export async function resetMediaLibrary(): Promise<MediaItem[]> {
  const idb = await openDB();
  await new Promise<void>((resolve, reject) => {
    const tx = idb.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.clear();
    for (const item of INITIAL_MEDIA_PRESETS) {
      store.put(item);
    }
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });

  memoryMediaCache = [...INITIAL_MEDIA_PRESETS];
  lastMemoryFetchTime = Date.now();
  const now = Date.now();
  localStorage.setItem(LS_MEDIA_LAST_SYNC_TS, String(now));

  if (!isQuotaCircuitBreakerActive()) {
    try {
      const snap = await getDocs(collection(db, 'media_items'));
      const batch = writeBatch(db);
      snap.docs.forEach((d) => batch.delete(d.ref));
      INITIAL_MEDIA_PRESETS.forEach((p) => {
        batch.set(doc(db, 'media_items', p.id), p);
      });
      batch.set(doc(db, 'settings', 'media_meta'), {
        lastUpdatedAt: now,
        count: INITIAL_MEDIA_PRESETS.length,
      });
      await batch.commit();
    } catch (err) {
      if (isQuotaError(err)) {
        tripQuotaCircuitBreaker();
      } else {
        console.warn('[Firebase Media] Erreur réinitialisation Cloud:', err);
      }
    }
  }

  return INITIAL_MEDIA_PRESETS;
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
