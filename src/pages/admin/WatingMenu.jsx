import { useEffect, useState } from 'react';

import CheckIcon from '@/assets/icons/admin/check_red_big_icon.svg?react';
import NothingIcon from '@/assets/icons/admin/nothing_icon.svg?react';
import WarningIcon from '@/assets/icons/admin/warning_icon.svg?react';
import BottomSheet from '@/components/Admin/BottomSheet';
import CancelGuideModal from '@/components/Admin/CancelGuideModal';
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
    setModal('cancelGuide');
  };

  return (
    <div className="flex h-full w-full bg-[#EFEFEF] justify-center">
      {orderData.length > 0 ? (
        <div className="flex flex-col w-full gap-2 overflow-auto no-scrollbar py-7 px-5">
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
        <div className="flex flex-col items-center mt-67 gap-3">
          <NothingIcon />
          <p className="font-semibold text-[20px] text-[#A0A0A0]">대기 중인 주문이 없어요!</p>
        </div>
      )}

      <BottomSheet
        open={modal === 'confirm'}
        onOpenChange={(o) => !o && closeModal()}
        showButton
        buttonName="확인했어요"
        onButtonClick={handleConfirm}
      >
        <div className="flex flex-col items-center pt-11.75">
          <WarningIcon />
          <p className="font-semibold text-[1.25rem] text-[#FE5F54] mt-7">신분증, 계좌이체</p>
          <p className="font-semibold text-[1.25rem]">확인하셨나요?</p>
          <p className="text-[14px] text-[#7F7F7F] mt-2">
            버튼을 누르면 조리 중으로 상태가 변경돼요
          </p>
        </div>
      </BottomSheet>

      <BottomSheet open={modal === 'confirmDone'} onOpenChange={(o) => !o && closeModal()}>
        <div className="flex flex-col items-center pt-16.75">
          <CheckIcon />
          <p className="font-semibold text-[1.25rem] mt-7">영수증이 조리 중으로</p>
          <p className="font-semibold text-[1.25rem]">이동했어요</p>
        </div>
      </BottomSheet>

      <CancelReasonModal
        open={modal === 'cancelReason'}
        onOpenChange={(o) => !o && closeModal()}
        reason={reason}
        onReasonChange={setReason}
        onSubmit={handleCancelSubmit}
      />

      <CancelGuideModal
        open={modal === 'cancelGuide'}
        onOpenChange={(o) => !o && closeModal()}
        onConfirm={() => setModal('cancelDone')}
      />

      <OrderCancelModal
        open={modal === 'cancelDone'}
        onOpenChange={(o) => !o && closeModal()}
        onConfirm={closeModal}
      />
    </div>
  );
}
