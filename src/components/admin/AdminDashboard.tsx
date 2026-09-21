import React, { useState, useMemo, useEffect } from 'react';
import {
  Shield,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Eye,
  Star,
  Sparkles,
  LogOut,
  X,
  RotateCcw,
  Search,
  Heart,
  FileCheck2,
  BookOpen,
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle,
  Download,
  Flame,
  FolderOpen,
  User,
  Users,
  Tag,
  Database,
  FileText,
} from 'lucide-react';
import { Article, Category, Journalist } from '../../types';
import { CATEGORIES } from '../../data/articles';
import { Donor } from '../../data/donors';
import { ArticleEditorModal } from './ArticleEditorModal';
import { GoogleDocsArticleEditor } from './GoogleDocsArticleEditor';
import { MediaLibrary } from './MediaLibrary';
import { JournalistEditorModal } from './JournalistEditorModal';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  articles: Article[];
  onAddArticle: (article: Article) => void;
  onUpdateArticle: (article: Article) => void;
  onDeleteArticle: (id: string) => void;
  onTogglePopular: (id: string) => void;
  onToggleFeatured: (id: string) => void;
  onResetArticles: () => void;
  onPreviewArticle: (article: Article) => void;
  donors: Donor[];
  onAddDonor: (donor: Donor) => void;
  onDeleteDonor: (id: string) => void;
  onResetDonors: () => void;
  journalists: Journalist[];
  onAddJournalist: (journalist: Journalist) => void;
  onUpdateJournalist: (journalist: Journalist) => void;
  onDeleteJournalist: (id: string) => void;
  onResetJournalists: () => void;
  categories?: { label: string; value: string }[];
  onAddCategory?: (category: { label: string; value: string }) => void;
  onDeleteCategory?: (categoryValue: string) => void;
  onResetCategories?: () => void;
  totalDonorsCount?: number;
  onUpdateTotalDonorsCount?: (count: number) => void;
}

type AdminTab = 'articles' | 'categories' | 'journalistes' | 'donateurs' | 'media' | 'maintenance';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  onLogout,
  articles,
  onAddArticle,
  onUpdateArticle,
  onDeleteArticle,
  onTogglePopular,
  onToggleFeatured,
  onResetArticles,
  onPreviewArticle,
  donors,
  onAddDonor,
  onDeleteDonor,
  onResetDonors,
  journalists,
  onAddJournalist,
  onUpdateJournalist,
  onDeleteJournalist,
  onResetJournalists,
  categories = CATEGORIES,
  onAddCategory,
  onDeleteCategory,
  onResetCategories,
  totalDonorsCount = 1428,
  onUpdateTotalDonorsCount,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('articles');
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('Tous');
  const [articleToEdit, setArticleToEdit] = useState<Article | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isGoogleDocsOpen, setIsGoogleDocsOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Category management state
  const [newCatLabel, setNewCatLabel] = useState('');
  const [newCatValue, setNewCatValue] = useState('');
  const [categoryDeleteConfirm, setCategoryDeleteConfirm] = useState<string | null>(null);
  const categoriesList = categories && categories.length > 0 ? categories : CATEGORIES;

  // Journalists state
  const [journalistToEdit, setJournalistToEdit] = useState<Journalist | null>(null);
  const [isJournalistEditorOpen, setIsJournalistEditorOpen] = useState(false);
  const [quickPhotoJournalist, setQuickPhotoJournalist] = useState<Journalist | null>(null);
  const [deleteJournalistConfirmId, setDeleteJournalistConfirmId] = useState<string | null>(null);

  const handleAssignMediaToArticle = (articleId: string, imageUrl: string, imageCaption?: string) => {
    const found = articles.find((a) => a.id === articleId);
    if (found) {
      const updated: Article = {
        ...found,
        heroImage: imageUrl,
        heroImageCaption: imageCaption || found.heroImageCaption,
      };
      onUpdateArticle(updated);
    }
  };

  // New Donor form state
  const [donorName, setDonorName] = useState('');
  const [donorLocation, setDonorLocation] = useState('');
  const [donorNote, setDonorNote] = useState('Donateur');
  const [donorSuccessMsg, setDonorSuccessMsg] = useState(false);

  // Annotated donor count state (synced with homepage public text)
  const [annotatedCountInput, setAnnotatedCountInput] = useState<string>(() =>
    totalDonorsCount !== undefined ? String(totalDonorsCount) : '1428'
  );
  const [annotatedCountSaved, setAnnotatedCountSaved] = useState(false);

  useEffect(() => {
    if (totalDonorsCount !== undefined) {
      setAnnotatedCountInput(String(totalDonorsCount));
    }
  }, [totalDonorsCount]);

  const handleSaveAnnotatedCount = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(annotatedCountInput, 10);
    if (!isNaN(parsed) && parsed >= 0) {
      if (onUpdateTotalDonorsCount) {
        onUpdateTotalDonorsCount(parsed);
      }
      setAnnotatedCountSaved(true);
      setTimeout(() => setAnnotatedCountSaved(false), 3000);
    }
  };

  const handleUseListCount = () => {
    const listLen = donors.length;
    setAnnotatedCountInput(String(listLen));
    if (onUpdateTotalDonorsCount) {
      onUpdateTotalDonorsCount(listLen);
    }
    setAnnotatedCountSaved(true);
    setTimeout(() => setAnnotatedCountSaved(false), 3000);
  };

  // Filtered articles
  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      const matchesCat = categoryFilter === 'Tous' || a.category === categoryFilter;
      if (!matchesCat) return false;
      if (!searchFilter.trim()) return true;
      const q = searchFilter.toLowerCase();
      return (
        a.title.toLowerCase().includes(q) ||
        a.author.name.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
      );
    });
  }, [articles, categoryFilter, searchFilter]);

  if (!isOpen) return null;

  const handleOpenNewArticle = () => {
    setArticleToEdit(null);
    setIsEditorOpen(true);
  };

  const handleOpenGoogleDocsNew = () => {
    setArticleToEdit(null);
    setIsGoogleDocsOpen(true);
  };

  const handleOpenEditArticle = (article: Article) => {
    setArticleToEdit(article);
    setIsEditorOpen(true);
  };

  const handleOpenGoogleDocsEdit = (article: Article) => {
    setArticleToEdit(article);
    setIsGoogleDocsOpen(true);
  };

  const handleSaveArticle = (saved: Article) => {
    const exists = articles.some((a) => a.id === saved.id);
    if (articleToEdit || exists) {
      onUpdateArticle(saved);
    } else {
      onAddArticle(saved);
    }
  };

  const handleSaveJournalist = (savedJournalist: Journalist) => {
    const isExisting = journalists.some((j) => j.id === savedJournalist.id);
    if (isExisting) {
      onUpdateJournalist(savedJournalist);
    } else {
      onAddJournalist(savedJournalist);
    }

    // Auto-propagate journalist avatar & role to all articles authored by this journalist
    articles.forEach((art) => {
      if (art.author.name.toLowerCase() === savedJournalist.name.toLowerCase()) {
        if (art.author.avatar !== savedJournalist.avatar || art.author.role !== savedJournalist.role) {
          onUpdateArticle({
            ...art,
            author: {
              ...art.author,
              name: savedJournalist.name,
              role: savedJournalist.role,
              avatar: savedJournalist.avatar,
            },
          });
        }
      }
    });
  };

  const handleCreateDonor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName.trim()) return;

    const newDonor: Donor = {
      id: `donor-${Date.now()}`,
      name: donorName.trim(),
      location: donorLocation.trim() || undefined,
      note: donorNote.trim() || undefined,
    };

    onAddDonor(newDonor);
    setDonorName('');
    setDonorLocation('');
    setDonorNote('Donateur');
    setDonorSuccessMsg(true);
    setTimeout(() => setDonorSuccessMsg(false), 3000);
  };

  const handleExportArticlesJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(articles, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `six_pourcent_articles_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const popularCount = articles.filter((a) => a.isPopular).length;

  return (
    <div
      id="admin-dashboard-container"
      className="fixed inset-0 z-50 flex flex-col bg-[#eae5da] text-[#3f241c] overflow-hidden"
    >
      {/* Top Admin Bar */}
      <header className="bg-[#3f241c] text-[#eae5da] border-b-4 border-[#839b64] px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#839b64] text-[#eae5da] flex items-center justify-center font-black shadow">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm sm:text-base font-extrabold tracking-tight">
                Six<span className="text-[#839b64]">%</span> Administration
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-[#839b64]/20 text-[#839b64] border border-[#839b64]/40">
                Session active
              </span>
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1.5 bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 shadow-xs"
                title="Synchronisation permanente activée sur Google Firebase Firestore"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Cloud Firebase connecté</span>
              </span>
            </div>
            <p className="text-[11px] font-mono text-[#eae5da]/70 hidden sm:block">
              Gestion éditoriale, base de données des dossiers & donateurs
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            id="admin-new-editor-article-btn"
            onClick={handleOpenGoogleDocsNew}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer border border-blue-500"
            title="Rédiger dans l'éditeur de texte enrichi (Gras, Souligné, Tailles, Alignement...)"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Éditeur</span>
            <span className="sm:hidden">Éditeur</span>
          </button>

          <button
            id="admin-new-article-btn"
            onClick={handleOpenNewArticle}
            className="px-3.5 py-2 rounded-xl bg-[#839b64] hover:bg-[#728956] text-[#eae5da] text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nouvel article</span>
            <span className="sm:hidden">Créer</span>
          </button>

          <button
            id="admin-view-site-btn"
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#eae5da] text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border border-white/15"
            title="Revenir sur le site public en restant connecté"
          >
            <Eye className="w-4 h-4" />
            <span>Voir le site</span>
          </button>

          <button
            id="admin-logout-btn"
            onClick={onLogout}
            className="px-3 py-2 rounded-xl bg-red-900/30 hover:bg-red-900/50 text-red-200 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border border-red-700/40"
            title="Se déconnecter de l'administration"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </header>

      {/* Admin Navigation Tabs & Stats Ribbon */}
      <div className="bg-[#ded8cc] border-b border-[#3f241c]/20 px-4 sm:px-8 py-2.5 flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2 text-xs font-mono font-bold">
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'articles'
                ? 'bg-[#3f241c] text-[#eae5da] shadow-xs'
                : 'text-[#3f241c]/70 hover:text-[#3f241c] hover:bg-[#eae5da]/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Articles & Dossiers ({articles.length})</span>
          </button>

          <button
            id="admin-tab-categories-btn"
            onClick={() => setActiveTab('categories')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'categories'
                ? 'bg-[#3f241c] text-[#eae5da] shadow-xs'
                : 'text-[#3f241c]/70 hover:text-[#3f241c] hover:bg-[#eae5da]/60'
            }`}
          >
            <Tag className="w-4 h-4 text-[#839b64]" />
            <span>Catégories ({categoriesList.length})</span>
          </button>

          <button
            id="admin-tab-journalistes-btn"
            onClick={() => setActiveTab('journalistes')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'journalistes'
                ? 'bg-[#3f241c] text-[#eae5da] shadow-xs'
                : 'text-[#3f241c]/70 hover:text-[#3f241c] hover:bg-[#eae5da]/60'
            }`}
          >
            <Users className="w-4 h-4 text-[#839b64]" />
            <span>Journalistes & Rédaction ({journalists.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('donateurs')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'donateurs'
                ? 'bg-[#3f241c] text-[#eae5da] shadow-xs'
                : 'text-[#3f241c]/70 hover:text-[#3f241c] hover:bg-[#eae5da]/60'
            }`}
          >
            <Heart className="w-4 h-4 text-[#839b64]" />
            <span>Donateurs ({new Intl.NumberFormat('fr-FR').format(totalDonorsCount !== undefined ? totalDonorsCount : donors.length)})</span>
          </button>

          <button
            id="admin-tab-media-btn"
            onClick={() => setActiveTab('media')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'media'
                ? 'bg-[#3f241c] text-[#eae5da] shadow-xs'
                : 'text-[#3f241c]/70 hover:text-[#3f241c] hover:bg-[#eae5da]/60'
            }`}
          >
            <FolderOpen className="w-4 h-4 text-[#839b64]" />
            <span>Médiathèque</span>
          </button>

          <button
            onClick={() => setActiveTab('maintenance')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'maintenance'
                ? 'bg-[#3f241c] text-[#eae5da] shadow-xs'
                : 'text-[#3f241c]/70 hover:text-[#3f241c] hover:bg-[#eae5da]/60'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Maintenance & Export</span>
          </button>
        </div>

        {/* Quick Summary Badges */}
        <div className="flex items-center gap-3 text-[11px] font-mono text-[#3f241c]/80">
          <span className="flex items-center gap-1 bg-[#f4f0e8] px-2.5 py-1 rounded-md border border-[#3f241c]/15">
            <Flame className="w-3.5 h-3.5 text-[#839b64]" />
            <span>{popularCount} Populaires (3D)</span>
          </span>
        </div>
      </div>

      {/* Main Tab Content */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* TAB 1: ARTICLES MANAGEMENT */}
          {activeTab === 'articles' && (
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-[#f4f0e8] p-4 rounded-2xl border border-[#3f241c]/15">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#3f241c]/50" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Rechercher par titre, auteur..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#eae5da] border border-[#3f241c]/20 text-xs text-[#3f241c] outline-none focus:border-[#839b64]"
                  />
                  {searchFilter && (
                    <button
                      onClick={() => setSearchFilter('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#3f241c]/60 hover:text-[#3f241c]"
                    >
                      ×
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                  <span className="text-xs font-mono text-[#3f241c]/70 shrink-0">Catégorie :</span>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-[#eae5da] border border-[#3f241c]/20 text-xs font-medium text-[#3f241c] outline-none"
                  >
                    {categoriesList.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Articles Table/Card List */}
              <div className="bg-[#f4f0e8] rounded-2xl border border-[#3f241c]/15 overflow-hidden shadow-xs">
                <div className="p-4 border-b border-[#3f241c]/15 flex items-center justify-between bg-[#ded8cc]/50">
                  <h3 className="font-extrabold text-sm text-[#3f241c]">
                    Articles enregistrés ({filteredArticles.length})
                  </h3>
                  <span className="text-xs font-mono text-[#3f241c]/60">
                    Cliquez sur Carrousel 3D pour basculer l'affichage dans la bannière 3D
                  </span>
                </div>

                {filteredArticles.length === 0 ? (
                  <div className="p-12 text-center text-xs text-[#3f241c]/70 space-y-3">
                    <p>Aucun article ne correspond à ce filtre.</p>
                    <button
                      onClick={() => {
                        setSearchFilter('');
                        setCategoryFilter('Tous');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#839b64] text-[#eae5da] font-bold"
                    >
                      Effacer les filtres
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-[#3f241c]/10">
                    {filteredArticles.map((article) => (
                      <div
                        key={article.id}
                        className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#eae5da]/40 transition-colors"
                      >
                        {/* Thumbnail & Info */}
                        <div className="flex items-start gap-4 flex-1">
                          <img
                            src={article.heroImage}
                            alt={article.title}
                            className="w-20 h-16 sm:w-24 sm:h-20 object-cover rounded-xl border border-[#3f241c]/15 shrink-0"
                          />
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                              <span className="px-2 py-0.5 rounded-md bg-[#839b64]/15 text-[#839b64] font-bold">
                                {article.category}
                              </span>
                              <span className="text-[#3f241c]/60">• {article.publishedAt}</span>
                              <span className="text-[#3f241c]/60">• {article.readTimeMinutes} min lecture</span>
                            </div>

                            <h4 className="font-bold text-sm sm:text-base text-[#3f241c] line-clamp-2 leading-snug">
                              {article.title}
                            </h4>

                            <p className="text-xs text-[#3f241c]/70 line-clamp-1">
                              Par <span className="font-semibold text-[#3f241c]">{article.author.name}</span> ({article.author.role})
                            </p>
                          </div>
                        </div>

                        {/* Badges & Actions */}
                        <div className="flex flex-wrap items-center gap-3 shrink-0 self-end md:self-center">
                          {/* Popular in 3D Carousel Toggle */}
                          <button
                            type="button"
                            onClick={() => onTogglePopular(article.id)}
                            className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                              article.isPopular
                                ? 'bg-[#839b64] text-[#eae5da] border-[#839b64]'
                                : 'bg-[#eae5da] text-[#3f241c]/60 border-[#3f241c]/20 hover:border-[#839b64]'
                            }`}
                            title="Activer/désactiver dans le carrousel 3D populaire"
                          >
                            <Flame className="w-3.5 h-3.5" />
                            <span>Carrousel 3D</span>
                          </button>

                          {/* Preview in Reader */}
                          <button
                            type="button"
                            onClick={() => {
                              onPreviewArticle(article);
                              onClose();
                            }}
                            className="p-2 rounded-xl bg-[#eae5da] border border-[#3f241c]/20 text-[#3f241c] hover:bg-[#3f241c] hover:text-[#eae5da] transition-colors cursor-pointer"
                            title="Lire l'article en mode lecteur public"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>

                          {/* Edit Article in Editor Mode */}
                          <button
                            type="button"
                            onClick={() => handleOpenGoogleDocsEdit(article)}
                            className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
                            title="Ouvrir dans l'éditeur (Gras, Souligné, Tailles, Alignement...)"
                          >
                            <FileText className="w-4 h-4" />
                          </button>

                          {/* Edit Article */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditArticle(article)}
                            className="p-2 rounded-xl bg-[#839b64]/20 border border-[#839b64]/40 text-[#3f241c] hover:bg-[#839b64] hover:text-[#eae5da] transition-colors cursor-pointer"
                            title="Modifier les options et métadonnées de l'article"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* Delete Article */}
                          {deleteConfirmId === article.id ? (
                            <div className="flex items-center gap-1 bg-red-100 p-1 rounded-xl border border-red-300 animate-in fade-in">
                              <span className="text-[10px] text-red-800 font-bold px-1">Confirmer ?</span>
                              <button
                                type="button"
                                onClick={() => {
                                  onDeleteArticle(article.id);
                                  setDeleteConfirmId(null);
                                }}
                                className="px-2 py-1 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 cursor-pointer"
                              >
                                Oui
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-2 py-1 bg-gray-200 text-gray-700 rounded-lg text-xs cursor-pointer"
                              >
                                Non
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(article.id)}
                              className="p-2 rounded-xl bg-red-50 border border-red-200 text-red-600 hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                              title="Supprimer cet article"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: THEMATIC CATEGORIES MANAGEMENT */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              {/* Header Ribbon */}
              <div className="bg-[#f4f0e8] p-5 sm:p-6 rounded-2xl border border-[#3f241c]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Tag className="w-5 h-5 text-[#839b64]" />
                    <h3 className="font-extrabold text-base text-[#3f241c]">
                      Gestion des Catégories Thématiques
                    </h3>
                  </div>
                  <p className="text-xs text-[#3f241c]/80 mt-1 max-w-2xl">
                    Créez ou supprimez les rubriques éditoriales du média Six%. Les catégories actives sont immédiatement synchronisées sur les filtres de recherche, la barre de navigation et le formulaire de rédaction d'articles.
                  </p>
                </div>

                {onResetCategories && (
                  <button
                    onClick={onResetCategories}
                    className="px-3.5 py-2 rounded-xl border border-[#3f241c]/20 hover:bg-[#eae5da] text-xs font-bold text-[#3f241c] transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                    title="Restaurer les rubriques initiales"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[#3f241c]/70" />
                    <span>Rétablir les catégories d'origine</span>
                  </button>
                )}
              </div>

              {/* Add Category Form Card */}
              <div className="bg-[#f4f0e8] p-5 sm:p-6 rounded-2xl border border-[#3f241c]/15 shadow-xs">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#839b64] font-bold mb-3 flex items-center gap-2">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter une nouvelle catégorie thématique</span>
                </h4>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newCatLabel.trim()) return;
                    const finalVal = newCatValue.trim() || newCatLabel.trim();
                    if (onAddCategory) {
                      onAddCategory({ label: newCatLabel.trim(), value: finalVal });
                      setNewCatLabel('');
                      setNewCatValue('');
                    }
                  }}
                  className="flex flex-col sm:flex-row gap-3 items-end"
                >
                  <div className="flex-1 w-full">
                    <label className="block text-xs font-bold font-mono uppercase text-[#3f241c] mb-1">
                      Nom de la rubrique *
                    </label>
                    <input
                      type="text"
                      required
                      value={newCatLabel}
                      onChange={(e) => {
                        setNewCatLabel(e.target.value);
                        if (!newCatValue || newCatValue === newCatLabel) {
                          setNewCatValue(e.target.value);
                        }
                      }}
                      placeholder="ex. Énergie & Climat, Droits Humains, Justice..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#eae5da] border border-[#3f241c]/25 focus:border-[#839b64] outline-none text-sm font-semibold"
                    />
                  </div>

                  <div className="w-full sm:w-64">
                    <label className="block text-xs font-bold font-mono uppercase text-[#3f241c] mb-1">
                      Clé de filtrage (optionnelle)
                    </label>
                    <input
                      type="text"
                      value={newCatValue}
                      onChange={(e) => setNewCatValue(e.target.value)}
                      placeholder="Généré automatiquement..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#eae5da] border border-[#3f241c]/25 focus:border-[#839b64] outline-none text-sm font-mono text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#839b64] hover:bg-[#728956] text-[#eae5da] text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Créer la rubrique</span>
                  </button>
                </form>
              </div>

              {/* Categories Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoriesList.map((cat) => {
                  const isAll = cat.value === 'Tous';
                  const associatedArticles = isAll
                    ? articles
                    : articles.filter(
                        (a) =>
                          a.category.toLowerCase() === cat.value.toLowerCase() ||
                          a.category.toLowerCase() === cat.label.toLowerCase()
                      );

                  return (
                    <div
                      key={cat.value}
                      className="bg-[#f4f0e8] rounded-2xl border border-[#3f241c]/15 p-4 flex flex-col justify-between hover:border-[#839b64]/50 transition-all shadow-xs"
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-[#839b64]/20 border border-[#839b64]/30 flex items-center justify-center text-[#839b64] shrink-0 font-bold">
                            <Tag className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-sm text-[#3f241c] truncate">
                              {cat.label}
                            </h4>
                            <span className="text-[10px] font-mono text-[#3f241c]/60 truncate block">
                              Valeur : {cat.value}
                            </span>
                          </div>
                        </div>

                        {isAll ? (
                          <span className="px-2 py-0.5 rounded-md bg-[#3f241c]/10 text-[#3f241c]/60 text-[10px] font-mono font-bold shrink-0">
                            Principale
                          </span>
                        ) : categoryDeleteConfirm === cat.value ? (
                          <div className="flex items-center gap-1 bg-red-100 p-1 rounded-xl border border-red-300 animate-in fade-in shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                if (onDeleteCategory) onDeleteCategory(cat.value);
                                setCategoryDeleteConfirm(null);
                              }}
                              className="px-2 py-0.5 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 cursor-pointer"
                            >
                              Supprimer
                            </button>
                            <button
                              type="button"
                              onClick={() => setCategoryDeleteConfirm(null)}
                              className="px-1.5 py-0.5 bg-gray-200 text-gray-700 rounded-lg text-xs cursor-pointer"
                            >
                              Annuler
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setCategoryDeleteConfirm(cat.value)}
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer shrink-0"
                            title="Supprimer cette catégorie"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="pt-2 border-t border-[#3f241c]/10 flex items-center justify-between text-xs font-mono text-[#3f241c]/75">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5 text-[#839b64]" />
                          <span>{associatedArticles.length} article{associatedArticles.length > 1 ? 's' : ''}</span>
                        </span>
                        <span className="text-[10px] text-[#839b64] font-bold">
                          {isAll ? 'Tous articles' : 'Rubrique active'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: JOURNALISTS & EDITORIAL TEAM MANAGEMENT */}
          {activeTab === 'journalistes' && (
            <div className="space-y-6">
              {/* Header Ribbon */}
              <div className="bg-[#f4f0e8] p-5 sm:p-6 rounded-2xl border border-[#3f241c]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#839b64]" />
                    <h3 className="font-extrabold text-base text-[#3f241c]">
                      Cellule de Rédaction • Profils des Journalistes
                    </h3>
                  </div>
                  <p className="text-xs text-[#3f241c]/80 mt-1 max-w-2xl">
                    Gérez chaque journaliste de la rédaction Six% : modifiez leur photo de profil (via la médiathèque ou vos fichiers), leur titre éditorial, leur biographie et leurs domaines d'expertise.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    onClick={onResetJournalists}
                    className="px-3.5 py-2 rounded-xl border border-[#3f241c]/20 hover:bg-[#eae5da] text-xs font-bold text-[#3f241c] transition-colors flex items-center gap-1.5 cursor-pointer"
                    title="Restaurer l'équipe de journalistes initiale"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[#3f241c]/70" />
                    <span className="hidden sm:inline">Réinitialiser l'équipe</span>
                  </button>

                  <button
                    onClick={() => {
                      setJournalistToEdit(null);
                      setIsJournalistEditorOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#839b64] hover:bg-[#728956] text-[#eae5da] text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Nouveau profil journaliste</span>
                  </button>
                </div>
              </div>

              {/* Journalists Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {journalists.map((journalist) => {
                  const authoredArticles = articles.filter(
                    (a) => a.author.name.toLowerCase() === journalist.name.toLowerCase()
                  );

                  return (
                    <div
                      key={journalist.id}
                      className="bg-[#f4f0e8] rounded-2xl border border-[#3f241c]/15 hover:border-[#839b64]/60 transition-all p-5 flex flex-col justify-between shadow-xs hover:shadow-md group relative"
                    >
                      <div>
                        {/* Top: Avatar & Quick Photo Action + Info */}
                        <div className="flex items-start gap-4 mb-4">
                          <div className="relative group/avatar shrink-0">
                            <img
                              src={journalist.avatar}
                              alt={journalist.name}
                              className="w-18 h-18 rounded-full object-cover border-3 border-[#839b64] shadow-sm bg-[#3f241c]/10"
                            />
                            {/* Quick photo change button overlay */}
                            <button
                              type="button"
                              onClick={() => setQuickPhotoJournalist(journalist)}
                              className="absolute inset-0 rounded-full bg-black/60 text-white flex flex-col items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer text-[9px] font-bold"
                              title="Changer la photo via la médiathèque"
                            >
                              <FolderOpen className="w-4 h-4 mb-0.5 text-[#839b64]" />
                              <span>Modifier</span>
                            </button>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <h4 className="font-extrabold text-base text-[#3f241c] truncate">
                                {journalist.name}
                              </h4>
                            </div>

                            <p className="text-xs font-medium text-[#839b64] leading-snug mt-0.5 line-clamp-2">
                              {journalist.role}
                            </p>

                            {journalist.joinedYear && (
                              <span className="inline-block text-[10px] font-mono text-[#3f241c]/60 mt-1">
                                Rédaction Six% depuis {journalist.joinedYear}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Bio Excerpt */}
                        {journalist.bio && (
                          <p className="text-xs text-[#3f241c]/80 leading-relaxed mb-3 line-clamp-3 italic">
                            « {journalist.bio} »
                          </p>
                        )}

                        {/* Specialties Tags */}
                        {journalist.specialties && journalist.specialties.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {journalist.specialties.map((spec) => (
                              <span
                                key={spec}
                                className="px-2 py-0.5 rounded-md bg-[#eae5da] text-[#3f241c] border border-[#3f241c]/15 text-[10px] font-mono"
                              >
                                {spec}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Card Footer: Articles Count & Actions */}
                      <div className="pt-3 border-t border-[#3f241c]/15 flex items-center justify-between gap-2 mt-2">
                        <span className="text-[11px] font-mono text-[#3f241c]/75 flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-[#839b64]" />
                          <span>{authoredArticles.length} article{authoredArticles.length > 1 ? 's' : ''}</span>
                        </span>

                        <div className="flex items-center gap-1.5">
                          {/* Quick change photo button */}
                          <button
                            type="button"
                            onClick={() => setQuickPhotoJournalist(journalist)}
                            className="px-2.5 py-1.5 rounded-lg bg-[#eae5da] hover:bg-[#ded8cc] border border-[#3f241c]/20 text-[11px] font-bold text-[#3f241c] flex items-center gap-1 transition-colors cursor-pointer"
                            title="Modifier uniquement la photo de profil via la médiathèque"
                          >
                            <FolderOpen className="w-3 h-3 text-[#839b64]" />
                            <span>Photo</span>
                          </button>

                          {/* Full edit button */}
                          <button
                            type="button"
                            onClick={() => {
                              setJournalistToEdit(journalist);
                              setIsJournalistEditorOpen(true);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-[#3f241c] hover:bg-[#2b1812] text-[#eae5da] text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                            title="Modifier toutes les informations du profil"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Modifier</span>
                          </button>

                          {/* Delete button */}
                          {deleteJournalistConfirmId === journalist.id ? (
                            <div className="flex items-center gap-1 bg-red-100 p-0.5 rounded-lg border border-red-300">
                              <button
                                type="button"
                                onClick={() => {
                                  onDeleteJournalist(journalist.id);
                                  setDeleteJournalistConfirmId(null);
                                }}
                                className="px-2 py-1 bg-red-600 text-white rounded text-[10px] font-bold hover:bg-red-700 cursor-pointer"
                              >
                                Oui
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteJournalistConfirmId(null)}
                                className="px-1.5 py-1 bg-gray-200 text-gray-700 rounded text-[10px] cursor-pointer"
                              >
                                Non
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDeleteJournalistConfirmId(journalist.id)}
                              className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                              title="Supprimer ce profil"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: DONORS & MARQUEE MANAGEMENT */}
          {activeTab === 'donateurs' && (
            <div className="space-y-6">
              {/* SECTION: NOMBRE RÉEL DE DONATEURS ANNOTÉ PAR L'ADMIN */}
              <div className="bg-[#f4f0e8] p-5 sm:p-6 rounded-2xl border border-[#3f241c]/15 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#3f241c]/15">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#839b64]/20 border border-[#839b64]/30 flex items-center justify-center text-[#839b64] shrink-0">
                      <Heart className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-base text-[#3f241c]">
                          Nombre réel de donateurs annoté
                        </h3>
                        <span className="px-2 py-0.5 rounded-md bg-[#839b64]/15 text-[#839b64] font-mono font-bold text-[10px] uppercase">
                          Affiché en direct sur le site
                        </span>
                      </div>
                      <p className="text-xs text-[#3f241c]/70 mt-1 leading-relaxed">
                        Ce nombre est directement injecté dans le texte de la page d'accueil : <em>« grâce au soutien de nos <strong className="text-[#839b64]">{new Intl.NumberFormat('fr-FR').format(parseInt(annotatedCountInput, 10) || totalDonorsCount || donors.length)} donateurs et donatrices</strong> »</em>.
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSaveAnnotatedCount} className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="flex-1 w-full sm:max-w-xs">
                    <label className="block text-[11px] font-mono font-bold uppercase text-[#3f241c]/80 mb-1">
                      Nombre de donateurs à afficher
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={annotatedCountInput}
                      onChange={(e) => setAnnotatedCountInput(e.target.value)}
                      placeholder="ex. 1428"
                      required
                      className="w-full px-3.5 py-2 rounded-xl bg-[#eae5da] border border-[#3f241c]/25 focus:border-[#839b64] outline-none font-bold text-[#3f241c] text-sm"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-0 sm:pt-5 w-full sm:w-auto">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#839b64] hover:bg-[#728956] text-[#eae5da] text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Enregistrer ce nombre</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleUseListCount}
                      className="px-3.5 py-2 rounded-xl bg-[#eae5da] hover:bg-[#ded8cc] border border-[#3f241c]/20 text-xs font-bold text-[#3f241c] transition-colors cursor-pointer"
                      title="Utiliser le nombre exact de profils enregistrés dans la liste"
                    >
                      <span>Synchroniser avec la liste ({donors.length})</span>
                    </button>
                  </div>
                </form>

                {annotatedCountSaved && (
                  <div className="mt-3 p-2.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Le nombre de donateurs a été mis à jour et synchronisé avec le texte public du site !</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form to Add Donor */}
                <div className="lg:col-span-1 bg-[#f4f0e8] p-6 rounded-2xl border border-[#3f241c]/15 space-y-4">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-[#839b64] fill-current" />
                    <h3 className="font-extrabold text-base text-[#3f241c]">
                      Ajouter un donateur
                    </h3>
                  </div>

                  <p className="text-xs text-[#3f241c]/70 leading-relaxed">
                    Les donateurs ajoutés apparaîtront en direct dans le bandeau défilant au bas de la page d'accueil.
                  </p>

                  <form onSubmit={handleCreateDonor} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold font-mono uppercase text-[#3f241c] mb-1">
                        Nom ou Collectif *
                      </label>
                      <input
                        type="text"
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        placeholder="ex. Sophie Germain"
                        required
                        className="w-full px-3 py-2 rounded-xl bg-[#eae5da] border border-[#3f241c]/20 outline-none focus:border-[#839b64]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold font-mono uppercase text-[#3f241c] mb-1">
                        Ville / Région (optionnel)
                      </label>
                      <input
                        type="text"
                        value={donorLocation}
                        onChange={(e) => setDonorLocation(e.target.value)}
                        placeholder="ex. Lyon, Bruxelles, Paris"
                        className="w-full px-3 py-2 rounded-xl bg-[#eae5da] border border-[#3f241c]/20 outline-none focus:border-[#839b64]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold font-mono uppercase text-[#3f241c] mb-1">
                        Type de soutien / Note
                      </label>
                      <input
                        type="text"
                        value={donorNote}
                        onChange={(e) => setDonorNote(e.target.value)}
                        placeholder="ex. Donatrice, Soutien presse libre"
                        className="w-full px-3 py-2 rounded-xl bg-[#eae5da] border border-[#3f241c]/20 outline-none focus:border-[#839b64]"
                      />
                    </div>

                    {donorSuccessMsg && (
                      <div className="p-2.5 rounded-xl bg-[#839b64]/20 border border-[#839b64] text-[#3f241c] text-xs flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#839b64]" />
                        <span>Donateur ajouté au bandeau avec succès !</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-[#839b64] hover:bg-[#728956] text-[#eae5da] font-bold text-xs shadow-sm cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Enregistrer ce donateur</span>
                    </button>
                  </form>

                  <div className="pt-2 border-t border-[#3f241c]/10">
                    <button
                      onClick={onResetDonors}
                      className="text-[11px] text-[#3f241c]/60 hover:text-[#3f241c] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Rétablir la liste de donateurs par défaut</span>
                    </button>
                  </div>
                </div>

                {/* Donors List */}
                <div className="lg:col-span-2 bg-[#f4f0e8] rounded-2xl border border-[#3f241c]/15 overflow-hidden">
                  <div className="p-4 border-b border-[#3f241c]/15 bg-[#ded8cc]/50 flex items-center justify-between">
                    <h3 className="font-extrabold text-sm text-[#3f241c]">
                      Liste des donateurs affichés ({donors.length})
                    </h3>
                  </div>

                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[500px] overflow-y-auto">
                    {donors.map((donor) => (
                      <div
                        key={donor.id}
                        className="p-3 rounded-xl bg-[#eae5da] border border-[#3f241c]/15 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-6 h-6 rounded-full bg-[#839b64] text-[#eae5da] font-bold text-[10px] flex items-center justify-center shrink-0">
                            {donor.name.charAt(0)}
                          </div>
                          <div className="truncate">
                            <span className="font-bold text-[#3f241c] block truncate">
                              {donor.name}
                            </span>
                            <span className="text-[10px] text-[#3f241c]/60 font-mono">
                              {donor.location ? `${donor.location} • ` : ''}
                              {donor.note || 'Donateur'}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => onDeleteDonor(donor.id)}
                          className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors cursor-pointer shrink-0"
                          title="Supprimer ce donateur"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MEDIA LIBRARY */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              <div className="bg-[#f4f0e8] p-5 rounded-2xl border border-[#3f241c]/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-base text-[#3f241c] flex items-center gap-2">
                    <FolderOpen className="w-5 h-5 text-[#839b64]" />
                    <span>Médiathèque de la Rédaction</span>
                  </h3>
                  <p className="text-xs text-[#3f241c]/80 mt-1">
                    Téléversez vos photos et documents depuis votre ordinateur (glisser-déposer ou explorateur). Retrouvez la date, le poids et le nom de chaque fichier, et copiez l'URL en 1 clic pour vos articles et profils.
                  </p>
                </div>
              </div>

              <MediaLibrary
                articles={articles}
                onAssignToArticle={handleAssignMediaToArticle}
              />
            </div>
          )}

          {/* TAB 4: MAINTENANCE & DATA RESET */}
          {activeTab === 'maintenance' && (
            <div className="space-y-6 max-w-3xl">
              {/* Cloud Database Status Card */}
              <div className="bg-[#f4f0e8] p-6 rounded-2xl border-2 border-[#839b64]/30 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Database className="w-5 h-5 text-[#839b64]" />
                    <h3 className="font-extrabold text-base text-[#3f241c]">
                      Base de données Cloud (Google Firebase Firestore)
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-[#839b64]/20 text-[#839b64] border border-[#839b64]/40 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#839b64] animate-pulse" />
                    <span>En ligne & Synchronisé</span>
                  </span>
                </div>

                <p className="text-xs text-[#3f241c]/80 leading-relaxed">
                  Toutes vos modifications (nouveaux articles, photos de la médiathèque, journalistes, catégories et donateurs) sont enregistrées en temps réel dans votre base de données Google Firebase.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono">
                  <div className="bg-[#eae5da] p-3 rounded-xl border border-[#3f241c]/10">
                    <span className="text-[10px] text-[#3f241c]/60 uppercase font-bold block mb-0.5">
                      Projet Cloud
                    </span>
                    <span className="font-bold text-[#3f241c]">artful-apex-rf38q</span>
                  </div>
                  <div className="bg-[#eae5da] p-3 rounded-xl border border-[#3f241c]/10">
                    <span className="text-[10px] text-[#3f241c]/60 uppercase font-bold block mb-0.5">
                      Site officiel déployé
                    </span>
                    <span className="font-bold text-[#839b64]">sixpourcent.vercel.app</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#f4f0e8] p-6 rounded-2xl border border-[#3f241c]/15 space-y-4">
                <div className="flex items-center gap-2.5">
                  <Download className="w-5 h-5 text-[#839b64]" />
                  <h3 className="font-extrabold text-base text-[#3f241c]">
                    Sauvegarde & Export des données
                  </h3>
                </div>

                <p className="text-xs text-[#3f241c]/80 leading-relaxed">
                  Téléchargez une copie JSON complète de l'ensemble des articles de la rédaction Six% pour archivage ou transfert.
                </p>

                <button
                  onClick={handleExportArticlesJSON}
                  className="px-4 py-2 rounded-xl bg-[#3f241c] hover:bg-[#2b1812] text-[#eae5da] text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Exporter les {articles.length} articles (JSON)</span>
                </button>
              </div>

              <div className="bg-[#f4f0e8] p-6 rounded-2xl border border-red-300 space-y-4">
                <div className="flex items-center gap-2.5 text-red-800">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <h3 className="font-extrabold text-base">
                    Zone de Réinitialisation Éditoriale
                  </h3>
                </div>

                <p className="text-xs text-[#3f241c]/80 leading-relaxed">
                  Si vous souhaitez restaurer l'état éditorial initial du média Six% (les 6 articles majeurs créés par la cellule), cliquez sur le bouton ci-dessous.
                </p>

                <button
                  onClick={() => {
                    if (window.confirm('Voulez-vous vraiment réinitialiser tous les articles aux données d\'origine ?')) {
                      onResetArticles();
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Rétablir les articles initiaux de Six%</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Article Editor Modal (Create or Edit) */}
      <ArticleEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveArticle}
        articleToEdit={articleToEdit}
        categories={categoriesList}
        onOpenGoogleDocsMode={() => {
          setIsEditorOpen(false);
          setIsGoogleDocsOpen(true);
        }}
      />

      {/* Google Docs Article Editor Fullscreen */}
      {isGoogleDocsOpen && (
        <GoogleDocsArticleEditor
          isOpen={isGoogleDocsOpen}
          onClose={() => {
            setIsGoogleDocsOpen(false);
            setArticleToEdit(null);
          }}
          onSave={(saved) => {
            handleSaveArticle(saved);
            setIsGoogleDocsOpen(false);
            setArticleToEdit(null);
          }}
          articleToEdit={articleToEdit}
          categories={categoriesList}
        />
      )}

      {/* Journalist Editor Modal (Create or Edit) */}
      <JournalistEditorModal
        isOpen={isJournalistEditorOpen}
        onClose={() => {
          setIsJournalistEditorOpen(false);
          setJournalistToEdit(null);
        }}
        onSave={handleSaveJournalist}
        journalistToEdit={journalistToEdit}
      />

      {/* Sub-modal: Quick Journalist Photo Media Picker */}
      {quickPhotoJournalist && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 sm:p-6 bg-[#3f241c]/85 backdrop-blur-xs animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setQuickPhotoJournalist(null);
          }}
        >
          <div className="bg-[#eae5da] w-full max-w-4xl rounded-2xl border-2 border-[#3f241c] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
            <div className="p-4 bg-[#3f241c] text-[#eae5da] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-[#839b64]" />
                <div>
                  <h3 className="font-bold text-sm">
                    Médiathèque • Modifier la photo de profil de {quickPhotoJournalist.name}
                  </h3>
                  <p className="text-[11px] font-mono text-[#839b64]">
                    Sélectionnez une image existante ou téléversez un nouveau portrait depuis votre ordinateur
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setQuickPhotoJournalist(null)}
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
                  const updated: Journalist = {
                    ...quickPhotoJournalist,
                    avatar: url,
                  };
                  handleSaveJournalist(updated);
                  setQuickPhotoJournalist(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
