import React, { useState, useEffect } from 'react';
import { Article, Journalist } from '../types';
import { 
  ArrowLeft, 
  Bookmark, 
  Share2, 
  Clock, 
  Calendar, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2,
  AlertTriangle,
  Download,
  BookOpen,
  ArrowRight,
  Printer,
  Camera
} from 'lucide-react';
import { ImageEditBadge } from './admin/ImageEditBadge';

interface ArticleReaderProps {
  article: Article;
  onBack: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  allArticles: Article[];
  onSelectArticle: (article: Article) => void;
  isMobileMenuOpen?: boolean;
  isAdmin?: boolean;
  onEditImage?: (article: Article) => void;
  onEditAuthorAvatar?: (journalist: Journalist) => void;
}

export const ArticleReader: React.FC<ArticleReaderProps> = ({
  article,
  onBack,
  isBookmarked,
  onToggleBookmark,
  allArticles,
  onSelectArticle,
  isMobileMenuOpen = false,
  isAdmin = false,
  onEditImage,
  onEditAuthorAvatar,
}) => {
  const [fontSizeLevel, setFontSizeLevel] = useState<'base' | 'large' | 'xlarge'>('large');
  const [copyNotification, setCopyNotification] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);

  // Scroll to top when opening an article
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [article.id]);

  const handleShare = async () => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setCopyNotification(true);
      setTimeout(() => setCopyNotification(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Font size class mapping
  const getBodySizeClass = () => {
    switch (fontSizeLevel) {
      case 'base':
        return 'text-base sm:text-lg leading-relaxed';
      case 'large':
        return 'text-lg sm:text-xl leading-relaxed';
      case 'xlarge':
        return 'text-xl sm:text-2xl leading-loose';
    }
  };

  // Related articles (excluding current)
  const relatedArticles = allArticles
    .filter((a) => a.id !== article.id)
    .slice(0, 3);

  return (
    <article 
      id={`reader-article-${article.id}`} 
      className={`min-h-screen bg-[#eae5da] text-[#3f241c] pb-24 transition-all duration-300 ${
        isZenMode ? 'py-6 max-w-4xl mx-auto' : ''
      }`}
    >
      {/* Sticky Floating Reading Header Bar */}
      <div 
        id="reader-sticky-toolbar"
        className={`sticky top-0 z-40 bg-[#eae5da]/95 backdrop-blur-md border-b border-[#3f241c]/15 py-3 px-4 sm:px-8 transition-all duration-300 ${
          isMobileMenuOpen
            ? 'opacity-0 -translate-y-full pointer-events-none invisible'
            : 'opacity-100 translate-y-0 pointer-events-auto visible'
        }`}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
          {/* Back button */}
          <button
            id="reader-back-btn"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#3f241c] hover:text-[#839b64] px-3 py-1.5 rounded-lg border border-[#3f241c]/20 hover:border-[#839b64] bg-[#eae5da] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Retour au menu principal</span>
            <span className="sm:hidden">Menu principal</span>
          </button>

          {/* Reading info in header */}
          <div className="hidden md:flex items-center gap-2 text-xs text-[#3f241c]/70 font-mono truncate max-w-md">
            <span className="font-semibold text-[#839b64]">{article.category}</span>
            <span>•</span>
            <span className="truncate">{article.title}</span>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Font size switcher */}
            <div className="hidden sm:flex items-center bg-[#ded8cc] rounded-lg p-0.5 border border-[#3f241c]/10">
              <button
                id="font-size-base-btn"
                onClick={() => setFontSizeLevel('base')}
                title="Taille normale"
                className={`px-2 py-1 text-xs font-bold rounded ${
                  fontSizeLevel === 'base' ? 'bg-[#839b64] text-[#eae5da]' : 'text-[#3f241c]/70 hover:text-[#3f241c]'
                }`}
              >
                A
              </button>
              <button
                id="font-size-large-btn"
                onClick={() => setFontSizeLevel('large')}
                title="Grande taille"
                className={`px-2 py-1 text-sm font-bold rounded ${
                  fontSizeLevel === 'large' ? 'bg-[#839b64] text-[#eae5da]' : 'text-[#3f241c]/70 hover:text-[#3f241c]'
                }`}
              >
                A+
              </button>
              <button
                id="font-size-xlarge-btn"
                onClick={() => setFontSizeLevel('xlarge')}
                title="Très grande taille"
                className={`px-2 py-1 text-base font-bold rounded ${
                  fontSizeLevel === 'xlarge' ? 'bg-[#839b64] text-[#eae5da]' : 'text-[#3f241c]/70 hover:text-[#3f241c]'
                }`}
              >
                A++
              </button>
            </div>

            {/* Zen Mode toggle */}
            <button
              id="reader-zen-btn"
              onClick={() => setIsZenMode(!isZenMode)}
              title={isZenMode ? 'Sortir du mode épuré' : 'Mode lecture épurée'}
              className="p-2 rounded-lg bg-[#ded8cc] hover:bg-[#839b64]/20 text-[#3f241c] transition-colors cursor-pointer"
            >
              {isZenMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Bookmark button */}
            <button
              id="reader-bookmark-btn"
              onClick={() => onToggleBookmark(article.id)}
              title={isBookmarked ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                isBookmarked 
                  ? 'bg-[#839b64] text-[#eae5da]' 
                  : 'bg-[#ded8cc] hover:bg-[#839b64]/20 text-[#3f241c]'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>

            {/* Share button */}
            <button
              id="reader-share-btn"
              onClick={handleShare}
              title="Partager l'article"
              className="p-2 rounded-lg bg-[#ded8cc] hover:bg-[#839b64]/20 text-[#3f241c] transition-colors cursor-pointer relative"
            >
              <Share2 className="w-4 h-4" />
              {copyNotification && (
                <span className="absolute -bottom-8 right-0 bg-[#3f241c] text-[#eae5da] text-[10px] font-sans px-2 py-1 rounded shadow whitespace-nowrap">
                  Lien copié !
                </span>
              )}
            </button>

            {/* Print button */}
            <button
              id="reader-print-btn"
              onClick={handlePrint}
              title="Imprimer l'article"
              className="hidden sm:inline-flex p-2 rounded-lg bg-[#ded8cc] hover:bg-[#839b64]/20 text-[#3f241c] transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Article Container */}
      <main className="max-w-3xl sm:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Investigative Header Meta */}
        <div className="mb-6 flex flex-wrap items-center gap-3 text-xs font-mono text-[#3f241c]/80">
          <span className="px-3 py-1 rounded bg-[#839b64] text-[#eae5da] font-bold uppercase tracking-wider">
            {article.categoryTag}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#839b64]" />
            {article.publishedAt}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#839b64]" />
            {article.readTimeMinutes} minutes de lecture
          </span>
        </div>

        {/* Headline & Subtitle */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#3f241c] tracking-tight leading-[1.15] mb-4">
          {article.title}
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-[#3f241c]/85 font-medium leading-relaxed mb-8">
          {article.subtitle}
        </p>

        {/* Reporter Credentials Card */}
        <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[#ded8cc]/50 border border-[#3f241c]/15 mb-8">
          <div className="flex items-center gap-3.5">
            <div className="relative group/avatar">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#839b64]"
              />
              {isAdmin && onEditAuthorAvatar && (
                <button
                  type="button"
                  onClick={() => onEditAuthorAvatar(article.author)}
                  title={`Changer la photo de ${article.author.name}`}
                  className="absolute -bottom-1 -right-1 p-1 rounded-full bg-[#3f241c] text-[#839b64] hover:text-white border border-white/50 cursor-pointer shadow-md"
                >
                  <Camera className="w-3 h-3" />
                </button>
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-[#3f241c]">{article.author.name}</p>
              <p className="text-xs text-[#3f241c]/70">{article.author.role} • Cellule d'investigation Six%</p>
            </div>
          </div>

          {isAdmin && onEditAuthorAvatar && (
            <button
              onClick={() => onEditAuthorAvatar(article.author)}
              className="text-xs font-mono font-bold text-[#3f241c]/80 hover:text-[#839b64] flex items-center gap-1 cursor-pointer px-2.5 py-1 rounded-lg border border-[#3f241c]/20 bg-white/40"
            >
              <Camera className="w-3.5 h-3.5 text-[#839b64]" />
              <span className="hidden sm:inline">Changer l'avatar</span>
            </button>
          )}
        </div>

        {/* Hero Photo with Caption */}
        <div className="relative mb-10 rounded-2xl overflow-hidden shadow-md border border-[#3f241c]/20 group">
          {isAdmin && onEditImage && (
            <ImageEditBadge
              onClick={() => onEditImage(article)}
              tooltip={`Modifier la photo de l'article "${article.title}"`}
              className="top-4 right-4 sm:top-5 sm:right-5"
            />
          )}

          <img
            src={article.heroImage}
            alt={article.title}
            className="w-full max-h-[460px] object-cover"
          />
          <div className="p-3 bg-[#ded8cc]/40 text-xs text-[#3f241c]/80 italic border-t border-[#3f241c]/10 flex items-center justify-between">
            <span>{article.heroImageCaption}</span>
            <span className="font-mono text-[10px] uppercase text-[#3f241c]/60">Crédits : Archives Six%</span>
          </div>
        </div>

        {/* Chapeau / Editorial Lead */}
        <div className="border-l-4 border-[#839b64] pl-6 py-2 mb-10">
          <p className="text-lg sm:text-xl md:text-2xl font-semibold text-[#3f241c] leading-relaxed">
            {article.chapeau}
          </p>
        </div>

        {/* Article Body Sections */}
        <div className={`space-y-8 font-sans ${getBodySizeClass()}`}>
          {article.sections.map((section, idx) => (
            <section key={idx} className="space-y-5">
              {section.title && (
                <h2 className="text-2xl sm:text-3xl font-bold text-[#3f241c] tracking-tight mt-10 mb-4 border-b border-[#3f241c]/15 pb-2">
                  {section.title}
                </h2>
              )}

              {section.paragraphs.map((p, pIdx) => (
                <p key={pIdx} className="text-[#3f241c]/90 leading-relaxed text-justify">
                  {p}
                </p>
              ))}

              {/* Styled Pull Quote */}
              {section.quote && (
                <figure className="my-8 p-6 sm:p-8 rounded-xl bg-[#ded8cc]/60 border-l-4 border-[#839b64]">
                  <blockquote className="text-lg sm:text-xl font-bold text-[#3f241c] italic leading-snug mb-3">
                    {section.quote.text}
                  </blockquote>
                  <figcaption className="text-xs sm:text-sm font-semibold text-[#839b64]">
                    — {section.quote.author}, <span className="text-[#3f241c]/70 font-normal">{section.quote.role}</span>
                  </figcaption>
                </figure>
              )}

              {/* Highlight Box */}
              {section.highlightBox && (
                <div className="my-6 p-5 rounded-xl bg-[#839b64]/15 border border-[#839b64]/40">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#3f241c] mb-1">
                    <AlertTriangle className="w-4 h-4 text-[#839b64]" />
                    <span>{section.highlightBox.title}</span>
                  </div>
                  <p className="text-sm sm:text-base text-[#3f241c]/90">
                    {section.highlightBox.content}
                  </p>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Related Articles Section with 1-Click Read */}
        <section className="mt-16 pt-10 border-t-2 border-[#3f241c]/15">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-[#3f241c]">
              Poursuivre la lecture
            </h3>
            <span className="text-xs font-mono text-[#3f241c]/70">Dossiers associés</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((rel) => (
              <div 
                key={rel.id}
                id={`related-card-${rel.id}`}
                role="button"
                tabIndex={0}
                onClick={() => onSelectArticle(rel)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectArticle(rel);
                  }
                }}
                className="group bg-[#f4f0e8] rounded-xl overflow-hidden border border-[#3f241c]/15 hover:border-[#839b64]/50 flex flex-col justify-between hover:shadow-lg transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#839b64]"
              >
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={rel.heroImage}
                    alt={rel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#839b64] text-[#eae5da] text-[10px] font-bold uppercase">
                    {rel.category}
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <h4 className="text-sm font-bold text-[#3f241c] group-hover:text-[#839b64] line-clamp-2 mb-2 transition-colors">
                    {rel.title}
                  </h4>
                  <div className="flex items-center justify-between text-[11px] text-[#3f241c]/70 pt-3 border-t border-[#3f241c]/10">
                    <span>{rel.readTimeMinutes} min</span>
                    <span
                      id={`btn-read-related-${rel.id}`}
                      className="inline-flex items-center gap-1 font-bold text-[#839b64] group-hover:underline"
                    >
                      Lire en 1 clic
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </article>
  );
};
