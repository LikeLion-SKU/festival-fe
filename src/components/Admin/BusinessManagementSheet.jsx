import { useEffect, useState } from 'react';

import { AnimatePresence, motion as Motion } from 'framer-motion';
import { Drawer } from 'vaul';

import { closeBoothStatus, getBoothBusinessInfo, openBoothStatus } from '@/api/booth';
import CheckBigIcon from '@/assets/icons/admin/check_red_big_icon.svg?react';
import WarningIcon from '@/assets/icons/admin/warning_icon.svg?react';
import CashIcon from '@/assets/icons/cash.svg';
import ReturnIcon from '@/assets/icons/return.svg';
import { FILTERS } from '@/constants/menuFilterData';

const toApiDate = (md) => {
  if (!md || md === 'all') return undefined;
  const [m, d] = md.split('/');
  return `${new Date().getFullYear()}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
};

const formatSales = (n) => {
  if (!n || n <= 0) return '0원';
  const man = Math.floor(n / 10000);
  const rest = n % 10000;
  const parts = [];
  if (man) parts.push(`${man}만`);
  if (rest) parts.push(`${rest}`);
  return parts.join(' ') + '원';
};

const CLOSE_REASONS = [
  { label: '재료 소진', value: 'SOLD_OUT' },
  { label: '브레이크타임', value: 'BREAK_TIME' },
  { label: '라스트오더 마감', value: 'LAST_ORDER_CLOSED' },
  { label: '부스 사정', value: 'BOOTH_REASON_CLOSED' },
];

export default function BusinessManagementSheet({ open, onOpenChange }) {
  const [info, setInfo] = useState(null);
  const [dateFilter, setDateFilter] = useState('all');
  const [step, setStep] = useState('main');
  const [selectedReason, setSelectedReason] = useState(null);

  const handleOpenChange = (newOpen) => {
    if (!newOpen) {
      setStep('main');
      setSelectedReason(null);
    }
    onOpenChange(newOpen);
  };

  useEffect(() => {
    if (!open) return;
    getBoothBusinessInfo(toApiDate(dateFilter))
      .then((res) => setInfo(res?.data ?? null))
      .catch((e) => console.error('영업 정보 조회 실패:', e));
  }, [open, dateFilter]);

  const isBusinessOpen = info?.active ?? false;

  const handleConfirm = async () => {
    if (isBusinessOpen) {
      setStep('reason');
    } else {
      try {
        await openBoothStatus();
        setStep('success');
        setTimeout(() => onOpenChange(false), 2000);
      } catch (e) {
        console.error('영업 상태 변경 실패:', e);
      }
    }
  };

  const handleReasonConfirm = async () => {
    if (!selectedReason) return;
    try {
      await closeBoothStatus(selectedReason.value);
      setStep('success');
      setTimeout(() => onOpenChange(false), 2000);
    } catch (e) {
      console.error('영업 상태 변경 실패:', e);
    }
  };

  return (
    <Drawer.Root open={open} onOpenChange={handleOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-black/40" />
        <Drawer.Content
          aria-describedby={undefined}
          className="fixed bottom-0 left-0 right-0 z-50 mx-auto flex flex-col rounded-t-[29px] bg-white pt-2.5 shadow-[0_0_7.3px_0_rgba(0,0,0,0.25)] outline-none"
        >
          <Drawer.Title className="sr-only">영업 관리</Drawer.Title>
          <div className="mx-auto h-1 w-20 rounded-full bg-[#EFEFEF]" />

          <div className="overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              {step === 'main' && (
                <Motion.div
                  key="main"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: 'easeInOut' }}
                  className="flex flex-col px-9 pt-7 pb-10 gap-6"
                >
                  <p
                    className="font-bold text-[#1A1A1A] [font-family:Pretendard]"
                    style={{ fontSize: '20px', lineHeight: '28px', letterSpacing: '-0.01em' }}
                  >
                    {info?.departmentName ? `${info.departmentName} 부스` : '부스'}
                  </p>

                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="font-semibold [font-family:Pretendard]"
                        style={{
                          fontSize: '16px',
                          lineHeight: '28px',
                          letterSpacing: '-0.01em',
                          color: '#1A1A1A',
                        }}
                      >
                        부스 영업 상태 :
                      </span>
                      <span
                        className="font-semibold [font-family:Pretendard]"
                        style={{
                          fontSize: '16px',
                          lineHeight: '28px',
                          letterSpacing: '-0.01em',
                          color: '#FE5F54',
                        }}
                      >
                        {isBusinessOpen ? '영업 중' : '영업 중단'}
                      </span>
                      <button
                        onClick={() => setStep('confirm')}
                        className="flex items-center gap-1 rounded-[8px] bg-[#FF756C] px-3 h-9 text-white text-[13px] font-semibold"
                      >
                        <img src={ReturnIcon} alt="" width={12} height={12} />
                        영업 상태 변경
                      </button>
                    </div>

                    <div className="border-l-2 border-[#E5E5E5] pl-3 flex flex-col gap-1">
                      <p className="text-[12px] text-[#7F7F7F]">
                        {info?.dayOpenTime
                          ? `낮 오픈 ${info.dayOpenTime} / 밤 오픈 ${info.nightOpenTime} / 부스 마감 ${info.closeTime}`
                          : '운영 시간 정보 없음'}
                      </p>
                      <p className="text-[12px] text-[#7F7F7F]">
                        부스 운영 상태는 오픈과 마감 시간에 맞춰 자동 활성됩니다
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span
                        className="font-semibold [font-family:Pretendard]"
                        style={{
                          fontSize: '16px',
                          lineHeight: '28px',
                          letterSpacing: '-0.01em',
                          color: '#1A1A1A',
                        }}
                      >
                        총 매출
                      </span>
                      <div className="flex gap-1">
                        {FILTERS.map((f) => (
                          <button
                            key={f.key}
                            onClick={() => setDateFilter(f.key)}
                            className="rounded-[6px] font-medium [font-family:Pretendard] transition-colors"
                            style={{
                              width: '56px',
                              height: '32px',
                              fontSize: '14px',
                              letterSpacing: '-0.025em',
                              backgroundColor: dateFilter === f.key ? '#FF756C' : '#F0F0F0',
                              color: dateFilter === f.key ? '#FFFFFF' : '#A0A0A0',
                            }}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      <img src={CashIcon} alt="매출" className="w-8 h-8" />
                      <span className="text-[26px] font-bold text-[#1A1A1A]">
                        {info?.sales != null ? formatSales(info.sales) : '-'}
                      </span>
                    </div>
                  </div>
                </Motion.div>
              )}

              {step === 'confirm' && (
                <Motion.div
                  key="confirm"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: 'easeInOut' }}
                  className="flex flex-col items-center px-5 pb-6"
                  style={{ paddingTop: '60px', gap: '28px' }}
                >
                  <WarningIcon style={{ width: '36px', height: '36px' }} />
                  <div className="flex flex-col items-center gap-2">
                    <p
                      className="font-semibold [font-family:Pretendard]"
                      style={{
                        fontSize: '20px',
                        lineHeight: '28px',
                        letterSpacing: '-0.01em',
                        color: '#FE5F54',
                      }}
                    >
                      {isBusinessOpen
                        ? '영업 중단으로 상태를 변경할게요'
                        : '영업 중으로 상태를 변경할게요'}
                    </p>
                    <p
                      className="font-medium text-[#7F7F7F] [font-family:Pretendard]"
                      style={{ fontSize: '14px', lineHeight: '22px' }}
                    >
                      {isBusinessOpen
                        ? '사용자에게도 영업 중단으로 표시돼요'
                        : '사용자에게도 영업 중으로 표시돼요'}
                    </p>
                  </div>
                  <div style={{ height: '48px' }} />
                  <button
                    onClick={handleConfirm}
                    className="w-full rounded-xl bg-[#FE5F54] text-white font-semibold flex items-center justify-center"
                    style={{ height: '52px', fontSize: '16px' }}
                  >
                    변경하기
                  </button>
                </Motion.div>
              )}

              {step === 'reason' && (
                <Motion.div
                  key="reason"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: 'easeInOut' }}
                  className="flex flex-col pb-6"
                >
                  <div className="flex w-full flex-col items-center pt-9.5">
                    <p className="text-[20px] font-semibold leading-6 tracking-[-0.2px] text-[#1A1A1A]">
                      영업 중단 사유를 선택해주세요
                    </p>
                    <p className="mt-2 text-[14px] font-medium leading-6 tracking-[-0.14px] text-[#7F7F7F]">
                      사유가 사용자에게 표시돼요
                    </p>
                    <div className="mt-7.75 flex flex-col items-center gap-1">
                      {CLOSE_REASONS.map(({ label, value }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setSelectedReason({ label, value })}
                          className={`whitespace-nowrap px-2 py-0.5 text-[20px] font-medium leading-[1.6] tracking-[0px] [font-family:Pretendard] ${
                            selectedReason?.value === value
                              ? 'border-y-2 border-[#FE5F54] text-[#FE5F54]'
                              : 'text-[#C9C9C9]'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="px-5 pt-7">
                    <button
                      onClick={handleReasonConfirm}
                      className="w-full rounded-xl flex items-center justify-center font-semibold text-white"
                      style={{
                        height: '52px',
                        fontSize: '16px',
                        backgroundColor: selectedReason?.value ? '#FE5F54' : '#C9C9C9',
                      }}
                    >
                      변경하기
                    </button>
                  </div>
                </Motion.div>
              )}

              {step === 'success' && (
                <Motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="flex flex-col items-center justify-center gap-5 pb-10"
                  style={{ paddingTop: '60px' }}
                >
                  <CheckBigIcon style={{ width: '36px', height: '36px' }} />
                  <p
                    className="font-semibold text-[#1A1A1A] [font-family:Pretendard]"
                    style={{ fontSize: '20px', lineHeight: '28px', letterSpacing: '-0.01em' }}
                  >
                    영업 상태가 변경되었어요
                  </p>
                  <div style={{ height: '32px' }} />
                </Motion.div>
              )}
            </AnimatePresence>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
