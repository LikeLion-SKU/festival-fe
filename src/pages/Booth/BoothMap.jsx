import { useMemo, useRef, useState } from 'react';

import BoothMap from '@/components/Booth/BoothMap';
import PageHeader from '@/components/common/PageHeader';
import SearchInput from '@/components/common/SearchInput';
import { BUILDINGS } from '@/constants/mainDummyData';

const BUILDING_BUTTON_ORDER = ['hyein', 'eunju1', 'eunju2', 'cheongun', 'daeil'];

export default function BoothMapPage() {
  const [activeBuildingId, setActiveBuildingId] = useState(BUILDINGS[0].id);
  const [search, setSearch] = useState('');
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const touchStartY = useRef(0);

  const orderedBuildingButtons = useMemo(() => {
    const map = new Map(BUILDINGS.map((item) => [item.id, item]));
    return BUILDING_BUTTON_ORDER.map((id) => map.get(id)).filter(Boolean);
  }, []);

  return (
    <section className="relative min-h-dvh overflow-hidden bg-[#121212] text-white">
      <div className="mx-auto flex w-full max-w-[450px] flex-col px-4 pb-[8.5rem] pt-[max(3.25rem,calc(env(safe-area-inset-top)+0.5rem))]">
        <div className="relative min-h-[2.75rem]">
          <PageHeader title="부스 안내" to="/" fixed={false} top="0rem" />
        </div>

        <div className="mt-5 px-1">
          <SearchInput
            placeholder="학과명으로 부스 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="mt-5 w-full">
          <BoothMap activeBuildingId={activeBuildingId} onSelectBuilding={setActiveBuildingId} />
        </div>
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center">
        <div
          className={`pointer-events-auto h-[24rem] w-full max-w-[450px] rounded-t-[1.25rem] border border-white/15 bg-[#161616] px-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] pt-2 transition-transform duration-300 ${
            sheetExpanded ? 'translate-y-[0%]' : 'translate-y-[40%]'
          }`}
          onTouchStart={(e) => {
            touchStartY.current = e.touches[0].clientY;
          }}
          onTouchEnd={(e) => {
            const deltaY = e.changedTouches[0].clientY - touchStartY.current;
            if (deltaY < -35) setSheetExpanded(true);
            if (deltaY > 35) setSheetExpanded(false);
          }}
        >
          <div className="mt-2 grid w-full grid-cols-5 gap-2">
            {orderedBuildingButtons.map((item) => {
              const active = item.id === activeBuildingId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveBuildingId(item.id)}
                  className={`h-8 w-full min-w-0 border text-[0.625rem] font-semibold [font-family:Pretendard] ${
                    active
                      ? 'border-[#C43A31] bg-[rgba(196,58,49,0.6)] text-white'
                      : 'border-white/20 bg-[rgba(255,255,255,0.06)] text-white/75'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
          <p className="mt-1 text-xs font-semibold [font-family:Pretendard]">
            {BUILDINGS.find((item) => item.id === activeBuildingId)?.label}
          </p>
        </div>
      </div>
    </section>
  );
}
