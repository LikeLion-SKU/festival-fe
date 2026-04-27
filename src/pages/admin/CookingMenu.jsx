import { useEffect, useState } from 'react';

import BangIcon from '@/assets/icons/admin/bang_icon.svg?react';
import CheckIcon from '@/assets/icons/admin/check_red_big_icon.svg?react';
import NothingIcon from '@/assets/icons/admin/nothing_icon.svg?react';
import WarningIcon from '@/assets/icons/admin/warning_icon.svg?react';
import TableOrderCard from '@/components/Admin/AdminCooking/TableOrderCard';
import BottomSheet from '@/components/Admin/BottomSheet';
import OpenButton from '@/components/Admin/OpenButton';
import OrderCard from '@/components/Admin/OrderCard';
import { orderData } from '@/constants/orderDummyData';

const CANCEL_REASONS = ['재료 소진', '주문 실수', '고객 요청', '기타'];

export default function CookingMenu() {
  const [modal, setModal] = useState(null);
  const [reason, setReason] = useState(null);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [checkedMap, setCheckedMap] = useState(() =>
    Object.fromEntries(orderData.map((d) => [d.id, new Set()]))
  );

  const toggleItem = (orderId, idx) => {
    setCheckedMap((prev) => {
      const next = new Set(prev[orderId]);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return { ...prev, [orderId]: next };
    });
  };

  useEffect(() => {
    if (modal !== 'cookingDone') return;
    const t = setTimeout(() => setModal(null), 1500);
    return () => clearTimeout(t);
  }, [modal]);

  const closeModal = () => {
    setModal(null);
    setReason(null);
  };

  const handleConfirm = ({ allChecked }) => {
    setModal(allChecked ? 'cookingDone' : 'warning');
  };

  const handleWarningConfirm = () => setModal('cookingDone');

  const handleCancelSubmit = () => {
    if (!reason) return;
    setModal('cancelDone');
  };

  return (
    <div className="flex flex-col w-full h-full bg-[#EFEFEF] items-center pb-7">
      <div className="flex w-full flex-col bg-white px-5 py-2 shadow-[0_1px_2px_0_rgba(0,0,0,0.1)]">
        <button
          type="button"
          onClick={() => setSummaryOpen((v) => !v)}
          aria-expanded={summaryOpen}
          className="flex h-10 w-full items-center justify-between px-2 py-1.5"
        >
          <div className="flex items-center gap-1">
            <span className="text-[16px] font-semibold leading-[1.6] text-[#222]">주문 요약</span>
            <BangIcon />
          </div>
          <OpenButton open={summaryOpen} />
        </button>

        {summaryOpen && (
          <div className="flex flex-wrap gap-2 px-2 pb-2.5 pt-1">
            {orderData.map((data) => (
              <TableOrderCard
                key={data.id}
                tableNumber={data.tableNumber}
                checkedCount={checkedMap[data.id]?.size ?? 0}
                totalCount={data.items.length}
              />
            ))}
          </div>
        )}
      </div>

      <div className="pt-7" />

      {orderData.length > 0 ? (
        <div className="flex flex-col gap-2 overflow-auto no-scrollbar">
          {orderData.map((data) => (
            <OrderCard
              key={data.id}
              variant="cooking"
              tableNumber={data.tableNumber}
              peopleCount={data.peopleCount}
              orderTime={data.orderTime}
              customerName={data.customerName}
              phone={data.phone}
              items={data.items}
              totalAmount={data.totalAmount}
              checkedItems={checkedMap[data.id]}
              onToggleItem={(idx) => toggleItem(data.id, idx)}
              onConfirm={handleConfirm}
              onCancel={() => setModal('cancelReason')}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center mt-60">
          <NothingIcon />
          <p className="font-semibold text-[20px] text-deep-gray">조리 중인 주문이 없어요!</p>
        </div>
      )}

      <BottomSheet
        open={modal === 'warning'}
        onOpenChange={(o) => !o && closeModal()}
        showButton
        buttonName="완료 처리"
        onButtonClick={handleWarningConfirm}
      >
        <div className="flex flex-col items-center pt-15 pb-10">
          <WarningIcon />
          <p className="font-semibold text-[1.25rem]">아직 체크하지 않은 메뉴가 있어요</p>
          <p className="text-[14px] text-[#7F7F7F]">
            완료 처리 시 모든 메뉴가 조리 완료로 변경돼요.
          </p>
        </div>
      </BottomSheet>

      <BottomSheet open={modal === 'cookingDone'} onOpenChange={(o) => !o && closeModal()}>
        <div className="flex flex-col items-center pt-13 pb-30">
          <CheckIcon />
          <p className="font-semibold text-[1.25rem]">주문이 완료 처리되었어요</p>
        </div>
      </BottomSheet>

      <BottomSheet
        open={modal === 'cancelReason'}
        onOpenChange={(o) => !o && closeModal()}
        showButton
        buttonName="취소하기"
        onButtonClick={handleCancelSubmit}
      >
        <div className="flex w-full flex-col items-center pt-3">
          <p className="text-[20px] font-semibold leading-6 tracking-[-0.2px] text-[#1A1A1A]">
            주문 취소 사유를 골라주세요.
          </p>
          <div className="mt-11 flex flex-col items-center gap-1">
            {CANCEL_REASONS.map((r) => {
              const selected = reason === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setReason(r)}
                  className={`px-2 py-0.5 text-[20px] font-medium leading-[1.6] ${
                    selected ? 'border-y-2 border-[#FE5F54] text-[#FE5F54]' : 'text-[#C9C9C9]'
                  }`}
                >
                  {r}
                </button>
              );
            })}
          </div>
        </div>
      </BottomSheet>

      <BottomSheet
        open={modal === 'cancelDone'}
        onOpenChange={(o) => !o && closeModal()}
        showButton
        buttonName="확인"
        onButtonClick={closeModal}
      >
        <div className="flex w-full flex-col items-center pt-15 pb-15">
          <CheckIcon />
          <p className="mt-3.5 text-[20px] font-semibold leading-6 tracking-[-0.2px] text-[#1A1A1A]">
            주문이 취소되었어요!
          </p>
          <p className="mt-1 text-[14px] font-medium leading-6 tracking-[-0.14px] text-[#7F7F7F]">
            취소한 주문은 상단 ‘취소’탭에서 되돌릴 수 있어요.
          </p>
        </div>
      </BottomSheet>
    </div>
  );
}
