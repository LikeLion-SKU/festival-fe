import CheckIcon from '@/assets/icons/admin/check_red_big_icon.svg?react';
import BottomSheet from '@/components/Admin/BottomSheet';

export default function CancelGuideModal({ open, onOpenChange, onConfirm }) {
  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      showButton
      buttonName="확인했어요"
      onButtonClick={onConfirm}
    >
      <div className="flex w-full flex-col items-center pt-11.75">
        <CheckIcon />
        <div className="mt-7 text-center text-[20px] font-semibold leading-7 tracking-[-0.2px] text-[#1A1A1A]">
          취소 전 확인해 주세요
        </div>
        <div className="mt-2 text-center text-[14px] font-medium leading-5 tracking-[-0.14px] text-[#7F7F7F]">
          <p>사유와 환불 안내는 고객에게 직접 전달해 주세요.</p>
          <p>포장 주문은 전화번호를 확인해주세요</p>
        </div>
      </div>
    </BottomSheet>
  );
}
