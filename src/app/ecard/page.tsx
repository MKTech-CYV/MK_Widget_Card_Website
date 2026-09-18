import type { Metadata } from "next";
import type { EcardSearchParams } from "@/lib/ecard";
import { buildEcardMetadata, EcardView } from "./ecard-view";

type EcardPageProps = {
  searchParams: Promise<EcardSearchParams>;
};

export async function generateMetadata({
  searchParams,
}: EcardPageProps): Promise<Metadata> {
  return buildEcardMetadata(await searchParams);
}

export default async function EcardPage({ searchParams }: EcardPageProps) {
  return <EcardView query={await searchParams} />;
}
