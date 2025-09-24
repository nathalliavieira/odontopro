import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

import { SessionAuthProvider } from "@/components/session-auth";

import { QueryClientContext } from "@/providers/queryclient";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OdontoPRO - Find the best professionals in one place!",
  description: "We are a platform for healthcare professionals focused on streamlining your care in a simplified and organized way.",
  robots: {
    index: true,
    follow: true,
    nocache: true,
  },
  openGraph: {
    title: "OdontoPRO - Find the best professionals in one place!",
    description: "We are a platform for healthcare professionals focused on streamlining your care in a simplified and organized way.",
    images: [`${process.env.NEXT_PUBLIC_URL}/doctor-hero.png`]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      > 
        <SessionAuthProvider>
          <QueryClientContext>
            <Toaster
              duration={2500}
            />
            {children}
          </QueryClientContext>
        </SessionAuthProvider>
      </body>
    </html>
  );
}
