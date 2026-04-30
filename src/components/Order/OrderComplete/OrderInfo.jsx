import { useNavigate } from 'react-router';

import AtmBlack from '@/assets/icons/atm_black.svg?react';
import Cash from '@/assets/icons/cash.svg?react';
import CopyBlack from '@/assets/icons/copy_black.svg?react';

const BANK_INFO = {
  bankName: '카카오뱅크',
  accountHolder: '김멋사',
  accountNumber: '111110000000',
};

const formatTime = (date) =>
  `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

function OrderInfo() {
  const navigate = useNavigate();

  const customerInfo = JSON.parse(sessionStorage.getItem('orderCustomerInfo') || '{}');
  const cart = JSON.parse(sessionStorage.getItem('orderCart') || '[]');
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const { name, phone, orderType } = customerInfo;
  const orderTypeLabel = orderType === 'dine-in' ? '매장' : '포장';
  const completedAt = formatTime(new Date());

  const handleCopy = () => navigator.clipboard.writeText(BANK_INFO.accountNumber);

  return (
    <div className="flex flex-col">
      {/* 주문자 정보 */}
      <div className="bg-white px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1.25 bg-gray-100 rounded-[3px]">
            <span className="text-xs font-medium text-gray-500">{orderTypeLabel}</span>
          </div>
          <span className="text-base font-semibold text-order-button">{name}</span>
          <span className="text-xs font-medium">{phone}</span>
        </div>
        <span className="text-xs font-medium text-gray-400">({completedAt} 주문완료)</span>
      </div>

      <div className="h-3 bg-gray-bg" />

      {/* 메뉴 목록 */}
      <div className="px-5 pb-3">
        <div className="bg-white rounded-xl px-4 divide-y divide-gray-200">
          {cart.map((item) => (
            <div key={item.key} className="py-6 flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <span className="text-base font-medium">{item.name}</span>
                <span className="text-xs font-medium text-gray-400">
                  ({item.price.toLocaleString()}원) X {item.quantity}개
                </span>
              </div>
              <span className="text-sm font-medium">
                {(item.price * item.quantity).toLocaleString()}원
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 총 주문 금액 */}
      <div className="bg-white px-7 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Cash className="w-7 h-7 shrink-0" />
          <span className="text-base font-medium">총 주문 금액</span>
        </div>
        <span className="text-base font-semibold">{totalPrice.toLocaleString()}원</span>
      </div>

      <div className="h-2.5 bg-gray-bg" />

      {/* 계좌 정보 */}
      <div className="bg-white px-7 py-5 flex items-center gap-2.5">
        <AtmBlack className="w-10 h-10 shrink-0" />
        <div className="flex-1 flex flex-col gap-1">
          <span className="text-base font-medium">{BANK_INFO.bankName}</span>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="text-xs font-medium text-gray-400">예금주</span>
              <span className="text-xs font-medium">{BANK_INFO.accountHolder}</span>
            </div>
            <div className="flex items-center gap-3.5">
              <span className="text-xs font-medium">{BANK_INFO.accountNumber}</span>
              <button
                onClick={handleCopy}
                className="shrink-0 active:opacity-50 transition-opacity duration-100"
              >
                <CopyBlack className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="h-4 bg-gray-bg" />

      {/* 하단 버튼 */}
      <div className="px-6.5 pb-4 flex gap-3">
        <button
          onClick={() => navigate('/order')}
          className="flex-1 h-12 bg-gray-200 rounded-lg text-base font-medium text-gray-500 active:opacity-80 transition-opacity duration-100"
        >
          부스 정보로 이동
        </button>
        <button
          onClick={() => navigate('/')}
          className="flex-1 h-12 bg-order-button rounded-lg text-base font-medium text-white active:opacity-80 transition-opacity duration-100"
        >
          축제 서비스로 이동
        </button>
      </div>
    </div>
  );
}

export default OrderInfo;
