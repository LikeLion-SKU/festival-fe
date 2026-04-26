import { RouterProvider, createBrowserRouter } from 'react-router';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import AdminLayout from '@/layouts/AdminLayout';
import MobileLayout from '@/layouts/MobileLayout';
import OrderLayout from '@/layouts/OrderLayout';
import RootLayout from '@/layouts/RootLayout';
import AdminMain from '@/pages/admin/AdminMain';
import ProtectedRoute from '@/router/ProtectedRoute';

const page = (importFn) => () => importFn().then((m) => ({ Component: m.default }));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1 },
  },
});

const router = createBrowserRouter([
  {
    //헤더가 있는 디자인 페이지
    Component: RootLayout,
    children: [
      {
        Component: MobileLayout,
        children: [
          //{ path: '', lazy: page(() => import('파일 경로')) },
        ],
      },
    ],
  },
  {
    //헤더 있는 주문 시스템 레이아웃
    Component: OrderLayout,
    children: [
      {
        Component: MobileLayout,
        children: [
          //{ path: '', lazy: page(() => import('파일 경로')) },
        ],
      },
      {
        Component: AdminLayout,
        children: [
          //{ path: '', lazy: page(() => import('파일 경로')) },
          {
            Component: ProtectedRoute,
            children: [
              {
                path: '/admin',
                Component: AdminMain,
                children: [
                  { path: 'waiting', lazy: page(() => import('@/pages/admin/WatingMenu')) },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    //헤더 없는 사용자 페이지
    Component: MobileLayout,
    children: [{ path: '/', lazy: page(() => import('@/pages/Main')) }],
  },
  {
    //헤더 없는 관리자 페이지
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
