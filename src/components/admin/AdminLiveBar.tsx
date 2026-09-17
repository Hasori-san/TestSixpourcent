import React, { useState } from 'react';
import { Shield, Camera, LayoutDashboard, LogOut, ChevronUp, ChevronDown, CheckCircle2 } from 'lucide-react';

interface AdminLiveBarProps {
  onOpenDashboard: () => void;
  onLogout: () => void;
}

export const AdminLiveBar: React.FC<AdminLiveBarProps> = ({
  onOpenDashboard,
  onLogout,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <aside
      id="admin-live-mode-bar"
      aria-label="Barre d'administration en direct"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-2xl w-[calc(100%-2rem)] transition-all duration-300 pointer-events-auto"
    >
      <div className="bg-[#3f241c]/95 text-[#eae5da] rounded-2xl shadow-2xl border-2 border-[#839b64] p-3 backdrop-blur-md flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-[#839b64] text-[#eae5da] flex items-center justify-center shrink-0 shadow-xs">
            <Camera className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold tracking-tight text-[#eae5da]">
                Mode Édition en direct
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono text-emerald-300 font-semibold hidden md:inline">
                Connecté
              </span>
            </div>
            {!isMinimized && (
              <p className="text-[11px] font-mono text-[#eae5da]/75 truncate hidden sm:block">
                Cliquez sur le badge <span className="text-[#839b64] font-bold">📷 Modifier</span> sur n'importe quelle photo pour la remplacer
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            id="admin-live-open-dashboard-btn"
            onClick={onOpenDashboard}
            className="px-3 py-1.5 rounded-xl bg-[#839b64] hover:bg-[#728956] text-[#eae5da] text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            title="Revenir au tableau de bord complet"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Tableau de bord</span>
            <span className="xs:hidden">Admin</span>
          </button>

          <button
            id="admin-live-logout-btn"
            onClick={onLogout}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-red-900/40 hover:bg-red-900/60 text-red-200 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer border border-red-700/40"
            title="Se déconnecter du mode admin"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Quitter</span>
          </button>

          <button
            onClick={() => setIsMinimized((prev) => !prev)}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#eae5da]/80 transition-colors cursor-pointer hidden md:block"
            title={isMinimized ? 'Agrandir la barre' : 'Réduire la barre'}
          >
            {isMinimized ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </aside>
  );
};
