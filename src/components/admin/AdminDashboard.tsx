import React, { useState, useMemo } from 'react';
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
  Mail,
  Phone,
  Lock,
  Database,
} from 'lucide-react';
import { Article, Category, Journalist } from '../../types';
import { Donor } from '../../data/donors';
import { ArticleEditorModal } from './ArticleEditorModal';
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
}

type AdminTab = 'articles' | 'journalistes' | 'donateurs' | 'media' | 'maintenance';

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
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('articles');
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('Tous');
  const [articleToEdit, setArticleToEdit] = useState<Article | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

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

  const handleOpenEditArticle = (article: Article) => {
    setArticleToEdit(article);
    setIsEditorOpen(true);
  };

  const handleSaveArticle = (saved: Article) => {
    if (articleToEdit) {
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
  const featuredCount = articles.filter((a) => a.isFeatured).length;

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
            id="admin-new-article-btn"
            onClick={handleOpenNewArticle}
            className="px-3.5 py-2 rounded-xl bg-[#839b64] hover:bg-[#728956] text-[#eae5da] text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nouvelle enquête</span>
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
            <span>Dossiers d'enquête ({articles.length})</span>
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
            <span>Donateurs ({donors.length})</span>
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
          <span className="flex items-center gap-1 bg-[#f4f0e8] px-2.5 py-1 rounded-md border border-[#3f241c]/15">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{featuredCount} À la une</span>
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
                    <option value="Tous">Toutes les catégories</option>
                    <option value="Environnement">Environnement</option>
                    <option value="Surveillance & Tech">Surveillance & Tech</option>
                    <option value="Pouvoir & Finance">Pouvoir & Finance</option>
                    <option value="Santé & Industrie">Santé & Industrie</option>
                    <option value="Société">Société</option>
                  </select>
                </div>
              </div>

              {/* Articles Table/Card List */}
              <div className="bg-[#f4f0e8] rounded-2xl border border-[#3f241c]/15 overflow-hidden shadow-xs">
                <div className="p-4 border-b border-[#3f241c]/15 flex items-center justify-between bg-[#ded8cc]/50">
                  <h3 className="font-extrabold text-sm text-[#3f241c]">
                    Enquêtes enregistrées ({filteredArticles.length})
                  </h3>
                  <span className="text-xs font-mono text-[#3f241c]/60">
                    Cliquez sur les étoiles pour basculer la une ou le carrousel 3D
                  </span>
                </div>

                {filteredArticles.length === 0 ? (
                  <div className="p-12 text-center text-xs text-[#3f241c]/70 space-y-3">
                    <p>Aucune enquête ne correspond à ce filtre.</p>
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

                          {/* Featured Toggle */}
                          <button
                            type="button"
                            onClick={() => onToggleFeatured(article.id)}
                            className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                              article.isFeatured
                                ? 'bg-[#3f241c] text-[#eae5da] border-[#3f241c]'
                                : 'bg-[#eae5da] text-[#3f241c]/60 border-[#3f241c]/20 hover:border-[#3f241c]'
                            }`}
                            title="Activer/désactiver à la une"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>À la une</span>
                          </button>

                          {/* Preview in Reader */}
                          <button
                            type="button"
                            onClick={() => {
                              onPreviewArticle(article);
                              onClose();
                            }}
                            className="p-2 rounded-xl bg-[#eae5da] border border-[#3f241c]/20 text-[#3f241c] hover:bg-[#3f241c] hover:text-[#eae5da] transition-colors cursor-pointer"
                            title="Lire l'enquête en mode lecteur public"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>

                          {/* Edit Article */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditArticle(article)}
                            className="p-2 rounded-xl bg-[#839b64]/20 border border-[#839b64]/40 text-[#3f241c] hover:bg-[#839b64] hover:text-[#eae5da] transition-colors cursor-pointer"
                            title="Modifier cette enquête"
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
                              title="Supprimer cette enquête"
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
                    Gérez chaque journaliste de la rédaction Six% : modifiez leur photo de profil (via la médiathèque ou vos fichiers), leur titre éditorial, leur biographie, leurs expertises et leurs canaux de contact chiffrés.
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
                          <div className="flex flex-wrap gap-1 mb-4">
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

                        {/* Secure transmission credentials */}
                        <div className="space-y-1 py-2 border-t border-[#3f241c]/10 text-[11px] font-mono text-[#3f241c]/70">
                          {journalist.email && (
                            <div className="flex items-center gap-1.5 truncate" title={journalist.email}>
                              <Mail className="w-3 h-3 text-[#839b64] shrink-0" />
                              <span className="truncate">{journalist.email}</span>
                            </div>
                          )}
                          {journalist.signalPhone && (
                            <div className="flex items-center gap-1.5 truncate">
                              <Phone className="w-3 h-3 text-[#839b64] shrink-0" />
                              <span>Signal : {journalist.signalPhone}</span>
                            </div>
                          )}
                          {journalist.pgpFingerprint && (
                            <div className="flex items-center gap-1.5 truncate" title={journalist.pgpFingerprint}>
                              <Lock className="w-3 h-3 text-[#839b64] shrink-0" />
                              <span className="truncate">PGP : {journalist.pgpFingerprint.slice(0, 16)}...</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Footer: Articles Count & Actions */}
                      <div className="pt-3 border-t border-[#3f241c]/15 flex items-center justify-between gap-2 mt-2">
                        <span className="text-[11px] font-mono text-[#3f241c]/75 flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-[#839b64]" />
                          <span>{authoredArticles.length} dossier{authoredArticles.length > 1 ? 's' : ''}</span>
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
                  Toutes vos modifications (nouveaux articles, modifications d'enquêtes, photos de la médiathèque, journalistes et donateurs) sont enregistrées en temps réel dans votre base de données Google Firebase.
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
                  Téléchargez une copie JSON complète de l'ensemble des enquêtes de la rédaction Six% pour archivage ou transfert.
                </p>

                <button
                  onClick={handleExportArticlesJSON}
                  className="px-4 py-2 rounded-xl bg-[#3f241c] hover:bg-[#2b1812] text-[#eae5da] text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Exporter les {articles.length} enquêtes (JSON)</span>
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
                  Si vous souhaitez restaurer l'état éditorial initial du média Six% (les 6 dossiers d'investigation majeurs créés par la cellule), cliquez sur le bouton ci-dessous.
                </p>

                <button
                  onClick={() => {
                    if (window.confirm('Voulez-vous vraiment réinitialiser toutes les enquêtes aux données d\'origine ?')) {
                      onResetArticles();
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Rétablir les enquêtes initiales de Six%</span>
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
      />

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
