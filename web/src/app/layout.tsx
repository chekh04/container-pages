import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { siteMetadata } from "@/lib/seo/metadata";

const inter = Inter({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-sans",
});

export const metadata: Metadata = siteMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${inter.variable} min-h-screen bg-zinc-50 font-sans antialiased text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50`}
      >
        {children}
      </body>
    </html>
  );
}
