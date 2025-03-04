"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoadingScreen from "@/components/common/LoadingScreen";

export default function Home() {
  const { isAuthenticated, isLoading, isNewUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        if (isNewUser) {
          router.push("/");
        } else {
          router.push("/dashboard");
        }
      } else {
        router.push("/sign-in");
      }
    }
  }, [isAuthenticated, isLoading, isNewUser, router]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return null;
}
