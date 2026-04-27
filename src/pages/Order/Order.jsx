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
  nightMenus: [
    { name: '닭발&주먹밥', price: '3000원' },
    { name: '김치우동', price: '5000원' },
    { name: '김치전', price: '3000원' },
    { name: '어묵우동', price: '10000원' },
    { name: '옥수수전', price: '3000원' },
    { name: '어묵탕', price: '10000원' },
    { name: '김치전(+치즈)', price: '3000원' },
    { name: '주먹밥', price: '3000원' },
    { name: '옥수수전(+치즈)', price: '3000원' },
  ],
  dayMenus: [
    { name: '솜사탕', price: '2000원' },
    { name: '핫도그', price: '3000원' },
    { name: '음료수', price: '1000원' },
    { name: '떡볶이', price: '4000원' },
  ],
};

function Order() {
  return <Outlet context={boothData} />;
}

export default Order;
