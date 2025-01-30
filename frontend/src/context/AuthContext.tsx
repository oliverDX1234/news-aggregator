import React, { createContext, useState, useEffect } from "react";
import axios, { isAxiosError } from "@/api/axios";

import { AuthContextType, User } from "@/types/types";

import { fetchProfile } from "@/api/profileApi";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getCsrfCookie = async () => {
    await axios.get("/sanctum/csrf-cookie"); // Fetch CSRF cookie
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("access_token");

      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        try {
          const response = await fetchProfile();

          setUser(response);

          setLoading(false);
        } catch (err) {
          console.error("Failed to fetch user profile:", err);
          logout();

          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      await getCsrfCookie();
      const response = await axios.post<{ access_token: string }>(
        "/api/login",
        { email, password }
      );

      const { access_token } = response.data;

      localStorage.setItem("access_token", access_token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

      const userResponse = await fetchProfile();
      setUser(userResponse);
    } catch (error) {
      if (isAxiosError(error) && error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("An error occurred. Please try again.");
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<void> => {
    try {
      await getCsrfCookie();
      const response = await axios.post<{ access_token: string }>(
        "/api/register",
        {
          name,
          email,
          password,
          password_confirmation: confirmPassword,
        }
      );
      const { access_token } = response.data;

      localStorage.setItem("access_token", access_token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

      const userResponse = await fetchProfile();

      setUser(userResponse);
    } catch (error) {
      if (isAxiosError(error)) {
        const errors = error.response?.data?.errors;

        if (errors && typeof errors === "object") {
          const firstErrorKey = Object.keys(errors)[0];
          const firstErrorMessage = errors[firstErrorKey]?.[0];

          throw new Error(
            error.response?.data?.message ||
              firstErrorMessage ||
              "Registration failed."
          );
        }
      }
      throw new Error("An unexpected error occurred during registration.");
    }
  };

  const logout = async () => {
    try {
      await axios.post("/api/logout");
      setUser(null);
      localStorage.removeItem("access_token");
      axios.defaults.headers.common["Authorization"] = "";
    } catch {
      throw new Error("Failed to log out");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
