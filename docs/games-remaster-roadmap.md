# Roadmap remaster jeux

Ce document sert de feuille de route pour terminer le remaster du navire `Jeux`.

## Standard remaster

Un jeu est considere comme remasterise quand il coche ce socle :

- overlay d entree avec titre, pitch et CTA
- bouton `Regles`
- ecran de fin ou retour de resultat
- topbar harmonisee avec les autres jeux
- habillage visuel ancre dans l univers de la baie
- textes et labels coherents avec le vocabulaire marin du site
- comportement propre sur desktop et mobile

## Jeux deja remasterises

Jeux qui ont deja un vrai systeme de menu/overlay dans [index.html](c:\Users\Nail\Desktop\la-baie-des-naufrages-main 29 mars 2026\index.html) et [script.js](c:\Users\Nail\Desktop\la-baie-des-naufrages-main 29 mars 2026\script.js) :

- `2048`
- `Baiely Bird`
- `BaieBerry`
- `Break It`
- `Calcul`
- `Dames`
- `Echecs`
- `Memory`
- `Morpion`
- `Pong`
- `Coin 4`
- `Buno`

## Jeux restants

### Vague 1 - quick wins a fort impact

Ces jeux ont deja une base UI claire dans [index.html](c:\Users\Nail\Desktop\la-baie-des-naufrages-main 29 mars 2026\index.html), donc on peut leur greffer rapidement le standard remaster.

1. `Demineur`
2. `Snake`
3. `Sudoku`
4. `Sea Hockey`
5. `Reaction`
6. `Stack 2D`

### Vague 2 - jeux vitrine

Ce sont les jeux qui peuvent le plus renforcer l identite du site.

1. `Baie-Man`
2. `Baietris`
3. `Bataille`
4. `Navire 2D`

### Vague 3 - puzzle et casual

Ils sont moins urgents en vitrine, mais importants pour homogeniser toute la page jeux.

1. `Coin Clicker`
2. `Coin Crush`
3. `Rope Line`
4. `Magic Sort`
5. `Block Line`
6. `OursAim`
7. `Rythme`
8. `Solitaire`

## Direction par jeu

### Vague 1

#### Demineur

- Theme : `Champ de mines du recif`
- Angle visuel : sable, rochers, flotteurs, balises rouges
- Ajouts UX : menu de debut, ecran victoire/defaite, rappel clic gauche/drapeau
- Fichiers : [index.html](c:\Users\Nail\Desktop\la-baie-des-naufrages-main 29 mars 2026\index.html), [style.css](c:\Users\Nail\Desktop\la-baie-des-naufrages-main 29 mars 2026\style.css), [script.js](c:\Users\Nail\Desktop\la-baie-des-naufrages-main 29 mars 2026\script.js)

#### Snake

- Theme : `Serpent de mer`
- Angle visuel : anguille, perles, courant marin, eau plus vivante
- Ajouts UX : overlay d entree, message de fin, meilleure lecture du score et du record
- Fichiers : [index.html](c:\Users\Nail\Desktop\la-baie-des-naufrages-main 29 mars 2026\index.html), [style.css](c:\Users\Nail\Desktop\la-baie-des-naufrages-main 29 mars 2026\style.css), [script.js](c:\Users\Nail\Desktop\la-baie-des-naufrages-main 29 mars 2026\script.js)

#### Sudoku

- Theme : `Carte de navigation`
- Angle visuel : grille de navigation, rose des vents, papier marin
- Ajouts UX : menu de lancement, regles simples, etat grille terminee
- Fichiers : [index.html](c:\Users\Nail\Desktop\la-baie-des-naufrages-main 29 mars 2026\index.html), [style.css](c:\Users\Nail\Desktop\la-baie-des-naufrages-main 29 mars 2026\style.css), [script.js](c:\Users\Nail\Desktop\la-baie-des-naufrages-main 29 mars 2026\script.js)

#### Sea Hockey

- Theme : `Duel de pont`
- Angle visuel : table comme un pont de bateau, palets comme bouees ou rondins
- Ajouts UX : vrai menu de lancement selon mode solo/duo, ecran de fin, meilleur onboarding des controles
- Fichiers : [index.html](c:\Users\Nail\Desktop\la-baie-des-naufrages-main 29 mars 2026\index.html), [style.css](c:\Users\Nail\Desktop\la-baie-des-naufrages-main 29 mars 2026\style.css), [script.js](c:\Users\Nail\Desktop\la-baie-des-naufrages-main 29 mars 2026\script.js)

#### Reaction

- Theme : `Veille au phare`
- Angle visuel : lanterne, brouillard, eclat lumineux
- Ajouts UX : menu d intro, score final plus theatral, meilleur feedback faux depart
- Fichiers : [index.html](c:\Users\Nail\Desktop\la-baie-des-naufrages-main 29 mars 2026\index.html), [style.css](c:\Users\Nail\Desktop\la-baie-des-naufrages-main 29 mars 2026\style.css), [script.js](c:\Users\Nail\Desktop\la-baie-des-naufrages-main 29 mars 2026\script.js)

#### Stack 2D

- Theme : `Tour de butin`
- Angle visuel : caisses, coffres, cargaison, balancement de mât
- Ajouts UX : menu de debut, etat de chute/perte, record mis en avant
- Fichiers : [index.html](c:\Users\Nail\Desktop\la-baie-des-naufrages-main 29 mars 2026\index.html), [style.css](c:\Users\Nail\Desktop\la-baie-des-naufrages-main 29 mars 2026\style.css), [script.js](c:\Users\Nail\Desktop\la-baie-des-naufrages-main 29 mars 2026\script.js)

### Vague 2

#### Baie-Man

- Theme : `Labyrinthe du port`
- Angle visuel : quais, lanternes, coffres et ennemis marins
- Priorite : forte, car jeu iconique

#### Baietris

- Theme : `Cale de cargaison`
- Angle visuel : blocs comme caisses et marchandises, fond de soute
- Priorite : forte, car jeu tres identifiable

#### Bataille

- Theme : `Bataille navale de la baie`
- Angle visuel : cartes, tirs, ecume, impact visuel plus fort
- Priorite : forte, surtout pour le multijoueur

#### Navire 2D

- Theme : `Course dans le chenal`
- Angle visuel : vitesse, ecume, obstacles de port, ambiance arcade premium
- Priorite : forte, car deja tres thematique

### Vague 3

#### Coin Clicker

- Theme : `Tresor du capitaine`
- Focus : boucle de progression plus lisible, feedback de clic, boutique plus habillee

#### Coin Crush

- Theme : `Cale a confiseries marines`
- Focus : meilleure lisibilite des gemmes, combo, objectif de partie

#### Rope Line

- Theme : `Cordages du quai`
- Focus : relief des liens, meilleure lecture des couleurs et de la progression

#### Magic Sort

- Theme : `Fioles du vieux navigateur`
- Focus : plus de caractere dans les contenants, menu de depart et feedback victoire

#### Block Line

- Theme : `Ligne de cargaison`
- Focus : menu, meilleur feedback des placements, plus de profondeur visuelle

#### OursAim

- Theme : `Canon de bord`
- Focus : onboarding rapide, score plus heroique, sensations de tir

#### Rythme

- Theme : `Cadence des marins`
- Focus : intro plus claire, habillage musical de pont, resultat de manche

#### Solitaire

- Theme : `Cabine du capitaine`
- Focus : cartes plus premium, menu, ambiance plus calme et noble

## Ordre de prod recommande

1. `Demineur`
2. `Snake`
3. `Sudoku`
4. `Sea Hockey`
5. `Reaction`
6. `Stack 2D`
7. `Baie-Man`
8. `Baietris`
9. `Bataille`
10. `Navire 2D`
11. `Coin Clicker`
12. `Coin Crush`
13. `Rope Line`
14. `Magic Sort`
15. `Block Line`
16. `OursAim`
17. `Rythme`
18. `Solitaire`

## Checklist par remaster

Pour chaque jeu, suivre cette sequence :

1. Ajouter ou harmoniser le bloc menu dans [index.html](c:\Users\Nail\Desktop\la-baie-des-naufrages-main 29 mars 2026\index.html)
2. Ajouter le skin et les etats du menu dans [style.css](c:\Users\Nail\Desktop\la-baie-des-naufrages-main 29 mars 2026\style.css)
3. Declarer les references DOM dans [script.js](c:\Users\Nail\Desktop\la-baie-des-naufrages-main 29 mars 2026\script.js)
4. Brancher `render...Menu`, affichage des regles et reveal de fin dans [script.js](c:\Users\Nail\Desktop\la-baie-des-naufrages-main 29 mars 2026\script.js)
5. Synchroniser l overlay avec `syncAllGameMenuOverlayBounds()` dans [script.js](c:\Users\Nail\Desktop\la-baie-des-naufrages-main 29 mars 2026\script.js)
6. Verifier navigation clavier, responsive et relance de partie

## Notes techniques

- Les jeux deja remasterises servent de reference. Les modeles les plus reutilisables sont `2048`, `Memory`, `Pong`, `Break It` et `BaieBerry`.
- Le coeur du chantier n est pas de reinventer chaque UI, mais de reutiliser le meme patron menu + regles + resultat.
- Pour garder de la vitesse, il vaut mieux traiter les remasters par vague de 2 a 3 jeux avec le meme pattern d interaction.
