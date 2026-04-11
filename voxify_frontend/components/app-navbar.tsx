"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Heart, LayoutDashboard, Menu, Music2, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/chants", label: "Chants", icon: Music2 },
  { href: "/favorites", label: "Favoris", icon: Heart },
];

export function AppNavbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center gap-2 px-3 sm:h-16 sm:gap-3 sm:px-4">
        <Link
          href="/"
          className="flex min-w-0 shrink-0 items-center rounded-md outline-none ring-offset-background transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          onClick={() => setMobileOpen(false)}
        >
          <Image
            src="/logo-voxify1.png"
            alt="Voxify"
            width={220}
            height={48}
            className="h-8 w-auto max-w-[min(180px,36vw)] object-contain object-left sm:h-9 sm:max-w-[min(200px,42vw)] dark:brightness-[1.08] dark:contrast-[0.96]"
            priority
          />
        </Link>
        <nav
          className="hidden min-w-0 flex-1 items-center justify-center gap-1 md:flex lg:gap-2"
          aria-label="Navigation principale"
        >
          {links.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}>
              <Button
                variant="ghost"
                size="sm"
                className={cn("gap-2", pathname === href && "bg-primary/15 text-primary")}
              >
                <Icon className="size-4 shrink-0" />
                {label}
              </Button>
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
          <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Ouvrir le menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="size-5" />
            </Button>
            <DialogContent variant="drawer" className="border-l">
              <DialogTitle className="sr-only">Menu de navigation</DialogTitle>
              <DialogDescription className="sr-only">
                Accédez au tableau de bord, à la bibliothèque et aux favoris.
              </DialogDescription>
              <nav className="flex flex-col gap-1 px-4 pb-6 pt-14" aria-label="Navigation mobile">
                {links.map(({ href, label, icon: Icon }) => (
                  <Link key={href} href={href} onClick={() => setMobileOpen(false)}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "h-11 w-full justify-start gap-3 text-base",
                        pathname === href && "bg-primary/15 text-primary",
                      )}
                    >
                      <Icon className="size-5 shrink-0" />
                      {label}
                    </Button>
                  </Link>
                ))}
              </nav>
            </DialogContent>
          </Dialog>
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full p-0">
              <Avatar className="size-9">
                <AvatarFallback>
                  <UserRound className="size-4" />
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link href="/login">Se connecter</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/register">Creer un compte</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
