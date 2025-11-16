import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useShallow } from 'zustand/shallow';

import { Loading } from '@/components';
import { useUserStore } from '@/features/user/hooks';
import { translations } from '@/locales/translations';
import { auth } from '@/services/firebase';
import formatError from '@/utils/formatError';

function useQuery() {
  return useMemo(() => new URLSearchParams(window.location.search), []);
}

const GoogleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    className="w-5 h-5"
    aria-hidden
  >
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12S17.373 12 24 12c3.059 0 5.842 1.153 7.961 3.039l5.657-5.657C34.675 6.053 29.603 4 24 4 12.954 4 4 12.954 4 24s8.954 20 20 20c11.046 0 20-8.954 20-20 0-1.341-.138-2.651-.389-3.917z"
    />
    <path
      fill="#FF3D00"
      d="M6.306 14.691l6.571 4.817C14.4 16.101 18.822 12 24 12c3.059 0 5.842 1.153 7.961 3.039l5.657-5.657C34.675 6.053 29.603 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.164 0 9.86-1.977 13.409-5.197l-6.19-5.238C29.162 35.091 26.715 36 24 36c-5.202 0-9.62-3.317-11.279-7.951l-6.54 5.036C9.5 39.556 16.227 44 24 44z"
    />
    <path
      fill="#1976D2"
      d="M43.611 20.083H42V20H24v8h11.303c-.79 2.23-2.228 4.156-4.094 5.565l.003-.002 6.19 5.238C39.064 36.46 42 30.963 42 24c0-1.341-.138-2.651-.389-3.917z"
    />
  </svg>
);

export default function AuthPage() {
  const { t } = useTranslation();
  const query = useQuery();
  const next = query.get('next');
  const [handling, setHandling] = useState(false);
  const navigate = useNavigate();

  const { user, userHandling } = useUserStore(
    useShallow((state) => ({
      user: state.user,
      userHandling: state.handling,
    }))
  );

  useEffect(() => {
    if (user) {
      if (
        !user.roles?.admin &&
        !user.roles?.sgd &&
        !next?.startsWith('/reports')
      ) {
        navigate('/reports', { replace: true });
        return;
      }
      if (next) {
        navigate(next, { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [user, navigate, next]);

  const handleGoogleLogin = async () => {
    setHandling(true);
    try {
      const providerInstance = new GoogleAuthProvider();
      await signInWithPopup(auth, providerInstance);
    } catch (error) {
      toast.error(t(translations.errors.title), {
        description: formatError(error),
      });
    } finally {
      setHandling(false);
    }
  };

  return (
    <div className="min-h-dvh bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4 py-10">
      {handling || userHandling ? <Loading /> : null}
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-gray-200 shadow-sm bg-white p-6 md:p-8">
          <div className="text-center text-xl font-bold text-gray-500 mb-2">
            Hệ thống thống kê Mầm non Lâm Đồng
          </div>
          <div className="flex flex-col items-center gap-3 mb-6">
            <img className="w-20" src="logo_full.png" />
            <div className="text-center">
              <h1 className="text-lg md:text-xl font-semibold">Đăng nhập</h1>
              <p className="text-sm text-gray-500">
                Vui lòng đăng nhập để tiếp tục
              </p>
            </div>
          </div>

          {/* Only one option: Google */}
          <button
            onClick={handleGoogleLogin}
            disabled={handling}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium hover:bg-gray-50 disabled:opacity-60"
          >
            <GoogleIcon />
            {handling ? 'Đang chuyển hướng...' : 'Đăng nhập bằng Google'}
          </button>

          {/* <div className="mt-6 text-center text-xs text-gray-500">
          By continuing, you agree to our Terms and Privacy Policy.
        </div> */}
        </div>
        {next && (
          <div className="mt-4 text-sm  border rounded-lg p-4 shadow-sm bg-amber-200 text-gray-500 border-amber-400">
            <div className="text-center font-bold text-base text-gray-500 mb-1">
              Cách đăng nhập để sử dụng phần mềm báo cáo
            </div>
            <div>
              <b>1.</b> Trường có thể đăng nhập{' '}
              <b>bằng bất kỳ email nào, không cần đăng ký tài khoản trước.</b>
            </div>
            <div>
              <b>2. Một email</b> có thể dùng để{' '}
              <b>cập nhật cho nhiều trường/nhóm trẻ </b>, phù hợp với các đơn vị
              phụ trách nhập liệu chung theo Phường/Xã.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
