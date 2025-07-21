import express from "express";
import Order from "../models/Order";
import { auth } from "../middleware/auth";

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// GET /api/orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("client", "nom prenom email")
      .populate("articles.article", "nom prix");
    res.json(orders);
  } catch {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des commandes" });
  }
});

// GET /api/orders/:id
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("client")
      .populate("articles.article");
    if (!order) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }
    res.json(order);
  } catch {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération de la commande" });
  }
});

// POST /api/orders
router.post("/", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    await order.populate("client", "nom prenom email");
    await order.populate("articles.article", "nom prix");
    res.status(201).json(order);
  } catch {
    res
      .status(400)
      .json({ message: "Erreur lors de la création de la commande" });
  }
});

// PUT /api/orders/:id
router.put("/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .populate("client", "nom prenom email")
      .populate("articles.article", "nom prix");
    if (!order) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }
    res.json(order);
  } catch {
    res
      .status(400)
      .json({ message: "Erreur lors de la mise à jour de la commande" });
  }
});

// DELETE /api/orders/:id
router.delete("/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }
    res.json({ message: "Commande supprimée avec succès" });
  } catch {
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression de la commande" });
  }
});

export default router;
