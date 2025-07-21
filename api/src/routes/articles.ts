import express from "express";
import Article from "../models/Article";

const router = express.Router();

// GET /api/articles
router.get("/", async (req, res) => {
  try {
    const articles = await Article.find();
    res.json(articles);
  } catch {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des articles" });
  }
});

// GET /api/articles/:id
router.get("/:id", async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article non trouvé" });
    }
    res.json(article);
  } catch {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération de l'article" });
  }
});

// POST /api/articles
router.post("/", async (req, res) => {
  try {
    const article = new Article(req.body);
    await article.save();
    res.status(201).json(article);
  } catch {
    res
      .status(400)
      .json({ message: "Erreur lors de la création de l'article" });
  }
});

// PUT /api/articles/:id
router.put("/:id", async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!article) {
      return res.status(404).json({ message: "Article non trouvé" });
    }
    res.json(article);
  } catch {
    res
      .status(400)
      .json({ message: "Erreur lors de la mise à jour de l'article" });
  }
});

// DELETE /api/articles/:id
router.delete("/:id", async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article non trouvé" });
    }
    res.json({ message: "Article supprimé avec succès" });
  } catch {
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression de l'article" });
  }
});

export default router;
