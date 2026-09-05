# Résumé des changements — branche `update` vs `main`

Ce document résume les changements apportés localement par rapport à la version `main` du dépôt. Il couvre le correctif de la landing page, la mise en place du parcours d'inscription (P02), la refonte du tableau de bord parent (P03) et le raccordement des deux.

## 1. Landing page — navigation mobile et bascule de langue

- **Menu mobile** : en dessous de 900px, la barre de navigation affichait ses liens en `display: none` sans aucune alternative. Ajout d'un bouton hamburger (`☰`/`✕`) qui ouvre un panneau avec les ancres de section, le sélecteur de langue et les boutons Connexion/Commencer.
- **Sélecteur de langue déplacé dans la barre de navigation** (desktop et menu mobile), au lieu du pied de page uniquement — conforme à l'intention documentée ("bascule de langue prévue dans la navbar").
- **Persistance de la langue** : le choix FR/EN est maintenant sauvegardé dans `localStorage` (`madrasa-locale`) et restauré au rechargement. Un bug d'hydratation React (le second `useEffect` écrasait la valeur restaurée par le premier) a été corrigé avec un flag `hydrated`.
- Les boutons « Commencer gratuitement » / « Créer mon parcours » redirigent maintenant vers `/parent/onboarding` au lieu de `/parent` directement, conformément au parcours documenté *Landing → Onboarding → Dashboard*.

## 2. Nouvelle page P02 — Inscription famille (`/parent/onboarding`)

Aucune maquette de référence n'existait pour cette page ; elle a été construite à partir des règles visuelles du projet et des contrats de données partagés.

- Assistant en **3 étapes** : Famille (prénom du parent, nom de famille, juridiction, année scolaire) → Enfants (ajout/retrait, prénom, tranche d'âge, niveau) → Consentement (3 cases obligatoires : responsabilité légale, validation des contenus IA, limite du module Parcours Québec).
- Validation par étape avec messages d'erreur clairs ; état de succès avec redirection vers le tableau de bord.
- Nouveau contrat de domaine `src/domain/family.ts` (`Family`, `Child`, `createFamily`, `createChild`) et route API `POST /api/onboarding`.
- À la création, la famille et les enfants sont sauvegardés dans `localStorage` (`madrasa-family`) pour être réutilisés par les autres pages.

## 3. Refonte de P03 — Tableau de bord parent (`/parent`)

L'ancienne page était un mock 100 % statique en français uniquement, sans aucune action fonctionnelle. Elle a été reconstruite pour correspondre à la maquette `06-tableau-bord-parent.png` et remplir son contrat (« enfants, tâches, alertes, progression | ouvrir tâche, filtrer enfant, changer langue »).

- **Filtrer par enfant** : boutons « Toute la famille / [enfant] » qui filtrent les cartes de progression, le fil d'activité et les tâches.
- **Ouvrir une tâche** : chaque tâche ouvre une fenêtre de détail avec une action de confirmation (marquer comme validé/ajouté/réservé), qui met à jour en direct le compteur de tâches en attente et l'alerte d'échéance.
- **Changer de langue** : sélecteur FR/EN dans la barre latérale, partageant la même clé `localStorage` que la landing page.
- Progression hebdomadaire par enfant avec liste de matières et anneau de complétion calculé (CSS `conic-gradient`), au lieu de pourcentages codés en dur.
- Mini-calendrier du mois en cours calculé dynamiquement (au lieu d'une image statique).
- Nouveau contrat de domaine `src/domain/parent-dashboard.ts` (`ParentTask`, `markTaskDone`, `pendingCount`, `visibleForChild`, `computeProgress`).
- **Correction d'un bug préexistant** (non lié à cette tâche mais découvert pendant les tests mobiles) : le logo de la barre latérale ne rétrécissait pas quand celle-ci se réduit à 78px sur mobile, débordant sur le contenu de la page — corrigé sur `/parent` et `/student`.

## 4. Raccordement onboarding → tableau de bord

Les deux pages ci-dessus étaient développées indépendamment et ne communiquaient pas : le tableau de bord affichait toujours les données de démonstration (« Amine », « Famille Ghorbel », « Adam », « Sara ») quelle que soit la famille réellement créée.

- Ajout du champ **prénom du parent** à l'étape 1 de l'inscription (absent auparavant, alors que le tableau de bord salue le parent par son prénom).
- Le tableau de bord lit maintenant `localStorage` (`madrasa-family`) et affiche les vraies données : salutation, nom de famille, initiales, filtres par enfant, cartes de progression, et textes des tâches/activités (désormais généralisés avec le vrai prénom de l'enfant au lieu d'être codés en dur sur « Adam »/« Sara »).
- Si aucune famille n'est enregistrée (ex. accès direct via « Se connecter »), le tableau de bord retombe sur la famille de démonstration d'origine.

## Fichiers principaux modifiés/ajoutés

```
app/page.tsx                      landing : menu mobile, langue en navbar, persistance
app/globals.css                   styles pour tout ce qui précède
app/parent/page.tsx                refonte complète du tableau de bord
app/parent/onboarding/page.tsx     nouvelle page d'inscription
app/api/onboarding/route.ts        nouvelle route API
src/domain/family.ts               nouveau contrat Family/Child
src/domain/parent-dashboard.ts     nouveau contrat ParentTask + helpers
```

## Vérifications effectuées

`npm run typecheck` et `npm run build` passent sans erreur. Chaque fonctionnalité a été testée dans un navigateur réel (Playwright) : navigation mobile, persistance de langue, parcours d'inscription complet (validations, erreurs, succès), filtrage par enfant, ouverture/validation de tâches, et le flux bout en bout inscription → tableau de bord avec des données de famille personnalisées — sans erreur console, en français et en anglais, en largeur desktop et mobile.

## Non inclus dans cette version

Une tentative d'ajout de la page **Plan de la semaine** (`/parent/plan`, P04) a été faite puis **annulée à la demande de l'utilisateur** ; elle n'apparaît donc pas dans cette branche.
