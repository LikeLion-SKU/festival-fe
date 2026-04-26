import { useOutletContext } from 'react-router';

import BoothImageSection from '@/components/Order/OrderEntry/BoothImageSection';
import BoothInfoSection from '@/components/Order/OrderEntry/BoothInfoSection';
import OrderButtonBox from '@/components/Order/OrderEntry/OrderButtonBox';

function OrderEntry() {
  const { boothName, location, isOpen, content, HeroImage, images, buttonName } =
    useOutletContext();

  return (
    <>
      <BoothImageSection Image={HeroImage} />
      <BoothInfoSection
        boothName={boothName}
        location={location}
        isOpen={isOpen}
        content={content}
        images={images}
      />
      <OrderButtonBox className="relative z-1" buttonName={buttonName} isOpen={isOpen} />
    </>
  );
}

export default OrderEntry;
