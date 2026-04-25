import { RouterProvider, createBrowserRouter } from 'react-router';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import AdminLayout from '@/layouts/AdminLayout';
import MobileLayout from '@/layouts/MobileLayout';
import RootLayout from '@/layouts/RootLayout';
import ServiceLayout from '@/layouts/ServiceLayout';
import ProtectedRoute from '@/router/ProtectedRoute';

const page = (importFn) => () => importFn().then((m) => ({ Component: m.default }));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1 },
  },
});

const router = createBrowserRouter([
  {
    Component: RootLayout,
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
