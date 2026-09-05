# Sécurité et données — MVP

## Principes

- données d'enfant privées par défaut;
- parent comme propriétaire des permissions familiales;
- minimisation : pas de localisation précise, publicité ciblée, caméra ou micro par défaut;
- identifiants et permissions vérifiés côté serveur;
- séparation stricte des familles;
- suppression et export prévus dès la première version;
- journal des accès aux preuves et documents;
- aucun vrai dossier d'enfant dans les captures, tests ou fixtures publiques.

## Menaces à traiter

- un élève qui consulte les données d'une autre famille;
- une IA qui reçoit trop de données;
- une transcription publiée sans consentement;
- un document exporté qui contient une information erronée;
- un faux éducateur dans une classe live;
- une clé fournisseur ajoutée par erreur au frontend.

## Protection de l'IA

Le backend construit le contexte à partir de sources autorisées; le navigateur n'envoie jamais une base complète au modèle. Les réponses sont marquées comme aide pédagogique, et les actions d'écriture passent par une confirmation humaine.
