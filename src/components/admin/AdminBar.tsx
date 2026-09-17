import React from 'react';
import { useAdminMedia } from '../../context/AdminMediaContext';
import { Image, Layers, Edit3, LogOut, Check, Sparkles } from 'lucide-react';

export const AdminBar: React.FC = () => {
  const {
    isAdmin,
    logoutAdmin,
    openMediaLibrary,
    openSiteImagesManager,
    isEditMode,
    setIsEditMode,
    mediaItems,
  } = useAdminMedia();

  if (!isAdmin) return null;

  return (
    <aside
      id="wp-admin-bar-root"
      aria-label="Barre d'administration Six%"
      className="fixed top-0 inset-x-0 z-50 bg-[#1e1e1e] text-[#f0f0f1] text-xs font-sans border-b border-[#3c434a] shadow-lg select-none"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-10 flex items-center justify-between gap-3">
        {/* Left: Brand / WordPress style indicator & Main buttons */}
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto scrollbar-none py-1">
          {/* WordPress / Admin Badge */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#2c3338] text-[#eae5da] font-mono text-[11px] font-bold shrink-0 border border-[#434b52]">
            <span className="w-2 h-2 rounded-full bg-[#839b64] animate-pulse" />
            <span className="text-[#839b64]">WP</span>
            <span>Admin</span>
          </div>

          {/* Media Library Button */}
          <button
            id="admin-bar-media-btn"
            onClick={openMediaLibrary}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded hover:bg-[#2c3338] text-[#f0f0f1] hover:text-[#839b64] transition-colors cursor-pointer shrink-0 font-medium active:scale-95"
            title="Ouvrir la médiathèque d'images style WordPress"
          >
            <Image className="w-3.5 h-3.5 text-[#839b64]" />
            <span>Médiathèque</span>
            <span className="px-1.5 py-0.2 rounded-full bg-[#839b64]/20 text-[#839b64] font-mono text-[10px]">
              {mediaItems.length}
            </span>
          </button>

          {/* Site Images Manager Button */}
          <button
            id="admin-bar-slots-btn"
            onClick={openSiteImagesManager}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded hover:bg-[#2c3338] text-[#f0f0f1] hover:text-[#839b64] transition-colors cursor-pointer shrink-0 font-medium active:scale-95"
            title="Gérer et remplacer toutes les photos du site"
          >
            <Layers className="w-3.5 h-3.5 text-[#839b64]" />
            <span className="hidden sm:inline">Toutes les images du site</span>
            <span className="sm:hidden">Images du site</span>
          </button>

          {/* Direct In-page Edit Mode Toggle */}
          <button
            id="admin-bar-editmode-btn"
            onClick={() => setIsEditMode(!isEditMode)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors cursor-pointer shrink-0 font-medium ${
              isEditMode
                ? 'bg-[#839b64]/25 text-[#839b64] border border-[#839b64]/40'
                : 'text-[#a7aaad] hover:text-[#f0f0f1] hover:bg-[#2c3338]'
            }`}
            title="Afficher les boutons de modification directe sur les images de la page"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Boutons sur les photos :</span>
            <span>{isEditMode ? 'Actifs' : 'Masqués'}</span>
            {isEditMode && <Check className="w-3 h-3 text-[#839b64]" />}
          </button>
        </div>

        {/* Right: User status & Logout */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden lg:flex items-center gap-1.5 text-[#a7aaad] text-[11px] font-mono">
            <Sparkles className="w-3 h-3 text-[#839b64]" />
            <span>Mode Administrateur actif</span>
          </div>

          <button
            id="admin-bar-logout-btn"
            onClick={logoutAdmin}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#3c434a] hover:bg-[#b32d2e] text-[#f0f0f1] hover:text-white transition-colors cursor-pointer text-[11px] font-medium active:scale-95"
            title="Quitter le mode administrateur"
          >
            <LogOut className="w-3 h-3" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
