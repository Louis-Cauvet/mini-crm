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

### Authentification et Sécurité

- **Système complet d'authentification JWT**
- **Cookies HttpOnly sécurisés** (7 jours d'expiration)
- **Hashage bcrypt** des mots de passe (salt rounds: 10)
- **Gestion des rôles** utilisateur (admin/user)
- **Middleware de protection** pour toutes les routes API
- **Pages de connexion et d'enregistrement** responsive
- **Comptes de test** pré-configurés

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
- **tsx** - Exécution TypeScript pour le développement
- **rimraf** - Nettoyage des builds

## 📁 Structure du Projet

```text
mini-crm/
├── api/                        # Backend Node.js avec Express
│   ├── src/
│   │   ├── middleware/        # Middlewares personnalisés
│   │   │   └── auth.ts        # Middleware JWT + rôles
│   │   ├── models/            # Modèles Mongoose
│   │   │   ├── User.ts        # Modèle Utilisateur avec auth
│   │   │   ├── Client.ts      # Modèle Client
│   │   │   ├── Article.ts     # Modèle Article
│   │   │   └── Order.ts       # Modèle Commande
│   │   ├── routes/            # Routes API
│   │   │   ├── auth.ts        # Routes d'authentification
│   │   │   ├── clients.ts     # Routes clients (protégées)
│   │   │   ├── articles.ts    # Routes articles (protégées)
│   │   │   └── orders.ts      # Routes commandes (protégées)
│   │   ├── scripts/           # Scripts utilitaires
│   │   │   └── seed.ts        # Script de peuplement BDD
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
   pnpm install
   ```

3. **Configurer l'environnement :**

   Créer un fichier `.env` dans le dossier `api/` :

   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/mini-crm
   FRONTEND_URL=http://localhost:5173
   JWT_SECRET=votre-secret-jwt-super-securise
   NODE_ENV=development
   ```

4. **Peupler la base de données avec des données de test :**

   ```bash
   pnpm run seed
   ```

5. **Installer les dépendances du frontend :**

   ```bash
   cd ../front
   pnpm install
   ```

### Scripts disponibles

**Backend :**

```bash
cd api

# Lancement en mode développement
pnpm run dev

# Build de production
pnpm run build

# Lancement de production
pnpm start

# Peupler la BDD avec des données de test
pnpm run seed

# Nettoyage
pnpm run clean
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

## 🗄️ Données de Test

### Comptes Utilisateur Pré-configurés

Après avoir exécuté `pnpm run seed`, vous disposez de comptes de test :

| Email                     | Mot de passe | Rôle  | Description          |
| ------------------------- | ------------ | ----- | -------------------- |
| `admin@minicrm.com`       | `admin123`   | Admin | Administrateur       |
| `user@minicrm.com`        | `user123`    | User  | Utilisateur standard |
| `paul.ageron@minicrm.com` | `paul123`    | User  | Compte développeur   |

### Données Générées

Le script de seeding crée automatiquement :

- **3 utilisateurs** avec rôles différents
- **5 clients** d'entreprises françaises réalistes
- **10 articles** tech (Apple, Samsung, Dell, etc.)
- **5 commandes** complètes avec différents statuts

## 🔌 API Endpoints

### Authentification (Routes publiques)

- `POST /api/auth/register` - Créer un compte utilisateur
- `POST /api/auth/login` - Se connecter (cookie JWT)
- `POST /api/auth/logout` - Se déconnecter
- `GET /api/auth/me` - Informations utilisateur connecté

### Health Check

- `GET /api/health` - Vérification du statut de l'API

### Routes Protégées (Authentification requise)

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

- `GET /api/orders` - Liste des commandes (avec relations)
- `GET /api/orders/:id` - Détails d'une commande
- `POST /api/orders` - Créer une commande
- `PUT /api/orders/:id` - Modifier une commande
- `DELETE /api/orders/:id` - Supprimer une commande

## 🔐 Sécurité et Authentification

### Système JWT Avancé

- **Tokens JWT** stockés dans des **cookies HttpOnly** sécurisés
- **Expiration automatique** après 7 jours
- **Middleware d'authentification** sur toutes les routes protégées
- **Hashage bcrypt** avec salt rounds 10 pour tous les mots de passe
- **Gestion des rôles** admin/user (extensible)

### Protection des Routes

Toutes les routes `/api/clients`, `/api/articles`, et `/api/orders` sont automatiquement protégées par le middleware d'authentification. Les requêtes doivent inclure le cookie JWT valide.

### Utilisation Frontend

```javascript
// Les requêtes doivent inclure credentials: 'include'
const response = await fetch("/api/clients", {
  credentials: "include", // Pour envoyer les cookies
});
```

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
- Contrôle de l'intégrité des données côté serveur
- Sanitisation automatique avec Mongoose

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

Pinia est configuré comme store principal pour la gestion d'état, prêt pour l'intégration avec l'API backend authentifiée.

## 🚧 Développement Futur

### Fonctionnalités Prévues

- Export de données (PDF, Excel)
- Notifications en temps réel
- Sauvegarde automatique
- Mode hors-ligne
- Interface d'administration avancée
- Gestion fine des permissions

## 🧪 Test de l'API

```bash
# Créer un compte
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nom":"Doe","prenom":"John","email":"john@example.com","motDePasse":"password123"}' \
  -c cookies.txt

# Se connecter
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@minicrm.com","motDePasse":"admin123"}' \
  -c cookies.txt

# Utiliser les routes protégées
curl http://localhost:3000/api/clients -b cookies.txt
```

## 👥 Équipe de Développement

Développé par l'équipe : **AGERON DIT BLANC Joachim, MICHALLON Lisa, DUPERTHUY Hugo, CAUVET Louis**

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

L'application utilise une API backend complète avec MongoDB pour la persistance des données. Toutes les opérations CRUD sont implémentées avec authentification et validation.

### Performance

- Lazy loading des routes
- Composants optimisés
- Build optimisé avec Vite
- Code splitting automatique
- Cookies sécurisés pour l'authentification

Cette application constitue un CRM complet et sécurisé avec une interface moderne et une architecture évolutive, prêt pour la production.
