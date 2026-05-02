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
    boothId,
    boothName,
    location,
    isOpen,
    content,
    thumbnailUrl,
    images,
    buttonName,
    nightMenus,
    dayMenus,
    orderAvailable,
    onLangChange,
  } = useOutletContext();

  const hasDay = dayMenus?.length > 0;
  const hasNight = nightMenus?.length > 0;
  const canToggle = hasDay && hasNight;

  const [isNight, setIsNight] = useState(() => hasNight);
  const TimeImage = isNight ? MoonIcon : SunIcon;
  const ToggleIcon = isNight ? NightToggle : MorningToggle;
  const word = isNight ? '밤' : '낮';
  const navigate = useNavigate();

  const activeMenus = canToggle
    ? isNight
      ? nightMenus
      : dayMenus
    : hasNight
      ? nightMenus
      : dayMenus;

  return (
    <>
      <BoothImageSection thumbnailUrl={thumbnailUrl} onLangChange={onLangChange} />
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
        canToggle={canToggle}
        onToggle={() => setIsNight((prev) => !prev)}
        Image={TimeImage}
        Icon={ToggleIcon}
        menus={activeMenus}
      />
      <div className="h-28" />
      <OrderButtonBox
        className="relative z-1 "
        buttonName={buttonName}
        isActive={orderAvailable}
        onClick={() => navigate(`/order/${boothId}/progress`)}
      />
    </>
  );
}

export default OrderEntry;
