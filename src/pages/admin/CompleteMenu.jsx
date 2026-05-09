import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import Lottie from 'lottie-react/build/index.es.js';

import { getCompleteMenu, patchChangeOrderStatus, subscribeOrder } from '@/api/order';
import NothingIcon from '@/assets/icons/admin/nothing_icon.svg?react';
import WarningIcon from '@/assets/icons/admin/warning_icon.svg?react';
import LoadingAnimation from '@/assets/lottie/loading_animations.json';
import CompletedOrderCard from '@/components/Admin/AdminComplete/CompletedOrderCard';
import BottomSheet from '@/components/Admin/BottomSheet';
import MenuFilterBox from '@/components/Admin/MenuFilterBox';
import OrderReturnModal from '@/components/Admin/OrderReturnModal';
import PastDateModal from '@/components/Admin/PastDateModal';
import Toast from '@/components/common/Toast';
import { FILTERS, filterOrders, isPastDate } from '@/constants/menuFilterData';

const queryKey = ['admin', 'orders', 'completed'];

export default function CompleteMenu() {
  const [modal, setModal] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [dateFilter, setDateFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState({ visible: false, message: '' });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addPendingOrder, removePendingOrder, clearCount, setIsLoading, setScrollContainer } =
    useOutletContext() ?? {};

  useEffect(() => {
    clearCount?.('complete');
  }, [clearCount]);

  const { data: orderData = [], isPending } = useQuery({
    queryKey,
    queryFn: getCompleteMenu,
    select: (res) => res?.data ?? [],
  });

  useEffect(() => {
    //페이지 진입시 구독
    const eventSource = subscribeOrder('COMPLETED');

    const handleCompletedOrder = (event) => {
      //새로운 데이터 들어오면 추가
      const newOrder = JSON.parse(event.data);
      queryClient.setQueryData(queryKey, (prev) => ({
        ...(prev ?? {}),
        data: [...(prev?.data ?? []), newOrder],
      }));
    };

    const handleIncrement = (event) => {
      //다른 페이지 데이터 들어오면 카운트 +1, 미확인 id 추가
      const { orderStatus, orderId } = JSON.parse(event.data);
      addPendingOrder?.(orderStatus, orderId);
    };

    const handleDecrement = (event) => {
      //다른 페이지 데이터 빠지면 미확인 id에 있을 때만 카운트 -1, id 제거
      const { orderStatus, orderId } = JSON.parse(event.data);
      removePendingOrder?.(orderStatus, orderId);
    };

    const handleDismiss = (event) => {
      //특정 주문을 현재 페이지 데이터에서 제거
      const { orderId } = JSON.parse(event.data);
      queryClient.setQueryData(queryKey, (prev) => {
        if (!prev?.data) return prev;
        return { ...prev, data: prev.data.filter((o) => o.orderId !== orderId) };
      });
    };

    eventSource.addEventListener('completedOrderEvent', handleCompletedOrder);
    eventSource.addEventListener('orderIncrementNotification', handleIncrement);
    eventSource.addEventListener('orderDecrementNotification', handleDecrement);
    eventSource.addEventListener('dismissNotification', handleDismiss);

    eventSource.onerror = () => {
      if (eventSource.readyState === EventSource.CLOSED) {
        eventSource.close();
      }
    };

    return () => {
      eventSource.removeEventListener('completedOrderEvent', handleCompletedOrder);
      eventSource.removeEventListener('orderIncrementNotification', handleIncrement);
      eventSource.removeEventListener('orderDecrementNotification', handleDecrement);
      eventSource.removeEventListener('dismissNotification', handleDismiss);
      eventSource.close();
    };
  }, [queryClient, addPendingOrder, removePendingOrder]);

  const filtered = filterOrders(orderData, dateFilter, searchQuery);

  const closeModal = () => {
    setModal(null);
    setSelectedOrderId(null);
  };

  const handleUndoClick = (order) => {
    //되돌리기 클릭시
    setSelectedOrderId(order.orderId);
    if (isPastDate(order.orderDate)) {
      setModal('pastDate'); //지난 날짜면 불가
    } else {
      setModal('undoConfirm');
      console.log('통과');
    }
  };

  const handleUndoConfirm = async (orderId) => {
    // 되돌리기 요청
    if (!orderId) return;
    setIsLoading?.(true);
    try {
      await patchChangeOrderStatus(orderId, 'COOKING');
      queryClient.setQueryData(queryKey, (prev) => ({
        ...(prev ?? {}),
        data: (prev?.data ?? []).filter((o) => o.orderId !== orderId),
      }));
      setModal('undoDone');
    } catch (error) {
      console.log('조리중으로 되돌리기 실패: ' + error);
      setToast({ visible: true, message: '잠시후 다시 시도해주세요', icon: 'warning' });
    } finally {
      setIsLoading?.(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-[#F8F8F8] items-center">
      <MenuFilterBox /* 주문 필터링 박스 */
        title="완료된 주문"
        count={filtered.length}
        filters={FILTERS}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />

      {filtered.length > 0 ? (
        <div
          ref={setScrollContainer}
          className="flex flex-col w-full gap-2 overflow-auto no-scrollbar px-5 py-5"
        >
          {filtered.map((data) => (
            <CompletedOrderCard /* 주문 완료 카드 */
              key={data.orderId}
              tableNumber={data.tableNumber}
              peopleCount={data.numOfPeople}
              orderTime={data.orderTime}
              completeTime={data.completeTime}
              customerName={data.customerName}
              phone={data.customerPhoneNumber}
              orderItems={data.orderItems}
              totalAmount={data.totalOrderPrice}
              completedDate={data.orderDate}
              onUndo={() => handleUndoClick(data)}
            />
          ))}
        </div>
      ) : isPending ? (
        <Lottie animationData={LoadingAnimation} loop className="w-40 h-40 m-auto" />
      ) : (
        <div className="flex flex-col items-center mt-50 gap-3">
          <NothingIcon />
          {!searchQuery ? (
            <p className="font-semibold text-[20px] text-[#A0A0A0]">완료된 주문이 없어요!</p>
          ) : (
            <p className="text-[20px] font-semibold text-[#A0A0A0]">일치하는 결과가 없어요!</p>
          )}
        </div>
      )}

      <BottomSheet /* 조리로 되돌리기 확인 모달 박스 */
        open={modal === 'undoConfirm'}
        onOpenChange={(o) => !o && closeModal()}
        showButton
        buttonName="되돌리기"
        onButtonClick={() => handleUndoConfirm(selectedOrderId)}
      >
        <div className="flex flex-col items-center pt-11.5">
          <WarningIcon />
          <p className="font-semibold text-[1.25rem] mt-7 leading-6">
            이미 <span className="text-[#FE5F54]">완료된</span> 주문이에요.
          </p>
          <p className="font-semibold text-[1.25rem] leading-7">조리 중으로 되돌릴까요?</p>
        </div>
      </BottomSheet>

      <OrderReturnModal /* 주문 되돌리기 완료 확인 박스 */
        open={modal === 'undoDone'}
        onOpenChange={(o) => !o && closeModal()}
        onMove={() => {
          closeModal();
          navigate('/admin/cooking');
        }}
        onConfirm={closeModal}
      />

      <PastDateModal /* 지난 날짜 되돌리기 불가 안내 모달 */
        open={modal === 'pastDate'}
        onOpenChange={(o) => !o && closeModal()}
        onConfirm={closeModal}
      />

      <Toast /* 요청 실패시 재시도 안내 토스트 */
        visible={toast.visible}
        message={toast.message}
        icon={toast.icon ?? 'check'}
        onClose={() => setToast({ visible: false, message: '' })}
      />
    </div>
  );
}
