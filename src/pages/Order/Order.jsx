import { useEffect, useState } from 'react';
import { Outlet } from 'react-router';

import Noodle from '@/assets/icons/noodle.svg';
import BoothHero from '@/assets/images/booth_image.svg?react';
import Info1 from '@/assets/images/booth_info_1.svg';

const boothData = {
  boothId: 6,
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

const foodData = [
  {
    boothMenuId: 11,
    image: Noodle,
    name: '타코야끼',
    description: '',
    price: 6000,
    category: 'main',
  },
  {
    boothMenuId: 12,
    image: Noodle,
    name: '야끼소바',
    description: '',
    price: 8000,
    category: 'main',
  },
  {
    boothMenuId: 13,
    image: Noodle,
    name: '블루레몬에이드',
    description: '',
    price: 3000,
    category: 'drink',
  },
  {
    boothMenuId: 14,
    image: Noodle,
    name: '자몽에이드',
    description: '',
    price: 3000,
    category: 'drink',
  },
];

function Order() {
  const [quantities, setQuantities] = useState(() => {
    const saved = sessionStorage.getItem('orderQuantities');
    return saved ? JSON.parse(saved) : {};
  });

  const handleReset = () => {
    setQuantities({});
    sessionStorage.removeItem('orderQuantities');
    sessionStorage.removeItem('orderCart');
  };

  const handleSelect = (key) => setQuantities((prev) => ({ ...prev, [key]: 1 }));
  const handleIncrease = (key) => setQuantities((prev) => ({ ...prev, [key]: prev[key] + 1 }));
  const handleDecrease = (key) =>
    setQuantities((prev) => {
      const next = { ...prev };
      if (next[key] <= 1) delete next[key];
      else next[key] -= 1;
      return next;
    });

  const handleRemove = (key) =>
    setQuantities((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });

  useEffect(() => {
    sessionStorage.setItem('orderQuantities', JSON.stringify(quantities));

    const cart = Object.entries(quantities).map(([key, qty]) => {
      const [cat, idx] = key.split('-');
      const item = foodData.filter((i) => i.category === cat)[parseInt(idx)];
      return {
        key,
        boothMenuId: item.boothMenuId,
        name: item.name,
        price: item.price,
        quantity: qty,
      };
    });
    sessionStorage.setItem('orderCart', JSON.stringify(cart));
  }, [quantities]);

  useEffect(() => {
    return () => {
      sessionStorage.removeItem('orderQuantities');
      sessionStorage.removeItem('orderCart');
      sessionStorage.removeItem('orderCustomerInfo');
      sessionStorage.removeItem('orderResponse');
    };
  }, []);

  return (
    <Outlet
      context={{
        ...boothData,
        foodData,
        quantities,
        onSelect: handleSelect,
        onIncrease: handleIncrease,
        onRemove: handleRemove,
        onDecrease: handleDecrease,
        onReset: handleReset,
        boothId: boothData.boothId,
      }}
    />
  );
}

export default Order;
