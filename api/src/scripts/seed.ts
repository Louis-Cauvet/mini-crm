import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User";
import Client from "../models/Client";
import Article from "../models/Article";
import Order from "../models/Order";

dotenv.config();

const seedData = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/mini-crm"
    );
    console.log("✅ Connecté à MongoDB");

    // Nettoyer la base de données existante
    await Promise.all([
      Client.deleteMany({}),
      Article.deleteMany({}),
      Order.deleteMany({}),
    ]);
    console.log("🧹 Base de données nettoyée");

    // 1. Créer des utilisateurs
    const users = [
      {
        nom: "Admin",
        prenom: "Super",
        email: "admin@minicrm.com",
        motDePasse: "admin123",
        role: "admin" as const,
      },
      {
        nom: "Utilisateur",
        prenom: "Test",
        email: "user@minicrm.com",
        motDePasse: "user123",
        role: "user" as const,
      },
      {
        nom: "Ageron",
        prenom: "Paul",
        email: "paul.ageron@minicrm.com",
        motDePasse: "paul123",
        role: "user" as const,
      },
    ];

    const createdUsers = await User.create(users);
    console.log(`👤 ${createdUsers.length} utilisateurs créés`);

    // 2. Créer des clients
    const clients = [
      {
        nom: "Cauvet",
        prenom: "Louis",
        email: "louis.cauvet@openai.com",
        telephone: "0601020304",
        adresse: {
          rue: "123 Avenue des Champs-Élysées",
          ville: "Paris",
          codePostal: "75008",
        },
      },
      {
        nom: "Dubois",
        prenom: "Emma",
        email: "emma.dubois@techcorp.com",
        telephone: "0605060708",
        adresse: {
          rue: "456 Rue de la République",
          ville: "Lyon",
          codePostal: "69001",
        },
      },
      {
        nom: "Martin",
        prenom: "Paul",
        email: "paul.martin@startupx.fr",
        telephone: "0611223344",
        adresse: {
          rue: "789 Boulevard Saint-Michel",
          ville: "Toulouse",
          codePostal: "31000",
        },
      },
      {
        nom: "Leroy",
        prenom: "Sophie",
        email: "sophie.leroy@innovtech.com",
        telephone: "0698765432",
        adresse: {
          rue: "321 Rue Victor Hugo",
          ville: "Bordeaux",
          codePostal: "33000",
        },
      },
      {
        nom: "Moreau",
        prenom: "Thomas",
        email: "thomas.moreau@digitalcorp.fr",
        telephone: "0612345678",
        adresse: {
          rue: "654 Avenue de la Liberté",
          ville: "Marseille",
          codePostal: "13001",
        },
      },
    ];

    const createdClients = await Client.create(clients);
    console.log(`👥 ${createdClients.length} clients créés`);

    // 3. Créer des articles
    const articles = [
      {
        nom: 'MacBook Pro 16"',
        description: "Ordinateur portable haute performance avec puce M3 Pro",
        prix: 2499,
        stock: 15,
        couleur: "grey",
        marque: "Apple",
        image: "https://picsum.photos/300/300?random=1",
      },
      {
        nom: "iPhone 15 Pro",
        description: "Smartphone dernière génération avec caméra pro",
        prix: 1199,
        stock: 25,
        couleur: "black",
        marque: "Apple",
        image: "https://picsum.photos/300/300?random=2",
      },
      {
        nom: "Samsung Galaxy S24",
        description: "Smartphone Android haut de gamme",
        prix: 899,
        stock: 20,
        couleur: "blue",
        marque: "Samsung",
        image: "https://picsum.photos/300/300?random=3",
      },
      {
        nom: "Dell XPS 13",
        description: "Ultrabook professionnel compact et puissant",
        prix: 1299,
        stock: 12,
        couleur: "white",
        marque: "Dell",
        image: "https://picsum.photos/300/300?random=4",
      },
      {
        nom: "iPad Air",
        description: "Tablette polyvalente pour créatifs et professionnels",
        prix: 649,
        stock: 30,
        couleur: "grey",
        marque: "Apple",
        image: "https://picsum.photos/300/300?random=5",
      },
      {
        nom: "AirPods Pro",
        description: "Écouteurs sans fil avec réduction de bruit active",
        prix: 279,
        stock: 50,
        couleur: "white",
        marque: "Apple",
        image: "https://picsum.photos/300/300?random=6",
      },
      {
        nom: 'Moniteur 4K 27"',
        description: "Écran professionnel haute résolution",
        prix: 399,
        stock: 18,
        couleur: "black",
        marque: "LG",
        image: "https://picsum.photos/300/300?random=7",
      },
      {
        nom: "Clavier mécanique",
        description: "Clavier gaming RGB avec switches Cherry MX",
        prix: 149,
        stock: 35,
        couleur: "black",
        marque: "Corsair",
        image: "https://picsum.photos/300/300?random=8",
      },
      {
        nom: "Souris gaming",
        description: "Souris haute précision pour gamers",
        prix: 89,
        stock: 40,
        couleur: "black",
        marque: "Logitech",
        image: "https://picsum.photos/300/300?random=9",
      },
      {
        nom: "Disque SSD 1To",
        description: "Stockage SSD externe ultra-rapide",
        prix: 129,
        stock: 25,
        couleur: "blue",
        marque: "Samsung",
        image: "https://picsum.photos/300/300?random=10",
      },
    ];

    const createdArticles = await Article.create(articles);
    console.log(`📦 ${createdArticles.length} articles créés`);

    // 4. Créer des commandes
    const orders = [
      {
        client: createdClients[0]._id,
        articles: [
          {
            article: createdArticles[0]._id, // MacBook Pro
            quantite: 1,
            prixUnitaire: 2499,
          },
          {
            article: createdArticles[5]._id, // AirPods Pro
            quantite: 1,
            prixUnitaire: 279,
          },
        ],
        statut: "Expédiée" as const,
        montantTotal: 2778,
        dateCommande: new Date("2024-12-01"),
      },
      {
        client: createdClients[1]._id,
        articles: [
          {
            article: createdArticles[1]._id, // iPhone 15 Pro
            quantite: 2,
            prixUnitaire: 1199,
          },
        ],
        statut: "En préparation" as const,
        montantTotal: 2398,
        dateCommande: new Date("2024-12-10"),
      },
      {
        client: createdClients[2]._id,
        articles: [
          {
            article: createdArticles[3]._id, // Dell XPS 13
            quantite: 1,
            prixUnitaire: 1299,
          },
          {
            article: createdArticles[6]._id, // Moniteur 4K
            quantite: 1,
            prixUnitaire: 399,
          },
          {
            article: createdArticles[7]._id, // Clavier mécanique
            quantite: 1,
            prixUnitaire: 149,
          },
        ],
        statut: "Récupérée" as const,
        montantTotal: 1847,
        dateCommande: new Date("2024-11-25"),
      },
      {
        client: createdClients[3]._id,
        articles: [
          {
            article: createdArticles[4]._id, // iPad Air
            quantite: 3,
            prixUnitaire: 649,
          },
        ],
        statut: "Demandée" as const,
        montantTotal: 1947,
        dateCommande: new Date("2024-12-15"),
      },
      {
        client: createdClients[4]._id,
        articles: [
          {
            article: createdArticles[2]._id, // Samsung Galaxy S24
            quantite: 1,
            prixUnitaire: 899,
          },
          {
            article: createdArticles[8]._id, // Souris gaming
            quantite: 1,
            prixUnitaire: 89,
          },
          {
            article: createdArticles[9]._id, // Disque SSD
            quantite: 2,
            prixUnitaire: 129,
          },
        ],
        statut: "Expédiée" as const,
        montantTotal: 1246,
        dateCommande: new Date("2024-12-05"),
      },
    ];

    const createdOrders = await Order.create(orders);
    console.log(`📋 ${createdOrders.length} commandes créées`);

    console.log("\n🎉 Données de test créées avec succès !");
    console.log("\n📋 Résumé :");
    console.log(`   👤 Utilisateurs: ${createdUsers.length}`);
    console.log(`   👥 Clients: ${createdClients.length}`);
    console.log(`   📦 Articles: ${createdArticles.length}`);
    console.log(`   📋 Commandes: ${createdOrders.length}`);

    console.log("\n🔑 Comptes de connexion :");
    console.log("   👑 Admin: admin@minicrm.com / admin123");
    console.log("   👤 User: user@minicrm.com / user123");
    console.log("   👤 Paul: paul.ageron@minicrm.com / paul123");

    await mongoose.connection.close();
    console.log("\n✅ Connexion fermée");
  } catch (error) {
    console.error("❌ Erreur lors du seeding:", error);
    process.exit(1);
  }
};

// Exécuter le script si appelé directement
if (require.main === module) {
  seedData();
}

export default seedData;
