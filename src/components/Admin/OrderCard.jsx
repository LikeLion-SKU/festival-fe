import { useState } from 'react';

import CheckGrayIcon from '@/assets/icons/check_gray_icon.svg?react';
import CheckWhiteIcon from '@/assets/icons/check_white_icon.svg?react';
import OpenButton from '@/components/Admin/OpenButton';

const formatPrice = (n) => `${n.toLocaleString('ko-KR')}원`;

export default function OrderCard({
  variant = 'waiting',
  tableNumber,
  peopleCount,
  orderTime,
  customerName,
  phone,
  items = [],
  totalAmount,
  onConfirm,
  onCancel,
  checkedItems: checkedItemsProp,
  onToggleItem,
  isOpen: isOpenProp,
  onOpenChange,
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [internalChecked, setInternalChecked] = useState(() => new Set());

  const isCooking = variant === 'cooking';
  const isOpenControlled = isOpenProp !== undefined;
  const isOpen = isOpenControlled ? isOpenProp : internalOpen;
  const isControlled = checkedItemsProp !== undefined;
  const checkedItems = isControlled ? checkedItemsProp : internalChecked;

  const renderItems = isCooking
    ? items.flatMap((item) =>
        Array.from({ length: item.quantity }, () => ({
          name: item.name,
          quantity: 1,
          price: item.quantity > 0 ? item.price / item.quantity : item.price,
        }))
      )
    : items;

  const toggleOpen = () => {
    if (isOpenControlled) onOpenChange?.(!isOpen);
    else setInternalOpen((v) => !v);
  };

  const toggleChecked = (idx) => {
    if (isControlled) {
      onToggleItem?.(idx);
      return;
    }
    setInternalChecked((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  return (
    <div
      className={`flex w-87.5 flex-col items-center rounded-[10px] border border-[#EFEFEF] bg-white px-5 py-4 ${
        isOpen ? 'gap-2' : 'h-15 justify-center'
      }`}
    >
      <div className="flex h-7 w-full items-center justify-between" onClick={toggleOpen}>
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
                    {peopleCount}명
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

      {isOpen && (
        <>
          <div className="-mx-5 w-87.5 h-1 bg-[linear-gradient(to_right,#EFEFEF_50%,transparent_50%)] bg-size-[18px_2.5px] bg-repeat-x" />

          <div className="flex h-14 w-full items-center justify-between">
            <div className="flex items-center gap-4 text-[14px] text-[#353535]">
              <span className="font-bold tracking-[-0.35px]">{customerName}</span>
              {tableNumber != 0 && (
                <span className="font-semibold tracking-[-0.42px] text-[#FE5F54]">
                  {peopleCount}명
                </span>
              )}
              <span className="font-semibold">{phone}</span>
            </div>
            <span className="whitespace-nowrap text-[12px] font-medium text-[#7F7F7F]">
              {orderTime} 주문
            </span>
          </div>

          <div className="flex w-full flex-col">
            {renderItems.map((item, idx) => {
              const checked = checkedItems.has(idx);
              const strike = isCooking && checked;
              return (
                <div
                  key={idx}
                  className={`flex h-12 items-center justify-between gap-3 px-2 ${
                    idx < renderItems.length - 1 ? 'border-b border-dashed border-[#EFEFEF]' : ''
                  }`}
                  onClick={() => toggleChecked(idx)}
                >
                  <div className="flex flex-1 items-center gap-3">
                    {isCooking && (
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
                      {item.name}
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
                    {formatPrice(item.price)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex h-15 w-full items-center justify-between">
            <p className="text-[16px] font-semibold tracking-[-0.4px] text-[#353535]">총 금액</p>
            <p className="text-[16px] font-semibold text-[#353535]">{formatPrice(totalAmount)}</p>
          </div>

          <div className="flex w-full items-center justify-center gap-2">
            <button
              type="button"
              onClick={() =>
                onConfirm?.({
                  allChecked: renderItems.length > 0 && checkedItems.size === renderItems.length,
                  checkedCount: checkedItems.size,
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
        </>
      )}
    </div>
  );
}
