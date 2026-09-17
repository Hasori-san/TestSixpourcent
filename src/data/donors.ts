export interface Donor {
  id: string;
  name: string;
  location?: string;
  note?: string;
}

export const DEFAULT_DONORS: Donor[] = [
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
