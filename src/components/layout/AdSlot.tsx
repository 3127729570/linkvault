"use client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

type Position = "SIDEBAR" | "TOP_BANNER" | "IN_CONTENT" | "FOOTER";

interface AdSlotProps {
  position: Position;
}

export default function AdSlot({ position }: AdSlotProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["ads", position],
    queryFn: async () => {
      const res = await fetch(`/api/ads?position=${position}`);
      const json = await res.json();
      return json.data || [];
    },
  });

  if (isLoading) return <Skeleton className="w-full h-24" />;

  const ads = data || [];
  const ad = ads.length > 0 ? ads[0] : null;

  if (ad && ad.type === "CUSTOM") {
    return (
      <a
        href={ad.customLink}
        target="_blank"
        rel="nofollow noopener"
        className="block"
      >
        <img src={ad.customImageUrl} alt={ad.name} className="w-full rounded-lg" />
      </a>
    );
  }

  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  if (adsenseId) {
    return (
      <div className="w-full">
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={adsenseId}
          data-ad-slot=""
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  return (
    <div className="w-full h-24 bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-sm border border-dashed">
      Ad Space Available
    </div>
  );
}