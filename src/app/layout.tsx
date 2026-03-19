import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FitFusion AI | Smarter Workouts. Better Meals.",
  description:
    "AI-powered workout planning, meal analysis, and beginner meal schedules for real people.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] antialiased flex flex-col`}
      >
        <Navbar />
        <main className="flex-1 pt-20">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
