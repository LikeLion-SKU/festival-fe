import { RouterProvider, createBrowserRouter } from 'react-router';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import RootLayout from '@/layouts/RootLayout';
import ServiceLayout from '@/layouts/ServiceLayout';
import ProtectedRoute from '@/router/ProtectedRoute';

//const page = (importFn) => () => importFn().then((m) => ({ Component: m.default }));

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
        Component: ProtectedRoute,
        children: [
          //{ path: "", lazy: page(() => import("파일 경로")) },
        ],
      },
    ],
  },
  {
    path: '/auth',
    Component: ServiceLayout,
    children: [
      //{ index: true, lazy: page(() => import("파일 경로")) },
      //{ path: "", lazy: page(() => import("파일 경로")) },
    ],
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
