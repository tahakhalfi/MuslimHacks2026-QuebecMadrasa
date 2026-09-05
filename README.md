# MuslimHacks2026 — Québec Madrasa

Premier vertical slice local de la plateforme d'apprentissage en famille.

## Lancer localement

```bash
npm install
npm run dev
```

Puis ouvrir [http://localhost:3000](http://localhost:3000).

Pages disponibles :

- `/` — landing publique;
- `/parent` — dashboard parent;
- `/student` — espace élève;
- `/api/health` — état du backend local;
- `/api/generation-jobs` — création locale d'un job IA simulé.

## Vérifier avant une PR

```bash
npm run typecheck
npm run build
```

## Architecture

Lire d'abord :

1. `docs/architecture/00-architecture-globale.md`
2. `docs/architecture/01-stack-local.md`
3. `docs/architecture/03-conformite-quebec.md`
4. `dev-teammate/README.md`

Le projet n'utilise encore aucune clé externe, vraie base cloud, vraie génération IA ou vraie visioconférence. Les adaptateurs locaux sont intentionnels pour le développement et les tests.
