# Mission développeur — Dashboard parent bilingue

## Objectif unique

Rendre uniquement la page `/parent` disponible en français et en anglais, sans modifier la landing, l’espace élève ou les classes live.

## À lire avant de commencer

1. `README.md`
2. `docs/architecture/01-stack-local.md`
3. `docs/architecture/05-internationalisation-fr-en.md`
4. `docs/plan/04-feedback-ui.md`
5. `app/parent/page.tsx`

## Fichiers autorisés

- `app/parent/page.tsx`;
- `app/parent/parent-copy.ts` si tu extrais les traductions;
- `app/globals.css`, uniquement pour des classes préfixées `.parent-`;
- tests dédiés au dashboard parent.

## Fichiers interdits

Ne pas modifier :

- `app/page.tsx` — landing déjà bilingue;
- `app/student/page.tsx` — autre mission;
- `app/api/*` — aucun besoin backend pour cette mission;
- `src/domain/*` — aucun changement de domaine;
- les images et le logo;
- les documents Québec et la classe live.

## Fonctionnalités à livrer

- switcher `Français / English` visible dans la sidebar ou le menu du parent;
- français par défaut;
- mémorisation locale du choix avec la clé `madrasa-locale`;
- traduction de tous les textes visibles : navigation, titres, cartes, actions, états et aide privée;
- mise à jour de `document.documentElement.lang`;
- aucune clé de traduction visible à l’écran;
- layout correct avec les textes français et anglais;
- liens existants conservés.

## Traductions minimales

Traduire au minimum : `Accueil`, `Plan de la semaine`, `Cours`, `Assistant IA`, `Communauté`, `Portfolio`, `Parcours Québec`, `Budget`, `Bonjour`, `Votre prochain geste`, `Prochaines actions`, `État des enfants`, `À valider`, `Cette semaine`, `Réserver`, `Continuer` et tous les textes de contexte.

## Contrat de non-chevauchement

La mission ne crée pas d'authentification, ne branche pas de vraie base de données, ne modifie pas les données de démonstration et ne touche pas au tuteur IA. Si une modification hors périmètre semble nécessaire, créer une note dans la PR au lieu de la faire directement.

## Vérification obligatoire

```bash
npm run typecheck
npm run build
```

Puis vérifier dans le navigateur : `/parent` en français, bascule anglaise, retour français, rafraîchissement et affichage responsive.

## Livrable attendu

Une PR limitée à cette mission avec : résumé, captures des deux langues, tests exécutés et liste des fichiers modifiés.
