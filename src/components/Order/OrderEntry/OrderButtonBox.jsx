import OrderButton from '@/components/common/OrderButton';

function OrderButtonBox({ buttonName }) {
  return (
    <div className="flex w-full justify-center h-28 fixed bottom-0 left-0 z-50 shadow-[0px_-1px_7px_-2px_rgba(0,0,0,0.25)] overflow-hidden bg-white">
      <div className="absolute w-full px-7 mt-3.75">
        <OrderButton
          width={340}
          height={48}
          color="var(--color-order-button)"
          buttonName={buttonName}
        />
      </div>
    </div>
  );
}

export default OrderButtonBox;
