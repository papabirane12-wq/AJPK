'use client';

import {
  Profile,
  Event,
  Formation,
  Opportunity,
  YouthProject,
  Partner,
  Article,
  Cotisation,
  Certificate,
  NotificationItem
} from '@/types';
import {
  mockMembers,
  mockEvents,
  mockFormations,
  mockOpportunities,
  mockProjects,
  mockPartners,
  mockArticles,
  mockCotisations,
  mockCertificates,
  mockNotifications
} from './mockData';

// Storage keys
const STORAGE_KEYS = {
  CURRENT_USER: 'ajpk_current_user',
  MEMBERS: 'ajpk_members',
  EVENTS: 'ajpk_events',
  FORMATIONS: 'ajpk_formations',
  OPPORTUNITIES: 'ajpk_opportunities',
  PROJECTS: 'ajpk_projects',
  PARTNERS: 'ajpk_partners',
  ARTICLES: 'ajpk_articles',
  COTISATIONS: 'ajpk_cotisations',
  CERTIFICATES: 'ajpk_certificates',
  NOTIFICATIONS: 'ajpk_notifications',
  SAVED_OPPORTUNITIES: 'ajpk_saved_opps',
  REGISTERED_EVENTS: 'ajpk_reg_events',
  REGISTERED_FORMATIONS: 'ajpk_reg_formations',
};

// Helper for localStorage
function getItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage`, e);
  }
}

// Initial state getters (null par défaut : visiteur non connecté)
export function getCurrentUser(): Profile | null {
  return getItem<Profile | null>(STORAGE_KEYS.CURRENT_USER, null);
}

export function setCurrentUser(user: Profile | null): void {
  if (typeof window === 'undefined') return;
  if (user) {
    setItem(STORAGE_KEYS.CURRENT_USER, user);
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
}

export function getMembers(): Profile[] {
  return getItem<Profile[]>(STORAGE_KEYS.MEMBERS, mockMembers);
}

export function addMember(newMember: Partial<Profile>): Profile {
  const members = getMembers();
  const nextNum = members.length + 1;
  const member_number = `AJPK-${String(nextNum).padStart(5, '0')}`;
  
  const created: Profile = {
    id: `usr-${Date.now()}`,
    email: newMember.email || 'membre@ajpk.sn',
    first_name: newMember.first_name || '',
    last_name: newMember.last_name || '',
    member_number,
    phone: newMember.phone || '',
    date_of_birth: newMember.date_of_birth || '2000-01-01',
    sex: newMember.sex || 'M',
    address: newMember.address || 'Kelle',
    profession: newMember.profession || 'Membre AJPK',
    education_level: newMember.education_level || 'Baccalauréat',
    avatar_url: newMember.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    bio: newMember.bio || 'Jeune engagé pour le développement de Kelle.',
    role: 'member',
    created_at: new Date().toISOString(),
    skills: newMember.skills || ['Communication', 'Travail d’équipe'],
    interest_domains: newMember.interest_domains || ['Jeunesse', 'Développement local'],
    status: 'actif'
  };

  const updated = [created, ...members];
  setItem(STORAGE_KEYS.MEMBERS, updated);
  return created;
}

export function getEvents(): Event[] {
  return getItem<Event[]>(STORAGE_KEYS.EVENTS, mockEvents);
}

export function addEvent(event: Partial<Event>): Event {
  const events = getEvents();
  const created: Event = {
    id: `evt-${Date.now()}`,
    title: event.title || 'Nouvel Événement AJPK',
    description: event.description || '',
    image_url: event.image_url || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800',
    event_date: event.event_date || new Date().toISOString().split('T')[0],
    event_time: event.event_time || '09:00 - 12:00',
    location: event.location || 'Foyer des Jeunes de Kelle',
    max_spots: event.max_spots || 100,
    registered_count: 0,
    organizer: event.organizer || 'Bureau AJPK',
    status: event.status || 'a_venir',
    category: event.category || 'Général',
    created_at: new Date().toISOString()
  };
  const updated = [created, ...events];
  setItem(STORAGE_KEYS.EVENTS, updated);
  return created;
}

export function getFormations(): Formation[] {
  return getItem<Formation[]>(STORAGE_KEYS.FORMATIONS, mockFormations);
}

export function addFormation(formation: Partial<Formation>): Formation {
  const formations = getFormations();
  const created: Formation = {
    id: `form-${Date.now()}`,
    title: formation.title || 'Nouvelle Formation AJPK',
    description: formation.description || '',
    image_url: formation.image_url || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800',
    instructor: formation.instructor || 'Formateur AJPK',
    duration: formation.duration || '4 semaines',
    level: formation.level || 'Tous niveaux',
    start_date: formation.start_date || new Date().toISOString().split('T')[0],
    max_spots: formation.max_spots || 30,
    registered_count: 0,
    price_fcfa: formation.price_fcfa || 0,
    status: 'ouvert',
    syllabus: formation.syllabus || ['Introduction', 'Pratique', 'Projet final'],
    created_at: new Date().toISOString()
  };
  const updated = [created, ...formations];
  setItem(STORAGE_KEYS.FORMATIONS, updated);
  return created;
}

export function getOpportunities(): Opportunity[] {
  return getItem<Opportunity[]>(STORAGE_KEYS.OPPORTUNITIES, mockOpportunities);
}

export function addOpportunity(opp: Partial<Opportunity>): Opportunity {
  const opps = getOpportunities();
  const created: Opportunity = {
    id: `opp-${Date.now()}`,
    title: opp.title || 'Nouvelle Opportunité',
    category: opp.category || 'Emploi',
    organization: opp.organization || 'Partenaire AJPK',
    location: opp.location || 'Kelle',
    deadline: opp.deadline || '2026-12-31',
    description: opp.description || '',
    requirements: opp.requirements || ['Motivation', 'Rigueur'],
    application_link: opp.application_link || 'https://ajpk.sn',
    is_active: true,
    created_at: new Date().toISOString()
  };
  const updated = [created, ...opps];
  setItem(STORAGE_KEYS.OPPORTUNITIES, updated);
  return created;
}

export function getProjects(): YouthProject[] {
  return getItem<YouthProject[]>(STORAGE_KEYS.PROJECTS, mockProjects);
}

export function addProject(project: Partial<YouthProject>, user: Profile): YouthProject {
  const projects = getProjects();
  const created: YouthProject = {
    id: `proj-${Date.now()}`,
    title: project.title || 'Nouveau Projet Jeune',
    author_id: user.id,
    author_name: `${user.first_name} ${user.last_name}`,
    category: project.category || 'Innovation',
    summary: project.summary || '',
    problem: project.problem || '',
    solution: project.solution || '',
    team_members: project.team_members || `${user.first_name} ${user.last_name}`,
    budget_fcfa: project.budget_fcfa || 1000000,
    funding_needed_fcfa: project.funding_needed_fcfa || 500000,
    needs_description: project.needs_description || 'Accompagnement technique et matériel.',
    image_url: project.image_url || 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&q=80&w=800',
    contact_email: project.contact_email || user.email,
    contact_phone: project.contact_phone || user.phone,
    status: 'Soumis',
    created_at: new Date().toISOString()
  };
  const updated = [created, ...projects];
  setItem(STORAGE_KEYS.PROJECTS, updated);
  return created;
}

export function updateProjectStatus(projectId: string, newStatus: YouthProject['status']): void {
  const projects = getProjects();
  const updated = projects.map(p => p.id === projectId ? { ...p, status: newStatus } : p);
  setItem(STORAGE_KEYS.PROJECTS, updated);
}

export function getPartners(): Partner[] {
  return getItem<Partner[]>(STORAGE_KEYS.PARTNERS, mockPartners);
}

export function addPartner(partner: Partial<Partner>): Partner {
  const partners = getPartners();
  const created: Partner = {
    id: `part-${Date.now()}`,
    name: partner.name || 'Nouveau Partenaire',
    type: partner.type || 'Entreprise',
    logo_url: partner.logo_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=300',
    sector: partner.sector || 'Secteur Privé',
    description: partner.description || '',
    website: partner.website || '',
    email: partner.email || '',
    phone: partner.phone || '',
    is_official: true,
    partnership_date: new Date().toISOString().split('T')[0]
  };
  const updated = [created, ...partners];
  setItem(STORAGE_KEYS.PARTNERS, updated);
  return created;
}

export function getArticles(): Article[] {
  return getItem<Article[]>(STORAGE_KEYS.ARTICLES, mockArticles);
}

export function addArticle(art: Partial<Article>): Article {
  const articles = getArticles();
  const created: Article = {
    id: `art-${Date.now()}`,
    title: art.title || 'Nouvel Article',
    slug: (art.title || 'article').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    category: art.category || 'Actualité',
    summary: art.summary || '',
    content: art.content || '',
    cover_image: art.cover_image || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800',
    author: art.author || 'Rédaction AJPK',
    published_at: new Date().toISOString(),
    is_published: true
  };
  const updated = [created, ...articles];
  setItem(STORAGE_KEYS.ARTICLES, updated);
  return created;
}

export function getCotisations(): Cotisation[] {
  return getItem<Cotisation[]>(STORAGE_KEYS.COTISATIONS, mockCotisations);
}

export function markCotisationPaid(cotisationId: string, method = 'Wave Sénégal'): void {
  const cots = getCotisations();
  const updated = cots.map(c => c.id === cotisationId ? {
    ...c,
    status: 'paye' as const,
    payment_date: new Date().toISOString().split('T')[0],
    method
  } : c);
  setItem(STORAGE_KEYS.COTISATIONS, updated);
}

export function getCertificates(): Certificate[] {
  return getItem<Certificate[]>(STORAGE_KEYS.CERTIFICATES, mockCertificates);
}

export function generateCertificate(member: Profile, formation: Formation): Certificate {
  const certs = getCertificates();
  const num = `AJPK-CERT-2026-${String(certs.length + 101).padStart(4, '0')}`;
  const created: Certificate = {
    id: `cert-${Date.now()}`,
    certificate_number: num,
    member_id: member.id,
    member_name: `${member.first_name} ${member.last_name}`,
    formation_id: formation.id,
    formation_title: formation.title,
    issue_date: new Date().toISOString().split('T')[0],
    signatory: 'Le Président de l’AJPK & Commission Formation',
    status: 'valide'
  };
  const updated = [created, ...certs];
  setItem(STORAGE_KEYS.CERTIFICATES, updated);
  return created;
}

export function getNotifications(): NotificationItem[] {
  return getItem<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, mockNotifications);
}

// Subscriptions & User Interactivity
export function registerForEvent(eventId: string, userId: string): boolean {
  const registered = getItem<string[]>(STORAGE_KEYS.REGISTERED_EVENTS, ['evt-1']);
  if (!registered.includes(eventId)) {
    setItem(STORAGE_KEYS.REGISTERED_EVENTS, [...registered, eventId]);
    // increment registered_count
    const events = getEvents();
    const updated = events.map(e => e.id === eventId ? { ...e, registered_count: e.registered_count + 1 } : e);
    setItem(STORAGE_KEYS.EVENTS, updated);
    return true;
  }
  return false;
}

export function isRegisteredForEvent(eventId: string): boolean {
  const registered = getItem<string[]>(STORAGE_KEYS.REGISTERED_EVENTS, ['evt-1']);
  return registered.includes(eventId);
}

export function registerForFormation(formationId: string, userId: string): boolean {
  const registered = getItem<string[]>(STORAGE_KEYS.REGISTERED_FORMATIONS, ['form-1']);
  if (!registered.includes(formationId)) {
    setItem(STORAGE_KEYS.REGISTERED_FORMATIONS, [...registered, formationId]);
    const formations = getFormations();
    const updated = formations.map(f => f.id === formationId ? { ...f, registered_count: f.registered_count + 1 } : f);
    setItem(STORAGE_KEYS.FORMATIONS, updated);
    return true;
  }
  return false;
}

export function isRegisteredForFormation(formationId: string): boolean {
  const registered = getItem<string[]>(STORAGE_KEYS.REGISTERED_FORMATIONS, ['form-1']);
  return registered.includes(formationId);
}

export function toggleSaveOpportunity(oppId: string): boolean {
  const saved = getItem<string[]>(STORAGE_KEYS.SAVED_OPPORTUNITIES, ['opp-1', 'opp-4']);
  let updated: string[];
  let isSaved: boolean;
  if (saved.includes(oppId)) {
    updated = saved.filter(id => id !== oppId);
    isSaved = false;
  } else {
    updated = [...saved, oppId];
    isSaved = true;
  }
  setItem(STORAGE_KEYS.SAVED_OPPORTUNITIES, updated);
  return isSaved;
}

export function isOpportunitySaved(oppId: string): boolean {
  const saved = getItem<string[]>(STORAGE_KEYS.SAVED_OPPORTUNITIES, ['opp-1', 'opp-4']);
  return saved.includes(oppId);
}
