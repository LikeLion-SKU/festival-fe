import { Drawer } from 'vaul';

import CheckIcon from '@/assets/icons/admin/check_red_big_icon.svg?react';

export default function OrderReturnModal({ open, onOpenChange, onMove, onConfirm }) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-black/40" />
        <Drawer.Content
          aria-describedby={undefined}
          className="fixed bottom-0 left-0 right-0 z-50 mx-auto flex max-w-107.5 h-94 flex-col items-center rounded-t-[29px] bg-white pb-6 pt-2.25 shadow-[0_0_7.3px_0_rgba(0,0,0,0.25)] outline-none"
        >
          <Drawer.Title className="sr-only">바텀 시트</Drawer.Title>

          <div className="h-1 w-20 rounded-[10px] bg-[#EFEFEF]" />

          <div className="flex w-full flex-1 flex-col items-center">
            <div className="flex w-full flex-col items-center pt-16.75">
              <CheckIcon />
              <p className="mt-7 font-semibold text-[20px] leading-7 tracking-[-0.2px] text-[#1A1A1A]">
                주문이 되돌리기 처리됐어요
              </p>
            </div>
          </div>

          <div className="flex w-full justify-center gap-3 px-5">
            <button
              type="button"
              onClick={onMove}
              className="flex h-13 w-41 items-center justify-center rounded-lg bg-[#FE5F54] text-[16px] font-semibold tracking-[-0.4px] text-white"
            >
              되돌린 주문으로 이동
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="flex h-13 w-41 items-center justify-center rounded-lg bg-[#EFEFEF] text-[16px] font-semibold tracking-[-0.4px] text-deep-gray"
            >
              확인
            </button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
