-- ============================================================================
-- AJPK - Association de la Jeunesse Polyvalente de Kelle
-- Database PostgreSQL Schema & Row Level Security (RLS)
-- Version: 1.0 Production-Ready
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ROLES ENUM & TABLE
CREATE TYPE user_role AS ENUM ('member', 'trainer', 'partner', 'admin', 'super_admin');
CREATE TYPE sex_type AS ENUM ('M', 'F');
CREATE TYPE event_status_type AS ENUM ('a_venir', 'en_cours', 'termine', 'annule');
CREATE TYPE formation_status_type AS ENUM ('ouvert', 'complet', 'en_cours', 'termine');
CREATE TYPE project_status_type AS ENUM ('Soumis', 'En étude', 'Accepté', 'En accompagnement', 'Réalisé', 'Refusé');
CREATE TYPE partner_type_enum AS ENUM ('Entreprise', 'ONG', 'Institution', 'Association', 'Sponsor', 'École/Centre');

-- 2. PROFILES TABLE (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    member_number TEXT UNIQUE NOT NULL, -- e.g. AJPK-00001
    phone TEXT,
    date_of_birth DATE,
    sex sex_type DEFAULT 'M',
    address TEXT,
    profession TEXT,
    education_level TEXT,
    avatar_url TEXT,
    bio TEXT,
    role user_role DEFAULT 'member',
    status TEXT DEFAULT 'actif',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. COMMISSIONS
CREATE TABLE IF NOT EXISTS public.commissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    lead_name TEXT,
    members_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SKILLS & MEMBER_SKILLS
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    category TEXT
);

CREATE TABLE IF NOT EXISTS public.member_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    skill_name TEXT NOT NULL,
    level TEXT DEFAULT 'Intermédiaire',
    UNIQUE(member_id, skill_name)
);

-- 5. EVENTS & REGISTRATIONS
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    event_date DATE NOT NULL,
    event_time TEXT NOT NULL,
    location TEXT NOT NULL,
    max_spots INT DEFAULT 100,
    registered_count INT DEFAULT 0,
    organizer TEXT NOT NULL,
    status event_status_type DEFAULT 'a_venir',
    category TEXT DEFAULT 'Général',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.event_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- 6. FORMATIONS & REGISTRATIONS
CREATE TABLE IF NOT EXISTS public.formations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    instructor TEXT NOT NULL,
    duration TEXT NOT NULL,
    level TEXT DEFAULT 'Tous niveaux',
    start_date DATE NOT NULL,
    max_spots INT DEFAULT 30,
    registered_count INT DEFAULT 0,
    price_fcfa NUMERIC(10, 2) DEFAULT 0,
    status formation_status_type DEFAULT 'ouvert',
    syllabus JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.formation_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    formation_id UUID REFERENCES public.formations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(formation_id, user_id)
);

-- 7. CERTIFICATES
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    certificate_number TEXT UNIQUE NOT NULL, -- AJPK-CERT-2026-XXXX
    member_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    formation_id UUID REFERENCES public.formations(id) ON DELETE CASCADE,
    issue_date DATE DEFAULT CURRENT_DATE,
    signatory TEXT NOT NULL,
    status TEXT DEFAULT 'valide',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. OPPORTUNITIES & APPLICATIONS
CREATE TABLE IF NOT EXISTS public.opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL, -- Emploi, Stage, Bourse, Concours, etc.
    organization TEXT NOT NULL,
    location TEXT NOT NULL,
    deadline DATE NOT NULL,
    description TEXT NOT NULL,
    requirements JSONB,
    application_link TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    cover_letter TEXT,
    resume_url TEXT,
    applied_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. YOUTH PROJECTS & MEMBERS
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    summary TEXT NOT NULL,
    problem TEXT NOT NULL,
    solution TEXT NOT NULL,
    team_members TEXT,
    budget_fcfa NUMERIC(12, 2) DEFAULT 0,
    funding_needed_fcfa NUMERIC(12, 2) DEFAULT 0,
    needs_description TEXT,
    image_url TEXT,
    document_url TEXT,
    contact_email TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    status project_status_type DEFAULT 'Soumis',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.project_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'Collaborateur'
);

-- 10. PARTNERS & PARTNER_REQUESTS
CREATE TABLE IF NOT EXISTS public.partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type partner_type_enum DEFAULT 'Entreprise',
    logo_url TEXT,
    sector TEXT,
    description TEXT,
    website TEXT,
    email TEXT,
    phone TEXT,
    is_official BOOLEAN DEFAULT TRUE,
    partnership_date DATE DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS public.partner_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_name TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    type partner_type_enum DEFAULT 'Entreprise',
    message TEXT NOT NULL,
    status TEXT DEFAULT 'en_attente',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. ARTICLES & GALLERY
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    cover_image TEXT,
    author TEXT NOT NULL,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    is_published BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS public.gallery_albums (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    cover_image TEXT,
    album_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.gallery_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    album_id UUID REFERENCES public.gallery_albums(id) ON DELETE CASCADE,
    media_url TEXT NOT NULL,
    caption TEXT
);

-- 12. MEMBERSHIPS & COTISATIONS (PAYMENTS)
CREATE TABLE IF NOT EXISTS public.memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    year INT NOT NULL,
    status TEXT DEFAULT 'a_jour',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount_fcfa NUMERIC(10, 2) DEFAULT 1000,
    period TEXT NOT NULL, -- e.g. Octobre 2026
    status TEXT DEFAULT 'paye',
    payment_method TEXT,
    transaction_ref TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. NOTIFICATIONS, CONTACT MESSAGES & AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info',
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    details JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.formations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Profiles Policy: Users can read public profiles; Users update own; Admin updates all.
CREATE POLICY "Public profiles are readable" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins full access profiles" ON public.profiles FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Events & Formations: Anyone can read, only admin can create/update/delete
CREATE POLICY "Events readable by all" ON public.events FOR SELECT USING (true);
CREATE POLICY "Admin write events" ON public.events FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

CREATE POLICY "Formations readable by all" ON public.formations FOR SELECT USING (true);
CREATE POLICY "Admin write formations" ON public.formations FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Projects: Public can read, authenticated can create, owner/admin can edit
CREATE POLICY "Projects readable by all" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Auth user insert project" ON public.projects FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Owner or admin update project" ON public.projects FOR UPDATE USING (
    auth.uid() = author_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Certificates & Payments: User can read own, Admin full access
CREATE POLICY "User read own certificate" ON public.certificates FOR SELECT USING (
    auth.uid() = member_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);
CREATE POLICY "User read own payments" ON public.payments FOR SELECT USING (
    auth.uid() = member_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);
