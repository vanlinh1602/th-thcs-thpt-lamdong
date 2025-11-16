import { onAuthStateChanged } from 'firebase/auth';
import { lazy, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { useShallow } from 'zustand/shallow';

import AuthRouter from './AuthRouter';
import MainLayout from './features/layouts';
import { useUserStore } from './features/user/hooks';
import { auth } from './services/firebase';

const LoginPage = lazy(() => import('./pages/Login'));
const HomePage = lazy(() => import('./pages/Home'));
const ReportsDashboardPage = lazy(() => import('./pages/Reports/Dashboard'));

const ListReportPage = lazy(() => import('./pages/Reports/List'));

function App() {
  const { authUser } = useUserStore(
    useShallow((state) => ({
      authUser: state.authUser,
    }))
  );

  useEffect(() => {
    return onAuthStateChanged(auth, (userAuth) => {
      if (userAuth) {
        authUser();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<AuthRouter />}>
            <Route path="/reports" element={<ReportsDashboardPage />} />
            <Route path="/reports/:reportId" element={<ListReportPage />} />

            <Route element={<MainLayout />}>
              <Route index path="/dashboard" element={<HomePage />} />
              <Route index path="/" element={<HomePage />} />
              <Route
                path="*"
                element={
                  <div className="flex h-screen items-center justify-center">
                    <h1 className="text-2xl font-bold mr-2">404</h1>
                    <p className="text-sm text-muted-foreground">
                      Page not found
                    </p>
                  </div>
                }
              />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
