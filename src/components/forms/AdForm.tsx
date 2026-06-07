"use client";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { adSchema, type AdInput } from "@/lib/validations";
import { Loader2Icon, PlusIcon } from "lucide-react";
import type { AdSlotWithDates } from "@/types";
import { useLanguage } from "@/hooks/use-language";
import { t } from "@/lib/i18n";

const POSITIONS = ["SIDEBAR", "TOP_BANNER", "IN_CONTENT", "FOOTER"] as const;
const AD_TYPES = ["GOOGLE_AD", "CUSTOM"] as const;

interface AdFormProps {
  ad?: AdSlotWithDates;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export default function AdForm({ ad, trigger, onSuccess }: AdFormProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const isEditing = !!ad;
  const { lang } = useLanguage();

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<AdInput>({
    resolver: zodResolver(adSchema) as any,
    defaultValues: ad
      ? {
          name: ad.name,
          description: ad.description || "",
          position: ad.position as AdInput["position"],
          type: ad.type as AdInput["type"],
          customImageUrl: ad.customImageUrl || "",
          customLink: ad.customLink || "",
          isActive: ad.isActive ?? true,
          startDate: ad.startDate || null,
          endDate: ad.endDate || null,
        }
      : {
          name: "",
          description: "",
          position: "SIDEBAR",
          type: "GOOGLE_AD",
          customImageUrl: "",
          customLink: "",
          isActive: true,
          startDate: null,
          endDate: null,
        },
  });

  const adType = watch("type");

  const mutation = useMutation({
    mutationFn: async (data: AdInput) => {
      const url = isEditing ? `/api/ads/${ad!.id}` : "/api/ads";
      const method = isEditing ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save ad");
      return json.data;
    },
    onSuccess: () => {
      toast.success(isEditing ? "Ad updated" : "Ad created");
      queryClient.invalidateQueries({ queryKey: ["ads"] });
      setOpen(false);
      reset();
      onSuccess?.();
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const onSubmit = (data: AdInput) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {trigger || (
          <Button size="sm" type="button">
            <PlusIcon className="size-4" />
            {t("admin.addAd", lang)}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t("admin.edit", lang) : t("admin.addAd", lang)}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the ad details below"
              : "Add a new ad slot"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Ad name"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Optional description"
              rows={2}
              {...register("description")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Controller
                name="position"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) =>
                      setValue("position", value as AdInput["position"], {
                        shouldValidate: true,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      {POSITIONS.map((pos) => (
                        <SelectItem key={pos} value={pos}>
                          {pos.replace(/_/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.position && (
                <p className="text-xs text-destructive">
                  {errors.position.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) =>
                      setValue("type", value as AdInput["type"], {
                        shouldValidate: true,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {AD_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t === "GOOGLE_AD" ? "Google Ad" : "Custom"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.type && (
                <p className="text-xs text-destructive">
                  {errors.type.message}
                </p>
              )}
            </div>
          </div>

          {adType === "CUSTOM" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="customImageUrl">
                  Image URL <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="customImageUrl"
                  placeholder="https://example.com/image.png"
                  {...register("customImageUrl")}
                />
                {errors.customImageUrl && (
                  <p className="text-xs text-destructive">
                    {errors.customImageUrl.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="customLink">
                  Link URL <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="customLink"
                  placeholder="https://example.com"
                  {...register("customLink")}
                />
                {errors.customLink && (
                  <p className="text-xs text-destructive">
                    {errors.customLink.message}
                  </p>
                )}
              </div>
            </>
          )}

          <div className="flex items-center justify-between">
            <Label htmlFor="isActive">Active</Label>
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="datetime-local"
                {...register("startDate")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="datetime-local"
                {...register("endDate")}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : null}
              {isEditing ? t("general.save", lang) : t("general.save", lang)}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}