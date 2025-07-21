# Mini CRM API

Backend API pour le système Mini CRM développé avec Node.js, Express, TypeScript et MongoDB.

## 🚀 Technologies utilisées

- **Node.js** - Environnement d'exécution JavaScript
- **Express.js** - Framework web minimaliste
- **TypeScript** - JavaScript typé
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM pour MongoDB
- **JWT** - Authentification par tokens
- **bcryptjs** - Hashage des mots de passe
- **CORS** - Gestion des requêtes cross-origin
- **Helmet** - Sécurisation des headers HTTP
- **Express Rate Limit** - Limitation du taux de requêtes

## 📁 Structure du projet

```text
api/
├── src/
│   ├── config/
│   │   └── database.ts        # Configuration MongoDB
│   ├── middleware/
│   │   └── errorHandler.ts    # Gestion des erreurs
│   ├── models/
│   │   ├── User.ts           # Modèle utilisateur
│   │   ├── Client.ts         # Modèle client
│   │   ├── Article.ts        # Modèle article
│   │   └── Order.ts          # Modèle commande
│   ├── utils/
│   │   ├── jwt.ts            # Utilitaires JWT
│   │   └── response.ts       # Utilitaires réponses API
│   └── index.ts              # Point d'entrée de l'application
├── .env.example              # Variables d'environnement exemple
├── .gitignore               # Fichiers à ignorer par Git
├── .eslintrc.js             # Configuration ESLint
├── nodemon.json             # Configuration Nodemon
├── tsconfig.json            # Configuration TypeScript
└── package.json             # Dépendances et scripts
```

## 🛠️ Installation

### Prérequis

- Node.js (version 16 ou supérieure)
- MongoDB (local ou distant)
- PNPM (gestionnaire de paquets)

### Étapes d'installation

1. **Installer les dépendances :**

   ```bash
   cd api
   pnpm install
   ```

2. **Configuration des variables d'environnement :**

   ```bash
   cp .env.example .env
   ```

   Puis éditer le fichier `.env` avec vos paramètres :

   ```text
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/mini-crm
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   CORS_ORIGIN=http://localhost:5173
   ```

3. **Démarrer MongoDB :**

   - Soit localement avec `mongod`
   - Soit utiliser MongoDB Atlas (cloud)

4. **Démarrer le serveur :**

   ```bash
   # Mode développement (avec rechargement automatique)
   pnpm dev

   # Mode production
   pnpm build
   pnpm start
   ```

## 🔧 Scripts disponibles

```bash
# Développement avec rechargement automatique
pnpm dev

# Build de production
pnpm build

# Démarrage en production
pnpm start

# Linter ESLint
pnpm lint
```

## 📊 Modèles de données

### User (Utilisateur)

```typescript
{
  firstname: string;
  lastname: string;
  email: string; // unique
  password: string; // hashé
  role: "user" | "admin";
  isActive: boolean;
}
```

### Client

```typescript
{
  firstname: string;
  lastname: string;
  company: string;
  email: string; // unique
  phone: string; // 10 chiffres
}
```

### Article

```typescript
{
  name: string;
  brand: string;
  price: number;
  image?: string;
  color: 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange' | 'grey' | 'black' | 'white';
  description?: string;
  stock: number;
}
```

### Order (Commande)

```typescript
{
  number: string; // auto-généré (CMD001, CMD002, etc.)
  date: Date;
  status: 'Demandée' | 'En préparation' | 'Expédiée' | 'Récupérée' | 'Annulée';
  clientId: ObjectId; // référence vers Client
  products: [{
    articleId: ObjectId; // référence vers Article
    quantity: number;
  }];
  total: number;
}
```

## 🔐 Sécurité

- **Hashage des mots de passe** avec bcryptjs (salt rounds: 12)
- **Authentification JWT** avec expiration de 7 jours
- **Rate limiting** : 100 requêtes par IP par fenêtre de 15 minutes
- **CORS** configuré pour le frontend
- **Helmet** pour sécuriser les headers HTTP
- **Validation** des données avec Mongoose

## 📡 API Endpoints (à implémenter)

### Authentification

- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/profile` - Profil utilisateur

### Clients

- `GET /api/clients` - Liste des clients
- `GET /api/clients/:id` - Détail d'un client
- `POST /api/clients` - Créer un client
- `PUT /api/clients/:id` - Modifier un client
- `DELETE /api/clients/:id` - Supprimer un client

### Articles

- `GET /api/articles` - Liste des articles
- `GET /api/articles/:id` - Détail d'un article
- `POST /api/articles` - Créer un article
- `PUT /api/articles/:id` - Modifier un article
- `DELETE /api/articles/:id` - Supprimer un article

### Commandes

- `GET /api/orders` - Liste des commandes
- `GET /api/orders/:id` - Détail d'une commande
- `POST /api/orders` - Créer une commande
- `PUT /api/orders/:id` - Modifier une commande
- `DELETE /api/orders/:id` - Supprimer une commande

## 🚀 Fonctionnalités

### Implémentées

- ✅ Configuration de base Express + TypeScript
- ✅ Connexion MongoDB avec Mongoose
- ✅ Modèles de données complets
- ✅ Middleware de gestion d'erreurs
- ✅ Utilitaires JWT et réponses API
- ✅ Sécurité de base (CORS, Helmet, Rate Limiting)
- ✅ Validation des données

### À implémenter

- ⏳ Routes et contrôleurs API
- ⏳ Middleware d'authentification
- ⏳ Tests unitaires et d'intégration
- ⏳ Documentation API (Swagger)
- ⏳ Upload de fichiers (images)
- ⏳ Logging avancé
- ⏳ Monitoring et métriques

## 🧪 Tests

Les tests seront ajoutés prochainement avec Jest et Supertest.

## 📝 Notes de développement

- Les erreurs TypeScript actuelles sont normales car les dépendances ne sont pas encore installées
- Exécuter `pnpm install` pour résoudre les erreurs
- La structure est prête pour l'ajout des routes et contrôleurs
- Les modèles incluent la validation et les index pour les performances
- Le middleware de génération automatique des numéros de commande est implémenté

## 🤝 Contribution

Ce projet est développé par l'équipe : **AGERON MICHALLON DUPERTHUY CAUVET**
