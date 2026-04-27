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
  const scrollContainerRef = useRef(null);
  const sectionRefs = { main: useRef(null), side: useRef(null), drink: useRef(null) };

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
        />
        <div className="h-25" />
      </div>
      <OrderButtonBox buttonName="주문하기" isOpen={true} onClick={() => {}} />
    </div>
  );
}
export default OrderProgress;
