import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { getCancelMenu, patchChangeOrderStatus, subscribeOrder } from '@/api/order';
import NothingIcon from '@/assets/icons/admin/nothing_icon.svg?react';
import WarningIcon from '@/assets/icons/admin/warning_icon.svg?react';
import CompletedOrderCard from '@/components/Admin/AdminComplete/CompletedOrderCard';
import BottomSheet from '@/components/Admin/BottomSheet';
import MenuFilterBox from '@/components/Admin/MenuFilterBox';
import OrderReturnModal from '@/components/Admin/OrderReturnModal';
import PastDateModal from '@/components/Admin/PastDateModal';
import { FILTERS, isPastDate } from '@/constants/menuFilterData';

export default function CancelMenu() {
  const [modal, setModal] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [dateFilter, setDateFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { notifyOrderStatus, clearCount } = useOutletContext() ?? {};

  useEffect(() => {
    clearCount?.('cancel');
  }, [clearCount]);

  const queryKey = ['admin', 'orders', 'canceled'];

  const { data: orderData = [] } = useQuery({
    queryKey,
    queryFn: getCancelMenu,
    select: (res) => res?.data ?? [],
  });

  useEffect(() => {
    const eventSource = subscribeOrder('CANCELED');

    const handleCanceledOrder = (event) => {
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

    eventSource.addEventListener('canceledOrderEvent', handleCanceledOrder);
    eventSource.addEventListener('orderNotification', handleNotification);

    eventSource.onerror = () => {
      if (eventSource.readyState === EventSource.CLOSED) {
        eventSource.close();
      }
    };

    return () => {
      eventSource.removeEventListener('canceledOrderEvent', handleCanceledOrder);
      eventSource.removeEventListener('orderNotification', handleNotification);
      eventSource.close();
    };
  }, [queryClient, notifyOrderStatus]);

  const q = searchQuery.trim().toLowerCase();
  const filtered = orderData.filter((d) => {
    if (dateFilter !== 'all' && d.orderDate !== dateFilter) return false;
    if (!q) return true;
    return (
      d.customerName.toLowerCase().includes(q) ||
      String(d.tableNumber).includes(q) ||
      d.customerPhoneNumber.includes(q)
    );
  });

  const closeModal = () => {
    setModal(null);
    setSelectedOrderId(null);
  };

  const handleUndoClick = (order) => {
    setSelectedOrderId(order.orderId);
    if (isPastDate(order.orderDate)) {
      setModal('pastDate');
    } else {
      setModal('undoConfirm');
    }
  };

  const handleUndoConfirm = async (orderId) => {
    if (!orderId) return;
    try {
      await patchChangeOrderStatus(orderId, 'WAITING');
      queryClient.setQueryData(queryKey, (prev) => ({
        ...(prev ?? {}),
        data: (prev?.data ?? []).filter((o) => o.orderId !== orderId),
      }));
      setModal('undoDone');
    } catch (error) {
      console.log('대기로 되돌리기 실패: ' + error);
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-[#F8F8F8] items-center">
      <MenuFilterBox
        title="취소된 주문"
        count={filtered.length}
        filters={FILTERS}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />

      {filtered.length > 0 ? (
        <div className="flex flex-col w-full gap-2 overflow-auto no-scrollbar px-5 py-5">
          {filtered.map((data) => (
            <CompletedOrderCard
              key={data.orderId}
              tableNumber={data.tableNumber}
              peopleCount={data.numOfPeople}
              orderTime={data.orderTime}
              completeTime={data.cancelTime}
              customerName={data.customerName}
              phone={data.customerPhoneNumber}
              orderItems={data.orderItems}
              totalAmount={data.totalOrderPrice}
              completedDate={data.orderDate}
              cancelReason={data.orderCancelReason}
              onUndo={() => handleUndoClick(data)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center mt-50">
          <NothingIcon />
          {!searchQuery ? (
            <p className="font-semibold text-[20px] text-[#A0A0A0]">완료된 주문이 없어요!</p>
          ) : (
            <p className="text-[20px] font-semibold text-[#A0A0A0]">일치하는 결과가 없어요!</p>
          )}
        </div>
      )}

      <BottomSheet
        open={modal === 'undoConfirm'}
        onOpenChange={(o) => !o && closeModal()}
        showButton
        buttonName="되돌리기"
        onButtonClick={() => handleUndoConfirm(selectedOrderId)}
      >
        <div className="flex flex-col items-center pt-11.5">
          <WarningIcon />
          <p className="font-semibold text-[1.25rem] mt-7">
            이미 <span className="text-[#FE5F54]">취소된</span> 주문이에요.
          </p>
          <p className="font-semibold text-[1.25rem]">대기 중으로 되돌릴까요?</p>
        </div>
      </BottomSheet>

      <OrderReturnModal
        open={modal === 'undoDone'}
        onOpenChange={(o) => !o && closeModal()}
        onMove={() => {
          closeModal();
          navigate('/admin/waiting');
        }}
        onConfirm={closeModal}
      />

      <PastDateModal
        open={modal === 'pastDate'}
        onOpenChange={(o) => !o && closeModal()}
        onConfirm={closeModal}
      />
    </div>
  );
}
