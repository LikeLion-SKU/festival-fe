import { useState } from 'react';
import { useNavigate, useOutletContext, useSearchParams } from 'react-router';

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
    departmentName,
    location,
    isOpen,
    boothStatus,
    dayOpenTime,
    nightOpenTime,
    closeTime,
    content,
    thumbnailUrl,
    images,
    buttonName,
    nightMenus,
    dayMenus,
    orderAvailable,
    onLangChange,
    lang,
    isLoading,
  } = useOutletContext();

  const [searchParams] = useSearchParams();
  const isQR = searchParams.get('entry') === 'qr';

  const hasDay = dayMenus?.length > 0;
  const hasNight = nightMenus?.length > 0;
  const canToggle = hasDay && hasNight;

  const [userToggle, setUserToggle] = useState(null);
  const isNight = userToggle !== null ? userToggle : hasNight;
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
    <div
      className={isQR ? '' : 'bg-[#1A1A1A] min-h-screen'}
      style={
        !isQR
          ? { animation: 'booth-detail-page-in 0.45s cubic-bezier(0.22,1,0.36,1) both' }
          : undefined
      }
    >
      {!isQR && (
        <style>{`
          @keyframes booth-detail-page-in {
            from { opacity: 0; transform: translateY(18px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      )}
      <BoothImageSection
        thumbnailUrl={thumbnailUrl}
        onLangChange={onLangChange}
        isLoading={isLoading}
        isQR={isQR}
      />
      <BoothInfoSection
        boothName={boothName}
        departmentName={departmentName}
        location={location}
        isOpen={isOpen}
        boothStatus={boothStatus}
        dayOpenTime={dayOpenTime}
        nightOpenTime={nightOpenTime}
        closeTime={closeTime}
        content={content}
        images={images}
        lang={lang}
        isLoading={isLoading}
        isQR={isQR}
      />
      <MenuSection
        word={word}
        isNight={isNight}
        canToggle={canToggle}
        onToggle={() => setUserToggle((prev) => !(prev !== null ? prev : hasNight))}
        Image={TimeImage}
        Icon={ToggleIcon}
        menus={activeMenus}
        isQR={isQR}
      />
      {isQR ? (
        <>
          <div className="h-28" />
          <OrderButtonBox
            className="relative z-1"
            buttonName={buttonName}
            isActive={orderAvailable}
            onClick={() => orderAvailable && navigate(`/order/${boothId}/progress`)}
          />
        </>
      ) : (
        <div className="h-10" />
      )}
    </div>
  );
}

export default OrderEntry;
