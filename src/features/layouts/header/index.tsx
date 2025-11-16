import { useQueryClient } from '@tanstack/react-query';
import { LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/features/user/hooks';
import { translations } from '@/locales/translations';
import { auth } from '@/services/firebase';
import formatError from '@/utils/formatError';

export function Header() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { user, logout } = useUserStore(
    useShallow((state) => ({
      user: state.user,
      logout: state.logout,
    }))
  );

  return (
    <header className="sticky top-0 z-50 border-b border-blue-100 bg-white/80 backdrop-blur-md dark:border-blue-900/20 dark:bg-gray-950/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="relative h-8 w-8">
            <img
              src="/logo.png"
              alt={t(translations.appName)}
              className="rounded-full"
            />
          </div>
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
            {t(translations.appName)}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="flex md:items-center md:gap-6">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 rounded-full">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left text-sm leading-tight hidden md:grid">
              <span className="truncate font-medium">{user?.name}</span>
              <span className="truncate text-xs">{user?.email}</span>
            </div>
            <Button
              size="sm"
              className="bg-red-500 text-white hover:bg-red-600"
              onClick={async () => {
                try {
                  await auth.signOut();
                  await logout();
                  await queryClient.clear();
                } catch (error) {
                  toast.error('Đăng xuất lỗi', {
                    description: formatError(error),
                  });
                }
              }}
            >
              <LogOut className="h-5 w-5" />
              <span className="hidden md:block">Đăng xuất</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
