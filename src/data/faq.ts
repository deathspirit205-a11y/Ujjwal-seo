/**
 * FAQ data — used on homepage and individual service pages.
 * Answers are genuine and nuanced (see spec §9 and §24).
 */

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  /** Pages where this FAQ item appears */
  pages?: string[];
}

export const faqGeneral: FAQItem[] = [
  {
    id: 'combien-coute-seo',
    question: 'Combien coûte un accompagnement SEO ?',
    answer:
      'Le coût dépend de la portée du projet, de la concurrence dans votre secteur et de vos objectifs. Un accompagnement mensuel peut aller de quelques centaines à plusieurs milliers d\'euros. Je propose un premier échange gratuit pour comprendre votre situation avant tout engagement.',
    pages: ['home', 'accompagnement-seo'],
  },
  {
    id: 'combien-de-temps-resultats',
    question: 'Combien de temps faut-il pour voir des résultats ?',
    answer:
      'Le SEO est un investissement à moyen et long terme. Les premières améliorations peuvent apparaître en 3 à 6 mois, mais des résultats significatifs et durables demandent généralement 6 à 12 mois de travail régulier. Cela dépend fortement de l\'état actuel de votre site et de la concurrence.',
    pages: ['home', 'accompagnement-seo'],
  },
  {
    id: 'seo-petites-entreprises',
    question: 'Le SEO convient-il aux petites entreprises ?',
    answer:
      'Oui. Le SEO local est particulièrement adapté aux TPE, artisans et commerçants. Avec une stratégie ciblée sur votre zone géographique et votre secteur, il est possible de rivaliser efficacement sans budget publicitaire important.',
    pages: ['home', 'seo-local'],
  },
  {
    id: 'difference-seo-local',
    question: 'Quelle différence entre SEO local et SEO classique ?',
    answer:
      'Le SEO local vise à apparaître dans les résultats de recherche pour des requêtes géolocalisées ("plombier Rennes", "restaurant centre-ville"). Il inclut l\'optimisation de Google Business Profile, la cohérence de vos informations en ligne et la création de contenu local pertinent.',
    pages: ['home', 'seo-local'],
  },
  {
    id: 'pourquoi-audit-seo',
    question: 'Pourquoi réaliser un audit SEO ?',
    answer:
      'Un audit permet d\'identifier précisément ce qui freine votre visibilité : erreurs techniques, problèmes d\'indexation, contenu mal optimisé, maillage interne insuffisant. Sans diagnostic, on travaille à l\'aveugle. L\'audit est le point de départ de toute stratégie efficace.',
    pages: ['home', 'audit-seo'],
  },
];
