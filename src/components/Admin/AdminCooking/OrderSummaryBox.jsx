import { useState } from 'react';

import OpenButton from '@/components/Admin/OpenButton';

import TableOrderCard from './TableOrderCard';

export default function OrderSummaryBox({ orderData }) {
  const [summaryOpen, setSummaryOpen] = useState(false);

  return (
    <div className="sticky top-0 z-10 flex w-full min-h-13 shrink-0 max-h-50 overflow-auto flex-col bg-white px-5 py-2 shadow-[0_1px_2px_0_rgba(0,0,0,0.1)]">
      <button
        type="button"
        onClick={() => setSummaryOpen((v) => !v)}
        aria-expanded={summaryOpen}
        className="flex h-10 w-full items-center justify-between px-2 py-1.5"
      >
        <div className="flex items-center gap-1">
          <span className="text-[16px] font-semibold leading-[1.6] text-[#222]">주문 요약</span>
          <span className="font-medium text-[14px] text-[#A0A0A0]">(총 {orderData.length}건)</span>
        </div>
        <OpenButton open={summaryOpen} />
      </button>

      <div /* 주문 요약 오픈시 박스 */
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          summaryOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-wrap gap-2 pb-2.5 pt-1">
            {orderData.length > 0 ? (
              orderData.map((data) => (
                <TableOrderCard
                  key={data.orderId}
                  tableNumber={data.tableNumber}
                  checkedCount={data.orderItemUnits?.filter((u) => u.isServed).length ?? 0}
                  totalCount={data.orderItemUnits?.length ?? 0}
                />
              ))
            ) : (
              <p className="font-semibold mx-auto my-5 text-deep-gray">
                현재 요약된 주문이 없습니다!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
