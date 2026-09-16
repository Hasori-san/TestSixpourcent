import React, { useState } from 'react';
import { Heart, HandHeart, CheckCircle2 } from 'lucide-react';

interface Donor {
  id: string;
  name: string;
  location?: string;
  note?: string;
}

const DONORS_ROW_1: Donor[] = [
  { id: 'd1', name: 'Claire Dufresne', location: 'Lyon', note: 'Donatrice' },
  { id: 'd2', name: 'Dr. Thomas & Léa Leroux', location: 'Bruxelles', note: 'Donateurs' },
  { id: 'd3', name: 'Collectif Loire Vivante', location: 'Nantes', note: 'Soutien environnement' },
  { id: 'd4', name: 'Marc Guichard', location: 'Strasbourg', note: 'Soutien libre' },
  { id: 'd5', name: 'Nathalie Besson', location: 'Paris 11e', note: 'Donatrice' },
  { id: 'd6', name: 'Association Transparence & Données', location: 'Bordeaux', note: 'Mécénat solidaire' },
  { id: 'd7', name: 'Antoine & Sylvie Morel', location: 'Rennes', note: 'Souscripteurs' },
  { id: 'd8', name: 'Benoît Keller', location: 'Genève', note: 'Donateur régulier' },
  { id: 'd9', name: 'Camille Delmas', location: 'Lille', note: 'Soutien presse libre' },
  { id: 'd10', name: 'David & Hélène Simon', location: 'Brest', note: 'Donateurs' },
];

const DONORS_ROW_2: Donor[] = [
  { id: 'd11', name: 'Émilie & Julien Richard', location: 'Montpellier', note: 'Donateurs' },
  { id: 'd12', name: 'Sandrine Tavernier', location: 'Tours', note: 'Lectrice engagée' },
  { id: 'd13', name: 'Collectif pour l’Eau', location: 'Toulouse', note: 'Donateur solidaire' },
  { id: 'd14', name: 'Paul-Henri Bernard', location: 'Clermont-Ferrand', note: 'Donateur' },
  { id: 'd15', name: 'Marie-Pierre Fabre', location: 'Marseille', note: 'Donatrice' },
  { id: 'd16', name: 'Sylvain Ollivier', location: 'Rouen', note: 'Soutien régulier' },
  { id: 'd17', name: 'Sophie Vaneck', location: 'Bruxelles', note: 'Donatrice' },
  { id: 'd18', name: 'Pr. Alexandre Vidal', location: 'Grenoble', note: 'Souscripteur éthique' },
  { id: 'd19', name: 'Valérie & François Dupuis', location: 'Metz', note: 'Défenseurs du bien commun' },
  { id: 'd20', name: 'Jean-Christophe M.', location: 'Nice', note: 'Donateur' },
];

export const DonorsMarquee: React.FC = () => {
  const [supportMessageOpen, setSupportMessageOpen] = useState(false);

  const renderDonorCard = (donor: Donor, index: number) => (
    <div
      key={`${donor.id}-${index}`}
      className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#f4f0e8] border border-[#3f241c]/15 shadow-xs hover:border-[#839b64] hover:shadow-sm transition-all select-none shrink-0"
    >
      <div className="w-7 h-7 rounded-full bg-[#3f241c]/10 text-[#3f241c] font-bold text-xs flex items-center justify-center font-mono">
        {donor.name.charAt(0)}
      </div>

      <div className="flex flex-col text-left">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-bold text-[#3f241c] whitespace-nowrap">
            {donor.name}
          </span>
          {donor.location && (
            <span className="text-[11px] text-[#3f241c]/60 font-mono whitespace-nowrap hidden sm:inline">
              ({donor.location})
            </span>
          )}
        </div>
        {donor.note && (
          <span className="text-[10px] text-[#839b64] font-medium whitespace-nowrap flex items-center gap-1">
            <Heart className="w-2.5 h-2.5 fill-[#839b64]" />
            {donor.note}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <section
      id="section-donateurs-marquee"
      className="w-full mt-20 pt-10 pb-6 border-t-2 border-[#3f241c]/15 bg-gradient-to-b from-transparent via-[#ded8cc]/30 to-[#ded8cc]/60 relative overflow-hidden"
    >
      {/* Editorial Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#839b64]/15 border border-[#839b64]/30 text-[#3f241c] text-xs font-mono font-bold uppercase tracking-wider mb-3">
          <Heart className="w-3.5 h-3.5 fill-[#839b64] text-[#839b64]" />
          Transparence & Indépendance
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-[#3f241c] tracking-tight">
          Merci à nos donateurs et donatrices
        </h2>

        <p className="mt-2 text-sm sm:text-base text-[#3f241c]/80 max-w-2xl mx-auto">
          Sans actionnaire, sans publicité et sans subvention d'intérêt : chacune de nos enquêtes est rendue possible grâce au soutien de nos <span className="font-bold text-[#839b64]">1 428 donateurs et donatrices</span>.
        </p>
      </div>

      {/* First Marquee Row (Scrolling Left) */}
      <div className="relative w-full overflow-hidden mb-3">
        {/* Left and Right Fade Gradients */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#eae5da] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#eae5da] to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee flex gap-3 sm:gap-4 py-1">
          {/* Double list for seamless infinite loop */}
          {DONORS_ROW_1.map((donor, idx) => renderDonorCard(donor, idx))}
          {DONORS_ROW_1.map((donor, idx) => renderDonorCard(donor, idx + 100))}
        </div>
      </div>

      {/* Second Marquee Row (Scrolling Right) */}
      <div className="relative w-full overflow-hidden mb-6">
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#eae5da] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#eae5da] to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee-reverse flex gap-3 sm:gap-4 py-1">
          {DONORS_ROW_2.map((donor, idx) => renderDonorCard(donor, idx))}
          {DONORS_ROW_2.map((donor, idx) => renderDonorCard(donor, idx + 200))}
        </div>
      </div>

      {/* Join Donors CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-center text-xs font-mono mt-4">
        <button
          id="btn-rejoindre-donateurs"
          onClick={() => setSupportMessageOpen(true)}
          className="inline-flex items-center gap-1.5 font-bold text-[#839b64] hover:text-[#3f241c] hover:underline cursor-pointer transition-colors"
        >
          <HandHeart className="w-4 h-4" />
          <span>Rejoindre les donateurs</span>
        </button>
      </div>

      {/* Support Info Modal */}
      {supportMessageOpen && (
        <div className="fixed inset-0 z-50 bg-[#3f241c]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#eae5da] rounded-2xl p-6 sm:p-8 max-w-md w-full border-2 border-[#3f241c] shadow-2xl relative">
            <div className="w-12 h-12 rounded-full bg-[#839b64] text-[#eae5da] flex items-center justify-center mb-4 shadow">
              <Heart className="w-6 h-6 fill-current" />
            </div>

            <h3 className="text-xl font-black text-[#3f241c] tracking-tight">
              Soutenir notre cellule d'investigation
            </h3>

            <p className="mt-3 text-sm text-[#3f241c]/80 leading-relaxed">
              Pour préserver son indépendance intégrale, notre rédaction est financée exclusivement par les dons de ses lecteurs. 
            </p>

            <div className="mt-4 p-3 rounded-xl bg-[#f4f0e8] border border-[#3f241c]/15 text-xs text-[#3f241c]/80 space-y-2">
              <div className="flex items-center gap-2 text-[#3f241c] font-bold">
                <CheckCircle2 className="w-4 h-4 text-[#839b64]" />
                Campagne de souscription 2026 ouverte
              </div>
              <p>
                Un don de 5 € par mois permet de financer les expertises scientifiques indépendantes et les requêtes administratives CADA.
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setSupportMessageOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#3f241c] text-[#eae5da] text-xs font-bold hover:bg-[#2b1812] transition-colors cursor-pointer"
              >
                Compris, merci !
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default DonorsMarquee;
