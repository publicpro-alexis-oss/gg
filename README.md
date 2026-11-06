# Groupe en direct (carte OpenStreetMap + messages + appels)

## Voir sans connexion
Ouvre `public/index.html` : mode démo (personnes simulées), aucun serveur nécessaire.

## Lancer en local
    npm install
    npm start
Puis ouvre http://localhost:3000 (la géolocalisation et le micro demandent HTTPS ou localhost).

## Déployer sur Render
1. Mets ce dossier sur GitHub (sans node_modules).
2. Render > New > **Web Service**, relie le dépôt.
3. Build Command : `npm install`   Start Command : `npm start`
4. Ouvre l'URL en HTTPS, entre un prénom et un code de groupe.

Bluetooth : Chrome seulement, l'utilisateur choisit lui-même l'appareil.
Utilise ce système uniquement avec des personnes consentantes.
