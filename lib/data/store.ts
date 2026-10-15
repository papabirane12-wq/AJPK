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

const SIMULATED_IDS = new Set(['usr-1', 'usr-2', 'usr-3', 'usr-4', 'usr-5', 'usr-6', 'usr-7', 'usr-8', 'usr-9', 'usr-10']);

// Initial state getters (null par défaut : visiteur non connecté)
export function getCurrentUser(): Profile | null {
  const user = getItem<Profile | null>(STORAGE_KEYS.CURRENT_USER, null);
  if (user) {
    if (user.avatar_url && (user.avatar_url.includes('unsplash') || user.avatar_url.includes('images.unsplash.com'))) {
      user.avatar_url = '';
    }
    if (
      user.member_number === 'AJPK-00011' ||
      user.member_number === 'AJPK-100011' ||
      (user.first_name === 'Ibrahima' && user.last_name === 'Samb')
    ) {
      user.id = 'usr-admin-ibrahima-samb';
      user.first_name = 'Ibrahima';
      user.last_name = 'Samb';
      user.profession = 'Développeur web';
      user.role = 'super_admin';
      user.member_number = 'AJPK-00011';
      user.address = 'Kelle, Sénégal';
    }
    if (typeof window !== 'undefined') {
      setItem(STORAGE_KEYS.CURRENT_USER, user);
    }
  }
  return user;
}

export function setCurrentUser(user: Profile | null): void {
  if (typeof window === 'undefined') return;
  if (user) {
    if (user.avatar_url && (user.avatar_url.includes('unsplash') || user.avatar_url.includes('images.unsplash.com'))) {
      user.avatar_url = '';
    }
    if (user.member_number === 'AJPK-00011' || (user.first_name === 'Ibrahima' && user.last_name === 'Samb')) {
      user.profession = 'Développeur web';
      user.role = 'super_admin';
      user.member_number = 'AJPK-00011';
      user.address = 'Kelle, Sénégal';
    }
    setItem(STORAGE_KEYS.CURRENT_USER, user);
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
}

export function getMembers(): Profile[] {
  const rawMembers = getItem<Profile[]>(STORAGE_KEYS.MEMBERS, []);
  // Supprimer définitivement les anciens membres simulés stockés en cache
  const members = rawMembers.filter(m => !SIMULATED_IDS.has(m.id));

  // Nettoyer toute photo de membre simulée (Unsplash)
  for (const m of members) {
    if (m.avatar_url && (m.avatar_url.includes('unsplash') || m.avatar_url.includes('images.unsplash.com'))) {
      m.avatar_url = '';
    }
  }

  return members;
}

export function addMember(newMember: Partial<Profile>): Profile {
  const members = getMembers();
  
  // Utiliser le numéro attribué par le serveur central ou calculer le prochain
  let member_number = newMember.member_number;
  if (!member_number) {
    const existingNumbers = members
      .map(m => {
        const match = m.member_number.match(/AJPK-(\d+)/i);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter(n => !isNaN(n));
    const maxNum = existingNumbers.length > 0 ? Math.max(...existingNumbers, 0) : 0;
    const nextNum = maxNum + 1;
    member_number = `AJPK-${String(nextNum).padStart(5, '0')}`;
  }
  
  const created: Profile = {
    id: newMember.id || `usr-${Date.now()}`,
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
    avatar_url: newMember.avatar_url || '',
    bio: newMember.bio || 'Jeune engagé pour le développement de Kelle.',
    role: 'member',
    created_at: newMember.created_at || new Date().toISOString(),
    skills: newMember.skills || ['Communication', 'Travail d’équipe'],
    interest_domains: newMember.interest_domains || ['Jeunesse', 'Développement local'],
    status: 'actif'
  };

  const updated = [created, ...members.filter(m => m.member_number !== created.member_number)];
  setItem(STORAGE_KEYS.MEMBERS, updated);

  // Synchronisation avec le registre central Supabase si côté client
  if (typeof window !== 'undefined' && !newMember.member_number) {
    fetch('/api/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(created),
    }).catch(e => console.error('Erreur synchronisation API membres:', e));
  }

  // Enregistrer le reçu de paiement de l'adhésion officielle (1 050 FCFA)
  const cots = getCotisations();
  const adhesionCotisation: Cotisation = {
    id: `cot-adhesion-${created.member_number}`,
    member_id: created.id,
    member_name: `${created.first_name} ${created.last_name}`.trim(),
    member_number: created.member_number,
    amount_fcfa: 1050,
    period: 'Frais d’Adhésion & Carte Membre',
    status: 'paye',
    payment_date: new Date().toISOString().split('T')[0],
    method: 'Wave / Orange Money'
  };
  const filteredCots = cots.filter(c => c.member_number !== created.member_number);
  setItem(STORAGE_KEYS.COTISATIONS, [adhesionCotisation, ...filteredCots]);

  return created;
}

export function updateMember(memberIdOrNumber: string, updates: Partial<Profile>): Profile | null {
  const members = getMembers();
  const index = members.findIndex(m => m.id === memberIdOrNumber || m.member_number === memberIdOrNumber);
  if (index === -1) return null;

  members[index] = { ...members[index], ...updates };
  setItem(STORAGE_KEYS.MEMBERS, members);

  // Synchroniser current user si identique
  const currentUser = getItem<Profile | null>(STORAGE_KEYS.CURRENT_USER, null);
  if (currentUser && (currentUser.id === memberIdOrNumber || currentUser.member_number === memberIdOrNumber)) {
    const updatedUser = { ...currentUser, ...updates };
    setItem(STORAGE_KEYS.CURRENT_USER, updatedUser);
  }

  return members[index];
}

export function updateCurrentUserAvatar(avatarUrl: string): Profile | null {
  const currentUser = getCurrentUser();
  if (!currentUser) return null;
  return updateMember(currentUser.id, { avatar_url: avatarUrl });
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

export function addProject(project: Partial<YouthProject>, user?: Profile | null): YouthProject {
  const projects = getProjects();
  const authorId = user?.id || `anon-${Date.now()}`;
  const authorName = user ? `${user.first_name} ${user.last_name}` : 'Porteur de Projet';
  const authorEmail = user?.email || project.contact_email || 'contact@ajpk.sn';
  const authorPhone = user?.phone || project.contact_phone || '+221 77 000 00 00';

  const created: YouthProject = {
    id: `proj-${Date.now()}`,
    title: project.title || 'Nouveau Projet Jeune',
    author_id: authorId,
    author_name: authorName,
    category: project.category || 'Innovation',
    summary: project.summary || '',
    problem: project.problem || '',
    solution: project.solution || '',
    team_members: project.team_members || authorName,
    budget_fcfa: project.budget_fcfa || 1000000,
    funding_needed_fcfa: project.funding_needed_fcfa || 500000,
    needs_description: project.needs_description || 'Accompagnement technique et matériel.',
    image_url: project.image_url || 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&q=80&w=800',
    contact_email: project.contact_email || authorEmail,
    contact_phone: project.contact_phone || authorPhone,
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

const SIMULATED_COT_IDS = new Set(['cot-1', 'cot-2', 'cot-3', 'cot-4', 'cot-5']);

export function getCotisations(): Cotisation[] {
  const rawCots = getItem<Cotisation[]>(STORAGE_KEYS.COTISATIONS, []);
  const members = getMembers();
  const validMemberMap = new Map(members.map(m => [m.member_number, m]));

  // 1. Filtrer toutes les cotisations simulées (IDs fictifs, membres fictifs, adhérents inexistants)
  const nonSimulated = rawCots.filter(c => 
    c &&
    !SIMULATED_COT_IDS.has(c.id) && 
    (!c.member_id || !SIMULATED_IDS.has(c.member_id)) &&
    c.member_number &&
    validMemberMap.has(c.member_number)
  );

  // 2. Harmoniser les cotisations valides et garantir l'adhésion officielle (1 050 FCFA) pour chaque membre inscrit
  const validCots: Cotisation[] = [];
  const membersWithAdhesion = new Set<string>();

  for (const cot of nonSimulated) {
    const member = validMemberMap.get(cot.member_number);
    if (!member) continue;

    const isAdhesion = 
      cot.id.startsWith('cot-adhesion-') || 
      cot.period?.toLowerCase().includes('adhésion') || 
      cot.period?.toLowerCase().includes('adhesion') || 
      cot.amount_fcfa === 1050;

    if (isAdhesion) {
      if (membersWithAdhesion.has(cot.member_number)) {
        continue; // Éviter tout doublon d'adhésion pour un même membre inscrit
      }
      membersWithAdhesion.add(cot.member_number);
    }

    validCots.push({
      ...cot,
      member_name: `${member.first_name} ${member.last_name}`.trim(),
      member_id: member.id,
      amount_fcfa: Number(cot.amount_fcfa) || 1050,
      status: cot.status || 'paye'
    });
  }

  // 3. S'assurer que chaque membre inscrit possède sa cotisation d'adhésion officielle de 1 050 FCFA
  for (const m of members) {
    if (!membersWithAdhesion.has(m.member_number)) {
      validCots.unshift({
        id: `cot-adhesion-${m.member_number}`,
        member_id: m.id,
        member_name: `${m.first_name} ${m.last_name}`.trim(),
        member_number: m.member_number,
        amount_fcfa: 1050,
        period: 'Frais d’Adhésion & Carte Membre',
        status: 'paye',
        payment_date: m.created_at ? m.created_at.split('T')[0] : '2026-10-10',
        method: 'Wave / Orange Money',
      });
      membersWithAdhesion.add(m.member_number);
    }
  }

  // 4. Sauvegarder dans localStorage si la liste a été mise à jour ou nettoyée
  if (typeof window !== 'undefined') {
    setItem(STORAGE_KEYS.COTISATIONS, validCots);
  }

  return validCots;
}

export function getCotisationsSummary() {
  const cots = getCotisations();
  const totalAmount = cots.reduce((sum, c) => sum + (c.status === 'paye' ? (Number(c.amount_fcfa) || 0) : 0), 0);
  const pendingAmount = cots.reduce((sum, c) => sum + (c.status === 'en_attente' ? (Number(c.amount_fcfa) || 0) : 0), 0);
  const totalPaidCount = cots.filter(c => c.status === 'paye').length;
  const totalPendingCount = cots.filter(c => c.status === 'en_attente').length;
  
  const adhesionCots = cots.filter(c => 
    c.id.startsWith('cot-adhesion-') || 
    c.period?.toLowerCase().includes('adhésion') || 
    c.period?.toLowerCase().includes('adhesion') || 
    c.amount_fcfa === 1050
  );
  const totalAdhesionAmount = adhesionCots.reduce((sum, c) => sum + (c.status === 'paye' ? (Number(c.amount_fcfa) || 0) : 0), 0);

  return {
    totalAmount,
    pendingAmount,
    totalCount: cots.length,
    totalPaidCount,
    totalPendingCount,
    adhesionCount: adhesionCots.length,
    totalAdhesionAmount,
    cotisations: cots
  };
}

export function resetCotisationsToInscriptions(): Cotisation[] {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.COTISATIONS);
  }
  return getCotisations();
}

export function addCotisation(cot: Partial<Cotisation>): Cotisation {
  const cots = getCotisations();
  const created: Cotisation = {
    id: `cot-${Date.now()}`,
    member_id: cot.member_id || '',
    member_name: cot.member_name || 'Membre AJPK',
    member_number: cot.member_number || 'AJPK-00000',
    amount_fcfa: cot.amount_fcfa || 1050,
    period: cot.period || 'Cotisation Mensuelle',
    status: cot.status || 'paye',
    payment_date: cot.payment_date || new Date().toISOString().split('T')[0],
    method: cot.method || 'Wave Sénégal',
  };
  const updated = [created, ...cots];
  setItem(STORAGE_KEYS.COTISATIONS, updated);
  return created;
}

export function deleteCotisation(cotisationId: string): void {
  const cots = getCotisations();
  const updated = cots.filter(c => c.id !== cotisationId);
  setItem(STORAGE_KEYS.COTISATIONS, updated);
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

const SIMULATED_CERT_IDS = new Set(['cert-1', 'cert-2']);
export function getCertificates(): Certificate[] {
  const certs = getItem<Certificate[]>(STORAGE_KEYS.CERTIFICATES, mockCertificates);
  return certs.filter(c => !SIMULATED_CERT_IDS.has(c.id));
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
