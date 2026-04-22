# Checklist legalite du site

Date de revue rapide : 2026-04-22

Ce document est une checklist pratique, pas un avis d'avocat.

## A traiter en priorite

- Mettre en place une vraie banniere cookies avant chargement d'AdSense.
- Bloquer le script Google Ads tant que l'utilisateur n'a pas accepte.
- Permettre un refus aussi simple que l'acceptation.
- Ajouter un moyen clair de retirer ou modifier le consentement plus tard.

## Donnees personnelles / RGPD

- Ajouter une page "Politique de confidentialite" accessible depuis l'accueil.
- Expliquer quelles donnees sont traitees :
  - session locale dans `localStorage`
  - meilleurs scores des jeux dans `localStorage`
  - etat de `Coin Clicker` dans `localStorage`
  - pseudos multijoueur
  - messages du chat multijoueur
  - IP utilisee pour le rate limiting cote serveur
- Expliquer les finalites de chaque traitement.
- Indiquer la base legale pour chaque traitement.
- Preciser si les donnees sont obligatoires ou facultatives.
- Preciser qui recoit les donnees ou y accede :
  - GitHub Pages
  - Render
  - Google AdSense
  - TMDb
  - jsDelivr pour `xlsx`
- Indiquer les durees de conservation :
  - sessions locales
  - scores locaux
  - messages de chat
  - rooms multijoueur
  - eventuels logs serveur
- Expliquer les droits des personnes et le point de contact.
- Mentionner la possibilite d'introduire une reclamation aupres de la CNIL.
- Mentionner les transferts hors UE ou l'usage de prestataires americains si applicable.

## Mentions legales

- Completer les mentions legales si necessaire selon ton statut reel.
- Verifier si l'adresse affichee est juridiquement suffisante pour ton cas.
- Garder l'identite de l'editeur, le directeur de publication, le domaine et les hebergeurs facilement accessibles.
- Ajouter un lien persistant vers les mentions legales et la politique de confidentialite.

## Publicite / traceurs

- Documenter les cookies et traceurs publicitaires utilises par Google.
- Indiquer la finalite publicitaire dans l'information cookies.
- Verifier si AdSense est configure en mode non personnalise quand l'utilisateur refuse.
- Eviter tout depot de traceur publicitaire avant consentement.

## TMDb / contenus tiers

- Verifier si l'usage de TMDb avec un site monétise par publicite entre dans un usage commercial au sens de leurs conditions.
- Si besoin, retirer la monétisation sur les pages concernees ou obtenir l'autorisation adequate.
- Conserver l'attribution TMDb visible et conforme.
- Verifier les droits sur les affiches et autres contenus tiers affiches.

## Multijoueur / chat

- Ajouter des regles d'usage du chat et un point de signalement.
- Prevoir une moderation minimale en cas d'abus.
- Documenter la conservation des messages et la suppression automatique des rooms.
- Verifier si des logs supplementaires sont conserves cote serveur.

## Mineurs / information claire

- Comme le site est oriente jeux, prevoir une information simple et lisible pour les plus jeunes.
- Eviter toute formulation ambigue sur la collecte de donnees.

## Technique / hygiene

- Limiter les appels a des tiers au strict necessaire.
- Revoir si certaines bibliotheques externes peuvent etre auto-hebergees pour reduire les transferts.
- Garder une trace de la configuration des prestataires et des finalites dans un mini registre RGPD.

## Quand on reprendra ce chantier

- Etape 1 : banniere cookies + blocage d'AdSense avant consentement.
- Etape 2 : page Politique de confidentialite reliee au footer ou aux actions globales.
- Etape 3 : mise a jour des mentions legales.
- Etape 4 : verification TMDb + monetisation.
