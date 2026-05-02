import { useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router';

import { getBoothInfo } from '@/api/booth';
import Noodle from '@/assets/icons/noodle.svg';

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
    description: '시원',
    price: 3000,
    category: 'drink',
  },
  {
    boothMenuId: 14,
    image: Noodle,
    name: '자몽에이드',
    description: '시원',
    price: 3000,
    category: 'drink',
    soldOut: true,
  },
];

function Order() {
  const { boothId } = useParams();
  const [boothInfo, setBoothInfo] = useState(null);
  const [lang, setLang] = useState(sessionStorage.getItem('language') || 'KO');
  const [quantities, setQuantities] = useState(() => {
    const saved = sessionStorage.getItem('orderQuantities');
    return saved ? JSON.parse(saved) : {};
  });

  const handleLangChange = (code) => {
    sessionStorage.setItem('language', code);
    setLang(code);
  };

  useEffect(() => {
    getBoothInfo(boothId, lang)
      .then((res) => {
        const data = res.data;
        setBoothInfo(data);
        sessionStorage.setItem('departmentName', data.departmentName);
      })
      .catch(console.error);
  }, [boothId, lang]);

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
        boothId,
        boothName: boothInfo?.boothName ?? '',
        location: boothInfo?.locationDetail ?? '',
        isOpen: boothInfo?.open ?? false,
        content: boothInfo?.description ?? '',
        thumbnailUrl: boothInfo?.thumbnailUrl ?? null,
        images: boothInfo?.detailImages?.map((d) => d.imageUrl) ?? [],
        dayMenus: boothInfo?.menus?.day ?? [],
        nightMenus: boothInfo?.menus?.night ?? [],
        orderAvailable: boothInfo?.orderAvailable ?? false,
        buttonName: '주문하러 가기',
        foodData,
        quantities,
        onSelect: handleSelect,
        onIncrease: handleIncrease,
        onRemove: handleRemove,
        onDecrease: handleDecrease,
        onReset: handleReset,
        onLangChange: handleLangChange,
      }}
    />
  );
}

export default Order;
