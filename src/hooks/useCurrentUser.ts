import { useState, useEffect } from "react";
import { User } from "@/types/user";

type UserRole = User["role"];

interface CurrentUser {
  id: string;
  role: UserRole;
  email: string;
  name?: string;
}

export function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentUser = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/session");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const session = await response.json();
      setCurrentUser(session?.user || null);
    } catch (error) {
      console.error("Failed to fetch current user:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch current user"
      );
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return {
    currentUser,
    loading,
    error,
    refresh: fetchCurrentUser,
    isLoggedIn: !!currentUser,
  };
}
