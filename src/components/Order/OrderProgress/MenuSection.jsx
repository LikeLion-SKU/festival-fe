import Garbage from '@/assets/icons/garbage.svg?react';
import Minus from '@/assets/icons/minus.svg?react';
import Noodle from '@/assets/icons/noodle.svg';
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
                const isSoldOut = item.soldOut === true;

                return (
                  <div
                    key={index}
                    className={`px-3 rounded-lg ${
                      isSoldOut
                        ? 'bg-disable-gray py-5 cursor-default'
                        : qty
                          ? 'bg-gray-100 pt-4 pb-5 cursor-pointer'
                          : 'py-2 cursor-pointer'
                    }`}
                    onClick={() => !qty && !isSoldOut && onSelect(key)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-5">
                        <img
                          src={item.iconImageUrl || item.image || Noodle}
                          className={`w-10 h-10 rounded-lg object-cover ${isSoldOut ? 'opacity-50' : ''}`}
                        />
                        <div className="flex flex-col flex-1 gap-1.5">
                          <div
                            className={`font-medium ${isSoldOut ? 'text-gray-500' : 'text-black-1000'}`}
                          >
                            {item.name}
                            {isSoldOut && <span>(품절)</span>}
                          </div>
                          <div className="text-xs text-gray-400 pr-5">{item.description}</div>
                        </div>
                      </div>
                      <div
                        className={`text-sm font-medium shrink-0 ${isSoldOut ? 'text-gray-500' : 'text-black-1000'}`}
                      >
                        {item.price.toLocaleString()}원
                      </div>
                    </div>
                    {qty && !isSoldOut && (
                      <div className="flex justify-end items-center gap-2 mt-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDecrease(key);
                          }}
                          className="w-7 h-7 rounded-full bg-white shadow flex items-center justify-center text-gray-400"
                        >
                          {qty === 1 ? (
                            <Garbage className="w-2 h-2" />
                          ) : (
                            <Minus className="w-2 h-2" />
                          )}
                        </button>
                        <span className="text-sm font-medium w-4 text-center">{qty}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onIncrease(key);
                          }}
                          className="w-7 h-7 rounded-full bg-white shadow flex items-center justify-center text-gray-400"
                        >
                          <Plus className="w-2 h-2" />
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
