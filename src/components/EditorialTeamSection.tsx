import React from 'react';
import { Users, Camera } from 'lucide-react';
import { Journalist } from '../types';
import { ImageEditBadge } from './admin/ImageEditBadge';

interface EditorialTeamSectionProps {
  journalists?: Journalist[];
  onContactClick?: () => void;
  editorialPhoto?: string;
  isAdmin?: boolean;
  onEditEditorialPhoto?: () => void;
  onEditJournalistAvatar?: (journalist: Journalist) => void;
}

export const EditorialTeamSection: React.FC<EditorialTeamSectionProps> = ({
  journalists = [],
  editorialPhoto = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=85',
  isAdmin = false,
  onEditEditorialPhoto,
  onEditJournalistAvatar,
}) => {
  return (
    <section
      id="section-equipe-redaction"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 scroll-mt-24"
    >
      <div className="bg-[#f4f0e8] border-2 border-[#3f241c]/15 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm relative overflow-hidden space-y-12">
        {/* Subtle decorative background watermark */}
        <div className="absolute -right-12 -bottom-12 text-[#3f241c]/5 font-serif font-black text-9xl select-none pointer-events-none">
          6%
        </div>

        {/* Section Header */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#839b64]/15 border border-[#839b64]/30 text-[#3f241c] text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <Users className="w-3.5 h-3.5 text-[#839b64]" />
            La Rédaction • Six%
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#3f241c] tracking-tight">
            L'équipe de rédaction
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#3f241c]/80 max-w-2xl">
            Journalistes d'investigation, historiens d'art, juristes et data-analystes unis par une même mission : faire la lumière là où règnent le secret et l'opacité.
          </p>
        </div>

        {/* Grid: Grande photo à gauche, Descriptif détaillé à droite */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Grande Photo Column */}
          <div className="lg:col-span-6 flex flex-col gap-3">
            <div className="relative rounded-2xl overflow-hidden border-2 border-[#3f241c]/20 shadow-md bg-[#3f241c] group">
              {isAdmin && onEditEditorialPhoto && (
                <ImageEditBadge
                  onClick={onEditEditorialPhoto}
                  tooltip="Modifier la photo de la rédaction avec la médiathèque"
                  className="top-4 right-4"
                />
              )}

              <img
                src={editorialPhoto}
                alt="Conférence de rédaction et analyse de dossiers chez Six%"
                className="w-full h-[320px] sm:h-[420px] lg:h-[460px] object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-[#3f241c]/65 font-mono px-1">
              <span>Cellule permanente d'investigation</span>
              <span>Paris • Genève • Bruxelles</span>
            </div>
          </div>

          {/* Descriptif Column */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-5">
            <h3 className="text-xl sm:text-2xl font-bold text-[#3f241c] leading-snug">
              Une cellule indépendante vouée aux articles de longue haleine
            </h3>

            <div className="space-y-4 text-sm sm:text-base text-[#3f241c]/85 leading-relaxed font-normal">
              <p>
                Notre rédaction ne vit pas au rythme de l’actualité minute par minute. Fondée par des journalistes chevronnés et des spécialistes du milieu de l’art et de la finance, <strong className="font-semibold text-[#3f241c]">Six%</strong> consacre le temps nécessaire — parfois plus d’un an — pour recouper méticuleusement chaque élément.
              </p>
              <p>
                Des circuits opaques des ports francs aux soupçons de spoliation, en passant par les coulisses des grandes maisons de vente et le trafic de biens culturels, nos journalistes décortiquent registres douaniers, contrats confidentiels et analyses scientifiques de laboratoire pour offrir une information irréfutable.
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Journalists Roster Cards */}
        {journalists.length > 0 && (
          <div className="pt-8 border-t border-[#3f241c]/15 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-[#3f241c] flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#839b64]" />
                  <span>Les journalistes de la rédaction</span>
                </h3>
                <p className="text-xs text-[#3f241c]/70 mt-0.5">
                  Signataires de la charte de Munich et membres de la cellule permanente Six%.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {journalists.map((j) => (
                <div
                  key={j.id}
                  className="bg-[#eae5da] rounded-2xl border border-[#3f241c]/15 p-5 flex flex-col justify-between hover:border-[#839b64]/50 transition-all hover:shadow-md relative"
                >
                  <div>
                    <div className="flex items-start gap-3.5 mb-3.5">
                      <div className="relative group/avatar shrink-0">
                        <img
                          src={j.avatar}
                          alt={j.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-[#839b64] shadow-xs"
                        />
                        {isAdmin && onEditJournalistAvatar && (
                          <button
                            type="button"
                            onClick={() => onEditJournalistAvatar(j)}
                            title={`Changer l'avatar de ${j.name} avec la médiathèque`}
                            className="absolute -bottom-1 -right-1 p-1 rounded-full bg-[#3f241c] text-[#839b64] hover:text-white border border-white/40 cursor-pointer shadow-md"
                          >
                            <Camera className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="font-extrabold text-base text-[#3f241c] leading-tight truncate">
                            {j.name}
                          </h4>
                          {isAdmin && onEditJournalistAvatar && (
                            <button
                              type="button"
                              onClick={() => onEditJournalistAvatar(j)}
                              className="text-[10px] font-mono text-[#839b64] hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
                              title="Modifier la photo"
                            >
                              <Camera className="w-2.5 h-2.5" />
                              <span>Photo</span>
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-[#839b64] font-semibold mt-0.5 leading-snug">
                          {j.role}
                        </p>
                        {j.joinedYear && (
                          <span className="text-[10px] font-mono text-[#3f241c]/60">
                            Depuis {j.joinedYear}
                          </span>
                        )}
                      </div>
                    </div>

                    {j.bio && (
                      <p className="text-xs text-[#3f241c]/80 leading-relaxed line-clamp-3 mb-3">
                        {j.bio}
                      </p>
                    )}

                    {j.specialties && j.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {j.specialties.slice(0, 3).map((spec) => (
                          <span
                            key={spec}
                            className="px-2 py-0.5 rounded-md bg-[#ded8cc] text-[#3f241c] border border-[#3f241c]/15 text-[10px] font-mono font-medium"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

