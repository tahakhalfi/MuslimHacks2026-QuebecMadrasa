# Brief agent — conformité Québec

## Problème

Les familles doivent gérer plusieurs documents, périodes et modes d'évaluation. Une plateforme trop générale ne prouve pas ce qui a été fait et une plateforme trop automatique pourrait faire croire à une garantie de conformité.

## Solution à construire

Un module versionné par année scolaire qui affiche les exigences, collecte les données utiles, signale les champs manquants et génère des brouillons clairement identifiés.

## Décisions non négociables

- source officielle et date de vérification pour chaque exigence;
- statut `à faire`, `en brouillon`, `vérifié par le parent`, `exporté`, `transmis manuellement`;
- délais calculés à partir de l'année scolaire et de la date de départ d'une école;
- aucune transmission gouvernementale dans le MVP;
- aucune phrase du type “vous êtes conforme”;
- export PDF et JSON avec historique de version.

## Première tranche de développement

1. modèle `RequirementDefinition`;
2. fonction de calcul des échéances;
3. formulaire projet d'apprentissage;
4. checklist parent;
5. export brouillon;
6. tests avec une famille qui commence le 1er juillet et une autre qui quitte l'école en cours d'année.

## Critère de réussite

Un parent peut voir en moins de deux minutes ce qui est dû, pourquoi, avec quelle source, et ce qu'il doit encore vérifier.
