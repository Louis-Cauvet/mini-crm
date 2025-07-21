# Mini CRM API

Backend API pour le système Mini CRM développé avec Node.js, Express, TypeScript et MongoDB.

## 🚀 Technologies

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **TypeScript** - Typage statique
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM pour MongoDB

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

## 📁 Structure du projet

```text
src/
├── models/          # Modèles Mongoose
│   ├── Article.ts   # Modèle Article
│   ├── Client.ts    # Modèle Client
│   └── Order.ts     # Modèle Commande
├── routes/          # Routes Express
│   ├── articles.ts  # Routes articles
│   ├── clients.ts   # Routes clients
│   └── orders.ts    # Routes commandes
└── server.ts        # Point d'entrée
```

## 🛣️ API Endpoints

### Health Check

- `GET /api/health` - Vérification du statut de l'API

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

## 🚦 Codes de réponse HTTP

- `200` - Succès
- `201` - Créé avec succès
- `400` - Erreur de requête
- `404` - Ressource non trouvée
- `500` - Erreur serveur

## 🧪 Test de l'API

Vous pouvez tester l'API avec des outils comme Postman, Insomnia ou curl :

```bash
# Test de santé
curl http://localhost:3000/api/health

# Récupérer tous les clients
curl http://localhost:3000/api/clients
```

## 👥 Auteurs

AGERON MICHALLON DUPERTHUY CAUVET

## 📄 Licence

ISC
