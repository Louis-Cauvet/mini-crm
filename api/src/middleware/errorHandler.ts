import { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let { statusCode = 500, message } = err;

  // Log de l'erreur pour le développement
  if (process.env.NODE_ENV !== "production") {
    console.error("🔴 Erreur:", {
      message: err.message,
      stack: err.stack,
      url: req.url,
      method: req.method,
    });
  }

  // Erreurs spécifiques à MongoDB
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Données invalides";
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = "Ressource non trouvée";
  } else if (err.name === "MongoServerError" && (err as any).code === 11000) {
    statusCode = 400;
    message = "Cette ressource existe déjà";
  }

  // En production, ne pas exposer les détails des erreurs
  if (process.env.NODE_ENV === "production" && statusCode === 500) {
    message = "Une erreur serveur s'est produite";
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
