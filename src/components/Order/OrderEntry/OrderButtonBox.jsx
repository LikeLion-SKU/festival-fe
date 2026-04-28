import OrderButton from '@/components/common/OrderButton';

function OrderButtonBox({
  buttonName,
  isActive,
  inactiveColor = 'var(--color-disable-gray)',
  onClick,
}) {
  return (
    <div className="w-full max-w-112.5 h-25 fixed bottom-0 left-1/2 -translate-x-1/2 z-50 shadow-[0px_-1px_7px_-2px_rgba(0,0,0,0.25)] bg-white px-7 pt-3.75">
      <OrderButton
        width="100%"
        height={48}
        color={isActive ? 'var(--color-order-button)' : inactiveColor}
        buttonName={buttonName}
        onClick={onClick}
      />
    </div>
  );
}

export default OrderButtonBox;
