import OrderButton from '@/components/common/OrderButton';

function OrderButtonBox({ buttonName, hasSelection, onClick }) {
  return (
    <div className="w-full h-25 fixed bottom-0 left-1/2 -translate-x-1/2 z-50 shadow-[0px_-1px_7px_-2px_rgba(0,0,0,0.25)] bg-white px-7 pt-3.75">
      <OrderButton
        width="100%"
        height={48}
        color={hasSelection ? 'var(--color-order-button)' : 'var(--color-pink-100)'}
        buttonName={buttonName}
        onClick={onClick}
      />
    </div>
  );
}

export default OrderButtonBox;
