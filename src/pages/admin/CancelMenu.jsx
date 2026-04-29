import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import NothingIcon from '@/assets/icons/admin/nothing_icon.svg?react';
import WarningIcon from '@/assets/icons/admin/warning_icon.svg?react';
import CompletedOrderCard from '@/components/Admin/AdminComplete/CompletedOrderCard';
import BottomSheet from '@/components/Admin/BottomSheet';
import MenuFilterBox from '@/components/Admin/MenuFilterBox';
import OrderReturnModal from '@/components/Admin/OrderReturnModal';
import { completedOrderData } from '@/constants/completedOrderDummyData';

const ORDERED_DATES = ['5/13', '5/14', '5/15'];
const TODAY = '5/15';
const FILTERS = [
  { key: 'all', label: '전체' },
  { key: '5/13', label: '5/13' },
  { key: '5/14', label: '5/14' },
  { key: '5/15', label: '5/15' },
];

const isPastDate = (date) => ORDERED_DATES.indexOf(date) < ORDERED_DATES.indexOf(TODAY);

export default function CancelMenu() {
  const [modal, setModal] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [dateFilter, setDateFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const filtered = completedOrderData
    .filter((d) => dateFilter === 'all' || d.completedDate === dateFilter)
    .filter((d) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.trim().toLowerCase();
      return (
        d.customerName.toLowerCase().includes(q) ||
        String(d.tableNumber).includes(q) ||
        d.phone.includes(q)
      );
    });

  const closeModal = () => {
    setModal(null);
    setSelectedOrderId(null);
  };

  const handleUndoClick = (order) => {
    setSelectedOrderId(order.id);
    if (isPastDate(order.completedDate)) {
      setModal('pastDate');
    } else {
      setModal('undoConfirm');
    }
  };

  const handleUndoConfirm = (selectedOrderId) => {
    setModal('undoDone');
    console.log(selectedOrderId + '삭제');
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
        <div className="flex flex-col gap-2 overflow-auto no-scrollbar py-5">
          {filtered.map((data) => (
            <CompletedOrderCard
              key={data.id}
              tableNumber={data.tableNumber}
              peopleCount={data.peopleCount}
              orderTime={data.orderTime}
              completeTime={data.completeTime}
              customerName={data.customerName}
              phone={data.phone}
              items={data.items}
              totalAmount={data.totalAmount}
              completedDate={data.completedDate}
              cancelReason={data.cancelReason ?? '고객 요청'}
              onUndo={() => handleUndoClick(data)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center mt-50">
          {!searchQuery && <NothingIcon />}
          {!searchQuery ? (
            <p className="font-semibold text-[20px] text-deep-gray">취소된 주문이 없어요!</p>
          ) : (
            <p className="text-[1rem] font-normal text-[#7F7F7F]">일치하는 결과가 없어요.</p>
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
          <p className="font-semibold text-[1.25rem]">조리 중으로 되돌릴까요?</p>
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

      <BottomSheet
        open={modal === 'pastDate'}
        onOpenChange={(o) => !o && closeModal()}
        showButton
        buttonName="확인"
        onButtonClick={closeModal}
      >
        <div className="flex flex-col items-center pt-16.75">
          <WarningIcon />
          <p className="font-semibold text-[1.25rem] mt-6.25">
            지난 날짜의 주문은 되돌릴 수 없어요.
          </p>
        </div>
      </BottomSheet>
    </div>
  );
}
