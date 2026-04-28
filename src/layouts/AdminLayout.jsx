import { Outlet, useOutletContext } from 'react-router';

export default function AdminLayout() {
  const context = useOutletContext(); // OrderLayout이 준 context 받기
  return (
    <div className="bg-gray-50 h-full flex flex-col ">
      <div className="mx-auto flex-1 w-full max-w-[1024px] h-full bg-white shadow-lg">
        <Outlet context={context} />
      </div>
    </div>
  );
}
