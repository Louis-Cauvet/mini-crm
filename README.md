# Mini CRM

Un système de gestion de la relation client (CRM) développé avec Vue.js 3 et TypeScript, utilisant Vuetify comme framework UI, avec un backend Node.js, Express et MongoDB.

## 🚀 Fonctionnalités

### Gestion des Clients

- Liste des clients avec informations complètes
- Ajout, modification et suppression de clients
- Fiche détaillée de chaque client
- Historique des commandes par client
- Formatage automatique des numéros de téléphone

### Gestion des Articles

- Catalogue des articles avec images, prix et stock
- Gestion des couleurs et des marques
- Ajout, modification et suppression d'articles
- Upload d'images pour les articles
- Suivi du stock disponible

### Gestion des Commandes

- Création et suivi des commandes
- Gestion des statuts (Demandée, En préparation, Expédiée, Récupérée, Annulée)
- Calcul automatique du montant total
- Association clients-commandes
- Ajout/suppression de produits dans une commande

### Dashboard et Analyses

- Vue d'ensemble avec résumés des données
- Graphiques de quantités vendues par article
- Analyse du chiffre d'affaires par produit
- Affichage des données récentes (clients, articles, commandes)

### Authentification

- Pages de connexion et d'enregistrement
- Interface responsive avec gestion des écrans mobiles
- **Système JWT avec cookies sécurisés**
- **Protection des routes API par middleware**
- **Gestion des rôles utilisateur (admin/user)**

## 🛠️ Technologies Utilisées

### Frontend

- **Vue 3** - Framework JavaScript progressif
- **TypeScript** - Langage typé basé sur JavaScript
- **Vite** - Outil de build ultra-rapide
- **Vuetify 3** - Framework UI Material Design
- **Vue Router** - Routage SPA
- **Pinia** - Gestion d'état pour Vue
- **Chart.js & Vue-ChartJS** - Bibliothèque de graphiques
- **Axios** - Client HTTP

### Backend

- **Node.js** - Runtime JavaScript
- **Express** - Framework web pour Node.js
- **TypeScript** - Langage typé basé sur JavaScript
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM pour MongoDB
- **JWT** - Authentification par tokens
- **bcryptjs** - Hashage des mots de passe
- **cookie-parser** - Gestion des cookies

### Développement

- **Vue TSC** - Compilateur TypeScript pour Vue
- **Material Design Icons** - Icônes

## 📁 Structure du Projet

```text
mini-crm/
├── api/                        # Backend Node.js avec Express
│   ├── src/
│   │   ├── models/            # Modèles Mongoose
│   │   │   ├── Client.ts      # Modèle Client
│   │   │   ├── Article.ts     # Modèle Article
│   │   │   └── Order.ts       # Modèle Commande
│   │   ├── routes/            # Routes API
│   │   │   ├── clients.ts     # Routes clients
│   │   │   ├── articles.ts    # Routes articles
│   │   │   └── orders.ts      # Routes commandes
│   │   └── server.ts          # Serveur Express principal
│   ├── .env                   # Variables d'environnement
│   ├── package.json
│   └── tsconfig.json
└── front/                      # Application frontend Vue.js
    ├── public/                 # Fichiers statiques
    ├── src/
    │   ├── assets/            # Images et ressources
    │   │   └── logo.png
    │   ├── components/        # Composants réutilisables
    │   │   ├── HeaderBar.vue  # Barre de navigation supérieure
    │   │   └── Sidebar.vue    # Menu latéral
    │   ├── plugins/
    │   │   └── vuetify.ts     # Configuration Vuetify
    │   ├── router/
    │   │   └── index.ts       # Configuration des routes
    │   ├── views/             # Pages/vues de l'application
    │   │   ├── auth/          # Pages d'authentification
    │   │   │   ├── LoginView.vue
    │   │   │   └── RegisterView.vue
    │   │   ├── ArticlesView.vue      # Gestion des articles
    │   │   ├── ClientDetailsView.vue # Détails d'un client
    │   │   ├── ClientsView.vue       # Liste des clients
    │   │   ├── HomeView.vue          # Dashboard principal
    │   │   ├── OrderDetailsView.vue  # Détails d'une commande
    │   │   └── OrdersView.vue        # Liste des commandes
    │   ├── App.vue            # Composant racine
    │   ├── main.ts           # Point d'entrée de l'application
    │   └── style.css         # Styles globaux
    ├── package.json
    └── vite.config.ts        # Configuration Vite
```

## 🚀 Installation et Lancement

### Prérequis

- Node.js (version 16 ou supérieure)
- MongoDB (local ou cloud)
- PNPM (gestionnaire de paquets recommandé)

### Installation

1. **Cloner le repository :**

   ```bash
   git clone https://github.com/Louis-Cauvet/mini-crm.git
   cd mini-crm
   ```

2. **Installer les dépendances du backend :**

   ```bash
   cd api
   npm install
   ```

3. **Configurer l'environnement :**

   Créer un fichier `.env` dans le dossier `api/` et configurer :

   ```env
   MONGODB_URI=mongodb://localhost:27017/mini-crm
   PORT=3000
   FRONTEND_URL=http://localhost:5173
   ```

4. **Installer les dépendances du frontend :**

   ```bash
   cd ../front
   pnpm install
   ```

### Scripts disponibles

**Backend :**

```bash
cd api

# Lancement en mode développement
npm run dev

# Build de production
npm run build

# Lancement de production
npm start
```

**Frontend :**

```bash
cd front

# Lancement en mode développement
pnpm dev

# Build de production
pnpm build

# Prévisualisation du build
pnpm preview
```

- **Backend API** : `http://localhost:3000`
- **Frontend** : `http://localhost:5173`

## 🔌 API Endpoints

### Clients

- `GET /api/clients` - Liste des clients
- `GET /api/clients/:id` - Détails d'un client
- `POST /api/clients` - Créer un client
- `PUT /api/clients/:id` - Modifier un client
- `DELETE /api/clients/:id` - Supprimer un client

### Articles

- `GET /api/articles` - Liste des articles
- `GET /api/articles/:id` - Détails d'un article
- `POST /api/articles` - Créer un article
- `PUT /api/articles/:id` - Modifier un article
- `DELETE /api/articles/:id` - Supprimer un article

### Commandes

- `GET /api/orders` - Liste des commandes
- `GET /api/orders/:id` - Détails d'une commande
- `POST /api/orders` - Créer une commande
- `PUT /api/orders/:id` - Modifier une commande
- `DELETE /api/orders/:id` - Supprimer une commande

## 🎨 Design et UX

- **Material Design** via Vuetify
- **Thème cohérent** avec palette de couleurs professionnelle
- **Icônes Material Design** pour une navigation intuitive
- **Responsive design** pour tous les écrans
- **Animations fluides** et transitions

## 📊 Fonctionnalités Avancées

### Validation des Données

- Validation des formulaires en temps réel
- Messages d'erreur contextuels
- Contrôle de l'intégrité des données

### Gestion du Stock

- Vérification automatique de la disponibilité
- Alertes de stock insuffisant
- Mise à jour en temps réel

### Calculs Automatiques

- Total des commandes calculé automatiquement
- Statistiques des ventes
- Chiffre d'affaires par produit

## 🔧 Configuration

### Vuetify

La configuration Vuetify est dans `src/plugins/vuetify.ts` avec tous les composants et directives importés.

### Routage

Les routes sont définies dans `src/router/index.ts` avec lazy loading pour optimiser les performances.

### État de l'Application

Pinia est configuré comme store principal pour la gestion d'état (actuellement les données sont en local, prêt pour l'intégration API).

## 🚧 Développement Futur

### API Backend

- Le dossier `api/` contient le serveur complet
- **Authentification JWT** avec cookies sécurisés
- **Middleware de protection** des routes
- **Hashage des mots de passe** avec bcryptjs
- Intégration avec une base de données MongoDB
- API REST pour toutes les opérations CRUD

### Fonctionnalités Prévues

- Système d'authentification complet
- Gestion des utilisateurs et permissions
- Export de données (PDF, Excel)
- Notifications en temps réel
- Sauvegarde automatique
- Mode hors-ligne

## 👥 Équipe de Développement

Développé par l'équipe : **AGERON MICHALLON DUPERTHUY CAUVET**

## 📝 License

Ce projet est développé dans un cadre éducatif.

---

## 🔍 Détails Techniques

### Composants Principaux

- **App.vue** : Gestion du layout selon le contexte (auth/app)
- **Sidebar.vue** : Navigation principale avec icônes et état actif
- **HeaderBar.vue** : Barre supérieure avec informations utilisateur
- **Views** : Chaque page avec sa logique métier complète

### Gestion des Données

Actuellement, les données sont stockées en local dans chaque composant avec des exemples réalistes. La structure est prête pour l'intégration d'une API backend.

### Performance

- Lazy loading des routes
- Composants optimisés
- Build optimisé avec Vite
- Code splitting automatique

Cette application constitue une base solide pour un CRM complet avec une interface moderne et une architecture évolutive.

## 🔐 Sécurité

### Authentification Robuste

- **Tokens JWT** avec expiration (7 jours)
- **Cookies HttpOnly** pour la sécurité
- **Hashage bcrypt** des mots de passe (salt rounds: 10)
- **Middleware d'authentification** sur toutes les routes sensibles
- **Gestion des rôles** admin/user

### Protection des Données

- **Validation des entrées** côté serveur
- **Sanitisation** automatique avec Mongoose
- **Gestion des erreurs** sécurisée sans exposition d'informations sensibles
- **Variables d'environnement** pour les secrets
