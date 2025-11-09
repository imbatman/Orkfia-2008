import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList
} from "@/components/ui/navigation-menu";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Orkfia — Home",
  description:
    "Orkfia is a classic text-based browser strategy game. Build your tribe, join alliances, and conquer the world."
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Header / Nav */}
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded bg-muted/60 flex items-center justify-center">
              <Image
                src="/globe.svg"
                alt="Orkfia"
                width={20}
                height={20}
              />
            </div>
            <div>
              <div className="text-lg font-semibold leading-none">Orkfia</div>
              <div className="text-xs text-muted-foreground">Classic Browser Strategy Game</div>
            </div>
          </div>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink href="/about">About</NavigationMenuLink>
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
            <Button
              asChild
              variant="ghost"
            >
              <a href="/login">Log in</a>
            </Button>
            <Button asChild>
              <a href="/register">Create account</a>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="bg-gradient-to-b from-background to-muted/30">
          <div className="container mx-auto grid gap-6 px-4 py-12 md:grid-cols-[1.2fr_.8fr] md:items-center">
            <div className="space-y-4">
              <Badge
                variant="secondary"
                className="rounded"
              >Free to play since 2001</Badge>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Build your tribe. Forge alliances. Dominate the world.
              </h1>
              <p className="text-muted-foreground max-w-prose">
                Orkfia is a long-standing, community-driven strategy game. Manage your economy, raise armies,
                and cooperate with your alliance to climb the ranks.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  asChild
                  size="lg"
                  className="px-6"
                >
                  <a href="/register">Play for free</a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="px-6"
                >
                  <a href="/guide">Read the guide</a>
                </Button>
              </div>
              <div className="text-xs text-muted-foreground">No downloads. No pay-to-win.</div>
            </div>
            <div className="relative aspect-[4/3] rounded-lg border bg-card p-4">
              <div className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-tr from-primary/10 to-transparent" />
              <div className="grid h-full w-full place-items-center text-center text-sm text-muted-foreground">
                <div>
                  <Image
                    src="/window.svg"
                    alt="Game UI preview"
                    width={72}
                    height={72}
                    className="mx-auto mb-3 opacity-80"
                  />
                  <p>In-game advisors and rankings at a glance</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="bg-muted/30">
          <div className="container mx-auto px-4 py-10">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Alliance Warfare</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Coordinate with teammates, plan strikes, and protect your lands in a persistent world.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Depth without grind</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Economic management, military tactics, spells and races—strategy that respects your time.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Play anywhere</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Runs in your browser on desktop and mobile. No downloads required.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* News / Announcements */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold tracking-tight mb-4">Latest news</h2>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Age 100 begins</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    A new age has started! Read the full changelog and join an alliance to compete from day one.
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">UI refresh</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    We’ve modernized the interface while preserving the core gameplay. Faster loads, better mobile.
                  </CardContent>
                </Card>
              </div>
            </div>

            <aside className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Join the community</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Hang out with fellow players, ask questions, and coordinate with your alliance on Discord.
                  <div className="mt-4 flex gap-2">
                    <Button
                      asChild
                      size="sm"
                    >
                      <a
                        href="https://discord.gg/"
                        target="_blank"
                        rel="noreferrer"
                      >Join Discord</a>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                    >
                      <a href="/community">Learn more</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">New to the game?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  The Guide covers races, buildings, spells, and battle mechanics.
                  <div className="mt-4">
                    <Button
                      asChild
                      size="sm"
                      variant="secondary"
                    >
                      <a href="/guide">Open the Guide</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 py-8 text-sm text-muted-foreground md:flex-row">
          <div className="flex items-center gap-2">
            <span>&copy; {new Date().getFullYear()} Orkfia</span>
          </div>
          <nav className="flex gap-4">
            <a
              className="underline underline-offset-4"
              href="/privacy"
            >Privacy</a>
            <a
              className="underline underline-offset-4"
              href="/terms"
            >Terms</a>
            <a
              className="underline underline-offset-4"
              href="/contact"
            >Contact</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
