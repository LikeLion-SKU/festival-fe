import { useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router';

import { getBoothInfo } from '@/api/booth';
import { getOrderAvailableMenus } from '@/api/boothMenu';
import Toast from '@/components/common/Toast';

function Order() {
  const { boothId } = useParams();
  const [boothInfo, setBoothInfo] = useState(null);
  const [loadedKey, setLoadedKey] = useState(null);
  const [lang, setLang] = useState(sessionStorage.getItem('language') || 'KO');
  const isLoading = loadedKey !== `${boothId}-${lang}`;
  const [foodData, setFoodData] = useState([]);
  const [menuLoadedBoothId, setMenuLoadedBoothId] = useState(null);
  const isMenuLoading = menuLoadedBoothId !== boothId;
  const [errorToast, setErrorToast] = useState({ visible: false, message: '' });
  const [quantities, setQuantities] = useState(() => {
    const saved = sessionStorage.getItem('orderQuantities');
    return saved ? JSON.parse(saved) : {};
  });

  const handleLangChange = (code) => {
    sessionStorage.setItem('language', code);
    setLang(code);
  };

  const showError = (error) => {
    const status = error?.response?.status;
    if (status === 404) return;
    const message =
      status >= 500
        ? '서버 오류가 발생했어요. 잠시 후 다시 시도해주세요.'
        : '데이터를 불러오는 중 오류가 발생했어요.';
    setErrorToast({ visible: true, message });
  };

  useEffect(() => {
    getBoothInfo(boothId, lang)
      .then((res) => {
        const data = res.data;
        setBoothInfo(data);
        sessionStorage.setItem('departmentName', data.departmentName);
      })
      .catch(showError)
      .finally(() => setLoadedKey(`${boothId}-${lang}`));
  }, [boothId, lang]);

  useEffect(() => {
    getOrderAvailableMenus(boothId)
      .then((res) => {
        const flat = Object.entries(res.data).flatMap(([category, items]) =>
          items.map((item) => ({
            boothMenuId: item.menuId,
            name: item.name,
            description: item.description,
            iconImageUrl: item.iconImageUrl,
            price: item.price,
            soldOut: item.soldOut,
            category,
          }))
        );
        setFoodData(flat);
      })
      .catch(showError)
      .finally(() => setMenuLoadedBoothId(boothId));
  }, [boothId]);

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

    const cart = Object.entries(quantities)
      .map(([key, qty]) => {
        const [cat, idx] = key.split('-');
        const item = foodData.filter((i) => i.category === cat)[parseInt(idx)];
        if (!item) return null;
        return {
          key,
          boothMenuId: item.boothMenuId,
          name: item.name,
          price: item.price,
          quantity: qty,
        };
      })
      .filter(Boolean);
    sessionStorage.setItem('orderCart', JSON.stringify(cart));
  }, [quantities, foodData]);

  useEffect(() => {
    return () => {
      sessionStorage.removeItem('orderQuantities');
      sessionStorage.removeItem('orderCart');
      sessionStorage.removeItem('orderCustomerInfo');
      sessionStorage.removeItem('orderResponse');
    };
  }, []);

  return (
    <>
      <Toast
        visible={errorToast.visible}
        message={errorToast.message}
        icon="warning"
        onClose={() => setErrorToast({ visible: false, message: '' })}
      />
      <Outlet
        context={{
          boothId,
          boothName: boothInfo?.boothName ?? '',
          departmentName: boothInfo?.departmentName ?? '',
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
          lang,
          isLoading,
          isMenuLoading,
          onReset: handleReset,
          onLangChange: handleLangChange,
        }}
      />
    </>
  );
}

export default Order;
