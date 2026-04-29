import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router';

import Cash from '@/assets/icons/cash.svg?react';
import IsTakeOut from '@/components/Order/OrderConfirm/IsTakeOut';
import MenuBox from '@/components/Order/OrderConfirm/MenuBox';
import OrderButtonBox from '@/components/Order/OrderEntry/OrderButtonBox';
import OrderHeader from '@/components/common/OrderHeader';

function OrderConfirm() {
  const navigate = useNavigate();
  const { foodData, quantities, onIncrease, onDecrease, onRemove } = useOutletContext();
  const [orderType, setOrderType] = useState('dine-in');

  const cart = Object.entries(quantities).map(([key, qty]) => {
    const [cat, idx] = key.split('-');
    const item = foodData.filter((i) => i.category === cat)[parseInt(idx)];
    return { key, ...item, quantity: qty };
  });

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="flex flex-col h-full bg-gray-bg">
      <div className="bg-gray-bg shrink-0">
        <OrderHeader title="주문 확인하기" showBackButton onBack={() => navigate(-1)} />
      </div>
      <div className="h-5"></div>
      <div className="flex-1 overflow-y-auto min-h-0 px-4 pb-6 flex flex-col gap-4">
        <MenuBox cart={cart} onIncrease={onIncrease} onDecrease={onDecrease} onRemove={onRemove} />

        <IsTakeOut orderType={orderType} onTypeChange={setOrderType} />

        <div className="bg-white -mx-4 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Cash />
            <span className="text-lg font-semibold">총 주문 금액</span>
          </div>
          <span className="text-lg font-bold text-order-button">
            {totalPrice.toLocaleString()}원
          </span>
        </div>
      </div>
      <OrderButtonBox
        buttonName="결제하기"
        isActive={true}
        onClick={() => navigate('/order/customer-info', { state: { orderType } })}
      />
      <div className="h-22" />
    </div>
  );
}

export default OrderConfirm;
