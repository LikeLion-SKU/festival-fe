import { Outlet, useOutletContext } from 'react-router';

export default function MobileLayout() {
  const context = useOutletContext(); // OrderLayout이 준 context 받기
  return (
    <div className="bg-gray-50 h-full">
      <div className="mx-auto w-full max-w-[450px] h-full bg-white shadow-lg">
        <Outlet context={context} />
      </div>
    </div>
  );
}
