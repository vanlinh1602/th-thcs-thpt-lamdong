import { LogIn } from 'lucide-react';
import { Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import { useUserStore } from '@/features/user/hooks';
import { translations } from '@/locales/translations';

export const PermissionDenied = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/20 dark:bg-red-900/10">
        <h2 className="mb-2 text-xl font-bold text-red-700 dark:text-red-400">
          {t(translations.auth.permissionDenied)}
        </h2>
        <p className="mb-4 text-red-600 dark:text-red-300">
          {t(translations.auth.permissionDeniedDesc)}
        </p>
        <div className="flex gap-2 justify-center">
          <Button onClick={() => navigate('/')} variant="outline">
            <Home className="mr-2 h-4 w-4" />
            {t(translations.actions.backToHome)}
          </Button>
          {!user ? (
            <Button onClick={() => navigate('/login')} variant="outline">
              <LogIn className="mr-2 h-4 w-4" />
              {t(translations.login)}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default PermissionDenied;
