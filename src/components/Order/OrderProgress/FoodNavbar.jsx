const CATEGORIES = ['메인', '사이드', '음료'];

function FoodNavbar({ activeCategory, onCategoryClick }) {
  const active = activeCategory;

  return (
    <div className="pt-6">
      <div className="flex pl-5 gap-5">
        {CATEGORIES.map((category) => (
          <div
            key={category}
            className="w-fit cursor-pointer"
            onClick={() => onCategoryClick(category)}
          >
            <div
              className={active === category ? 'font-semibold text-order-button' : 'text-gray-400'}
            >
              {category}
            </div>
            {active === category && <div className="border-b-2 border-order-button" />}
          </div>
        ))}
      </div>
      <div className="pt-4 border-b-4 border-gray-02" />
    </div>
  );
}
export default FoodNavbar;
