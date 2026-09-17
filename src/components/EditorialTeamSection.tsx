import React from 'react';
import { Users, FileSearch, Mail, Phone, Lock, BookOpen } from 'lucide-react';
import { Journalist } from '../types';

interface EditorialTeamSectionProps {
  journalists?: Journalist[];
  onContactClick?: () => void;
}

export const EditorialTeamSection: React.FC<EditorialTeamSectionProps> = ({ journalists = [] }) => {
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
            La Rédaction • Six% Focus
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
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=85"
                alt="Conférence de rédaction et analyse de dossiers chez Six%"
                className="w-full h-[320px] sm:h-[420px] lg:h-[460px] object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />

              {/* Photo Overlay Tag */}
              <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#3f241c]/85 text-[#eae5da] text-[11px] font-mono backdrop-blur-xs border border-[#eae5da]/20 shadow-xs">
                <FileSearch className="w-3.5 h-3.5 text-[#839b64]" />
                <span>Conférence de rédaction • Dossiers en cours</span>
              </div>

              {/* Bottom Quote Bar */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#3f241c] via-[#3f241c]/90 to-transparent p-5 text-[#eae5da]">
                <p className="text-xs sm:text-sm italic font-serif leading-snug text-[#eae5da]/90">
                  « Chaque fait est étayé par des preuves matérielles, des pièces déclassifiées et des expertises indépendantes. »
                </p>
                <span className="block text-[10px] font-mono uppercase tracking-wider text-[#839b64] mt-1 font-bold">
                  Charte déontologique de Munich appliquée
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-[#3f241c]/65 font-mono px-1">
              <span>Cellule permanente d'enquête</span>
              <span>Paris • Genève • Bruxelles</span>
            </div>
          </div>

          {/* Descriptif Column */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-5">
            <h3 className="text-xl sm:text-2xl font-bold text-[#3f241c] leading-snug">
              Une cellule indépendante vouée aux enquêtes de longue haleine
            </h3>

            <div className="space-y-4 text-sm sm:text-base text-[#3f241c]/85 leading-relaxed font-normal">
              <p>
                Notre rédaction ne vit pas au rythme de l’actualité minute par minute. Fondée par des journalistes chevronnés et des spécialistes du milieu de l’art et de la finance, <strong className="font-semibold text-[#3f241c]">Six%</strong> consacre le temps nécessaire — parfois plus d’un an — pour recouper méticuleusement chaque élément.
              </p>
              <p>
                Des circuits opaques des ports francs aux soupçons de spoliation, en passant par les coulisses des grandes maisons de vente et le trafic de biens culturels, nos enquêteurs décortiquent registres douaniers, contrats confidentiels et analyses scientifiques de laboratoire pour offrir une information irréfutable.
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
                  <span>Les journalistes & enquêteurs de la rédaction</span>
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
                  className="bg-[#eae5da] rounded-2xl border border-[#3f241c]/15 p-5 flex flex-col justify-between hover:border-[#839b64]/50 transition-all hover:shadow-md"
                >
                  <div>
                    <div className="flex items-start gap-3.5 mb-3.5">
                      <img
                        src={j.avatar}
                        alt={j.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-[#839b64] shrink-0 shadow-xs"
                      />
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-base text-[#3f241c] leading-tight truncate">
                          {j.name}
                        </h4>
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
                      <div className="flex flex-wrap gap-1 mb-3">
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

                  <div className="pt-2.5 border-t border-[#3f241c]/10 flex items-center justify-between text-[11px] font-mono text-[#3f241c]/70">
                    {j.email ? (
                      <a
                        href={`mailto:${j.email}`}
                        className="hover:text-[#839b64] flex items-center gap-1 transition-colors"
                        title={j.email}
                      >
                        <Mail className="w-3 h-3 text-[#839b64]" />
                        <span className="truncate max-w-[140px]">{j.email}</span>
                      </a>
                    ) : (
                      <span className="text-[10px] text-[#3f241c]/40">Contact via rédaction</span>
                    )}

                    {j.signalPhone && (
                      <span className="text-[10px] text-[#839b64] font-bold flex items-center gap-1">
                        <Phone className="w-2.5 h-2.5" />
                        <span>Signal vérifié</span>
                      </span>
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
