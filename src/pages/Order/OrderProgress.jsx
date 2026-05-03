import { useRef, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router';

import OrderButtonBox from '@/components/Order/OrderEntry/OrderButtonBox';
import FoodNavbar from '@/components/Order/OrderProgress/FoodNavbar';
import MenuSection from '@/components/Order/OrderProgress/MenuSection';
import Loading from '@/components/common/Loading';
import Modal from '@/components/common/Modal';
import OrderHeader from '@/components/common/OrderHeader';

const CATEGORY_MAP = { 메인: 'main', 사이드: 'side', 음료: 'drink' };
const CATEGORY_ORDER = ['main', 'side', 'drink'];
const CATEGORY_LABEL_MAP = { main: '메인', side: '사이드', drink: '음료' };

function OrderProgress() {
  const navigate = useNavigate();
  const {
    boothId,
    departmentName,
    foodData,
    quantities,
    onSelect,
    onIncrease,
    onDecrease,
    onReset,
    isMenuLoading,
  } = useOutletContext();

  const [activeCategory, setActiveCategory] = useState('메인');
  const [showBackModal, setShowBackModal] = useState(false);
  const scrollContainerRef = useRef(null);
  const sectionRefs = { main: useRef(null), side: useRef(null), drink: useRef(null) };

  const totalCount = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  const hasSelection = totalCount > 0;

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const isBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 1;
    if (isBottom) {
      setActiveCategory('음료');
      return;
    }

    const containerTop = container.getBoundingClientRect().top;
    let current = '메인';
    for (const cat of CATEGORY_ORDER) {
      const ref = sectionRefs[cat];
      if (ref?.current && ref.current.getBoundingClientRect().top - containerTop <= 24) {
        current = CATEGORY_LABEL_MAP[cat];
      }
    }
    setActiveCategory(current);
  };

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
    <div className="flex flex-col h-full bg-white relative">
      {isMenuLoading && <Loading />}
      <div className="shrink-0">
        <OrderHeader
          title={departmentName}
          showBackButton
          onBack={() => (hasSelection ? setShowBackModal(true) : navigate(-1))}
        />
        <FoodNavbar activeCategory={activeCategory} onCategoryClick={handleCategoryClick} />
      </div>
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto min-h-0"
        onScroll={handleScroll}
      >
        <MenuSection
          foodData={foodData}
          sectionRefs={sectionRefs}
          activeCategory={activeCategory}
          quantities={quantities}
          onSelect={onSelect}
          onIncrease={onIncrease}
          onDecrease={onDecrease}
        />
        <div className="h-25" />
      </div>
      <Modal
        isOpen={showBackModal}
        cancelText="뒤로 가기"
        confirmText="계속 주문하기"
        onCancel={() => {
          onReset();
          navigate(-1);
        }}
        onConfirm={() => setShowBackModal(false)}
      >
        <div className="flex gap-1.5">
          <div className="font-semibold">뒤로 가면</div>
          <div className="font-semibold text-order-button"> 담은 주문이 모두 사라집니다.</div>
        </div>
        <div className="font-semibold">그래도 뒤로 가시겠습니까?</div>
      </Modal>
      <OrderButtonBox
        buttonName={hasSelection ? `주문하기(${totalCount})` : '주문하기'}
        isActive={hasSelection}
        inactiveColor="var(--color-pink-100)"
        onClick={() => hasSelection && navigate(`/order/${boothId}/confirm`)}
      />
    </div>
  );
}
export default OrderProgress;
