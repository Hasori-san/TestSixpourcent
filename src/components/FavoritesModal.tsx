import React from 'react';
import { Article } from '../types';
import { X, Bookmark, BookOpen, Trash2, ArrowRight } from 'lucide-react';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarkedArticles: Article[];
  onSelectArticle: (article: Article) => void;
  onRemoveBookmark: (articleId: string) => void;
  onClearAll: () => void;
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({
  isOpen,
  onClose,
  bookmarkedArticles,
  onSelectArticle,
  onRemoveBookmark,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3f241c]/60 backdrop-blur-sm animate-fade-in">
      <div 
        id="favorites-modal"
        className="relative w-full max-w-2xl max-h-[85vh] bg-[#eae5da] rounded-2xl shadow-2xl border-2 border-[#839b64] overflow-hidden flex flex-col"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-[#ded8cc] border-b border-[#3f241c]/15 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#839b64] flex items-center justify-center text-[#eae5da]">
              <Bookmark className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#3f241c]">Mes Articles Sauvegardés</h2>
              <p className="text-xs text-[#3f241c]/70 font-mono">
                {bookmarkedArticles.length} {bookmarkedArticles.length > 1 ? 'articles enregistrés' : 'article enregistré'} pour lecture ultérieure
              </p>
            </div>
          </div>

          <button
            id="close-favorites-btn"
            onClick={onClose}
            aria-label="Fermer la boîte des favoris"
            className="p-2 rounded-lg text-[#3f241c]/70 hover:text-[#3f241c] hover:bg-[#eae5da] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {bookmarkedArticles.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-[#ded8cc] flex items-center justify-center text-[#3f241c]/40 mx-auto mb-4">
                <Bookmark className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#3f241c] mb-1">Aucun article sauvegardé</h3>
              <p className="text-sm text-[#3f241c]/70 max-w-sm mx-auto">
                Cliquez sur l'icône marque-page sur n'importe quel article pour l'ajouter à vos lectures privilégiées.
              </p>
            </div>
          ) : (
            bookmarkedArticles.map((article) => (
              <div
                key={article.id}
                id={`fav-item-${article.id}`}
                className="p-4 rounded-xl bg-[#f4f0e8] border border-[#3f241c]/15 hover:border-[#839b64] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <img
                    src={article.heroImage}
                    alt={article.title}
                    className="w-16 h-16 rounded-lg object-cover shrink-0 border border-[#3f241c]/15"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#839b64] font-mono">
                      {article.category}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-[#3f241c] truncate">
                      {article.title}
                    </h4>
                    <p className="text-xs text-[#3f241c]/70 font-mono">
                      {article.readTimeMinutes} min de lecture • {article.author.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    id={`btn-read-fav-${article.id}`}
                    onClick={() => {
                      onSelectArticle(article);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#839b64] hover:bg-[#728956] text-[#eae5da] text-xs font-bold transition-colors cursor-pointer shadow-sm"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Lire en 1 clic</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <button
                    id={`btn-remove-fav-${article.id}`}
                    onClick={() => onRemoveBookmark(article.id)}
                    title="Supprimer des favoris"
                    className="p-2 rounded-lg text-[#3f241c]/50 hover:text-red-700 hover:bg-red-100/50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        {bookmarkedArticles.length > 0 && (
          <div className="p-4 bg-[#ded8cc] border-t border-[#3f241c]/15 flex items-center justify-between text-xs font-mono">
            <button
              id="clear-all-favs-btn"
              onClick={onClearAll}
              className="text-[#3f241c]/70 hover:text-red-700 underline cursor-pointer"
            >
              Vider tous les favoris
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-[#3f241c] text-[#eae5da] font-sans font-semibold cursor-pointer"
            >
              Fermer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
