import mongoose, { Document, Schema } from "mongoose";

// Interface pour les produits dans une commande
export interface IOrderProduct {
  articleId: mongoose.Types.ObjectId;
  quantity: number;
}

// Interface pour les commandes
export interface IOrder extends Document {
  number: string;
  date: Date;
  status: string;
  clientId: mongoose.Types.ObjectId;
  products: IOrderProduct[];
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

// Statuts disponibles pour les commandes
const orderStatuses = [
  "Demandée",
  "En préparation",
  "Expédiée",
  "Récupérée",
  "Annulée",
];

// Schéma pour les produits dans une commande
const OrderProductSchema: Schema = new Schema({
  articleId: {
    type: Schema.Types.ObjectId,
    ref: "Article",
    required: [true, "L'article est requis"],
  },
  quantity: {
    type: Number,
    required: [true, "La quantité est requise"],
    min: [1, "La quantité doit être au moins de 1"],
    validate: {
      validator: Number.isInteger,
      message: "La quantité doit être un nombre entier",
    },
  },
});

// Schéma des commandes
const OrderSchema: Schema = new Schema(
  {
    number: {
      type: String,
      required: [true, "Le numéro de commande est requis"],
      unique: true,
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "La date est requise"],
      default: Date.now,
    },
    status: {
      type: String,
      required: [true, "Le statut est requis"],
      enum: {
        values: orderStatuses,
        message: "Statut non valide",
      },
      default: "Demandée",
    },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: [true, "Le client est requis"],
    },
    products: {
      type: [OrderProductSchema],
      required: [true, "Au moins un produit est requis"],
      validate: {
        validator: function (products: IOrderProduct[]) {
          return products && products.length > 0;
        },
        message: "Au moins un produit doit être ajouté à la commande",
      },
    },
    total: {
      type: Number,
      required: [true, "Le total est requis"],
      min: [0, "Le total ne peut pas être négatif"],
    },
  },
  {
    timestamps: true,
  }
);

// Index pour optimiser les recherches
OrderSchema.index({ number: 1 });
OrderSchema.index({ clientId: 1 });
OrderSchema.index({ date: -1 });
OrderSchema.index({ status: 1 });

// Middleware pour générer automatiquement le numéro de commande
OrderSchema.pre("save", async function (next) {
  if (!this.number) {
    const lastOrder = await mongoose
      .model("Order")
      .findOne({}, {}, { sort: { createdAt: -1 } });
    let nextNumber = 1;

    if (lastOrder && lastOrder.number) {
      const lastNumberStr = lastOrder.number.replace("CMD", "");
      const lastNumber = parseInt(lastNumberStr, 10);
      if (!isNaN(lastNumber)) {
        nextNumber = lastNumber + 1;
      }
    }

    this.number = `CMD${nextNumber.toString().padStart(3, "0")}`;
  }
  next();
});

export default mongoose.model<IOrder>("Order", OrderSchema);
