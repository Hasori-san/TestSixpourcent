import React, { useState } from 'react';
import { Users, FileSearch, Maximize2, X, Eye, ShieldCheck } from 'lucide-react';
import { useAdminMedia } from '../context/AdminMediaContext';
import { EditableImageBadge } from './admin/EditableImageBadge';

interface EditorialTeamSectionProps {
  onContactClick?: () => void;
}

// Fixed canonical image path for the editorial team photo
const EDITORIAL_TEAM_PHOTO = '/IMG_8297.jpeg';

export const EditorialTeamSection: React.FC<EditorialTeamSectionProps> = () => {
  const { getImageFor } = useAdminMedia();
  const activeTeamPhoto = getImageFor('team-photo', EDITORIAL_TEAM_PHOTO);

  const [photoSrc, setPhotoSrc] = useState<string>(activeTeamPhoto);
  const [showLightbox, setShowLightbox] = useState<boolean>(false);

  // Sync photoSrc if activeTeamPhoto changes from admin context
  React.useEffect(() => {
    setPhotoSrc(activeTeamPhoto);
  }, [activeTeamPhoto]);

  // Fallback to high-resolution Galerie d'Apollon Louvre reference if the file is still propagating
  const handleImageError = () => {
    const fallbackLouvre = 'https://upload.wikimedia.org/wikipedia/commons/e/e2/Galerie_d%27Apollon_du_Louvre_d%C3%A9serte_2.jpg';
    if (photoSrc !== fallbackLouvre) {
      setPhotoSrc(fallbackLouvre);
    }
  };

  return (
    <section
      id="section-equipe-redaction"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 scroll-mt-24"
    >
      <div className="bg-[#f4f0e8] border-2 border-[#3f241c]/15 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm relative overflow-hidden">
        {/* Subtle decorative background watermark */}
        <div className="absolute -right-12 -bottom-12 text-[#3f241c]/5 font-serif font-black text-9xl select-none pointer-events-none">
          6%
        </div>

        {/* Section Header */}
        <div className="mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#839b64]/15 border border-[#839b64]/30 text-[#3f241c] text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <Users className="w-3.5 h-3.5 text-[#839b64]" />
            La Rédaction • Six% Focus
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#3f241c] tracking-tight">
            L'équipe de rédaction
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#3f241c]/80 max-w-2xl font-normal">
            Journalistes d'investigation, historiens d'art, juristes et data-analystes unis par une même mission : faire la lumière là où règnent le secret et l'opacité.
          </p>
        </div>

        {/* Grid: Grande photo à gauche, Descriptif détaillé à droite */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Grande Photo Column */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="relative rounded-2xl overflow-hidden border-2 border-[#3f241c]/25 shadow-lg bg-[#2b1812] group">
              {/* Admin quick edit badge */}
              <EditableImageBadge
                slotId="team-photo"
                label="Photo de l'équipe de rédaction"
                position="top-left"
              />

              {/* Photo avec cadrage vertical surélevé (center 80%) pour voir nettement les membres de l'équipe et leurs genoux */}
              <div className="w-full h-[480px] sm:h-[560px] lg:h-[620px] overflow-hidden bg-[#2b1812]">
                <img
                  src={photoSrc}
                  onError={handleImageError}
                  alt="L'équipe de rédaction de Six% réunie en galerie d'honneur au Musée du Louvre"
                  referrerPolicy="no-referrer"
                  style={{
                    objectPosition: 'center 80%',
                  }}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  loading="lazy"
                />
              </div>

              {/* Top Status Overlay */}
              <div className="absolute top-3 right-3 flex items-center justify-end gap-2 z-10 pointer-events-none">
                <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3f241c]/90 text-[#eae5da] text-[11px] font-mono backdrop-blur-xs border border-[#eae5da]/20 shadow pointer-events-auto">
                  <FileSearch className="w-3.5 h-3.5 text-[#839b64]" />
                  <span>Équipe de rédaction • Paris</span>
                </div>

                {/* Lightbox zoom button */}
                <button
                  type="button"
                  onClick={() => setShowLightbox(true)}
                  className="p-1.5 rounded-lg bg-[#3f241c]/85 hover:bg-[#3f241c] text-[#eae5da] text-xs font-mono font-medium backdrop-blur-xs border border-[#eae5da]/20 shadow transition-all hover:scale-105 cursor-pointer pointer-events-auto"
                  title="Agrandir la photo en plein écran"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-[#eae5da]" />
                </button>
              </div>

              {/* Bottom Caption Pill */}
              <div className="absolute bottom-3 inset-x-3 z-10 pointer-events-none">
                <div className="px-3 py-1.5 rounded-lg bg-[#2b1812]/85 text-[#eae5da]/90 text-[11px] font-mono backdrop-blur-xs border border-[#eae5da]/15 flex items-center justify-between">
                  <span>Galerie d'Apollon • Musée du Louvre</span>
                  <span className="text-[#839b64] font-semibold">Six% 2026</span>
                </div>
              </div>
            </div>

            {/* Dedicated Editorial Quote Card (Positioned clearly BELOW the photo to preserve 100% visibility of the team and knees) */}
            <div className="p-4 sm:p-5 rounded-xl bg-[#3f241c] text-[#eae5da] border border-[#3f241c] shadow-sm">
              <p className="text-xs sm:text-sm italic font-serif leading-relaxed text-[#eae5da]/95">
                « Chaque fait est étayé par des preuves matérielles, des pièces déclassifiées et des expertises indépendantes. »
              </p>
              <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-[#839b64] mt-2 font-bold">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 inline" />
                  Charte déontologique de Munich appliquée
                </span>
                <span className="text-[#eae5da]/60">Bruxelles • Paris</span>
              </div>
            </div>
          </div>

          {/* Descriptif Column */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-5 pt-1">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#3f241c] leading-snug">
              Une cellule indépendante vouée aux enquêtes de longue haleine
            </h3>

            <div className="space-y-4 text-sm sm:text-base text-[#3f241c]/85 leading-relaxed font-normal">
              <p>
                Notre rédaction ne vit pas au rythme de l’actualité minute par minute. Fondée par des journalistes chevronnés et des spécialistes du milieu de l’art et de la finance, <strong className="font-semibold text-[#3f241c]">Six%</strong> consacre le temps nécessaire — parfois plus d’un an — pour recouper méticuleusement chaque élément.
              </p>
              <p>
                Des circuits opaques des ports francs aux soupçons de spoliation, en passant par les coulisses des grandes maisons de vente et le trafic de biens culturels, nos enquêteurs décortiquent registres douaniers, contrats confidentiels et analyses scientifiques de laboratoire pour offrir une information irréfutable.
              </p>
              <p>
                Chaque enquête est relue par un comité éditorial pluridisciplinaire et soumise à un contre-interrogatoire juridique rigoureux avant publication.
              </p>
            </div>

            {/* Pill Highlights */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-[#ded8cc]/70 border border-[#3f241c]/15">
                <span className="block text-xl sm:text-2xl font-black text-[#3f241c] font-mono">100%</span>
                <span className="text-xs text-[#3f241c]/70 font-medium">Financement citoyen indépendant</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#ded8cc]/70 border border-[#3f241c]/15">
                <span className="block text-xl sm:text-2xl font-black text-[#3f241c] font-mono">6 à 14</span>
                <span className="text-xs text-[#3f241c]/70 font-medium">Mois d'investigation par dossier</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowLightbox(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3f241c]/10 hover:bg-[#3f241c]/20 text-[#3f241c] text-xs font-mono font-semibold transition-all cursor-pointer active:scale-95"
              >
                <Eye className="w-3.5 h-3.5 text-[#839b64]" />
                Voir la photographie en haute résolution
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal to inspect the full original image */}
      {showLightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setShowLightbox(false)}
        >
          <div className="relative max-w-5xl max-h-[92vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setShowLightbox(false)}
              className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all cursor-pointer"
              title="Fermer"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={photoSrc}
              alt="L'équipe de rédaction de Six% - vue complète"
              className="max-h-[82vh] w-auto max-w-full rounded-xl object-contain shadow-2xl border border-white/10"
            />
            <div className="mt-3 text-center text-white/80 font-mono text-xs">
              L'équipe de rédaction de Six% • Vue haute définition complète (Galerie d'Apollon, Louvre)
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
