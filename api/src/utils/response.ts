import { Response } from "express";

export interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Réponse de succès
export const sendSuccessResponse = (
  res: Response,
  data: any = null,
  message: string = "Succès",
  statusCode: number = 200
): Response => {
  const response: ApiResponse = {
    success: true,
    message,
    data,
  };

  return res.status(statusCode).json(response);
};

// Réponse d'erreur
export const sendErrorResponse = (
  res: Response,
  error: string,
  statusCode: number = 500,
  data: any = null
): Response => {
  const response: ApiResponse = {
    success: false,
    error,
    ...(data && { data }),
  };

  return res.status(statusCode).json(response);
};

// Réponse avec pagination
export const sendPaginatedResponse = (
  res: Response,
  data: any[],
  page: number,
  limit: number,
  total: number,
  message: string = "Succès"
): Response => {
  const response: ApiResponse = {
    success: true,
    message,
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };

  return res.status(200).json(response);
};
