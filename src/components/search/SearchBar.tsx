"use client";
import { SearchIcon } from "lucide-react";
import { useSearchStore } from "@/store/search-store";
import { useLanguage } from "@/hooks/use-language";
import { t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function SearchBar() {
  const { onOpen } = useSearchStore();
  const { lang } = useLanguage();
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().includes("MAC"));
  }, []);

  return (
    <Button
      variant="outline"
      className="w-full justify-between text-muted-foreground font-normal"
      onClick={onOpen}
    >
      <div className="flex items-center gap-2">
        <SearchIcon className="size-4" />
        <span className="text-sm">{t("nav.search", lang)}</span>
      </div>
      <kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
        {isMac ? (
          <>
            <span className="text-xs">⌘</span>K
          </>
        ) : (
          "Ctrl+K"
        )}
      </kbd>
    </Button>
  );
}