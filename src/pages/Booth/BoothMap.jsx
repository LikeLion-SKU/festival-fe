import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import clsx from 'clsx';

import backgroundImg from '@/assets/images/about-fire2.svg';
import BoothPlaceholderImg from '@/assets/images/booth_image.svg';
import BoothCard from '@/components/Booth/BoothCard';
import BoothMap from '@/components/Booth/BoothMap';
import PageHeader from '@/components/common/PageHeader';
import SearchInput from '@/components/common/SearchInput';
import {
  getAllBoothRowsInMapTabOrder,
  getSortedBoothRowsByBuilding,
} from '@/constants/boothBuildingData';
import { BUILDINGS } from '@/constants/mainDummyData';

const BUILDING_BUTTON_ORDER = ['hyein', 'eunju1', 'eunju2', 'cheongun', 'daeil'];

/*헤더 + 검색바 + 부스 안내 지도 + 하단 모달창 */
export default function BoothMapPage() {
  const navigate = useNavigate();
  const [activeBuildingId, setActiveBuildingId] = useState(null);
  const [search, setSearch] = useState('');
  const [searchMode, setSearchMode] = useState(false);
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const touchStartY = useRef(0);

  const orderedBuildingButtons = useMemo(() => {
    const map = new Map(BUILDINGS.map((item) => [item.id, item]));
    return BUILDING_BUTTON_ORDER.map((id) => map.get(id)).filter(Boolean);
  }, []);

  const modalBoothRows = useMemo(() => {
    let rows = activeBuildingId
      ? getSortedBoothRowsByBuilding(activeBuildingId)
      : getAllBoothRowsInMapTabOrder();
    const q = search.trim().toLowerCase();
    if (q) {
      rows = rows.filter(
        (r) => r.department.toLowerCase().includes(q) || r.locationDetail.toLowerCase().includes(q)
      );
    }
    return rows;
  }, [activeBuildingId, search]);

  /** 검색 오버레이: 건물 탭 무관하게 전체 부스 중 검색 */
  const searchOverlayRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return getAllBoothRowsInMapTabOrder().filter(
      (r) => r.department.toLowerCase().includes(q) || r.locationDetail.toLowerCase().includes(q)
    );
  }, [search]);

  const sectionBgStyle = searchMode
    ? { backgroundColor: '#121212' }
    : {
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#121212',
      };

  return (
    <section
      className={clsx(
        'relative min-h-dvh overflow-hidden text-white',
        searchMode && 'flex flex-col'
      )}
      style={sectionBgStyle}
    >
      <div
        className={clsx(
          'mx-auto flex w-full max-w-[450px] flex-col px-4 pt-[max(3.25rem,calc(env(safe-area-inset-top)+0.5rem))]',
          searchMode
            ? 'min-h-0 flex-1 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]'
            : 'pb-[11.5rem]'
        )}
      >
        <div className="relative min-h-[2.75rem] shrink-0">
          <PageHeader
            title="부스 안내"
            to="/"
            fixed={false}
            top="0rem"
            onBack={() => {
              if (searchMode) {
                setSearchMode(false);
                setSearch('');
                setActiveBuildingId(null);
                return;
              }
              navigate('/');
            }}
          />
        </div>

        <div className="mt-5 shrink-0 px-1">
          <SearchInput
            placeholder="학과명으로 부스 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setSearchMode(true)}
          />
        </div>

        {!searchMode && (
          <div className="mt-5 w-full shrink-0">
            <BoothMap
              activeBuildingId={activeBuildingId}
              onSelectBuilding={(id) => setActiveBuildingId((prev) => (prev === id ? null : id))}
              onMapBackdropClick={() => setActiveBuildingId(null)}
            />
          </div>
        )}

        {searchMode && (
          <div className="mt-5 flex min-h-0 flex-1 flex-col overflow-hidden">
            <div
              className="min-h-0 flex-1 overflow-y-auto [-webkit-overflow-scrolling:touch] pb-2"
              onMouseDown={(e) => e.preventDefault()}
            >
              {!search.trim() ? (
                <div className="min-h-[min(50vh,24rem)]" aria-hidden />
              ) : searchOverlayRows.length === 0 ? (
                <p className="py-12 text-center text-sm text-white/50 [font-family:Pretendard]">
                  검색 결과가 없습니다.
                </p>
              ) : (
                <ul className="flex flex-col gap-3 px-1 pb-4">
                  {searchOverlayRows.map((row) => (
                    <li key={row.id} className="min-w-0">
                      <BoothCard
                        variant="search"
                        imageSrc={BoothPlaceholderImg}
                        locationDetail={row.locationDetail}
                        departmentName={row.department}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>

      <div
        className={clsx(
          'pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center transition-opacity duration-200',
          searchMode && 'invisible opacity-0'
        )}
        aria-hidden={searchMode}
      >
        <div
          className={`pointer-events-auto flex h-[28rem] w-full min-w-0 max-w-[450px] flex-col rounded-t-[2.875rem] border border-white/15 bg-gradient-to-b from-[rgba(26,26,26,0.92)] to-[rgba(16,16,16,0.96)] pb-[calc(1rem+env(safe-area-inset-bottom,0px))] pt-8 transition-transform duration-300 ${
            sheetExpanded ? 'translate-y-[0%]' : 'translate-y-[70%]'
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
          <div className="mx-[27px] min-w-0 shrink-0">
            <div className="flex w-full min-w-0 flex-nowrap items-stretch gap-1.5 sm:gap-2">
              {orderedBuildingButtons.map((item) => {
                const active = item.id === activeBuildingId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    title={item.label}
                    onClick={() =>
                      setActiveBuildingId((prev) => (prev === item.id ? null : item.id))
                    }
                    className={clsx(
                      'flex h-8 min-h-8 min-w-0 flex-[1_1_60px] items-center justify-center border border-solid px-1 text-[clamp(9px,2.6vw,12px)] font-medium leading-none tracking-[-0.02em] [font-family:Pretendard]',
                      active
                        ? 'border-[#C43A31] bg-[rgba(196,58,49,0.6)] text-[#FFDDDB]'
                        : 'border-[#595959] bg-[#353535] text-[#a0a0a0]'
                    )}
                  >
                    <span className="block max-w-full truncate text-center">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mx-[27px] mt-5 min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden pb-2 [-webkit-overflow-scrolling:touch]">
            {modalBoothRows.length === 0 ? (
              <p className="py-8 text-center text-sm text-white/50 [font-family:Pretendard]">
                {search.trim() ? '검색 결과가 없습니다.' : '등록된 부스 목록이 없습니다.'}
              </p>
            ) : (
              <div className="grid min-w-0 grid-cols-2 gap-x-3 gap-y-4">
                {modalBoothRows.map((row) => (
                  <BoothCard
                    key={row.id}
                    imageSrc={BoothPlaceholderImg}
                    locationDetail={row.locationDetail}
                    departmentName={row.department}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
