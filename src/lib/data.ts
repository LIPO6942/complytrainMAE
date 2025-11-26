export const user = {
  name: 'Alex Dupont',
  email: 'alex.dupont@example.com',
  avatarUrl: 'https://picsum.photos/seed/user/100/100',
  riskProfile: 'Completed AML and KYC training with quiz scores of 85% and 90% respectively. Had one minor incident of failing to report a suspicious transaction in a timely manner last quarter. New to the insurance sector.',
};

export const learningPath = [
  {
    title: 'Onboarding Compliance',
    completion: 100,
    modules: [
      { title: 'Anti-Money Laundering (AML) Basics', status: 'completed' },
      { title: 'Know Your Customer (KYC) Essentials', status: 'completed' },
    ],
  },
  {
    title: 'Advanced Fraud Detection',
    completion: 40,
    modules: [
      { title: 'Digital Fraud Scenarios', status: 'completed' },
      { title: 'Internal Controls and Reporting', status: 'in-progress' },
      { title: 'Case Studies in Corporate Fraud', status: 'not-started' },
    ],
  },
  {
    title: 'Insurance Regulation Certificate',
    completion: 0,
    modules: [
      { title: 'Insurance Compliance Fundamentals', status: 'not-started' },
      { title: 'Regulatory Reporting for Insurers', status: 'not-started' },
    ],
  },
];

export const earnedBadges = [
  { id: 'aml-expert', name: 'AML Expert', description: 'Mastered Anti-Money Laundering principles.' },
  { id: 'kyc-certified', name: 'KYC Certified', description: 'Completed all KYC modules successfully.' },
];

export const courses = [
  {
    id: 'aml-101',
    title: 'Anti-Money Laundering (AML) Basics',
    category: 'AML',
    image: 'course-aml',
    description: 'An introduction to Anti-Money Laundering principles and practices.'
  },
  {
    id: 'kyc-101',
    title: 'Know Your Customer (KYC) Essentials',
    category: 'KYC',
    image: 'course-kyc',
    description: 'Understanding Know Your Customer (KYC) regulations and procedures.'
  },
  {
    id: 'fraud-201',
    title: 'Advanced Fraud Detection',
    category: 'Fraude',
    image: 'course-fraud',
    description: 'Learn to identify and prevent various types of financial fraud.'
  },
  {
    id: 'gdpr-101',
    title: 'GDPR Compliance',
    category: 'Protection des données',
    image: 'course-gdpr',
    description: 'A comprehensive guide to the General Data Protection Regulation (GDPR).'
  },
  {
    id: 'sanctions-101',
    title: 'International Sanctions',
    category: 'Sanctions',
    image: 'course-sanctions',
    description: 'Navigating the complex world of international sanctions and compliance.'
  },
  {
    id: 'insurance-101',
    title: 'Insurance Regulation',
    category: 'Assurance',
    image: 'course-insurance',
    description: 'Core principles of insurance regulation and compliance requirements.'
  },
];

export const reportingData = {
  completionRate: [
    { month: 'January', desktop: 186, mobile: 80 },
    { month: 'February', desktop: 305, mobile: 200 },
    { month: 'March', desktop: 237, mobile: 120 },
    { month: 'April', desktop: 73, mobile: 190 },
    { month: 'May', desktop: 209, mobile: 130 },
    { month: 'Jun', desktop: 214, mobile: 140 },
  ],
  successRate: [
    { name: 'Marketing', value: 92, fill: 'var(--color-chart-1)' },
    { name: 'Sales', value: 85, fill: 'var(--color-chart-2)' },
    { name: 'Engineering', value: 95, fill: 'var(--color-chart-3)' },
    { name: 'Support', value: 88, fill: 'var(--color-chart-4)' },
    { name: 'Finance', value: 98, fill: 'var(--color-chart-5)' },
  ],
  heatmapData: [
    { user: 'Alice', 'AML': 95, 'KYC': 90, 'Fraude': 88, 'GDPR': 92, 'Sanctions': 85 },
    { user: 'Bob', 'AML': 75, 'KYC': 82, 'Fraude': 80, 'GDPR': 88, 'Sanctions': 70 },
    { user: 'Charlie', 'AML': 100, 'KYC': 98, 'Fraude': 95, 'GDPR': 99, 'Sanctions': 96 },
    { user: 'David', 'AML': 81, 'KYC': 78, 'Fraude': 65, 'GDPR': 70, 'Sanctions': 68 },
    { user: 'Eve', 'AML': 92, 'KYC': 91, 'Fraude': 89, 'GDPR': 94, 'Sanctions': 90 },
    { user: 'Frank', 'AML': 68, 'KYC': 72, 'Fraude': 75, 'GDPR': 80, 'Sanctions': 60 },
  ],
};

export const auditLogs = [
  { id: '1', user: 'Alex Dupont', action: 'Logged In', timestamp: '2024-07-31T10:00:00Z', details: 'Source IP: 192.168.1.1' },
  { id: '2', user: 'Admin', action: 'Updated Course: AML-101', timestamp: '2024-07-31T09:30:00Z', details: 'Changed quiz passing score to 85%.' },
  { id: '3', user: 'Alex Dupont', action: 'Completed Module: KYC Essentials', timestamp: '2024-07-30T15:45:12Z', details: 'Score: 92%' },
  { id: '4', user: 'Carla', action: 'Generated Report: Quarterly Compliance', timestamp: '2024-07-30T11:20:05Z', details: 'Exported as PDF.' },
  { id: '5', user: 'Alex Dupont', action: 'Failed Quiz: Advanced Fraud Detection', timestamp: '2024-07-29T14:00:00Z', details: 'Score: 55%' },
  { id: '6', user: 'Admin', action: 'Added New User: Ben', timestamp: '2024-07-29T09:05:00Z', details: 'Role: Learner, Department: Sales' },
];
