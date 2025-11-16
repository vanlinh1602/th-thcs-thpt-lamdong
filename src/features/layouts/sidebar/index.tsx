'use client';

import { get } from 'lodash';
import { LayoutDashboard } from 'lucide-react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { translations } from '@/locales/translations';

import { NavUser } from './nav-user';

const menus = [
  {
    key: 'dashboard',
    icon: LayoutDashboard,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isMobile, toggleSidebar } = useSidebar();
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const activeKey = pathname.split('/')[1] || 'dashboard';
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/">
                <img
                  src="/logo.png"
                  alt="logo"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-base font-semibold">
                  {t(translations.appName)}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {menus.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <Link
                    to={item.key}
                    onClick={() => {
                      if (isMobile) {
                        toggleSidebar();
                      }
                    }}
                  >
                    <SidebarMenuButton
                      className={
                        activeKey === item.key
                          ? 'bg-primary text-white hover:bg-blue-300 hover:text-white cursor-default'
                          : ''
                      }
                      tooltip={t(
                        get(translations, ['pages', item.key], item.key)
                      )}
                    >
                      {item.icon && <item.icon />}
                      <span>
                        {t(get(translations, ['pages', item.key], item.key))}
                      </span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
