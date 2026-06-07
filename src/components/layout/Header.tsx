"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import SearchBar from "@/components/search/SearchBar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useLanguage } from "@/hooks/use-language";
import { t } from "@/lib/i18n";
import {
  MenuIcon,
  SunIcon,
  MoonIcon,
  LogOutIcon,
  LayoutDashboardIcon,
  ShieldIcon,
  ChevronDownIcon,
  LinkIcon,
  GlobeIcon,
} from "lucide-react";
import type { CategoryWithCount } from "@/types";

export default function Header() {
  const { data: session } = useSession();
  const { isAdmin } = useCurrentUser();
  const { theme, setTheme } = useTheme();
  const { lang, toggleLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      const json = await res.json();
      return (json.data || []) as CategoryWithCount[];
    },
  });

  const categories = categoriesData || [];

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center gap-4 px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg shrink-0">
          <LinkIcon className="size-5 text-primary" />
          <span>LinkVault</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">{t("nav.home", lang)}</Link>
          </Button>

          {/* Categories Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                {t("nav.categories", lang)}
                <ChevronDownIcon className="size-3.5 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>{t("nav.browseCategories", lang)}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {categories.length === 0 && (
                <DropdownMenuItem disabled>{t("nav.noCategories", lang)}</DropdownMenuItem>
              )}
              {categories.map((cat) => (
                <DropdownMenuItem
                  key={cat.id}
                  className="flex items-center justify-between"
                  onClick={() => router.push(`/category/${cat.slug}`)}
                >
                  <span>{cat.name}</span>
                  {cat._count && (
                    <Badge variant="secondary" className="text-xs">
                      {cat._count.sites}
                    </Badge>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Search */}
        <div className="flex-1 max-w-md mx-auto">
          <SearchBar />
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Language Toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              aria-label="Toggle language"
              title={lang === "zh" ? "Switch to English" : "切换到中文"}
            >
              <GlobeIcon className="size-4" />
            </Button>
          )}
          
          {/* Dark Mode Toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <SunIcon className="size-4" />
              ) : (
                <MoonIcon className="size-4" />
              )}
            </Button>
          )}

          {/* Auth */}
          <div className="hidden md:flex items-center gap-2">
            {session?.user ? (
              <UserDropdown isAdmin={isAdmin} />
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">{t("nav.login", lang)}</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">{t("nav.register", lang)}</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <MenuIcon className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 p-0">
              <div className="flex flex-col h-full">
                <SheetHeader className="border-b px-4 py-3">
                  <SheetTitle>{t("nav.menu", lang)}</SheetTitle>
                </SheetHeader>
                <div className="flex-1 overflow-auto p-4">
                  <nav className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      className="justify-start"
                      asChild
                    >
                      <Link href="/">{t("nav.home", lang)}</Link>
                    </Button>
                    <div className="mt-2 mb-1 text-xs font-medium text-muted-foreground px-2">
                      {t("nav.categories", lang)}
                    </div>
                    {categories.map((cat) => (
                      <Button
                        key={cat.id}
                        variant="ghost"
                        size="sm"
                        className="justify-start"
                        asChild
                      >
                        <Link href={`/category/${cat.slug}`}>
                          {cat.name}
                          {cat._count && (
                            <Badge variant="secondary" className="ml-auto text-xs">
                              {cat._count.sites}
                            </Badge>
                          )}
                        </Link>
                      </Button>
                    ))}
                  </nav>
                </div>
                <div className="border-t p-4">
                  {session?.user ? (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="size-6">
                          <AvatarImage src={session.user.image || undefined} />
                          <AvatarFallback>
                            {session.user.name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium truncate">
                          {session.user.name}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="justify-start"
                        asChild
                      >
                        <Link href="/dashboard">
                          <LayoutDashboardIcon className="size-4 mr-2" />
                          {t("nav.dashboard", lang)}
                        </Link>
                      </Button>
                      {isAdmin && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="justify-start"
                          asChild
                        >
                          <Link href="/admin">
                            <ShieldIcon className="size-4 mr-2" />
                            {t("nav.admin", lang)}
                          </Link>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="justify-start text-destructive"
                        onClick={() => signOut()}
                      >
                        <LogOutIcon className="size-4 mr-2" />
                        {t("nav.logout", lang)}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        asChild
                      >
                        <Link href="/login">{t("nav.login", lang)}</Link>
                      </Button>
                      <Button
                        size="sm"
                        className="w-full"
                        asChild
                      >
                        <Link href="/register">{t("nav.register", lang)}</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function UserDropdown({ isAdmin }: { isAdmin: boolean }) {
  const { data: session } = useSession();
  const router = useRouter();
  const { lang } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Avatar className="size-6">
            <AvatarImage src={session?.user?.image || undefined} />
            <AvatarFallback>
              {session?.user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <span className="hidden lg:inline text-sm">
            {session?.user?.name}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>
          {session?.user?.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/dashboard")}>
          <LayoutDashboardIcon className="size-4 mr-2" />
          {t("nav.dashboard", lang)}
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem onClick={() => router.push("/admin")}>
            <ShieldIcon className="size-4 mr-2" />
            {t("nav.admin", lang)}
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive"
          onClick={() => signOut()}
        >
          <LogOutIcon className="size-4 mr-2" />
          {t("nav.logout", lang)}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}