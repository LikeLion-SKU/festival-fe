import Cancel from '@/assets/icons/cancel.svg?react';
import Garbage from '@/assets/icons/garbage.svg?react';
import Minus from '@/assets/icons/minus.svg?react';
import Plus from '@/assets/icons/plus.svg?react';

function MenuBox({ cart, onIncrease, onDecrease, onRemove }) {
  return (
    <div className="bg-white rounded-2xl px-4">
      {cart.map((item, i) => (
        <div key={item.key}>
          <div className="py-6 flex flex-col items-end gap-4">
            <button onClick={() => onRemove(item.key)}>
              <Cancel className="w-3 h-3" />
            </button>
            <div className="w-full flex justify-between ">
              {/* 메뉴 이름 부분 */}
              <div className="flex flex-col gap-2 py-1">
                <span className="font-medium">{item.name}</span>
                <span className="text-xs text-gray-400">개 당 {item.price.toLocaleString()}원</span>
              </div>
              {/* 오른쪽 가격 부분 */}
              <div className="flex flex-col items-end gap-3">
                <span className="font-medium">
                  {(item.price * item.quantity).toLocaleString()}원
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onDecrease(item.key)}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center"
                  >
                    {item.quantity === 1 ? (
                      <Garbage className="w-3 h-3" />
                    ) : (
                      <Minus className="w-3 h-3" />
                    )}
                  </button>
                  <span className="w-5 text-center text-order-button font-normal">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onIncrease(item.key)}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          {i < cart.length - 1 && <div className="border-b border-gray-100" />}
        </div>
      ))}
    </div>
  );
}

export default MenuBox;
