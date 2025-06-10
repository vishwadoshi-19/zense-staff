"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { AuthProvider } from "@/context/AuthContext";
import RouteGuard from "@/components/RouteGuard";
import { Toaster } from "react-hot-toast";
import { Metadata, Viewport } from "next";
import { Suspense } from "react";
import LoadingScreen from "@/components/common/LoadingScreen";

const inter = Inter({ subsets: ["latin"] });

<meta name="apple-mobile-web-app-title" content="Zense Staff" />;

// export const metadata: Metadata = {
//   title: "Zense Staff Portal",
//   description: "Portal for staff to manage assignments and tasks",
//   generator: "Next.js",
//   manifest: "/manifest.json",
//   keywords: ["staff, portal, assignments, tasks", "nextjs", "next14"],
//   authors: [
//     {
//       name: "Vishwa Doshi",
//       url: "https://github.com/vishwadoshi-19",
//     },
//   ],
//   icons: [
//     {
//       rel: "apple-touch-icon",
//       type: "image/png",
//       url: "icons/web-app-manifest-512x512-512.png",
//     },
//     {
//       rel: "icon",
//       type: "image/png",
//       url: "icons/web-app-manifest-512x512-512.png",
//     },
//   ],
// };

export const viewport: Viewport = {
  themeColor: "white",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#ffffff" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="icons/web-app-manifest-512x512-512.png" />
        <link
          rel="apple-touch-icon"
          href="icons/web-app-manifest-512x512-512.png"
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <Suspense fallback={<LoadingScreen />}>
            <RouteGuard>
              <div className="min-h-screen bg-gray-50">
                {children}
                <div className="mb-20"></div>
                <Navigation />
              </div>
            </RouteGuard>
          </Suspense>
          <Toaster position="top-center" />
        </AuthProvider>
      </body>
    </html>
  );
}
