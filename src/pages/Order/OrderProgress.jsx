import { useNavigate } from 'react-router';
import { useOutletContext } from 'react-router';

import FoodNavbar from '@/components/Order/OrderProgress/FoodNavbar';
import OrderHeader from '@/components/common/OrderHeader';

function OrderProgress() {
  const navigate = useNavigate();
  const { boothName, _foodData } = useOutletContext();

  return (
    <>
      <OrderHeader title={boothName} showBackButton onBack={() => navigate(-1)} />
      <FoodNavbar />
    </>
  );
}
export default OrderProgress;
