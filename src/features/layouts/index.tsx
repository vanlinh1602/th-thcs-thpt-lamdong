import { Suspense } from 'react';
import { Outlet } from 'react-router';

import { Header } from './header';

export default function MainLayout() {
  return (
    <Suspense>
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </Suspense>
  );
}
