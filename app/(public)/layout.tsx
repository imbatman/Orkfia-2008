import type { Metadata } from "next";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Orkfia — Public",
  description: "Public pages (legacy cat=main)",
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="p-4">
        <h1 className="text-xl font-semibold">Orkfia</h1>
      </header>
      <Separator />
      <main className="container mx-auto p-4">{children}</main>
      <Separator />
      <footer className="p-4 text-xs text-muted-foreground">© Orkfia</footer>
    </div>
  );
}
