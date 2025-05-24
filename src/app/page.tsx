"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoadingScreen from "@/components/common/LoadingScreen";

export default function Home() {
  const { isLoading } = useAuth();

  // The RouteGuard will handle routing - we just need to render something
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Empty page - RouteGuard will handle redirection
  return null;
}
