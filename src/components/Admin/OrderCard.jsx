import { useState } from 'react';

import CheckGrayIcon from '@/assets/icons/check_gray_icon.svg?react';
import CheckWhiteIcon from '@/assets/icons/check_white_Icon.svg?react';
import OpenButton from '@/components/Admin/OpenButton';

const formatPrice = (n) => `${n.toLocaleString('ko-KR')}원`;

export default function OrderCard({
  variant = 'waiting',
  tableNumber,
  numOfPeople,
  orderTime,
  customerName,
  customerPhoneNumber,
  orderItems = [],
  totalOrderPrice,
  onConfirm,
  onCancel,
  onToggleItem,
  isOpen: isOpenProp,
  onOpenChange,
}) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isCooking = variant === 'cooking';
  const isOpenControlled = isOpenProp !== undefined;
  const isOpen = isOpenControlled ? isOpenProp : internalOpen;

  const toggleOpen = () => {
    if (isOpenControlled) onOpenChange?.(!isOpen);
    else setInternalOpen((v) => !v);
  };

  return (
    <div className="flex flex-col items-center rounded-[10px] border border-[#EFEFEF] bg-white px-5 py-4">
      <div /* 주문 카드 접혀있을 때 */
        className="flex h-7 w-full items-center justify-between"
        onClick={toggleOpen}
      >
        <p
          className={`text-[16px] ${isOpen ? 'font-bold' : 'font-semibold'} leading-6.75 tracking-[-0.5px] text-[#222]`}
        >
          {tableNumber != 0 ? `테이블 ${tableNumber}` : '포장'}
        </p>
        <div className="flex items-center justify-end gap-3">
          {!isOpen && (
            <div className="flex items-center gap-1">
              {tableNumber != 0 && (
                <div className="flex h-7 min-w-8.5 items-center justify-center rounded-[5px] bg-[#F6F6F6] px-2 py-1">
                  <p className="text-[12px] font-medium leading-[1.6] text-[#252525]">
                    {numOfPeople}명
                  </p>
                </div>
              )}
              <div className="flex h-7 max-w-17 items-center justify-center rounded-[5px] bg-[#F6F6F6] px-2 py-1">
                <p className="whitespace-nowrap text-[12px] font-medium leading-[1.6] text-[#252525]">
                  {orderTime} 주문
                </p>
              </div>
            </div>
          )}
          <button
            type="button"
            aria-label={isOpen ? '주문 상세 닫기' : '주문 상세 보기'}
            className="flex size-5 flex-col items-start"
          >
            <OpenButton open={isOpen} />
          </button>
        </div>
      </div>

      <div /* 주문 카드 폈을때 — 부드럽게 펼치기 */
        className={`grid w-full transition-[grid-template-rows] duration-300 ease-out ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-2 pt-2">
            <div className="-mx-5 w-[calc(100%+2.5rem)] h-1 bg-[linear-gradient(to_right,#EFEFEF_50%,transparent_50%)] bg-size-[18px_2.5px] bg-repeat-x" />

            <div className="flex h-14 w-full items-center justify-between flex-wrap">
              <div className="flex items-center gap-4 text-[14px] text-[#353535]">
                <span className="font-bold tracking-[-0.35px]">{customerName}</span>
                {tableNumber != 0 && (
                  <span className="font-semibold tracking-[-0.42px] text-[#FE5F54]">
                    {numOfPeople}명
                  </span>
                )}
                <span className="font-semibold">{customerPhoneNumber}</span>
              </div>
              <span className="whitespace-nowrap text-[12px] font-medium text-[#7F7F7F]">
                {orderTime} 주문
              </span>
            </div>

            <div className="flex w-full flex-col">
              {orderItems.map((item, idx) => {
                const checked = item.isServed;
                const strike = isCooking && checked;
                return (
                  <div
                    key={idx}
                    className={`flex h-12 items-center justify-between gap-3 px-2 ${
                      idx < orderItems.length - 1 ? 'border-b border-dashed border-[#EFEFEF]' : ''
                    }`}
                    onClick={() => onToggleItem?.(idx)}
                  >
                    <div className="flex flex-1 items-center gap-3">
                      {isCooking /* 조리 중 버전이면 체크 박스 */ && (
                        <button
                          type="button"
                          aria-label={checked ? '체크 해제' : '체크'}
                          aria-pressed={checked}
                          className={`flex size-7 shrink-0 items-center justify-center rounded-[5px] border
                              border-[#EFEFEF] bg-[#F6F6F6]`}
                        >
                          {checked && <CheckGrayIcon />}
                        </button>
                      )}
                      <span
                        className={`text-[14px] text-deep-gray font-medium ${strike ? 'line-through' : ''}`}
                      >
                        {item.menuName}
                      </span>
                      {!isCooking && (
                        <span className="font-medium text-[14px] text-[#A0A0A0]">
                          x{item.quantity}
                        </span>
                      )}
                    </div>
                    <span
                      className={`font-medium text-[14px] text-[#222] ${strike ? 'line-through' : ''}`}
                    >
                      {formatPrice(item.totalOrderItemPrice)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex h-15 w-full items-center justify-between">
              <p className="text-[16px] font-semibold tracking-[-0.4px] text-[#353535]">총 금액</p>
              <p className="text-[16px] font-semibold text-[#353535]">
                {formatPrice(totalOrderPrice)}
              </p>
            </div>

            <div /* 메뉴 상태 변경 버튼들(완료,취소) */
              className="flex w-full items-center justify-center gap-2"
            >
              <button
                type="button"
                onClick={() =>
                  onConfirm?.({
                    allChecked: orderItems.length > 0 && orderItems.every((it) => it.isServed),
                    checkedCount: orderItems.filter((it) => it.isServed).length,
                  })
                }
                className="flex h-11 flex-1 items-center justify-center gap-1 rounded-lg bg-[#FF756C] px-4 py-2.5"
              >
                <CheckWhiteIcon />
                <span className="text-[14px] font-semibold leading-5.25 text-[#FBFBFB]">
                  {isCooking ? '조리 완료' : '확인 완료'}
                </span>
              </button>
              <button
                type="button"
                onClick={onCancel}
                aria-label="취소"
                className="flex size-11 items-center justify-center rounded-lg bg-[#EFEFEF]"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M5 5L15 15M5 15L15 5"
                    stroke="#7F7F7F"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
