import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router';

import MoonIcon from '@/assets/icons/moon_icon.svg?react';
import MorningToggle from '@/assets/icons/morning_toggle.svg?react';
import NightToggle from '@/assets/icons/night_toggle.svg?react';
import SunIcon from '@/assets/icons/sun_icon.svg?react';
import BoothImageSection from '@/components/Order/OrderEntry/BoothImageSection';
import BoothInfoSection from '@/components/Order/OrderEntry/BoothInfoSection';
import MenuSection from '@/components/Order/OrderEntry/MenuSection';
import OrderButtonBox from '@/components/Order/OrderEntry/OrderButtonBox';

function OrderEntry() {
  const {
    boothName,
    location,
    isOpen,
    content,
    HeroImage,
    images,
    buttonName,
    nightMenus,
    dayMenus,
  } = useOutletContext();

  const [isNight, setIsNight] = useState(true);
  const TimeImage = isNight ? MoonIcon : SunIcon;
  const ToggleIcon = isNight ? NightToggle : MorningToggle;
  const word = isNight ? '밤' : '낮';
  const navigate = useNavigate();

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
      <MenuSection
        word={word}
        isNight={isNight}
        onToggle={() => setIsNight((prev) => !prev)}
        Image={TimeImage}
        Icon={ToggleIcon}
        menus={isNight ? nightMenus : dayMenus}
      />
      <div className="h-28" />
      <OrderButtonBox
        className="relative z-1 "
        buttonName={buttonName}
        isOpen={isOpen}
        onClick={() => navigate('/order/progress')}
      />
    </>
  );
}

export default OrderEntry;
