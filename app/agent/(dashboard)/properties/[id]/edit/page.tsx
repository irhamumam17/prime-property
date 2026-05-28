import { notFound } from "next/navigation";
import { getPropertyById } from "@/lib/db/properties";
import { EditPropertyForm } from "../edit-form";
import type { Property } from "@/lib/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPropertyPage({ params }: PageProps) {
  const { id } = await params;
  const property = await getPropertyById(id);

  if (!property) {
    notFound();
  }

  return <EditPropertyForm id={id} property={property} />;
}
