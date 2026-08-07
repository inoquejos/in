import ProfileGuard from "@/components/ProfileGuard";

export default function WatchLayout({ children }: { children: React.ReactNode }) {
  return <ProfileGuard>{children}</ProfileGuard>;
}
