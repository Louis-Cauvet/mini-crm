import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
  authService,
  type User,
  type LoginData,
  type RegisterData,
} from "@/services/auth";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const initialized = ref(false);

  const isAuthenticated = computed(() => !!user.value);
  const isAdmin = computed(() => user.value?.role === "admin");

  const login = async (loginData: LoginData) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await authService.login(loginData);
      user.value = response.user;
      return { success: true };
    } catch (err: any) {
      error.value = err.response?.data?.message || "Erreur de connexion";
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  const register = async (registerData: RegisterData) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await authService.register(registerData);
      user.value = response.user;
      return { success: true };
    } catch (err: any) {
      error.value =
        err.response?.data?.message || "Erreur lors de la création du compte";
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Erreur lors de la déconnexion:", err);
    } finally {
      user.value = null;
      error.value = null;
    }
  };

  const checkAuth = async () => {
    if (initialized.value) return !!user.value;

    try {
      loading.value = true;
      const response = await authService.getMe();
      user.value = response.user;
      initialized.value = true;
      return true;
    } catch {
      user.value = null;
      initialized.value = true;
      return false;
    } finally {
      loading.value = false;
    }
  };

  const clearError = () => {
    error.value = null;
  };

  return {
    user,
    loading,
    error,
    initialized,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    checkAuth,
    clearError,
  };
});
