import { useEffect, useState } from 'react';

import NewOrderIcon from '@/assets/icons/admin/new_order_icon.svg?react';

export default function NewOrderSignal({ onClick }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-3 h-11 rounded-full bg-white pl-5 pr-2 shadow-[0_0_5px_0_rgba(196,58,49,0.35)] transition-all duration-300 ease-out ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      <NewOrderIcon style={{ width: '17.5px', height: '21.5px' }} className="shrink-0" />
      <span className="text-[14px] font-semibold leading-[1.6] text-[#595959] whitespace-nowrap">
        새로운 주문이 들어왔어요!
      </span>
      <span className="flex h-7 items-center justify-center rounded-full bg-[#FFDDDB] px-3 text-[12px] font-semibold leading-[1.6] text-[#595959] whitespace-nowrap">
        이동하기
      </span>
    </button>
  );
}
