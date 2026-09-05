# Mission développeur — Parcours Québec de bout en bout

## Prompt à copier-coller au développeur

```text
Tu travailles sur MuslimHacks2026-QuebecMadrasa. Ta mission est de construire uniquement le module “Parcours Québec” pour les parents, de bout en bout, en local.

Lis obligatoirement avant de coder :
- README.md
- docs/architecture/00-architecture-globale.md
- docs/architecture/01-stack-local.md
- docs/architecture/03-conformite-quebec.md
- docs/architecture/04-securite-et-donnees.md
- docs/architecture/05-internationalisation-fr-en.md
- docs/plan/02-pages-navigation.md
- dev-teammate/01-quebec-compliance-agent.md
- docs/plan/services/10-auth-securite-enfants.md si présent

Construis une première version réaliste, locale, bilingue français/anglais, sans vraie base cloud, sans clé API et sans dépôt automatique au gouvernement.

Le parent doit pouvoir :
1. ouvrir /parent/parcours-quebec;
2. sélectionner un enfant et une année scolaire;
3. voir les exigences dans une timeline claire;
4. voir les dates importantes;
5. remplir un brouillon de projet d’apprentissage;
6. sauvegarder l’état localement ou via une API mock;
7. voir les champs manquants;
8. générer un export brouillon téléchargeable;
9. marquer le document “vérifié par le parent”;
10. voir un avertissement disant que l’export doit être vérifié et transmis manuellement.

Dates à gérer : avis annuel au plus tard le 1er juillet; projet d’apprentissage au plus tard le 30 septembre; avis dans les 10 jours après un départ d’école en cours d’année; projet dans les 30 jours suivant ce départ; état de situation et bilan mi-parcours entre le 3e et le 5e mois; rencontre de suivi pendant l’année; bilan final au plus tard le 15 juin; portfolio au plus tard le 15 juin; autres conclusions d’évaluation au plus tard le 30 juin.

Le module doit séparer jurisdiction, school_year, requirement_definition, family_submission et evidence. Les dates ne doivent pas être dispersées dans les composants.

L’UI doit respecter le thème vert/crème, la sidebar parent à gauche, le logo officiel et le design simple du projet. La page doit avoir : un résumé en haut, une timeline, une checklist, un formulaire par sections, une zone de documents et une carte d’export.

Tous les textes visibles doivent exister en français et en anglais. Le français est la langue par défaut. Le switcher doit fonctionner sans rechargement et les dates doivent respecter la langue.

Ne construis pas l’authentification, la vraie IA, le portfolio complet, la classe live ou les paiements. Ne change pas la landing et ne refais pas le dashboard parent. Tu peux seulement remplacer le href “Parcours Québec” dans app/parent/page.tsx pour pointer vers /parent/parcours-quebec.

Ajoute des tests de domaine pour les échéances et vérifie le parcours dans le navigateur. Termine par npm run typecheck et npm run build.
``` 

## Pourquoi cette mission est séparée

Le parcours Québec est un module métier complet : calendrier réglementaire, formulaire, preuves, export et états de validation. Il ne doit pas être mélangé au tuteur IA, à la classe live ou à la landing.

## Périmètre de fichiers autorisés

- `app/parent/parcours-quebec/page.tsx`;
- `app/api/quebec/route.ts`;
- `src/domain/quebec-requirements.ts`;
- `src/domain/quebec-deadlines.ts`;
- `src/domain/quebec-export.ts`;
- `components/quebec/*`;
- `app/globals.css`, uniquement les classes préfixées `.quebec-`;
- `app/parent/page.tsx`, uniquement pour changer le lien Parcours Québec;
- tests liés au module;
- documentation technique du module dans `docs/architecture`.

## Fichiers interdits

- `app/page.tsx` — landing et switcher bilingue;
- `app/student/*` — espace élève;
- `docs/plan/services/04-tuteur-ia-eleve.md` — tuteur;
- `docs/plan/services/12-classes-collaboratives.md` — classes live;
- `src/domain/ai-generation-job.ts` — file IA;
- `src/domain/parent-ai-tools.ts` — outils IA;
- logo et assets UI;
- authentification et paiement.

## Modèle métier minimal

```ts
type RequirementStatus = "todo" | "draft" | "parent_verified" | "exported" | "manually_submitted";

type QuebecRequirement = {
  id: string;
  jurisdiction: "quebec";
  schoolYear: string;
  titleFr: string;
  titleEn: string;
  descriptionFr: string;
  descriptionEn: string;
  dueDate?: string;
  windowStart?: string;
  windowEnd?: string;
  sourceUrl: string;
  status: RequirementStatus;
};
```

## Critères de réussite

- le parent comprend la prochaine action en moins de 10 secondes;
- chaque date affiche sa source et son année scolaire;
- aucune page ne dit que la famille est automatiquement “conforme”;
- un export indique toujours `Brouillon préparé avec l'aide de la plateforme — vérification parentale requise`;
- les champs manquants sont explicites;
- le parcours français/anglais fonctionne;
- `npm run typecheck` et `npm run build` passent;
- une capture navigateur en français et en anglais accompagne la PR.
