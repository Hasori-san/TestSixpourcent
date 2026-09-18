import React from 'react';
import { Bookmark, Search, Flame, FileText, Users } from 'lucide-react';
import { Navbar1, NavItem } from '@/components/ui/navbar-1';

export type NavTabId = 'toutes' | 'populaires' | 'redaction' | 'recherche' | 'favoris' | 'lecture';

interface NavbarProps {
  currentTab: NavTabId;
  onTabSelect: (tab: NavTabId) => void;
  favoritesCount: number;
  isInArticleReader?: boolean;
  onGoHome: () => void;
  isMobileMenuOpen?: boolean;
  onMobileMenuOpenChange?: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabSelect,
  favoritesCount,
  isInArticleReader = false,
  onGoHome,
  isMobileMenuOpen,
  onMobileMenuOpenChange,
}) => {
  const navItems: NavItem[] = [
    {
      id: 'populaires',
      label: 'Dossiers populaires',
      icon: <Flame className="w-4 h-4 text-current" />,
    },
    {
      id: 'redaction',
      label: 'La rédaction',
      icon: <Users className="w-4 h-4 text-current" />,
    },
    {
      id: 'recherche',
      label: 'Recherche',
      icon: <Search className="w-4 h-4 text-current" />,
    },
  ];

  if (isInArticleReader) {
    navItems.push({
      id: 'lecture',
      label: 'Lecture en cours',
      icon: <FileText className="w-4 h-4 text-current" />,
    });
  }

  return (
    <>
      {/* Top micro bar: Manifesto / Edition banner */}
      <div className="bg-[#3f241c] text-[#eae5da] text-[11px] font-mono py-1 px-4 sm:px-8 border-b border-[#839b64]/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#839b64] animate-ping" />
            <span className="font-semibold tracking-wide">Édition #1 • Journalisme d'investigation dans le milieu de l'art</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[#eae5da]/80">
            <span>Sources chiffrées PGP</span>
            <span>•</span>
            <span className="text-[#839b64]">0% publicité</span>
            <span>•</span>
            <span>100% financé par ses lecteurs</span>
          </div>
        </div>
      </div>

      {/* Modern floating Navbar1 system */}
      <Navbar1
        items={navItems}
        activeItemId={currentTab}
        onItemClick={(id) => onTabSelect(id as NavTabId)}
        onActionClick={() => onTabSelect('favoris')}
        actionLabel="Favoris"
        actionBadge={favoritesCount > 0 ? favoritesCount : undefined}
        logoText="Six%"
        onLogoClick={onGoHome}
        isInArticleReader={isInArticleReader}
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuOpenChange={onMobileMenuOpenChange}
      />
    </>
  );
};

export default Navbar;
