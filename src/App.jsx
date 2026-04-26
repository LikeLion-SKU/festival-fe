import { RouterProvider, createBrowserRouter } from 'react-router';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import AdminLayout from '@/layouts/AdminLayout';
import MobileLayout from '@/layouts/MobileLayout';
import RootLayout from '@/layouts/RootLayout';
import ServiceLayout from '@/layouts/ServiceLayout';
import Main from '@/pages/Main';
import Order from '@/pages/Order/Order';
import ProtectedRoute from '@/router/ProtectedRoute';

const page = (importFn) => () => importFn().then((m) => ({ Component: m.default }));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1 },
  },
});

const router = createBrowserRouter([
  {
    path: '/',
    Component: Main,
  },
  {
    Component: RootLayout,
    children: [
      {
        Component: MobileLayout,
        children: [
          {
            path: '/order',
            Component: Order,
            children: [
              { index: true, lazy: page(() => import('@/pages/Order/OrderEntry')) }, // order 접속 시 자동으로 OrderEntry부터 기본으로
              //{ path: 'confirm', lazy: page(() => import('@/pages/Order/OrderConfirm')) },
              //{ path: 'complete', lazy: page(() => import('@/pages/Order/OrderComplete')) },
            ],
          },
        ],
      },
      {
        Component: AdminLayout,
        children: [
          //{ path: '', lazy: page(() => import('파일 경로')) },
          {
            Component: ProtectedRoute,
            children: [
              //{ path: "", lazy: page(() => import("파일 경로")) },
            ],
          },
        ],
      },
    ],
  },
  {
    Component: AdminLayout,
    children: [{ path: '/login', lazy: page(() => import('@/pages/admin/AdminLogin')) }],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
