# La Baie des Naufrages

Ce projet contient maintenant un serveur Express + Socket.IO compatible avec Render pour le mode multijoueur.

## Roadmap jeux

La feuille de route du remaster du navire `Jeux` est disponible dans [docs/games-remaster-roadmap.md](docs/games-remaster-roadmap.md).

## Deploiement Render

1. Pousse le projet sur GitHub.
2. Dans Render, cree un nouveau `Web Service` depuis le repo.
3. Render detectera automatiquement [render.yaml](render.yaml).
4. Attends la fin du deploy puis ouvre l'URL Render, par exemple `https://la-baie-des-naufrages-server.onrender.com`.

## Configuration du front

Si le front et le serveur sont deployes ensemble sur Render, aucune configuration supplementaire n'est necessaire.

Si le front reste heberge ailleurs, renseigne l'URL publique du serveur Render dans la balise meta de [index.html](index.html) :

```html
<meta name="multiplayer-server-url" content="https://ton-service.onrender.com">
```

Dans ce cas, pense aussi a regler `CORS_ORIGIN` dans Render avec l'origine du front, par exemple :

```text
https://ton-site.github.io
```

## Variables utiles

- `PORT` : fournie automatiquement par Render.
- `CORS_ORIGIN` : `*` par defaut, ou une liste d'origines separees par des virgules.

## Verification

- Healthcheck HTTP : `/api/health`
- Client Socket.IO : `/socket.io/socket.io.js`
