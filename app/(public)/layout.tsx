import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orkfia — Public",
  description: "Public pages (legacy cat=main)",
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b p-4">
        <h1 className="text-xl font-semibold">Orkfia</h1>
      </header>
      <main className="container mx-auto p-4">{children}</main>
      <footer className="border-t p-4 text-xs text-muted-foreground">© Orkfia</footer>
    </div>
  );
}
