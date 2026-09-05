# Décision produit — français et anglais partout

## Règle permanente

Toutes les pages et tous les services de Madrasa Québec doivent pouvoir être utilisés en français et en anglais : landing, authentification, dashboard parent, espace élève, cours, tuteur IA, classes collaboratives, Parcours Québec, portfolio, budget, paramètres, notifications et documents exportés.

Le français est la langue par défaut pour le Québec. L'utilisateur peut basculer vers l'anglais depuis la navbar publique ou les paramètres après connexion. Le choix doit rester enregistré pour le compte et le navigateur.

## Contraintes de développement

- aucun texte visible important directement codé dans un composant;
- toutes les chaînes passent par un dictionnaire de traduction;
- les traductions doivent être complètes avant de marquer une page comme terminée;
- ne jamais mélanger français et anglais dans un même écran, sauf termes propres ou contenus choisis par l'utilisateur;
- prévoir des textes plus longs en français dans les layouts;
- formater dates, nombres, temps et pluriels selon la langue;
- traduire aussi les états d'erreur, états vides, emails, notifications, messages IA et exports;
- les noms propres, citations et contenus scolaires gardent leur langue d'origine avec indication claire.

## Architecture recommandée

```text
locale: fr | en
  → dictionnaire UI versionné
  → contenu métier avec fallback contrôlé
  → formatage dates/nombres
  → export du document dans la langue sélectionnée
```

Le backend reçoit la langue demandée pour les jobs IA et les exports. Une génération en français ne doit pas être affichée comme anglaise sans traduction ou validation explicite.

## Definition of done i18n

Une page est terminée seulement si :

1. les deux langues peuvent être sélectionnées;
2. les boutons, titres, formulaires, erreurs et états vides sont traduits;
3. la mise en page fonctionne avec les longueurs françaises et anglaises;
4. les dates et nombres sont formatés correctement;
5. un test vérifie l'absence de clé de traduction visible;
6. l'export ou le résumé généré respecte la langue choisie.
