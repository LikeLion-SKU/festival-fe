import OrderInfo from '@/components/Order/OrderComplete/OrderInfo';
import TitleSection from '@/components/Order/OrderComplete/TitleSection';

function OrderComplete() {
  return (
    <div className="flex flex-col h-full bg-gray-bg overflow-y-auto">
      <TitleSection />
      <OrderInfo />
    </div>
  );
}
export default OrderComplete;
