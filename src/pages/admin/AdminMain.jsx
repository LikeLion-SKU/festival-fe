import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate, useOutletContext } from 'react-router-dom';

import CancelIcon from '@/assets/icons/admin/cancel_gray_icon.svg';
import CancelActiveIcon from '@/assets/icons/admin/cancel_red_icon.svg';
import CookIcon from '@/assets/icons/admin/cook_gray_icon.svg';
import CookActiveIcon from '@/assets/icons/admin/cook_red_icon.svg';
import DoneIcon from '@/assets/icons/admin/done_gray_icon.svg';
import DoneActiveIcon from '@/assets/icons/admin/done_red_icon.svg';
import ProductIcon from '@/assets/icons/admin/product_gray_icon.svg';
import ProductActiveIcon from '@/assets/icons/admin/product_red_icon.svg';
import WaitIcon from '@/assets/icons/admin/wait_gray_icon.svg';
import WaitActiveIcon from '@/assets/icons/admin/wait_red_icon.svg';
import NavButton from '@/components/Admin/NavButton';

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
    key: 'menu',
    name: '메뉴',
    icon: ProductIcon,
    activeIcon: ProductActiveIcon,
    goto: '/admin/menu',
  },
];

const STATUS_TO_KEY = {
  WAITING: 'wait',
  COOKING: 'cook',
  COMPLETED: 'complete',
  COMPLETE: 'complete',
  DONE: 'complete',
  CANCELED: 'cancel',
  CANCELLED: 'cancel',
};

const INITIAL_COUNTS = { wait: 0, cook: 0, complete: 0, cancel: 0 };

export default function AdminMain() {
  const context = useOutletContext();
  const { setHeaderConfig } = useOutletContext();
  const navigate = useNavigate();
  const location = useLocation();

  const selected = NAV_ITEMS.find((item) => location.pathname.startsWith(item.goto))?.key ?? 'wait';

  const [counts, setCounts] = useState(INITIAL_COUNTS);
  const selectedRef = useRef(selected);

  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  useEffect(() => {
    setHeaderConfig({
      title: '주문 관리',
    });
  }, [setHeaderConfig]);

  // 자식 페이지에서 SSE orderNotification 수신 시 호출
  const notifyOrderStatus = useCallback((orderStatus) => {
    const key = STATUS_TO_KEY[orderStatus];
    if (!key) return;
    if (key === selectedRef.current) return;
    setCounts((prev) => ({ ...prev, [key]: prev[key] + 1 }));
  }, []);

  // 자식 페이지가 mount될 때 호출하여 본인 탭 카운트를 0으로 비움
  const clearCount = useCallback((key) => {
    if (!key) return;
    setCounts((prev) => (prev[key] ? { ...prev, [key]: 0 } : prev));
  }, []);

  const childContext = useMemo(
    () => ({ ...context, notifyOrderStatus, clearCount }),
    [context, notifyOrderStatus, clearCount]
  );

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
            count={counts[item.key] ?? 0}
            onClick={() => moveToMenu(item)}
          />
        ))}
      </nav>
      <div className="flex-1 overflow-auto">
        <Outlet context={childContext} />
      </div>
    </div>
  );
}
