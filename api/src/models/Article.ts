import mongoose, { Schema, Document } from "mongoose";

export interface IArticle extends Document {
  nom: string;
  description: string;
  prix: number;
  stock: number;
  couleur: string;
  marque: string;
  image?: string;
}

const ArticleSchema = new Schema<IArticle>(
  {
    nom: { type: String, required: true },
    description: { type: String, required: true },
    prix: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    couleur: { type: String, required: true },
    marque: { type: String, required: true },
    image: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IArticle>("Article", ArticleSchema);
