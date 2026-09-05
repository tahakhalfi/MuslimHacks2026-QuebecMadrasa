# Service — Assistant IA parent et file de génération

## Promesse

Le parent peut demander une explication claire de la situation d'un enfant, puis demander un contenu pédagogique personnalisé. L'IA analyse uniquement les données autorisées et toute création longue passe dans une file de travaux contrôlée par le parent.

## Ce que l'IA peut faire

- résumer la progression d'un enfant sur une période;
- repérer les notions qui semblent difficiles à partir des preuves disponibles;
- proposer des actions concrètes pour la semaine;
- expliquer une notion au parent;
- créer un brouillon de cours, d'exercices ou de révision;
- recommander une ressource déjà approuvée;
- afficher les sources et la date des données utilisées.

## Ce qu'elle ne doit pas faire

- diagnostiquer un trouble ou remplacer un professionnel;
- déclarer automatiquement qu'un enfant a échoué;
- modifier le calendrier ou assigner un devoir sans validation parent;
- envoyer un message à un enfant sans autorisation explicite;
- inventer une note, une preuve ou une exigence du Québec;
- donner une fatwa ou une certitude juridique.

## Pages

1. `Assistant IA` — discussion texte et bouton micro, enfant sélectionné, période et sources autorisées.
2. `Analyse de l'enfant` — progression, forces, points à revoir, preuves et limites de confiance.
3. `File de génération` — travaux en attente, en cours, à valider, terminés ou échoués.
4. `Révision du contenu` — aperçu du cours, objectifs, durée, exercices, réponses et sources.
5. `Paramètres IA` — crédits, consentements, durée de conservation, données accessibles.

## Flux principal

```text
Parent demande un cours
  → serveur vérifie le rôle, l'enfant et les crédits
  → création d'un generation_job = queued
  → worker récupère le job et appelle les outils autorisés
  → génération d'un brouillon structuré
  → validation automatique de sécurité et de cohérence
  → job = review_required
  → parent approuve, modifie ou rejette
  → seulement après approbation : ajout manuel au plan de la semaine
```

La réponse courte de l'IA peut être immédiate. Une demande de cours, de série d'exercices ou de rapport est toujours un travail asynchrone afin de ne pas bloquer l'interface et de contrôler les coûts.

## Outils serveur autorisés

Ces outils sont appelés par le backend, jamais directement par le navigateur. Chaque appel doit vérifier `parent_id`, `child_id`, permissions et journal d'accès.

| Outil | Rôle | Lecture/écriture |
|---|---|---|
| `get_child_learning_snapshot` | progression récente, matières, activités | lecture |
| `get_skill_evidence` | preuves liées à une compétence | lecture |
| `get_week_plan` | tâches prévues et temps disponible | lecture |
| `get_quebec_requirement_status` | état des éléments suivis dans le parcours | lecture |
| `search_approved_lessons` | trouver du contenu validé | lecture |
| `create_generation_job` | déposer un cours ou rapport dans la file | écriture contrôlée |
| `get_generation_job` | état, résultat, coût, erreurs | lecture |
| `approve_generated_content` | approuver et publier le brouillon | écriture contrôlée |
| `cancel_generation_job` | annuler un travail avant publication | écriture contrôlée |

Les outils ne donnent pas à l'IA accès à la base complète, aux mots de passe, aux paiements, aux conversations privées ou à la position précise d'une famille.

## Contrat minimal de `generation_jobs`

```text
id
parent_id
child_id nullable
type: lesson | exercises | weekly_report | explanation
request_text
status: queued | running | review_required | approved | rejected | failed | cancelled
priority
input_snapshot_ids[]
output_document_id nullable
credits_reserved
model_version
attempt_count
error_code nullable
created_at, started_at, completed_at
approved_by nullable
```

## Règles de la file

- une demande crée un seul job idempotent grâce à `request_id`;
- les jobs sont isolés par famille et ne peuvent pas lire les données d'une autre famille;
- les crédits sont réservés à la création, puis remboursés si le job échoue;
- priorité normale pour un cours, priorité basse pour un rapport lourd;
- trois tentatives maximum puis statut `failed` avec message compréhensible;
- aucune publication automatique dans le calendrier;
- le parent peut annuler un job `queued` ou `running`;
- le résultat conserve le modèle, les sources, la version du prompt et les contrôles effectués.

## Format du brouillon généré

```json
{
  "title": "Fractions — révision guidée",
  "audience": "child",
  "age_or_level": "à confirmer",
  "objectives": ["Comparer deux fractions"],
  "estimated_minutes": 25,
  "lesson_blocks": [],
  "practice_questions": [],
  "answer_key": [],
  "source_ids": [],
  "warnings": [],
  "requires_parent_review": true
}
```

## Interface de la page

- sidebar parent à gauche : Accueil, Plan, Cours, Assistant IA, Communauté, Portfolio, Budget;
- zone centrale : conversation et boutons de demandes rapides;
- panneau droit : état de la famille et `File de génération`;
- carte de job avec statut, progression, crédits estimés et bouton `Annuler`;
- après génération : boutons `Modifier`, `Approuver`, `Rejeter`, `Ajouter au plan`;
- design vert clair, vert profond et crème, sans diagnostic visuel ni statistiques inventées.

## MVP réellement faisable

1. chat texte parent;
2. trois outils de lecture : snapshot, preuves, plan de semaine;
3. un outil d'écriture : créer un job;
4. une file simple avec worker et statuts;
5. génération d'un cours de révision;
6. validation humaine par le parent;
7. ajout manuel au calendrier;
8. journal des sources et des crédits.

La voix, l'avatar et l'analyse prédictive avancée viennent après la fiabilité du flux texte. Ils ne doivent pas être nécessaires au MVP.

## Critères d'acceptation

- une demande de cours apparaît dans la file en moins de deux secondes;
- le parent voit clairement si l'IA lit des données insuffisantes;
- aucun cours généré ne rejoint le plan sans approbation;
- un job échoué ne débite pas définitivement le parent;
- deux familles ne peuvent pas accéder aux mêmes preuves;
- chaque résultat affiche ses sources et un avertissement si l'information est incertaine.
