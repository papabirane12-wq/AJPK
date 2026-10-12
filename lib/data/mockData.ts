import {
  Profile,
  Event,
  Formation,
  Opportunity,
  YouthProject,
  TalentProfile,
  Partner,
  Article,
  GalleryAlbum,
  Cotisation,
  Certificate,
  NotificationItem,
  Commission
} from '@/types';

export const mockCommissions: Commission[] = [
  {
    id: 'comm-1',
    name: 'Commission Éducation & Formation',
    description: 'Organisation des programmes de tutorat, cours de soutien, formations professionnelles et compétences numériques.',
    lead_name: 'Aminata Ndiaye',
    members_count: 24,
  },
  {
    id: 'comm-2',
    name: 'Commission Économie & Entrepreneuriat',
    description: 'Accompagnement des jeunes porteurs de projets, financement participatif et partenariats entreprises.',
    lead_name: 'Moussa Diop',
    members_count: 18,
  },
  {
    id: 'comm-3',
    name: 'Commission Culture & Sport',
    description: 'Animation de la vie associative, tournois sportifs locaux, festivals et valorisation du patrimoine de Kelle.',
    lead_name: 'Ousmane Fall',
    members_count: 31,
  },
  {
    id: 'comm-4',
    name: 'Commission Environnement & Cadre de Vie',
    description: 'Campagnes de reboisement, assainissement, sensibilisation au développement durable et agro-écologie.',
    lead_name: 'Fatou Sow',
    members_count: 15,
  }
];

export const mockMembers: Profile[] = [
  {
    id: 'usr-admin-1',
    email: 'ibrahima.samb@ajpk.sn',
    first_name: 'Ibrahima',
    last_name: 'Samb',
    member_number: 'AJPK-00011',
    phone: '+221 77 000 00 11',
    date_of_birth: '1998-10-10',
    sex: 'M',
    address: 'Kelle, Sénégal',
    profession: 'Développeur web',
    education_level: 'Licence Informatique & Développement Web',
    avatar_url: '',
    bio: 'Administrateur de la plateforme AJPK & Développeur web engagé pour la jeunesse de Kelle.',
    role: 'super_admin',
    created_at: '2026-10-10T12:00:00Z',
    skills: ['Développement web', 'Next.js', 'React', 'TypeScript', 'Administration Système'],
    interest_domains: ['Technologie', 'Numérique', 'Jeunesse', 'Innovation'],
    status: 'actif'
  }
];

export const mockEvents: Event[] = [
  {
    id: 'evt-1',
    title: 'Forum Annuel de la Jeunesse & de l’Innovation de Kelle 2026',
    description: 'Une journée exceptionnelle rassemblant plus de 300 jeunes, décideurs locaux, entrepreneurs et partenaires pour échanger sur l’avenir économique et numérique de la commune de Kelle.',
    image_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800',
    event_date: '2026-11-15',
    event_time: '09:00 - 17:30',
    location: 'Foyer des Jeunes de Kelle',
    max_spots: 350,
    registered_count: 215,
    organizer: 'Bureau Exécutif AJPK',
    status: 'a_venir',
    category: 'Forum & Conférence',
    created_at: '2026-09-01T00:00:00Z'
  },
  {
    id: 'evt-2',
    title: 'Grande Campagne de Reboisement & Nettoyage "Kelle Verte"',
    description: 'Action citoyenne de plantation de 1 000 arbres fruitiers et ombragers dans les écoles et rues principales de Kelle pour lutter contre la désertification et améliorer le cadre de vie.',
    image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800',
    event_date: '2026-10-25',
    event_time: '08:00 - 14:00',
    location: 'Esplanade de la Mairie de Kelle',
    max_spots: 200,
    registered_count: 148,
    organizer: 'Commission Environnement AJPK',
    status: 'a_venir',
    category: 'Environnement & Citoyenneté',
    created_at: '2026-09-10T00:00:00Z'
  },
  {
    id: 'evt-3',
    title: 'Hackathon & Concours du Meilleur Projet Jeune',
    description: 'Challenge intensif de 48 heures où les équipes de jeunes créateurs et développeurs présentent leurs solutions innovantes pour répondre aux enjeux locaux (Agriculture, Santé, Éducation).',
    image_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800',
    event_date: '2026-12-05',
    event_time: '08:30 - 18:00',
    location: 'Centre de Formation Professionnelle de Kelle',
    max_spots: 100,
    registered_count: 76,
    organizer: 'Commission Économie & Numérique',
    status: 'a_venir',
    category: 'Innovation & Concours',
    created_at: '2026-09-15T00:00:00Z'
  }
];

export const mockFormations: Formation[] = [
  {
    id: 'form-1',
    title: 'Développement Web & Compétences Numériques Pratiques',
    description: 'Maîtrisez les bases de la création de sites internet, HTML, CSS, JavaScript et les outils informatiques modernes pour décrocher des opportunités professionnelles.',
    image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800',
    instructor: 'Moussa Diop (Ingénieur Soft & Lead Tech)',
    duration: '6 semaines (60h théoriques & pratiques)',
    level: 'Debutants',
    start_date: '2026-10-20',
    max_spots: 30,
    registered_count: 28,
    price_fcfa: 0, // Gratuit grâce aux partenaires
    status: 'ouvert',
    syllabus: [
      'Introduction à l’outil informatique et Internet',
      'HTML5 & CSS3 moderne',
      'Bases du JavaScript et dynamisme',
      'Gestion de projet digital & Portfolio personaliser'
    ],
    created_at: '2026-08-20T10:00:00Z'
  },
  {
    id: 'form-2',
    title: 'Entrepreneuriat Rural, Montage de Business Plan & Recherche de Financement',
    description: 'Apprenez à structurer votre idée d’entreprise, calculer la rentabilité financière, rédiger un business plan bancable et solliciter les fonds d’appui (DER/FJ, 3FPT, ONG).',
    image_url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800',
    instructor: 'Aminata Ndiaye (Experte Management & Projets)',
    duration: '4 semaines (40h)',
    level: 'Tous niveaux',
    start_date: '2026-11-02',
    max_spots: 40,
    registered_count: 35,
    price_fcfa: 5000,
    status: 'ouvert',
    syllabus: [
      'Étude de marché et validation d’idée',
      'Modèle économique (Business Model Canvas)',
      'Gestion financière simplifiée et trésorerie',
      'Techniques de Pitch devant les investisseurs'
    ],
    created_at: '2026-08-25T11:00:00Z'
  },
  {
    id: 'form-3',
    title: 'Installation, Maintenance & Gestion des Énergies Solaires',
    description: 'Formation certifiante et intensive sur la dimension, le montage et le dépannage des systèmes photovoltaïques pour habitations et fermes agricoles.',
    image_url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&q=80&w=800',
    instructor: 'Cheikh Seck (Expert Solaire & Énergie)',
    duration: '5 semaines (50h)',
    level: 'Intermediaire',
    start_date: '2026-11-10',
    max_spots: 25,
    registered_count: 25,
    price_fcfa: 10000,
    status: 'complet',
    syllabus: [
      'Principes de base de l’électricité solaire',
      'Composants : Panneaux, Regulateurs, Batteries, Onduleurs',
      'Pratique d’installation sur chantier école',
      'Sécurité et normes de conformité'
    ],
    created_at: '2026-09-01T09:00:00Z'
  }
];

export const mockOpportunities: Opportunity[] = [
  {
    id: 'opp-1',
    title: 'Stage Professionnel Développeur Web Front-End / Fullstack',
    category: 'Stage',
    organization: 'Dakar Tech Innovation Hub',
    location: 'Dakar / Hybride (Possibilité de Télétravail)',
    deadline: '2026-11-30',
    description: 'Une agence digitale partenaire recherche un stagiaire motivé pour participer au développement de solutions d’applications web modernes avec React, Next.js et Tailwind CSS.',
    requirements: [
      'Connaissance de HTML/CSS/JavaScript',
      'Intérêt pour React ou Next.js',
      'Capacité à travailler en équipe et rigueur'
    ],
    application_link: 'https://ajpk.sn/candidature/stage-dakar-tech',
    is_active: true,
    created_at: '2026-09-20T10:00:00Z'
  },
  {
    id: 'opp-2',
    title: 'Bourse d’Études & d’Excellence de la Jeunesse de Kelle 2026-2027',
    category: 'Bourse',
    organization: 'Fondation Partenaire AJPK & Mairie de Kelle',
    location: 'Universités & Écoles Supérieures du Sénégal',
    deadline: '2026-10-31',
    description: 'Prise en charge financière totale ou partielle des frais d’inscription et allocation mensuelle pour les étudiants originaires de Kelle ayant obtenu une mention Très Bien ou Bien au Baccalauréat.',
    requirements: [
      'Être originaire de la commune de Kelle',
      'Être membre inscrit à l’AJPK',
      'Avoir obtenu une excellente moyenne académique'
    ],
    application_link: 'https://ajpk.sn/bourse-excellence-2026',
    is_active: true,
    created_at: '2026-09-18T14:00:00Z'
  },
  {
    id: 'opp-3',
    title: 'Offre d’Emploi : Gestionnaire de Projets Communautaires & Ruraux',
    category: 'Emploi',
    organization: 'ONG Développement Durable Sénégal (DDS)',
    location: 'Région de Thies / Kelle',
    deadline: '2026-11-15',
    description: 'Supervision de l’exécution des micro-projets de formation et d’autonomisation économique des jeunes et femmes en milieu rural.',
    requirements: [
      'Bac +3 / Bac +5 en Sciences Sociales, Gestion de Projet ou Agronomie',
      'Minimum 2 ans d’expérience terrain',
      'Maîtrise du Wolof et du Français'
    ],
    application_link: 'mailto:recrutement@dds-senegal.org',
    is_active: true,
    created_at: '2026-09-25T08:30:00Z'
  },
  {
    id: 'opp-4',
    title: 'Appel à Projets : Subvention Agro-Tech & Économie Verte (Jusqu’à 3 000 000 FCFA)',
    category: 'Appel à projets',
    organization: 'Fonds d’Appui à l’Innovation Rurale',
    location: 'Commune de Kelle',
    deadline: '2026-12-10',
    description: 'Financement direct et accompagnement technique pour les projets innovants dans la transformation agricole, l’énergie propre et l’artisanat.',
    requirements: [
      'Projet porté par un jeune âgé de 18 à 35 ans',
      'Projet basé ou impactant directement Kelle',
      'Dossier de candidature complet avec budget prévisionnel'
    ],
    application_link: 'https://ajpk.sn/projets/soumettre',
    is_active: true,
    created_at: '2026-09-22T09:00:00Z'
  },
  {
    id: 'opp-5',
    title: 'Programme de Volontariat International et Échange Culturel',
    category: 'Volontariat',
    organization: 'Réseau International de la Jeunesse Solidaire',
    location: 'Kelle / International',
    deadline: '2026-12-20',
    description: 'Accompagnement de missions d’animation socioculturelle et de tutorat d’été pour les enfants des écoles de Kelle.',
    requirements: [
      'Sens élevé de l’engagement communautaire',
      'Enthousiasme, esprit d’équipe et créativité'
    ],
    application_link: 'https://ajpk.sn/volontariat',
    is_active: true,
    created_at: '2026-09-12T16:00:00Z'
  }
];

export const mockProjects: YouthProject[] = [
  {
    id: 'proj-1',
    title: 'Ferme Solaire Communautaire & Goutte-à-Goutte de Kelle',
    author_id: 'usr-3',
    author_name: 'Banda Niang',
    category: 'Agriculture & Énergie',
    summary: 'Mise en place d’un périmètre maraîcher moderne alimenté par pompage solaire pour la production de piments, tomates et oignons bio.',
    problem: 'Sécheresse périodique et coût élevé du carburant pour les motopompes traditionnelles réduisant les revenus des jeunes agriculteurs.',
    solution: 'Système d’irrigation solaire automatisé avec bassin de rétention d’eau et formation des jeunes aux techniques horticoles durables.',
    team_members: 'Banda Niang (Chef projet), Cheikh Seck (Technicien Solaire), 4 ouvriers agricoles de Kelle.',
    budget_fcfa: 4500000,
    funding_needed_fcfa: 2000000,
    needs_description: 'Acquisition de 8 panneaux solaires 450W, d’une pompe immergée et de 500m de tuyaux goutte-à-goutte.',
    image_url: 'https://images.unsplash.com/photo-1595838762121-6c4d68b422a5?auto=format&fit=crop&q=80&w=800',
    contact_email: 'banda.niang@ajpk.sn',
    contact_phone: '+221 70 345 67 89',
    status: 'En accompagnement',
    created_at: '2026-06-10T10:00:00Z'
  },
  {
    id: 'proj-2',
    title: 'Plateforme E-Commerce de Valorisation de l’Artisanat Local',
    author_id: 'usr-8',
    author_name: 'Ibrahima Samb',
    category: 'Technologie & Artisanat',
    summary: 'Vitrine en ligne et boutique d’exportation pour les produits artisanaux (tissages, teintures, sculptures, vannerie) fabriqués à Kelle.',
    problem: 'Enclavement des artisans locaux et dépendance aux intermédiaires qui réduisent leurs marges bénéficiaires.',
    solution: 'Une plateforme numérique intuitive avec système de paiement mobile (Wave, Orange Money) et livraison nationale/internationale.',
    team_members: 'Ibrahima Samb (Design & Marketing), Moussa Diop (Développement web), Ibrahima Sy (Représentant des artisans).',
    budget_fcfa: 2500000,
    funding_needed_fcfa: 1000000,
    needs_description: 'Financement du packaging écologique professionnel et budget publicitaire pour le lancement.',
    image_url: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&q=80&w=800',
    contact_email: 'ibrahima.samb@ajpk.sn',
    contact_phone: '+221 70 890 12 34',
    status: 'Accepté',
    created_at: '2026-07-01T14:30:00Z'
  },
  {
    id: 'proj-3',
    title: 'E-Bibliothèque & Centre Numérique de Soutien Scolaire Kelle',
    author_id: 'usr-2',
    author_name: 'Abdoukarim Ndiaye',
    category: 'Éducation & Inclusion Digital',
    summary: 'Aménagement d’une salle informatique équipée d’ordinateurs reconditionnés et d’une bibliothèque numérique gratuite pour les élèves de la commune.',
    problem: 'Absence d’accès à internet et manque d’ouvrages récents pour la préparation aux examens (BFEM, Baccalauréat).',
    solution: 'Un espace connecté et sécurisé de travail avec cours de soutien gratuits dispensés par les étudiants membres de l’AJPK.',
    team_members: 'Abdoukarim Ndiaye (Responsable), Khadija Ba (Tutorat), Moussa Diop (Réseaux).',
    budget_fcfa: 3800000,
    funding_needed_fcfa: 1500000,
    needs_description: 'Don de 10 ordinateurs portables de seconde main et abonnements internet haut débit.',
    image_url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800',
    contact_email: 'abdoukarim.ndiaye@ajpk.sn',
    contact_phone: '+221 78 234 56 78',
    status: 'En étude',
    created_at: '2026-08-15T09:00:00Z'
  }
];

export const mockPartners: Partner[] = [];

export const mockArticles: Article[] = [
  {
    id: 'art-1',
    title: 'Succès retentissant pour la 1ère édition du Forum de l’Emploi des Jeunes à Kelle',
    slug: 'succes-forum-emploi-jeunes-kelle-2026',
    category: 'Événement',
    summary: 'Plus de 250 jeunes ont pris part aux conférences, ateliers de rédaction de CV et rencontres avec les recruteurs régionaux.',
    content: `La journée du 15 septembre a été marquée par une mobilisation sans précédent de la jeunesse de Kelle au Foyer des Jeunes.

Sous la présence effective des autorités communales et des partenaires de l'AJPK, la première édition du Forum de l'Emploi a permis de former 80 jeunes à la recherche active d'emploi et de collecter plus de 120 CV transmis aux entreprises partenaires.

Le Président de l'AJPK a rappelé l'engagement ferme de l'association à créer des passerelles concrètes entre la formation des jeunes et les opportunités d'emploi dans la zone.`,
    cover_image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800',
    author: 'Bureau de Communication AJPK',
    published_at: '2026-09-16T09:00:00Z',
    is_published: true
  },
  {
    id: 'art-2',
    title: 'Lancement du Concours d’Innovation et d’Entrepreneuriat Vert Kelle 2026',
    slug: 'lancement-concours-innovation-vert-kelle',
    category: 'Annonce',
    summary: 'Un appel à projets doté de 3 millions de FCFA de prix est ouvert jusqu’au 10 décembre 2026 pour soutenir les micro-projets durables.',
    content: `L'AJPK, en partenariat avec le Fonds d'Appui à l'Innovation Rurale, lance officiellement la 2ème édition du Concours Jeunes Entrepreneurs.

Ce concours s'adresse à tous les membres de l'AJPK âgés de 18 à 35 ans portant un projet dans les domaines de l'agriculture biologique, de la transformation locale, des énergies renouvelables et de la technologie.

Les trois meilleurs projets bénéficieront d'un financement direct ainsi d'un accompagnement personnalisé de 6 mois par nos mentors.`,
    cover_image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800',
    author: 'Aminata Ndiaye',
    published_at: '2026-09-22T11:30:00Z',
    is_published: true
  },
  {
    id: 'art-3',
    title: 'Remise des Attestations aux 30 Diplômés de la Formation en Développement Web',
    slug: 'remise-attestations-formation-web-2026',
    category: 'Formation',
    summary: 'Félicitations aux 30 récipiendaires ayant validé avec succès le programme intensif de 60 heures en création de sites internet.',
    content: `Une cérémonie très émouvante s'est tenue ce samedi pour célébrer le succès de la cohorte 2026 en Développement Web.

Pendant 6 semaines, ces jeunes passionnés ont appris à concevoir des sites web dynamiques, à maîtriser les outils modernes et à concevoir leurs propres projets d'applications.

Chaque participant s'est vu remettre son attestation numérique officielle munie d'un QR Code unique vérifiable en ligne.`,
    cover_image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800',
    author: 'Moussa Diop',
    published_at: '2026-09-28T15:00:00Z',
    is_published: true
  },
  {
    id: 'art-4',
    title: 'Environnement : Plantation de 500 Arbres et Sensibilisation dans les Écoles',
    slug: 'plantation-500-arbres-sensibilisation-ecoles',
    category: 'Environnement',
    summary: 'La Commission Environnement s’est mobilisée pour verdoyer la cour des écoles primaires de la commune de Kelle.',
    content: `Dans le cadre du programme "Kelle Verte", les bénévoles de l'AJPK ont mené ce weekend une vaste opération de reboisement et d'installation de bacs à ordures dans 4 écoles primaires.

Cette initiative s'est accompagnée d'ateliers ludiques de sensibilisation au tri des déchets et à l'arrosage quotidien des arbres par les élèves de CM2.`,
    cover_image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800',
    author: 'Fatou Sow',
    published_at: '2026-09-30T10:00:00Z',
    is_published: true
  },
  {
    id: 'art-5',
    title: 'Guide Pratique : Comment Bénéficier de la Carte Membre Numérique AJPK ?',
    slug: 'guide-carte-membre-numerique-ajpk',
    category: 'Communiqué',
    summary: 'Découvrez la nouvelle carte de membre dotée d’un QR Code permettant de certifier votre statut et d’accéder aux avantages partenaires.',
    content: `L'AJPK franchit un nouveau pas dans la modernisation de sa gestion administrative avec la mise en place de la Carte Membre Numérique avec QR Code unique.

Chaque membre inscrit à jour de ses cotisations peut désormais télécharger sa carte depuis son Espace Membre / Dashboard.

Cette carte vous permettra de bénéficier de réductions auprès de nos partenaires (centres de formation, cybercafés, événements).`,
    cover_image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800',
    author: 'Secrétariat Général AJPK',
    published_at: '2026-10-01T12:00:00Z',
    is_published: true
  }
];

export const mockAlbums: GalleryAlbum[] = [
  {
    id: 'alb-1',
    title: 'Forum de la Jeunesse 2026',
    category: 'Événements',
    description: 'Moments forts, conférences et rencontres lors du grand forum annuel à Kelle.',
    cover_image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800',
    date: '15 Septembre 2026',
    media_count: 12,
    images: [
      'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=800'
    ]
  },
  {
    id: 'alb-2',
    title: 'Atelier Pratique Développement Web',
    category: 'Formations',
    description: 'Session de codage intensif et travaux pratiques des apprenants AJPK.',
    cover_image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800',
    date: 'Aout - Septembre 2026',
    media_count: 8,
    images: [
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800'
    ]
  },
  {
    id: 'alb-3',
    title: 'Opération Kelle Verte & Reboisement',
    category: 'Environnement',
    description: 'Mobilisation citoyenne des jeunes pour la plantation d’arbres et la salubrité.',
    cover_image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800',
    date: 'Juillet 2026',
    media_count: 15,
    images: [
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800'
    ]
  }
];

export const mockCotisations: Cotisation[] = [];

export const mockCertificates: Certificate[] = [];

export const mockNotifications: NotificationItem[] = [];
