import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";
import { Metadata, Viewport } from "next";

const inter = Inter({ subsets: ["latin"] });

<meta name="apple-mobile-web-app-title" content="Zense Staff" />;

export const metadata: Metadata = {
  title: "Zense Staff Portal",
  description: "Portal for staff to manage assignments and tasks",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["staff, portal, assignments, tasks", "nextjs", "next14"],
  authors: [
    {
      name: "Vishwa Doshi",
      url: "https://github.com/vishwadoshi-19",
    },
  ],
  icons: [
    {
      rel: "apple-touch-icon",
      type: "image/png",
      url: "icons/web-app-manifest-512x512-512.png",
    },
    {
      rel: "icon",
      type: "image/png",
      url: "icons/web-app-manifest-512x512-512.png",
    },
  ],
};

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
  // const pathname = usePathname();
  // const showNavigation = !["/sign-in", "/onboarding"].includes(pathname);

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
          <div className="min-h-screen bg-gray-50">
            {children}
            {/* {showNavigation && <Navigation />} */}
            <div className="mb-20"></div>
            {/* <Navigation /> */}
            <Toaster position="top-center" />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
