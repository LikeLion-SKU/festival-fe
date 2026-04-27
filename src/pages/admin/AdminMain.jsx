import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useOutletContext } from 'react-router-dom';

import CancelIcon from '@/assets/icons/admin/cancel_gray_icon.svg';
import CancelActiveIcon from '@/assets/icons/admin/cancel_red_icon.svg';
import CookIcon from '@/assets/icons/admin/cook_gray_icon.svg';
import CookActiveIcon from '@/assets/icons/admin/cook_red_icon.svg';
import DoneIcon from '@/assets/icons/admin/done_gray_icon.svg';
import DoneActiveIcon from '@/assets/icons/admin/done_red_icon.svg';
import ProductIcon from '@/assets/icons/admin/product_gray_icon.svg';
import WaitIcon from '@/assets/icons/admin/wait_gray_icon.svg';
import WaitActiveIcon from '@/assets/icons/admin/wait_red_icon.svg';
import NavButton from '@/components/Admin/NavButton';

//import ProductActiveIcon from '@/assets/icons/admin/product_red_icon.svg';

const NAV_ITEMS = [
  { key: 'wait', name: '대기', icon: WaitIcon, activeIcon: WaitActiveIcon, goto: '/admin/waiting' },
  { key: 'cook', name: '조리', icon: CookIcon, activeIcon: CookActiveIcon, goto: '/admin/cooking' },
  { key: 'done', name: '완료', icon: DoneIcon, activeIcon: DoneActiveIcon, goto: '/admin/done' },
  {
    key: 'cancel',
    name: '취소',
    icon: CancelIcon,
    activeIcon: CancelActiveIcon,
    goto: '/admin/cancel',
  },
  {
    key: 'product',
    name: '상품',
    icon: ProductIcon,
    activeIcon: 'ProductActiveIcon',
    goto: '/admin/product',
  },
];

export default function AdminMain() {
  const { setHeaderConfig } = useOutletContext();
  const navigate = useNavigate();
  const [selected, setSelected] = useState('wait');

  useEffect(() => {
    setHeaderConfig({
      title: '관리자 페이지',
    });
  }, [setHeaderConfig]);

  const moveToMenu = (item) => {
    setSelected(item.key);
    navigate(item.goto);
  };

  return (
    <div className="flex flex-col h-full">
      <nav className="flex w-full items-start border-b border-[#E5E5E5] bg-white mt-4">
        {NAV_ITEMS.map((item) => (
          <NavButton
            key={item.key}
            iconUrl={item.icon}
            activeIconUrl={item.activeIcon}
            name={item.name}
            isActive={selected === item.key}
            onClick={() => moveToMenu(item)}
          />
        ))}
      </nav>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
