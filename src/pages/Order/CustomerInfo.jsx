import { useRef, useState } from 'react';
import { useLocation, useNavigate, useOutletContext } from 'react-router';

import { createOrder } from '@/api/order';
import InputField from '@/components/Order/CustomerInfo/InputField';
import OrderButtonBox from '@/components/Order/OrderEntry/OrderButtonBox';
import Modal from '@/components/common/Modal';
import OrderHeader from '@/components/common/OrderHeader';
import Toast from '@/components/common/Toast';

const formatPhone = (digits) => {
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
};

const getState = (value, isValid) => {
  if (!value) return 'empty';
  return isValid ? 'valid' : 'invalid';
};

function CustomerInfo() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { boothId } = useOutletContext();
  const orderType = state?.orderType ?? 'dine-in';
  const isDineIn = orderType === 'dine-in';

  const idempotencyKey = useRef(crypto.randomUUID());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [errorToast, setErrorToast] = useState({ visible: false, message: '' });
  const [soldOutToast, setSoldOutToast] = useState(false);
  const [name, setName] = useState('');
  const [headCount, setHeadCount] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [phoneDigits, setPhoneDigits] = useState('010');

  const phone = phoneDigits === '010' ? '010-' : formatPhone(phoneDigits);

  const handlePhoneChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (phoneDigits === '' && digits.length > 0) {
      setPhoneDigits(('010' + digits).slice(0, 11));
    } else {
      setPhoneDigits(digits);
    }
  };

  const handleTableChange = (e) => {
    setTableNumber(e.target.value.replace(/\D/g, ''));
  };

  const nameState = getState(name.trim(), true);
  const headCountState = getState(headCount, /^\d+$/.test(headCount));
  const tableState = getState(tableNumber, tableNumber.length > 0);
  const phoneState = getState(phoneDigits === '010' ? '' : phoneDigits, phoneDigits.length === 11);

  const isFormValid =
    nameState === 'valid' &&
    phoneState === 'valid' &&
    (!isDineIn || (headCountState === 'valid' && tableState === 'valid'));

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="shrink-0">
        <OrderHeader showBackButton onBack={() => navigate(-1)} />
      </div>
      <div className="flex-1 px-7 pt-10 [@media(max-height:720px)]:pt-4 flex flex-col gap-6 [@media(max-height:720px)]:gap-3">
        <div className="flex flex-col px-2 gap-1">
          <p className="text-xl font-semibold text-order-button">결제하기 앞서,</p>
          <p className="text-xl font-semibold">주문자 정보를 입력해주세요</p>
        </div>
        <div className="flex flex-col gap-6 [@media(max-height:720px)]:gap-4 mt-4 [@media(max-height:720px)]:mt-1">
          <InputField
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            state={nameState}
          />
          {isDineIn && (
            <>
              <InputField
                placeholder="인원 수"
                value={headCount ? `${headCount}명` : ''}
                onChange={(e) => setHeadCount(e.target.value.replace(/\D/g, ''))}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace') {
                    e.preventDefault();
                    setHeadCount((prev) => prev.slice(0, -1));
                  }
                }}
                state={headCountState}
                type="tel"
              />
              <InputField
                placeholder="테이블 번호"
                value={tableNumber ? `${tableNumber}번 테이블` : ''}
                onChange={handleTableChange}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace') {
                    e.preventDefault();
                    setTableNumber((prev) => prev.slice(0, -1));
                  }
                }}
                state={tableState}
                type="tel"
              />
            </>
          )}
          <InputField
            placeholder="휴대폰 번호"
            value={phone}
            onChange={handlePhoneChange}
            state={phoneState}
            errorMessage="핸드폰 번호는 뒤 8자리 형식으로 입력해주세요."
            type="tel"
          />
        </div>
        <div className="mt-[-20px] [@media(max-height:720px)]:mt-[-8px] px-2 py-4 text-[11px] text-[#B0B0B0] leading-[1.6] [font-family:Pretendard]">
          <p className="font-semibold text-[#888888] mb-1">개인정보 수집 및 이용 안내</p>
          <p>수집 항목: 이름, 휴대폰 번호{isDineIn ? ', 인원 수, 테이블 번호' : ''}</p>
          <p>수집 목적: 주문 접수 및 처리</p>
          <p>보유 기간: 축제 종료 후 즉시 삭제</p>
          <p className="mt-1">주문 요청 시 위 내용에 동의한 것으로 간주됩니다.</p>
          <p className="mt-3 text-[10px] text-[#FE5F54] tracking-[-0.02em] leading-[1.6]">
            {'본 서비스에 대한 주문·결제 정보 위변조, 서비스 방해 행위는'}
            <br />
            <span className="font-bold">
              관련 법령에 의해 형사처벌 및 민사상 손해배상 대상이 될 수 있습니다.
            </span>
          </p>
        </div>
      </div>
      <OrderButtonBox
        buttonName="주문 요청하기"
        isActive={isFormValid}
        onClick={() => isFormValid && setShowConfirmModal(true)}
      />
      <Modal
        isOpen={showConfirmModal}
        cancelText="다시 확인"
        confirmText="주문 요청"
        isConfirmDisabled={isSubmitting}
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={async () => {
          if (isSubmitting) return;
          setIsSubmitting(true);
          const cart = JSON.parse(sessionStorage.getItem('orderCart') || '[]');
          try {
            const res = await createOrder(boothId, idempotencyKey.current, {
              tableNumber: isDineIn ? parseInt(tableNumber) : 0,
              numOfPeople: isDineIn ? parseInt(headCount) : 1,
              customerName: name,
              customerPhoneNumber: phone,
              totalOrderPrice: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
              language: 'KO',
              orderItems: cart.map((item) => ({
                boothMenuId: item.boothMenuId,
                quantity: item.quantity,
                menuPrice: item.price,
                totalOrderItemPrice: item.price * item.quantity,
              })),
            });
            sessionStorage.removeItem('orderCustomerInfo');
            sessionStorage.removeItem('orderQuantities');
            sessionStorage.removeItem('orderCart');
            sessionStorage.setItem('orderToastPending', 'true');
            sessionStorage.setItem(
              'orderResponse',
              JSON.stringify({ orderResponse: res.data, orderType, boothId })
            );
            navigate(`/order/${boothId}/pay`, {
              state: { orderResponse: res.data, orderType },
              replace: true,
            });
          } catch (error) {
            setIsSubmitting(false);
            const status = error?.response?.status;
            if (status === 404) return;
            if (status === 400) {
              setSoldOutToast(true);
              return;
            }
            const message =
              status === 409
                ? '이미 처리된 주문이에요.'
                : status >= 500
                  ? '서버 오류가 발생했어요. 잠시 후 다시 시도해주세요.'
                  : '주문 중 오류가 발생했어요. 다시 시도해주세요.';
            setErrorToast({ visible: true, message });
          }
        }}
      >
        <div className="flex flex-col gap-px">
          <div className="font-medium">주문을 요청할까요?</div>
          <div className="font-medium">주문 요청 후에는 취소가 불가능해요.</div>
        </div>
      </Modal>
      <Toast
        visible={errorToast.visible}
        message={errorToast.message}
        icon="warning"
        onClose={() => setErrorToast({ visible: false, message: '' })}
      />
      <Toast
        visible={soldOutToast}
        message="품절된 상품이 있어서 재주문 부탁드립니다."
        icon="warning"
        duration={3000}
        onClose={() => {
          setSoldOutToast(false);
          sessionStorage.removeItem('orderQuantities');
          sessionStorage.removeItem('orderCart');
          navigate(`/order/${boothId}?entry=qr`, { replace: true });
        }}
      />
    </div>
  );
}

export default CustomerInfo;
