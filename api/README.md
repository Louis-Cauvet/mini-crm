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
npm install
# ou
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
npm run dev

# Build de production
npm run build

# Démarrage production
npm start

# Nettoyage
npm run clean
```

## 🗄️ Données de test

### Peupler la base de données

Pour faciliter le développement et les tests, un script de seed est disponible pour remplir la base de données avec des données de test :

```bash
# En mode développement
npm run seed

# En production (après build)
npm run build
npm run seed:prod
```

### Données générées

Le script crée :

- **3 utilisateurs** avec différents rôles
- **5 clients** avec des informations complètes
- **10 articles** variés (informatique, téléphones, accessoires)
- **5 commandes** avec différents statuts

### Comptes de test

Après le seeding, vous pouvez vous connecter avec :

| Rôle  | Email                     | Mot de passe | Description           |
| ----- | ------------------------- | ------------ | --------------------- |
| Admin | `admin@minicrm.com`       | `admin123`   | Compte administrateur |
| User  | `user@minicrm.com`        | `user123`    | Utilisateur standard  |
| User  | `paul.ageron@minicrm.com` | `paul123`    | Utilisateur de test   |

### Données d'exemple

**Clients :**

- Louis Cauvet (OpenAI) - Paris
- Emma Dubois (TechCorp) - Lyon
- Paul Martin (StartupX) - Toulouse
- Sophie Leroy (InnovTech) - Bordeaux
- Thomas Moreau (DigitalCorp) - Marseille

**Articles :**

- MacBook Pro 16", iPhone 15 Pro, Samsung Galaxy S24
- Dell XPS 13, iPad Air, AirPods Pro
- Moniteur 4K, Clavier mécanique, Souris gaming
- Disque SSD 1To

**Commandes :**

- Commandes avec différents statuts (Demandée, En préparation, Expédiée, Récupérée)
- Montants variés de 1 246€ à 2 778€
- Dates échelonnées sur novembre-décembre 2024

## 📁 Structure du projet

```text
src/
├── middleware/      # Middlewares personnalisés
│   └── auth.ts      # Middleware d'authentification
├── models/          # Modèles Mongoose
│   ├── User.ts      # Modèle Utilisateur
│   ├── Article.ts   # Modèle Article
│   ├── Client.ts    # Modèle Client
│   └── Order.ts     # Modèle Commande
├── routes/          # Routes Express
│   ├── auth.ts      # Routes d'authentification
│   ├── articles.ts  # Routes articles (protégées)
│   ├── clients.ts   # Routes clients (protégées)
│   └── orders.ts    # Routes commandes (protégées)
└── server.ts        # Point d'entrée
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
npm install

# 2. Configurer l'environnement
cp .env.example .env
# Éditer le fichier .env avec vos paramètres

# 3. Peupler la base de données
npm run seed

# 4. Démarrer le serveur
npm run dev
```

L'API sera disponible sur `http://localhost:3000` avec des données de test prêtes à utiliser !

## 👥 Auteurs

AGERON MICHALLON DUPERTHUY CAUVET

## 📄 Licence

ISC
