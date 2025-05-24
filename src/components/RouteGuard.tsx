"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import LoadingScreen from "@/components/common/LoadingScreen";

const PUBLIC_PATHS = ["/sign-in"];
const UNREGISTERED_PATHS = ["/onboarding"];
const REGISTERED_PATHS = ["/jobs", "/daily-tasks", "/profile"];

const RouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, userData, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    // Handle authentication based on user state and current path
    const handleRouting = async () => {
      // Not authenticated - only allow access to public paths
      if (!user) {
        if (!PUBLIC_PATHS.includes(pathname)) {
          router.replace("/sign-in");
        }
        return;
      }

      // User exists but is unregistered - only allow onboarding
      if (userData?.status === "unregistered") {
        if (!UNREGISTERED_PATHS.includes(pathname)) {
          router.replace("/onboarding");
        }
        return;
      }

      // User is registered - prevent access to public and unregistered paths
      if (userData?.status === "registered" || userData?.status === "live") {
        if ([...PUBLIC_PATHS, ...UNREGISTERED_PATHS].includes(pathname)) {
          // Redirect to an appropriate page based on user state
          router.replace(userData?.hasOngoingJob ? "/daily-tasks" : "/jobs");
          return;
        }

        // Handle root path redirect
        if (pathname === "/") {
          router.replace("/jobs");
          return;
        }
      }
    };

    handleRouting();
  }, [user, userData, isLoading, pathname, router]);

  // Show loading screen while authentication state is being determined
  if (isLoading) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};

export default RouteGuard;
