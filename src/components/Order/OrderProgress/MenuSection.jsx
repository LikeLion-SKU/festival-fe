const CATEGORY_LABELS = { main: '메인', side: '사이드', drink: '음료' };
const CATEGORY_ORDER = ['main', 'side', 'drink'];

function MenuSection({ foodData, sectionRefs, activeCategory }) {
  const grouped = CATEGORY_ORDER.reduce((acc, cat) => {
    acc[cat] = foodData.filter((item) => item.category === cat);
    return acc;
  }, {});

  return (
    <div className="px-7 py-4 flex flex-col gap-6">
      {CATEGORY_ORDER.map((cat) => (
        <div key={cat} ref={sectionRefs[cat]}>
          <div
            className={`text-sm font-medium mb-3 ${CATEGORY_LABELS[cat] === activeCategory ? 'text-order-button' : 'text-gray-400'}`}
          >
            {CATEGORY_LABELS[cat]}
          </div>
          <div className="flex flex-col gap-10">
            {/* 카테고리별 메뉴 */}
            {grouped[cat].map((item, index) => (
              <div key={index} className="flex items-center gap-5">
                <img src={item.image} className="w-10 h-10 rounded-lg object-cover" />
                <div className="flex flex-col flex-1 gap-2">
                  <div className="text-black-1000 font-medium">{item.name}</div>
                  <div className="text-xs text-gray-400">{item.description}</div>
                </div>
                <div className="text-black-1000 text-sm font-medium">
                  {item.price.toLocaleString()}원
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
export default MenuSection;
