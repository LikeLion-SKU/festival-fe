import { Outlet } from 'react-router';

import BoothHero from '@/assets/images/booth_image.svg?react';
import Info1 from '@/assets/images/booth_info_1.svg';

const boothData = {
  boothName: '소프트웨어학과',
  location: '혜인관 앞',
  isOpen: true,
  content:
    '저희 부스에서는 솜사탕, 음료수, 핫도그를 판매합니다. 저희 부스에서는 솜사탕, 음료수, 핫도그를 판매합니다. 저희 부스에서는 솜사탕, 음료수, 핫도그를 판매합니다. 저희 부스에서는 솜사탕, 음료수, 핫도그를 판매합니다.',
  HeroImage: BoothHero,
  images: [Info1, Info1, Info1],
  buttonName: '주문하러 가기',
};

function Order() {
  return <Outlet context={boothData} />;
}

export default Order;
