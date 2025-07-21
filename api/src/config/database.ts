import mongoose from "mongoose";

export const connectToDatabase = async (): Promise<void> => {
  try {
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/mini-crm";

    await mongoose.connect(mongoURI);

    console.log("✅ Connexion à MongoDB réussie");

    // Gestion des événements de connexion
    mongoose.connection.on("error", (error) => {
      console.error("❌ Erreur de connexion MongoDB:", error);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️  Connexion MongoDB fermée");
    });

    // Fermeture propre lors de l'arrêt de l'application
    process.on("SIGINT", async () => {
      try {
        await mongoose.connection.close();
        console.log(
          "🔒 Connexion MongoDB fermée suite à l'arrêt de l'application"
        );
        process.exit(0);
      } catch (error) {
        console.error("❌ Erreur lors de la fermeture de la connexion:", error);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error("❌ Impossible de se connecter à MongoDB:", error);
    throw error;
  }
};
