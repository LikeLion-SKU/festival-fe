import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ClapIcon from '@/assets/icons/admin/clap_icon.svg?react';
import NothingIcon from '@/assets/icons/admin/nothing_icon.svg?react';
import WarningIcon from '@/assets/icons/admin/warning_icon.svg?react';
import CompletedOrderCard from '@/components/Admin/AdminComplete/CompletedOrderCard';
import BottomSheet from '@/components/Admin/BottomSheet';
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

export default function CompleteMenu() {
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
      <div className="sticky flex w-full flex-col gap-3 bg-white px-5 py-3 shadow-[0_1px_2px_0_rgba(0,0,0,0.1)]">
        <div className="flex justify-between items-center">
          <p className="text-[16px] font-semibold leading-[1.6] text-[#222]">
            완료된 주문{' '}
            <span className="text-[14px] font-medium text-[#A0A0A0]">(총 {filtered.length}건)</span>
          </p>
          <button
            onClick={() => setModal('total')}
            className="flex w-18 h-8 justify-center items-center bg-[#FFDDDB] text-[#FE5F54] text-[14px] font-medium rounded-lg"
          >
            매출 확인
          </button>
        </div>

        <div className="flex gap-2">
          {FILTERS.map((f) => {
            const active = dateFilter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setDateFilter(f.key)}
                className={`w-14 h-8 rounded-lg px-3 text-[13px] font-medium ${
                  active ? 'bg-[#FF756C] text-white' : 'bg-[#F6F6F6] text-[#7F7F7F]'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        <div className="flex h-10 w-full items-center gap-2 rounded-lg border border-[#A0A0A0] px-3">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="8" cy="8" r="5.5" stroke="#A0A0A0" strokeWidth="1.4" />
            <path
              d="M12.5 12.5L15.5 15.5"
              stroke="#A0A0A0"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="이름 또는 전화번호로 검색"
            className="flex-1 bg-transparent text-[14px] text-[#222] placeholder:text-[#A0A0A0] outline-none"
          />
        </div>
      </div>

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
              onUndo={() => handleUndoClick(data)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center mt-50">
          {!searchQuery && <NothingIcon />}
          {!searchQuery ? (
            <p className="font-semibold text-[20px] text-deep-gray">완료된 주문이 없어요!</p>
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
            이미 <span className="text-[#FE5F54]">완료된</span> 주문이에요.
          </p>
          <p className="font-semibold text-[1.25rem]">조리 중으로 되돌릴까요?</p>
        </div>
      </BottomSheet>

      <OrderReturnModal
        open={modal === 'undoDone'}
        onOpenChange={(o) => !o && closeModal()}
        onMove={() => {
          closeModal();
          navigate('/admin/cooking');
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

      <BottomSheet
        open={modal === 'total'}
        onOpenChange={(o) => !o && closeModal()}
        showButton
        buttonName="확인"
        onButtonClick={closeModal}
      >
        <div className="flex flex-col items-center pt-7.75">
          <ClapIcon />
          <p className="font-semibold text-[1.25rem] mt-7">오늘은</p>
          <p className="font-semibold text-[1.25rem]">
            <span className="text-[#FE5F54] font-bold">100만 원</span> 벌었어요!
          </p>
          <p className="font-semibold text-[14px] text-[#FFBBB8] mt-2">
            수고한 내자신..기특하ㄷr...
          </p>
        </div>
      </BottomSheet>
    </div>
  );
}
