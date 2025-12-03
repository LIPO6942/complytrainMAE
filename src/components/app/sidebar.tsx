'use client';

import {
  Bell,
  BookOpen,
  FileText,
  Home,
  LayoutDashboard,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Logo } from '@/components/icons';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/firebase';
import { Badge } from '../ui/badge';

const menuItems = [
  { href: '/dashboard', label: 'Tableau de bord', icon: Home },
  { href: '/courses', label: 'Cours', icon: BookOpen },
  { href: '/reporting', label: 'Rapports', icon: FileText },
  { href: '/audit', label: 'Piste d\'audit', icon: ShieldCheck },
];

const adminMenuItems = [
    { href: '/users', label: 'Utilisateurs', icon: Users },
    { href: '/admin-dashboard', label: 'Dashboard Admin', icon: LayoutDashboard },
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

  const notificationCount = 3;

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader className="border-b">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Logo className="h-8 w-8" />
            <span className="text-lg font-semibold">ComplyTrain</span>
          </Link>
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                    <Bell />
                    <span>Notifications</span>
                    {notificationCount > 0 && (
                        <div className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-xs font-medium text-destructive-foreground">
                            {notificationCount}
                        </div>
                    )}
                </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex-col items-start gap-1">
                    <p className='font-semibold'>Nouveau cours disponible</p>
                    <p className='text-muted-foreground text-xs'>Le cours "KYC Avancé" a été ajouté.</p>
                </DropdownMenuItem>
                 <DropdownMenuItem className="flex-col items-start gap-1">
                    <p className='font-semibold'>Mise à jour de cours</p>
                    <p className='text-muted-foreground text-xs'>Le contenu de "Fondements LAB/FT" a été mis à jour.</p>
                </DropdownMenuItem>
                 <DropdownMenuItem className="flex-col items-start gap-1">
                    <p className='font-semibold'>Rappel de quiz</p>
                    <p className='text-muted-foreground text-xs'>N'oubliez pas de terminer le quiz pour "Guide Pratique KYC".</p>
                </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}