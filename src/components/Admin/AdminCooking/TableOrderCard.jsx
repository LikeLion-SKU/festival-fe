export default function TableOrderCard({ tableNumber, checkedCount = 0, totalCount }) {
  return (
    <div className="flex h-13 w-20 flex-col items-center justify-center rounded-[5px] border border-[#C9C9C9] bg-[#FBFBFB] p-1.5">
      <p className="text-[14px] font-semibold leading-[1.6] text-[#353535]">
        {tableNumber == 0 ? '포장' : `테이블 ${tableNumber}`}
      </p>
      <p className="text-[13px] font-medium leading-[1.6] text-[#FF756C]">
        {checkedCount}/{totalCount}
      </p>
    </div>
  );
}
