import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "@/firebase";

interface UserData {
  uid: string;
  email: string;
  name: string;
  hasOrganization: boolean;
  organization?: any;
}

interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  loading: boolean;
  logout: () => Promise<void>;
  syncUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const apiUrl = import.meta.env.VITE_API_URL_LOCAL;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const syncUser = async () => {
    if (!currentUser) return;

    try {
      const idToken = await currentUser.getIdToken();
      const response = await fetch(`${apiUrl}/api/auth/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUserData(data.data.user);
        }
      }
    } catch (error) {
      console.error("Failed to sync user:", error);
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
      setUserData(null);
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        try {
          const idToken = await user.getIdToken();
          const response = await fetch(`${apiUrl}/api/auth/sync`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
            body: JSON.stringify({}),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              setUserData(data.data.user);
            }
          }
        } catch (error) {
          console.error("Failed to sync user:", error);
        }
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    loading,
    logout,
    syncUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
