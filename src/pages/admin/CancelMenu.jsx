import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import Lottie from 'lottie-react/build/index.es.js';

import { getCancelMenu, patchChangeOrderStatus, subscribeOrder } from '@/api/order';
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

export default function CancelMenu() {
  const [modal, setModal] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [dateFilter, setDateFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState({ visible: false, message: '' });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { notifyOrderStatus, clearCount, setIsLoading, setScrollContainer } =
    useOutletContext() ?? {};

  useEffect(() => {
    clearCount?.('cancel');
  }, [clearCount]);

  const queryKey = ['admin', 'orders', 'canceled'];

  const { data: orderData = [], isPending } = useQuery({
    queryKey,
    queryFn: getCancelMenu,
    select: (res) => res?.data ?? [],
  });

  useEffect(() => {
    //페이지 진입시 구독
    const eventSource = subscribeOrder('CANCELED');

    const handleCanceledOrder = (event) => {
      //새로운 데이터 들어올 시 추가
      const newOrder = JSON.parse(event.data);
      queryClient.setQueryData(queryKey, (prev) => ({
        ...(prev ?? {}),
        data: [...(prev?.data ?? []), newOrder],
      }));
    };

    const handleNotification = (event) => {
      //다른 페이지 데이터 추가시 표시
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

  const filtered = filterOrders(orderData, dateFilter, searchQuery); //필터링된 데이터

  const closeModal = () => {
    setModal(null);
    setSelectedOrderId(null);
  };

  const handleUndoClick = (order) => {
    //되돌리기 버튼 클릭 시
    setSelectedOrderId(order.orderId);
    if (isPastDate(order.orderDate)) {
      setModal('pastDate'); //지난 날짜면 불가능
    } else {
      setModal('undoConfirm');
    }
  };

  const handleUndoConfirm = async (orderId) => {
    //되돌리기 요청
    if (!orderId) return;
    setIsLoading?.(true);
    try {
      await patchChangeOrderStatus(orderId, 'WAITING');
      queryClient.setQueryData(queryKey, (prev) => ({
        ...(prev ?? {}),
        data: (prev?.data ?? []).filter((o) => o.orderId !== orderId),
      }));
      setModal('undoDone');
    } catch (error) {
      console.log('대기로 되돌리기 실패: ' + error);
      setToast({ visible: true, message: '잠시후 다시 시도해주세요', icon: 'warning' });
    } finally {
      setIsLoading?.(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-[#F8F8F8] items-center">
      <MenuFilterBox /* 주문 필터링 박스 */
        title="취소된 주문"
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
            <CompletedOrderCard /* 취소 주문 카드 */
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
      ) : isPending ? (
        <Lottie animationData={LoadingAnimation} loop className="w-40 h-40 m-auto" />
      ) : (
        <div className="flex flex-col items-center mt-50">
          <NothingIcon />
          {!searchQuery ? (
            <p className="font-semibold text-[20px] text-[#A0A0A0]">취소된 주문이 없어요!</p>
          ) : (
            <p className="text-[20px] font-semibold text-[#A0A0A0]">일치하는 결과가 없어요!</p>
          )}
        </div>
      )}

      <BottomSheet /* 대기로 되돌리기 확인 모달 박스 */
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

      <OrderReturnModal /* 주문 되돌리기 완료 확인 박스 */
        open={modal === 'undoDone'}
        onOpenChange={(o) => !o && closeModal()}
        onMove={() => {
          closeModal();
          navigate('/admin/waiting');
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
