const formatPrice = (n) => `${n.toLocaleString('ko-KR')}원`;

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
  onUndo,
}) {
  return (
    <div className="flex w-87.5 flex-col items-center gap-2 overflow-hidden rounded-[10px] border border-[#EFEFEF] bg-white px-5 pt-4">
      <div className="flex w-full flex-col items-center gap-3">
        <div className="flex h-7 w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-[16px] font-semibold leading-6.75 tracking-[-0.5px] text-[#222]">
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
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 2.5V5H4.5"
                stroke="#7F7F7F"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2.5 7A4 4 0 1 0 3.5 3.2L2 5"
                stroke="#7F7F7F"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-[12px] font-semibold leading-[1.6] text-[#7F7F7F]">되돌리기</p>
          </button>
        </div>
        <div className="-mx-5 w-87.5 h-1 bg-[linear-gradient(to_right,#EFEFEF_50%,transparent_50%)] bg-size-[18px_2.5px] bg-repeat-x" />
      </div>

      <div className="flex h-14 w-full items-center justify-between">
        <div className="flex items-center gap-4 text-[14px]">
          <span className="font-semibold tracking-[-0.35px] text-[#FE5F54]">{customerName}</span>
          <span className="font-medium tracking-[-0.42px] text-[#595959]">{peopleCount}명</span>
          <span className="font-medium text-[#595959]">{phone}</span>
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
              <span className="text-[14px] text-[#595959]">{item.name}</span>
              <span className="text-[14px] text-[#595959]">x{item.quantity}</span>
            </div>
            <span className="text-[14px] text-[#595959]">{formatPrice(item.price)}</span>
          </div>
        ))}
      </div>

      <div className="flex h-15 w-full items-center justify-between">
        <p className="text-[16px] font-semibold tracking-[-0.4px] text-[#595959]">총 금액</p>
        <p className="text-[16px] font-semibold text-[#595959]">{formatPrice(totalAmount)}</p>
      </div>
    </div>
  );
}
