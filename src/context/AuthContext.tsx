"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase/config";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  getUserData,
  checkUserExists,
  signOut as firebaseSignOut,
} from "@/lib/firebase/auth";
import { UserData } from "@/types";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isNewUser: boolean;
  setIsNewUser: (value: boolean) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  isLoading: true,
  isAuthenticated: false,
  isNewUser: false,
  setIsNewUser: () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const signOut = async () => {
    await firebaseSignOut(router);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsLoading(true); // Ensure loading is true until we fetch data

      if (currentUser) {
        const exists = await checkUserExists(currentUser.uid);
        setIsNewUser(!exists);

        if (exists) {
          const result = await getUserData(currentUser.uid);
          if (result.success && result.data) {
            setUserData(result.data);
            setIsNewUser(result.data.status === "unregistered");
          }
        }
      } else {
        setUserData(null);
        setIsNewUser(false);
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Redirect users based on authentication and registration status
  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      if (pathname !== "/sign-in") router.replace("/sign-in");
    } else if (userData?.status === "unregistered") {
      if (pathname !== "/onboarding") router.replace("/onboarding");
    } else if (userData?.status === "registered" || "live") {
      if (pathname === "/sign-in" || pathname === "/onboarding") {
        router.replace("/jobs"); // Default for registered users
      }
    }
  }, [user, userData?.status, pathname, isLoading, router]);

  const value = {
    user,
    userData,
    isLoading,
    isAuthenticated: !!user,
    isNewUser,
    setIsNewUser,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
