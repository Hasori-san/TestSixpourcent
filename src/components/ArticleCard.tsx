import React from 'react';
import { Article, Journalist } from '../types';
import { Clock, Bookmark, ArrowRight, ShieldCheck, FileText, Camera } from 'lucide-react';
import { ImageEditBadge } from './admin/ImageEditBadge';

interface ArticleCardProps {
  article: Article;
  onSelectArticle: (article: Article) => void;
  isBookmarked: boolean;
  onToggleBookmark: (articleId: string) => void;
  variant?: 'featured' | 'standard' | 'compact';
  isAdmin?: boolean;
  onEditImage?: (article: Article) => void;
  onEditAuthorAvatar?: (journalist: Journalist) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onSelectArticle,
  isBookmarked,
  onToggleBookmark,
  variant = 'standard',
  isAdmin = false,
  onEditImage,
  onEditAuthorAvatar,
}) => {
  if (variant === 'featured') {
    return (
      <article
        id={`article-card-featured-${article.id}`}
        onClick={() => onSelectArticle(article)}
        className="group relative rounded-2xl overflow-hidden bg-[#f4f0e8] border border-[#3f241c]/15 shadow-md hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 cursor-pointer"
      >
        <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-full overflow-hidden bg-[#3f241c]">
          {isAdmin && onEditImage && (
            <ImageEditBadge
              onClick={() => onEditImage(article)}
              tooltip={`Modifier la photo de l'enquête "${article.title}"`}
              className="top-4 left-4 sm:left-auto sm:right-16"
            />
          )}

          <img
            src={article.heroImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-95"
            loading="lazy"
          />
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded bg-[#839b64] text-[#eae5da] text-xs font-bold uppercase tracking-wider shadow">
              {article.category}
            </span>
            <span className="px-2.5 py-1 rounded bg-[#3f241c]/80 backdrop-blur-sm text-[#eae5da] text-[11px] font-mono border border-[#eae5da]/20">
              Dossier Exclusif
            </span>
          </div>

          <button
            id={`bookmark-feat-${article.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(article.id);
            }}
            title={isBookmarked ? 'Retirer des favoris' : 'Enregistrer dans les favoris'}
            className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
              isBookmarked 
                ? 'bg-[#839b64] text-[#eae5da]' 
                : 'bg-[#3f241c]/60 text-[#eae5da] hover:bg-[#839b64]'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 text-xs font-mono text-[#3f241c]/70 mb-3">
              <span>{article.publishedAt}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#839b64]" />
                {article.readTimeMinutes} min de lecture
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#3f241c] leading-tight group-hover:text-[#839b64] transition-colors">
              {article.title}
            </h3>

            <p className="text-sm sm:text-base text-[#3f241c]/80 mt-3 line-clamp-3 leading-relaxed">
              {article.chapeau}
            </p>

            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#3f241c]/10 text-xs text-[#3f241c]/80 font-mono">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#839b64]" />
                {article.verifiedFactChecks} faits certifiés
              </span>
              <span className="flex items-center gap-1">
                <FileText className="w-4 h-4 text-[#839b64]" />
                {article.leakedDocumentsCount} fuites analysées
              </span>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 relative group/avatar">
              <div className="relative">
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  className="w-8 h-8 rounded-full object-cover border border-[#839b64]"
                />
                {isAdmin && onEditAuthorAvatar && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditAuthorAvatar(article.author);
                    }}
                    title={`Changer l'avatar de ${article.author.name}`}
                    className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-[#3f241c] text-[#839b64] hover:text-white border border-white/40 cursor-pointer shadow"
                  >
                    <Camera className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
              <span className="text-xs font-bold text-[#3f241c]">
                {article.author.name}
              </span>
            </div>

            <button
              id={`btn-read-feat-${article.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onSelectArticle(article);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#839b64] hover:bg-[#728956] text-[#eae5da] text-xs sm:text-sm font-bold shadow hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              <span>Lire en 1 clic</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      id={`article-card-${article.id}`}
      onClick={() => onSelectArticle(article)}
      className="group relative rounded-2xl overflow-hidden bg-[#f4f0e8] border border-[#3f241c]/15 shadow hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      <div className="relative h-48 sm:h-52 overflow-hidden bg-[#3f241c]">
        {isAdmin && onEditImage && (
          <ImageEditBadge
            onClick={() => onEditImage(article)}
            tooltip={`Modifier la photo de l'enquête "${article.title}"`}
            className="top-3 right-12"
          />
        )}

        <img
          src={article.heroImage}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-95"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded bg-[#839b64] text-[#eae5da] text-[11px] font-bold uppercase tracking-wider shadow">
            {article.category}
          </span>
        </div>

        <button
          id={`bookmark-card-${article.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark(article.id);
          }}
          title={isBookmarked ? 'Retirer des favoris' : 'Enregistrer dans les favoris'}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
            isBookmarked 
              ? 'bg-[#839b64] text-[#eae5da]' 
              : 'bg-[#3f241c]/60 text-[#eae5da] hover:bg-[#839b64]'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#3f241c]/70 mb-2">
            <span>{article.publishedAt}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#839b64]" />
              {article.readTimeMinutes} min
            </span>
          </div>

          <h3 className="text-lg font-bold text-[#3f241c] leading-snug group-hover:text-[#839b64] transition-colors line-clamp-2">
            {article.title}
          </h3>

          <p className="text-xs sm:text-sm text-[#3f241c]/80 mt-2 line-clamp-2 leading-relaxed">
            {article.subtitle}
          </p>
        </div>

        <div className="mt-5 pt-3 border-t border-[#3f241c]/10 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="relative">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-5 h-5 rounded-full object-cover border border-[#839b64]"
              />
              {isAdmin && onEditAuthorAvatar && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditAuthorAvatar(article.author);
                  }}
                  title={`Changer l'avatar de ${article.author.name}`}
                  className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-[#3f241c] text-[#839b64] hover:text-white cursor-pointer shadow"
                >
                  <Camera className="w-2 h-2" />
                </button>
              )}
            </div>
            <span className="text-[11px] font-mono text-[#3f241c]/70 truncate max-w-[120px]">
              {article.author.name}
            </span>
          </div>

          <button
            id={`btn-read-card-${article.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectArticle(article);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#839b64] hover:bg-[#728956] text-[#eae5da] text-xs font-bold transition-colors cursor-pointer shadow-sm"
          >
            <span>Lire en 1 clic</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
};

