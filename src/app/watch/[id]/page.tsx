import { notFound } from "next/navigation";
import { getTitle } from "@/lib/data";
import RequireSession from "@/components/auth/RequireSession";
import VideoPlayer from "@/components/player/VideoPlayer";

interface WatchPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ep?: string }>;
}

export default async function WatchPage({ params, searchParams }: WatchPageProps) {
  const { id } = await params;
  const { ep } = await searchParams;
  const title = getTitle(id);

  if (!title) notFound();

  return (
    <RequireSession level="profile">
      <VideoPlayer title={title} initialEpisodeId={ep ?? null} />
    </RequireSession>
  );
}
