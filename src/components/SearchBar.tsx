import React from 'react';
import { Search, X } from 'lucide-react';
import { Category } from '../types';
import { CATEGORIES } from '../data/articles';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: Category;
  onCategoryChange: (cat: Category) => void;
  totalResults: number;
  categories?: { label: string; value: string }[];
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  totalResults,
  categories = CATEGORIES,
}) => {
  return (
    <div id="search-filter-section" className="w-full mb-8">
      {/* Search Input */}
      <div className="relative flex items-center w-full max-w-3xl mx-auto">
        <div className="absolute left-4 text-[#839b64] pointer-events-none">
          <Search className="w-5 h-5" />
        </div>

        <input
          id="global-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Rechercher un article, un mot-clé (ex: métaux rares, eau, algorithme, finance)..."
          className="w-full pl-12 pr-12 py-3.5 sm:py-4 rounded-2xl bg-[#f4f0e8] text-[#3f241c] placeholder-[#3f241c]/50 text-sm sm:text-base border-2 border-[#3f241c]/20 focus:border-[#839b64] focus:outline-none shadow-sm transition-all"
        />

        {searchQuery && (
          <button
            id="clear-search-btn"
            onClick={() => onSearchChange('')}
            aria-label="Effacer la recherche"
            className="absolute right-4 p-1 rounded-full text-[#3f241c]/60 hover:text-[#3f241c] hover:bg-[#ded8cc] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Pills (Version originale) */}
      <div className="flex flex-col items-center gap-3 mt-6 max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                id={`filter-cat-${cat.value.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => onCategoryChange(cat.value)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'bg-[#3f241c] text-[#eae5da] shadow-md scale-105 border border-[#3f241c]'
                    : 'bg-[#f4f0e8] text-[#3f241c]/80 hover:text-[#3f241c] hover:bg-[#ded8cc] border border-[#3f241c]/15'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className="text-xs font-mono text-[#3f241c]/70">
          <span className="font-bold text-[#839b64]">{totalResults}</span>{' '}
          {totalResults > 1 ? 'articles trouvés' : 'article trouvé'}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
