import ReturnIcon from '@/assets/icons/admin/return_icon.svg?react';

const formatPrice = (n) => `${n.toLocaleString('ko-KR')}원`;

// 받침 없거나 ㄹ 받침이면 "로", 그 외 받침이면 "으로"
const reasonParticle = (str) => {
  if (!str) return '으로';
  const last = str[str.length - 1];
  const code = last.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return '으로';
  const final = (code - 0xac00) % 28;
  return final === 0 || final === 8 ? '로' : '으로';
};

export default function CompletedOrderCard({
  tableNumber,
  peopleCount,
  orderTime,
  completeTime,
  customerName,
  phone,
  items = [],
  totalAmount,
  completedDate,
  cancelReason,
  onUndo,
}) {
  return (
    <div className="flex shrink-0 w-full flex-col items-center gap-2 overflow-hidden rounded-[10px] border border-[#EFEFEF] bg-white px-5 pt-4">
      <div className="flex w-full flex-col items-center gap-3">
        <div className="flex h-7 w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-[16px] font-bold leading-6.75 tracking-[-0.5px] text-[#222]">
              테이블 {tableNumber}
            </p>
            <div className="flex h-7 max-w-17 items-center justify-center rounded-[5px] bg-[#F6F6F6] px-2 py-1">
              <p className="whitespace-nowrap text-[12px] font-medium leading-[1.6] text-[#7F7F7F]">
                {completedDate}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onUndo}
            className="flex h-7 items-center justify-center gap-1 rounded-[5px] bg-[#F6F6F6] px-2 py-1"
          >
            <ReturnIcon />
            <p className="text-[12px] font-semibold leading-[1.6] text-[#7F7F7F]">되돌리기</p>
          </button>
        </div>
        {cancelReason && (
          <div className="flex w-full items-center">
            <p className="text-[14px] font-semibold tracking-[-0.35px] text-deep-gray">
              <span className="text-[#FF756C]">{cancelReason}</span>
              {reasonParticle(cancelReason)} 인한 취소
            </p>
          </div>
        )}
        <div className="-mx-5 w-[calc(100%+2.5rem)] h-1 bg-[linear-gradient(to_right,#EFEFEF_50%,transparent_50%)] bg-size-[18px_2.5px] bg-repeat-x" />
      </div>

      <div className="flex h-14 w-full items-center justify-between">
        <div className="flex items-center gap-4 text-[14px]">
          <span className="font-bold tracking-[-0.35px] text-[#353535]">{customerName}</span>
          <span className="font-semibold tracking-[-0.42px] text-[#353535]">{peopleCount}명</span>
          <span className="font-semibold text-[#353535]">{phone}</span>
        </div>
        <div className="flex flex-col items-end whitespace-nowrap text-[12px] font-medium leading-[1.6]">
          <span className="text-[#7F7F7F]">{orderTime} 주문</span>
          <span className="text-[#FF756C]">{completeTime} 완료</span>
        </div>
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
              <span className="text-[14px] font-medium text-deep-gray">{item.name}</span>
              <span className="text-[14px] font-medium text-[#A0A0A0]">x{item.quantity}</span>
            </div>
            <span className="text-[14px] font-medium text-deep-gray">
              {formatPrice(item.price)}
            </span>
          </div>
        ))}
      </div>

      <div className="flex h-15 w-full items-center justify-between">
        <p className="text-[16px] font-semibold tracking-[-0.4px] text-deep-gray">총 금액</p>
        <p className="text-[16px] font-semibold text-deep-gray">{formatPrice(totalAmount)}</p>
      </div>
    </div>
  );
}
