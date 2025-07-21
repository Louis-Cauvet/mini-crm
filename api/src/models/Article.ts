import mongoose, { Document, Schema } from "mongoose";

// Interface pour les articles
export interface IArticle extends Document {
  name: string;
  brand: string;
  price: number;
  image?: string;
  color: string;
  description?: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

// Couleurs disponibles
const availableColors = [
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "orange",
  "grey",
  "black",
  "white",
];

// Schéma des articles
const ArticleSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom de l'article est requis"],
      trim: true,
      maxlength: [100, "Le nom ne peut pas dépasser 100 caractères"],
    },
    brand: {
      type: String,
      required: [true, "La marque est requise"],
      trim: true,
      maxlength: [50, "La marque ne peut pas dépasser 50 caractères"],
    },
    price: {
      type: Number,
      required: [true, "Le prix est requis"],
      min: [0, "Le prix ne peut pas être négatif"],
    },
    image: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      required: [true, "La couleur est requise"],
      enum: {
        values: availableColors,
        message: "Couleur non valide",
      },
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "La description ne peut pas dépasser 500 caractères"],
    },
    stock: {
      type: Number,
      required: [true, "Le stock est requis"],
      min: [0, "Le stock ne peut pas être négatif"],
      validate: {
        validator: Number.isInteger,
        message: "Le stock doit être un nombre entier",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index pour optimiser les recherches
ArticleSchema.index({ name: 1 });
ArticleSchema.index({ brand: 1 });
ArticleSchema.index({ color: 1 });

export default mongoose.model<IArticle>("Article", ArticleSchema);
