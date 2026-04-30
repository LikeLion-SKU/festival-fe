import CheckIcon from '@/assets/icons/check_orange.svg?react';

function TitleSection() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 bg-gray-bg pb-5">
      <CheckIcon className="w-10.5 h-10.5" />
      <div className="flex flex-col items-center gap-1">
        <p className="text-xl font-semibold text-order-button">주문 요청이 완료됐어요!</p>
        <p className="text-sm font-medium text-gray-400">입금 확인 후 조리가 시작돼요</p>
      </div>
    </div>
  );
}
export default TitleSection;
