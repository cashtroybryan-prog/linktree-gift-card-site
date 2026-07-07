"use client";

import GiftSite from "@/components/GiftSite";
import { useParams } from "next/navigation";

export default function ProductPage() {
  const params = useParams<{ country: string; id: string }>();

  return (
    <GiftSite
      initialPage="product"
      initialCountryCode={params.country ?? "us"}
      initialProductId={params.id ?? "linktree"}
      initialProductStep="value"
    />
  );
}