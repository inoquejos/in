import ProfileGuard from "@/components/ProfileGuard";
import Navbar from "@/components/Navbar";
import { TitleModalProvider } from "@/context/TitleModalContext";

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProfileGuard>
      <TitleModalProvider>
        <Navbar />
        <main className="min-h-screen bg-background pb-24">{children}</main>
      </TitleModalProvider>
    </ProfileGuard>
  );
}
