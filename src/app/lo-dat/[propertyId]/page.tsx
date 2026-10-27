import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { serverRead } from "@/features/user/server";
import {
  ApiError,
  entity,
  uuidPattern,
  decimal,
  money,
} from "@/features/user/wire";
import { PropertyDetail } from "@/features/user/detail";

type Props = { params: Promise<{ propertyId: string }> };
// React cache deduplicates within this request, never between user sessions.
const readProperty = cache(async (id: string) => {
  if (!uuidPattern.test(id)) notFound();
  try {
    return entity((await serverRead("/properties/" + id)).data, "Property");
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const property = await readProperty((await params).propertyId);
  const title = `${property.title} | Xland`;
  const description = `${decimal(property.areaM2, "m²")} · ${money(property.priceTotal)} · ${property.districtName}, ${property.provinceName}. Xem thông tin, hồ sơ và lịch tham quan.`;
  return {
    title,
    description,
    openGraph: { title, description, type: "website", locale: "vi_VN" },
  };
}

export default async function Page({ params }: Props) {
  return (
    <PropertyDetail initial={await readProperty((await params).propertyId)} />
  );
}
