import { useEffect } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';

export default function AdminMain() {
  const { setHeaderConfig } = useOutletContext();
  useEffect(() => {
    // 페이지 진입 시 헤더 설정 업데이트
    setHeaderConfig({
      title: '관리자 페이지',
    });
  }, [setHeaderConfig]);
  return (
    <>
      <h1>관리자 메인</h1>
      <Outlet />
    </>
  );
}
