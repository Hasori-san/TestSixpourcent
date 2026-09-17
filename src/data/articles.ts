import { Article } from '../types';

export const ARTICLES_DATA: Article[] = [
  {
    id: 'art-01',
    slug: 'empire-invisible-metaux-rares-concessions-sous-marines',
    title: "L'Empire invisible des métaux rares : enquête au cœur des concessions sous-marines secrètes",
    subtitle: 'Comment un consortium d’États et de fonds souverains s’est discrètement partagé les fonds océaniques du Pacifique.',
    chapeau: "Pendant quatorze mois, la cellule investigation de Six% a épluché plus de 4 200 téraoctets de données bathymétriques et de comptes-rendus de négociations confidentielles. Ce que nous révélons dépasse la simple course aux ressources : c’est l'appropriation silencieuse de 1,2 million de kilomètres carrés de plancher océanique, au mépris des traités environnementaux.",
    category: 'Environnement',
    categoryTag: 'Dossier Océans & Géopolitique',
    author: {
      name: 'Aprilia Narducci',
      role: 'Grand reporter & data-investigatrice',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    },
    publishedAt: '12 Septembre 2026',
    readTimeMinutes: 9,
    heroImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=85',
    heroImageCaption: 'Zone Clarion-Clipperton : les navires de prospection opèrent en dehors des eaux territoriales contrôlées.',
    isPopular: true,
    isFeatured: true,
    investigationDays: 412,
    leakedDocumentsCount: 38,
    audioDuration: '8 min 45s',
    keyRevelations: [
      'Attribution confidentielle de 7 concessions d’extraction minière sans étude d’impact public.',
      'Création d’un réseau de 14 filiales-écrans au Delaware et à Singapour pour dissimuler les actionnaires réels.',
      'Pressions diplomatiques directes exercées sur l’Autorité internationale des fonds marins (AIFM).',
      'Risque imminent d’anéantissement d’écosystèmes benthiques uniques découverts à 4 000 mètres de profondeur.'
    ],
    sections: [
      {
        title: 'I. Le huis clos de Kingston',
        paragraphs: [
          "Tout commence dans un salon feutré de Jamaïque, en juillet 2024. Alors que les caméras des ONG et de la presse internationale sont braquées sur les débats officiels de l'AIFM, une réunion parallèle se tient à l'étage supérieur d'un hôtel de luxe. Selon les notes manuscrites obtenues par Six%, trois diplomates et deux représentants de multinationales minières y négocient l'octroi anticipé de licences d'exploitation pour le cobalt et le manganèse.",
          "Les concessions ne portent pas sur de simples échantillons de recherche : les documents confidentiels mentionnent le terme « préemption d’extraction industrielle à grande échelle ». Un engagement censé être illégal sans l'adoption d'un code minier international approuvé par l'ensemble des 169 États membres."
        ],
        quote: {
          text: "« Si ces contrats deviennent publics avant ratification, nous perdrons deux ans de diplomatie et des milliards de capitaux engagés. »",
          author: "Extrait du mémo confidentiel #KNG-88",
          role: "Direction générale d’un consortium industriel"
        }
      },
      {
        title: 'II. La nébuleuse des pavillons de complaisance',
        paragraphs: [
          "Pour contourner les régulations strictes de leurs pays d’origine, les compagnies ont monté une ingénierie juridique d’une rare complexité. Nos analystes ont reconstitué la chaîne de propriété de cinq navires de forage géants. Officiellement immatriculés dans des micro-États insulaires du Pacifique, ils sont en réalité affrétés par un holding d'investissement basé à Genève.",
          "Grâce au recoupement des signaux transpondeurs AIS et des flux financiers bancaires, Six% a identifié des mouvements suspects de plus de 180 millions d’euros ayant précédé le vote de résolutions clés. Plusieurs personnalités ayant siégé dans les commissions techniques de régulation ont ensuite été embauchées comme consultants rémunérés au sein de ces mêmes filiales."
        ],
        highlightBox: {
          title: 'Donnée clé de l’enquête',
          content: 'Plus de 72 % des droits d’exploration prioritaires sur la zone Clarion-Clipperton sont désormais concentrés entre les mains de seulement trois entités financières non étatiques.'
        }
      },
      {
        title: 'III. L’abîme sacrifié',
        paragraphs: [
          "Sur le plan écologique, les conséquences s’annoncent dévastatrices. Les scientifiques indépendants que nous avons consultés s'accordent sur un point : détruire ces concrétions minérales, formées sur des millions d'années, équivaut à raser une forêt primaire sous-marine dont 90 % des espèces n’ont pas encore été répertoriées.",
          "Contactées par Six% avec un questionnaire précis de quarante-sept questions, les trois principales compagnies mises en cause ont opposé une fin de non-recevoir, invoquant le secret des affaires. L’une d’entre elles a menacé notre rédaction de poursuites pour diffamation avant même la parution de cet article."
        ]
      }
    ],
    documentEvidence: {
      title: 'Protocole d’accord préliminaire PACIFIC-DEEP-2024',
      source: 'Fuite interne — Dossiers Kingston',
      date: '14 Juillet 2024',
      excerpt: '« Clause de confidentialité renforcée : les parties conviennent d’un moratoire de 36 mois sur la communication des coordonnées géodésiques des puits de carottage. »',
      classification: 'CONFIDENTIEL / NON PUBLIABLE'
    },
    sourcesCount: 23,
    verifiedFactChecks: 54
  },
  {
    id: 'art-02',
    slug: 'surveillance-algorithmique-quartiers-populaires-donnees-declassifiees',
    title: 'Surveillance algorithmique des quartiers populaires : 18 mois d’écoutes et de données déclassifiées',
    subtitle: 'Comment des caméras dotées d’IA comportementale ont été testées secrètement sur plus de 300 000 résidents.',
    chapeau: "Sous couvert d’expérimentations techniques avant les grands événements sportifs, plusieurs municipalités françaises ont activé des logiciels d’analyse biométrique et posturale en temps réel. Les rapports internes révèlent des taux d'erreur de 41 % et un ciblage démesuré des populations précarisées.",
    category: 'Surveillance & Tech',
    categoryTag: 'Libertés publiques & Algorithmes',
    author: {
      name: 'Héloise Massaux',
      role: 'Data-journaliste & cybersécurité',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    },
    publishedAt: '8 Septembre 2026',
    readTimeMinutes: 11,
    heroImage: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1600&q=85',
    heroImageCaption: 'Réseau de vidéosurveillance urbaine : plus de 1 400 flux vidéo passés au crible d’algorithmes prédictifs.',
    isPopular: true,
    isFeatured: true,
    investigationDays: 520,
    leakedDocumentsCount: 46,
    audioDuration: '10 min 20s',
    keyRevelations: [
      'Déploiement clandestin de modules d’analyse des émotions et des postures corporelles dans 6 villes pilotes.',
      'Partage automatique de métadonnées avec des sociétés privées de sécurité sans consentement préalable.',
      'Faux positifs massifs : 41 % des signalements automatiques concernaient des gestes du quotidien (accolades, courses).',
      'Absence délibérée de déclaration auprès de la CNIL sous prétexte de « tests de calibrage matériel ».'
    ],
    sections: [
      {
        title: 'I. La tentation du panoptique numérique',
        paragraphs: [
          "Depuis l’été 2024, les habitants de six communes de la banlieue parisienne et du sud de la France vivaient sous le regard d'un œil informatique bien plus inquisiteur qu’une caméra traditionnelle. Loin de se limiter à filmer les rues, les nouveaux équipements installés analysaient la démarche des passants, la durée de leurs arrêts sur les trottoirs et la proximité physique entre individus.",
          "Les documents techniques internes que Six% s'est procurés prouvent que ces logiciels ont été conçus avec des seuils d’alerte paramétrés pour « détecter les regroupements anormaux ». Dans les faits, deux personnes discutant plus de quatre minutes devant une boulangerie déclenchaient une notification prioritaire au centre de supervision urbain."
        ],
        quote: {
          text: "« On nous a demandé d’ignorer les alertes dans les quartiers commerçants du centre-ville pour focaliser le recalibrage sur les cités périphériques. »",
          author: "Témoignage anonyme",
          role: "Opérateur de vidéosurveillance assermenté"
        }
      },
      {
        title: 'II. Le marché secret des start-ups de la sécurité',
        paragraphs: [
          "Derrière cette technocratie sécuritaire se dissimule un marché colossal financé en grande partie par des fonds d’innovation régionaux. Trois jeunes pousses françaises, dont deux incubées au sein de pôles d’excellence publics, ont fourni les briques d’apprentissage profond.",
          "Pour entraîner leurs modèles statistiques, ces entreprises ont utilisé des millions d'heures d'enregistrements publics captés sans floutage des visages, en violation manifeste du Règlement Général sur la Protection des Données (RGPD)."
        ],
        highlightBox: {
          title: 'Alerte juridique',
          content: 'Les juristes spécialisés alertent sur une violation caractérisée des articles 8 de la CEDH et 5 du RGPD, passible de sanctions pécuniaires record.'
        }
      }
    ],
    documentEvidence: {
      title: 'Rapport d’évaluation de phase pilote « SENTINEL-URBAN-V3 »',
      source: 'Direction de la sécurité urbaine métropolitaine',
      date: '28 Mars 2025',
      excerpt: '« Le taux de fausse alarme sur la typologie "attroupement hostile" demeure élevé (41,2%), mais la couverture dissuasive compense les erreurs de catégorisation. »',
      classification: 'DIFFUSION RESTREINTE'
    },
    sourcesCount: 31,
    verifiedFactChecks: 62
  },
  {
    id: 'art-03',
    slug: 'casse-silencieux-or-bleu-nappes-phreatiques-europe',
    title: 'Le casse silencieux de l’or bleu : comment 4 multinationales privatisent les nappes d’Europe',
    subtitle: 'Révélations sur les forages illicites et les accords préfectoraux dérogatoires en période de sécheresse historique.',
    chapeau: "Alors que des centaines de villages français ont dû être ravitaillés en eau potable par camions-citernes, les géants de l'embouteillage continuaient d'extraire jusqu’à 300 litres par seconde dans des aquifères réputés vulnérables. Six% dévoile la cartographie secrète des autorisations spéciales accordées sans consultation démocratique.",
    category: 'Environnement',
    categoryTag: 'Eau & Biens communs',
    author: {
      name: 'Alya Birkenbaum',
      role: 'Journaliste d\'enquête Écologie & Matières premières',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    },
    publishedAt: '4 Septembre 2026',
    readTimeMinutes: 8,
    heroImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=85',
    heroImageCaption: 'Plaine agricole du Sud-Ouest : les puits industriels ont tari les cours d’eau voisins pendant trois étés consécutifs.',
    isPopular: true,
    isFeatured: false,
    investigationDays: 280,
    leakedDocumentsCount: 29,
    audioDuration: '7 min 50s',
    keyRevelations: [
      'Plus de 28 millions de mètres cubes d’eau pompés en pleine alerte crise sécheresse.',
      'Des dérogations préfectorales renouvelées automatiquement par simple arrêté non soumis à enquête publique.',
      'Pollution diffuse aux PFAS détectée dans les puits de compensation financés par les industriels.',
      'Refus systématique de communication des compteurs télémétriques aux associations citoyennes.'
    ],
    sections: [
      {
        title: 'I. Le débit secret des forages profonds',
        paragraphs: [
          "C'est un paradoxe qui a mis le feu aux poudres dans les vallées du Massif Central et des Vosges. Tandis que les agriculteurs voyaient leurs récoltes dépérir faute de droit d'irrigation et que les habitants recevaient l'interdiction formelle de laver leur voiture ou d'arroser leurs potagers, les usines d'embouteillage tournaient jour et nuit.",
          "Six% a obtenu les relevés de télémesure piézométrique de neuf forages industriels. Les graphiques sont éloquents : pendant les mois de juillet et août 2025, la courbe de soutirage des multinationales est restée strictement constante, au pic maximal autorisé, alors que le niveau de la nappe phréatique historique s'effondrait de 4,20 mètres."
        ]
      },
      {
        title: 'II. L’illusion des compensations écologiques',
        paragraphs: [
          "Pour éteindre la contestation locale, les embouteilleurs ont promis de financer des travaux de sécurisation du réseau d'eau potable communal. Mais l'enquête de Six% démontre que ces raccordements ont été réalisés vers des nappes de moindre qualité, présentant des traces résiduelles de polluants éternels (PFAS).",
          "« On a réservé l’eau minérale la plus pure pour l’exportation en bouteilles plastiques vendues à 2 euros l’unité à Tokyo ou Dubaï, et on a laissé l’eau polluée au robinet des habitants de la commune », résume un hydrologue démissionnaire de l’Agence de l’eau."
        ]
      }
    ],
    sourcesCount: 19,
    verifiedFactChecks: 38
  },
  {
    id: 'art-04',
    slug: 'paradis-fiscaux-trusts-algorithmiques-420-milliards',
    title: 'Paradis fiscaux 2.0 : les trusts algorithmiques et les 420 milliards volatilisés',
    subtitle: 'La fuite de 15 000 mémos confidentiels dévoile comment des smart contracts automatisent l’évasion fiscale en quelques millisecondes.',
    chapeau: "Oubliez les valises de billets et les comptes secrets aux Bahamas : la grande fraude fiscale s'est convertie au trading de micro-secondes et aux structures fiduciaires autonomes. Les documents exclusifs obtenus par Six% exposent pour la première fois les rouages d'une machine financière mondiale qui vide les caisses des États en toute opacité.",
    category: 'Pouvoir & Finance',
    categoryTag: 'Finance occulte & Évasion fiscale',
    author: {
      name: 'Olivier Dos Santos Pereira',
      role: 'Cellule d\'investigation financière & paradis fiscaux',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    publishedAt: '28 Août 2026',
    readTimeMinutes: 13,
    heroImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85',
    heroImageCaption: 'Tours de la City et quartiers d’affaires : les serveurs décentralisés redistribuent les dividendes hors de portée du fisc.',
    isPopular: true,
    isFeatured: true,
    investigationDays: 610,
    leakedDocumentsCount: 84,
    audioDuration: '12 min 15s',
    keyRevelations: [
      'Plus de 420 milliards d’euros d’actifs transférés via des protocoles DeFi fermés basés aux îles Caïmans.',
      'Implication directe de 18 banques privées européennes et suisses ayant conçu les scripts d’évasion.',
      'Une technologie de « rehypothèque instantanée » qui efface les traces de TVA sur les transactions intra-communautaires.',
      'Plusieurs ministres et anciens hauts fonctionnaires identifiés parmi les bénéficiaires finaux de ces trusts.'
    ],
    sections: [
      {
        title: 'I. Le code secret de Zoug et Vaduz',
        paragraphs: [
          "Ce n'est pas un lanceur d'alerte ordinaire qui a transmis les fichiers à la rédaction de Six%, mais un ingénieur financier repenti qui a programmé lui-même les scripts d'arbitrage fiscal automatisé. Dans son disque dur chiffré : le code source complet de la plateforme 'Aegis Trust', conçue pour fragmenter des sommes colossales en micro-tokens répartis sur 40 juridictions opaques.",
          "Le système fonctionne de manière autonome. Dès qu'un dividende est versé dans un pays de l'Union européenne, l'algorithme génère instantanément une dette fictive symétrique envers une coquille vide offshore, annulant mécaniquement toute assiette imposable."
        ],
        quote: {
          text: "« Aucun inspecteur des impôts ne peut analyser un réseau de 800 000 micro-transactions exécutées en 12 millisecondes. C’est mathématiquement impossible avec leurs outils actuels. »",
          author: "Ingénieur repenti",
          role: "Concepteur des algorithmes pour Aegis"
        }
      }
    ],
    documentEvidence: {
      title: 'Spécification technique « PROTOCOLE DISPERSION AEGIS v2.4 »',
      source: 'Serveur interne du cabinet fiduciaire de Vaduz',
      date: '11 Novembre 2024',
      excerpt: '« La dissolution automatique des smart contracts intermédiaires s’exécute immédiatement après validation du bloc, supprimant l’historique des adresses relais. »',
      classification: 'ULTRA SECRET / DESTRUCTION IMMÉDIATE'
    },
    sourcesCount: 42,
    verifiedFactChecks: 88
  },
  {
    id: 'art-05',
    slug: 'agro-industrie-lobbying-chimique-etudes-reescrites-europe',
    title: 'Agro-industrie et lobbying chimique : les études scientifiques réécrites avant validation',
    subtitle: 'Comment des fabricants de pesticides ont caviardé les rapports toxicologiques transmis à l’Autorité de sécurité des aliments.',
    chapeau: "Six% a pu comparer les versions préliminaires rédigées par des chercheurs indépendants et les synthèses finales publiées par les agences réglementaires. Les mentions d'effets neurotoxiques sur les enfants ont été systématiquement biffées ou requalifiées de « non concluantes » suite à des dizaines d’ateliers payés par les fabricants.",
    category: 'Santé & Industrie',
    categoryTag: 'Santé publique & Conflits d’intérêts',
    author: {
      name: 'Garance Bribosia',
      role: 'Journaliste d\'investigation Santé & Industrie',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
    publishedAt: '21 Août 2026',
    readTimeMinutes: 10,
    heroImage: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=1600&q=85',
    heroImageCaption: 'Épandage massif : des molécules interdites dans d’autres zones du monde continuent d’être renouvelées par dérogation.',
    isPopular: false,
    isFeatured: false,
    investigationDays: 340,
    leakedDocumentsCount: 22,
    audioDuration: '9 min 10s',
    keyRevelations: [
      'Suppression de 64 pages d’alertes toxicologiques dans le dossier de ré-homologation d’un fongicide majeur.',
      'Paiement de gratifications dissimulées à 12 experts siégeant dans les comités d’évaluation des risques.',
      'Utilisation d’une méthode statistique obsolète pour masquer la hausse d’anomalies congénitales dans les zones viticoles.',
      'Campagne d’intimidation menée contre deux toxicologues ayant refusé de modifier leurs conclusions.'
    ],
    sections: [
      {
        title: 'I. Le grand nettoyage des brouillons scientifiques',
        paragraphs: [
          "Le dossier portait le tampon anodin d’une « actualisation documentaire périodique ». Mais en analysant le suivi des modifications du document Word interne de l’organisme de tutelle sanitaire, notre équipe a fait une découverte stupéfiante. Les passages les plus alarmants concernant la barrière hémato-encéphalique chez les nouveau-nés avaient été caviardés directement depuis l'adresse IP d'un cabinet de conseil en affaires publiques travaillant pour l'agrochimie.",
          "Par quel moyen une officine privée de lobbying a-t-elle pu modifier le texte d'un rapport officiel d'expertise avant même qu'il ne soit soumis au vote du collège scientifique ? Six% a reconstitué les coulisses d'une compromission institutionnelle générale."
        ]
      }
    ],
    sourcesCount: 27,
    verifiedFactChecks: 49
  },
  {
    id: 'art-06',
    slug: 'hopitaux-publics-faillite-organisee-conseil-prive',
    title: 'Hôpitaux publics : le grand siphon des cabinets de conseil privés',
    subtitle: 'Plus de 850 millions d’euros de deniers publics engloutis dans des audits algorithmiques qui ont désorganisé les urgences.',
    chapeau: "Pour « optimiser » les parcours de soins, les directions hospitalières ont confié la gestion de leurs plannings à des consultants payés jusqu’à 3 400 euros par jour. Résultat : une réduction drastique du personnel soignant de nuit, une cascade d’erreurs médicales évitables et des factures d’honoraires astronomiques.",
    category: 'Société',
    categoryTag: 'Services publics & Dérives budgétaires',
    author: {
      name: 'Aicha Adghoghi',
      role: 'Journaliste Affaires publiques & Lobbying',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    },
    publishedAt: '15 Août 2026',
    readTimeMinutes: 7,
    heroImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1600&q=85',
    heroImageCaption: 'Service d’urgences en surchauffe : les feuilles de calcul n’ont jamais soigné les malades.',
    isPopular: false,
    isFeatured: false,
    investigationDays: 195,
    leakedDocumentsCount: 17,
    audioDuration: '6 min 30s',
    keyRevelations: [
      'Plus de 850 millions d’euros facturés en 4 ans pour des PowerPoints de réorganisation standardisés.',
      'Algorithme de rotation des lits ayant provoqué une hausse de 26 % des durées d’attente aux urgences.',
      'Clauses d’intéressement financier direct pour les cabinets sur le nombre de postes soignants supprimés.',
      'Signalements étouffés par la hiérarchie pour ne pas remettre en cause les contrats-cadres ministériels.'
    ],
    sections: [
      {
        title: 'I. La rentabilité contre le serment d’Hippocrate',
        paragraphs: [
          "Au centre hospitalier universitaire de Grand-Bourg, le mot 'patient' a été banni des réunions de direction pour être remplacé par 'séjour producteur de valeur'. Une sémantique imposée par les consultants d'un cabinet anglo-saxon mandaté pour redresser un déficit budgétaire artificiellement gonflé.",
          "Six% a pu consulter le contrat initial : chaque équivalent temps plein de soignant supprimé rapportait un bonus de performance de 14 000 euros à l'entreprise de conseil. Une incitation directe au démantèlement du service public de santé."
        ]
      }
    ],
    sourcesCount: 18,
    verifiedFactChecks: 32
  }
];

export const CATEGORIES: { label: string; value: import('../types').Category }[] = [
  { label: 'Toutes les enquêtes', value: 'Tous' },
  { label: 'Environnement & Ressources', value: 'Environnement' },
  { label: 'Surveillance & Libertés', value: 'Surveillance & Tech' },
  { label: 'Pouvoir & Finance', value: 'Pouvoir & Finance' },
  { label: 'Santé & Industrie', value: 'Santé & Industrie' },
  { label: 'Société & Démocratie', value: 'Société' },
];
