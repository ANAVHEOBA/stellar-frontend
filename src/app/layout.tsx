import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from './contexts/AuthContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FixedRateX",
  description: "Stellar-powered payment gateway for cross-border subscriptions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <header className="fixed top-0 w-full border-b border-black/[.08] dark:border-white/[.145] bg-background">
            <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
              <h1 className="text-xl font-bold">FixedRateX</h1>
            </nav>
          </header>
          <main className="pt-16">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
