import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem {
  article: mongoose.Types.ObjectId;
  quantite: number;
  prixUnitaire: number;
}

export interface IOrder extends Document {
  client: mongoose.Types.ObjectId;
  articles: IOrderItem[];
  statut: "Demandée" | "En préparation" | "Expédiée" | "Récupérée" | "Annulée";
  montantTotal: number;
  dateCommande: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    article: { type: Schema.Types.ObjectId, ref: "Article", required: true },
    quantite: { type: Number, required: true },
    prixUnitaire: { type: Number, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    client: { type: Schema.Types.ObjectId, ref: "Client", required: true },
    articles: [OrderItemSchema],
    statut: {
      type: String,
      enum: ["Demandée", "En préparation", "Expédiée", "Récupérée", "Annulée"],
      default: "Demandée",
    },
    montantTotal: { type: Number, required: true },
    dateCommande: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IOrder>("Order", OrderSchema);
