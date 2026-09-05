# Parcours Québec — conformité et documents

## Limite importante

Ce module est un assistant de préparation et de suivi. Il ne certifie pas la conformité, ne dépose pas automatiquement un document au ministère et ne fournit pas d'avis juridique. Chaque export doit afficher sa période, ses sources et une case de vérification par le parent.

## Échéances à configurer par année scolaire

| Élément | Échéance ou fenêtre | Fonction produit |
|---|---|---|
| Avis de déclaration annuelle | au plus tard le 1er juillet | rappel + checklist + brouillon |
| Projet d'apprentissage | transmission et mise en œuvre au plus tard le 30 septembre | assistant guidé + export |
| Départ d'une école en cours d'année | avis dans les 10 jours; projet dans les 30 jours suivant la fin de fréquentation | échéance calculée selon la date saisie |
| État de situation | entre le 3e et le 5e mois après la mise en œuvre | formulaire + pièces |
| Bilan de mi-parcours | entre le 3e et le 5e mois après la mise en œuvre | formulaire + progression |
| Rencontre de suivi | pendant la mise en œuvre | rappel, notes et présence |
| Bilan de fin de projet | au plus tard le 15 juin | export vérifiable |
| Portfolio comme évaluation | au plus tard le 15 juin | contrôle de complétude |
| Autres conclusions d'évaluation | au plus tard le 30 juin | rappel + pièce justificative |

## Champs du projet d'apprentissage

Le formulaire doit couvrir : approche éducative, programmes visés, activités, autres compétences, ressources, temps approximatif, organisations contributrices, modalités d'évaluation et dernier niveau de services éducatifs reçus.

## Stratégie de généralisation

Le système sépare :

- `jurisdiction` : Québec aujourd'hui, autre juridiction demain;
- `school_year` : période 1er juillet–30 juin;
- `requirement_definition` : texte, source officielle, date de vérification, version;
- `family_submission` : brouillon, vérifié par le parent, exporté, transmis manuellement, confirmé;
- `evidence` : activité, portfolio, évaluation, document ou note de rencontre.

Ainsi, un changement ministériel met à jour une définition versionnée plutôt que dupliquer une logique dans chaque page.

## Documents générés

- checklist annuelle;
- projet d'apprentissage prérempli;
- état de situation;
- bilan mi-parcours;
- bilan de fin de projet;
- index de portfolio;
- calendrier d'échéances;
- dossier ZIP avec PDF, sources, version et contrôle du parent.

L'export doit dire clairement `Brouillon préparé avec l'aide de la plateforme — vérification parentale requise` jusqu'à la confirmation manuelle.

## Sources officielles de référence

- https://www.quebec.ca/education/prescolaire-primaire-et-secondaire/programmes-formations-evaluation/enseignement-maison/demarche-etapes
- https://cdn-contenu.quebec.ca/cdn-contenu/education/enseignement-maison/Echeancier-enseignement-maison.pdf
- https://www.legisquebec.gouv.qc.ca/fr/document/rc/I-13.3%2C%20r.%206.01
