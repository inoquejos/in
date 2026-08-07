import { notFound } from "next/navigation";
import { getTitleBySlug } from "@/lib/data";
import WatchClient from "./WatchClient";

export default async function WatchPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ ep?: string }>;
}) {
  const { slug } = await params;
  const { ep } = await searchParams;
  const title = getTitleBySlug(slug);
  if (!title) notFound();

  return <WatchClient slug={slug} initialEpisodeId={ep} />;
}
