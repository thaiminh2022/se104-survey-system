"use client";

import * as React from "react";
import {
  IconDashboard,
  IconFile,
  IconFolder,
  IconSettings,
} from "@tabler/icons-react";

import { NavMain } from "@/components/ui/dashboard/nav-main";
import { NavSecondary } from "@/components/ui/dashboard/nav-secondary";
import { NavUser } from "@/components/ui/dashboard/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { AppUserData } from "@/lib/types/db_schema";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Surveys",
      url: "/dashboard/surveys",
      icon: IconFolder,
    },
  ],

  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
  ],
};

type DataProps = {
  user: AppUserData;
};

type Props = DataProps & React.ComponentProps<typeof Sidebar>;

export function AppSidebar({ user, ...props }: Props) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="/dashboard">
                <IconFile className="size-5!" />
                <span className="text-base font-semibold">Survey System</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
