import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono
} from "next/font/google";
import "./globals.css";
import React from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Orkfia — Classic Browser Strategy Game",
  description: "A classic text-based strategy game. Build your tribe, join alliances, and conquer the world.",
  metadataBase: new URL("https://alliancesatwar.com")
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
    {children}
    </body>
    </html>
  );
}
