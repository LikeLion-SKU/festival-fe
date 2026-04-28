import Garbage from '@/assets/icons/garbage.svg?react';
import Plus from '@/assets/icons/plus.svg?react';

const CATEGORY_LABELS = { main: '메인', side: '사이드', drink: '음료' };
const CATEGORY_ORDER = ['main', 'side', 'drink'];

function MenuSection({
  foodData,
  sectionRefs,
  activeCategory,
  quantities,
  onSelect,
  onIncrease,
  onDecrease,
}) {
  const handleSelect = onSelect;
  const handleIncrease = onIncrease;
  const handleDecrease = onDecrease;

  const grouped = CATEGORY_ORDER.reduce((acc, cat) => {
    acc[cat] = foodData.filter((item) => item.category === cat);
    return acc;
  }, {});

  return (
    <div className="px-4 py-5 flex flex-col gap-6">
      {CATEGORY_ORDER.map((cat) => (
        <div key={cat} ref={sectionRefs[cat]}>
          <div
            className={`px-2.5 text-sm font-medium mb-3 ${CATEGORY_LABELS[cat] === activeCategory ? 'text-order-button' : 'text-gray-400'}`}
          >
            {CATEGORY_LABELS[cat]}
          </div>
          <div className="flex flex-col gap-5">
            {grouped[cat].length === 0 ? (
              <div className="text-xs text-gray-400 text-center py-4">
                본 부스에서는 {CATEGORY_LABELS[cat]}를 제공하지 않습니다.
              </div>
            ) : (
              grouped[cat].map((item, index) => {
                const key = `${cat}-${index}`;
                const qty = quantities[key];
                return (
                  <div
                    key={index}
                    className={`px-3 rounded-lg ${qty ? 'bg-gray-100 py-5' : 'py-2'}`}
                    onClick={() => !qty && handleSelect(key)}
                  >
                    <div className="flex justify-between">
                      <div className="flex items-center gap-5">
                        <img src={item.image} className="w-10 h-10 rounded-lg object-cover" />
                        <div className="flex flex-col flex-1 gap-2">
                          <div className="text-black-1000 font-medium">{item.name}</div>
                          <div className="text-xs text-gray-400">{item.description}</div>
                        </div>
                      </div>
                      <div className="text-black-1000 text-sm font-medium">
                        {item.price.toLocaleString()}원
                      </div>
                    </div>
                    {qty && (
                      <div className="flex justify-end items-center gap-2 mt-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDecrease(key);
                          }}
                          className="w-5 h-5 rounded-full bg-white shadow flex items-center justify-center text-gray-400"
                        >
                          {qty === 1 ? (
                            <Garbage />
                          ) : (
                            <div className=" w-2 border-b border-light-gray text-xs leading-none" />
                          )}
                        </button>
                        <span className="text-sm font-medium w-4 text-center">{qty}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleIncrease(key);
                          }}
                          className="w-5 h-5 rounded-full bg-white shadow flex items-center justify-center text-gray-400"
                        >
                          <Plus />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
export default MenuSection;
