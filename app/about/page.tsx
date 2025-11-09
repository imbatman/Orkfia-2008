import type { Metadata } from "next";
import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

export const metadata: Metadata = {
  title: "Orkfia — About",
  description:
    "Learn about Orkfia: a classic text-based browser strategy game running since 2001, built and maintained by the community.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Header / Nav (mirrors home for consistency) */}
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded bg-muted/60 flex items-center justify-center">
              <Image src="/globe.svg" alt="Orkfia" width={20} height={20} />
            </div>
            <div>
              <div className="text-lg font-semibold leading-none">Orkfia</div>
              <div className="text-xs text-muted-foreground">Classic Browser Strategy Game</div>
            </div>
          </div>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink href="/about" data-active>
                  About
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/guide">Game Guide</NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/ranking">Rankings</NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/community">Community</NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/history">Age History</NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center gap-2">
            <Button asChild variant="ghost">
              <a href="/login">Log in</a>
            </Button>
            <Button asChild>
              <a href="/register">Create account</a>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero / Title */}
        <section className="bg-gradient-to-b from-muted/40 to-background">
          <div className="container mx-auto px-4 py-10">
            <Badge variant="secondary" className="rounded">Since 2001</Badge>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">About Orkfia</h1>
            <p className="mt-3 max-w-prose text-muted-foreground">
              Orkfia is a classic, text-based browser strategy game where you build a tribe, join an
              alliance, and compete with players around the world. The game has been running for decades — sustained by a
              passionate community and volunteer developers.
            </p>
          </div>
        </section>

        {/* What is AaW */}
        <section className="container mx-auto grid gap-6 px-4 py-10 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">What is Orkfia?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                AaW blends economic management, military tactics, races, spells, and alliance strategy. It is turn-based
                at heart and designed to be played at your own pace. No downloads, no pay-to-win — just strategy.
              </p>
              <p>
                You will expand lands, balance your economy, recruit armies, and coordinate with alliance members to
                rise in the rankings.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">A community project</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                The project is maintained by volunteers and shaped by player feedback. Development focuses on preserving
                the classic feel while modernizing the experience and maintaining fairness.
              </p>
              <div className="mt-2 flex gap-2">
                <Button asChild size="sm">
                  <a href="/community">Join the community</a>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <a href="https://discord.gg/" target="_blank" rel="noreferrer">Discord</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* History / Timeline */}
        <section className="bg-muted/30">
          <div className="container mx-auto grid gap-6 px-4 py-10 md:grid-cols-3">
            <div className="md:col-span-1">
              <h2 className="text-xl font-semibold tracking-tight">A brief history</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Orkfia has seen many ages, iterations, and UI updates through the years.
              </p>
            </div>
            <div className="md:col-span-2 grid gap-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">2001 — The beginning</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Launched as a classic web strategy game with simple pages and deep mechanics.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Community-led development</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Over the years, volunteer developers and staff have maintained gameplay balance and added features.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Modernization</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  The UI and infrastructure continue to evolve while preserving the spirit of the original game.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Getting started / CTAs */}
        <section className="container mx-auto grid gap-6 px-4 py-10 md:grid-cols-3">
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold tracking-tight">New to the game?</h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-prose">
              The Guide covers races, buildings, spells, economy, and warfare. Create an account to start your first
              tribe and join an alliance.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild>
                <a href="/register">Create account</a>
              </Button>
              <Button asChild variant="outline">
                <a href="/guide">Open the Guide</a>
              </Button>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Credits & thanks</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Orkfia exists thanks to countless contributors, staff, moderators, and players across its many
              ages. Thank you for keeping the world alive.
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer (mirrors home) */}
      <footer className="border-t">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 py-8 text-sm text-muted-foreground md:flex-row">
          <div className="flex items-center gap-2">
            <Image src="/file.svg" alt="Logo" width={18} height={18} />
            <span>&copy; {new Date().getFullYear()} Orkfia</span>
          </div>
          <nav className="flex gap-4">
            <a className="underline underline-offset-4" href="/privacy">Privacy</a>
            <a className="underline underline-offset-4" href="/terms">Terms</a>
            <a className="underline underline-offset-4" href="/contact">Contact</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
