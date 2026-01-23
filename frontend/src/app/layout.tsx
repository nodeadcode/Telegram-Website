import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Inter for a clean premium look
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AutoGram | Telegram Automation",
  description: "Automate Telegram Ads Safely & Professionally",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
