import { useEffect, useState } from 'react';

import CheckIcon from '@/assets/icons/admin/check_red_big_icon.svg?react';
import NothingIcon from '@/assets/icons/admin/nothing_icon.svg?react';
import WarningIcon from '@/assets/icons/admin/warning_icon.svg?react';
import BottomSheet from '@/components/Admin/BottomSheet';
import CancelReasonModal from '@/components/Admin/CancelReasonModal';
import OrderCancelModal from '@/components/Admin/OrderCancelModal';
import OrderCard from '@/components/Admin/OrderCard';
import { orderData } from '@/constants/orderDummyData';

export default function WaitingMenu() {
  const [modal, setModal] = useState(null);
  const [reason, setReason] = useState(null);

  useEffect(() => {
    if (modal !== 'confirmDone') return;
    const t = setTimeout(() => setModal(null), 1500);
    return () => clearTimeout(t);
  }, [modal]);

  const closeModal = () => {
    setModal(null);
    setReason(null);
  };

  const handleConfirm = () => setModal('confirmDone');

  const handleCancelSubmit = () => {
    if (!reason) return;
    setModal('cancelDone');
  };

  return (
    <div className="flex h-full w-full bg-[#EFEFEF] justify-center py-7">
      {orderData.length > 0 ? (
        <div className="flex flex-col gap-2 overflow-auto no-scrollbar">
          {orderData.map((data) => (
            <OrderCard
              key={data.id}
              tableNumber={data.tableNumber}
              peopleCount={data.peopleCount}
              orderTime={data.orderTime}
              customerName={data.customerName}
              phone={data.phone}
              items={data.items}
              totalAmount={data.totalAmount}
              onConfirm={() => setModal('confirm')}
              onCancel={() => setModal('cancelReason')}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center mt-60">
          <NothingIcon />
          <p className="font-semibold text-[20px] text-deep-gray">대기 중인 주문이 없어요!</p>
        </div>
      )}

      <BottomSheet
        open={modal === 'confirm'}
        onOpenChange={(o) => !o && closeModal()}
        showButton
        buttonName="확인했어요"
        onButtonClick={handleConfirm}
      >
        <div className="flex flex-col items-center pt-15 pb-10">
          <WarningIcon />
          <p className="font-semibold text-[1.25rem]">신분증, 계좌이체 확인하셨나요?</p>
          <p className="text-[14px] text-[#7F7F7F] ">버튼을 누르면 조리 중으로 상태가 변경돼요.</p>
        </div>
      </BottomSheet>

      <BottomSheet open={modal === 'confirmDone'} onOpenChange={(o) => !o && closeModal()}>
        <div className="flex flex-col items-center pt-13 pb-30">
          <CheckIcon />
          <p className="font-semibold text-[1.25rem]">영수증이 조리 중으로 이동했어요</p>
        </div>
      </BottomSheet>

      <CancelReasonModal
        open={modal === 'cancelReason'}
        onOpenChange={(o) => !o && closeModal()}
        reason={reason}
        onReasonChange={setReason}
        onSubmit={handleCancelSubmit}
      />

      <OrderCancelModal
        open={modal === 'cancelDone'}
        onOpenChange={(o) => !o && closeModal()}
        onConfirm={closeModal}
      />
    </div>
  );
}
