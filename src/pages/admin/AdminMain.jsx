import { Outlet } from 'react-router-dom';

import OrderHeader from '@/components/common/OrderHeader';

export default function AdminMain() {
  return (
    <>
      <OrderHeader title="관리자 페이지" showBackButton={true} />
      <h1>관리자 메인</h1>
      <Outlet />
    </>
  );
}
