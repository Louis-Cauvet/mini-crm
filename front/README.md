# Mini CRM - Frontend

Une application web moderne de gestion de la relation client (CRM) développée avec Vue.js 3, TypeScript et Vuetify.

## 🚀 Fonctionnalités

### ✨ Interface Utilisateur

- **Design Material** avec Vuetify 3
- **Interface responsive** adaptée mobile et desktop
- **Navigation intuitive** avec sidebar et header
- **Animations fluides** et transitions modernes

### 👥 Gestion des Clients

- Liste complète des clients avec pagination
- Fiche détaillée de chaque client
- Ajout, modification et suppression de clients
- Formatage automatique des numéros de téléphone
- Historique des commandes par client

### 📦 Gestion des Articles

- Catalogue d'articles avec images, prix et stock
- Gestion des couleurs avec sélection visuelle
- Upload d'images pour les articles
- Suivi en temps réel du stock disponible
- Validation des données et gestion des erreurs

### 📋 Gestion des Commandes

- Création et édition complète des commandes
- Gestion des statuts (Demandée, En préparation, Expédiée, Récupérée, Annulée)
- Calcul automatique du montant total
- Association clients-articles avec quantités
- Validation du stock lors de l'ajout de produits

### 📊 Dashboard et Analytics

- Vue d'ensemble avec résumés des données
- Graphiques interactifs (Chart.js) :
  - Quantités vendues par article
  - Chiffre d'affaires par produit
- Affichage des données récentes (clients, articles, commandes)
- Statistiques en temps réel

### 🔐 Authentification

- Pages de connexion et d'enregistrement
- Formulaires avec validation complète
- Design cohérent avec interface gradient

## 🛠️ Stack Technique

### Core

- **Vue 3** (Composition API avec `<script setup>`)
- **TypeScript** pour la sécurité des types
- **Vite** pour le build ultra-rapide
- **PNPM** comme gestionnaire de paquets

### UI/UX

- **Vuetify 3** (Material Design)
- **Material Design Icons** (@mdi/font)
- **Vue Router 4** pour la navigation
- **Responsive design** pour tous écrans

### State & Data

- **Pinia** pour la gestion d'état
- **Axios** pour les requêtes HTTP
- **Chart.js & Vue-ChartJS** pour les graphiques
- **Validation formulaires** intégrée

## 📁 Architecture du Projet

```text
src/
├── assets/                 # Images et ressources statiques
│   └── logo.png
├── components/             # Composants réutilisables
│   ├── HeaderBar.vue      # Barre de navigation supérieure
│   └── Sidebar.vue        # Menu de navigation latéral
├── plugins/
│   └── vuetify.ts         # Configuration Vuetify
├── router/
│   └── index.ts           # Configuration des routes avec lazy loading
├── views/                 # Pages/vues de l'application
│   ├── auth/              # Pages d'authentification
│   │   ├── LoginView.vue
│   │   └── RegisterView.vue
│   ├── ArticlesView.vue   # Gestion complète des articles
│   ├── ClientsView.vue    # Gestion des clients
│   ├── ClientDetailsView.vue  # Détails et édition client
│   ├── HomeView.vue       # Dashboard principal avec analytics
│   ├── OrdersView.vue     # Gestion des commandes
│   └── OrderDetailsView.vue   # Détails et édition commande
├── App.vue                # Composant racine avec layout conditionnel
├── main.ts               # Point d'entrée avec configuration
├── style.css             # Styles globaux
└── vite-env.d.ts         # Types TypeScript pour Vite
```

## 🚀 Installation et Développement

### Prérequis

- Node.js 16+
- PNPM (recommandé) ou NPM

### Installation

```bash
# Installation des dépendances
pnpm install

# Ou avec npm
npm install
```

### Scripts de développement

```bash
# Serveur de développement avec hot reload
pnpm dev

# Build de production optimisé
pnpm build

# Prévisualisation du build de production
pnpm preview
```

L'application sera accessible sur `http://localhost:5173`

## 🎯 Fonctionnalités Techniques

### Validation des Données

- **Formulaires réactifs** avec validation en temps réel
- **Messages d'erreur contextuels** pour chaque champ
- **Contrôles de cohérence** (stock, quantités, etc.)

### Gestion du State

- **Données locales** simulant une API backend
- **Structure préparée** pour intégration API REST
- **Réactivité complète** avec Vue 3 Composition API

### Performance

- **Lazy loading** des routes pour optimiser le chargement
- **Code splitting** automatique avec Vite
- **Composants optimisés** pour le rendu
- **Build minifié** avec tree-shaking

### User Experience

- **Interface responsive** adaptative
- **Feedback visuel** pour toutes les actions
- **Navigation cohérente** avec état actif
- **Gestion des erreurs** utilisateur-friendly

## 🔧 Configuration

### Vuetify

Configuration complète dans `src/plugins/vuetify.ts` avec :

- Import des composants et directives
- Thème Material Design personnalisé
- Icônes Material Design intégrées

### Routing

Routes définies dans `src/router/index.ts` avec :

- Lazy loading pour toutes les pages
- Routes imbriquées pour les détails
- Navigation programmatique intégrée

### Build

Configuration Vite dans `vite.config.ts` avec :

- Alias `@` pour les imports absolus
- Plugin Vue avec support TypeScript
- Optimisations de production

## 🎨 Design System

### Couleurs

- **Palette cohérente** Material Design
- **Code couleur** pour les statuts et types
- **Contraste optimisé** pour l'accessibilité

### Composants

- **Cards** pour l'organisation du contenu
- **Data Tables** avec tri et pagination
- **Formulaires** avec validation visuelle
- **Dialogs** pour les actions importantes

### Icônes

- **Material Design Icons** pour cohérence
- **Icônes contextuelles** pour chaque action
- **Tailles adaptatives** selon le contexte

## 📊 Données et État

### Structure des Données

```typescript
// Client
interface Client {
  id: number;
  firstname: string;
  lastname: string;
  company: string;
  email: string;
  phone: string;
}

// Article
interface Article {
  id: number;
  name: string;
  brand: string;
  price: number;
  image: string;
  color: string;
  description: string;
  stock: number;
}

// Commande
interface Order {
  id: number;
  number: string;
  date: string;
  status: string;
  clientId: number;
  productsList: { id: number; qty: number }[];
  total: number;
}
```

### État de l'Application

- **Données réactives** avec Vue 3 ref/reactive
- **Computed properties** pour les calculs
- **Watchers** pour les synchronisations
- **Provide/Inject** pour le state global

## 🚧 Évolutions Prévues

### Backend Integration

- **API REST** complète
- **Authentification JWT**
- **Base de données** persistante
- **Middleware** de validation

### Fonctionnalités Avancées

- **Export PDF/Excel** des données
- **Notifications** en temps réel
- **Recherche avancée** et filtres
- **Mode hors-ligne** avec synchronisation

### Performance & Monitoring

- **Cache intelligent** des données
- **Lazy loading** des images
- **Analytics** d'utilisation
- **Monitoring** des performances

---

## 👨‍💻 Équipe de Développement

### **AGERON MICHALLON DUPERTHUY CAUVET**

Une application développée avec ❤️ en Vue.js 3 et TypeScript.
