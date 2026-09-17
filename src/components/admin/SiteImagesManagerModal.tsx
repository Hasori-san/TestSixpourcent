import React, { useState } from 'react';
import { useAdminMedia } from '../../context/AdminMediaContext';
import { 
  X, 
  Layers, 
  RotateCcw, 
  ExternalLink, 
  Check, 
  Users, 
  BookOpen, 
  UserCheck, 
  Image as ImageIcon,
  Sparkles
} from 'lucide-react';

export const SiteImagesManagerModal: React.FC = () => {
  const {
    isSiteImagesManagerOpen,
    closeSiteImagesManager,
    getAllSlots,
    openMediaSelectorForSlot,
    resetSiteImage,
    siteImages,
  } = useAdminMedia();

  const [activeTab, setActiveTab] = useState<'all' | 'general' | 'articles' | 'authors'>('all');

  if (!isSiteImagesManagerOpen) return null;

  const slots = getAllSlots();

  const filteredSlots = slots.filter((slot) => {
    if (activeTab === 'all') return true;
    return slot.group === activeTab;
  });

  const customizedCount = Object.keys(siteImages).length;

  return (
    <div
      id="site-images-manager-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-in fade-in duration-200"
      onClick={closeSiteImagesManager}
    >
      <div
        id="site-images-manager-window"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl h-[88vh] bg-[#f4f0e8] text-[#3f241c] rounded-2xl shadow-2xl flex flex-col overflow-hidden border-2 border-[#3f241c]/20 animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="bg-[#3f241c] text-[#eae5da] px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#839b64] text-[#eae5da] flex items-center justify-center shadow">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Gestionnaire des images du site</h2>
              <p className="text-xs text-[#eae5da]/75 font-mono">
                Remplacez facilement n'importe quelle photo ou illustration de Six%
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#839b64]/20 border border-[#839b64]/40 text-[#eae5da] text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 text-[#839b64]" />
              <span>{customizedCount} {customizedCount > 1 ? 'images personnalisées' : 'image personnalisée'}</span>
            </div>
            <button
              onClick={closeSiteImagesManager}
              className="p-1.5 rounded-lg hover:bg-white/10 text-[#eae5da]/80 hover:text-white transition-colors cursor-pointer"
              title="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Navigation */}
        <div className="bg-[#ded8cc] px-6 py-2 border-b border-[#3f241c]/15 flex items-center justify-between gap-4 shrink-0 overflow-x-auto">
          <div className="flex items-center gap-2 text-xs font-mono">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-[#3f241c] text-[#eae5da] shadow-xs'
                  : 'text-[#3f241c]/70 hover:bg-[#3f241c]/10'
              }`}
            >
              Toutes les images ({slots.length})
            </button>

            <button
              onClick={() => setActiveTab('general')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'general'
                  ? 'bg-[#3f241c] text-[#eae5da] shadow-xs'
                  : 'text-[#3f241c]/70 hover:bg-[#3f241c]/10'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Équipe de rédaction</span>
            </button>

            <button
              onClick={() => setActiveTab('articles')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'articles'
                  ? 'bg-[#3f241c] text-[#eae5da] shadow-xs'
                  : 'text-[#3f241c]/70 hover:bg-[#3f241c]/10'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Couvertures d'enquêtes</span>
            </button>

            <button
              onClick={() => setActiveTab('authors')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'authors'
                  ? 'bg-[#3f241c] text-[#eae5da] shadow-xs'
                  : 'text-[#3f241c]/70 hover:bg-[#3f241c]/10'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Journalistes & Auteurs</span>
            </button>
          </div>
        </div>

        {/* Content List */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSlots.map((slot) => {
              const isCustom = !!siteImages[slot.slotId];
              return (
                <div
                  key={slot.slotId}
                  className="bg-[#ffffff] rounded-2xl border border-[#3f241c]/15 p-4 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-4 items-start"
                >
                  {/* Thumbnail */}
                  <div className="relative w-full sm:w-36 h-36 rounded-xl overflow-hidden bg-[#3f241c]/10 border border-[#3f241c]/20 shrink-0">
                    <img
                      src={slot.currentUrl}
                      alt={slot.label}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {isCustom ? (
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#839b64] text-[#eae5da] text-[10px] font-mono font-bold shadow">
                        Personnalisée
                      </div>
                    ) : (
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#3f241c]/80 text-[#eae5da] text-[10px] font-mono shadow">
                        Par défaut
                      </div>
                    )}
                  </div>

                  {/* Info & Actions */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between h-full space-y-2">
                    <div>
                      <div className="text-[11px] font-mono uppercase tracking-wider text-[#839b64] font-bold">
                        {slot.group === 'general' && "Section Générale"}
                        {slot.group === 'articles' && "Couverture d'Enquête"}
                        {slot.group === 'authors' && "Portrait de Journaliste"}
                      </div>
                      <h4 className="text-sm font-bold text-[#3f241c] line-clamp-2 mt-0.5">
                        {slot.label}
                      </h4>
                      {slot.description && (
                        <p className="text-xs text-[#3f241c]/70 line-clamp-2 mt-1 font-normal">
                          {slot.description}
                        </p>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="pt-2 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          closeSiteImagesManager();
                          openMediaSelectorForSlot(slot.slotId, slot.label);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#3f241c] hover:bg-[#2b1812] text-[#eae5da] text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-[#839b64]" />
                        <span>Remplacer la photo</span>
                      </button>

                      {isCustom && (
                        <button
                          type="button"
                          onClick={() => resetSiteImage(slot.slotId)}
                          className="px-2.5 py-1.5 rounded-lg border border-[#3f241c]/20 hover:bg-[#3f241c]/10 text-[#3f241c] text-xs font-mono transition-colors flex items-center gap-1 cursor-pointer"
                          title="Rétablir l'image par défaut"
                        >
                          <RotateCcw className="w-3 h-3 text-[#3f241c]/60" />
                          <span>Rétablir d'origine</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#ded8cc] px-6 py-3 border-t border-[#3f241c]/15 flex items-center justify-between text-xs font-mono text-[#3f241c]/75 shrink-0">
          <div>
            Toutes les modifications sont enregistrées automatiquement sur le serveur et le site.
          </div>
          <button
            onClick={closeSiteImagesManager}
            className="px-4 py-1.5 rounded-lg bg-[#3f241c] text-[#eae5da] font-bold hover:bg-[#2b1812] transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
