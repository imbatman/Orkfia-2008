import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Orkfia — Public",
  description: "Public pages (legacy cat=main)"
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen gap-6 bg-background text-foreground">
      <header className="p-4 border-b">
        <h1 className="text-xl font-semibold">Orkfia</h1>
      </header>
      <main className="container mx-auto flex-1 p-4">{children}</main>
      <footer className="p-4 text-xs text-muted-foreground border-t">&copy; Orkfia</footer>
    </div>
  );
}
