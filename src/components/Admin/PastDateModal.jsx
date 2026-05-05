import WarningIcon from '@/assets/icons/admin/warning_icon.svg?react';
import BottomSheet from '@/components/Admin/BottomSheet';

export default function PastDateModal({ open, onOpenChange, onConfirm }) {
  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      showButton
      buttonName="확인"
      onButtonClick={onConfirm}
    >
      <div className="flex flex-col items-center pt-16.75">
        <WarningIcon />
        <p className="font-semibold text-[1.25rem] mt-6.25">지난 날짜의 주문은 되돌릴 수 없어요.</p>
      </div>
    </BottomSheet>
  );
}
