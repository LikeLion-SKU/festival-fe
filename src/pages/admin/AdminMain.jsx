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
  DONE: 'complete',
  CANCELED: 'cancel',
};

const INITIAL_COUNTS = { wait: 0, cook: 0, complete: 0, cancel: 0 };

export default function AdminMain() {
  const context = useOutletContext();
  const { setHeaderConfig } = useOutletContext();
  const navigate = useNavigate();
  const location = useLocation();

  const selected = NAV_ITEMS.find((item) => location.pathname.startsWith(item.goto))?.key ?? 'wait';

  const [counts, setCounts] = useState(INITIAL_COUNTS);
  const pendingIdsRef = useRef({
    wait: new Set(),
    cook: new Set(),
    complete: new Set(),
    cancel: new Set(),
  });
  const selectedRef = useRef(selected);
  const outerScrollRef = useRef(null);
  const [pageScrollEl, setPageScrollEl] = useState(null);

  const handleScrollTop = () => {
    const target = pageScrollEl ?? outerScrollRef.current;
    target?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  useEffect(() => {
    setHeaderConfig({
      title: '주문 관리',
    });
  }, [setHeaderConfig]);

  // SSE orderIncrementNotification 수신 시 호출 — 카운트 +1, 미확인 id Set에 추가
  const addPendingOrder = useCallback((orderStatus, orderId) => {
    const key = STATUS_TO_KEY[orderStatus];
    if (!key) return;
    if (key === selectedRef.current) return;
    const set = pendingIdsRef.current[key];
    if (set.has(orderId)) return;
    set.add(orderId);
    setCounts((prev) => ({ ...prev, [key]: (prev[key] ?? 0) + 1 }));
  }, []);

  // SSE orderDecrementNotification 수신 시 호출 — 미확인 id Set에 있을 때만 카운트 -1, id 제거
  const removePendingOrder = useCallback((orderStatus, orderId) => {
    const key = STATUS_TO_KEY[orderStatus];
    if (!key) return;
    const set = pendingIdsRef.current[key];
    if (!set?.has(orderId)) return;
    set.delete(orderId);
    setCounts((prev) => ({ ...prev, [key]: Math.max(0, (prev[key] ?? 0) - 1) }));
  }, []);

  // 자식 페이지가 mount될 때 호출하여 본인 탭 카운트와 미확인 id Set을 비움
  const clearCount = useCallback((key) => {
    if (!key) return;
    pendingIdsRef.current[key]?.clear();
    setCounts((prev) => (prev[key] ? { ...prev, [key]: 0 } : prev));
  }, []);

  const childContext = useMemo(
    () => ({
      ...context,
      addPendingOrder,
      removePendingOrder,
      clearCount,
      setScrollContainer: setPageScrollEl,
    }),
    [context, addPendingOrder, removePendingOrder, clearCount]
  );

  const moveToMenu = (item) => {
    navigate(item.goto);
  };

  return (
    <div className="relative flex flex-col h-full">
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
      <div ref={outerScrollRef} className="flex-1 overflow-auto">
        <Outlet context={childContext} />
      </div>
      <button
        type="button"
        onClick={handleScrollTop}
        aria-label="맨 위로"
        className="absolute bottom-5 right-5 flex size-11 items-center justify-center rounded-full bg-white shadow-[0_0_4px_0_rgba(0,0,0,0.25)]"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 19V5" stroke="#7F7F7F" strokeWidth="1.6" strokeLinecap="round" />
          <path
            d="M5 12L12 5L19 12"
            stroke="#7F7F7F"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
