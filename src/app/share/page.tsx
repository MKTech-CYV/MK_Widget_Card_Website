import { redirect } from "next/navigation";
import type { EcardSearchParams } from "@/lib/ecard";

type SharePageProps = {
  searchParams: Promise<EcardSearchParams>;
};

export default async function SharePage({ searchParams }: SharePageProps) {
  const query = await searchParams;
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        params.append(key, item);
      }
    } else if (value) {
      params.set(key, value);
    }
  }

  redirect(params.size > 0 ? `/ecard?${params.toString()}` : "/ecard");
}
