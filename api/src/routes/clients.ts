import express from "express";
import Client from "../models/Client";
import { auth } from "../middleware/auth";

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// GET /api/clients
router.get("/", async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des clients" });
  }
});

// GET /api/clients/:id
router.get("/:id", async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: "Client non trouvé" });
    }
    res.json(client);
  } catch {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération du client" });
  }
});

// POST /api/clients
router.post("/", async (req, res) => {
  try {
    const client = new Client(req.body);
    await client.save();
    res.status(201).json(client);
  } catch {
    res.status(400).json({ message: "Erreur lors de la création du client" });
  }
});

// PUT /api/clients/:id
router.put("/:id", async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!client) {
      return res.status(404).json({ message: "Client non trouvé" });
    }
    res.json(client);
  } catch {
    res
      .status(400)
      .json({ message: "Erreur lors de la mise à jour du client" });
  }
});

// DELETE /api/clients/:id
router.delete("/:id", async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) {
      return res.status(404).json({ message: "Client non trouvé" });
    }
    res.json({ message: "Client supprimé avec succès" });
  } catch {
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression du client" });
  }
});

export default router;
