import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getUserData } from "@/lib/actions/read_user";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userRes = await getUserData();
  if (!userRes.success) {
    return <>Failed to load user data</>;
  }
  const user = userRes.data;

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="sidebar" user={user} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
