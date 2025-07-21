import mongoose, { Schema, Document } from "mongoose";

export interface IClient extends Document {
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  adresse: {
    rue: string;
    ville: string;
    codePostal: string;
  };
  dateInscription: Date;
}

const ClientSchema = new Schema<IClient>(
  {
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    telephone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    adresse: {
      rue: { type: String, required: true },
      ville: { type: String, required: true },
      codePostal: { type: String, required: true },
    },
    dateInscription: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IClient>("Client", ClientSchema);
