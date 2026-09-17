import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ARTICLES_DATA } from './data/articles';
import { DEFAULT_DONORS, Donor } from './data/donors';
import { DEFAULT_JOURNALISTS } from './data/journalists';
import { Article, Category, Journalist } from './types';
import { Navbar, NavTabId } from './components/Navbar';
import { Carousel3D } from './components/Carousel3D';
import { ArticleCard } from './components/ArticleCard';
import { ArticleReader } from './components/ArticleReader';
import { SearchBar } from './components/SearchBar';
import { FavoritesModal } from './components/FavoritesModal';
import { Footer } from './components/Footer';
import { DonorsMarquee } from './components/DonorsMarquee';
import { EditorialTeamSection } from './components/EditorialTeamSection';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { isSessionAdminAuthenticated, setSessionAdminAuthenticated } from './lib/adminAuth';
import { Newspaper, Sparkles, Filter, Bookmark, AlertCircle, ArrowUpRight, Shield, Lock, Settings } from 'lucide-react';
import {
  subscribeArticles,
  saveArticleToCloud,
  deleteArticleFromCloud,
  subscribeJournalists,
  saveJournalistToCloud,
  deleteJournalistFromCloud,
  subscribeDonors,
  saveDonorToCloud,
  deleteDonorFromCloud,
  resetAllCloudData,
} from './lib/firebase';
import { INITIAL_MEDIA_PRESETS } from './lib/mediaStorage';

const STORAGE_KEY_BOOKMARKS = 'six_pourcent_bookmarked_ids';
const STORAGE_KEY_ARTICLES = 'six_pourcent_articles_db';
const STORAGE_KEY_DONORS = 'six_pourcent_donors_db';
const STORAGE_KEY_JOURNALISTS = 'six_pourcent_journalists_db';

export default function App() {
  // Articles state initialized from local cache or default editorial data
  const [articles, setArticles] = useState<Article[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ARTICLES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load custom articles', e);
    }
    return ARTICLES_DATA;
  });

  // Donors state
  const [donors, setDonors] = useState<Donor[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DONORS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load custom donors', e);
    }
    return DEFAULT_DONORS;
  });

  // Journalists state
  const [journalists, setJournalists] = useState<Journalist[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_JOURNALISTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((j: Journalist) => {
            const defaultMatch = DEFAULT_JOURNALISTS.find((dj) => dj.id === j.id);
            if (defaultMatch) {
              return {
                ...j,
                name: defaultMatch.name,
                email: defaultMatch.email,
                bio: defaultMatch.bio,
              };
            }
            if (j.name === 'Claire Vandevelde') {
              return { ...j, name: 'Aprilia Narducci', email: 'a.narducci@six-pourcent.media' };
            }
            if (j.name === 'Marc Delorme') {
              return { ...j, name: 'Olivier Dos Santos Pereira', email: 'o.dossantospereira@six-pourcent.media' };
            }
            if (j.name === 'Sarah Benmoussa') {
              return { ...j, name: 'Garance Bribosia', email: 'g.bribosia@six-pourcent.media' };
            }
            if (j.name === 'Lucas Bernard') {
              return { ...j, name: 'Héloise Massaux', email: 'h.massaux@six-pourcent.media' };
            }
            if (j.name === 'Thomas Lemoine') {
              return { ...j, name: 'Alya Birkenbaum', email: 'a.birkenbaum@six-pourcent.media' };
            }
            if (j.name === 'Hélène Roche') {
              return { ...j, name: 'Aicha Adghoghi', email: 'a.adghoghi@six-pourcent.media' };
            }
            return j;
          });
        }
      }
    } catch (e) {
      console.error('Failed to load custom journalists', e);
    }
    return DEFAULT_JOURNALISTS;
  });

  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('Tous');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
      return saved ? JSON.parse(saved) : ['art-01', 'art-04'];
    } catch {
      return ['art-01', 'art-04'];
    }
  });
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [activeNavTab, setActiveNavTab] = useState<NavTabId>('populaires');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Admin states
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return isSessionAdminAuthenticated();
  });
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const popularSectionRef = useRef<HTMLDivElement | null>(null);

  // Sync bookmarks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(bookmarkedIds));
    } catch (e) {
      console.error('Failed to persist bookmarks', e);
    }
  }, [bookmarkedIds]);

  // Sync custom articles to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ARTICLES, JSON.stringify(articles));
    } catch (e) {
      console.error('Failed to persist articles', e);
    }
  }, [articles]);

  // Sync custom donors to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DONORS, JSON.stringify(donors));
    } catch (e) {
      console.error('Failed to persist donors', e);
    }
  }, [donors]);

  // Sync custom journalists to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_JOURNALISTS, JSON.stringify(journalists));
    } catch (e) {
      console.error('Failed to persist journalists', e);
    }
  }, [journalists]);

  // Real-time Cloud Firestore Subscriptions for Articles, Journalists & Donors
  useEffect(() => {
    const unsubArticles = subscribeArticles((cloudArticles) => {
      if (cloudArticles && cloudArticles.length > 0) {
        setArticles(cloudArticles);
      }
    }, articles);

    const unsubJournalists = subscribeJournalists((cloudJournalists) => {
      if (cloudJournalists && cloudJournalists.length > 0) {
        setJournalists(cloudJournalists);
      }
    }, journalists);

    const unsubDonors = subscribeDonors((cloudDonors) => {
      if (cloudDonors && cloudDonors.length > 0) {
        setDonors(cloudDonors);
      }
    }, donors);

    return () => {
      unsubArticles();
      unsubJournalists();
      unsubDonors();
    };
  }, []);

  // Handle URL hash changes for direct deep linking and back button support
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        const found = articles.find((a) => a.slug === hash || a.id === hash);
        if (found) {
          setSelectedArticle(found);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }
      setSelectedArticle(null);
    };

    // Check initial hash
    if (window.location.hash) {
      handleHashChange();
    }

    window.addEventListener('popstate', handleHashChange);
    return () => window.removeEventListener('popstate', handleHashChange);
  }, [articles]);

  // Update active navigation tab based on scroll position when on homepage
  useEffect(() => {
    if (selectedArticle) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const separatorEl = document.getElementById('section-separator-database');
      const popularEl = document.getElementById('carousel-3d-section');

      if (separatorEl && scrollY >= separatorEl.offsetTop - 140) {
        setActiveNavTab('recherche');
      } else {
        setActiveNavTab('populaires');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [selectedArticle]);

  const handleNavTabSelect = (tab: NavTabId) => {
    setActiveNavTab(tab);
    if (tab === 'populaires') {
      if (selectedArticle) {
        setSelectedArticle(null);
        window.history.pushState(null, '', window.location.pathname);
      }
      setTimeout(() => {
        const section = document.getElementById('carousel-3d-section');
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    } else if (tab === 'recherche') {
      if (selectedArticle) {
        setSelectedArticle(null);
        window.history.pushState(null, '', window.location.pathname);
      }
      setTimeout(() => {
        const separator = document.getElementById('section-separator-database');
        if (separator) {
          const navbarHeight = 85;
          const targetY = separator.getBoundingClientRect().top + window.scrollY - navbarHeight;
          window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
        } else {
          const searchSec = document.getElementById('section-search-database');
          if (searchSec) {
            searchSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }, 50);
    } else if (tab === 'favoris') {
      setIsFavoritesOpen(true);
    }
  };

  const handleSelectArticle = (article: Article) => {
    setSelectedArticle(article);
    setActiveNavTab('lecture');
    setIsMobileMenuOpen(false);
    window.location.hash = article.slug;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToOverview = () => {
    setSelectedArticle(null);
    setActiveNavTab('populaires');
    setIsMobileMenuOpen(false);
    window.history.pushState(null, '', window.location.pathname);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleBookmark = (articleId: string) => {
    setBookmarkedIds((prev) => 
      prev.includes(articleId) 
        ? prev.filter((id) => id !== articleId) 
        : [...prev, articleId]
    );
  };

  const clearAllBookmarks = () => {
    setBookmarkedIds([]);
  };

  const handleOpenAdmin = () => {
    if (isAdminAuthenticated) {
      setIsAdminDashboardOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    setIsAdminLoginOpen(false);
    setIsAdminDashboardOpen(true);
  };

  const handleAdminLogout = () => {
    setSessionAdminAuthenticated(false);
    setIsAdminAuthenticated(false);
    setIsAdminDashboardOpen(false);
  };

  // Article Management handlers
  const handleAddArticle = (newArticle: Article) => {
    setArticles((prev) => [newArticle, ...prev]);
    saveArticleToCloud(newArticle).catch((err) =>
      console.warn('[Firebase Cloud] Erreur enregistrement article:', err)
    );
  };

  const handleUpdateArticle = (updatedArticle: Article) => {
    setArticles((prev) =>
      prev.map((art) => (art.id === updatedArticle.id ? updatedArticle : art))
    );
    if (selectedArticle && selectedArticle.id === updatedArticle.id) {
      setSelectedArticle(updatedArticle);
    }
    saveArticleToCloud(updatedArticle).catch((err) =>
      console.warn('[Firebase Cloud] Erreur mise à jour article:', err)
    );
  };

  const handleDeleteArticle = (id: string) => {
    setArticles((prev) => prev.filter((art) => art.id !== id));
    if (selectedArticle && selectedArticle.id === id) {
      setSelectedArticle(null);
      window.history.pushState(null, '', window.location.pathname);
    }
    deleteArticleFromCloud(id).catch((err) =>
      console.warn('[Firebase Cloud] Erreur suppression article:', err)
    );
  };

  const handleTogglePopular = (id: string) => {
    setArticles((prev) =>
      prev.map((art) => {
        if (art.id === id) {
          const updated = { ...art, isPopular: !art.isPopular };
          saveArticleToCloud(updated).catch((err) =>
            console.warn('[Firebase Cloud] Erreur toggle popular:', err)
          );
          return updated;
        }
        return art;
      })
    );
  };

  const handleToggleFeatured = (id: string) => {
    setArticles((prev) =>
      prev.map((art) => {
        if (art.id === id) {
          const updated = { ...art, isFeatured: !art.isFeatured };
          saveArticleToCloud(updated).catch((err) =>
            console.warn('[Firebase Cloud] Erreur toggle featured:', err)
          );
          return updated;
        }
        return art;
      })
    );
  };

  const handleResetArticles = () => {
    localStorage.removeItem(STORAGE_KEY_ARTICLES);
    setArticles(ARTICLES_DATA);
    resetAllCloudData(
      ARTICLES_DATA,
      DEFAULT_JOURNALISTS,
      DEFAULT_DONORS,
      INITIAL_MEDIA_PRESETS
    ).catch((err) =>
      console.warn('[Firebase Cloud] Erreur réinitialisation:', err)
    );
  };

  const handlePreviewArticle = (article: Article) => {
    setSelectedArticle(article);
    setActiveNavTab('lecture');
    setIsMobileMenuOpen(false);
    window.location.hash = article.slug;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Donor Management handlers
  const handleAddDonor = (newDonor: Donor) => {
    setDonors((prev) => [newDonor, ...prev]);
    saveDonorToCloud(newDonor).catch((err) =>
      console.warn('[Firebase Cloud] Erreur ajout donateur:', err)
    );
  };

  const handleDeleteDonor = (id: string) => {
    setDonors((prev) => prev.filter((d) => d.id !== id));
    deleteDonorFromCloud(id).catch((err) =>
      console.warn('[Firebase Cloud] Erreur suppression donateur:', err)
    );
  };

  const handleResetDonors = () => {
    localStorage.removeItem(STORAGE_KEY_DONORS);
    setDonors(DEFAULT_DONORS);
    DEFAULT_DONORS.forEach((d) =>
      saveDonorToCloud(d).catch(() => {})
    );
  };

  // Journalist Management handlers
  const handleAddJournalist = (newJournalist: Journalist) => {
    setJournalists((prev) => [newJournalist, ...prev]);
    saveJournalistToCloud(newJournalist).catch((err) =>
      console.warn('[Firebase Cloud] Erreur ajout journaliste:', err)
    );
  };

  const handleUpdateJournalist = (updatedJournalist: Journalist) => {
    setJournalists((prev) =>
      prev.map((j) => (j.id === updatedJournalist.id ? updatedJournalist : j))
    );
    saveJournalistToCloud(updatedJournalist).catch((err) =>
      console.warn('[Firebase Cloud] Erreur mise à jour journaliste:', err)
    );
  };

  const handleDeleteJournalist = (id: string) => {
    setJournalists((prev) => prev.filter((j) => j.id !== id));
    deleteJournalistFromCloud(id).catch((err) =>
      console.warn('[Firebase Cloud] Erreur suppression journaliste:', err)
    );
  };

  const handleResetJournalists = () => {
    localStorage.removeItem(STORAGE_KEY_JOURNALISTS);
    setJournalists(DEFAULT_JOURNALISTS);
    DEFAULT_JOURNALISTS.forEach((j) =>
      saveJournalistToCloud(j).catch(() => {})
    );
  };

  // Filtered articles based on search & category
  const filteredArticles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return articles.filter((article) => {
      const matchesCategory = selectedCategory === 'Tous' || article.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!query) return true;

      const inTitle = article.title.toLowerCase().includes(query);
      const inSubtitle = article.subtitle.toLowerCase().includes(query);
      const inChapeau = article.chapeau.toLowerCase().includes(query);
      const inAuthor = article.author.name.toLowerCase().includes(query);
      const inCategory = article.category.toLowerCase().includes(query);
      const inRevelations = article.keyRevelations.some((k) => k.toLowerCase().includes(query));

      return inTitle || inSubtitle || inChapeau || inAuthor || inCategory || inRevelations;
    });
  }, [articles, searchQuery, selectedCategory]);

  // Popular articles specifically for the 3D Carousel
  const popularArticles = useMemo(() => {
    return articles.filter((a) => a.isPopular);
  }, [articles]);

  // Bookmarked articles
  const bookmarkedArticles = useMemo(() => {
    return articles.filter((a) => bookmarkedIds.includes(a.id));
  }, [articles, bookmarkedIds]);

  const handleFocusSearch = () => {
    if (selectedArticle) {
      setSelectedArticle(null);
    }
    const input = document.getElementById('global-search-input');
    if (input) {
      input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      input.focus();
    }
  };

  const handleScrollToPopular = () => {
    if (selectedArticle) {
      setSelectedArticle(null);
    }
    setTimeout(() => {
      const section = document.getElementById('carousel-3d-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const showFeatured = selectedCategory !== 'Tous' && !searchQuery;
  const featuredArticle = showFeatured ? filteredArticles[0] : null;
  const gridArticles = showFeatured ? filteredArticles.slice(1) : filteredArticles;

  return (
    <div className="min-h-screen bg-[#eae5da] text-[#3f241c] flex flex-col selection:bg-[#839b64] selection:text-[#eae5da]">
      {/* Top Navigation using Navbar1 responsive floating pill system */}
      <Navbar
        currentTab={activeNavTab}
        onTabSelect={handleNavTabSelect}
        favoritesCount={bookmarkedIds.length}
        isInArticleReader={!!selectedArticle}
        onGoHome={handleBackToOverview}
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuOpenChange={setIsMobileMenuOpen}
      />

      {/* Conditional View: Either Full Distraction-Free Article Reader OR Homepage with 3D Carousel & Grid */}
      {selectedArticle ? (
        <ArticleReader
          article={selectedArticle}
          onBack={handleBackToOverview}
          isBookmarked={bookmarkedIds.includes(selectedArticle.id)}
          onToggleBookmark={toggleBookmark}
          allArticles={articles}
          onSelectArticle={handleSelectArticle}
          isMobileMenuOpen={isMobileMenuOpen}
        />
      ) : (
        <main className="flex-1 w-full pb-20">
          {/* Hero Editorial Presentation */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-4">
            <div className="border-b-2 border-[#3f241c]/20 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 text-xs font-mono text-[#839b64] uppercase font-bold tracking-wider mb-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#839b64]"></span>
                  Média d'investigation en accès libre & indépendant
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#3f241c] tracking-tight leading-[1.08]">
                  Ce que le pouvoir préférerait garder sous silence.
                </h1>
                <p className="mt-4 text-base sm:text-lg text-[#3f241c]/80 leading-relaxed max-w-2xl font-normal">
                  Chaque semaine, notre cellule de journalistes et data-analystes décortique contrats confidentiels, données satellitaires et mémos déclassifiés. Lisez en un clic chaque dossier vérifié.
                </p>
              </div>

              {/* Editorial Metric Pills */}
              <div className="flex sm:flex-col gap-3 shrink-0">
                <div className="p-3 rounded-xl bg-[#f4f0e8] border border-[#3f241c]/15 text-left">
                  <span className="block text-2xl font-black text-[#839b64] font-mono leading-none">100%</span>
                  <span className="text-[11px] font-mono text-[#3f241c]/70 uppercase">Indépendant</span>
                </div>
                <div className="p-3 rounded-xl bg-[#f4f0e8] border border-[#3f241c]/15 text-left">
                  <span className="block text-2xl font-black text-[#3f241c] font-mono leading-none">320+</span>
                  <span className="text-[11px] font-mono text-[#3f241c]/70 uppercase">Documents vérifiés</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive 3D Parallax Carousel (User requirement: carrousel en 3D interactif avec effet parallaxe) */}
          <div ref={popularSectionRef}>
            <Carousel3D
              articles={popularArticles}
              onSelectArticle={handleSelectArticle}
              bookmarkedIds={bookmarkedIds}
              onToggleBookmark={toggleBookmark}
            />
          </div>

          {/* Search & Filter Section */}
          <section id="section-search-database" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <div id="section-separator-database" className="border-t-2 border-[#3f241c]/15 pt-10 scroll-mt-20">
              <div className="text-center mb-6">
                <span className="text-xs font-mono text-[#839b64] uppercase font-bold tracking-widest">
                  Base de données des enquêtes
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#3f241c] mt-1">
                  Explorer tous nos dossiers
                </h2>
              </div>

              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                totalResults={filteredArticles.length}
              />

              {/* No results notice */}
              {filteredArticles.length === 0 && (
                <div className="py-16 text-center bg-[#f4f0e8] rounded-2xl border-2 border-dashed border-[#3f241c]/20 p-8 my-6">
                  <AlertCircle className="w-12 h-12 text-[#3f241c]/40 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-[#3f241c]">Aucune enquête ne correspond à votre recherche</h3>
                  <p className="text-sm text-[#3f241c]/70 mt-1 max-w-md mx-auto">
                    Essayez d'autres mots-clés ou sélectionnez une autre catégorie pour explorer nos dossiers.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('Tous');
                    }}
                    className="mt-4 px-4 py-2 rounded-lg bg-[#839b64] text-[#eae5da] text-xs font-bold hover:bg-[#728956] transition-colors cursor-pointer"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              )}

              {/* Featured Leading Investigation Card */}
              {featuredArticle && (
                <div className="mb-10">
                  <div className="flex items-center gap-2 mb-3 text-xs font-mono text-[#839b64] uppercase font-bold tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    À la une de la rédaction
                  </div>
                  <ArticleCard
                    article={featuredArticle}
                    onSelectArticle={handleSelectArticle}
                    isBookmarked={bookmarkedIds.includes(featuredArticle.id)}
                    onToggleBookmark={toggleBookmark}
                    variant="featured"
                  />
                </div>
              )}

              {/* Grid of Investigative Articles */}
              {gridArticles.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-[#3f241c]">
                      {showFeatured
                        ? "Autres dossiers d'investigation"
                        : searchQuery
                        ? 'Résultats de recherche'
                        : selectedCategory === 'Tous'
                        ? 'Toutes les enquêtes'
                        : `Dossiers ${selectedCategory}`}
                    </h3>
                    <span className="text-xs font-mono text-[#3f241c]/60">
                      {gridArticles.length} {gridArticles.length > 1 ? 'publications disponibles' : 'publication disponible'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {gridArticles.map((article) => (
                      <ArticleCard
                        key={article.id}
                        article={article}
                        onSelectArticle={handleSelectArticle}
                        isBookmarked={bookmarkedIds.includes(article.id)}
                        onToggleBookmark={toggleBookmark}
                        variant="standard"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Reader Favorites Quick Banner if items saved */}
          {bookmarkedArticles.length > 0 && (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
              <div className="p-6 sm:p-8 rounded-2xl bg-[#ded8cc] border border-[#3f241c]/20 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#839b64] text-[#eae5da] flex items-center justify-center shrink-0 shadow">
                    <Bookmark className="w-6 h-6 fill-current" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#3f241c]">
                      Vous avez {bookmarkedArticles.length} {bookmarkedArticles.length > 1 ? 'enquêtes sauvegardées' : 'enquête sauvegardée'}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#3f241c]/70">
                      Reprenez vos lectures où vous vous êtes arrêté, sans distraction.
                    </p>
                  </div>
                </div>

                <button
                  id="open-favs-banner-btn"
                  onClick={() => setIsFavoritesOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#3f241c] hover:bg-[#2b1812] text-[#eae5da] text-xs sm:text-sm font-bold transition-all shadow cursor-pointer whitespace-nowrap active:scale-95"
                >
                  Ouvrir mes favoris
                </button>
              </div>
            </section>
          )}

          {/* Présentation de l'équipe de rédaction */}
          <EditorialTeamSection journalists={journalists} />

          {/* Bandeau défilant des donateurs et donatrices */}
          <DonorsMarquee donors={donors} />
        </main>
      )}

      {/* Favorites Modal */}
      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => {
          setIsFavoritesOpen(false);
          setActiveNavTab(selectedArticle ? 'lecture' : 'populaires');
        }}
        bookmarkedArticles={bookmarkedArticles}
        onSelectArticle={handleSelectArticle}
        onRemoveBookmark={toggleBookmark}
        onClearAll={clearAllBookmarks}
      />

      {/* Global Editorial Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          handleBackToOverview();
          const searchSection = document.getElementById('search-filter-section');
          if (searchSection) {
            searchSection.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        onGoHome={handleBackToOverview}
        onOpenAdmin={handleOpenAdmin}
        isAdminAuthenticated={isAdminAuthenticated}
      />

      {/* Admin Quick Floating Bar when authenticated */}
      {isAdminAuthenticated && (
        <div className="fixed bottom-4 right-4 z-40 animate-in fade-in slide-in-from-bottom-2">
          <button
            id="admin-floating-quick-btn"
            onClick={() => setIsAdminDashboardOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#3f241c] text-[#eae5da] text-xs font-mono font-bold shadow-xl border-2 border-[#839b64] hover:bg-[#2b1812] transition-all cursor-pointer hover:scale-105 active:scale-95"
            title="Ouvrir le panneau d'administration de la rédaction"
          >
            <Shield className="w-4 h-4 text-[#839b64]" />
            <span>Admin Six%</span>
            <span className="w-2 h-2 rounded-full bg-[#839b64] animate-pulse" />
          </button>
        </div>
      )}

      {/* Admin Login Modal (password required, confidential) */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      {/* Full Admin Dashboard & CMS */}
      <AdminDashboard
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        onLogout={handleAdminLogout}
        articles={articles}
        onAddArticle={handleAddArticle}
        onUpdateArticle={handleUpdateArticle}
        onDeleteArticle={handleDeleteArticle}
        onTogglePopular={handleTogglePopular}
        onToggleFeatured={handleToggleFeatured}
        onResetArticles={handleResetArticles}
        onPreviewArticle={handlePreviewArticle}
        donors={donors}
        onAddDonor={handleAddDonor}
        onDeleteDonor={handleDeleteDonor}
        onResetDonors={handleResetDonors}
        journalists={journalists}
        onAddJournalist={handleAddJournalist}
        onUpdateJournalist={handleUpdateJournalist}
        onDeleteJournalist={handleDeleteJournalist}
        onResetJournalists={handleResetJournalists}
      />
    </div>
  );
}
