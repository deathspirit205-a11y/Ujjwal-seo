/**
 * Services data — aligned with the Consultant SEO & GEO architecture.
 * Refers to the 6 core service disciplines.
 */

export interface Service {
  id: 'seo-technique' | 'seo-contenu' | 'seo-local' | 'audit-seo' | 'strategie-seo' | 'geo';
  title: string;
  slug: string;
  category: 'SEO Fondamental' | 'SEO Stratégique' | 'GEO & IA';
  shortDescription: string;
  deliverables: string[];
}

export const services: Service[] = [
  {
    id: 'seo-technique',
    title: 'SEO Technique',
    slug: '/services/seo-technique/',
    category: 'SEO Fondamental',
    shortDescription: 'Crawl, indexation, architecture de site, performances web et données structurées pour lever tout blocage technique.',
    deliverables: ['Audit d\'explorabilité & indexation', 'Optimisation Core Web Vitals', 'Balisage Schema.org avancé'],
  },
  {
    id: 'seo-contenu',
    title: 'SEO Contenu & On-Page',
    slug: '/services/seo-contenu/',
    category: 'SEO Fondamental',
    shortDescription: 'Recherche d\'intention, maillage interne et optimisation sémantique pour que chaque page réponde précisément aux utilisateurs.',
    deliverables: ['Étude d\'intention de recherche', 'Arborescence & cocons sémantiques', 'Optimisation titres & balises'],
  },
  {
    id: 'seo-local',
    title: 'SEO Local & Territoire',
    slug: '/services/seo-local/',
    category: 'SEO Stratégique',
    shortDescription: 'Positionnement sur les requêtes géolocalisées, Google Maps, fiches d\'établissement et cohérence territoriale.',
    deliverables: ['Optimisation Google Business Profile', 'Citations & cohérence NAP', 'Pages d\'atterrissage locales'],
  },
  {
    id: 'audit-seo',
    title: 'Audit SEO Complet',
    slug: '/services/audit-seo/',
    category: 'SEO Stratégique',
    shortDescription: 'Diagnostic exhaustif de votre écosystème de recherche : technique, sémantique, concurrence et priorités d\'action concrètes.',
    deliverables: ['Rapport technique sans complaisance', 'Analyse concurrentielle', 'Plan d\'action hiérarchisé'],
  },
  {
    id: 'strategie-seo',
    title: 'Stratégie & Accompagnement',
    slug: '/services/strategie-seo/',
    category: 'SEO Stratégique',
    shortDescription: 'Vision continue, priorisation des chantiers à fort impact commercial et pilotage régulier des performances.',
    deliverables: ['Feuille de route trimestrielle', 'Suivi de positions & conversions', 'Conseil stratégique direct'],
  },
  {
    id: 'geo',
    title: 'GEO — Generative Engine Optimization',
    slug: '/services/geo/',
    category: 'GEO & IA',
    shortDescription: 'Préparation et structuration de vos entités pour être comprises et citées comme source de confiance par les IA (Perplexity, ChatGPT, AI Overviews).',
    deliverables: ['Clarté d\'entités & autorité de source', 'Optimisation sémantique pour LLM', 'Audit de citation dans les synthèses IA'],
  },
];
