import { Navigate, Outlet, useLocation } from 'react-router';
import { useShallow } from 'zustand/shallow';

import { useUserStore } from './features/user/hooks';

const AuthRouter = () => {
  const location = useLocation();
  const { user } = useUserStore(
    useShallow((state) => ({
      user: state.user,
    }))
  );

  if (!user?._id) {
    return <Navigate to={`/login?next=${location.pathname}`} replace />;
  }
  return <Outlet />;
};

export default AuthRouter;
