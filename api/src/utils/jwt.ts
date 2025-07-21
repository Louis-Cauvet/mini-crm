import jwt from "jsonwebtoken";

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

// Génération d'un token JWT
export const generateToken = (payload: JwtPayload): string => {
  const secret = process.env.JWT_SECRET || "your-fallback-secret-key";

  return jwt.sign(payload, secret, {
    expiresIn: "7d", // Token expire dans 7 jours
  });
};

// Vérification d'un token JWT
export const verifyToken = (token: string): JwtPayload => {
  const secret = process.env.JWT_SECRET || "your-fallback-secret-key";

  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch {
    throw new Error("Token invalide ou expiré");
  }
};
