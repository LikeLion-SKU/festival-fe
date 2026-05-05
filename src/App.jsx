import { RouterProvider, createBrowserRouter } from 'react-router';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import AdminLayout from '@/layouts/AdminLayout';
import MobileLayout from '@/layouts/MobileLayout';
import Order from '@/pages/Order/Order';
import AdminMain from '@/pages/admin/AdminMain';

const page = (importFn) => () => importFn().then((m) => ({ Component: m.default }));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1 },
  },
});

const router = createBrowserRouter([
  {
    //모바일 레이아웃 - 사용자 페이지
    Component: MobileLayout,
    children: [
      { path: '/', lazy: page(() => import('@/pages/Main')) },
      { path: '/menu', lazy: page(() => import('@/pages/Menu')) },
      { path: '/made-by', lazy: page(() => import('@/pages/MadeBy')) },
      { path: '/lost-items', lazy: page(() => import('@/pages/LostItem/LostItem')) },
      {
        path: '/lost-items/new',
        lazy: page(() => import('@/pages/LostItem/LostItemRegister')),
      },
      {
        path: '/lost-items/:id/edit',
        lazy: page(() => import('@/pages/LostItem/LostItemEdit')),
      },
      { path: '/lost-items/:id', lazy: page(() => import('@/pages/LostItem/LostItemDetail')) },
      { path: '/booth-map', lazy: page(() => import('@/pages/Booth/BoothMap')) },
      {
        path: '/order/:boothId',
        Component: Order,
        children: [
          { index: true, lazy: page(() => import('@/pages/Order/OrderEntry')) },
          { path: 'progress', lazy: page(() => import('@/pages/Order/OrderProgress')) },
          { path: 'confirm', lazy: page(() => import('@/pages/Order/OrderConfirm')) },
          { path: 'customer-info', lazy: page(() => import('@/pages/Order/CustomerInfo')) },
          { path: 'pay', lazy: page(() => import('@/pages/Order/OrderPay')) },
          { path: 'complete', lazy: page(() => import('@/pages/Order/OrderComplete')) },
        ],
      },
    ],
  },
  {
    //관리자 레이아웃 (헤더 + 컨테이너 통합)
    Component: AdminLayout,
    children: [
      {
        path: '/admin',
        Component: AdminMain,
        children: [
          { path: 'waiting', lazy: page(() => import('@/pages/admin/WatingMenu')) },
          { path: 'cooking', lazy: page(() => import('@/pages/admin/CookingMenu')) },
          { path: 'complete', lazy: page(() => import('@/pages/admin/CompleteMenu')) },
          { path: 'cancel', lazy: page(() => import('@/pages/admin/CancelMenu')) },
          { path: 'menu', lazy: page(() => import('@/pages/admin/ManagementMenu')) },
        ],
      },
      { path: '/login', lazy: page(() => import('@/pages/admin/AdminLogin')) },
    ],
  },
  {
    //헤더 없는 사용자 페이지
    Component: MobileLayout,
    children: [
      { path: '/', lazy: page(() => import('@/pages/Main')) },
      { path: '/menu', lazy: page(() => import('@/pages/Menu')) },
      { path: '/made-by', lazy: page(() => import('@/pages/MadeBy')) },
      {
        path: '/order/:boothId',
        Component: Order,
        children: [
          { index: true, lazy: page(() => import('@/pages/Order/OrderEntry')) },
          { path: 'progress', lazy: page(() => import('@/pages/Order/OrderProgress')) },
          { path: 'confirm', lazy: page(() => import('@/pages/Order/OrderConfirm')) },
          { path: 'customer-info', lazy: page(() => import('@/pages/Order/CustomerInfo')) },
          { path: 'pay', lazy: page(() => import('@/pages/Order/OrderPay')) },
          { path: 'complete', lazy: page(() => import('@/pages/Order/OrderComplete')) },
        ],
      },
    ],
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
