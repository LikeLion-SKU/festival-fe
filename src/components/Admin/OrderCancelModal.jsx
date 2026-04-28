import CheckIcon from '@/assets/icons/admin/check_red_big_icon.svg?react';
import BottomSheet from '@/components/Admin/BottomSheet';

export default function OrderCancelModal({ open, onOpenChange, onConfirm }) {
  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      showButton
      buttonName="확인"
      onButtonClick={onConfirm}
    >
      <div className="flex w-full flex-col items-center pt-16.75">
        <CheckIcon />
        <p className="mt-7 text-[20px] font-semibold leading-6 tracking-[-0.2px] text-[#1A1A1A]">
          주문이 취소되었어요!
        </p>
        <p className="mt-2 text-[14px] font-medium leading-6 tracking-[-0.14px] text-[#7F7F7F]">
          취소한 주문은 상단 ‘취소’탭에서 되돌릴 수 있어요.
        </p>
      </div>
    </BottomSheet>
  );
}
