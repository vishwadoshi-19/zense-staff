"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, User, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export const Navigation = () => {
  const pathname = usePathname();
  const { isAuthenticated, signOut } = useAuth();

  const links = [
    { href: "/jobs", icon: Home, label: "Jobs" },
    { href: "/daily-tasks", icon: Calendar, label: "Daily Tasks" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  if (!isAuthenticated || pathname === "/sign-in") {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-around py-3">
          {links.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center space-y-1 ${
                  isActive
                    ? "text-blue-500"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs">{label}</span>
              </Link>
            );
          })}
          <button
            onClick={handleSignOut}
            className="flex flex-col items-center space-y-1 text-gray-500 hover:text-gray-900"
          >
            <LogOut className="w-6 h-6" />
            <span className="text-xs">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
