import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";

// Configuration d'axios avec les cookies
axios.defaults.withCredentials = true;

export interface Article {
  _id?: string;
  nom: string;
  description: string;
  prix: number;
  stock: number;
  couleur: string;
  marque: string;
  image?: string;
}

export interface CreateArticleData {
  nom: string;
  description: string;
  prix: number;
  stock: number;
  couleur: string;
  marque: string;
  image?: string;
}

class ArticleService {
  async getArticles(): Promise<Article[]> {
    const response = await axios.get(`${API_BASE_URL}/articles`);
    return response.data;
  }

  async getArticle(id: string): Promise<Article> {
    const response = await axios.get(`${API_BASE_URL}/articles/${id}`);
    return response.data;
  }

  async createArticle(data: CreateArticleData): Promise<Article> {
    const response = await axios.post(`${API_BASE_URL}/articles`, data);
    return response.data;
  }

  async updateArticle(
    id: string,
    data: Partial<CreateArticleData>
  ): Promise<Article> {
    const response = await axios.put(`${API_BASE_URL}/articles/${id}`, data);
    return response.data;
  }

  async deleteArticle(id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/articles/${id}`);
  }
}

export const articleService = new ArticleService();
