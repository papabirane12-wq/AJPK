-- Seed initial data for AJPK Platform

INSERT INTO public.commissions (name, description, lead_name, members_count) VALUES
('Commission Éducation & Formation', 'Tutorat et cours de soutien', 'Aminata Ndiaye', 24),
('Commission Économie & Entrepreneuriat', 'Accompagnement des porteurs de projets', 'Moussa Diop', 18),
('Commission Culture & Sport', 'Animation associative et tournois', 'Ousmane Fall', 31),
('Commission Environnement & Cadre de Vie', 'Reboisement et développement durable', 'Fatou Sow', 15);

INSERT INTO public.events (title, description, image_url, event_date, event_time, location, max_spots, registered_count, organizer, category) VALUES
('Forum Annuel de la Jeunesse de Kelle 2026', 'Grand rassemblement annuel sur l’emploi et l’innovation', 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800', '2026-11-15', '09:00 - 17:30', 'Foyer des Jeunes de Kelle', 350, 215, 'Bureau Exécutif AJPK', 'Forum & Conférence'),
('Grande Campagne de Reboisement "Kelle Verte"', 'Plantation de 1 000 arbres fruitiers', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800', '2026-10-25', '08:00 - 14:00', 'Esplanade Mairie de Kelle', 200, 148, 'Commission Environnement', 'Environnement'),
('Hackathon & Concours Jeunes Créateurs', 'Challenge intensif de 48h sur les projets locaux', 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800', '2026-12-05', '08:30 - 18:00', 'Centre de Formation Professionnelle', 100, 76, 'Commission Économie', 'Innovation');

INSERT INTO public.formations (title, description, image_url, instructor, duration, level, start_date, max_spots, registered_count, price_fcfa) VALUES
('Développement Web & Compétences Numériques', 'Apprenez à concevoir des sites web dynamiques', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800', 'Moussa Diop', '6 semaines (60h)', 'Debutants', '2026-10-20', 30, 28, 0),
('Entrepreneuriat Rural & Business Plan', 'Montez votre dossier financier bancable', 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800', 'Aminata Ndiaye', '4 semaines (40h)', 'Tous niveaux', '2026-11-02', 40, 35, 5000),
('Installation Solaire & Énergies Renouvelables', 'Techniques de pose et dépannage photovoltaïque', 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&q=80&w=800', 'Cheikh Seck', '5 semaines (50h)', 'Intermediaire', '2026-11-10', 25, 25, 10000);
