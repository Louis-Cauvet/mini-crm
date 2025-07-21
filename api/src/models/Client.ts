import mongoose, { Document, Schema } from "mongoose";

// Interface pour les clients
export interface IClient extends Document {
  firstname: string;
  lastname: string;
  company: string;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schéma des clients
const ClientSchema: Schema = new Schema(
  {
    firstname: {
      type: String,
      required: [true, "Le prénom est requis"],
      trim: true,
      maxlength: [50, "Le prénom ne peut pas dépasser 50 caractères"],
    },
    lastname: {
      type: String,
      required: [true, "Le nom est requis"],
      trim: true,
      maxlength: [50, "Le nom ne peut pas dépasser 50 caractères"],
    },
    company: {
      type: String,
      required: [true, "La société est requise"],
      trim: true,
      maxlength: [
        100,
        "Le nom de la société ne peut pas dépasser 100 caractères",
      ],
    },
    email: {
      type: String,
      required: [true, "L'email est requis"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Veuillez fournir un email valide",
      ],
    },
    phone: {
      type: String,
      required: [true, "Le téléphone est requis"],
      match: [/^\d{10}$/, "Le numéro de téléphone doit contenir 10 chiffres"],
    },
  },
  {
    timestamps: true,
  }
);

// Index pour optimiser les recherches
ClientSchema.index({ email: 1 });
ClientSchema.index({ lastname: 1, firstname: 1 });

export default mongoose.model<IClient>("Client", ClientSchema);
