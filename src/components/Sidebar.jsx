"use client";

import { usePathname } from "next/navigation";
import {
  Award,
  Briefcase,
  FileText,
  FolderOpen,
  LayoutDashboard,
  Twitter,
  User,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import LogoutButton from "./LogoutButton";
import Link from "next/link";

const data = {
  navMain: [
    {
      title: "Navigations",
      items: [
        { title: "About", url: "/dashboard/about", icon: User },
        { title: "Projects", url: "/dashboard/projects", icon: FolderOpen },
        { title: "Achievements", url: "/dashboard/achievements", icon: Award },
        { title: "Experience", url: "/dashboard/experience", icon: Briefcase },
        { title: "Twitter", url: "/dashboard/twitter", icon: Twitter },
        { title: "Blogs", url: "/dashboard/blogs", icon: FileText },
      ],
    },
  ],
};

export function AppSidebar({ ...props }) {
  const pathname = usePathname();

  return (
    <Sidebar {...props}>
      <SidebarHeader className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center justify-start gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white flex-col">
            <User className="w-5 h-5" />
          </div>
          <div className="font-semibold text-sm">Admin Panel</div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((nav) => (
                  <SidebarMenuItem key={nav.title}>
                    <SidebarMenuButton asChild isActive={pathname === nav.url}>
                      <Link href={nav.url} className="flex items-center gap-2">
                        <nav.icon className="w-4 h-4" />
                        {nav.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="px-4 pb-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <LogoutButton className="text-red-500" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
