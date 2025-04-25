"use client";

import { useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  document?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch("/auth/session");

        if (!response.ok) {
          throw new Error("Failed to fetch session");
        }

        const data = await response.json();

        if (data.user) {
          setAuthState({
            user: data.user,
            isLoading: false,
            error: null,
          });
        } else {
          setAuthState({
            user: null,
            isLoading: false,
            error: "Not authenticated",
          });
        }
      } catch (error) {
        setAuthState({
          user: null,
          isLoading: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    };

    fetchSession();
  }, []);

  return authState;
}
