"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const RouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, userData, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace("/sign-in");
    } else if (userData?.status === "unregistered") {
      router.replace("/onboarding");
    } else if (
      userData?.status === "registered" ||
      userData?.status === "live"
    ) {
      const currentPath = window.location.pathname;
      if (currentPath === "/sign-in" || currentPath === "/onboarding") {
        router.replace(userData?.hasOngoingJob ? "/daily-tasks" : "/jobs");
      }
    }
  }, [user, userData, isLoading, router]);

  return <>{children}</>;
};

export default RouteGuard;
