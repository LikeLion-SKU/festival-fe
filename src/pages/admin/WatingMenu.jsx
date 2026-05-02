import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { getWaitingMenu, patchChangeOrderStatus, subscribeOrder } from '@/api/order';
import CheckIcon from '@/assets/icons/admin/check_red_big_icon.svg?react';
import NothingIcon from '@/assets/icons/admin/nothing_icon.svg?react';
import WarningIcon from '@/assets/icons/admin/warning_icon.svg?react';
import BottomSheet from '@/components/Admin/BottomSheet';
import CancelGuideModal from '@/components/Admin/CancelGuideModal';
import CancelReasonModal from '@/components/Admin/CancelReasonModal';
import OrderCancelModal from '@/components/Admin/OrderCancelModal';
import OrderCard from '@/components/Admin/OrderCard';

export default function WaitingMenu() {
  const [modal, setModal] = useState(null);
  const [reason, setReason] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const queryClient = useQueryClient();
  const { notifyOrderStatus, clearCount } = useOutletContext() ?? {};

  useEffect(() => {
    clearCount?.('wait');
  }, [clearCount]);

  const queryKey = ['admin', 'orders', 'waiting'];

  const { data: orderData = [] } = useQuery({
    queryKey,
    queryFn: getWaitingMenu,
    select: (res) => res?.data ?? [],
  });

  useEffect(() => {
    const eventSource = subscribeOrder('WAITING');

    const handleWaitingOrder = (event) => {
      const newOrder = JSON.parse(event.data);
      queryClient.setQueryData(queryKey, (prev) => ({
        ...(prev ?? {}),
        data: [...(prev?.data ?? []), newOrder],
      }));
    };

    const handleNotification = (event) => {
      const { orderStatus } = JSON.parse(event.data);
      notifyOrderStatus?.(orderStatus);
    };

    eventSource.addEventListener('waitingOrderEvent', handleWaitingOrder);
    eventSource.addEventListener('orderNotification', handleNotification);

    eventSource.onerror = () => {
      if (eventSource.readyState === EventSource.CLOSED) {
        eventSource.close();
      }
    };

    return () => {
      eventSource.removeEventListener('waitingOrderEvent', handleWaitingOrder);
      eventSource.removeEventListener('orderNotification', handleNotification);
      eventSource.close();
    };
  }, [queryClient, notifyOrderStatus]);

  useEffect(() => {
    if (modal !== 'confirmDone') return;
    const t = setTimeout(() => setModal(null), 1500);
    return () => clearTimeout(t);
  }, [modal]);

  const closeModal = () => {
    setModal(null);
    setReason(null);
    setSelectedOrderId(null);
  };

  const handleConfirm = async () => {
    if (!selectedOrderId) return;
    try {
      await patchChangeOrderStatus(selectedOrderId, 'COOKING');
      queryClient.setQueryData(queryKey, (prev) => ({
        ...(prev ?? {}),
        data: (prev?.data ?? []).filter((order) => order.orderId !== selectedOrderId),
      }));
      setModal('confirmDone');
    } catch (error) {
      console.log('조리중 으로 변경 실패 : ' + error);
    }
  };

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
              key={data.orderId}
              tableNumber={data.tableNumber}
              numOfPeople={data.numOfPeople}
              orderTime={data.orderTime}
              customerName={data.customerName}
              customerPhoneNumber={data.customerPhoneNumber}
              orderItems={data.orderItems}
              totalOrderPrice={data.totalOrderPrice}
              onConfirm={() => {
                setSelectedOrderId(data.orderId);
                setModal('confirm');
              }}
              onCancel={() => {
                setSelectedOrderId(data.orderId);
                setModal('cancelReason');
              }}
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
