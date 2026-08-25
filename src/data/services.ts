/**
 * Services data — referenced by ServiceCard components and pages.
 * Extends this list as pages are built out.
 */

export interface Service {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  icon: string; // placeholder — replaced with actual icon in Phase 4
}

export const services: Service[] = [
  {
    id: 'seo-local',
    title: 'SEO Local',
    slug: '/services/seo-local/',
    shortDescription: 'Améliorez votre visibilité dans les recherches locales et sur Google Maps.',
    icon: 'map-pin',
  },
  {
    id: 'seo-technique',
    title: 'SEO Technique',
    slug: '/services/seo-technique/',
    shortDescription: 'Identifiez et corrigez les problèmes techniques qui freinent votre référencement.',
    icon: 'settings',
  },
  {
    id: 'seo-on-page',
    title: 'SEO On-Page',
    slug: '/services/seo-on-page/',
    shortDescription: 'Optimisez chaque page pour répondre à l\'intention de recherche de vos visiteurs.',
    icon: 'file-text',
  },
  {
    id: 'audit-seo',
    title: 'Audit SEO',
    slug: '/services/audit-seo/',
    shortDescription: 'Un diagnostic complet pour identifier les priorités d\'optimisation de votre site.',
    icon: 'search',
  },
  {
    id: 'accompagnement-seo',
    title: 'Accompagnement SEO',
    slug: '/services/accompagnement-seo/',
    shortDescription: 'Un suivi régulier pour faire évoluer votre stratégie SEO dans la durée.',
    icon: 'trending-up',
  },
];
