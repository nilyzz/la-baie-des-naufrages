# Roadmap remaster jeux

Ce document trace l'histoire du remaster du navire `Jeux`. Le chantier est **terminé** : les 31 jeux du site suivent désormais le même standard.

## Standard remaster appliqué

Chaque jeu coche ce socle :

- overlay d'entrée avec titre, pitch thématique et CTA "Lancer"
- bouton `Règles` qui bascule l'overlay en mode explication
- écran de fin (victoire / défaite / égalité) avec CTA "Relancer"
- topbar harmonisée : compteurs à gauche/droite, bouton central masqué par défaut
- habillage visuel ancré dans l'univers de la baie (vocabulaire marin, palettes cohérentes)
- inputs bloqués quand l'overlay est visible (guards clavier et pointer)
- responsive desktop + mobile

## État final par vague

### Vague socle (historique)

Jeux qui avaient déjà un système menu/overlay complet :

- `2048`, `Baiely Bird`, `BaieBerry`, `Break It`, `Calcul` *(mentalMath)*
- `Dames` *(checkers)*, `Échecs` *(chess)*, `Memory`, `Morpion` *(ticTacToe)*, `Pong`
- `Coin 4` *(connect4)*, `Buno` *(uno)*

### Vague 1 — quick wins (terminée)

1. `Démineur` *(minesweeper)* — Champ de mines du récif
2. `Snake` — Serpent de mer
3. `Sudoku` — Carte de navigation
4. `Sea Hockey` *(airHockey)* — Duel de pont
5. `Réaction` *(reaction)* — Veille au phare
6. `Stack 2D` *(stacker)* — Tour de butin

### Vague 2 — jeux vitrine (terminée)

1. `Baie-Man` *(pacman)* — Labyrinthe du port
2. `Baietris` *(tetris)* — Cale de cargaison
3. `Bataille` *(battleship)* — Bataille navale de la baie
4. `Navire 2D` *(harborRun)* — Course dans le chenal

### Vague 3 — puzzle et casual (terminée)

1. `Coin Clicker` — Trésor du capitaine *(idle, pas d'écran de fin)*
2. `Coin Crush` *(candyCrush)* — Cale à confiseries marines
3. `Rope Line` *(flowFree)* — Cordages du quai
4. `Magic Sort` — Fioles du vieux navigateur
5. `Block Line` *(blockBlast)* — Ligne de cargaison
6. `OursAim` *(aim)* — Canon de bord
7. `Rythme` *(rhythm)* — Cadence des marins
8. `Solitaire` — Cabine du capitaine

### Vague 4 — Bombe multijoueur (terminée)

- `Bombe` *(bomb)* — La Bombe du bord
  - Mode **Multijoueur en ligne** conservé (lobby Socket.IO existant)
  - Mode **Duel local** ajouté : 2 capitaines partagent le clavier, tour par tour, explosion aléatoire

## Notes techniques

- Les boutons d'overlay utilisent les classes partagées `.game-menu-primary-button` et `.game-menu-secondary-button`
- Chaque jeu possède un wrapper `.<jeu>-table` qui contient l'overlay et le board
- La fonction `syncAllGameMenuOverlayBounds()` aligne les overlays sur la position du board au resize
- Les écrans de fin utilisent un pattern `reveal<Jeu>OutcomeMenu(title, text, eyebrow)` qui ré-affiche l'overlay en mode résultat
- Les jeux idles (Coin Clicker) et multijoueur-only (ancienne Bombe) sont des variantes du patron standard

## Chantiers potentiels à venir

- Minification de `script.js` / `style.css` (788 Ko / 357 Ko non minifiés)
- Service Worker pour l'offline des jeux solo (ajouté en même temps que le remaster final)
- Tests unitaires sur la logique serveur (`server.js`) et les moteurs de chaque jeu
- Accessibilité : ARIA labels sur les canvas (Tetris, Baie-Man, Break It, BaieBerry, Flappy, Navire 2D)
