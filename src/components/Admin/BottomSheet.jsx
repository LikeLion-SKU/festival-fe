import { Drawer } from 'vaul';

import OrderButton from '@/components/common/OrderButton';

export default function BottomSheet({
  open,
  onOpenChange,
  children,
  showButton = false,
  buttonName = '완료 처리',
  buttonColor = '#FE5F54',
  onButtonClick,
}) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-black/40" />
        <Drawer.Content
          aria-describedby={undefined}
          className="fixed bottom-0 left-0 right-0 z-50 mx-auto flex h-94 flex-col items-center rounded-t-[29px] bg-white pb-6 pt-2.25 shadow-[0_0_7.3px_0_rgba(0,0,0,0.25)] outline-none"
        >
          <Drawer.Title className="sr-only">바텀 시트</Drawer.Title>

          <div className="h-1 w-20 rounded-[10px] bg-[#EFEFEF]" />

          <div className="flex w-full flex-1 flex-col items-center">{children}</div>

          <div className="flex w-full justify-center px-5">
            {showButton && (
              <OrderButton
                width="344px"
                height="52px"
                color={buttonColor}
                buttonName={buttonName}
                onClick={onButtonClick}
              />
            )}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
