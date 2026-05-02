# Roadmap remaster jeux

Ce document trace l'historique du remaster du navire `Jeux`. Le chantier est
termine : les 31 jeux du site suivent desormais le meme standard.

## Standard remaster applique

Chaque jeu coche ce socle :

- overlay d'entree avec titre, pitch thematique et CTA "Lancer"
- bouton `Regles` qui bascule l'overlay en mode explication
- ecran de fin (victoire / defaite / egalite) avec CTA "Relancer"
- topbar harmonisee : compteurs a gauche/droite, bouton central masque par defaut
- habillage visuel ancre dans l'univers de la baie (vocabulaire marin, palettes coherentes)
- inputs bloques quand l'overlay est visible (guards clavier et pointer)
- responsive desktop + mobile

## Etat final par vague

### Vague socle (historique)

Jeux qui avaient deja un systeme menu/overlay complet :

- `2048`, `Baiely Bird`, `BaieBerry`, `Break It`, `Calcul` *(mentalMath)*
- `Dames` *(checkers)*, `Echecs` *(chess)*, `Memory`, `Morpion` *(ticTacToe)*, `Pong`
- `Coin 4` *(connect4)*, `Buno` *(uno)*

### Vague 1 - quick wins (terminee)

1. `Demineur` *(minesweeper)* - Champ de mines du recif
2. `Snake` - Serpent de mer
3. `Sudoku` - Carte de navigation
4. `Sea Hockey` *(airHockey)* - Duel de pont
5. `Reaction` *(reaction)* - Veille au phare
6. `Stack 2D` *(stacker)* - Tour de butin

### Vague 2 - jeux vitrine (terminee)

1. `Baie-Man` *(pacman)* - Labyrinthe du port
2. `Baietris` *(tetris)* - Cale de cargaison
3. `Bataille` *(battleship)* - Bataille navale de la baie
4. `Navire 2D` *(harborRun)* - Course dans le chenal

### Vague 3 - puzzle et casual (terminee)

1. `Coin Clicker` - Tresor du capitaine *(idle, pas d'ecran de fin)*
2. `Coin Crush` *(candyCrush)* - Cale a confiseries marines
3. `Rope Line` *(flowFree)* - Cordages du quai
4. `Magic Sort` - Fioles du vieux navigateur
5. `Block Line` *(blockBlast)* - Ligne de cargaison
6. `OursAim` *(aim)* - Canon de bord
7. `Rythme` *(rhythm)* - Cadence des marins
8. `Solitaire` - Cabine du capitaine

### Vague 4 - Bombe multijoueur (terminee)

- `Bombe` *(bomb)* - La Bombe du bord
  - Mode **Multijoueur en ligne** conserve (lobby Socket.IO existant)
  - Mode **Duel local** ajoute : 2 capitaines partagent le clavier, tour par tour, explosion aleatoire

## Notes techniques

- Les boutons d'overlay utilisent les classes partagees `.game-menu-primary-button` et `.game-menu-secondary-button`
- Chaque jeu possede un wrapper `.<jeu>-table` qui contient l'overlay et le board
- La fonction `syncAllGameMenuOverlayBounds()` aligne les overlays sur la position du board au resize
- Les ecrans de fin utilisent un pattern `reveal<Jeu>OutcomeMenu(title, text, eyebrow)` qui re-affiche l'overlay en mode resultat
- Les jeux idle (Coin Clicker) et multijoueur-only (ancienne Bombe) sont des variantes du patron standard

## Chantiers potentiels a venir

- Decoupage progressif des derniers blocs de `script.js`
- Lazy loading des jeux/navires pour reduire le poids initial
- Tests unitaires sur la logique serveur (`server.js`) et les moteurs de chaque jeu
- Accessibilite : focus visible, annonces de resultat et labels ARIA sur les jeux les plus interactifs
