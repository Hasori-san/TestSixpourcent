import React from 'react';
import { Shield, Lock, FileCheck2, Heart } from 'lucide-react';
import { Category } from '../types';
import { CATEGORIES } from '../data/articles';

interface FooterProps {
  onSelectCategory: (cat: Category) => void;
  onGoHome: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onGoHome }) => {
  return (
    <footer id="global-footer" className="bg-[#3f241c] text-[#eae5da] pt-14 pb-10 border-t-4 border-[#839b64]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#eae5da]/15">
          {/* Column 1: Brand & Manifesto */}
          <div className="md:col-span-5 space-y-4">
            <div 
              onClick={onGoHome}
              className="flex items-center gap-3 cursor-pointer select-none"
            >
              <span className="text-2xl font-extrabold text-[#eae5da] tracking-tight">
                Six<span className="text-[#839b64]">%</span>
              </span>
            </div>

            <p className="text-sm text-[#eae5da]/80 leading-relaxed max-w-sm">
              Six% est un média d'investigation indépendant dédié aux révélations d'intérêt public, à l'analyse de données déclassifiées et aux enquêtes au long cours.
            </p>

            <div className="flex items-center gap-4 text-xs font-mono text-[#839b64] pt-2">
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4" /> Indépendance totale
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4" /> Secret des sources
              </span>
            </div>
          </div>

          {/* Column 2: Categories */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#839b64] font-bold">
              Rayons d'investigation
            </h4>
            <ul className="space-y-2 text-sm text-[#eae5da]/80">
              {CATEGORIES.filter(c => c.value !== 'Tous').map((cat) => (
                <li key={cat.value}>
                  <button
                    onClick={() => onSelectCategory(cat.value)}
                    className="hover:text-[#839b64] transition-colors cursor-pointer text-left"
                  >
                    {cat.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Ethics & Security */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#839b64] font-bold">
              Engagement déontologique
            </h4>
            <p className="text-xs text-[#eae5da]/75 leading-relaxed">
              Nous n'acceptons aucune subvention conditionnée, aucun partenariat commercial et aucune publicité de marque.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#eae5da]/60">
          <p>© 2026 Six% — Média d'investigation indépendant. Tous droits réservés.</p>
          <div className="flex items-center gap-6">
            <span>Charte de Munich</span>
            <span>•</span>
            <span>Protocole SecureDrop</span>
            <span>•</span>
            <span>Mentions Légales</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
