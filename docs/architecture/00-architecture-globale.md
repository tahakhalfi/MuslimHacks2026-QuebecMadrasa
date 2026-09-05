# Architecture globale — MuslimHacks Québec Madrasa

## Objectif du premier produit

Livrer un espace local qui permet à une famille de planifier l'apprentissage, suivre les preuves de progression, préparer les étapes de l'enseignement à la maison au Québec et offrir des leçons individuelles ou collaboratives.

Le MVP n'est pas une école privée, ne promet pas un diplôme et ne remplace pas la Direction de l'enseignement à la maison (DEM), un centre de services scolaire, un titulaire d'une autorisation d'enseigner ou un conseiller juridique.

## Architecture en couches

```text
Navigateur
  ├─ Landing publique
  ├─ Dashboard parent
  ├─ Espace élève 12 ans et moins
  ├─ Espace élève 13 ans et plus
  └─ Classe live / tuteur IA
        ↓ API interne
Application Next.js
  ├─ Auth et autorisations par famille
  ├─ Services métier
  │   ├─ parcours Québec
  │   ├─ planification et portfolio
  │   ├─ classes collaboratives
  │   └─ IA et file de génération
  ├─ validation des documents
  └─ exports PDF/JSON
        ↓ adaptateurs remplaçables
Stockage local / SQLite en développement
PostgreSQL + stockage objet + workers en production
```

## Règle de séparation

- le parent possède les permissions de la famille;
- l'élève voit uniquement son espace d'apprentissage;
- l'éducateur de groupe voit uniquement sa classe;
- aucun service IA ne peut publier un cours, une note ou un document ministériel sans approbation humaine;
- les règles du Québec sont versionnées par année scolaire, jamais codées comme des constantes dispersées dans l'interface.

## Modules prioritaires

| Module | MVP | Responsable |
|---|---:|---|
| Landing + navigation | oui | équipe principale |
| Dashboard parent | oui | équipe principale |
| Dashboard élève | oui | équipe principale |
| Parcours Québec + échéances | oui | agent conformité Québec |
| Portfolio et documents | oui | équipe principale |
| Tuteur IA individuel | après vertical slice | équipe principale |
| Classe live collaborative | prototype séparé | agent live class |
| Paiement, vraie IA, vraie base cloud | plus tard | à décider |

## Vertical slice à terminer avant l'expansion

1. créer une famille de démo;
2. créer un enfant;
3. afficher la landing;
4. ouvrir le dashboard parent;
5. ouvrir l'espace élève;
6. créer une tâche dans la file locale;
7. afficher une échéance Québec;
8. exporter un brouillon de projet d'apprentissage;
9. ne connecter aucune vraie clé ni donnée d'enfant au premier test.
