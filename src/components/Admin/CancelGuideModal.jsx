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
      <div className="flex w-full flex-col items-center pt-13 pb-7">
        <CheckIcon />
        <div className="mt-3.5 text-center text-[20px] font-semibold leading-7 tracking-[-0.2px] text-[#1A1A1A]">
          <p>취소할 경우 사유는</p>
          <p>
            <span className="text-[#FE5F54]">고객에게 직접 전달</span>
            <span>해야 해요</span>
          </p>
        </div>
        <div className="mt-2 text-center text-[14px] font-medium leading-5 tracking-[-0.14px] text-[#7F7F7F]">
          <p>환불 관련하여 직접 고객에게 안내해주세요</p>
          <p>포장일 경우, 전화번호를 확인해주세요</p>
        </div>
      </div>
    </BottomSheet>
  );
}
