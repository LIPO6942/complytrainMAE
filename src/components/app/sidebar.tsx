'use client';

import {
  Bell,
  BookOpen,
  FileText,
  Home,
  Settings,
  ShieldCheck,
  Users,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { MaeLogo } from '@/components/icons';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/firebase';

const menuItems = [
  { href: '/dashboard', label: 'Tableau de bord', icon: Home },
  { href: '/courses', label: 'Cours', icon: BookOpen },
  { href: '/reporting', label: 'Rapports', icon: FileText },
  { href: '/audit', label: 'Piste d\'audit', icon: ShieldCheck },
];

const adminMenuItems = [
    { href: '/users', label: 'Utilisateurs', icon: Users },
]

const bottomMenuItems = [
    { href: '/settings', label: 'Paramètres', icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname();
  const { userProfile } = useUser();
  const isAdmin = userProfile?.role === 'admin';

  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader className="border-b">
          <div className="flex items-center gap-2">
            <MaeLogo className="h-8 w-8" />
            <span className="text-lg font-semibold">ComplyTrain</span>
          </div>
        </SidebarHeader>
        <SidebarMenu className="p-2 flex-1">
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <Link href={item.href} passHref>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(item.href)}
                  tooltip={item.label}
                >
                  <span className="flex items-center gap-2">
                    <item.icon />
                    <span>{item.label}</span>
                  </span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
          {isAdmin && adminMenuItems.map((item) => (
             <SidebarMenuItem key={item.label}>
              <Link href={item.href} passHref>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(item.href)}
                  tooltip={item.label}
                >
                  <span className="flex items-center gap-2">
                    <item.icon />
                    <span>{item.label}</span>
                  </span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <SidebarMenu className="p-2 mt-auto">
             {bottomMenuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                <Link href={item.href} passHref>
                    <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href)}
                    tooltip={item.label}
                    >
                    <span className="flex items-center gap-2">
                        <item.icon />
                        <span>{item.label}</span>
                    </span>
                    </SidebarMenuButton>
                </Link>
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Bell />
              <span>Notifications</span>
               <div className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-xs font-medium text-destructive-foreground">
                3
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
