import { Outlet } from 'react-router';

export default function MobileLayout() {
  return (
    <div className="bg-gray-50 min-h-dvh">
      <div className="mx-auto w-full max-w-[450px] min-h-dvh bg-white shadow-lg">
        <Outlet />
      </div>
    </div>
  );
}
