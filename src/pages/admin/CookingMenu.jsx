import { useEffect, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import Lottie from 'lottie-react/build/index.es.js';

import {
  getCookingMenu,
  patchCanCelOrder,
  patchChangeOrderStatus,
  patchServedMenu,
  subscribeOrder,
} from '@/api/order';
import CheckIcon from '@/assets/icons/admin/check_red_big_icon.svg?react';
import NothingIcon from '@/assets/icons/admin/nothing_icon.svg?react';
import WarningIcon from '@/assets/icons/admin/warning_icon.svg?react';
import LoadingAnimation from '@/assets/lottie/loading_animations.json';
import NewOrderSignal from '@/components/Admin/AdminCooking/NewOrderSignal';
import TableOrderCard from '@/components/Admin/AdminCooking/TableOrderCard';
import BottomSheet from '@/components/Admin/BottomSheet';
import CancelGuideModal from '@/components/Admin/CancelGuideModal';
import CancelReasonModal from '@/components/Admin/CancelReasonModal';
import OpenButton from '@/components/Admin/OpenButton';
import OrderCancelModal from '@/components/Admin/OrderCancelModal';
import OrderCard from '@/components/Admin/OrderCard';
import Toast from '@/components/common/Toast';

const unitsToOrderItems = (
  units = [] //OrderCard컴포넌트 prop 맞춰주기 위한 함수
) => units.map((u) => ({ ...u, totalOrderItemPrice: u.menuPrice }));

export default function CookingMenu() {
  const [modal, setModal] = useState(null);
  const [reason, setReason] = useState(null);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [expandedIds, setExpandedIds] = useState(() => new Set());
  const [newOrderIds, setNewOrderIds] = useState(() => new Set());
  const [hasNewCooking, setHasNewCooking] = useState(false);
  const queryClient = useQueryClient();
  const { notifyOrderStatus, clearCount, setIsLoading, setScrollContainer } =
    useOutletContext() ?? {};
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '' });
  const cardRefs = useRef(new Map());

  const handleScrollToNew = () => {
    setHasNewCooking(false);
    const firstNewOrder = orderData.find((d) => newOrderIds.has(d.orderId));
    if (!firstNewOrder) return;
    cardRefs.current.get(firstNewOrder.orderId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const markSeen = (orderId) => {
    setNewOrderIds((prev) => {
      if (!prev.has(orderId)) return prev;
      const next = new Set(prev);
      next.delete(orderId);
      return next;
    });
  };

  useEffect(() => {
    clearCount?.('cook');
  }, [clearCount]);

  const queryKey = ['admin', 'orders', 'cooking'];

  const { data: orderData = [], isPending } = useQuery({
    queryKey,
    queryFn: getCookingMenu,
    select: (res) => res?.data ?? [],
  });

  useEffect(() => {
    //페이지 집입시 구독
    const eventSource = subscribeOrder('COOKING');

    const handleCookingOrder = (event) => {
      //새로운 데이터 들어오면 추가
      const newOrder = JSON.parse(event.data);
      queryClient.setQueryData(queryKey, (prev) => ({
        ...(prev ?? {}),
        data: [...(prev?.data ?? []), newOrder],
      }));
      setNewOrderIds((prev) => {
        const next = new Set(prev);
        next.add(newOrder.orderId);
        return next;
      });
      setHasNewCooking(true);
    };

    const handleNotification = (event) => {
      //다른 페이지 새로운 데이터 추가시 표시
      const { orderStatus } = JSON.parse(event.data);
      notifyOrderStatus?.(orderStatus);
    };

    const handleUnitStatus = (event) => {
      //체크 여부 변화시 실시간 적용
      const { orderId, orderItemUnitId, isServed } = JSON.parse(event.data);
      queryClient.setQueryData(queryKey, (prev) => {
        if (!prev?.data) return prev;
        return {
          ...prev,
          data: prev.data.map((o) =>
            o.orderId !== orderId
              ? o
              : {
                  ...o,
                  orderItemUnits: o.orderItemUnits.map((u) =>
                    u.orderItemUnitId === orderItemUnitId ? { ...u, isServed } : u
                  ),
                }
          ),
        };
      });
    };

    eventSource.addEventListener('cookingOrderEvent', handleCookingOrder);
    eventSource.addEventListener('orderNotification', handleNotification);
    eventSource.addEventListener('orderItemUnitStatusEvent', handleUnitStatus);

    eventSource.onerror = () => {
      if (eventSource.readyState === EventSource.CLOSED) {
        eventSource.close();
      }
    };

    return () => {
      eventSource.removeEventListener('cookingOrderEvent', handleCookingOrder);
      eventSource.removeEventListener('orderNotification', handleNotification);
      eventSource.removeEventListener('orderItemUnitStatusEvent', handleUnitStatus);
      eventSource.close();
    };
  }, [queryClient, notifyOrderStatus]);

  const allExpanded = orderData.length > 0 && expandedIds.size === orderData.length;

  const toggleAll = () => {
    setExpandedIds(allExpanded ? new Set() : new Set(orderData.map((d) => d.orderId)));
  };

  const toggleOne = (id, open) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (open) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const toggleItem = async (orderId, idx) => {
    //서빙 상태 변경 요청
    const order = orderData.find((o) => o.orderId === orderId);
    const unit = order?.orderItemUnits?.[idx];
    if (!unit) return;
    const nextServed = !unit.isServed;
    try {
      await patchServedMenu(unit.orderItemUnitId, nextServed);
      queryClient.setQueryData(queryKey, (prev) => {
        if (!prev?.data) return prev;
        return {
          ...prev,
          data: prev.data.map((o) =>
            o.orderId !== orderId
              ? o
              : {
                  ...o,
                  orderItemUnits: o.orderItemUnits.map((u) =>
                    u.orderItemUnitId === unit.orderItemUnitId ? { ...u, isServed: nextServed } : u
                  ),
                }
          ),
        };
      });
    } catch (error) {
      console.log('서빙 상태 변경 실패: ' + error);
      setToast({ visible: true, message: '잠시후 다시 시도해주세요', icon: 'warning' });
    }
  };

  useEffect(() => {
    //cookingDone면 1.5초 뒤에 닫기
    if (modal !== 'cookingDone') return;
    const t = setTimeout(() => setModal(null), 1500);
    return () => clearTimeout(t);
  }, [modal]);

  const closeModal = () => {
    setModal(null);
    setReason(null);
    setSelectedOrderId(null);
  };

  const handleConfirm = async ({ allChecked, orderId }) => {
    //완료로 변경
    setSelectedOrderId(orderId);
    if (allChecked) {
      //전부 다 서빈 완료면 완료 요청
      setIsLoading?.(true);
      try {
        await patchChangeOrderStatus(orderId, 'COMPLETED');
        queryClient.setQueryData(queryKey, (prev) => ({
          ...(prev ?? {}),
          data: (prev?.data ?? []).filter((o) => o.orderId !== orderId),
        }));
        setModal('cookingDone');
      } catch (error) {
        console.log('주문 완료 처리 실패: ' + error);
        setToast({ visible: true, message: '잠시후 다시 시도해주세요', icon: 'warning' });
      } finally {
        setIsLoading?.(false);
      }
    } else {
      //서빙 안된거 있을 때는 경고 모달
      setModal('warning');
    }
  };

  const handleWarningConfirm = async () => {
    //경고 안내 모달 확인시
    if (!selectedOrderId) return;
    setIsLoading?.(true);
    try {
      await patchChangeOrderStatus(selectedOrderId, 'COMPLETED');
      queryClient.setQueryData(queryKey, (prev) => ({
        ...(prev ?? {}),
        data: (prev?.data ?? []).filter((o) => o.orderId !== selectedOrderId),
      }));
      setModal('cookingDone');
    } catch (error) {
      console.log('주문 완료 처리 실패: ' + error);
      setToast({ visible: true, message: '잠시후 다시 시도해주세요', icon: 'warning' });
    } finally {
      setIsLoading?.(false);
    }
  };

  const handleCancelSubmit = async () => {
    //취소 이유 선택 확인시
    if (!reason) return;
    setIsLoading?.(true);
    try {
      await patchCanCelOrder(selectedOrderId, reason);
      queryClient.setQueryData(queryKey, (prev) => ({
        ...(prev ?? {}),
        data: (prev?.data ?? []).filter((order) => order.orderId !== selectedOrderId),
      }));
      setModal('cancelGuide');
    } catch (error) {
      console.log('주문 취소 실패:' + error);
      setToast({ visible: true, message: '잠시후 다시 시도해주세요', icon: 'warning' });
    } finally {
      setIsLoading?.(false);
    }
  };

  return (
    <div className="relative flex flex-col w-full h-full bg-[#f8f8f8] items-center">
      <div /* 주문 요약 박스*/
        className="sticky flex w-full min-h-13 shrink-0 max-h-50 overflow-auto flex-col bg-white px-5 py-2 shadow-[0_1px_2px_0_rgba(0,0,0,0.1)]"
      >
        <button
          type="button"
          onClick={() => setSummaryOpen((v) => !v)}
          aria-expanded={summaryOpen}
          className="flex h-10 w-full items-center justify-between px-2 py-1.5"
        >
          <div className="flex items-center gap-1">
            <span className="text-[16px] font-semibold leading-[1.6] text-[#222]">주문 요약</span>
            <span className="font-medium text-[14px] text-[#A0A0A0]">
              (총 {orderData.length}건)
            </span>
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

      {orderData.length > 0 /* 조리 중인 주문들 리스트 */ ? (
        <div ref={setScrollContainer} className="overflow-auto w-full no-scrollbar pb-7 px-5">
          <button
            type="button"
            onClick={toggleAll}
            className="flex items-center gap-1 mt-5 ml-auto mr-5 text-[14px] font-medium text-deep-gray"
          >
            {allExpanded ? '전체 접기' : '전체 펼치기'}
            <OpenButton open={allExpanded} color="#595959" />
          </button>

          <div className="pt-2" />

          <div className="flex flex-col gap-2 overflow-auto no-scrollbar pb-7">
            {orderData.map((data) => (
              <div
                key={data.orderId}
                ref={(el) => {
                  if (el) cardRefs.current.set(data.orderId, el);
                  else cardRefs.current.delete(data.orderId);
                }}
                className="w-full"
                onClick={() => markSeen(data.orderId)}
              >
                <OrderCard
                  variant="cooking"
                  tableNumber={data.tableNumber}
                  numOfPeople={data.numOfPeople}
                  orderTime={data.orderTime}
                  customerName={data.customerName}
                  customerPhoneNumber={data.customerPhoneNumber}
                  orderItems={unitsToOrderItems(data.orderItemUnits)}
                  totalOrderPrice={data.totalOrderPrice}
                  isNew={newOrderIds.has(data.orderId)}
                  onToggleItem={(idx) => toggleItem(data.orderId, idx)}
                  isOpen={expandedIds.has(data.orderId)}
                  onOpenChange={(o) => toggleOne(data.orderId, o)}
                  onConfirm={(args) => handleConfirm({ ...args, orderId: data.orderId })}
                  onCancel={() => {
                    setSelectedOrderId(data.orderId);
                    setModal('cancelReason');
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      ) : isPending ? (
        <Lottie animationData={LoadingAnimation} loop className="w-40 h-40 m-auto" />
      ) : (
        <div className="flex flex-col items-center mt-67 gap-3">
          <NothingIcon />
          <p className="font-semibold text-[20px] text-[#A0A0A0]">조리 중인 주문이 없어요!</p>
        </div>
      )}

      {hasNewCooking /* 새로운 조리 주문 알림 배너 */ && (
        <NewOrderSignal onClick={handleScrollToNew} />
      )}

      <BottomSheet /* 미완성 주문 완료 모달 */
        open={modal === 'warning'}
        onOpenChange={(o) => !o && closeModal()}
        showButton
        buttonName="완료 처리"
        onButtonClick={handleWarningConfirm}
      >
        <div className="flex flex-col items-center pt-11.75">
          <WarningIcon />
          <p className="font-semibold text-[1.25rem] mt-7">
            아직 <span className="text-[#FE5F54]">제공 전인 메뉴</span>가 있어요
          </p>
          <p className="font-semibold text-[1.25rem]">그래도 주문을 완료할까요?</p>
          <p className="text-[14px] text-[#7F7F7F] mt-2">완료하면 주문이 완료로 이동해요</p>
        </div>
      </BottomSheet>

      <BottomSheet /* 주문 완료 모달 */
        open={modal === 'cookingDone'}
        onOpenChange={(o) => !o && closeModal()}
      >
        <div className="flex flex-col items-center pt-16.75">
          <CheckIcon />
          <p className="font-semibold text-[1.25rem] mt-7">주문이</p>
          <p className="font-semibold text-[1.25rem]">완료 처리되었어요</p>
        </div>
      </BottomSheet>

      <CancelReasonModal /* 취소 이유 모달 */
        open={modal === 'cancelReason'}
        onOpenChange={(o) => !o && closeModal()}
        reason={reason}
        onReasonChange={setReason}
        onSubmit={handleCancelSubmit}
      />

      <CancelGuideModal /* 취소 시 안내 문구 모달 */
        open={modal === 'cancelGuide'}
        onOpenChange={(o) => !o && closeModal()}
        onConfirm={() => setModal('cancelDone')}
      />

      <OrderCancelModal /* 취소 모달 */
        open={modal === 'cancelDone'}
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
