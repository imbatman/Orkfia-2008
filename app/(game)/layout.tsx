import type { Metadata } from "next";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Orkfia — Game",
  description: "In-game pages (legacy cat=game)",
};

export default function GameLayout({ children }: { children: React.ReactNode }) {
  // TODO: Replace placeholders with HUD populated via DAL once available
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="p-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Orkfia — Game</h1>
        <nav className="text-sm text-muted-foreground">HUD: gold, land, pop, time</nav>
      </header>
      <Separator />
      <main className="container mx-auto p-4">{children}</main>
      <Separator />
      <footer className="p-4 text-xs text-muted-foreground">&copy; Orkfia</footer>
    </div>
  );
}
