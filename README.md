# Mini CRM

Un système de gestion de la relation client (CRM) développé avec Vue.js 3 et TypeScript, utilisant Vuetify comme framework UI.

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

### Développement

- **Vue TSC** - Compilateur TypeScript pour Vue
- **Material Design Icons** - Icônes

## 📁 Structure du Projet

```
mini-crm/
├── api/                        # Dossier API (vide actuellement)
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
- PNPM (gestionnaire de paquets recommandé)

### Installation

1. **Cloner le repository :**

```bash
git clone https://github.com/Louis-Cauvet/mini-crm.git
cd mini-crm
```

2. **Installer les dépendances :**

```bash
cd front
pnpm install
```

### Scripts disponibles

```bash
# Lancement en mode développement
pnpm dev

# Build de production
pnpm build

# Prévisualisation du build de production
pnpm preview
```

L'application sera accessible sur `http://localhost:5173` par défaut.

## 📱 Interface Utilisateur

### Navigation

- **Menu latéral** : Navigation principale entre les sections
- **Header** : Informations utilisateur et déconnexion
- **Responsive** : Interface adaptée mobile et desktop

### Pages principales

1. **Dashboard (/)**

   - Résumé des clients, articles et commandes
   - Graphiques des ventes et chiffre d'affaires

2. **Clients (/clients)**

   - Liste paginée des clients
   - Actions : Voir, Modifier, Supprimer

3. **Articles (/articles)**

   - Catalogue avec images et informations
   - Gestion du stock et des couleurs

4. **Commandes (/commandes)**

   - Liste des commandes avec statuts
   - Gestion complète des commandes

5. **Authentification (/connexion, /enregistrement)**
   - Formulaires de connexion et inscription

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

- Le dossier `api/` est prévu pour le développement du backend
- Intégration avec une base de données
- Authentification JWT
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
