


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
        id: 'guide-pratique-kyc',
        title: "Guide Pratique : Remplir la Fiche KYC",
        category: "KYC",
        description: "Un guide détaillé avec des études de cas pour maîtriser le remplissage de la fiche 'Connaissance du Client' selon les meilleures pratiques.",
        image: "course-kyc",
        isStatic: true,
        markdownContent: `
### **Introduction à la Fiche KYC (Know Your Customer)**
Cette fiche est un document essentiel pour toute institution financière. Elle permet de collecter les informations nécessaires sur un client afin d'évaluer les risques de blanchiment d'argent et de financement du terrorisme (BA/FT) associés. Un remplissage rigoureux est la première ligne de défense de votre institution.

---

### **Section 1 : Données Générales**
Cette section collecte les informations d'identification de base.

*   **Bonnes Pratiques :**
    *   Vérifiez toujours l'identité du client à l'aide d'un document officiel en cours de validité (Carte d'Identité Nationale, Passeport).
    *   Assurez-vous que le nom et le prénom correspondent exactement au document.
    *   La date et le lieu de naissance sont des informations cruciales pour éviter les homonymies.

---

### **Section 2 : Identifiant Capital et Revenus & Sources de Richesse**
L'objectif est de comprendre la situation financière globale du client.

*   **Bonnes Pratiques :**
    *   **Source des revenus :** Ne vous contentez pas de "Salaire". Précisez l'employeur et le secteur d'activité. Pour un indépendant, demandez la nature de son activité.
    *   **Source de la richesse :** Comment le client a-t-il accumulé son patrimoine ? (Héritage, vente d'un bien immobilier, revenus professionnels, etc.). Demandez des justificatifs pour les montants importants.
    *   **Cohérence :** Le capital et les revenus déclarés doivent être cohérents avec la profession et l'âge du client. Un jeune déclarant un patrimoine très élevé sans justification claire (héritage, etc.) représente un risque plus élevé.

---

### **Section 3 : Relation d'Affaires (Objet et Nature)**
C'est une section capitale pour l'évaluation du risque.

*   **Bonnes Pratiques :**
    *   Comprenez *pourquoi* le client a besoin de vos services. Est-ce pour une simple assurance auto ou pour des placements complexes à l'international ?
    *   Évaluez la complexité des opérations envisagées. Des virements internationaux fréquents vers des juridictions à risque augmentent le niveau de vigilance nécessaire.

*   **Étude de Cas n°1 (Risque Faible) :**
    *   **Client :** Salarié, résident local, profession non risquée (ex: enseignant).
    *   **Objet :** Souscrire une assurance habitation pour sa résidence principale.
    *   **Analyse :** La relation est simple, transparente et cohérente avec le profil du client. Le risque de BA/FT est faible. Une vigilance standard est suffisante.

*   **Étude de Cas n°2 (Risque Élevé) :**
    *   **Client :** Entrepreneur dans un secteur à forte circulation d'espèces (ex: BTP, restauration).
    *   **Objet :** Ouvrir un contrat de capitalisation avec des versements mensuels importants et des demandes de transferts vers des comptes à l'étranger.
    *   **Analyse :** Le secteur d'activité, les montants élevés et les transferts internationaux sont des signaux de risque. Une **vigilance renforcée** est impérative : demandez des justificatifs sur l'origine des fonds, documentez la logique économique des transferts, et identifiez précisément les bénéficiaires effectifs.

---

### **Section 4 : Personne Politiquement Exposée (PPE)**
L'identification des PPE est une obligation réglementaire stricte.

*   **Définition :** Une PPE est une personne qui exerce ou a exercé des fonctions publiques importantes. Le risque est que sa position puisse être utilisée pour du blanchiment d'argent ou de la corruption.
*   **Bonnes Pratiques :**
    *   Posez la question directement au client.
    *   Utilisez des bases de données spécialisées pour vérifier le statut de PPE.
    *   L'obligation de vigilance s'étend aux membres de la famille proche et aux associés connus.
    *   Si un client est identifié comme PPE, une **vigilance renforcée** et l'approbation d'un membre de la direction sont obligatoires avant de nouer la relation.

---

### **Section 5 : Bénéficiaire(s) Effectif(s)**
Il est crucial de savoir qui contrôle réellement les fonds ou l'entité.

*   **Bonnes Pratiques :**
    *   Pour une personne morale (entreprise), ne vous arrêtez pas au gérant. Identifiez toute personne physique détenant, directement ou indirectement, plus de 20% du capital ou des droits de vote.
    *   Si aucune personne ne dépasse ce seuil, identifiez la personne qui exerce un contrôle effectif sur la société.
    *   Documentez la structure de propriété avec un organigramme si nécessaire.

---

### **Conclusion**
Une fiche KYC bien remplie est votre meilleur atout de conformité. Elle doit raconter une histoire cohérente sur votre client. Chaque information doit être vérifiée, documentée et analysée. En cas de doute ou d'incohérence, n'hésitez jamais à demander des informations complémentaires. C'est votre responsabilité de protéger votre institution.`,
        quiz: {
            id: 'quiz-fiche-kyc-q',
            title: "Quiz : Maîtrise de la Fiche KYC",
            questions: [
                {
                    text: "Lors du remplissage de la section 'Données Générales', quelle est la meilleure pratique ?",
                    options: [
                        "Se fier aux informations déclarées par le client sans vérification.",
                        "Vérifier l'identité à l'aide d'un document officiel et s'assurer que les informations correspondent exactement.",
                        "Utiliser une copie simple du document d'identité fournie par e-mail.",
                        "Demander uniquement le nom et le numéro de téléphone."
                    ],
                    correctAnswers: [1]
                },
                {
                    text: "Un client déclare un patrimoine très élevé qui semble incohérent avec son âge et sa profession. Que devez-vous faire ?",
                    options: [
                        "Ignorer cette information car elle est d'ordre privé.",
                        "Accepter la déclaration sans poser de questions pour ne pas froisser le client.",
                        "Appliquer une vigilance renforcée et demander des justificatifs clairs sur l'origine de sa richesse.",
                        "Refuser immédiatement le client."
                    ],
                    correctAnswers: [2]
                },
                {
                    text: "Qu'est-ce qui est obligatoire si un client est identifié comme une Personne Politiquement Exposée (PPE) ?",
                    options: [
                        "Lui demander de fermer ses autres comptes bancaires.",
                        "Appliquer une vigilance renforcée et obtenir l'approbation de la direction avant de commencer la relation d'affaires.",
                        "Signaler systématiquement le client à la CTAF.",
                        "Lui proposer uniquement des produits à faible risque."
                    ],
                    correctAnswers: [1]
                }
            ]
        }
    },
    {
        id: 'quiz-fondements',
        title: "Quiz 1 : Fondements Institutionnels et Législatifs",
        category: "QCM (réponse multiple)",
        description: "Un quiz sur les fondements institutionnels et législatifs de la LBA/FT en Tunisie, y compris le rôle de la CTAF et du CGA.",
        image: "course-sanctions",
        isStatic: true,
        markdownContent: "Veuillez examiner les objectifs de ce quiz avant de commencer. Ce quiz porte sur les fondements institutionnels et législatifs de la LBA/FT en Tunisie, y compris le rôle de la Commission Tunisienne des Analyses Financières (CTAF) et du Comité Général des Assurances (CGA).",
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
                    text: "Le Comité Général des Assurances (CGA) est l'autorité de tutelle et de contrôle du secteur des assurances. Quelle est l'une de ses missions dans le cadre de la LAB/FT ?",
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
        markdownContent: "Veuillez examiner les objectifs de ce quiz avant de commencer. Ce quiz teste vos connaissances sur l'approche basée sur les risques (ABR), le KYC (Know Your Customer) et l'identification des bénéficiaires effectifs.",
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
        markdownContent: "Veuillez examiner les objectifs de ce quiz avant de commencer. Ce quiz porte sur les obligations de déclaration de soupçon (DS), la gestion des sanctions et la vigilance requise par les assujettis.",
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
        markdownContent: "Veuillez examiner les objectifs de ce quiz avant de commencer. Ce quiz porte sur les spécificités des assurances Takaful et le rôle des intermédiaires en assurance selon le Code des Assurances tunisien.",
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
    },
    {
        id: 'quiz-definitions-cadre-legal',
        title: "Quiz : Définitions et Cadre Légal",
        category: "QCM (réponse multiple)",
        description: "Un quiz sur les définitions clés et le cadre légal de la LBA/FT en Tunisie.",
        image: "course-aml",
        isStatic: true,
        markdownContent: "Veuillez examiner les objectifs de ce quiz avant de commencer. Ce quiz porte sur les définitions clés et le cadre légal de la LBA/FT en Tunisie.",
        quiz: {
            id: 'quiz-definitions-q',
            title: "Définitions et Cadre Légal",
            questions: [
                {
                    text: "Quelle est la loi organique fondamentale relative à la lutte contre le terrorisme et à la répression du blanchiment d'argent, telle que modifiée en 2019, qui sert de référence au dispositif réglementaire tunisien ?",
                    options: [
                        "Le Décret n°2016-1098 du 15 août 2016 fixant l'organisation de la CTAF.",
                        "La Loi organique n° 2015-26 du 7 août 2015, telle que modifiée et complétée par la loi organique n° 2019-9 du 23 janvier 2019.",
                        "Le Règlement du CGA n°2 du 28 août 2019.",
                        "L'Arrêté du Ministre des Finances du 24 juillet 2019 fixant les montants."
                    ],
                    correctAnswers: [1]
                },
                {
                    text: "Pour qu'un acte soit considéré comme du blanchiment d'argent en Tunisie (selon l'article 92 de la loi organique n°2015-26), l'origine illicite des biens doit provenir d'un crime ou d'un délit passible d'une peine d'emprisonnement de combien de temps au minimum ?",
                    options: [
                        "Un an ou plus.",
                        "Trois ans ou plus.",
                        "Six ans ou plus.",
                        "Dix ans ou plus."
                    ],
                    correctAnswers: [1]
                },
                {
                    text: "Quelle est la sanction d'emprisonnement prévue pour quiconque, même tenu au secret professionnel, s’abstient de signaler sans délai aux autorités compétentes des faits ou informations concernant la commission d’infractions terroristes ?",
                    options: [
                        "Six à douze ans d'emprisonnement.",
                        "Cinq à dix ans d'emprisonnement.",
                        "Un an à cinq ans d’emprisonnement et une amende de cinq mille à dix mille dinars.",
                        "Seize jours à six mois d'emprisonnement."
                    ],
                    correctAnswers: [2]
                }
            ]
        }
    },
    {
        id: 'quiz-phases-blanchiment',
        title: "Quiz : Les Phases du Blanchiment d'Argent",
        category: "QCM (réponse multiple)",
        description: "Ce quiz teste vos connaissances sur les trois phases distinctes du processus de blanchiment d'argent.",
        image: "course-fraud",
        isStatic: true,
        markdownContent: "Veuillez examiner les objectifs de ce quiz avant de commencer. Ce quiz teste vos connaissances sur les trois phases distinctes du processus de blanchiment d'argent.",
        quiz: {
            id: 'quiz-phases-blanchiment-q',
            title: "Les Phases du Blanchiment d'Argent",
            questions: [
                {
                    text: "Comment nomme-t-on la première phase du processus de blanchiment d’argent, qui consiste à introduire les sommes d'argent en espèces (produit des délits) dans le système financier ou économique ?",
                    options: [
                        "L’intégration (ou essorage).",
                        "L’empilage (ou dispersion).",
                        "La dissimulation.",
                        "Le placement (ou prélavage/immersion)."
                    ],
                    correctAnswers: [3]
                },
                {
                    text: "Quel est le terme utilisé pour désigner la phase du blanchiment d'argent qui vise à dissimuler la source illégitime des fonds en créant un enchevêtrement d’opérations financières complexes dans le but de brouiller la piste de vérification ?",
                    options: [
                        "Le prélavage.",
                        "L’empilage (ou dispersion/lavage/transformation).",
                        "L'intégration (ou recyclage).",
                        "Le transfert licite."
                    ],
                    correctAnswers: [1]
                },
                {
                    text: "La phase finale du blanchiment d'argent, appelée \"l’intégration\" (ou essorage), a pour objectif de :",
                    options: [
                        "Déclarer les fonds à la CTAF.",
                        "Réintroduire les fonds dont l’origine est masquée dans l’économie légale et les utiliser en toute liberté.",
                        "Transférer les fonds vers un pays à haut risque.",
                        "Convertir les actifs en crypto-monnaies."
                    ],
                    correctAnswers: [1]
                }
            ]
        }
    },
    {
        id: 'quiz-obligations-vigilance',
        title: "Quiz : Obligations de Vigilance (KYC) et Diligences",
        category: "QCM (réponse multiple)",
        description: "Évaluez votre compréhension des mesures de vigilance (KYC) et des diligences renforcées.",
        image: "course-kyc",
        isStatic: true,
        markdownContent: "Veuillez examiner les objectifs de ce quiz avant de commencer. Ce quiz évalue votre compréhension des mesures de vigilance (KYC) et des diligences renforcées.",
        quiz: {
            id: 'quiz-obligations-vigilance-q',
            title: "Obligations de Vigilance (KYC) et Diligences",
            questions: [
                {
                    text: "Selon le Règlement du CGA n°2019-02, dans quels cas spécifiques les compagnies d'assurance doivent-elles prendre des mesures de vigilance renforcée (Diligences Renforcées) ?",
                    options: [
                        "Uniquement pour les Personnes Politiquement Exposées (PPE).",
                        "Uniquement pour les clients dont la prime est payée en liquide et dépasse 5 000 TND.",
                        "Uniquement pour les clients à risque élevé selon la matrice des risques de l’entreprise.",
                        "Dans tous les cas ci-dessus (PPE, primes en liquide dépassant 5 000 TND, clients à risque élevé)."
                    ],
                    correctAnswers: [3]
                },
                {
                    text: "Pour les contrats d’assurance vie ou de capitalisation, à partir de quel seuil minimal de prime périodique (en l'absence de soupçon) les compagnies d'assurance sont-elles tenues de collecter les données du client (KYC) ?",
                    options: [
                        "Dépassant 3 000 TND.",
                        "Dépassant 1 000 TND.",
                        "Dépassant 5 000 TND.",
                        "Quel que soit le montant."
                    ],
                    correctAnswers: [1]
                },
                {
                    text: "Si, au moment de la souscription, le client ne peut présenter les documents d’identité originaux ou si les informations obligatoires de la fiche KYC sont manquantes, quelle est l'obligation du chargé de la souscription ?",
                    options: [
                        "Il peut accepter une copie certifiée conforme transmise par e-mail.",
                        "Il doit transmettre le dossier au responsable de la conformité pour une étude approfondie.",
                        "Il doit s’abstenir de souscrire le contrat d’assurance et envisager une déclaration de soupçon.",
                        "Il doit compléter la fiche KYC ultérieurement."
                    ],
                    correctAnswers: [2]
                }
            ]
        }
    },
    {
        id: 'quiz-beneficiaire-effectif-ppe',
        title: "Quiz : Bénéficiaire Effectif (BE) et PPE",
        category: "QCM (réponse multiple)",
        description: "Un quiz sur l'identification des Bénéficiaires Effectifs (BE) et des Personnes Politiquement Exposées (PPE).",
        image: "course-sanctions",
        isStatic: true,
        markdownContent: "Veuillez examiner les objectifs de ce quiz avant de commencer. Ce quiz porte sur l'identification des Bénéficiaires Effectifs (BE) et des Personnes Politiquement Exposées (PPE).",
        quiz: {
            id: 'quiz-beneficiaire-effectif-ppe-q',
            title: "Bénéficiaire Effectif (BE) et PPE",
            questions: [
                {
                    text: "Selon le Règlement du CGA n°2019-02, dans la première étape d'identification du Bénéficiaire Effectif (BE) d'une personne morale (Approche Mathématique), quel est le seuil minimum de détention (directe ou indirecte) du capital ou des droits de vote qui déclenche l'identification comme BE ?",
                    options: [
                        "10 % ou plus.",
                        "20 % ou plus.",
                        "30 % ou plus.",
                        "51 % ou plus."
                    ],
                    correctAnswers: [1]
                },
                {
                    text: "Une \"Personne Politiquement Exposée\" (PPE) inclut :",
                    options: [
                        "Le Chef d’État, le Chef du gouvernement ou un membre d’un gouvernement.",
                        "Les officiers militaires supérieurs.",
                        "Les membres d’un organe de direction, de contrôle ou d’administration d’une entreprise publique.",
                        "Toutes les réponses ci-dessus."
                    ],
                    correctAnswers: [3]
                },
                {
                    text: "En plus des mesures de vigilance renforcée sur les relations d'affaires avec les Personnes Politiquement Exposées (PPE), quelle action est requise selon le règlement CGA n°2019-02 ?",
                    options: [
                        "Informer le CGA uniquement.",
                        "Obtenir l’autorisation de la direction générale avant de nouer ou de poursuivre une relation d’affaire avec elles.",
                        "Déclarer systématiquement une suspicion à la CTAF.",
                        "S’assurer que le client n'a qu'une seule nationalité."
                    ],
                    correctAnswers: [1]
                }
            ]
        }
    },
    {
        id: 'quiz-listes-sanctions-roles',
        title: "Quiz : Listes de Sanctions et Rôles Institutionnels",
        category: "QCM (réponse multiple)",
        description: "Ce quiz couvre les listes de sanctions, le gel des avoirs et les rôles des différentes institutions de régulation.",
        image: "course-aml",
        isStatic: true,
        markdownContent: "Veuillez examiner les objectifs de ce quiz avant de commencer. Ce quiz couvre les listes de sanctions, le gel des avoirs et les rôles des différentes institutions de régulation.",
        quiz: {
            id: 'quiz-listes-sanctions-roles-q',
            title: "Listes de Sanctions et Rôles Institutionnels",
            questions: [
                {
                    text: "Quel organisme tunisien est le centre national chargé de la réception et de l’analyse des déclarations de soupçon (DS) et de leur transmission au Procureur de la République des déclarations dont l’analyse a confirmé le soupçon ?",
                    options: [
                        "Le Comité Général des Assurances (CGA).",
                        "La Commission Nationale de Lutte Contre le Terrorisme (CNLCT).",
                        "La Banque Centrale de Tunisie (BCT).",
                        "La Commission Tunisienne des Analyses Financières (CTAF)."
                    ],
                    correctAnswers: [3]
                },
                {
                    text: "La liste de sanctions établie par la Commission Nationale de Lutte Contre le Terrorisme (CNLCT) est qualifiée de :",
                    options: [
                        "Liste de surveillance.",
                        "Liste du Conseil de Sécurité des Nations Unies (NU).",
                        "Liste OFAC.",
                        "Liste nationale."
                    ],
                    correctAnswers: [3]
                },
                {
                    text: "L'obligation d'appliquer les mesures de gel des avoirs concernant les personnes et entités inscrites sur la liste onusienne ou nationale est une obligation de :",
                    options: [
                        "Résultats, dépendante du profil de risque du client.",
                        "Résultat, et doit être effectuée indépendamment du profil de risque du client.",
                        "Moyens, si l’entreprise a un faible niveau de risque.",
                        "Résultat, mais seulement pour les nouveaux clients."
                    ],
                    correctAnswers: [1]
                }
            ]
        }
    }
];


    

