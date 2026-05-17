import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { logout } from "@/lib/actions/auth";
import { getUserData } from "@/lib/actions/read_user";
import {
  IconClipboardList,
  IconFilePlus,
  IconHome,
  IconLogout,
  IconUserCircle,
} from "@tabler/icons-react";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-muted/20 text-foreground lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
      <DashboardSidebar />
      <div className="min-w-0">{children}</div>
    </div>
  );
}

async function DashboardSidebar() {
  const userResult = await getUserData();
  const user = userResult.success
    ? userResult.data
    : { name: "Account", email: "Signed in" };

  return (
    <aside className="border-b border-border bg-background px-4 py-4 lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between gap-3 lg:block">
        <Link href="/dashboard" className="block">
          <p className="text-sm font-semibold text-muted-foreground">
            Survey System
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">
            Dashboard
          </h2>
        </Link>
        <div className="lg:hidden">
          <ThemeToggle />
        </div>
      </div>

      <nav className="mt-5 grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
        <SidebarLink href="/dashboard" icon={<IconHome />}>
          Overview
        </SidebarLink>
        <SidebarLink href="/dashboard/surveys" icon={<IconClipboardList />}>
          Surveys
        </SidebarLink>
        <SidebarLink href="/dashboard/surveys/create" icon={<IconFilePlus />}>
          Create survey
        </SidebarLink>
      </nav>

      <div className="hidden lg:mt-5 lg:block">
        <ThemeToggle />
      </div>

      <div className="mt-5 lg:mt-auto">
        <Separator className="mb-4" />

        <Link
          href={"/auth/me"}
          className="flex items-start gap-3 rounded-md border border-border bg-muted/30 p-3"
        >
          <IconUserCircle className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        </Link>
        <form action={logout} className="mt-3">
          <Button type="submit" variant="outline" className="w-full">
            <IconLogout />
            Log out
          </Button>
        </form>
      </div>
    </aside>
  );
}

function SidebarLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Button asChild variant="ghost" className="justify-start">
      <Link href={href}>
        {icon}
        {children}
      </Link>
    </Button>
  );
}
