import React, { useState, useEffect, useRef } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  Search,
  Filter,
  Sparkles,
  SlidersHorizontal,
  RefreshCw,
  FolderOpen,
  Calendar,
  HardDrive,
  Maximize2,
  X,
  FileCheck,
  CheckCircle2,
} from 'lucide-react';
import {
  MediaItem,
  getMediaLibrary,
  saveMediaItem,
  deleteMediaItem,
  resetMediaLibrary,
  processUploadedImage,
} from '../../lib/mediaStorage';
import { Article } from '../../types';

interface MediaLibraryProps {
  articles: Article[];
  onAssignToArticle?: (articleId: string, imageUrl: string, imageCaption?: string) => void;
  onSelectImage?: (imageUrl: string) => void;
  isPickerMode?: boolean;
}

export const MediaLibrary: React.FC<MediaLibraryProps> = ({
  articles,
  onAssignToArticle,
  onSelectImage,
  isPickerMode = false,
}) => {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [dragActive, setDragActive] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadMedia = async () => {
    setIsLoading(true);
    try {
      const items = await getMediaLibrary();
      setMediaList(items);
    } catch (err) {
      console.error('Failed to load media', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);

    try {
      const newItems: MediaItem[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          const item = await processUploadedImage(file, 'Enquêtes');
          await saveMediaItem(item);
          newItems.push(item);
        }
      }
      setMediaList((prev) => [...newItems, ...prev]);
    } catch (err) {
      alert('Erreur lors du traitement du fichier: ' + (err as Error).message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Voulez-vous supprimer cette image de la médiathèque ?')) {
      await deleteMediaItem(id);
      setMediaList((prev) => prev.filter((m) => m.id !== id));
      if (previewItem?.id === id) setPreviewItem(null);
    }
  };

  const handleCopyUrl = (item: MediaItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Quick Live Test: generates a simulated high-res investigation camera capture
  const handleGenerateLiveTestImage = async () => {
    setIsUploading(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1600;
      canvas.height = 1000;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Aesthetic dark investigative background
        const grad = ctx.createLinearGradient(0, 0, 1600, 1000);
        grad.addColorStop(0, '#2b1812');
        grad.addColorStop(0.5, '#3f241c');
        grad.addColorStop(1, '#1b2a1a');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1600, 1000);

        // Grid lines
        ctx.strokeStyle = 'rgba(131, 155, 100, 0.2)';
        ctx.lineWidth = 1;
        for (let x = 0; x < 1600; x += 80) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, 1000);
          ctx.stroke();
        }
        for (let y = 0; y < 1000; y += 80) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(1600, y);
          ctx.stroke();
        }

        // Camera viewfinder framing corners
        ctx.strokeStyle = '#839b64';
        ctx.lineWidth = 6;
        // top-left
        ctx.beginPath();
        ctx.moveTo(80, 140);
        ctx.lineTo(80, 80);
        ctx.lineTo(140, 80);
        ctx.stroke();
        // top-right
        ctx.beginPath();
        ctx.moveTo(1520, 140);
        ctx.lineTo(1520, 80);
        ctx.lineTo(1460, 80);
        ctx.stroke();
        // bottom-left
        ctx.beginPath();
        ctx.moveTo(80, 860);
        ctx.lineTo(80, 920);
        ctx.lineTo(140, 920);
        ctx.stroke();
        // bottom-right
        ctx.beginPath();
        ctx.moveTo(1520, 860);
        ctx.lineTo(1520, 920);
        ctx.lineTo(1460, 920);
        ctx.stroke();

        // Texts
        ctx.fillStyle = '#839b64';
        ctx.font = 'bold 32px monospace';
        ctx.fillText('REC • CELLULE D\'INVESTIGATION SIX%', 120, 140);

        ctx.fillStyle = '#eae5da';
        ctx.font = 'bold 54px sans-serif';
        ctx.fillText('DOCUMENT CONFIDENTIEL DE TERRAIN', 120, 480);

        ctx.font = '32px sans-serif';
        ctx.fillStyle = 'rgba(234, 229, 218, 0.8)';
        ctx.fillText(`Épreuve téléversée le ${new Date().toLocaleDateString('fr-FR')} • Réf #${Date.now().toString().slice(-6)}`, 120, 550);

        // Stamp
        ctx.save();
        ctx.translate(1300, 750);
        ctx.rotate(-0.15);
        ctx.strokeStyle = '#839b64';
        ctx.lineWidth = 4;
        ctx.strokeRect(-160, -45, 320, 90);
        ctx.fillStyle = '#839b64';
        ctx.font = 'bold 28px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('VÉRIFIÉ SIX%', 0, 10);
        ctx.restore();

        const testDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        const approxBytes = Math.round((testDataUrl.length * 3) / 4);

        const testItem: MediaItem = {
          id: `media-test-${Date.now()}`,
          name: `Preuve Documentaire #${Date.now().toString().slice(-4)}`,
          url: testDataUrl,
          sizeBytes: approxBytes,
          sizeFormatted: `${Math.round(approxBytes / 1024)} Ko`,
          width: 1600,
          height: 1000,
          dimensions: '1600 × 1000',
          uploadedAt: new Date().toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
          category: 'Documents',
          isPreset: false,
        };

        await saveMediaItem(testItem);
        setMediaList((prev) => [testItem, ...prev]);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const filteredMedia = mediaList.filter((m) => {
    const matchesCategory = selectedCategory === 'Tous' || m.category === selectedCategory;
    if (!matchesCategory) return false;
    if (!searchQuery.trim()) return true;
    return m.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Upload Zone (Drag & Drop) */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative p-6 sm:p-8 rounded-2xl border-2 border-dashed transition-all text-center flex flex-col items-center justify-center gap-3 ${
          dragActive
            ? 'border-[#839b64] bg-[#839b64]/15 scale-[1.01]'
            : 'border-[#3f241c]/25 bg-[#f4f0e8] hover:border-[#839b64]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp, image/gif, image/svg+xml"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          id="media-file-input"
        />

        <div className="w-12 h-12 rounded-2xl bg-[#839b64]/20 text-[#839b64] flex items-center justify-center">
          <UploadCloud className="w-6 h-6" />
        </div>

        <div className="space-y-1 max-w-md">
          <h3 className="font-extrabold text-sm sm:text-base text-[#3f241c]">
            Glissez-déposez vos images ici depuis votre ordinateur
          </h3>
          <p className="text-xs text-[#3f241c]/70">
            JPG, PNG, WebP (ex. portraits des journalistes, photo de l'équipe au Louvre, documents de terrain). Stockage local haute résolution optimisé.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2">
          <label
            htmlFor="media-file-input"
            className="px-4 py-2 rounded-xl bg-[#839b64] hover:bg-[#728956] text-[#eae5da] text-xs font-bold transition-colors cursor-pointer shadow-sm flex items-center gap-2"
          >
            <FolderOpen className="w-4 h-4" />
            <span>Parcourir mon ordinateur</span>
          </label>

          <button
            type="button"
            onClick={handleGenerateLiveTestImage}
            disabled={isUploading}
            className="px-3.5 py-2 rounded-xl bg-[#eae5da] hover:bg-[#ded8cc] text-[#3f241c] text-xs font-bold border border-[#3f241c]/25 transition-colors cursor-pointer flex items-center gap-1.5"
            title="Générer immédiatement un visuel d'investigation de test pour vérifier le fonctionnement"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#839b64]" />
            <span>Générer un visuel test en live</span>
          </button>
        </div>

        {isUploading && (
          <div className="absolute inset-0 bg-[#f4f0e8]/90 backdrop-blur-xs rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-[#839b64]">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Traitement et optimisation de l'image en cours...</span>
          </div>
        )}
      </div>

      {/* Toolbar: Search, Filters & Counters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-[#f4f0e8] p-4 rounded-2xl border border-[#3f241c]/15">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#3f241c]/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filtrer les images par nom..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#eae5da] border border-[#3f241c]/20 text-xs text-[#3f241c] outline-none focus:border-[#839b64]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['Tous', 'Enquêtes', 'Auteurs', 'Documents', 'Général'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#3f241c] text-[#eae5da]'
                  : 'bg-[#eae5da] text-[#3f241c]/70 hover:text-[#3f241c]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid Gallery */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-[#3f241c]/60">
          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#839b64]" />
          Chargement de la médiathèque...
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="p-12 text-center bg-[#f4f0e8] rounded-2xl border border-[#3f241c]/15 text-xs text-[#3f241c]/70 space-y-2">
          <ImageIcon className="w-8 h-8 text-[#3f241c]/30 mx-auto" />
          <p>Aucune image trouvée.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              className="bg-[#f4f0e8] rounded-2xl border border-[#3f241c]/15 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video bg-[#3f241c]/10 overflow-hidden cursor-pointer">
                <img
                  src={item.url}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onClick={() => {
                    if (isPickerMode && onSelectImage) {
                      onSelectImage(item.url);
                    } else {
                      setPreviewItem(item);
                    }
                  }}
                />

                {/* Quick overlay actions */}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setPreviewItem(item)}
                    className="p-1.5 rounded-lg bg-[#3f241c]/80 text-[#eae5da] hover:bg-[#3f241c] transition-colors cursor-pointer"
                    title="Agrandir"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg bg-red-600/90 text-white hover:bg-red-700 transition-colors cursor-pointer"
                    title="Supprimer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-[#3f241c]/80 text-[#eae5da] text-[10px] font-mono backdrop-blur-xs">
                  {item.dimensions || 'Image'}
                </div>
              </div>

              {/* Item Info: Nom du fichier, Date et Poids prioritaires */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3.5">
                <div className="space-y-3">
                  {/* Nom du fichier */}
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#3f241c]/60 font-bold block mb-1">
                      Nom du fichier
                    </span>
                    <h4
                      className="font-bold text-xs sm:text-sm text-[#3f241c] leading-snug line-clamp-2 break-words"
                      title={item.name}
                    >
                      {item.name}
                    </h4>
                  </div>

                  {/* Métadonnées essentielles : Date et Poids */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#3f241c]/10">
                    <div className="bg-[#eae5da] p-2.5 rounded-xl border border-[#3f241c]/15">
                      <div className="flex items-center gap-1.5 text-[#3f241c]/70 text-[10px] font-mono font-semibold uppercase tracking-wider">
                        <Calendar className="w-3 h-3 text-[#839b64] shrink-0" />
                        <span>Date</span>
                      </div>
                      <p
                        className="text-xs font-mono font-bold text-[#3f241c] mt-1 truncate"
                        title={item.uploadedAt}
                      >
                        {item.uploadedAt}
                      </p>
                    </div>

                    <div className="bg-[#eae5da] p-2.5 rounded-xl border border-[#3f241c]/15">
                      <div className="flex items-center gap-1.5 text-[#3f241c]/70 text-[10px] font-mono font-semibold uppercase tracking-wider">
                        <HardDrive className="w-3 h-3 text-[#839b64] shrink-0" />
                        <span>Poids</span>
                      </div>
                      <p className="text-xs font-mono font-bold text-[#839b64] mt-1">
                        {item.sizeFormatted}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions (Picker Mode ou Actions rapides) */}
                {isPickerMode ? (
                  <button
                    type="button"
                    onClick={() => onSelectImage && onSelectImage(item.url)}
                    className="w-full py-2.5 rounded-xl bg-[#839b64] hover:bg-[#728956] text-[#eae5da] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Sélectionner cette image</span>
                  </button>
                ) : (
                  <div className="flex items-center justify-between pt-2 border-t border-[#3f241c]/10 gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(item)}
                      className="flex-1 py-2 px-2.5 rounded-xl bg-[#eae5da] hover:bg-[#ded8cc] text-[#3f241c] font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#3f241c]/15"
                      title="Copier le lien direct vers le presse-papiers"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#839b64]" />
                          <span className="text-[#839b64]">Copié !</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[#3f241c]/70" />
                          <span>Copier l'URL</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setPreviewItem(item)}
                      className="py-2 px-3 rounded-xl bg-[#3f241c] hover:bg-[#2b1812] text-[#eae5da] font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
                      title="Afficher l'image en grand format avec tous les détails"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Aperçu</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fullscreen Preview Modal */}
      {previewItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3f241c]/80 backdrop-blur-xs animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPreviewItem(null);
          }}
        >
          <div className="bg-[#eae5da] max-w-3xl w-full rounded-2xl border-2 border-[#3f241c] shadow-2xl overflow-hidden text-[#3f241c] flex flex-col max-h-[90vh]">
            <div className="p-4 bg-[#3f241c] text-[#eae5da] flex items-center justify-between shrink-0">
              <div className="truncate pr-4">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#839b64] font-bold block">
                  Nom du fichier
                </span>
                <h3 className="font-bold text-sm sm:text-base truncate" title={previewItem.name}>
                  {previewItem.name}
                </h3>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-auto flex-1 flex items-center justify-center bg-[#2b1812]/10">
              <img
                src={previewItem.url}
                alt={previewItem.name}
                className="max-h-[60vh] max-w-full object-contain rounded-xl shadow-lg border border-[#3f241c]/20"
              />
            </div>

            {/* Informations clés : Date & Poids */}
            <div className="p-4 bg-[#ded8cc] border-t border-[#3f241c]/15 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
              <div className="flex flex-wrap items-center gap-2">
                <div className="bg-[#f4f0e8] px-3 py-1.5 rounded-lg border border-[#3f241c]/15 flex items-center gap-1.5 text-xs font-mono">
                  <Calendar className="w-3.5 h-3.5 text-[#839b64]" />
                  <span className="text-[#3f241c]/70 font-semibold">Date :</span>
                  <span className="font-bold text-[#3f241c]">{previewItem.uploadedAt}</span>
                </div>

                <div className="bg-[#f4f0e8] px-3 py-1.5 rounded-lg border border-[#3f241c]/15 flex items-center gap-1.5 text-xs font-mono">
                  <HardDrive className="w-3.5 h-3.5 text-[#839b64]" />
                  <span className="text-[#3f241c]/70 font-semibold">Poids :</span>
                  <span className="font-bold text-[#839b64]">{previewItem.sizeFormatted}</span>
                </div>

                {previewItem.dimensions && (
                  <div className="bg-[#f4f0e8] px-3 py-1.5 rounded-lg border border-[#3f241c]/15 text-xs font-mono text-[#3f241c]/80">
                    <span className="text-[#3f241c]/70 font-semibold">Résolution :</span> {previewItem.dimensions}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyUrl(previewItem)}
                  className="px-3.5 py-2 rounded-xl bg-[#f4f0e8] hover:bg-white text-xs font-bold border border-[#3f241c]/20 cursor-pointer flex items-center gap-1.5 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedId === previewItem.id ? 'Copié !' : 'Copier le lien'}</span>
                </button>
                <button
                  onClick={() => setPreviewItem(null)}
                  className="px-4 py-2 rounded-xl bg-[#3f241c] hover:bg-[#2b1812] text-[#eae5da] text-xs font-bold cursor-pointer transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
