# Stack de développement local

## Choix recommandé

- **Frontend + backend** : Next.js App Router + TypeScript;
- **UI** : CSS Modules ou CSS global typé, sans dépendance UI lourde au début;
- **Validation** : Zod dès que l'API commence à recevoir des formulaires;
- **Données locales** : SQLite avec Prisma après le premier écran fonctionnel;
- **File locale** : worker Node séparé qui lit les `generation_jobs`;
- **Temps réel live** : WebRTC + couche de signalisation locale; faux adaptateur au MVP;
- **Tests** : Vitest pour le domaine, Playwright pour les parcours critiques;
- **Qualité** : ESLint, Prettier, TypeScript strict;
- **Déploiement futur** : PostgreSQL, stockage objet privé, Redis ou queue managée, fournisseur WebRTC, fournisseur IA.

## Pourquoi ce choix

Une seule application TypeScript permet aux développeurs de travailler sur le frontend, les routes backend et les contrats partagés sans gérer trop tôt une architecture distribuée. Les adaptateurs isolent SQLite, la file locale, la vidéo et l'IA afin de les remplacer sans réécrire les écrans.

## Ce qui reste local

- données de démonstration uniquement;
- jobs IA simulés ou générateur déterministe;
- aucune clé API dans Git;
- aucune vraie visioconférence;
- pas d'envoi réel au gouvernement;
- export local téléchargeable seulement.

## Contrats d'environnement

```text
DATABASE_URL=file:./dev.db
AI_PROVIDER=mock
LIVE_PROVIDER=mock
STORAGE_PROVIDER=local
APP_BASE_URL=http://localhost:3000
```

Quand les clés arriveront, elles seront lues uniquement côté serveur via `.env.local`, qui doit être ignoré par Git.

## Commandes cibles

```bash
npm install
npm run dev
npm run typecheck
npm run test
npm run build
```
