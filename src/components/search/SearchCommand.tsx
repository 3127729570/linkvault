"use client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { useDebounce } from "use-debounce";
import { useSearchStore } from "@/store/search-store";
import { useHotkeys } from "@/hooks/use-hotkeys";
import { useLanguage } from "@/hooks/use-language";
import { t } from "@/lib/i18n";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { GlobeIcon, SearchIcon } from "lucide-react";
import { truncate } from "@/lib/utils";
import type { SiteWithCategory } from "@/types";

export default function SearchCommand() {
  const router = useRouter();
  const { isOpen, onClose, onOpen } = useSearchStore();
  const { lang } = useLanguage();
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 300);

  const handleOpen = useCallback(() => {
    onOpen();
  }, [onOpen]);

  useHotkeys("k", handleOpen);

  const { data, isLoading } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery.trim()) return [];
      const res = await fetch(
        `/api/sites?search=${encodeURIComponent(debouncedQuery)}&limit=5`
      );
      const json = await res.json();
      return (json.data || []) as SiteWithCategory[];
    },
    enabled: debouncedQuery.trim().length > 0,
  });

  const results = data || [];

  const handleSelect = useCallback(
    (siteId: string) => {
      onClose();
      router.push(`/site/${siteId}`);
    },
    [onClose, router]
  );

  const handleViewAll = useCallback(() => {
    onClose();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }, [onClose, router, query]);

  return (
    <CommandDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <CommandInput
        placeholder={t("nav.search", lang)}
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {!debouncedQuery.trim() && (
          <CommandEmpty>Type to search websites...</CommandEmpty>
        )}
        {debouncedQuery.trim() && isLoading && (
          <CommandEmpty>Searching...</CommandEmpty>
        )}
        {debouncedQuery.trim() && !isLoading && results.length === 0 && (
          <CommandEmpty>{t("search.noResults", lang)}</CommandEmpty>
        )}
        {results.length > 0 && (
          <>
            <CommandGroup heading="Websites">
              {results.map((site) => (
                <CommandItem
                  key={site.id}
                  value={site.title}
                  onSelect={() => handleSelect(site.id)}
                >
                  <GlobeIcon className="size-4 shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="truncate text-sm">{site.title}</span>
                    <span className="text-xs text-muted-foreground truncate">
                      {truncate(site.description, 60)}
                    </span>
                  </div>
                  <Badge variant="secondary" className="shrink-0 ml-auto text-xs">
                    {site.category?.name || "Other"}
                  </Badge>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandItem onSelect={handleViewAll}>
              <SearchIcon className="size-4" />
              <span>{t("search.viewAll", lang)}</span>
            </CommandItem>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}