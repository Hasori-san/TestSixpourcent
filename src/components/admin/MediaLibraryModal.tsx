import React, { useState, useRef, useMemo } from 'react';
import { useAdminMedia } from '../../context/AdminMediaContext';
import { MediaItem } from '../../types';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Check, 
  Trash2, 
  Copy, 
  Search, 
  RefreshCw, 
  Filter, 
  CheckCircle2, 
  FileImage,
  ExternalLink,
  Layers,
  ArrowRight
} from 'lucide-react';

export const MediaLibraryModal: React.FC = () => {
  const {
    isMediaLibraryOpen,
    closeMediaLibrary,
    mediaItems,
    isLoadingMedia,
    uploadMedia,
    deleteMedia,
    refreshMedia,
    activeSlotTarget,
    applyImageToActiveSlot,
    showToast,
  } = useAdminMedia();

  const [activeTab, setActiveTab] = useState<'upload' | 'library'>('library');
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(() => {
    return mediaItems.length > 0 ? mediaItems[0].id : null;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter and search media items
  const filteredMedia = useMemo(() => {
    return mediaItems.filter((item) => {
      // Type filter
      if (filterType === 'jpg' && !item.filename.toLowerCase().includes('jpg') && !item.filename.toLowerCase().includes('jpeg')) {
        return false;
      }
      if (filterType === 'png' && !item.filename.toLowerCase().includes('png')) {
        return false;
      }
      if (filterType === 'webp' && !item.filename.toLowerCase().includes('webp')) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = item.filename.toLowerCase().includes(q);
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesAlt = (item.alt || '').toLowerCase().includes(q);
        return matchesName || matchesTitle || matchesAlt;
      }

      return true;
    });
  }, [mediaItems, filterType, searchQuery]);

  // Selected media object
  const selectedMedia = useMemo(() => {
    return mediaItems.find((m) => m.id === selectedMediaId) || null;
  }, [mediaItems, selectedMediaId]);

  if (!isMediaLibraryOpen) return null;

  // File Upload Handlers
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await processFiles(Array.from(files));
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await processFiles(Array.from(files));
    }
  };

  const processFiles = async (files: File[]) => {
    setIsUploading(true);
    setUploadProgress(20);

    const imageFiles = files.filter((f) => f.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      showToast('Veuillez sélectionner des fichiers images valides (JPG, PNG, WebP, GIF, SVG).');
      setIsUploading(false);
      return;
    }

    try {
      let lastUploaded: MediaItem | null = null;
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        setUploadProgress(Math.round(((i + 1) / imageFiles.length) * 90));
        lastUploaded = await uploadMedia(file);
      }
      setUploadProgress(100);
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        if (lastUploaded) {
          setSelectedMediaId(lastUploaded.id);
        }
        // Switch to library tab automatically after upload, like in WordPress
        setActiveTab('library');
      }, 500);
    } catch (err: any) {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const copyUrlToClipboard = async (url: string) => {
    try {
      const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
      await navigator.clipboard.writeText(fullUrl);
      showToast('Lien de l’image copié dans le presse-papier !');
    } catch {
      showToast('Erreur lors de la copie du lien');
    }
  };

  const handleDeleteSelected = async () => {
    if (!selectedMedia) return;
    if (window.confirm(`Voulez-vous vraiment supprimer définitivement « ${selectedMedia.title} » ?`)) {
      await deleteMedia(selectedMedia.id, selectedMedia.filename);
      setSelectedMediaId(null);
    }
  };

  const handleApplySelection = async () => {
    if (!selectedMedia || !activeSlotTarget) return;
    await applyImageToActiveSlot(selectedMedia.url);
  };

  return (
    <div
      id="wp-media-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-in fade-in duration-200"
      onClick={closeMediaLibrary}
    >
      <div
        id="wp-media-modal-window"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-6xl h-[90vh] sm:h-[86vh] bg-[#f0f0f1] text-[#2c3338] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-[#dcdcde] animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header (WordPress Style) */}
        <div className="bg-[#ffffff] px-4 sm:px-6 py-3 border-b border-[#dcdcde] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-[#2271b1] text-white flex items-center justify-center font-bold text-xs">
              WP
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#1d2327]">
                {activeSlotTarget ? (
                  <span className="flex items-center gap-2">
                    <span>Sélectionner une image pour :</span>
                    <span className="px-2 py-0.5 rounded bg-[#839b64]/20 text-[#3f241c] text-xs font-mono font-bold">
                      {activeSlotTarget.label}
                    </span>
                  </span>
                ) : (
                  'Médiathèque d’images'
                )}
              </h2>
            </div>
          </div>

          <button
            onClick={closeMediaLibrary}
            className="p-1.5 rounded-lg hover:bg-[#f0f0f1] text-[#646970] hover:text-[#1d2327] transition-colors cursor-pointer"
            title="Fermer la médiathèque"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation (WordPress Navigation Bar) */}
        <div className="bg-[#ffffff] px-4 sm:px-6 border-b border-[#dcdcde] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === 'upload'
                  ? 'border-[#2271b1] text-[#2271b1]'
                  : 'border-transparent text-[#646970] hover:text-[#1d2327]'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Téléverser des fichiers</span>
            </button>

            <button
              onClick={() => setActiveTab('library')}
              className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === 'library'
                  ? 'border-[#2271b1] text-[#2271b1]'
                  : 'border-transparent text-[#646970] hover:text-[#1d2327]'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Médiathèque</span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#f0f0f1] text-[#646970] font-mono text-[10px]">
                {mediaItems.length}
              </span>
            </button>
          </div>

          <button
            onClick={() => refreshMedia()}
            disabled={isLoadingMedia}
            className="p-1.5 rounded hover:bg-[#f0f0f1] text-[#646970] hover:text-[#1d2327] transition-colors cursor-pointer text-xs flex items-center gap-1 font-mono"
            title="Actualiser la liste des fichiers"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingMedia ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Actualiser</span>
          </button>
        </div>

        {/* Tab 1: Upload Files */}
        {activeTab === 'upload' && (
          <div className="flex-1 p-6 sm:p-10 flex flex-col items-center justify-center bg-[#f6f7f7] overflow-y-auto">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`w-full max-w-2xl border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all flex flex-col items-center justify-center ${
                isDragging
                  ? 'border-[#2271b1] bg-[#2271b1]/5 scale-[1.01]'
                  : 'border-[#c3c4c7] hover:border-[#2271b1] bg-white'
              }`}
            >
              <div className="w-16 h-16 rounded-full bg-[#f0f0f1] text-[#2271b1] flex items-center justify-center mb-4 shadow-xs">
                <Upload className="w-8 h-8" />
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-[#1d2327] mb-2">
                Déposez des fichiers n’importe où pour les téléverser
              </h3>
              <p className="text-xs sm:text-sm text-[#646970] mb-6 max-w-md">
                Glissez-déposez vos images ici ou utilisez le bouton pour parcourir les dossiers de votre ordinateur.
              </p>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-6 py-2.5 rounded-lg bg-[#2271b1] hover:bg-[#135e96] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm cursor-pointer active:scale-95 flex items-center gap-2"
              >
                <FileImage className="w-4 h-4" />
                <span>Sélectionner des fichiers</span>
              </button>

              {isUploading && (
                <div className="w-full max-w-md mt-6 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-[#646970]">
                    <span>Téléversement en cours sur le serveur...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#f0f0f1] overflow-hidden">
                    <div
                      className="h-full bg-[#2271b1] transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-[#dcdcde] w-full text-center text-[11px] font-mono text-[#646970]">
                Formats acceptés : JPG, JPEG, PNG, WebP, GIF, SVG • Taille max recommandée : 15 Mo
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Media Library */}
        {activeTab === 'library' && (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-white">
            {/* Left: Filter Bar + Media Grid */}
            <div className="flex-1 flex flex-col overflow-hidden border-r border-[#dcdcde]">
              {/* Filter Toolbar */}
              <div className="p-3 sm:px-4 sm:py-2.5 bg-[#f6f7f7] border-b border-[#dcdcde] flex flex-wrap items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs text-[#646970]">
                    <Filter className="w-3.5 h-3.5" />
                    <span>Filtrer :</span>
                  </div>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-2.5 py-1 text-xs rounded border border-[#8c8f94] bg-white text-[#2c3338] focus:border-[#2271b1] focus:outline-none cursor-pointer"
                  >
                    <option value="all">Tous les médias ({mediaItems.length})</option>
                    <option value="jpg">Fichiers JPEG / JPG</option>
                    <option value="png">Fichiers PNG</option>
                    <option value="webp">Fichiers WebP</option>
                  </select>
                </div>

                {/* Search input */}
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher des médias..."
                    className="w-full pl-8 pr-3 py-1 text-xs rounded border border-[#8c8f94] bg-white text-[#2c3338] placeholder:text-[#8c8f94] focus:border-[#2271b1] focus:outline-none"
                  />
                  <Search className="w-3.5 h-3.5 text-[#8c8f94] absolute left-2.5 top-1/2 -translate-y-1/2" />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#8c8f94] hover:text-[#2c3338]"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              {/* Media Grid */}
              <div className="flex-1 p-3 sm:p-4 overflow-y-auto bg-[#ffffff]">
                {filteredMedia.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <ImageIcon className="w-12 h-12 text-[#c3c4c7] mb-3" />
                    <h4 className="text-sm font-bold text-[#1d2327]">Aucun média trouvé</h4>
                    <p className="text-xs text-[#646970] mt-1 max-w-xs">
                      {searchQuery
                        ? "Aucune image ne correspond à votre recherche."
                        : "Votre médiathèque est vide. Téléversez votre première image !"}
                    </p>
                    <button
                      onClick={() => setActiveTab('upload')}
                      className="mt-4 px-4 py-2 rounded bg-[#2271b1] text-white text-xs font-semibold hover:bg-[#135e96] cursor-pointer"
                    >
                      Téléverser des images
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                    {filteredMedia.map((item) => {
                      const isSelected = selectedMediaId === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedMediaId(item.id)}
                          className={`group relative aspect-square rounded-lg overflow-hidden bg-[#f0f0f1] border-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-[#2271b1] shadow-md ring-2 ring-[#2271b1]/30'
                              : 'border-transparent hover:border-[#8c8f94]/40 hover:shadow-xs'
                          }`}
                        >
                          <img
                            src={item.url}
                            alt={item.title}
                            className="w-full h-full object-cover select-none"
                            loading="lazy"
                          />

                          {/* Selected Checkmark (WordPress style) */}
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-sm bg-[#2271b1] text-white flex items-center justify-center shadow">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          )}

                          {/* Hover title preview bar */}
                          <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white text-[10px] truncate opacity-0 group-hover:opacity-100 transition-opacity">
                            {item.title}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Attachment Details Sidebar (WordPress Style) */}
            <div className="w-full md:w-80 lg:w-96 bg-[#f6f7f7] border-t md:border-t-0 flex flex-col shrink-0 overflow-y-auto">
              {selectedMedia ? (
                <div className="p-4 sm:p-5 space-y-4">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-[#646970] font-bold">
                    Détails du fichier joint
                  </h3>

                  {/* Thumbnail and metadata preview */}
                  <div className="flex gap-3 items-start pb-4 border-b border-[#dcdcde]">
                    <div className="w-20 h-20 rounded-lg overflow-hidden border border-[#dcdcde] bg-black/10 shrink-0">
                      <img
                        src={selectedMedia.url}
                        alt={selectedMedia.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1 text-xs">
                      <div className="font-bold text-[#1d2327] truncate" title={selectedMedia.filename}>
                        {selectedMedia.filename}
                      </div>
                      <div className="text-[11px] font-mono text-[#646970]">
                        {selectedMedia.size || 'Format Web'}
                      </div>
                      <div className="text-[11px] font-mono text-[#646970]">
                        {new Date(selectedMedia.uploadedAt).toLocaleDateString('fr-FR')}
                      </div>
                      <button
                        type="button"
                        onClick={handleDeleteSelected}
                        className="text-xs text-[#b32d2e] hover:underline flex items-center gap-1 pt-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Supprimer définitivement</span>
                      </button>
                    </div>
                  </div>

                  {/* Fields: Title, Alt text, URL */}
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-[#2c3338] mb-1">
                        Titre de l'image
                      </label>
                      <input
                        type="text"
                        value={selectedMedia.title}
                        readOnly
                        className="w-full px-2.5 py-1.5 rounded border border-[#8c8f94] bg-white text-[#2c3338] font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#2c3338] mb-1">
                        Texte alternatif (Alt)
                      </label>
                      <input
                        type="text"
                        value={selectedMedia.alt || selectedMedia.title}
                        readOnly
                        className="w-full px-2.5 py-1.5 rounded border border-[#8c8f94] bg-white text-[#2c3338] font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#2c3338] mb-1">
                        URL du fichier
                      </label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={selectedMedia.url}
                          readOnly
                          className="w-full px-2 py-1 rounded border border-[#8c8f94] bg-[#f0f0f1] text-[#646970] font-mono text-[11px] truncate"
                        />
                        <button
                          type="button"
                          onClick={() => copyUrlToClipboard(selectedMedia.url)}
                          className="px-2.5 py-1 rounded bg-[#ffffff] border border-[#8c8f94] hover:bg-[#f0f0f1] text-[#2c3338] transition-colors cursor-pointer shrink-0"
                          title="Copier l'URL"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-[#646970]">
                  Sélectionnez une image dans la grille pour afficher ses détails.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal Footer (WordPress Action Bar) */}
        <div className="bg-[#ffffff] px-4 sm:px-6 py-3 border-t border-[#dcdcde] flex items-center justify-between gap-4 shrink-0">
          <div className="text-xs text-[#646970] flex items-center gap-2">
            {activeSlotTarget ? (
              <span className="flex items-center gap-1.5 text-[#1d2327]">
                <Layers className="w-4 h-4 text-[#839b64]" />
                <span>Modification de : <strong>{activeSlotTarget.label}</strong></span>
              </span>
            ) : selectedMedia ? (
              <span className="truncate max-w-xs font-mono text-[11px]">
                Sélectionné : {selectedMedia.title}
              </span>
            ) : (
              <span>Aucune image sélectionnée</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={closeMediaLibrary}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-[#646970] hover:text-[#1d2327] hover:bg-[#f0f0f1] transition-colors cursor-pointer"
            >
              Fermer
            </button>

            {activeSlotTarget ? (
              <button
                onClick={handleApplySelection}
                disabled={!selectedMedia}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shadow-sm ${
                  selectedMedia
                    ? 'bg-[#839b64] hover:bg-[#728956] text-[#eae5da] cursor-pointer active:scale-95'
                    : 'bg-[#c3c4c7] text-white cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Définir comme image du site</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  if (selectedMedia) {
                    copyUrlToClipboard(selectedMedia.url);
                  }
                }}
                disabled={!selectedMedia}
                className="px-4 py-2 rounded-lg bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Copier l'URL
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
