import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MediaItem, SiteImageSlot } from '../types';
import { ARTICLES_DATA } from '../data/articles';

interface AdminMediaContextType {
  isAdmin: boolean;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  isEditMode: boolean;
  setIsEditMode: (active: boolean) => void;
  
  // Media items
  mediaItems: MediaItem[];
  isLoadingMedia: boolean;
  uploadMedia: (file: File, title?: string, alt?: string) => Promise<MediaItem>;
  deleteMedia: (id: string, filename: string) => Promise<void>;
  refreshMedia: () => Promise<void>;

  // Site image mapping
  siteImages: Record<string, string>;
  getImageFor: (slotId: string, fallbackUrl: string) => string;
  setSiteImage: (slotId: string, url: string) => Promise<void>;
  resetSiteImage: (slotId: string) => Promise<void>;
  getAllSlots: () => SiteImageSlot[];

  // Selector workflow
  activeSlotTarget: { slotId: string; label: string } | null;
  openMediaSelectorForSlot: (slotId: string, label: string) => void;
  closeMediaSelector: () => void;
  applyImageToActiveSlot: (url: string) => Promise<void>;

  // Modals
  isMediaLibraryOpen: boolean;
  openMediaLibrary: () => void;
  closeMediaLibrary: () => void;

  isSiteImagesManagerOpen: boolean;
  openSiteImagesManager: () => void;
  closeSiteImagesManager: () => void;

  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;

  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const STORAGE_KEY_ADMIN = 'six_percent_admin_session';
const STORAGE_KEY_SITE_IMAGES = 'six_percent_site_images_mapping';
const ADMIN_PASSWORD_DEFAULT = 'admin2026';

// Initial preloaded assets to seed the media library if empty
const SEED_MEDIAS: MediaItem[] = [
  {
    id: 'seed-team-louvre',
    filename: 'IMG_8297.jpeg',
    url: '/IMG_8297.jpeg',
    title: "Équipe de rédaction de Six% au Musée du Louvre",
    alt: "Équipe de rédaction Six% dans la Galerie d'Apollon",
    size: '1.4 Mo',
    mimeType: 'image/jpeg',
    uploadedAt: new Date('2026-09-01').toISOString(),
  },
  {
    id: 'seed-art-01',
    filename: 'metaux-rares-fonds-marins.jpg',
    url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=85',
    title: "Exploration minière sous-marine Clarion-Clipperton",
    alt: "Fonds marins et robot de prospection",
    size: '640 Ko',
    mimeType: 'image/jpeg',
    uploadedAt: new Date('2026-09-05').toISOString(),
  },
  {
    id: 'seed-art-02',
    filename: 'surveillance-biometrique-rues.jpg',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=85',
    title: "Surveillance biométrique urbaine",
    alt: "Caméras et reconnaissance faciale en ville",
    size: '580 Ko',
    mimeType: 'image/jpeg',
    uploadedAt: new Date('2026-09-06').toISOString(),
  },
  {
    id: 'seed-art-03',
    filename: 'hold-up-ports-francs-art.jpg',
    url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1600&q=85',
    title: "Tableau de maître et coffres de port franc",
    alt: "Galerie d'art et œuvres sous scellés",
    size: '720 Ko',
    mimeType: 'image/jpeg',
    uploadedAt: new Date('2026-09-08').toISOString(),
  },
  {
    id: 'seed-art-04',
    filename: 'lobby-pharmaceutique-essais.jpg',
    url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1600&q=85',
    title: "Laboratoire d'essais cliniques pharmaceutiques",
    alt: "Microscope et éprouvettes de laboratoire",
    size: '490 Ko',
    mimeType: 'image/jpeg',
    uploadedAt: new Date('2026-09-10').toISOString(),
  },
  {
    id: 'seed-art-05',
    filename: 'financement-occulte-elections.jpg',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85',
    title: "Tours de la City et flux financiers",
    alt: "Gratte-ciels financiers et sièges de fonds d'investissement",
    size: '810 Ko',
    mimeType: 'image/jpeg',
    uploadedAt: new Date('2026-09-11').toISOString(),
  },
  {
    id: 'seed-art-06',
    filename: 'terres-rares-extraction-afrique.jpg',
    url: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1600&q=85',
    title: "Extraction minière et paysage industriel",
    alt: "Carrière d'extraction à ciel ouvert",
    size: '690 Ko',
    mimeType: 'image/jpeg',
    uploadedAt: new Date('2026-09-12').toISOString(),
  },
];

const AdminMediaContext = createContext<AdminMediaContextType | undefined>(undefined);

export const AdminMediaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_ADMIN) === 'true';
    } catch {
      return false;
    }
  });

  const [isEditMode, setIsEditMode] = useState<boolean>(true);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(SEED_MEDIAS);
  const [isLoadingMedia, setIsLoadingMedia] = useState<boolean>(false);
  
  const [siteImages, setSiteImages] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SITE_IMAGES);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [activeSlotTarget, setActiveSlotTarget] = useState<{ slotId: string; label: string } | null>(null);
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);
  const [isSiteImagesManagerOpen, setIsSiteImagesManagerOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  }, []);

  // Fetch site images mapping from server on mount
  useEffect(() => {
    const fetchSiteImages = async () => {
      try {
        const res = await fetch('/api/site-images/get');
        if (res.ok) {
          const data = await res.json();
          if (data.mapping && Object.keys(data.mapping).length > 0) {
            setSiteImages((prev) => ({ ...prev, ...data.mapping }));
          }
        }
      } catch (err) {
        console.warn('Could not sync site images from server, using local storage cache', err);
      }
    };
    fetchSiteImages();
  }, []);

  // Fetch media library from server
  const refreshMedia = useCallback(async () => {
    setIsLoadingMedia(true);
    try {
      const res = await fetch('/api/media/list');
      if (res.ok) {
        const data = await res.json();
        const serverItems: MediaItem[] = data.items || [];
        
        // Merge with seed media so we always have a rich library
        const mergedMap = new Map<string, MediaItem>();
        SEED_MEDIAS.forEach((item) => mergedMap.set(item.filename, item));
        serverItems.forEach((item) => mergedMap.set(item.filename, item));
        setMediaItems(Array.from(mergedMap.values()));
      }
    } catch (err) {
      console.warn('Failed to load media list from server', err);
    } finally {
      setIsLoadingMedia(false);
    }
  }, []);

  useEffect(() => {
    refreshMedia();
  }, [refreshMedia]);

  // Login / Logout
  const loginAdmin = useCallback((password: string): boolean => {
    if (password === ADMIN_PASSWORD_DEFAULT || password.trim() === 'admin' || password.trim() === 'admin2026') {
      setIsAdmin(true);
      try {
        localStorage.setItem(STORAGE_KEY_ADMIN, 'true');
      } catch (e) {
        console.error(e);
      }
      showToast('Connexion réussie en tant qu’administrateur Six%');
      return true;
    }
    return false;
  }, [showToast]);

  const logoutAdmin = useCallback(() => {
    setIsAdmin(false);
    try {
      localStorage.removeItem(STORAGE_KEY_ADMIN);
    } catch (e) {
      console.error(e);
    }
    setIsMediaLibraryOpen(false);
    setIsSiteImagesManagerOpen(false);
    showToast('Session administrateur fermée');
  }, [showToast]);

  // Upload a media file
  const uploadMedia = useCallback(async (file: File, title?: string, alt?: string): Promise<MediaItem> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const dataUrl = reader.result as string;
          const res = await fetch('/api/media/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              dataUrl,
              filename: file.name,
              title: title || file.name.replace(/\.[^/.]+$/, ''),
              alt: alt || '',
            }),
          });

          if (!res.ok) {
            throw new Error(`Erreur lors du téléversement (${res.status})`);
          }

          const data = await res.json();
          if (data.item) {
            setMediaItems((prev) => [data.item, ...prev]);
            showToast(`Image « ${data.item.title} » téléversée dans la médiathèque !`);
            resolve(data.item);
          } else {
            throw new Error(data.error || 'Erreur inconnue');
          }
        } catch (err: any) {
          showToast(`Erreur téléversement : ${err.message}`);
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Erreur lecture fichier'));
      reader.readAsDataURL(file);
    });
  }, [showToast]);

  // Delete a media file
  const deleteMedia = useCallback(async (id: string, filename: string) => {
    try {
      await fetch('/api/media/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, filename }),
      });
      setMediaItems((prev) => prev.filter((item) => item.id !== id && item.filename !== filename));
      showToast('Image supprimée de la médiathèque');
    } catch (err: any) {
      showToast(`Erreur suppression : ${err.message}`);
    }
  }, [showToast]);

  // Set / Reset site image
  const setSiteImage = useCallback(async (slotId: string, url: string) => {
    const updated = { ...siteImages, [slotId]: url };
    setSiteImages(updated);
    try {
      localStorage.setItem(STORAGE_KEY_SITE_IMAGES, JSON.stringify(updated));
      await fetch('/api/site-images/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mapping: updated }),
      });
      showToast('Image mise à jour sur le site avec succès');
    } catch (err) {
      console.warn('Failed to save to server', err);
    }
  }, [siteImages, showToast]);

  const resetSiteImage = useCallback(async (slotId: string) => {
    const updated = { ...siteImages };
    delete updated[slotId];
    setSiteImages(updated);
    try {
      localStorage.setItem(STORAGE_KEY_SITE_IMAGES, JSON.stringify(updated));
      await fetch('/api/site-images/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mapping: updated }),
      });
      showToast('Image rétablie à sa valeur d’origine');
    } catch (err) {
      console.warn('Failed to save reset', err);
    }
  }, [siteImages, showToast]);

  // Helper to get active URL for a slot
  const getImageFor = useCallback((slotId: string, fallbackUrl: string): string => {
    return siteImages[slotId] || fallbackUrl;
  }, [siteImages]);

  // Generate list of all controllable image slots in the app
  const getAllSlots = useCallback((): SiteImageSlot[] => {
    const slots: SiteImageSlot[] = [];

    // 1. Team Editorial Photo
    slots.push({
      slotId: 'team-photo',
      label: "Photo officielle de l'équipe de rédaction",
      group: 'general',
      currentUrl: siteImages['team-photo'] || '/IMG_8297.jpeg',
      defaultUrl: '/IMG_8297.jpeg',
      description: "Grande photographie sous la voûte du Louvre présentée dans la section « L'équipe de rédaction ».",
    });

    // 2. Articles Hero Images
    ARTICLES_DATA.forEach((art) => {
      slots.push({
        slotId: `article-${art.id}-hero`,
        label: `Couverture : « ${art.title} »`,
        group: 'articles',
        articleId: art.id,
        currentUrl: siteImages[`article-${art.id}-hero`] || art.heroImage,
        defaultUrl: art.heroImage,
        description: `Illustration principale de l'enquête (${art.category} • ${art.categoryTag}).`,
      });
    });

    // 3. Authors Avatars
    ARTICLES_DATA.forEach((art) => {
      slots.push({
        slotId: `article-${art.id}-author`,
        label: `Portrait : ${art.author.name}`,
        group: 'authors',
        articleId: art.id,
        currentUrl: siteImages[`article-${art.id}-author`] || art.author.avatar,
        defaultUrl: art.author.avatar,
        description: `Photo de profil du journaliste d'investigation pour l'enquête #${art.id}.`,
      });
    });

    return slots;
  }, [siteImages]);

  // Media selector workflow
  const openMediaSelectorForSlot = useCallback((slotId: string, label: string) => {
    setActiveSlotTarget({ slotId, label });
    setIsMediaLibraryOpen(true);
  }, []);

  const closeMediaSelector = useCallback(() => {
    setActiveSlotTarget(null);
  }, []);

  const applyImageToActiveSlot = useCallback(async (url: string) => {
    if (activeSlotTarget) {
      await setSiteImage(activeSlotTarget.slotId, url);
      setActiveSlotTarget(null);
      setIsMediaLibraryOpen(false);
    }
  }, [activeSlotTarget, setSiteImage]);

  return (
    <AdminMediaContext.Provider
      value={{
        isAdmin,
        loginAdmin,
        logoutAdmin,
        isEditMode,
        setIsEditMode,
        mediaItems,
        isLoadingMedia,
        uploadMedia,
        deleteMedia,
        refreshMedia,
        siteImages,
        getImageFor,
        setSiteImage,
        resetSiteImage,
        getAllSlots,
        activeSlotTarget,
        openMediaSelectorForSlot,
        closeMediaSelector,
        applyImageToActiveSlot,
        isMediaLibraryOpen,
        openMediaLibrary: () => {
          setActiveSlotTarget(null);
          setIsMediaLibraryOpen(true);
        },
        closeMediaLibrary: () => {
          setIsMediaLibraryOpen(false);
          setActiveSlotTarget(null);
        },
        isSiteImagesManagerOpen,
        openSiteImagesManager: () => setIsSiteImagesManagerOpen(true),
        closeSiteImagesManager: () => setIsSiteImagesManagerOpen(false),
        isLoginModalOpen,
        openLoginModal: () => setIsLoginModalOpen(true),
        closeLoginModal: () => setIsLoginModalOpen(false),
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AdminMediaContext.Provider>
  );
};

export const useAdminMedia = () => {
  const context = useContext(AdminMediaContext);
  if (!context) {
    throw new Error('useAdminMedia must be used within an AdminMediaProvider');
  }
  return context;
};
