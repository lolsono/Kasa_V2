🏡 Gestion de logements

Application web de consultation et de gestion de logements

Bienvenue dans le projet ! Cette application est composée d'un frontend développé avec Next.js et d'un backend dédié à la gestion des données et aux échanges avec l'API.

Elle propose notamment un système de favoris et une interface de consultation des logements avec des carrousels sur les pages de détails.

📋 Sommaire
Technologies utilisées
Prérequis
Installation
Configuration
Démarrage de l'application
Tests unitaires
Structure du projet
🛠️ Technologies utilisées
Technologie	Utilisation
Next.js	Développement du frontend
React	Création de l'interface utilisateur
Node.js	Environnement d'exécution JavaScript
npm	Gestion des dépendances
Jest	Tests unitaires
📌 Prérequis

Avant de démarrer le projet, assurez-vous d'avoir installé :

Node.js
npm, fourni avec Node.js
Git, si vous souhaitez cloner le dépôt
🚀 Installation

Le projet est divisé en deux parties indépendantes : le backend et le frontend. Chacune possède ses propres dépendances.

1. Backend

Placez-vous dans le répertoire du backend :

cd backend


Installez les dépendances :

npm install


Le backend est maintenant prêt à être lancé.

📖 Pour plus de détails sur sa configuration, consultez le fichier README.md situé à la racine du backend.
2. Frontend

Placez-vous dans le répertoire du frontend :

cd frontend


Installez les dépendances :

npm install

⚙️ Configuration

Avant de lancer le frontend, configurez l'adresse de l'API.

Repérez le fichier exemple.env à la racine du frontend.
Copiez-le et nommez la copie .env.
Renseignez l'adresse de votre API.

Exemple de configuration :

API_URL=http://localhost:3000


Adaptez cette valeur à votre environnement et au port utilisé par le backend.

Important : ne publiez jamais de variables d'environnement contenant des informations sensibles.

▶️ Démarrage de l'application

Le frontend et le backend doivent être exécutés dans deux terminaux distincts.

Démarrer le backend

Depuis le répertoire backend :

npm start


Le serveur écoute par défaut sur http://localhost:3000, sauf configuration différente.

Démarrer le frontend

Depuis le répertoire frontend :

npm run dev


Le frontend est généralement accessible sur http://localhost:3000 si ce port est libre. Si le backend utilise déjà ce port, Next.js peut choisir un autre port disponible.

🧪 Tests unitaires

Le projet utilise Jest pour vérifier le comportement de certaines fonctionnalités.

Pour exécuter les tests, placez-vous dans le répertoire du frontend et lancez :

npm test

Fonctionnalités testées
⭐ Système de favoris : vérification des fonctionnalités liées à la gestion des favoris.
🎠 Carrousels des logements : vérification des carrousels présents sur les pages de détails des logements.

Les tests sont regroupés dans le répertoire __test__.

📁 Structure du projet

Voici une représentation indicative de l'organisation du projet :

projet/
├── backend/
│   ├── README.md
│   └── ...
│
├── frontend/
│   ├── app/
│   ├── services/
│   ├── __test__/
│   ├── exemple.env
│   ├── package.json
│   └── ...
│
└── README.md


Remarque : adaptez cette arborescence à la structure réelle de votre dépôt.

📖 Documentation complémentaire

Pour toute information supplémentaire concernant le backend, sa configuration ou ses commandes spécifiques, consultez le README présent dans le répertoire backend.

Bon développement ! 🚀