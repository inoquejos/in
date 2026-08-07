import Navbar from "@/components/layout/Navbar";
import InfoModal from "@/components/browse/InfoModal";
import RequireSession from "@/components/auth/RequireSession";

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireSession level="profile">
      <Navbar />
      <main className="flex-1 bg-nx-bg pb-16">{children}</main>
      <InfoModal />
    </RequireSession>
  );
}
