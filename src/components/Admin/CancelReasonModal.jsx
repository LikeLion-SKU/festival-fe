import BottomSheet from '@/components/Admin/BottomSheet';

const CANCEL_REASONS = ['재료 소진', '주문 실수', '고객 요청', '기타'];

export default function CancelReasonModal({
  open,
  onOpenChange,
  reason,
  onReasonChange,
  onSubmit,
}) {
  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      showButton
      buttonName="취소하기"
      onButtonClick={onSubmit}
    >
      <div className="flex w-full flex-col items-center pt-9.5">
        <p className="text-[20px] font-semibold leading-6 tracking-[-0.2px] text-[#1A1A1A]">
          주문 취소 사유를 골라주세요.
        </p>
        <div className="mt-7.75 flex flex-col items-center gap-1">
          {CANCEL_REASONS.map((r) => {
            const selected = reason === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => onReasonChange?.(r)}
                className={`w-25 px-2 py-0.5 text-[20px] font-medium leading-[1.6] ${
                  selected ? 'border-y-2 border-[#FE5F54] text-[#FE5F54]' : 'text-[#C9C9C9]'
                }`}
              >
                {r}
              </button>
            );
          })}
        </div>
      </div>
    </BottomSheet>
  );
}
