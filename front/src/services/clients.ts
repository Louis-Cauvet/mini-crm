import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";

// Configuration d'axios avec les cookies
axios.defaults.withCredentials = true;

export interface Client {
  _id?: string;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  adresse: {
    rue: string;
    ville: string;
    codePostal: string;
  };
  dateInscription?: Date;
}

export interface CreateClientData {
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  adresse: {
    rue: string;
    ville: string;
    codePostal: string;
  };
}

class ClientService {
  async getClients(): Promise<Client[]> {
    const response = await axios.get(`${API_BASE_URL}/clients`);
    return response.data;
  }

  async getClient(id: string): Promise<Client> {
    const response = await axios.get(`${API_BASE_URL}/clients/${id}`);
    return response.data;
  }

  async createClient(data: CreateClientData): Promise<Client> {
    const response = await axios.post(`${API_BASE_URL}/clients`, data);
    return response.data;
  }

  async updateClient(
    id: string,
    data: Partial<CreateClientData>
  ): Promise<Client> {
    const response = await axios.put(`${API_BASE_URL}/clients/${id}`, data);
    return response.data;
  }

  async deleteClient(id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/clients/${id}`);
  }
}

export const clientService = new ClientService();
