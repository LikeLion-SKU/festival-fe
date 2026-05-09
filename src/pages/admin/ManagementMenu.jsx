import { useEffect, useState } from 'react';

import { getBoothOrderMenus, updateMenuPrice, updateMenuSoldOut } from '@/api/booth';
import WarningIcon from '@/assets/icons/admin/warning_icon.svg?react';
import Noodle from '@/assets/icons/noodle.svg';
import BottomSheet from '@/components/Admin/BottomSheet';

const formatPrice = (n) => `${n.toLocaleString('ko-KR')}원`;

const CATEGORIES = [
  { key: 'main', label: '메인' },
  { key: 'side', label: '사이드' },
  { key: 'drink', label: '음료' },
];

function ChevronIcon({ open }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={`transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
    >
      <path
        d="M7.5 5L12.5 10L7.5 15"
        stroke="#7F7F7F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PriceEditPanel({ item, onClose, onConfirm }) {
  const [price, setPrice] = useState(item.price.toLocaleString('ko-KR'));

  const handleChange = (e) => {
    const digits = e.target.value.replace(/[^0-9]/g, '');
    setPrice(digits ? Number(digits).toLocaleString('ko-KR') : '');
  };

  const numericPrice = Number(price.replace(/,/g, ''));

  return (
    <div className="bg-white rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span
          className="font-semibold text-[#FE5F54]"
          style={{ fontSize: '16px', lineHeight: '24px', letterSpacing: '-0.5px' }}
        >
          가격 수정
        </span>
        <button onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M5 5L15 15M15 5L5 15"
              stroke="#252525"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
      <div className="flex flex-col gap-1.5">
        <label
          className="font-semibold text-[#7F7F7F]"
          style={{ fontSize: '13px', lineHeight: '19.5px', letterSpacing: '0px' }}
        >
          상품명
        </label>
        <input
          readOnly
          value={item.name}
          className="w-full rounded-[8px] bg-[#F6F6F6] px-4 py-3 text-sm text-[#A0A0A0] outline-none border border-[#EFEFEF]"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label
          className="font-semibold text-[#7F7F7F]"
          style={{ fontSize: '13px', lineHeight: '19.5px', letterSpacing: '0px' }}
        >
          가격
        </label>
        <input
          type="text"
          inputMode="numeric"
          value={price}
          onChange={handleChange}
          className="w-full rounded-xl border border-[#E5E5E5] px-4 py-3 text-sm text-[#252525] outline-none focus:border-[#FE5F54]"
        />
      </div>
      <button
        onClick={() => onConfirm(numericPrice)}
        className="w-full rounded-xl bg-[#FE5F54] text-white font-semibold flex items-center justify-center"
        style={{ height: '48px', fontSize: '16px' }}
      >
        수정 완료
      </button>
    </div>
  );
}

function MenuItemCard({ item, onEditPrice, onSoldOut, onResume }) {
  const isSoldOut = item.soldOut;

  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-3 border border-[#EFEFEF]"
      style={{
        backgroundColor: isSoldOut ? '#C9C9C9' : '#FFFFFF',
        transition: 'background-color 0.5s ease',
      }}
    >
      <div className="flex items-center gap-3">
        <img src={item.image} alt={item.name} className="w-10 h-10 object-contain rounded-xl" />
        <div className="flex-1 flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <p
              className="font-semibold text-[#101010]"
              style={{ fontSize: '16px', letterSpacing: '0%' }}
            >
              {item.name}
              {isSoldOut ? '(품절)' : ''}
            </p>
            <p
              className="font-medium text-[#A0A0A0]"
              style={{ fontSize: '12px', letterSpacing: '-2%' }}
            >
              {item.description}
            </p>
          </div>
          <span
            className="font-semibold text-[#101010] whitespace-nowrap"
            style={{ fontSize: '16px', letterSpacing: '0%' }}
          >
            {formatPrice(item.price)}
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        {isSoldOut ? (
          <button
            onClick={onResume}
            className="flex-1 rounded-[8px] bg-[#FE5F54] text-white font-semibold flex items-center justify-center"
            style={{ height: '40px', fontSize: '14px', lineHeight: '160%', letterSpacing: '0' }}
          >
            판매 재개
          </button>
        ) : (
          <>
            <button
              onClick={onEditPrice}
              className="flex-1 rounded-[8px] bg-[#EFEFEF] text-[#7F7F7F] font-semibold flex items-center justify-center"
              style={{
                height: '40px',
                paddingLeft: '20px',
                paddingRight: '20px',
                fontSize: '14px',
                lineHeight: '160%',
                letterSpacing: '0',
              }}
            >
              가격 수정
            </button>
            <button
              onClick={onSoldOut}
              className="flex-1 rounded-[8px] bg-[#FE5F54] text-white font-semibold flex items-center justify-center"
              style={{
                height: '40px',
                paddingLeft: '20px',
                paddingRight: '20px',
                fontSize: '14px',
                lineHeight: '160%',
                letterSpacing: '0',
              }}
            >
              품절 처리
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function CategorySection({
  category,
  items,
  editingIdx,
  onEditPrice,
  onCloseEdit,
  onConfirmEdit,
  onSoldOut,
  onResume,
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 bg-white rounded-[10px] px-3 h-12 w-full text-left"
      >
        <ChevronIcon open={open} />
        <span
          className="font-semibold text-[#101010]"
          style={{ fontSize: '16px', lineHeight: '24px', letterSpacing: '-0.5px' }}
        >
          {category.label}
        </span>
        <span
          className="font-medium text-[#7F7F7F]"
          style={{ fontSize: '12px', lineHeight: '18px', letterSpacing: '0px' }}
        >
          ({items.length})
        </span>
      </button>
      <div
        className="grid transition-all duration-300 ease-in-out"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-3 pb-1">
            {items.map((item, idx) => {
              const isEditing = editingIdx === idx;
              return (
                <div key={idx} className="flex flex-col">
                  <div
                    className="grid transition-all duration-300 ease-in-out"
                    style={{ gridTemplateRows: isEditing ? '1fr' : '0fr' }}
                  >
                    <div className="overflow-hidden">
                      <PriceEditPanel
                        item={item}
                        onClose={onCloseEdit}
                        onConfirm={(price) => onConfirmEdit(item, price)}
                      />
                    </div>
                  </div>
                  <div
                    className="grid transition-all duration-300 ease-in-out"
                    style={{ gridTemplateRows: isEditing ? '0fr' : '1fr' }}
                  >
                    <div className="overflow-hidden">
                      <MenuItemCard
                        item={item}
                        onEditPrice={() => onEditPrice(idx)}
                        onSoldOut={() => onSoldOut(item)}
                        onResume={() => onResume(item)}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MenuManagement() {
  const [menus, setMenus] = useState([]);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    getBoothOrderMenus()
      .then((res) => {
        const data = res.data;
        const all = [
          ...(data.main ?? []).map((m) => ({
            ...m,
            category: 'main',
            image: m.iconImageUrl ?? Noodle,
          })),
          ...(data.side ?? []).map((m) => ({
            ...m,
            category: 'side',
            image: m.iconImageUrl ?? Noodle,
          })),
          ...(data.drink ?? []).map((m) => ({
            ...m,
            category: 'drink',
            image: m.iconImageUrl ?? Noodle,
          })),
        ];
        setMenus(all);
      })
      .catch((e) => console.error('메뉴 조회 실패:', e?.response ?? e));
  }, []);
  const [soldOutTarget, setSoldOutTarget] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastShow, setToastShow] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleEditPrice = (category, idx) => {
    setEditing((prev) =>
      prev?.category === category && prev?.idx === idx ? null : { category, idx }
    );
  };

  const handleCloseEdit = () => setEditing(null);

  const handleConfirmEdit = async (item, newPrice) => {
    if (item.menuId != null) {
      try {
        await updateMenuPrice(item.menuId, newPrice);
      } catch (e) {
        console.error('가격 수정 실패:', e?.response ?? e);
      }
    }
    setMenus((prev) => prev.map((m) => (m === item ? { ...m, price: newPrice } : m)));
    setEditing(null);
  };

  const handleConfirmSoldOut = async () => {
    if (soldOutTarget.menuId != null) {
      try {
        await updateMenuSoldOut(soldOutTarget.menuId, true);
      } catch (e) {
        console.error('품절 처리 실패:', e?.response ?? e);
      }
    }
    setMenus((prev) => prev.map((m) => (m === soldOutTarget ? { ...m, soldOut: true } : m)));
    setSoldOutTarget(null);
    showToast('상품이 품절 처리되었어요.');
  };

  const showToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => setToastShow(true), 10);
    setTimeout(() => setToastShow(false), 1000);
    setTimeout(() => setToastVisible(false), 1400);
  };

  const handleResume = async (item) => {
    if (item.menuId != null) {
      try {
        await updateMenuSoldOut(item.menuId, false);
      } catch (e) {
        console.error('판매 재개 실패:', e?.response ?? e);
      }
    }
    setMenus((prev) => prev.map((m) => (m === item ? { ...m, soldOut: false } : m)));
    showToast('상품이 추가되었어요.');
  };

  return (
    <div className="flex flex-col gap-2 p-4 bg-[#F5F5F5] min-h-full">
      {CATEGORIES.map((category) => {
        const items = menus.filter((m) => m.category === category.key);
        return (
          <CategorySection
            key={category.key}
            category={category}
            items={items}
            editingIdx={editing?.category === category.key ? editing.idx : null}
            onEditPrice={(idx) => handleEditPrice(category.key, idx)}
            onCloseEdit={handleCloseEdit}
            onConfirmEdit={handleConfirmEdit}
            onSoldOut={(item) => setSoldOutTarget(item)}
            onResume={handleResume}
          />
        );
      })}

      {toastVisible && (
        <div
          className="fixed z-50 bg-white rounded-full flex items-center justify-center shadow-md"
          style={{
            bottom: '104px',
            left: '50%',
            width: '244px',
            height: '44px',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
            opacity: toastShow ? 1 : 0,
            transform: `translateX(-50%) translateY(${toastShow ? '0px' : '12px'})`,
          }}
        >
          <span className="text-sm font-medium text-[#252525]">{toastMessage}</span>
        </div>
      )}

      <BottomSheet
        open={!!soldOutTarget}
        onOpenChange={(open) => {
          if (!open) setSoldOutTarget(null);
        }}
      >
        <div
          className="flex flex-1 flex-col items-center px-5 w-full"
          style={{ paddingTop: '60px', gap: '28px' }}
        >
          <WarningIcon style={{ width: '36px', height: '36px' }} />
          <div className="flex flex-col items-center gap-0.5">
            <p
              className="font-semibold text-[#1A1A1A] [font-family:Pretendard]"
              style={{ fontSize: '20px', lineHeight: '28px', letterSpacing: '-0.01em' }}
            >
              이 메뉴를 품절 처리할까요?
            </p>
            <p
              className="font-semibold text-[#FE5F54] [font-family:Pretendard]"
              style={{ fontSize: '20px', lineHeight: '28px', letterSpacing: '-0.01em' }}
            >
              손님에게 품절로 표시돼요
            </p>
          </div>
        </div>
        <div className="w-full px-5 pb-6">
          <button
            onClick={handleConfirmSoldOut}
            className="w-full rounded-lg bg-[#FE5F54] text-white font-semibold flex items-center justify-center"
            style={{ height: '52px', fontSize: '16px', lineHeight: '160%', letterSpacing: '0%' }}
          >
            변경
          </button>
        </div>
      </BottomSheet>
    </div>
  );
}
