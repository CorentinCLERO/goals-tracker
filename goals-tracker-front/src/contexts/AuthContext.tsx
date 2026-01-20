import React, { useState } from "react";
import type { User } from "../types";
import {
  getCurrentUser,
  setCurrentUser,
  saveUser,
  findUserByEmail,
} from "../lib/storage";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getCurrentUser());

  const login = (email: string, password: string): boolean => {
    // In a real app, this would validate password against a backend
    // For demo purposes, we just check if user exists
    console.log("Login attempt:", email, password); // Mark password as used
    const foundUser = findUserByEmail(email);
    if (foundUser) {
      setUser(foundUser);
      setCurrentUser(foundUser);
      return true;
    }
    return false;
  };

  const register = (email: string, _password: string, name: string): boolean => {
    // Check if user already exists
    if (findUserByEmail(email)) {
      return false;
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      name,
      createdAt: new Date().toISOString(),
    };

    saveUser(newUser);
    setUser(newUser);
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
    setCurrentUser(null);
  };

  const updateProfile = (name: string, email: string) => {
    if (!user) return;

    const updatedUser: User = {
      ...user,
      name,
      email,
    };

    saveUser(updatedUser);
    setUser(updatedUser);
    setCurrentUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}
