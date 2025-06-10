"use client";

import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import LoadingScreen from "@/components/common/LoadingScreen";

const PUBLIC_PATHS = ["/sign-in"];
const UNREGISTERED_PATHS = ["/onboarding"];
const REGISTERED_PATHS = ["/jobs", "/daily-tasks", "/profile"];

const RouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, userData, isLoading: authLoading } = useAuth();
  const { ongoingJob, isLoading: userLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const isLoading = authLoading || userLoading;

  useEffect(() => {
    if (isLoading) return;

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

      // User is registered or live
      console.log("ongoing jobbbbbbbbbbbbb : " , ongoingJob )
      if (userData?.status === "registered" || userData?.status === "live") {
        if ([...PUBLIC_PATHS, ...UNREGISTERED_PATHS].includes(pathname)) {
          // Handle root path and default redirects
          if (pathname === "/" || pathname === "/sign-in") {
            if (ongoingJob) {
              const today = new Date();
              const startDate = new Date(ongoingJob.startDate);
              const endDate = new Date(ongoingJob.endDate);

              if (today >= startDate && today <= endDate) {
                router.replace("/daily-tasks");
              } else {
                router.replace("/jobs?filter=ongoing");
              }
            } else {
              router.replace("/jobs");
            }
          } else {
            router.replace("/jobs");
          }
          return;
        }
      }
    };

    handleRouting();
  }, [user, userData, ongoingJob, isLoading, pathname, router]);

  // Show loading screen while authentication state is being determined
  if (isLoading) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};

export default RouteGuard;
