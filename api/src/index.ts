import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { connectToDatabase } from "./config/database";
import { errorHandler } from "./middleware/errorHandler";

// Chargement des variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration du rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite chaque IP à 100 requêtes par fenêtre de temps
  message: "Trop de requêtes depuis cette IP, réessayez plus tard.",
});

// Middlewares de sécurité
app.use(helmet());
app.use(limiter);

// Configuration CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

// Middlewares pour parser le JSON
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes de base
app.get("/health", (_req, res) => {
  res.status(200).json({
    message: "Mini CRM API is running!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// TODO: Ajouter les routes API ici
// app.use('/api/auth', authRoutes);
// app.use('/api/clients', clientRoutes);
// app.use('/api/articles', articleRoutes);
// app.use('/api/orders', orderRoutes);

// Middleware de gestion des erreurs (doit être en dernier)
app.use(errorHandler);

// Route 404 pour les routes non trouvées
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route non trouvée",
    path: req.originalUrl,
  });
});

// Démarrage du serveur
const startServer = async () => {
  try {
    // Connexion à MongoDB
    await connectToDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error("❌ Erreur lors du démarrage du serveur:", error);
    process.exit(1);
  }
};

startServer();
