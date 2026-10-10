export type UserRole = 'member' | 'trainer' | 'partner' | 'admin' | 'super_admin';

export interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  member_number: string; // e.g. AJPK-00001
  phone: string;
  date_of_birth: string;
  sex: 'M' | 'F';
  address: string;
  profession: string;
  education_level: string;
  avatar_url?: string;
  bio?: string;
  role: UserRole;
  created_at: string;
  skills: string[];
  interest_domains: string[];
  status: 'actif' | 'en_attente' | 'inactif';
}

export interface Commission {
  id: string;
  name: string;
  description: string;
  lead_name: string;
  members_count: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  image_url: string;
  event_date: string;
  event_time: string;
  location: string;
  max_spots: number;
  registered_count: number;
  organizer: string;
  status: 'a_venir' | 'en_cours' | 'termine' | 'annule';
  category: string;
  created_at: string;
}

export interface Formation {
  id: string;
  title: string;
  description: string;
  image_url: string;
  instructor: string;
  duration: string; // e.g. "3 semaines (30h)"
  level: 'Debutants' | 'Intermediaire' | 'Avance' | 'Tous niveaux';
  start_date: string;
  max_spots: number;
  registered_count: number;
  price_fcfa: number; // 0 for free
  status: 'ouvert' | 'complet' | 'en_cours' | 'termine';
  syllabus?: string[];
  created_at: string;
}

export interface Certificate {
  id: string;
  certificate_number: string; // e.g. AJPK-CERT-2026-0089
  member_id: string;
  member_name: string;
  formation_id: string;
  formation_title: string;
  issue_date: string;
  signatory: string; // e.g. "Le Président de l'AJPK"
  status: 'valide' | 'revoke';
}

export type OpportunityCategory = 
  | 'Emploi' 
  | 'Stage' 
  | 'Formation' 
  | 'Bourse' 
  | 'Concours' 
  | 'Financement' 
  | 'Appel à projets' 
  | 'Volontariat';

export interface Opportunity {
  id: string;
  title: string;
  category: OpportunityCategory;
  organization: string;
  location: string;
  deadline: string;
  description: string;
  requirements: string[];
  application_link?: string;
  is_active: boolean;
  created_at: string;
}

export type ProjectStatus = 
  | 'Soumis' 
  | 'En étude' 
  | 'Accepté' 
  | 'En accompagnement' 
  | 'Réalisé' 
  | 'Refusé';

export interface YouthProject {
  id: string;
  title: string;
  author_id: string;
  author_name: string;
  category: string;
  summary: string;
  problem: string;
  solution: string;
  team_members: string;
  budget_fcfa: number;
  funding_needed_fcfa: number;
  needs_description: string;
  image_url: string;
  document_url?: string;
  contact_email: string;
  contact_phone: string;
  status: ProjectStatus;
  created_at: string;
}

export interface TalentProfile {
  id: string;
  profile_id: string;
  full_name: string;
  profession: string;
  photo_url: string;
  skills: { name: string; level: 'Débutant' | 'Intermédiaire' | 'Expert' }[];
  experience_years: number;
  location: string;
  bio: string;
  email: string;
  phone: string;
  portfolio_url?: string;
  is_available: boolean;
}

export type PartnerType = 
  | 'Entreprise' 
  | 'ONG' 
  | 'Institution' 
  | 'Association' 
  | 'Sponsor' 
  | 'École/Centre';

export interface Partner {
  id: string;
  name: string;
  type: PartnerType;
  logo_url: string;
  sector: string;
  description: string;
  website?: string;
  email: string;
  phone: string;
  is_official: boolean;
  partnership_date: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  content: string;
  cover_image: string;
  author: string;
  published_at: string;
  is_published: boolean;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  category: 'Événements' | 'Formations' | 'Sport' | 'Environnement' | 'Social' | 'Culture';
  description: string;
  cover_image: string;
  date: string;
  media_count: number;
  images: string[];
}

export interface Cotisation {
  id: string;
  member_id: string;
  member_name: string;
  member_number: string;
  amount_fcfa: number;
  period: string; // e.g. "Octobre 2026"
  status: 'paye' | 'en_attente' | 'retard';
  payment_date?: string;
  method?: string; // e.g. "Wave / Orange Money"
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'event' | 'formation' | 'project';
  read: boolean;
  created_at: string;
}
