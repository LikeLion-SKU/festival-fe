import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useOutletContext } from 'react-router';

import ATM from '@/assets/icons/atm.svg?react';
import Copy from '@/assets/icons/copy.svg?react';
import Shadow from '@/assets/icons/shadow.svg?react';
import OrderButtonBox from '@/components/Order/OrderEntry/OrderButtonBox';
import OrderHeader from '@/components/common/OrderHeader';
import Toast from '@/components/common/Toast';

function OrderPay() {
  const navigate = useNavigate();
  const { thumbnailUrl, boothId } = useOutletContext();
  const { state } = useLocation();

  const savedPayData = (() => {
    const saved = sessionStorage.getItem('orderResponse');
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    return parsed.boothId === boothId ? parsed : null;
  })();
  const { orderResponse, orderType } = state?.orderResponse ? state : (savedPayData ?? {});
  const {
    customerName,
    customerPhoneNumber,
    bankName,
    accountName,
    accountNumber,
    totalOrderPrice,
  } = orderResponse || {};
  const orderTypeLabel = orderType === 'dine-in' ? '매장' : '포장';

  const [showToast, setShowToast] = useState(() => {
    const pending = sessionStorage.getItem('orderToastPending') === 'true';
    sessionStorage.removeItem('orderToastPending');
    return pending;
  });
  const [showCopyToast, setShowCopyToast] = useState(false);
  const copyTimerRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowToast(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.history.pushState(null, '', window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(accountNumber.replace(/-/g, ''));
    setShowCopyToast(true);
    clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => setShowCopyToast(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="shrink-0">
        <OrderHeader title="결제하기" />
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 px-5 flex flex-col items-center pt-12 pb-29 gap-2.5">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 shrink-0">
          <img src={thumbnailUrl} className="w-full h-full object-cover" />
        </div>

        <div className="text-center mt-8">
          <p className="text-xl font-medium">
            아래 계좌로{' '}
            <span className="text-order-button font-bold">
              {totalOrderPrice?.toLocaleString()}원
            </span>
            을 입금 후
          </p>
          <p className="text-xl font-bold text-order-button">직원에게 보여주세요!</p>
        </div>

        <div className="w-full border border-gray-300 rounded-xl mt-20 px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shadow className="w-10 h-10 -ml-1.5" />
              <div className="flex flex-col">
                <span className="text-base font-medium text-gray-500">{customerName}</span>
                <span className="text-sm font-medium text-gray-900">{customerPhoneNumber}</span>
              </div>
            </div>
            <div className="px-5 py-1.5 bg-gray-100 rounded-md">
              <span className="text-sm font-semibold text-gray-500">{orderTypeLabel}</span>
            </div>
          </div>
        </div>

        <div className="w-full bg-button-red rounded-xl px-5 py-6">
          <div className="flex items-center gap-4">
            <ATM className="w-8 h-8 shrink-0" />
            <div className="flex-1 flex flex-col gap-1.5">
              <span className="text-white text-base font-medium">{bankName}</span>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-white/70 text-sm font-medium">예금주</span>
                  <span className="text-white text-sm font-medium">{accountName}</span>
                </div>
                <div className="flex items-center gap-3.5">
                  <span className="text-white text-sm font-medium">{accountNumber}</span>
                  <button
                    onClick={handleCopy}
                    className="shrink-0 active:opacity-50 transition-opacity duration-100"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Toast
          variant="pill"
          visible={showToast}
          message="주문이 요청되었어요."
          className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50"
        />
      </div>
      <Toast
        variant="pill"
        visible={showCopyToast}
        message="계좌번호를 복사했어요."
        className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50"
      />

      <OrderButtonBox
        buttonName="직원 확인 완료"
        isActive={true}
        note="입금자명은 주문자명과 같아야 해요"
        onClick={() => {
          sessionStorage.removeItem('orderResponse');
          navigate(`/order/${boothId}/complete`, { state: { orderResponse, orderType } });
        }}
      />
    </div>
  );
}

export default OrderPay;
