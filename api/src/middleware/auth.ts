import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

interface AuthRequest extends Request {
  user?: IUser;
}

export const auth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Accès refusé. Aucun token fourni." });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback-secret"
    ) as { userId: string };
    const user = await User.findById(decoded.userId).select("-motDePasse");

    if (!user) {
      return res.status(401).json({ message: "Token invalide." });
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: "Token invalide." });
  }
};

export const adminAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    await auth(req, res, () => {
      if (req.user?.role !== "admin") {
        return res
          .status(403)
          .json({ message: "Accès refusé. Droits administrateur requis." });
      }
      next();
    });
  } catch {
    res.status(401).json({ message: "Erreur d'authentification." });
  }
};
