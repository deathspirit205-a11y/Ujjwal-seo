/**
 * Services data — structured to eliminate duplication between Homepage and /services/ Hub.
 *
 * - Homepage uses: title, slug, category, homeSummary, businessBenefit.
 * - /services/ Hub uses: the full 12-dimension specification (meaning, problemsSolved,
 *   whoNeedsIt, included, howPerformed, toolsAndMethods, deliverables, successMetrics,
 *   commonMistakes, faqs, relatedLinks).
 */

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServiceRelatedLink {
  label: string;
  href: string;
  type: 'service' | 'blog' | 'method' | 'local';
}

export interface Service {
  id: 'audit-seo' | 'seo-technique' | 'seo-contenu' | 'seo-local' | 'strategie-seo' | 'geo';
  title: string;
  slug: string;
  category: 'Diagnostic & Stratégie' | 'SEO Fondamental' | 'Ancrage Local' | 'GEO & Moteurs IA';
  /** Concise 1-sentence summary for Homepage cards */
  shortDescription: string;
  /** Main business benefit displayed on Homepage cards */
  businessBenefit: string;
  /** Short deliverable tags */
  deliverables: string[];
  /** Detailed 12-point breakdown for the /services/ comprehensive hub */
  detail: {
    meaning: string;
    problemsSolved: string[];
    whoNeedsIt: string;
    included: string[];
    howPerformed: string;
    toolsAndMethods: string[];
    expectedDeliverables: string[];
    successMetrics: string[];
    commonMistakes: string[];
    faqs: ServiceFAQ[];
    relatedLinks: ServiceRelatedLink[];
    externalRef?: { label: string; url: string };
  };
}

export const services: Service[] = [
  {
    id: 'audit-seo',
    title: 'Audit SEO Complet',
    slug: '/services/audit-seo/',
    category: 'Diagnostic & Stratégie',
    shortDescription: 'Examen méthodique de l\'indexation, de l\'architecture, des contenus et de la concurrence de votre site.',
    businessBenefit: 'Identifier avec certitude ce qui freine votre visibilité et investir uniquement sur les actions à fort impact.',
    deliverables: ['Diagnostic technique & sémantique', 'Benchmark concurrentiel', 'Plan d\'action priorisé (P1/P2/P3)'],
    detail: {
      meaning: 'L\'audit SEO est l\'examen clinique complet de votre site web et de son environnement concurrentiel. Plutôt qu\'une liste brute d\'erreurs exportée d\'un logiciel automatisé, il s\'agit d\'un diagnostic croisé (technique, éditorial, popularité et visibilité IA) traduit en décisions commerciales.',
      problemsSolved: [
        'Stagnation ou baisse inexpliquée du trafic organique malgré la publication de contenus.',
        'Pages stratégiques (services, produits) indexées mais absentes de la première page de Google.',
        'Perte de visibilité à la suite d\'une refonte, d\'un changement de CMS ou d\'une migration de domaine.',
        'Absence de visibilité face à des concurrents pourtant moins établis sur votre marché.',
      ],
      whoNeedsIt: 'Les dirigeants de PME, responsables marketing ou équipes techniques qui veulent comprendre précisément pourquoi leur site ne génère pas assez de demandes entrantes avant d\'engager un budget d\'accompagnement ou une refonte.',
      included: [
        'Analyse du crawl, de l\'indexation réelle dans Google Search Console et du budget d\'exploration.',
        'Contrôle de l\'architecture des URLs, de la profondeur de clic et du maillage interne.',
        'Mesure des performances web (Core Web Vitals : LCP, INP, CLS) sur mobile et ordinateur.',
        'Évaluation sémantique des pages clés, détection de la cannibalisation et des contenus faibles.',
        'Vérification du balisage Schema.org (JSON-LD) et de l\'extractibilité pour les moteurs IA (GEO).',
        'Étude comparative de 3 à 5 concurrents directs positionnés sur vos requêtes cibles.',
      ],
      howPerformed: 'Je réalise un crawl complet du site tel que Googlebot l\'explore, puis je croise ces données avec vos statistiques réelles dans Google Search Console. Chaque anomalie est vérifiée manuellement dans le code source avant d\'être classée selon son impact réel sur votre chiffre d\'affaires et sa complexité de mise en œuvre.',
      toolsAndMethods: [
        'Google Search Console (analyse de couverture d\'index, requêtes et CTR réel)',
        'Screaming Frog SEO Spider (exploration complète de l\'arborescence et des codes HTTP)',
        'PageSpeed Insights, Lighthouse & Chrome DevTools (diagnostic LCP, INP, CLS et rendu DOM)',
        'Schema Markup Validator & Rich Results Test (validation du graphe d\'entités JSON-LD)',
      ],
      expectedDeliverables: [
        'Document de synthèse stratégique lisible par la direction comme par les développeurs.',
        'Feuille de route opérationnelle priorisée en 3 niveaux (P1 Bloquant, P2 Fort levier, P3 Optimisation).',
        'Fichier d\'inventaire URL par URL (redirections, balises, statuts d\'indexation, pages à fusionner).',
        'Visioconférence de restitution d\'une heure avec session de questions-réponses.',
      ],
      successMetrics: [
        'Résolution des erreurs d\'indexation et hausse du ratio de pages utiles indexées.',
        'Progression des impressions et des positions sur les requêtes commerciales ciblées à 3 et 6 mois.',
        'Clarté opérationnelle : votre équipe sait exactement quoi corriger et dans quel ordre.',
      ],
      commonMistakes: [
        'Se fier uniquement à un score automatique en ligne (souvent superficiel et hors contexte métier).',
        'Corriger des centaines de détails mineurs (balises alt d\'icônes) en ignorant un blocage d\'architecture majeur.',
        'Commander un audit de 80 pages sans prévoir le temps ou l\'accompagnement nécessaire pour appliquer les correctifs.',
      ],
      faqs: [
        {
          question: 'En combien de temps un audit SEO complet est-il livré ?',
          answer: 'Il faut compter entre 10 et 14 jours ouvrés à partir de l\'accès à votre Google Search Console, suivis d\'une séance de restitution détaillée.',
        },
        {
          question: 'Pouvez-vous appliquer vous-même les correctifs après l\'audit ?',
          answer: 'Oui. Selon votre CMS et votre organisation, je peux soit implémenter directement les optimisations, soit rédiger les spécifications techniques pour votre développeur et valider la mise en production.',
        },
      ],
      relatedLinks: [
        { label: 'Guide complet : pourquoi faire un audit SEO et comment l\'interpréter', href: '/blog/audit-seo-guide-complet/', type: 'blog' },
        { label: 'SEO Technique : assainir les fondations du site', href: '/services/seo-technique/', type: 'service' },
        { label: 'Voir un aperçu interactif de livrable d\'audit', href: '/realisations/', type: 'method' },
      ],
      externalRef: {
        label: 'Documentation officielle Google Search Central — Guide de démarrage SEO',
        url: 'https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=fr',
      },
    },
  },
  {
    id: 'seo-technique',
    title: 'SEO Technique',
    slug: '/services/seo-technique/',
    category: 'SEO Fondamental',
    shortDescription: 'Optimisation du crawl, de l\'indexation, de la vitesse (Core Web Vitals) et des données structurées Schema.org.',
    businessBenefit: 'Garantir que Google et les robots IA explorent, comprennent et chargent vos pages sans aucun frein.',
    deliverables: ['Assainissement crawl & indexation', 'Core Web Vitals (LCP, INP, CLS)', 'Graphe JSON-LD Schema.org'],
    detail: {
      meaning: 'Le SEO technique regroupe l\'ensemble des optimisations structurelles et serveur qui permettent aux moteurs de recherche (Googlebot, Bingbot) et aux robots d\'IA (OAI-SearchBot, PerplexityBot) d\'explorer, de rendre et d\'indexer vos pages efficacement.',
      problemsSolved: [
        'Pages importantes marquées « Détectée, actuellement non indexée » ou « Explorée, actuellement non indexée ».',
        'Lenteurs de chargement sur mobile qui dégradent l\'expérience utilisateur et le taux de conversion.',
        'Dilution du budget de crawl dans des filtres à facettes, paramètres d\'URL ou pages dupliquées.',
        'Chutes de trafic lors d\'une refonte de site faute de plan de redirection 301 rigoureux.',
      ],
      whoNeedsIt: 'Les sites e-commerce, les sites vitrines ayant accumulé de la dette technique, les entreprises préparant une refonte web, ou tout site dont les contenus de qualité peinent à se positionner à cause de freins structurels.',
      included: [
        'Configuration et nettoyage des fichiers robots.txt, sitemaps XML et en-têtes HTTP.',
        'Gestion des balises canonical, des chaînes de redirections 301 et des erreurs 404/410.',
        'Optimisation des Core Web Vitals : chargement du LCP (≤ 2,5 s), réactivité INP (≤ 200 ms) et stabilité CLS (≤ 0,1).',
        'Conception et déploiement d\'un graphe de données structurées JSON-LD interconnecté via @id.',
        'Accompagnement de migration / refonte : recette pré-production et surveillance post-mise en ligne.',
      ],
      howPerformed: 'J\'analyse la manière dont votre serveur et votre code front-end répondent aux robots d\'indexation. Nous éliminons les ressources bloquantes, nettoyons les URLs inutiles et structurons l\'arborescence pour que chaque page stratégique reçoive un maximum de signal interne.',
      toolsAndMethods: [
        'Rapport d\'indexation et statistiques d\'exploration Google Search Console',
        'Chrome User Experience Report (CrUX) & PageSpeed Insights',
        'Screaming Frog & analyse des journaux/entêtes serveur',
        'Spécifications Schema.org et validateurs JSON-LD',
      ],
      expectedDeliverables: [
        'Cahier des charges technique précis et actionnable (ou intervention directe sur le code/CMS).',
        'Plan de redirection 301 complet en cas de refonte ou de nettoyage d\'URLs.',
        'Scripts JSON-LD sur mesure prêts à intégrer (Organization, ProfessionalService, Service, Article, FAQPage).',
        'Rapport de contrôle après déploiement validant la résolution des anomalies.',
      ],
      successMetrics: [
        'Réduction drastique des pages exclues par erreur dans la Search Console.',
        'Passage au vert des Core Web Vitals sur mobile et desktop.',
        'Indexation rapide des nouvelles pages publiées et stabilité des positions après refonte.',
      ],
      commonMistakes: [
        'Lancer une refonte graphique sans mapper les anciennes URLs vers les nouvelles (perte immédiate d\'historique SEO).',
        'Empiler les extensions ou scripts tiers lourds qui paralysent le temps de réponse mobile (INP).',
        'Bloquer par erreur des fichiers CSS/JS indispensables au rendu de la page dans le robots.txt.',
      ],
      faqs: [
        {
          question: 'Le SEO technique suffit-il à lui seul pour être premier sur Google ?',
          answer: 'Non : le SEO technique est une condition nécessaire mais non suffisante. Il lève les freins et permet à vos pages de concourir à armes égales, mais c\'est la pertinence du contenu et l\'autorité du domaine qui font la différence finale.',
        },
        {
          question: 'Sur quels CMS et technologies intervenez-vous ?',
          answer: 'J\'interviens sur WordPress, Shopify, Webflow ainsi que sur les architectures modernes (Astro, Next.js, sites statiques et sur-mesure).',
        },
      ],
      relatedLinks: [
        { label: 'Comprendre et améliorer vos scores Core Web Vitals', href: '/blog/core-web-vitals-2025/', type: 'blog' },
        { label: 'Maillage interne : la stratégie sous-estimée', href: '/blog/maillage-interne-strategie-seo/', type: 'blog' },
        { label: 'Audit SEO complet : diagnostiquer votre site', href: '/services/audit-seo/', type: 'service' },
      ],
      externalRef: {
        label: 'Documentation web.dev (Google) — Comprendre les Core Web Vitals',
        url: 'https://web.dev/articles/vitals?hl=fr',
      },
    },
  },
  {
    id: 'seo-contenu',
    title: 'SEO Contenu & Sémantique',
    slug: '/services/seo-contenu/',
    category: 'SEO Fondamental',
    shortDescription: 'Architecture éditoriale, étude d\'intentions de recherche, rédaction structurée et maillage interne thématique.',
    businessBenefit: 'Attirer des visiteurs qui cherchent précisément vos solutions et les convaincre grâce à des contenus de référence.',
    deliverables: ['Cartographie d\'intentions & mots-clés', 'Cocons sémantiques & maillage', 'Optimisation on-page & briefs'],
    detail: {
      meaning: 'Le SEO éditorial et sémantique consiste à aligner l\'architecture et le contenu de votre site sur la manière réelle dont vos futurs clients formulent leurs besoins — des requêtes transactionnelles directes aux questions complexes posées aux moteurs IA.',
      problemsSolved: [
        'Trafic non qualifié qui génère des visites d\'information mais aucune prise de contact.',
        'Plusieurs pages du site qui se concurrencent sur le même mot-clé (cannibalisation sémantique).',
        'Pages de services trop courtes ou génériques qui ne démontrent pas votre maîtrise du sujet.',
        'Articles de blog isolés qui ne transmettent aucune autorité vers vos pages commerciales.',
      ],
      whoNeedsIt: 'Les entreprises B2B et B2C dont le savoir-faire réel est supérieur à ce que montre leur site actuel, et qui souhaitent transformer leurs pages en véritables arguments commerciaux disponibles 24h/24.',
      included: [
        'Recherche approfondie de mots-clés et classification par intention (informationnelle, commerciale, locale).',
        'Conception de l\'arborescence éditoriale (pages piliers, pages enfants et articles de support).',
        'Rédaction de briefs SEO détaillés (structure H1-H3, entités à couvrir, questions utilisateurs, sources).',
        'Réécriture et optimisation on-page des balises title, méta-descriptions, chapôs et contenus existants.',
        'Mise en place d\'un maillage interne stratégique avec des ancres descriptives et naturelles.',
      ],
      howPerformed: 'J\'analyse les pages actuellement classées en tête sur vos requêtes stratégiques ainsi que les données de votre Search Console pour identifier les écarts de couverture thématique (« content gaps »). Chaque contenu est structuré pour offrir une réponse directe, documentée et supérieure aux résultats génériques.',
      toolsAndMethods: [
        'Analyse des SERP Google et extraction des intentions réelles (People Also Ask, entités associées)',
        'Google Search Console (requêtes à fort potentiel en positions 5 à 20)',
        'Structuration en grappes thématiques (topic clusters) et maillage en silo ouvert',
        'Rédaction orientée E-E-A-T et réponses extractibles pour le GEO',
      ],
      expectedDeliverables: [
        'Matrice complète mots-clés / intentions / URLs cibles (sans doublon ni cannibalisation).',
        'Plan de publication éditorial priorisé selon le retour sur investissement attendu.',
        'Briefs rédactionnels complets ou textes optimisés prêts à intégrer.',
        'Schéma de maillage interne reliant articles conseils et pages de conversion.',
      ],
      successMetrics: [
        'Hausse du taux de clic (CTR) dans les résultats de recherche grâce à des balises title et meta travaillées.',
        'Augmentation du nombre de mots-clés qualifiés positionnés dans le Top 10 et Top 3.',
        'Taux d\'engagement et de conversion accru des visiteurs issus de la recherche organique.',
      ],
      commonMistakes: [
        'Publier en masse des textes générés par IA sans relecture métier ni valeur ajoutée originale.',
        'Répéter mécaniquement un mot-clé exact dans chaque paragraphe au détriment de la lisibilité.',
        'Créer dix petites pages quasi identiques au lieu d\'une page de référence complète et structurée.',
      ],
      faqs: [
        {
          question: 'Rédigez-vous les textes vous-même ou accompagnez-vous nos équipes ?',
          answer: 'Les deux formules sont possibles : je peux rédiger ou réécrire directement vos pages stratégiques, ou fournir des briefs précis à vos équipes internes et assurer la relecture SEO finale.',
        },
        {
          question: 'Faut-il obligatoirement tenir un blog pour réussir son SEO ?',
          answer: 'Pas toujours. La priorité absolue reste la qualité et la profondeur de vos pages de services ou de catégories. Le blog intervient ensuite pour capter les questions en amont du parcours d\'achat et renforcer l\'autorité thématique de vos pages commerciales.',
        },
      ],
      relatedLinks: [
        { label: 'Guide pratique : rédiger vos balises title et méta-descriptions', href: '/blog/balises-title-meta-description-guide/', type: 'blog' },
        { label: 'Maillage interne : structurer vos liens pour le SEO', href: '/blog/maillage-interne-strategie-seo/', type: 'blog' },
        { label: 'GEO : rendre vos contenus citables par les IA', href: '/services/geo/', type: 'service' },
      ],
      externalRef: {
        label: 'Google Search Central — Créer un contenu utile, fiable et axé sur l\'humain',
        url: 'https://developers.google.com/search/docs/fundamentals/creating-helpful-content?hl=fr',
      },
    },
  },
  {
    id: 'seo-local',
    title: 'SEO Local & Territoire',
    slug: '/services/seo-local/',
    category: 'Ancrage Local',
    shortDescription: 'Visibilité sur Google Maps (Pack Local), fiche Google Business Profile et pages d\'ancrage territorial en Bretagne et Grand Ouest.',
    businessBenefit: 'Être visible au moment précis où un prospect de votre bassin géographique cherche votre prestation.',
    deliverables: ['Optimisation Google Business Profile', 'Cohérence NAP & citations locales', 'Pages locales à valeur ajoutée'],
    detail: {
      meaning: 'Le SEO local regroupe les techniques permettant à une entreprise d\'apparaître simultanément dans le Pack Local Google Maps (les 3 établissements affichés avec la carte), dans les résultats organiques géolocalisés et dans les recommandations locales des moteurs IA.',
      problemsSolved: [
        'Entreprise invisible sur Google Maps alors qu\'elle est implantée ou intervient activement sur sa zone.',
        'Concurrents moins qualifiés qui captent l\'essentiel des appels locaux grâce à une fiche mieux renseignée.',
        'Informations contradictoires (nom, adresse, téléphone) dispersées sur les annuaires professionnels.',
        'Site web qui ne mentionne pas clairement son périmètre d\'intervention (Rennes, Vitré, Laval, Fougères, etc.).',
      ],
      whoNeedsIt: 'Les PME régionales, cabinets de conseil, professions libérales, artisans, commerces et entreprises de services B2B qui tirent tout ou partie de leur clientèle d\'un territoire précis (Ille-et-Vilaine, Mayenne, Loire-Atlantique, Bretagne).',
      included: [
        'Audit et optimisation complète de votre fiche Google Business Profile (catégories primaire et secondaires, services, attributs, description, médias).',
        'Harmonisation de la cohérence NAP (Nom, Adresse, Téléphone) et inscriptions ciblées sur les annuaires locaux et sectoriels légitimes.',
        'Création ou refonte de pages locales utiles, documentées et propres à chaque bassin économique (sans pages satellites dupliquées).',
        'Mise en place d\'une méthode simple et conforme pour collecter et répondre aux avis clients.',
        'Déploiement du balisage Schema.org LocalBusiness / ProfessionalService avec areaServed précis.',
      ],
      howPerformed: 'J\'analyse la concurrence sur le Pack Local de votre zone de chalandise et je vérifie l\'alignement entre votre fiche Google Business Profile et les pages de votre site. Nous construisons des signaux géographiques authentiques (ancrage économique local, références régionales, maillage territorial).',
      toolsAndMethods: [
        'Google Business Profile Manager & suivi des interactions locales (appels, itinéraires, clics)',
        'Google Search Console (filtrage des requêtes géolocalisées par ville et département)',
        'Audit de cohérence des citations locales (PagesJaunes, CCI, annuaires métiers, France Num)',
        'Balisage Schema.org géo-structuré relié aux entités Wikidata des communes',
      ],
      expectedDeliverables: [
        'Fiche Google Business Profile entièrement optimisée et sécurisée.',
        'Guide interne de collecte et de réponse aux avis clients.',
        'Pages d\'intervention locale rédigées sur mesure et reliées à vos pages de services.',
        'Tableau de suivi mensuel des impressions locales, appels et demandes d\'itinéraire.',
      ],
      successMetrics: [
        'Progression de la visibilité sur les requêtes « métier + ville » (ex. Rennes, Vitré, Laval, Fougères).',
        'Augmentation mesurable des appels téléphoniques, clics vers le site et demandes de contact locaux.',
        'Renforcement durable de la réputation en ligne grâce à des avis clients réguliers et authentiques.',
      ],
      commonMistakes: [
        'Générer des dizaines de pages « ville » copiées-collées en changeant uniquement le nom de la commune (pratique pénalisée par Google).',
        'Bourrer le nom de sa fiche Google Business Profile de mots-clés artificiels (risque élevé de suspension de la fiche).',
        'Laisser sa fiche sans activité ni réponse aux avis pendant plusieurs mois.',
      ],
      faqs: [
        {
          question: 'Je n\'ai pas de boutique ouverte au public, puis-je quand même faire du SEO local ?',
          answer: 'Tout à fait. Google Business Profile permet de configurer une entreprise en mode « zone de service » (Service Area Business) sans afficher d\'adresse de réception, tout en renforçant votre ancrage territorial sur votre site web.',
        },
        {
          question: 'Faut-il créer une page par ville autour de son entreprise ?',
          answer: 'Uniquement pour les pôles économiques où vous avez une véritable légitimité d\'intervention et où vous pouvez apporter un contenu spécifique. Mieux vaut 5 à 7 pages locales solides et documentées que 50 pages vides.',
        },
      ],
      relatedLinks: [
        { label: 'Guide complet du SEO local pour les entreprises en Bretagne', href: '/blog/guide-seo-local-bretagne/', type: 'blog' },
        { label: 'Consultant SEO à Rennes : accompagnement local', href: '/zones-intervention/seo-rennes/', type: 'local' },
        { label: 'Découvrir toutes les zones d\'intervention (Grand Ouest)', href: '/zones-intervention/', type: 'local' },
      ],
      externalRef: {
        label: 'Aide officielle Google Business Profile — Améliorer votre classement local sur Google',
        url: 'https://support.google.com/business/answer/7091?hl=fr',
      },
    },
  },
  {
    id: 'strategie-seo',
    title: 'Stratégie & Accompagnement SEO',
    slug: '/services/strategie-seo/',
    category: 'Diagnostic & Stratégie',
    shortDescription: 'Pilotage mensuel, feuille de route trimestrielle et exécution continue pour inscrire votre croissance organique dans la durée.',
    businessBenefit: 'Disposer d\'un bras droit SEO dédié qui transforme la stratégie en résultats concrets mois après mois, sans effet tunnel.',
    deliverables: ['Feuille de route trimestrielle', 'Mise en œuvre & suivi mensuel', 'Reporting orienté conversions'],
    detail: {
      meaning: 'La stratégie et l\'accompagnement SEO consistent à piloter votre visibilité organique dans la durée. Une fois le diagnostic posé, j\'accompagne votre entreprise mois après mois pour déployer les optimisations techniques, produire les contenus stratégiques, développer l\'autorité du domaine et ajuster le tir selon les résultats réels.',
      problemsSolved: [
        'Manque de temps ou de compétence interne pour appliquer les recommandations d\'un audit SEO.',
        'Actions SEO ponctuelles et décousues qui ne produisent aucun effet cumulatif.',
        'Difficulté à arbitrer entre les chantiers techniques, la création de contenu et le développement de notoriété.',
        'Absence de visibilité claire sur le retour sur investissement des efforts marketing.',
      ],
      whoNeedsIt: 'Les PME et ETI qui souhaitent faire de la recherche organique (Google et moteurs IA) un canal d\'acquisition prévisible et rentable, avec un consultant senior impliqué à leurs côtés sans la lourdeur d\'une grande agence.',
      included: [
        'Définition de la feuille de route trimestrielle alignée sur vos priorités commerciales et saisonnières.',
        'Mise en œuvre opérationnelle mensuelle (optimisations on-page, création/enrichissement de pages, maillage interne).',
        'Développement éthique de l\'autorité (relations partenaires, citations métier, contenus de référence Linkbaiting).',
        'Suivi mensuel des indicateurs clés (impressions, clics qualifiés, positions stratégiques, demandes de contact).',
        'Point d\'étape régulier en direct avec moi et support réactif tout au long du mois.',
      ],
      howPerformed: 'Chaque trimestre, nous fixons des objectifs précis et réalistes. Chaque mois, j\'exécute les chantiers prioritaires convenus, je contrôle l\'impact des actions précédentes dans la Search Console et je vous présente un bilan clair : ce qui a été fait, ce qui progresse et les priorités du mois suivant.',
      toolsAndMethods: [
        'Méthode A.R.C. (Accessibilité technique, Pertinence & Entités, Citations & Autorité)',
        'Suivi continu Google Search Console & Analytics',
        'Matrice de priorisation Impact Business vs. Effort d\'implémentation',
        'Veille algorithmique Google et évolution des moteurs IA',
      ],
      expectedDeliverables: [
        'Feuille de route SEO & GEO partagée et mise à jour en continu.',
        'Livrables mensuels concrets (pages optimisées, briefs, correctifs techniques, balisage).',
        'Compte-rendu mensuel synthétique focalisé sur le trafic qualifié et les opportunités commerciales.',
        'Point téléphonique ou visioconférence mensuel d\'analyse et de décision.',
      ],
      successMetrics: [
        'Croissance régulière du trafic organique hors marque sur vos pages à forte valeur commerciale.',
        'Augmentation du volume et de la qualité des prises de contact (formulaires, appels, devis).',
        'Consolidation durable de vos positions face aux évolutions algorithmiques.',
      ],
      commonMistakes: [
        'Arrêter tout effort SEO au bout de deux mois alors que l\'effet cumulatif commence tout juste à opérer.',
        'Sous-traiter à un prestataire qui envoie un rapport automatique mensuel sans jamais modifier une seule page du site.',
        'Acheter des packs de liens artificiels bon marché qui exposent le domaine à une pénalité durable.',
      ],
      faqs: [
        {
          question: 'Imposez-vous un engagement de 12 ou 24 mois ?',
          answer: 'Non. Bien que le SEO demande légitimement 3 à 6 mois pour produire son plein effet, je privilégie des cycles trimestriels clairs : la confiance se renouvelle par la qualité du travail accompli, pas par un contrat verrouillé.',
        },
        {
          question: 'Quelle différence avec l\'accompagnement d\'une agence SEO ?',
          answer: 'Vous travaillez directement avec le consultant qui réalise l\'analyse et les optimisations. Il n\'y a ni commercial intermédiaire, ni transfert de votre dossier à un profil junior.',
        },
      ],
      relatedLinks: [
        { label: 'Consultant SEO vs Agence SEO : comment choisir ?', href: '/blog/consultant-seo-vs-agence-comment-choisir/', type: 'blog' },
        { label: 'Découvrir ma méthodologie de travail en 8 étapes', href: '/approche/', type: 'method' },
        { label: 'Audit SEO : le point de départ d\'une stratégie solide', href: '/services/audit-seo/', type: 'service' },
      ],
    },
  },
  {
    id: 'geo',
    title: 'GEO — Visibilité Moteurs IA',
    slug: '/services/geo/',
    category: 'GEO & Moteurs IA',
    shortDescription: 'Optimisation de vos contenus et de votre graphe d\'entités pour être compris et cité par ChatGPT, Perplexity et Google AI.',
    businessBenefit: 'Faire reconnaître votre entreprise comme une source fiable lorsque vos futurs clients interrogent une intelligence artificielle.',
    deliverables: ['Audit de présence & citations IA', 'Graphe d\'entités Schema.org & llms.txt', 'Structuration éditoriale pour RAG'],
    detail: {
      meaning: 'Le GEO (Generative Engine Optimization) consiste à structurer les informations, les preuves d\'expertise et les données techniques de votre site pour que les moteurs de réponse génératifs (ChatGPT Search, Perplexity, Google AI Overviews, Claude, Gemini) comprennent exactement qui vous êtes, ce que vous proposez et puissent vous citer comme référence.',
      problemsSolved: [
        'Marque ou entreprise absente des réponses lorsque des prospects demandent des recommandations à ChatGPT ou Perplexity.',
        'Informations erronées ou obsolètes restituées par les modèles d\'IA au sujet de vos prestations.',
        'Contenus rédigés de manière trop vague pour être extraits par les systèmes RAG (Retrieval-Augmented Generation).',
        'Entité d\'entreprise mal définie (absence de liens entre le site, le dirigeant, la zone géographique et les profils officiels).',
      ],
      whoNeedsIt: 'Les entreprises B2B, cabinets d\'expertise, acteurs technologiques et PME ambitieuses dont les clients comparent désormais les prestataires en posant des questions détaillées aux assistants IA.',
      included: [
        'Audit de perception IA : test méthodique des réponses générées sur un panel de requêtes métier et locales.',
        'Construction d\'un graphe d\'entités Schema.org complet et interconnecté (Organization, Person, Service, FAQPage, sameAs).',
        'Mise en place et structuration d\'un fichier /llms.txt propre facilitant la lecture de votre offre par les agents IA.',
        'Restructuration éditoriale des pages clés : définitions explicites, données factuelles sourcées, tableaux comparatifs et FAQ précises.',
        'Renforcement de la cohérence des mentions externes (co-citations, profils professionnels, annuaires de référence).',
      ],
      howPerformed: 'Le GEO ne remplace pas le SEO : il s\'appuie dessus. Les moteurs IA utilisent l\'index web (Bing, Google, crawlers dédiés) pour récupérer leurs sources (RAG). Je vérifie d\'abord que vos pages sont parfaitement accessibles aux bots IA, puis je structure vos contenus et vos données JSON-LD pour éliminer toute ambiguïté sémantique.',
      toolsAndMethods: [
        'Tests d\'extraction et de citation sur ChatGPT Search, Perplexity, Claude et Gemini',
        'Architecture JSON-LD avancée avec identifiants persistants (@id) et liens Wikidata',
        'Standard émergent /llms.txt et contrôle des règles robots.txt pour OAI-SearchBot / PerplexityBot',
        'Ingénierie éditoriale orientée réponses directes et preuves vérifiables (E-E-A-T)',
      ],
      expectedDeliverables: [
        'État des lieux initial de la visibilité et de la compréhension de votre marque par les moteurs IA.',
        'Graphe JSON-LD complet et fichier /llms.txt déployés sur votre domaine.',
        'Recommandations de restructuration éditoriale appliquées à vos pages stratégiques.',
        'Plan de développement des signaux de confiance et citations externes.',
      ],
      successMetrics: [
        'Validation sans erreur du graphe d\'entités par les outils de test Schema.org.',
        'Amélioration de la précision avec laquelle les moteurs IA décrivent votre entreprise et vos services.',
        'Progression des visites qualifiées issues des moteurs génératifs et des recherches conversationnelles longues.',
      ],
      commonMistakes: [
        'Croire qu\'il est possible de « garantir » une citation fixe dans ChatGPT alors que les réponses des LLMs sont probabilistes.',
        'Négliger le SEO fondamental : un site non indexé sur Google et Bing ne sera jamais récupéré en temps réel par les moteurs IA.',
        'Bloquer aveuglément tous les robots IA dans le fichier robots.txt tout en espérant être recommandé par eux.',
      ],
      faqs: [
        {
          question: 'Peut-on garantir que ChatGPT recommandera systématiquement mon entreprise ?',
          answer: 'Non, et aucun professionnel sérieux ne peut le promettre : les modèles de langage génèrent des réponses probabilistes qui varient selon le contexte de l\'utilisateur. En revanche, structurer vos entités, vos preuves et votre SEO augmente fortement vos chances d\'être sélectionné comme source fiable.',
        },
        {
          question: 'Faut-il choisir entre SEO et GEO ?',
          answer: 'Non, les deux sont indissociables. Le SEO assure votre indexation, votre autorité et vos positions sur Google ; le GEO rend vos pages immédiatement compréhensibles et synthétisables par les moteurs IA qui puisent dans ces mêmes résultats.',
        },
      ],
      relatedLinks: [
        { label: 'Article de fond : SEO vs GEO, comprendre la complémentarité', href: '/blog/seo-vs-geo/', type: 'blog' },
        { label: 'SEO Contenu & Sémantique : structurer vos pages', href: '/services/seo-contenu/', type: 'service' },
        { label: 'Inspecter l\'architecture GEO de ujjwal-seo.com (/llms.txt & JSON-LD)', href: '/realisations/', type: 'method' },
      ],
      externalRef: {
        label: 'Spécification officielle Schema.org — Structuration des entités sur le Web',
        url: 'https://schema.org/docs/gs.html',
      },
    },
  },
];
