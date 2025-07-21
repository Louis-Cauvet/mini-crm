import axios from "axios";

const API_URL = "http://localhost:3000/api";

// Configure axios to include cookies
axios.defaults.withCredentials = true;

export interface OrderItem {
  article: {
    _id: string;
    nom: string;
    prix: number;
    marque: string;
    couleur: string;
    stock: number;
    image?: string;
  };
  quantite: number;
  prixUnitaire: number;
}

export interface Order {
  _id: string;
  client: {
    _id: string;
    nom: string;
    prenom: string;
    email: string;
  };
  articles: OrderItem[];
  statut: "Demandée" | "En préparation" | "Expédiée" | "Récupérée" | "Annulée";
  montantTotal: number;
  dateCommande: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderCreateData {
  client: string;
  articles: { article: string; quantite: number; prixUnitaire: number }[];
  statut: string;
  montantTotal: number;
}

export interface OrderUpdateData {
  client?: string;
  articles?: { article: string; quantite: number; prixUnitaire: number }[];
  statut?: string;
  montantTotal?: number;
}

export const orderService = {
  async getOrders(): Promise<Order[]> {
    const response = await axios.get(`${API_URL}/orders`);
    return response.data;
  },

  async getOrder(id: string): Promise<Order> {
    const response = await axios.get(`${API_URL}/orders/${id}`);
    return response.data;
  },

  async createOrder(orderData: OrderCreateData): Promise<Order> {
    const response = await axios.post(`${API_URL}/orders`, orderData);
    return response.data;
  },

  async updateOrder(id: string, orderData: OrderUpdateData): Promise<Order> {
    const response = await axios.put(`${API_URL}/orders/${id}`, orderData);
    return response.data;
  },

  async deleteOrder(id: string): Promise<void> {
    await axios.delete(`${API_URL}/orders/${id}`);
  },
};
