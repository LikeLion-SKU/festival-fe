import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate, useOutletContext } from 'react-router-dom';

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
  {
    key: 'cook',
    name: '조리 중',
    icon: CookIcon,
    activeIcon: CookActiveIcon,
    goto: '/admin/cooking',
  },
  {
    key: 'complete',
    name: '완료',
    icon: DoneIcon,
    activeIcon: DoneActiveIcon,
    goto: '/admin/complete',
  },
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
  const context = useOutletContext();
  const { setHeaderConfig } = useOutletContext();
  const navigate = useNavigate();
  const location = useLocation();

  const selected = NAV_ITEMS.find((item) => location.pathname.startsWith(item.goto))?.key ?? 'wait';

  useEffect(() => {
    setHeaderConfig({
      title: '주문 관리',
    });
  }, [setHeaderConfig]);

  const moveToMenu = (item) => {
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
      <div className="flex-1 overflow-auto">
        <Outlet context={context} />
      </div>
    </div>
  );
}
