import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/query-provider";
import AuthProvider from "@/providers/auth-provider";
import { Toaster } from "@/components/ui/toaster";
import { ToastManager } from "@/components/ToastManager";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Green Eves - Wedding Planning Made Simple",
  description: "Plan your perfect wedding with Green Eves - comprehensive wedding planning tools, guest management, vendor coordination, and beautiful wedding websites.",
  keywords: ["wedding planning", "wedding website", "guest management", "wedding organizer", "RSVP", "wedding vendors"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfairDisplay.variable} antialiased font-sans`}>
        <QueryProvider>
          <AuthProvider>
            {children}
            <Toaster />
            <ToastManager />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
