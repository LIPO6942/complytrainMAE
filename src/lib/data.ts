import { 
    BadgeAmlExpert, 
    BadgeKycCertified,
    BadgeFraudDetector, 
    BadgeGdprPro, 
    BadgeSanctionsSpecialist,
    BadgeInsuranceExpert
} from "@/components/icons";

export const learningPath = [
  {
    title: 'Intégration Conformité',
    completion: 100,
    modules: [
      { title: 'Bases de la lutte contre le blanchiment d\'argent (LAB/FT)', status: 'terminé' },
      { title: 'Essentiels de la connaissance du client (KYC)', status: 'terminé' },
    ],
  },
  {
    title: 'Détection avancée de la fraude',
    completion: 40,
    modules: [
      { title: 'Scénarios de fraude numérique', status: 'terminé' },
      { title: 'Contrôles internes et rapports', status: 'en-cours' },
      { title: 'Études de cas sur la fraude d\'entreprise', status: 'non-commencé' },
    ],
  },
  {
    title: 'Certificat de réglementation des assurances',
    completion: 0,
    modules: [
      { title: 'Fondamentaux de la conformité en assurance', status: 'non-commencé' },
      { title: 'Rapports réglementaires pour les assureurs', status: 'non-commencé' },
    ],
  },
];


export const allBadges = [
  { id: 'lab-ft-fondements', name: 'Fondements LAB/FT', description: 'Quiz sur les bases institutionelles et législatives.', icon: BadgeAmlExpert, quizId: 'quiz-fondements-q' },
  { id: 'abr-kyc-maitrise', name: 'Maîtrise ABR & KYC', description: 'Quiz sur l\'approche basée sur les risques et KYC.', icon: BadgeKycCertified, quizId: 'quiz-abr-kyc-q'},
  { id: 'declarations-vigilance', name: 'Vigilance & Sanctions', description: 'Quiz sur les déclarations et sanctions.', icon: BadgeFraudDetector, quizId: 'quiz-declarations-sanctions-q'},
  { id: 'assurance-specifique', name: 'Expert Takaful', description: 'Quiz sur les assurances spécifiques.', icon: BadgeInsuranceExpert, quizId: 'quiz-assurances-specifiques-q' },
  { id: 'definitions-legales', name: 'Cadre Légal', description: 'Quiz sur les définitions et le cadre légal.', icon: BadgeGdprPro, quizId: 'quiz-definitions-q' },
  { id: 'phases-blanchiment', name: 'Phases du Blanchiment', description: 'Quiz sur les phases du blanchiment d\'argent.', icon: BadgeSanctionsSpecialist, quizId: 'quiz-phases-blanchiment-q'},
  { id: 'obligations-vigilance', name: 'Vigilance KYC', description: 'Quiz sur les obligations de vigilance.', icon: BadgeKycCertified, quizId: 'quiz-obligations-vigilance-q'},
  { id: 'beneficiaire-effectif', name: 'Expert BE & PPE', description: 'Quiz sur les Bénéficiaires Effectifs et PPE.', icon: BadgeAmlExpert, quizId: 'quiz-beneficiaire-effectif-ppe-q'},
  { id: 'listes-sanctions', name: 'Expert Sanctions', description: 'Quiz sur les listes de sanctions.', icon: BadgeSanctionsSpecialist, quizId: 'quiz-listes-sanctions-roles-q'},
  { id: 'fiche-kyc-maitrise', name: 'Maîtrise Fiche KYC', description: 'Quiz sur le remplissage de la fiche KYC.', icon: BadgeKycCertified, quizId: 'quiz-fiche-kyc-q' },
];

export const staticDepartments = [
    { id: 'tunis-nord', name: 'Délégation Tunis Nord' },
    { id: 'tunis-sud', name: 'Délégation Tunis Sud' },
    { id: 'tunis-centre', name: 'Délégation Tunis Centre' },
    { id: 'cap-bon', name: 'Délégation Cap bon' },
    { id: 'delegation-sud', name: 'Délégation Sud' },
    { id: 'delegation-sahel', name: 'Délégation Sahel' },
    { id: 'delegation-nord-ouest', name: 'Délégation Nord Ouest' },
];

export const reportingData = {
  completionRate: [
    { month: 'Janvier', desktop: 186, mobile: 80 },
    { month: 'Février', desktop: 305, mobile: 200 },
    { month: 'Mars', desktop: 237, mobile: 120 },
    { month: 'Avril', desktop: 73, mobile: 190 },
    { month: 'Mai', desktop: 209, mobile: 130 },
    { month: 'Juin', desktop: 214, mobile: 140 },
  ],
  successRate: [
    { name: 'Marketing', value: 92, fill: 'var(--color-chart-1)' },
    { name: 'Ventes', value: 85, fill: 'var(--color-chart-2)' },
    { name: 'Ingénierie', value: 95, fill: 'var(--color-chart-3)' },
    { name: 'Support', value: 88, fill: 'var(--color-chart-4)' },
    { name: 'Finance', value: 98, fill: 'var(--color-chart-5)' },
  ],
};

export const auditLogs = [
  { id: '1', user: 'Alex Dupont', action: 'Connecté', timestamp: '2024-07-31T10:00:00Z', details: 'IP source: 192.168.1.1' },
  { id: '2', user: 'Admin', action: 'Cours mis à jour: LAB-101', timestamp: '2024-07-31T09:30:00Z', details: 'Score de passage du quiz modifié à 85%.' },
  { id: '3', user: 'Alex Dupont', action: 'Module terminé: Essentiels KYC', timestamp: '2024-07-30T15:45:12Z', details: 'Score: 92%' },
  { id: '4', user: 'Carla', action: 'Rapport généré: Conformité trimestrielle', timestamp: '2024-07-30T11:20:05Z', details: 'Exporté en PDF.' },
  { id: '5', user: 'Alex Dupont', action: 'Échec au quiz: Détection avancée de la fraude', timestamp: '2024-07-29T14:00:00Z', details: 'Score: 55%' },
  { id: '6', user: 'Admin', action: 'Nouvel utilisateur ajouté: Ben', timestamp: '2024-07-29T09:05:00Z', details: 'Rôle: Apprenant, Département: Ventes' },
];
