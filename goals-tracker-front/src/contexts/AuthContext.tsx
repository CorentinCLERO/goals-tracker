import React, { useState, useEffect } from "react";
import type { User } from "../types";
import { apiClient } from "../lib/api";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const checkAuth = async () => {
      const token = localStorage.getItem("auth_token");
      if (token) {
        try {
          const userData = await apiClient.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error("Failed to get current user:", error);
          // Token might be invalid, clear it
          apiClient.logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      await apiClient.login({ email, password });
      const userData = await apiClient.getCurrentUser();
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
      return { success: false, error: errorMessage };
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      await apiClient.register({ email, password, name });
      // After registration, automatically log in
      await apiClient.login({ email, password });
      const userData = await apiClient.getCurrentUser();
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error("Registration failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    setUser(null);
    apiClient.logout();
  };

  const updateProfile = async (name: string, email: string) => {
    // Note: This would need a backend endpoint to update user profile
    // For now, we'll just update local state
    if (!user) return;

    const updatedUser: User = {
      ...user,
      name,
      email,
    };

    setUser(updatedUser);
  };

  if (loading) {
    return <div>Loading...</div>; // You might want to create a proper loading component
  }

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}
