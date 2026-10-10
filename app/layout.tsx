import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AJPK - Association de la Jeunesse Polyvalente de Kelle',
  description: 'Une jeunesse engagée, des compétences au service du développement. Écosystème numérique officiel de l’AJPK pour les membres, événements, formations, opportunités et projets à Kelle, Sénégal.',
  keywords: ['AJPK', 'Association de la Jeunesse Polyvalente de Kelle', 'Jeunesse de Kelle', 'Kelle', 'Sénégal', 'Formations', 'Emploi Jeunes', 'Projets Ruraux'],
  authors: [{ name: 'AJPK Tech Team' }],
  openGraph: {
    title: 'AJPK - Association de la Jeunesse Polyvalente de Kelle',
    description: 'Une jeunesse engagée, des compétences au service du développement.',
    url: 'https://ajpk.sn',
    siteName: 'AJPK Kelle',
    locale: 'fr_SN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen flex flex-col justify-between`}>
        <div>
          <Navbar />
          <main className="min-h-[calc(100vh-5rem)]">{children}</main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
