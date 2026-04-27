import { useState } from 'react';

const formatPrice = (n) => `${n.toLocaleString('ko-KR')}원`;

export default function OrderCard({
  tableNumber,
  peopleCount,
  orderTime,
  customerName,
  phone,
  items = [],
  totalAmount,
  onConfirm,
  onCancel,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`flex w-87.5 flex-col items-center rounded-[10px] border border-[#EFEFEF] bg-white px-5 py-4 ${
        isOpen ? 'gap-2' : 'h-15 justify-center'
      }`}
    >
      <div className="flex h-7 w-full items-center justify-between">
        <p className="text-[16px] font-semibold leading-6.75 tracking-[-0.5px] text-[#222]">
          테이블 {tableNumber}
        </p>
        <div className="flex items-center justify-end gap-3">
          {!isOpen && (
            <div className="flex items-center gap-1">
              <div className="flex h-7 min-w-8.5 items-center justify-center rounded-[5px] bg-[#F6F6F6] px-2 py-1">
                <p className="text-[12px] font-medium leading-[1.6] text-[#252525]">
                  {peopleCount}명
                </p>
              </div>
              <div className="flex h-7 max-w-17 items-center justify-center rounded-[5px] bg-[#F6F6F6] px-2 py-1">
                <p className="whitespace-nowrap text-[12px] font-medium leading-[1.6] text-[#252525]">
                  {orderTime} 주문
                </p>
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? '주문 상세 닫기' : '주문 상세 보기'}
            className="flex size-5 flex-col items-start"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
            >
              <path
                d="M5 7.5L10 12.5L15 7.5"
                stroke="#252525"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <>
          <div className="-mx-5 w-87.5 h-1 bg-[linear-gradient(to_right,#EFEFEF_50%,transparent_50%)] bg-size-[18px_2.5px] bg-repeat-x" />

          <div className="flex h-14 w-full items-center justify-between">
            <div className="flex items-center gap-4 text-[14px] text-[#353535]">
              <span className="font-semibold tracking-[-0.35px]">{customerName}</span>
              <span className="font-medium tracking-[-0.42px]">{peopleCount}명</span>
              <span className="font-medium">{phone}</span>
            </div>
            <span className="whitespace-nowrap text-[12px] font-medium text-[#7F7F7F]">
              {orderTime} 주문
            </span>
          </div>

          <div className="flex w-full flex-col">
            {items.map((item, idx) => (
              <div
                key={idx}
                className={`flex h-10 items-center justify-between px-2 ${
                  idx < items.length - 1 ? 'border-b border-dashed border-[#EFEFEF]' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[14px] text-[#222]">{item.name}</span>
                  <span className="text-[14px] text-[#FE5F54]">x{item.quantity}</span>
                </div>
                <span className="text-[14px] text-[#222]">{formatPrice(item.price)}</span>
              </div>
            ))}
          </div>

          <div className="flex h-15 w-full items-center justify-between">
            <p className="text-[16px] font-semibold tracking-[-0.4px] text-[#353535]">총 금액</p>
            <p className="text-[16px] font-semibold text-[#353535]">{formatPrice(totalAmount)}</p>
          </div>

          <div className="flex w-full items-center justify-center gap-2">
            <button
              type="button"
              onClick={onConfirm}
              className="flex h-11 flex-1 items-center justify-center gap-1 rounded-lg bg-[#FF756C] px-4 py-2.5"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M5 10L8.5 13.5L15 6.5"
                  stroke="#FBFBFB"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[14px] font-semibold leading-5.25 text-[#FBFBFB]">
                확인 완료
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
