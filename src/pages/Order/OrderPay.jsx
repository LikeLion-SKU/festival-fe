import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router';

import ATM from '@/assets/icons/atm.svg?react';
import Copy from '@/assets/icons/copy.svg?react';
import Shadow from '@/assets/icons/shadow.svg?react';
import OrderButton from '@/components/common/OrderButton';
import OrderHeader from '@/components/common/OrderHeader';

const BANK_INFO = {
  bankName: '카카오뱅크',
  accountHolder: '김멋사',
  accountNumber: '111110000000',
};

function OrderPay() {
  const navigate = useNavigate();
  const { HeroImage } = useOutletContext();

  const customerInfo = JSON.parse(sessionStorage.getItem('orderCustomerInfo') || '{}');
  const cart = JSON.parse(sessionStorage.getItem('orderCart') || '[]');
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const { name, phone, orderType } = customerInfo;
  const orderTypeLabel = orderType === 'dine-in' ? '매장' : '포장';

  const [showToast, setShowToast] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowToast(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(BANK_INFO.accountNumber);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="shrink-0">
        <OrderHeader title="결제하기" showBackButton onBack={() => navigate(-1)} />
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 px-5 flex flex-col items-center gap-6 pt-8 pb-36">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 shrink-0">
          <HeroImage className="w-full h-full" />
        </div>

        <div className="text-center">
          <p className="text-xl font-semibold">
            아래 계좌로{' '}
            <span className="text-order-button font-bold">{totalPrice.toLocaleString()}원</span>을
            입금 후
          </p>
          <p className="text-xl font-bold text-order-button">직원에게 보여주세요!</p>
        </div>

        <div className="w-full border border-gray-300 rounded-xl mt-25 px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shadow className="w-10 h-10" />
              <div className="flex flex-col">
                <span className="text-base font-semibold text-gray-500">{name}</span>
                <span className="text-sm font-medium text-gray-900">{phone}</span>
              </div>
            </div>
            <div className="px-5 py-1.5 bg-gray-100 rounded-md">
              <span className="text-sm font-semibold text-gray-500">{orderTypeLabel}</span>
            </div>
          </div>
        </div>

        <div className="w-full bg-order-button rounded-xl px-5 py-6">
          <div className="flex items-center gap-3">
            <ATM className="w-10 h-10 shrink-0" />
            <div className="flex-1 flex flex-col gap-1.5">
              <span className="text-white text-base font-semibold">{BANK_INFO.bankName}</span>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-white/70 text-sm font-medium">예금주</span>
                  <span className="text-white text-sm font-medium">{BANK_INFO.accountHolder}</span>
                </div>
                <div className="flex items-center gap-3.5">
                  <span className="text-white text-sm font-medium">{BANK_INFO.accountNumber}</span>
                  <button onClick={handleCopy} className="shrink-0">
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`px-6 py-2.5 bg-gray-50 rounded-full shadow-[0px_0px_5px_0px_rgba(196,58,49,0.35)] transition-opacity duration-500 ${showToast ? 'opacity-100' : 'opacity-0'}`}
        >
          <span className="text-sm font-semibold text-gray-500">주문이 요청되었어요.</span>
        </div>
      </div>

      <div className="w-full max-w-112.5 fixed bottom-0 left-1/2 -translate-x-1/2 z-50 bg-white shadow-[0px_-1px_7px_-2px_rgba(0,0,0,0.25)] px-7 pt-3.75 pb-4">
        <OrderButton
          width="100%"
          height={48}
          color="var(--color-order-button)"
          buttonName="직원 확인 완료"
          onClick={() => {}}
        />
        <p className="text-center text-xs font-semibold text-order-button pt-2">
          입금자명은 주문자명과 같아야 해요
        </p>
      </div>
    </div>
  );
}

export default OrderPay;
