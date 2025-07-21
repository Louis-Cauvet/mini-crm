# Mini CRM API

Backend API pour le système Mini CRM développé avec Node.js, Express, TypeScript et MongoDB.

## 🚀 Technologies

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **TypeScript** - Typage statique
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM pour MongoDB
- **JWT** - Authentification par tokens
- **bcryptjs** - Hashage des mots de passe

## 📦 Installation

```bash
# Installer les dépendances
pnpm install

# Copier le fichier d'environnement
cp .env.example .env
```

## ⚙️ Configuration

Créer un fichier `.env` à la racine du projet avec les variables suivantes :

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/mini-crm
FRONTEND_URL=http://localhost:5173
JWT_SECRET=votre-secret-jwt-super-securise
NODE_ENV=development
```

## 🏃‍♂️ Démarrage

```bash
# Mode développement
pnpm run dev

# Build de production
pnpm run build

# Démarrage production
pnpm start

# Nettoyage
pnpm run clean
```

## 🗄️ Données de test

### Script de Seeding Automatique

Le projet inclut un script complet pour générer des données de test réalistes :

```bash
# Peupler la base avec des données de test
pnpm run seed

# En production (après build)
pnpm run build
pnpm run seed:prod
```

### Données Générées Automatiquement

Le script `src/scripts/seed.ts` crée :

- **3 utilisateurs** avec rôles admin/user
- **5 clients** d'entreprises françaises
- **10 articles** tech (Apple, Samsung, Dell, etc.)
- **5 commandes** complètes avec différents statuts

### Comptes de Test Prêts

| Email                     | Mot de passe | Rôle  | Description          |
| ------------------------- | ------------ | ----- | -------------------- |
| `admin@minicrm.com`       | `admin123`   | Admin | Tous droits          |
| `user@minicrm.com`        | `user123`    | User  | Utilisateur standard |
| `paul.ageron@minicrm.com` | `paul123`    | User  | Compte développeur   |

### Exemples de Données

**Articles populés :**

- MacBook Pro 16" (2499€, stock: 15)
- iPhone 15 Pro (1199€, stock: 25)
- Samsung Galaxy S24 (899€, stock: 20)
- Dell XPS 13 (1299€, stock: 12)
- iPad Air, AirPods Pro, Moniteur 4K...

**Commandes réalistes :**

- Statuts variés (Demandée → Expédiée → Récupérée)
- Montants de 1246€ à 2778€
- Dates novembre-décembre 2024
- Relations client-articles complètes

## 📁 Structure du projet

```text
src/
├── middleware/      # Middlewares personnalisés
│   └── auth.ts      # Middleware d'authentification JWT + rôles
├── models/          # Modèles Mongoose
│   ├── User.ts      # Modèle Utilisateur avec auth bcrypt
│   ├── Article.ts   # Modèle Article avec stock
│   ├── Client.ts    # Modèle Client avec adresse
│   └── Order.ts     # Modèle Commande avec relations
├── routes/          # Routes Express
│   ├── auth.ts      # Routes d'authentification (public)
│   ├── articles.ts  # Routes articles (protégées)
│   ├── clients.ts   # Routes clients (protégées)
│   └── orders.ts    # Routes commandes (protégées)
├── scripts/         # Scripts utilitaires
│   └── seed.ts      # Script de peuplement de la BDD
└── server.ts        # Point d'entrée avec CORS et cookies
```

## 🛣️ API Endpoints

### 🔐 Authentification (Routes publiques)

- `POST /api/auth/register` - Créer un compte utilisateur
- `POST /api/auth/login` - Se connecter
- `POST /api/auth/logout` - Se déconnecter
- `GET /api/auth/me` - Récupérer les infos utilisateur connecté

### Health Check

- `GET /api/health` - Vérification du statut de l'API

### 🔒 Routes Protégées (Authentification requise)

### Clients

- `GET /api/clients` - Liste tous les clients
- `GET /api/clients/:id` - Récupère un client par ID
- `POST /api/clients` - Crée un nouveau client
- `PUT /api/clients/:id` - Met à jour un client
- `DELETE /api/clients/:id` - Supprime un client

### Articles

- `GET /api/articles` - Liste tous les articles
- `GET /api/articles/:id` - Récupère un article par ID
- `POST /api/articles` - Crée un nouvel article
- `PUT /api/articles/:id` - Met à jour un article
- `DELETE /api/articles/:id` - Supprime un article

### Commandes

- `GET /api/orders` - Liste toutes les commandes (avec population)
- `GET /api/orders/:id` - Récupère une commande par ID
- `POST /api/orders` - Crée une nouvelle commande
- `PUT /api/orders/:id` - Met à jour une commande
- `DELETE /api/orders/:id` - Supprime une commande

## 📊 Modèles de données

### Utilisateur

```typescript
{
  nom: string;
  prenom: string;
  email: string; // unique
  motDePasse: string; // hashé avec bcrypt
  role: "admin" | "user";
  dateCreation: Date;
}
```

### Client

```typescript
{
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  adresse: {
    rue: string;
    ville: string;
    codePostal: string;
  }
  dateInscription: Date;
}
```

### Article

```typescript
{
  nom: string;
  description: string;
  prix: number;
  stock: number;
  couleur: string;
  marque: string;
  image?: string;
}
```

### Commande

```typescript
{
  client: ObjectId; // Référence vers Client
  articles: [{
    article: ObjectId; // Référence vers Article
    quantite: number;
    prixUnitaire: number;
  }];
  statut: "Demandée" | "En préparation" | "Expédiée" | "Récupérée" | "Annulée";
  montantTotal: number;
  dateCommande: Date;
}
```

## 🔐 Authentification

### Système de Tokens JWT

- **Cookies HttpOnly** - Les tokens sont stockés dans des cookies sécurisés
- **Expiration** - Tokens valides 7 jours
- **Middleware** - Protection automatique des routes sensibles
- **Rôles** - Support admin/user (extensible)

### Utilisation

```javascript
// Connexion
const response = await fetch("/api/auth/login", {
  method: "POST",
  credentials: "include", // Important pour les cookies
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, motDePasse }),
});

// Requêtes authentifiées
const clients = await fetch("/api/clients", {
  credentials: "include", // Le cookie sera envoyé automatiquement
});
```

## 🚦 Codes de réponse HTTP

- `200` - Succès
- `201` - Créé avec succès
- `400` - Erreur de requête
- `401` - Non authentifié
- `403` - Accès refusé
- `404` - Ressource non trouvée
- `500` - Erreur serveur

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
  -d '{"email":"john@example.com","motDePasse":"password123"}' \
  -c cookies.txt

# Utiliser les routes protégées
curl http://localhost:3000/api/clients -b cookies.txt
```

## 🚀 Démarrage rapide

```bash
# 1. Installer les dépendances
pnpm install

# 2. Configurer l'environnement
cp .env.example .env
# Éditer le fichier .env avec vos paramètres

# 3. Peupler la base de données
pnpm run seed

# 4. Démarrer le serveur
pnpm run dev
```

L'API sera disponible sur `http://localhost:3000` avec des données de test prêtes à utiliser !

## 👥 Auteurs

AGERON MICHALLON DUPERTHUY CAUVET

## 📄 Licence

ISC
