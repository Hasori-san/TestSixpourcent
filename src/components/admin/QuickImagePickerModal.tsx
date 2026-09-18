import React, { useState } from 'react';
import { X, Image as ImageIcon, Camera, Check, ExternalLink, Sparkles } from 'lucide-react';
import { MediaLibrary } from './MediaLibrary';
import { Article } from '../../types';

export interface ImageEditTarget {
  type: 'article_hero' | 'journalist_avatar' | 'editorial_team_photo';
  id?: string;
  title: string;
  currentImageUrl: string;
  subtitle?: string;
}

export interface QuickImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (newUrl: string) => void;
  title?: string;
  currentUrl?: string;
  target?: ImageEditTarget | null;
  categoryLabel?: string;
  articles?: Article[];
}

export const QuickImagePickerModal: React.FC<QuickImagePickerModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  title,
  currentUrl,
  target,
  categoryLabel,
  articles = [],
}) => {
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [activeTab, setActiveTab] = useState<'library' | 'custom_url'>('library');

  if (!isOpen) return null;

  // Resolve active metadata from target or fallback props
  const resolvedTitle = title || target?.title || 'Sélectionner une photo';
  const resolvedCurrentUrl = currentUrl || target?.currentImageUrl || '';
  const resolvedCategory =
    categoryLabel ||
    (target?.type === 'article_hero'
      ? 'Article'
      : target?.type === 'journalist_avatar'
      ? 'Journaliste'
      : target?.type === 'editorial_team_photo'
      ? 'Rédaction'
      : 'Photo du site');

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrlInput.trim()) {
      onSelectImage(customUrlInput.trim());
      setCustomUrlInput('');
      onClose();
    }
  };

  const handleSelectFromLibrary = (selectedUrl: string) => {
    if (selectedUrl) {
      onSelectImage(selectedUrl);
      onClose();
    }
  };

  return (
    <div
      id="quick-image-picker-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        id="quick-image-picker-modal"
        onClick={(e) => e.stopPropagation()}
        className="bg-[#eae5da] text-[#3f241c] w-full max-w-5xl max-h-[92vh] rounded-2xl shadow-2xl border-2 border-[#839b64] flex flex-col overflow-hidden animate-scale-up"
      >
        {/* Modal Header */}
        <div className="bg-[#3f241c] text-[#eae5da] px-6 py-4 border-b-2 border-[#839b64] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#839b64] text-[#eae5da] flex items-center justify-center font-black shadow-xs shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase font-bold text-[#839b64] tracking-wider">
                  Médiathèque • Modifier la photo
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#839b64]/20 text-[#839b64] border border-[#839b64]/40">
                  {resolvedCategory}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-extrabold truncate max-w-xl text-[#eae5da]">
                {resolvedTitle}
              </h3>
            </div>
          </div>

          <button
            id="close-quick-image-picker-btn"
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#eae5da] transition-colors cursor-pointer"
            title="Fermer sans enregistrer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target summary bar & current preview */}
        <div className="bg-[#ded8cc] border-b border-[#3f241c]/15 px-6 py-3 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            {resolvedCurrentUrl && (
              <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-[#3f241c]/20 bg-[#3f241c] shrink-0">
                <img
                  src={resolvedCurrentUrl}
                  alt="Image actuelle"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-[#3f241c]/60 block">
                Photo actuellement en place
              </span>
              <p className="text-xs font-bold text-[#3f241c] truncate max-w-md">
                Cliquez sur « Sélectionner cette image » sur la photo de votre choix ci-dessous
              </p>
            </div>
          </div>

          {/* Tab buttons */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <button
              type="button"
              onClick={() => setActiveTab('library')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'library'
                  ? 'bg-[#839b64] text-[#eae5da] shadow-xs'
                  : 'bg-[#eae5da] text-[#3f241c] hover:bg-[#eae5da]/80'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Depuis la Médiathèque</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('custom_url')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'custom_url'
                  ? 'bg-[#839b64] text-[#eae5da] shadow-xs'
                  : 'bg-[#eae5da] text-[#3f241c] hover:bg-[#eae5da]/80'
              }`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>URL externe directe</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#eae5da]">
          {activeTab === 'custom_url' ? (
            <div className="max-w-xl mx-auto py-8 space-y-6">
              <div className="bg-[#f4f0e8] p-6 rounded-2xl border border-[#3f241c]/15 space-y-4">
                <h4 className="font-bold text-sm text-[#3f241c] flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-[#839b64]" />
                  <span>Saisir une adresse web d'image (URL)</span>
                </h4>
                <p className="text-xs text-[#3f241c]/70">
                  Vous pouvez renseigner directement le lien d'une image hébergée sur le web (Unsplash, serveur distant, etc.).
                </p>

                <form onSubmit={handleApplyCustomUrl} className="space-y-4">
                  <div>
                    <label className="text-[11px] font-mono uppercase font-bold text-[#3f241c]/70 block mb-1">
                      URL de l'image (https://...)
                    </label>
                    <input
                      type="url"
                      value={customUrlInput}
                      onChange={(e) => setCustomUrlInput(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#3f241c]/20 bg-[#eae5da] text-xs font-mono text-[#3f241c] focus:outline-none focus:ring-2 focus:ring-[#839b64]"
                    />
                  </div>

                  {customUrlInput && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-[#3f241c]/60">Aperçu :</span>
                      <div className="h-44 rounded-xl overflow-hidden bg-[#3f241c] border border-[#3f241c]/20">
                        <img
                          src={customUrlInput}
                          alt="Aperçu URL"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-[#839b64] hover:bg-[#728956] text-[#eae5da] text-xs font-bold transition-all shadow cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Appliquer cette image</span>
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <MediaLibrary
              articles={articles}
              isPickerMode={true}
              onSelectImage={handleSelectFromLibrary}
            />
          )}
        </div>
      </div>
    </div>
  );
};
