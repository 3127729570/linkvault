"use client";

import { useLanguage } from "@/hooks/use-language";
import { t } from "@/lib/i18n";
import AdSlot from "@/components/layout/AdSlot";

const friendLinks = [
  { name: "GitHub", url: "https://github.com" },
  { name: "Next.js", url: "https://nextjs.org" },
  { name: "Tailwind CSS", url: "https://tailwindcss.com" },
];

export default function Footer() {
  const { lang } = useLanguage();

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <AdSlot position="FOOTER" />

        <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; 2024 LinkVault. {t("footer.rights", lang)}.
          </p>
          <div className="flex items-center gap-4">
            {friendLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}