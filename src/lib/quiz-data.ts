export type Question = {
    text: string;
    options: string[];
    correctAnswers: number[];
};

export type QuizData = {
    id: string;
    title: string;
    questions: Question[];
};

export type Course = {
    id: string;
    title: string;
    category: string;
    description: string;
    image: string;
    videoUrl?: string;
    pdfUrl?: string;
    markdownContent?: string;
    quizId?: string;
    quiz?: QuizData;
    isStatic?: boolean;
};

export const staticCourses: Course[] = [
    {
        id: 'quiz-fondements',
        title: "Quiz 1 : Fondements Institutionnels et Législatifs",
        category: "QCM (réponse multiple)",
        description: "Un quiz sur les fondements institutionnels et législatifs de la LBA/FT en Tunisie, y compris le rôle de la CTAF et du CGA.",
        image: "course-sanctions",
        isStatic: true,
        quiz: {
            id: 'quiz-fondements-q',
            title: "Fondements Institutionnels et Législatifs",
            questions: [
                {
                    text: "Quel est le rôle principal de la Commission Tunisienne des Analyses Financières (CTAF) ?",
                    options: [
                        "Assurer la tutelle et le contrôle du secteur des assurances pour garantir la solidité financière des entreprises.",
                        "Instituer les règlements relatifs aux mesures de vigilance dans le secteur des assurances.",
                        "Être le centre national chargé de la réception, de l'analyse des déclarations de soupçon (DS) et de la transmission au procureur de la République des déclarations dont l'analyse a confirmé le soupçon.",
                        "Fixer les taux de redevances annuelles payées par les entreprises d'assurances."
                    ],
                    correctAnswers: [2]
                },
                {
                    text: "La CTAF est instituée par l'article 118 de quelle loi organique ?",
                    options: [
                        "La loi n° 92-24 du 9 mars 1992 portant promulgation du Code des Assurances.",
                        "La loi organique n° 2015-26 du 7 août 2015 relative à la lutte contre le terrorisme et à la répression du blanchiment d'argent, telle que modifiée et complétée par la loi organique n° 2019-9 du 23 janvier 2019.",
                        "La loi n° 2000-98 du 31 décembre 2000 portant loi de finances pour l'année 2001, relative à la création du Fonds de Garantie des Assurés.",
                        "La loi n° 94-9 du 31 janvier 1994 relative à la responsabilité et au contrôle technique dans le domaine de la construction."
                    ],
                    correctAnswers: [1]
                },
                {
                    text: "Le Comité Général des Assurances (CGA) est l'autorité de tutelle et de contrôle du secteur des assurances. Quelle est l'une de ses missions dans le cadre de la LBA/FT ?",
                    options: [
                        "Assurer la représentation de la Tunisie auprès du GAFI (Groupe d'action financière).",
                        "Superviser les banques et les établissements de microfinance.",
                        "Contrôler les entreprises d’assurances et les entreprises de réassurance, veillant à la protection des droits des assurés et à la solidité de l'assise financière des entreprises.",
                        "Décider du gel des biens et avoirs des personnes ou entités figurant sur la liste nationale."
                    ],
                    correctAnswers: [2]
                }
            ]
        }
    },
    {
        id: 'quiz-abr-kyc',
        title: "Quiz 2 : L'Approche Basée sur les Risques (ABR) et KYC",
        category: "QCM (réponse multiple)",
        description: "Testez vos connaissances sur l'approche basée sur les risques (ABR), le KYC (Know Your Customer) et l'identification des bénéficiaires effectifs.",
        image: "course-kyc",
        isStatic: true,
        quiz: {
            id: 'quiz-abr-kyc-q',
            title: "ABR et KYC",
            questions: [
                {
                    text: "Selon l'Approche Basée sur les Risques (ABR) et les lignes directrices du CGA, quels sont les quatre facteurs de risque inhérent que les sociétés d'assurance doivent prendre en compte lors de l'évaluation des risques de BA/FT ?",
                    options: [
                        "Risque de réputation, Risque juridique, Risque financier, Risque réglementaire.",
                        "Solvabilité, Faisabilité, Qualification des dirigeants, Structure du capital.",
                        "Clients et leurs activités, Contrats et services d'assurance, Pays et zones géographiques, Réseaux de distribution et techniques de vente.",
                        "Opérations d'acceptation, Opérations de cession, Transferts de devises, Créances relatives aux cessions."
                    ],
                    correctAnswers: [2]
                },
                {
                    text: "Quel est le seuil minimum de détention (directe ou indirecte) du capital ou des droits de vote utilisé pour identifier le Bénéficiaire Effectif (BE) d'une personne morale, selon les réglementations en vigueur ?",
                    options: ["10 % ou plus.", "20 % ou plus.", "30 % ou plus.", "50 % ou plus."],
                    correctAnswers: [1]
                },
                {
                    text: "Après la fin du contrat d’assurance, pendant combien de temps au minimum les sociétés d'assurance et de réassurance doivent-elles conserver les dossiers de leurs clients (pièces d’identité, contrats, opérations) ?",
                    options: ["5 ans.", "7 ans.", "10 ans au moins.", "15 ans."],
                    correctAnswers: [2]
                }
            ]
        }
    },
    {
        id: 'quiz-declarations-sanctions',
        title: "Quiz 3 : Déclarations, Sanctions et Vigilance",
        category: "QCM (réponse multiple)",
        description: "Un quiz sur les obligations de déclaration de soupçon (DS), la gestion des sanctions et la vigilance requise par les assujettis.",
        image: "course-fraud",
        isStatic: true,
        quiz: {
            id: 'quiz-declarations-sanctions-q',
            title: "Déclarations, Sanctions et Vigilance",
            questions: [
                {
                    text: "Dans quels cas le correspondant de la CTAF d'une entreprise d'assurance doit-il procéder à une Déclaration de Soupçon (DS) ?",
                    options: [
                        "Lorsque l'opération ou la transaction ne revêt aucune justification économique ou licite apparente.",
                        "Lorsque les informations d’identification sont manifestement fictives.",
                        "Lorsque le client ou le bénéficiaire effectif est sur la liste onusienne ou nationale ou toute autre liste obligatoire.",
                        "Toutes les réponses ci-dessus."
                    ],
                    correctAnswers: [3]
                },
                {
                    text: "Quel est le délai maximum dont dispose un assujetti pour informer la Commission Nationale de Lutte Contre le Terrorisme (CNLCT) après la publication ou la notification d'une modification des listes de sanctions (onusiennes ou nationales) ?",
                    options: [
                        "Sans délai, au plus tard dans les 8 heures suivant la publication ou la notification.",
                        "24 heures.",
                        "7 jours.",
                        "Un mois."
                    ],
                    correctAnswers: [0]
                },
                {
                    text: "Les sociétés d'assurance et de réassurance sont tenues de vérifier systématiquement leurs clients et leurs bénéficiaires effectifs par rapport aux listes de sanctions onusiennes et nationales. Cette obligation de filtrage :",
                    options: [
                        "Est une mesure dilatoire, dépendante du profil de risque du client.",
                        "Constitue une obligation de résultat et non une simple obligation de moyens.",
                        "S'applique uniquement aux clients à haut risque.",
                        "Est facultative si l'entreprise dispose d'une matrice des risques de faible niveau."
                    ],
                    correctAnswers: [1]
                }
            ]
        }
    },
    {
        id: 'quiz-assurances-specifiques',
        title: "Quiz 4 : Assurances Spécifiques et Contrats",
        category: "QCM (réponse multiple)",
        description: "Ce quiz porte sur les spécificités des assurances Takaful et le rôle des intermédiaires en assurance selon le Code des Assurances tunisien.",
        image: "course-insurance",
        isStatic: true,
        quiz: {
            id: 'quiz-assurances-specifiques-q',
            title: "Assurances Spécifiques et Contrats",
            questions: [
                {
                    text: "Qu'est-ce qui caractérise le régime d'Assurance Takaful ?",
                    options: [
                        "Il s'agit d'un régime où l'entreprise est tenue de verser une prestation pécuniaire en contrepartie d'une prime.",
                        "Il s'agit d'un régime contractuel où les adhérents s'engagent à s'entraider via une cotisation en guise de donation, et où le \"fonds des adhérents\" est totalement séparé des comptes de l'entreprise.",
                        "Il s'agit uniquement d'une assurance contre les accidents du travail.",
                        "Les entreprises d'assurance Takaful peuvent cumuler leurs activités avec les activités d'assurances conventionnelles."
                    ],
                    correctAnswers: [1]
                },
                {
                    text: "Dans le cadre de l'Assurance Takaful, sur quelle base contractuelle l'entreprise gère-t-elle les opérations de placement des cotisations des adhérents ?",
                    options: [
                        "Le contrat de Mandat (Wakala).",
                        "Le contrat de Prêt sans intérêt.",
                        "Le contrat de Commande (Moudharaba).",
                        "Le contrat de Réassurance Takaful."
                    ],
                    correctAnswers: [2]
                },
                {
                    text: "Qui est considéré comme un intermédiaire en assurance selon l'article 69 du Code des Assurances, en Tunisie ?",
                    options: [
                        "Les courtiers d'assurances, les agents d'assurances, les producteurs en assurance sur la vie.",
                        "Les banques, l'Office National des Postes, et les institutions de microfinance, lorsqu'ils concluent des contrats au nom d'une entreprise d'assurance.",
                        "Les experts-comptables, les notaires, et les agents immobiliers.",
                        "Les réponses A et B sont correctes."
                    ],
                    correctAnswers: [3]
                }
            ]
        }
    }
];
