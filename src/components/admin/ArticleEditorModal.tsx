import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Trash2, Check, Sparkles, Image as ImageIcon, FileText, User, Tag, FolderOpen, ExternalLink, Bold, Italic, Underline, Heading2, Quote, List } from 'lucide-react';
import { Article, Category } from '../../types';
import { CATEGORIES } from '../../data/articles';
import { MediaLibrary } from './MediaLibrary';

interface ArticleEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (article: Article) => void;
  articleToEdit?: Article | null;
  categories?: { label: string; value: string }[];
  onOpenGoogleDocsMode?: () => void;
}

const DEFAULT_AVATARS = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
];

const SUGGESTED_HERO_IMAGES = [
  { label: 'Océans & Mines', url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=85' },
  { label: 'Data Center & IA', url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=85' },
  { label: 'Parlement & Finance', url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1600&q=85' },
  { label: 'Santé & Labo', url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1600&q=85' },
  { label: 'Forêt & Écologie', url: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1600&q=85' },
];

export const ArticleEditorModal: React.FC<ArticleEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  articleToEdit,
  categories = CATEGORIES,
  onOpenGoogleDocsMode,
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [chapeau, setChapeau] = useState('');
  const [category, setCategory] = useState<Category>('Environnement');
  const [categoryTag, setCategoryTag] = useState('Dossier Spécial');
  const [authorName, setAuthorName] = useState('Aprilia Narducci');
  const [authorRole, setAuthorRole] = useState('Grand reporter & data-investigatrice');
  const [authorAvatar, setAuthorAvatar] = useState(DEFAULT_AVATARS[0]);
  const [publishedAt, setPublishedAt] = useState('17 Septembre 2026');
  const [readTimeMinutes, setReadTimeMinutes] = useState(7);
  const [heroImage, setHeroImage] = useState(SUGGESTED_HERO_IMAGES[0].url);
  const [heroImageCaption, setHeroImageCaption] = useState('Image d\'investigation Six%');
  const [isPopular, setIsPopular] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [investigationDays, setInvestigationDays] = useState(180);
  const [leakedDocumentsCount, setLeakedDocumentsCount] = useState(24);
  const [keyRevelations, setKeyRevelations] = useState<string[]>([
    'Révélation clé documentée #1',
    'Preuve matérielle obtenue par la cellule Six% #2',
  ]);
  const [newRevelation, setNewRevelation] = useState('');
  const [mainContent, setMainContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Quick insertion helpers for textarea
  const insertTextFormatting = (prefix: string, suffix: string = '') => {
    if (!textareaRef.current) return;
    const el = textareaRef.current;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = el.value.substring(start, end) || 'texte';
    const replacement = `${prefix}${selected}${suffix}`;
    const newVal = el.value.substring(0, start) + replacement + el.value.substring(end);
    setMainContent(newVal);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 10);
  };

  // Media picker modal state
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<'hero' | 'author'>('hero');

  useEffect(() => {
    if (articleToEdit) {
      setTitle(articleToEdit.title);
      setSubtitle(articleToEdit.subtitle);
      setChapeau(articleToEdit.chapeau);
      setCategory(articleToEdit.category);
      setCategoryTag(articleToEdit.categoryTag || 'Dossier');
      setAuthorName(articleToEdit.author.name);
      setAuthorRole(articleToEdit.author.role);
      setAuthorAvatar(articleToEdit.author.avatar);
      setPublishedAt(articleToEdit.publishedAt);
      setReadTimeMinutes(articleToEdit.readTimeMinutes);
      setHeroImage(articleToEdit.heroImage);
      setHeroImageCaption(articleToEdit.heroImageCaption);
      setIsPopular(!!articleToEdit.isPopular);
      setIsFeatured(!!articleToEdit.isFeatured);
      setInvestigationDays(articleToEdit.investigationDays || 120);
      setLeakedDocumentsCount(articleToEdit.leakedDocumentsCount || 15);
      setKeyRevelations(articleToEdit.keyRevelations || []);
      const combined = articleToEdit.sections
        .map((s) => (s.title ? `## ${s.title}\n\n` : '') + s.paragraphs.join('\n\n'))
        .join('\n\n---\n\n');
      setMainContent(combined);
    } else {
      setTitle('');
      setSubtitle('');
      setChapeau('');
      setCategory('Environnement');
      setCategoryTag('Article exclusif');
      setAuthorName('Cellule Investigation Six%');
      setAuthorRole('Journaliste d\'investigation');
      setAuthorAvatar(DEFAULT_AVATARS[0]);
      setPublishedAt('17 Septembre 2026');
      setReadTimeMinutes(8);
      setHeroImage(SUGGESTED_HERO_IMAGES[0].url);
      setHeroImageCaption('Photographie / illustration exclusive');
      setIsPopular(false);
      setIsFeatured(false);
      setInvestigationDays(150);
      setLeakedDocumentsCount(18);
      setKeyRevelations([
        'Révélation documentée sur les flux financiers non déclarés.',
        'Obtention de mémos internes confirmant la prise de décision confidentielle.',
      ]);
      setMainContent(
        '## I. Les premières alertes\n\nPendant six mois, notre cellule a rassemblé des témoignages concordants et recoupé les bases de données publiques.\n\n## II. Les preuves documentaires\n\nLes pièces obtenues révèlent un faisceau d\'indices indiscutables sur les mécanismes mis en œuvre.'
      );
    }
  }, [articleToEdit, isOpen]);

  if (!isOpen) return null;

  const handleAddRevelation = () => {
    if (!newRevelation.trim()) return;
    setKeyRevelations([...keyRevelations, newRevelation.trim()]);
    setNewRevelation('');
  };

  const handleRemoveRevelation = (idx: number) => {
    setKeyRevelations(keyRevelations.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !chapeau.trim()) {
      alert('Veuillez remplir au moins le titre et le chapô de l\'article.');
      return;
    }

    const slug = articleToEdit?.slug || title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    // Parse simple sections from content
    const parsedSections = mainContent
      .split(/\n\s*---\s*\n/)
      .map((secStr) => {
        const lines = secStr.split('\n').map((l) => l.trim()).filter(Boolean);
        let secTitle = '';
        const paras: string[] = [];

        for (const line of lines) {
          if (line.startsWith('## ')) {
            secTitle = line.replace('## ', '');
          } else {
            paras.push(line);
          }
        }

        return {
          title: secTitle || undefined,
          paragraphs: paras.length > 0 ? paras : ['Détails complets de l\'article vérifiés par la rédaction.'],
        };
      });

    const newArticle: Article = {
      id: articleToEdit?.id || `art-custom-${Date.now()}`,
      slug,
      title: title.trim(),
      subtitle: subtitle.trim() || 'Article approfondi par la rédaction de Six%',
      chapeau: chapeau.trim(),
      category,
      categoryTag: categoryTag.trim() || 'Dossier Spécial',
      author: {
        name: authorName.trim(),
        role: authorRole.trim(),
        avatar: authorAvatar,
      },
      publishedAt: publishedAt || '17 Septembre 2026',
      readTimeMinutes: Number(readTimeMinutes) || 8,
      heroImage: heroImage.trim(),
      heroImageCaption: heroImageCaption.trim() || 'Photographie / document exclusif',
      isPopular,
      isFeatured,
      investigationDays: articleToEdit?.investigationDays || Number(investigationDays) || 90,
      leakedDocumentsCount: articleToEdit?.leakedDocumentsCount || Number(leakedDocumentsCount) || 12,
      audioDuration: `${Math.round(readTimeMinutes * 0.9)} min`,
      keyRevelations: keyRevelations.length > 0 ? keyRevelations : ['Article complet disponible.'],
      sections: parsedSections.length > 0 ? parsedSections : [
        {
          title: 'I. Le rapport d\'investigation',
          paragraphs: ['L\'article a été soumis à un triple recoupement documentaire avant publication.'],
        },
      ],
      sourcesCount: Math.round(Number(leakedDocumentsCount) * 0.75) + 3,
      verifiedFactChecks: Math.round(Number(leakedDocumentsCount) * 1.5) + 8,
      contentHtml: articleToEdit?.contentHtml,
    };

    onSave(newArticle);
    onClose();
  };

  const availableCategories = categories.filter((c) => c.value !== 'Tous');

  return (
    <div
      id="article-editor-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#3f241c]/75 backdrop-blur-xs overflow-y-auto animate-in fade-in"
    >
      <div className="bg-[#eae5da] w-full max-w-3xl rounded-2xl border-2 border-[#3f241c] shadow-2xl my-8 text-[#3f241c] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#3f241c] text-[#eae5da] px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#839b64] text-[#eae5da] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#839b64] font-bold block">
                Gestion Éditoriale Six%
              </span>
              <h3 className="text-base font-bold text-[#eae5da]">
                {articleToEdit ? 'Modifier l\'article' : 'Rédiger un nouvel article'}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#eae5da]/70 hover:text-[#eae5da] hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Google Docs Mode Banner */}
        {onOpenGoogleDocsMode && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200 px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shrink-0">
            <div className="flex items-center gap-2 text-blue-950 font-medium">
              <span className="text-lg">📄</span>
              <span>
                <strong>Éditeur enrichi disponible :</strong> Rédigez avec mise en forme directe (Gras, Souligné, Tailles, Alignement, etc.).
              </span>
            </div>
            <button
              type="button"
              onClick={onOpenGoogleDocsMode}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-xs shrink-0 cursor-pointer flex items-center gap-1.5"
            >
              <span>Ouvrir dans l'éditeur</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* Section: Titres */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#839b64] font-bold border-b border-[#3f241c]/15 pb-1">
              1. En-tête & Définition de l'article
            </h4>

            <div>
              <label className="block text-xs font-bold font-mono uppercase text-[#3f241c] mb-1">
                Titre principal de l'article *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="ex. Les milliards fantômes des aides publiques dévoyées"
                required
                className="w-full px-3.5 py-2 rounded-xl bg-[#f4f0e8] border border-[#3f241c]/25 focus:border-[#839b64] outline-none text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold font-mono uppercase text-[#3f241c] mb-1">
                Sous-titre / Accroche
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="ex. Comment un montage offshore a permis d'éluder les contrôles fiscaux."
                className="w-full px-3.5 py-2 rounded-xl bg-[#f4f0e8] border border-[#3f241c]/25 focus:border-[#839b64] outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold font-mono uppercase text-[#3f241c] mb-1">
                Chapô d'introduction (résumé éditorial percutant) *
              </label>
              <textarea
                value={chapeau}
                onChange={(e) => setChapeau(e.target.value)}
                rows={3}
                placeholder="Pendant neuf mois d'investigation, Six% a reconstitué les flux..."
                required
                className="w-full px-3.5 py-2 rounded-xl bg-[#f4f0e8] border border-[#3f241c]/25 focus:border-[#839b64] outline-none text-sm"
              />
            </div>
          </div>

          {/* Section: Catégorisation & Visibilité */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#839b64] font-bold border-b border-[#3f241c]/15 pb-1">
              2. Catégorisation & Visibilité
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold font-mono uppercase text-[#3f241c] mb-1">
                  Catégorie thématique
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#f4f0e8] border border-[#3f241c]/25 focus:border-[#839b64] outline-none text-sm"
                >
                  {availableCategories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                  {!availableCategories.some((c) => c.value === category) && (
                    <option value={category}>{category}</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold font-mono uppercase text-[#3f241c] mb-1">
                  Tag de rubrique
                </label>
                <input
                  type="text"
                  value={categoryTag}
                  onChange={(e) => setCategoryTag(e.target.value)}
                  placeholder="ex. Dossier Énergie & Pouvoir"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#f4f0e8] border border-[#3f241c]/25 focus:border-[#839b64] outline-none text-sm"
                />
              </div>
            </div>

            {/* Checkboxes for featured & popular */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <label className="flex items-center gap-3 p-3 rounded-xl bg-[#f4f0e8] border border-[#3f241c]/15 cursor-pointer hover:border-[#839b64] transition-colors">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-[#839b64] focus:ring-[#839b64] accent-[#839b64]"
                />
                <div>
                  <span className="font-bold text-xs block">À la une de la rédaction</span>
                  <span className="text-[11px] text-[#3f241c]/70">Affiché en tête de liste dans sa catégorie</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-[#f4f0e8] border border-[#3f241c]/15 cursor-pointer hover:border-[#839b64] transition-colors">
                <input
                  type="checkbox"
                  checked={isPopular}
                  onChange={(e) => setIsPopular(e.target.checked)}
                  className="w-4 h-4 rounded text-[#839b64] focus:ring-[#839b64] accent-[#839b64]"
                />
                <div>
                  <span className="font-bold text-xs block">Carrousel 3D Populaire</span>
                  <span className="text-[11px] text-[#3f241c]/70">Visible dans la bannière 3D interactive</span>
                </div>
              </label>
            </div>
          </div>

          {/* Section: Auteur & Données */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#839b64] font-bold border-b border-[#3f241c]/15 pb-1">
              3. Journaliste & Temps de lecture
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold font-mono uppercase text-[#3f241c] mb-1">
                  Nom du journaliste
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="ex. Aprilia Narducci"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#f4f0e8] border border-[#3f241c]/25 focus:border-[#839b64] outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold font-mono uppercase text-[#3f241c] mb-1">
                  Rôle / Titre
                </label>
                <input
                  type="text"
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value)}
                  placeholder="ex. Journaliste d'investigation financière"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#f4f0e8] border border-[#3f241c]/25 focus:border-[#839b64] outline-none text-sm"
                />
              </div>
            </div>

            {/* Author Avatar Selector */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold font-mono uppercase text-[#3f241c]">
                  Photo du journaliste / auteur
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setMediaPickerTarget('author');
                    setIsMediaPickerOpen(true);
                  }}
                  className="inline-flex items-center gap-1 text-[11px] text-[#839b64] hover:underline font-bold cursor-pointer"
                >
                  <FolderOpen className="w-3 h-3" />
                  <span>Choisir dans la médiathèque</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={authorAvatar}
                  alt={authorName}
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#839b64] shrink-0 shadow-xs"
                />
                <input
                  type="url"
                  value={authorAvatar}
                  onChange={(e) => setAuthorAvatar(e.target.value)}
                  placeholder="URL de l'avatar..."
                  className="flex-1 px-3 py-1.5 rounded-xl bg-[#f4f0e8] border border-[#3f241c]/25 text-xs font-mono outline-none"
                />
                <div className="flex items-center gap-1.5 shrink-0">
                  {DEFAULT_AVATARS.map((av, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAuthorAvatar(av)}
                      className={`w-7 h-7 rounded-full overflow-hidden border-2 cursor-pointer transition-all ${
                        authorAvatar === av ? 'border-[#839b64] scale-110 shadow-xs' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={av} alt="Avatar suggestion" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold font-mono uppercase text-[#3f241c] mb-1">
                  Temps de lecture (min)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={readTimeMinutes}
                  onChange={(e) => setReadTimeMinutes(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#f4f0e8] border border-[#3f241c]/25 outline-none text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold font-mono uppercase text-[#3f241c] mb-1">
                  Date de publication
                </label>
                <input
                  type="text"
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                  placeholder="ex. 17 Septembre 2026"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#f4f0e8] border border-[#3f241c]/25 outline-none text-sm"
                />
              </div>
            </div>
          </div>

          {/* Section: Image de une */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#839b64] font-bold border-b border-[#3f241c]/15 pb-1">
              4. Visuel principal
            </h4>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold font-mono uppercase text-[#3f241c]">
                  Image de couverture
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setMediaPickerTarget('hero');
                    setIsMediaPickerOpen(true);
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#839b64] hover:bg-[#728956] text-[#eae5da] text-[11px] font-bold transition-colors cursor-pointer shadow-xs"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span>Choisir dans la médiathèque</span>
                </button>
              </div>

              <div className="flex gap-3 items-center">
                {heroImage && (
                  <div className="w-20 h-14 rounded-xl overflow-hidden bg-black/10 border border-[#3f241c]/25 shrink-0">
                    <img src={heroImage} alt="Aperçu" className="w-full h-full object-cover" />
                  </div>
                )}
                <input
                  type="url"
                  value={heroImage}
                  onChange={(e) => setHeroImage(e.target.value)}
                  placeholder="https://images.unsplash.com/... ou URL issue de la médiathèque"
                  className="flex-1 px-3.5 py-2 rounded-xl bg-[#f4f0e8] border border-[#3f241c]/25 focus:border-[#839b64] outline-none text-xs font-mono"
                />
              </div>
            </div>

            {/* Quick suggested presets */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-[11px] font-mono text-[#3f241c]/60 shrink-0">Préréglages :</span>
              {SUGGESTED_HERO_IMAGES.map((img) => (
                <button
                  key={img.label}
                  type="button"
                  onClick={() => setHeroImage(img.url)}
                  className={`px-2.5 py-1 rounded-lg border text-xs whitespace-nowrap cursor-pointer transition-colors ${
                    heroImage === img.url
                      ? 'bg-[#839b64] text-[#eae5da] border-[#839b64]'
                      : 'bg-[#f4f0e8] text-[#3f241c] border-[#3f241c]/20 hover:border-[#839b64]'
                  }`}
                >
                  {img.label}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs font-bold font-mono uppercase text-[#3f241c] mb-1">
                Légende de l'image
              </label>
              <input
                type="text"
                value={heroImageCaption}
                onChange={(e) => setHeroImageCaption(e.target.value)}
                placeholder="ex. Concessions maritimes explorées au large de Clarion-Clipperton"
                className="w-full px-3.5 py-2 rounded-xl bg-[#f4f0e8] border border-[#3f241c]/25 outline-none text-xs"
              />
            </div>
          </div>

          {/* Section: Révélations clés */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#839b64] font-bold border-b border-[#3f241c]/15 pb-1">
              5. Révélations clés du dossier ({keyRevelations.length})
            </h4>

            <div className="space-y-2">
              {keyRevelations.map((rev, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between gap-2 p-2.5 rounded-xl bg-[#ded8cc] border border-[#3f241c]/15 text-xs"
                >
                  <span className="font-bold text-[#839b64] font-mono shrink-0">#{index + 1}</span>
                  <span className="flex-1 text-[#3f241c]">{rev}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveRevelation(index)}
                    className="text-red-700 hover:text-red-900 cursor-pointer p-1"
                    title="Supprimer cette révélation"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newRevelation}
                onChange={(e) => setNewRevelation(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddRevelation();
                  }
                }}
                placeholder="Ajouter une révélation marquante..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-[#f4f0e8] border border-[#3f241c]/25 focus:border-[#839b64] outline-none text-xs"
              />
              <button
                type="button"
                onClick={handleAddRevelation}
                className="px-3.5 py-2 rounded-xl bg-[#3f241c] text-[#eae5da] text-xs font-bold hover:bg-[#2b1812] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter</span>
              </button>
            </div>
          </div>

          {/* Section: Contenu */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-[#3f241c]/15 pb-1">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#839b64] font-bold">
                6. Corps de l'article (Markdown / Paragraphes)
              </h4>
              {onOpenGoogleDocsMode && (
                <button
                  type="button"
                  onClick={onOpenGoogleDocsMode}
                  className="text-xs text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Basculer vers l'éditeur plein écran →</span>
                </button>
              )}
            </div>

            {/* Quick formatting toolbar */}
            <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#ded8cc] rounded-xl border border-[#3f241c]/15 text-xs">
              <button
                type="button"
                onClick={() => insertTextFormatting('**', '**')}
                className="px-2 py-1 rounded bg-[#eae5da] hover:bg-white text-[#3f241c] font-bold flex items-center gap-1 cursor-pointer border border-[#3f241c]/15"
                title="Mettre en gras (**texte**)"
              >
                <Bold className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Gras</span>
              </button>
              <button
                type="button"
                onClick={() => insertTextFormatting('<u>', '</u>')}
                className="px-2 py-1 rounded bg-[#eae5da] hover:bg-white text-[#3f241c] underline flex items-center gap-1 cursor-pointer border border-[#3f241c]/15"
                title="Souligner (<u>texte</u>)"
              >
                <Underline className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Souligné</span>
              </button>
              <button
                type="button"
                onClick={() => insertTextFormatting('*', '*')}
                className="px-2 py-1 rounded bg-[#eae5da] hover:bg-white text-[#3f241c] italic flex items-center gap-1 cursor-pointer border border-[#3f241c]/15"
                title="Mettre en italique (*texte*)"
              >
                <Italic className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Italique</span>
              </button>
              <span className="w-px h-4 bg-[#3f241c]/20 mx-1" />
              <button
                type="button"
                onClick={() => insertTextFormatting('\n\n## ', '\n\n')}
                className="px-2 py-1 rounded bg-[#eae5da] hover:bg-white text-[#3f241c] font-bold flex items-center gap-1 cursor-pointer border border-[#3f241c]/15"
                title="Grand titre de section"
              >
                <Heading2 className="w-3.5 h-3.5" />
                <span>Titre H2</span>
              </button>
              <button
                type="button"
                onClick={() => insertTextFormatting('\n\n> ', '\n\n')}
                className="px-2 py-1 rounded bg-[#eae5da] hover:bg-white text-[#3f241c] flex items-center gap-1 cursor-pointer border border-[#3f241c]/15"
                title="Citation / Exergue"
              >
                <Quote className="w-3.5 h-3.5" />
                <span>Citation</span>
              </button>
              <button
                type="button"
                onClick={() => insertTextFormatting('\n- ', '\n- ')}
                className="px-2 py-1 rounded bg-[#eae5da] hover:bg-white text-[#3f241c] flex items-center gap-1 cursor-pointer border border-[#3f241c]/15"
                title="Liste à puces"
              >
                <List className="w-3.5 h-3.5" />
                <span>Puces</span>
              </button>
              <button
                type="button"
                onClick={() => insertTextFormatting('\n\n---\n\n')}
                className="px-2 py-1 rounded bg-[#eae5da] hover:bg-white text-[#3f241c] font-mono text-[11px] cursor-pointer border border-[#3f241c]/15"
                title="Nouvelle section"
              >
                --- Section
              </button>
            </div>

            <p className="text-[11px] text-[#3f241c]/70">
              Tapez votre texte ou utilisez les boutons ci-dessus. Pour un confort total comme sur un traitement de texte, ouvrez l'<strong>Éditeur</strong>.
            </p>
            <textarea
              ref={textareaRef}
              value={mainContent}
              onChange={(e) => setMainContent(e.target.value)}
              rows={7}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#f4f0e8] border border-[#3f241c]/25 focus:border-[#839b64] outline-none text-xs font-mono leading-relaxed"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[#3f241c]/20 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#3f241c]/20 hover:bg-[#ded8cc] text-xs font-bold text-[#3f241c] transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              id="save-article-submit-btn"
              className="px-5 py-2.5 rounded-xl bg-[#839b64] hover:bg-[#728956] text-[#eae5da] text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{articleToEdit ? 'Enregistrer les modifications' : 'Publier l\'article'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Sub-modal: Media Library Image Picker */}
      {isMediaPickerOpen && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 sm:p-6 bg-[#3f241c]/85 backdrop-blur-xs animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsMediaPickerOpen(false);
          }}
        >
          <div className="bg-[#eae5da] w-full max-w-4xl rounded-2xl border-2 border-[#3f241c] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
            <div className="p-4 bg-[#3f241c] text-[#eae5da] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-[#839b64]" />
                <div>
                  <h3 className="font-bold text-sm">
                    Médiathèque • Choisir {mediaPickerTarget === 'hero' ? "l'image de couverture" : 'l\'avatar du journaliste'}
                  </h3>
                  <p className="text-[11px] font-mono text-[#839b64]">
                    Sélectionnez une image existante ou téléversez un nouveau fichier depuis votre ordinateur
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMediaPickerOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center cursor-pointer text-[#eae5da]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              <MediaLibrary
                articles={[]}
                isPickerMode={true}
                onSelectImage={(url) => {
                  if (mediaPickerTarget === 'hero') {
                    setHeroImage(url);
                  } else {
                    setAuthorAvatar(url);
                  }
                  setIsMediaPickerOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
