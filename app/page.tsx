import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orkfia — Home",
  description: "Classic browser strategy game. Modernized UI, same spirit."
};

export default function Home() {
  return (
    <div className="min-h-screen font-sans">
      <main className="container mx-auto max-w-3xl p-6 sm:p-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Orkfia</h1>
          <p className="text-muted-foreground mt-1">
            A classic text-based strategy game. Build your tribe, forge alliances, and conquer.
          </p>
        </header>

        <div className="rounded-lg border bg-card p-6">
          <p className="leading-relaxed">
            Welcome to Orkfia — a classic text-based strategy game. Build your tribe, forge alliances, and compete for
            glory.
          </p>

          <Separator className="my-6" />

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              asChild
              size="lg"
              className="px-6"
            >
              <a href="/login">Log in</a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="px-6"
            >
              <a href="/register">Create an account</a>
            </Button>
          </div>

          <div className="mt-6 text-sm text-muted-foreground">
            <p>
              Returning player? Log in to view your current stats and advisors.
            </p>
          </div>
        </div>

        <section className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <h2 className="font-semibold mb-2">What’s changing</h2>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Faster, more responsive interface</li>
              <li>Improved security and authentication</li>
              <li>Same mechanics and formulas you know</li>
            </ul>
          </div>
          <div className="rounded-lg border p-4">
            <h2 className="font-semibold mb-2">Learn more</h2>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><a
                className="underline underline-offset-4"
                href="/about"
              >About Orkfia</a></li>
              <li><a
                className="underline underline-offset-4"
                href="/credits"
              >Credits</a></li>
              <li><a
                className="underline underline-offset-4"
                href="/history"
              >Age history</a></li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
