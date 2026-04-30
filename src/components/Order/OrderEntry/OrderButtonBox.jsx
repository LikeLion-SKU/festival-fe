import { useRef } from 'react';

import OrderButton from '@/components/common/OrderButton';

function OrderButtonBox({
  buttonName,
  isActive,
  inactiveColor = 'var(--color-disable-gray)',
  onClick,
  note,
}) {
  const containerRef = useRef(null);

  const getButton = () => containerRef.current?.querySelector('button');

  const handlePointerDown = () => {
    if (!isActive) return;
    const btn = getButton();
    if (btn) btn.style.backgroundColor = 'var(--color-order-button-active)';
  };

  const handlePointerUp = () => {
    const btn = getButton();
    if (btn) btn.style.backgroundColor = isActive ? 'var(--color-order-button)' : inactiveColor;
  };

  return (
    <div
      ref={containerRef}
      className={`w-full max-w-112.5 fixed bottom-0 left-1/2 -translate-x-1/2 z-50 shadow-[0px_-1px_7px_-2px_rgba(0,0,0,0.25)] bg-white px-7 pt-3.75 ${note ? 'pb-4' : 'h-25'}`}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <OrderButton
        width="100%"
        height={48}
        color={isActive ? 'var(--color-order-button)' : inactiveColor}
        buttonName={buttonName}
        onClick={onClick}
      />
      {note && <p className="text-center text-xs font-semibold text-order-button pt-2">{note}</p>}
    </div>
  );
}

export default OrderButtonBox;
