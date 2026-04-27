import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useOutletContext } from 'react-router';

import OrderButtonBox from '@/components/Order/OrderEntry/OrderButtonBox';
import FoodNavbar from '@/components/Order/OrderProgress/FoodNavbar';
import MenuSection from '@/components/Order/OrderProgress/MenuSection';
import OrderHeader from '@/components/common/OrderHeader';

const CATEGORY_MAP = { 메인: 'main', 사이드: 'side', 음료: 'drink' };

function OrderProgress() {
  const navigate = useNavigate();
  const { boothName, foodData } = useOutletContext();

  const [activeCategory, setActiveCategory] = useState('메인');
  const [quantities, setQuantities] = useState({});
  const scrollContainerRef = useRef(null);
  const sectionRefs = { main: useRef(null), side: useRef(null), drink: useRef(null) };

  const handleSelect = (key) => setQuantities((prev) => ({ ...prev, [key]: 1 }));
  const handleIncrease = (key) => setQuantities((prev) => ({ ...prev, [key]: prev[key] + 1 }));
  const handleDecrease = (key) =>
    setQuantities((prev) => {
      const next = { ...prev };
      if (next[key] <= 1) delete next[key];
      else next[key] -= 1;
      return next;
    });

  const totalCount = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  const hasSelection = totalCount > 0;

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    const ref = sectionRefs[CATEGORY_MAP[category]];
    const container = scrollContainerRef.current;
    if (ref?.current && container) {
      const top =
        ref.current.getBoundingClientRect().top -
        container.getBoundingClientRect().top +
        container.scrollTop;
      container.scrollTo({ top: top - 24, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="shrink-0">
        <OrderHeader title={boothName} showBackButton onBack={() => navigate(-1)} />
        <FoodNavbar activeCategory={activeCategory} onCategoryClick={handleCategoryClick} />
      </div>
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto min-h-0">
        <MenuSection
          foodData={foodData}
          sectionRefs={sectionRefs}
          activeCategory={activeCategory}
          quantities={quantities}
          onSelect={handleSelect}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
        />
        <div className="h-25" />
      </div>
      <OrderButtonBox
        buttonName={hasSelection ? `주문하기(${totalCount})` : '주문하기'}
        hasSelection={hasSelection}
        onClick={() => {}}
      />
    </div>
  );
}
export default OrderProgress;
