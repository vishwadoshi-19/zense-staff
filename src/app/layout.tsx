"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Zense Staff Portal",
//   description: "Portal for staff to manage assignments and tasks",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showNavigation = pathname !== "/onboarding";

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            {children}
            {showNavigation && <Navigation />}
            <Toaster position="top-center" />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
