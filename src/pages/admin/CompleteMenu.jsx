import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { getCompleteMenu, getSales, patchChangeOrderStatus, subscribeOrder } from '@/api/order';
import ClapIcon from '@/assets/icons/admin/clap_icon.svg?react';
import NothingIcon from '@/assets/icons/admin/nothing_icon.svg?react';
import WarningIcon from '@/assets/icons/admin/warning_icon.svg?react';
import CompletedOrderCard from '@/components/Admin/AdminComplete/CompletedOrderCard';
import BottomSheet from '@/components/Admin/BottomSheet';
import MenuFilterBox from '@/components/Admin/MenuFilterBox';
import OrderReturnModal from '@/components/Admin/OrderReturnModal';
import PastDateModal from '@/components/Admin/PastDateModal';
import Toast from '@/components/common/Toast';
import { FILTERS, isPastDate } from '@/constants/menuFilterData';

const toApiDate = (md) => {
  //api 요청을 보내기 위한 날짜 변환
  if (!md || md === 'all') return undefined;
  const [m, d] = md.split('/');
  return `${new Date().getFullYear()}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
};

const formatSales = (n) => {
  //매출 출력용 문자열 변환
  if (!n || n <= 0) return '0원';
  const man = Math.floor(n / 10000);
  const cheon = Math.floor((n % 10000) / 1000);
  const baek = Math.floor((n % 1000) / 100);
  const rest = n % 100;
  const parts = [];
  if (man) parts.push(`${man}만`);
  if (cheon) parts.push(`${cheon}천`);
  if (baek) parts.push(`${baek}백`);
  if (rest) parts.push(`${rest}`);
  return `${parts.join(' ')} 원`;
};

export default function CompleteMenu() {
  const [modal, setModal] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [dateFilter, setDateFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sales, setSales] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '' });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { notifyOrderStatus, clearCount } = useOutletContext() ?? {};

  useEffect(() => {
    clearCount?.('complete');
  }, [clearCount]);

  const queryKey = ['admin', 'orders', 'completed'];

  const { data: orderData = [] } = useQuery({
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

    const handleNotification = (event) => {
      //다른 페이지 데이터 들어오면 카운트
      const { orderStatus } = JSON.parse(event.data);
      notifyOrderStatus?.(orderStatus);
    };

    eventSource.addEventListener('completedOrderEvent', handleCompletedOrder);
    eventSource.addEventListener('orderNotification', handleNotification);

    eventSource.onerror = () => {
      if (eventSource.readyState === EventSource.CLOSED) {
        eventSource.close();
      }
    };

    return () => {
      eventSource.removeEventListener('completedOrderEvent', handleCompletedOrder);
      eventSource.removeEventListener('orderNotification', handleNotification);
      eventSource.close();
    };
  }, [queryClient, notifyOrderStatus]);

  const q = searchQuery.trim().toLowerCase();
  const filtered = orderData.filter((d) => {
    //필터링된 데이터
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
    //되돌리기 클릭시
    setSelectedOrderId(order.orderId);
    if (isPastDate(order.orderDate)) {
      setModal('pastDate'); //지난 날짜면 불가
    } else {
      setModal('undoConfirm');
    }
  };

  const handleRevenueClick = async () => {
    //매출 조회 요청
    try {
      const res = await getSales(toApiDate(dateFilter));
      setSales(res?.data?.sales ?? 0);
      setModal('total');
    } catch (error) {
      console.log('매출 조회 실패: ' + error);
      setToast({ visible: true, message: '잠시후 다시 시도해주세요', icon: 'warning' });
    }
  };

  const handleUndoConfirm = async (orderId) => {
    // 되돌리기 요청
    if (!orderId) return;
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
        showRevenueButton
        onRevenueClick={handleRevenueClick}
      />

      {filtered.length > 0 ? (
        <div className="flex flex-col w-full gap-2 overflow-auto no-scrollbar px-5 py-5">
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
          <p className="font-semibold text-[1.25rem] mt-7">
            이미 <span className="text-[#FE5F54]">완료된</span> 주문이에요.
          </p>
          <p className="font-semibold text-[1.25rem]">조리 중으로 되돌릴까요?</p>
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

      <BottomSheet /* 매출 확인 모달 */
        open={modal === 'total'}
        onOpenChange={(o) => !o && closeModal()}
        showButton
        buttonName="확인"
        onButtonClick={closeModal}
      >
        <div className="flex flex-col items-center pt-7.75">
          <ClapIcon />
          <p className="font-semibold text-[1.25rem] mt-7">
            {dateFilter === 'all' ? '축제기간 동안' : `${dateFilter}에는`}
          </p>
          <p className="font-semibold text-[1.25rem]">
            <span className="text-[#FE5F54] font-bold">총 {formatSales(sales ?? 0)}</span> 벌었어요!
          </p>
          <p className="font-semibold text-[14px] text-[#FFBBB8] mt-2">
            수고한 내자신..기특하ㄷr...
          </p>
        </div>
      </BottomSheet>

      <Toast /* 요청 실패시 재시도 안내 토스트 */
        visible={toast.visible}
        message={toast.message}
        icon={toast.icon ?? 'check'}
        onClose={() => setToast({ visible: false, message: '' })}
      />
    </div>
  );
}
