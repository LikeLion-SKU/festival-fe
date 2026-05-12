import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';

import { getAllBooth } from '@/api/booth';
import backgroundImg from '@/assets/images/about-fire2.svg';
import BoothPlaceholderImg from '@/assets/images/booth_image.svg';
import BoothCard from '@/components/Booth/BoothCard';
import BoothMap from '@/components/Booth/BoothMap';
import PageHeader from '@/components/common/PageHeader';
import SearchInput from '@/components/common/SearchInput';
import { BUILDING_ID_TO_API_LOCATION, formatBoothLocationKo } from '@/constants/boothBuildingData';
import { BUILDINGS } from '@/constants/mainDummyData';

const BOOTH_MAP_SCROLL_Y_STORAGE_KEY = 'booth-map-scroll-y';
const BOOTH_MAP_BUILDING_STORAGE_KEY = 'booth-map-active-building';

function normalizeBoothList(payload) {
  if (payload == null) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.content)) return payload.content;
  if (Array.isArray(payload.booths)) return payload.booths;
  return [];
}

function sortBoothRowsByDepartmentKo(rows) {
  return [...rows].sort((a, b) =>
    String(a.departmentName ?? '').localeCompare(String(b.departmentName ?? ''), 'ko', {
      sensitivity: 'base',
    })
  );
}

/** GET /booths 응답의 boothNumbers 배열을 카드 라벨용으로 바꿈 */
function normalizeBoothNumbersFromApi(item) {
  const raw = item?.boothNumbers;
  if (!Array.isArray(raw) || raw.length === 0) return undefined;
  const cleaned = raw.map((n) => String(n).trim()).filter((s) => s.length > 0);
  return cleaned.length > 0 ? cleaned : undefined;
}

const BUILDING_BUTTON_ORDER = ['hyein', 'eunju1', 'eunju2', 'cheongun', 'daeil'];

/*헤더 + 검색바 + 부스 안내 지도 + 하단 카드 (스크롤 페이지로 수정 완) */
export default function BoothMapPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const persistedUiState = location.state?.boothMapUiState;
  const hasPendingScrollRestore =
    typeof window !== 'undefined' && sessionStorage.getItem(BOOTH_MAP_SCROLL_Y_STORAGE_KEY) != null;
  const [activeBuildingId, setActiveBuildingId] = useState(() => {
    if (typeof window !== 'undefined') {
      const scrollRaw = sessionStorage.getItem(BOOTH_MAP_SCROLL_Y_STORAGE_KEY);
      if (scrollRaw != null) {
        const savedBuilding = sessionStorage.getItem(BOOTH_MAP_BUILDING_STORAGE_KEY);
        if (savedBuilding != null) return savedBuilding;
      }
    }
    return persistedUiState?.activeBuildingId ?? null;
  });
  const [search, setSearch] = useState(persistedUiState?.search ?? '');
  const [searchMode, setSearchMode] = useState(persistedUiState?.searchMode ?? false);
  const [isHyeinFlashing, setIsHyeinFlashing] = useState(false);
  const [cardsAnimateEnabled, setCardsAnimateEnabled] = useState(() => !hasPendingScrollRestore);
  const [cardsAnimVersion, setCardsAnimVersion] = useState(() => (hasPendingScrollRestore ? 0 : 1));

  /* 스크롤 후 특정 카드 진입 후 뒤로 가기 버튼 클릭 시 이전 위치 복원 */
  useEffect(() => {
    const raw = sessionStorage.getItem(BOOTH_MAP_SCROLL_Y_STORAGE_KEY);
    if (raw == null) {
      sessionStorage.removeItem(BOOTH_MAP_BUILDING_STORAGE_KEY);
      return;
    }
    const y = Number(raw);
    if (!Number.isFinite(y)) {
      sessionStorage.removeItem(BOOTH_MAP_SCROLL_Y_STORAGE_KEY);
      sessionStorage.removeItem(BOOTH_MAP_BUILDING_STORAGE_KEY);
      return;
    }

    const restore = () => {
      window.scrollTo({ top: Math.max(0, y), behavior: 'auto' });
      sessionStorage.removeItem(BOOTH_MAP_SCROLL_Y_STORAGE_KEY);
      sessionStorage.removeItem(BOOTH_MAP_BUILDING_STORAGE_KEY);
    };

    requestAnimationFrame(restore);
  }, []);

  useEffect(() => {
    const hasPendingScrollRestore = sessionStorage.getItem(BOOTH_MAP_SCROLL_Y_STORAGE_KEY) != null;
    if (hasPendingScrollRestore) return;
    const t1 = setTimeout(() => setIsHyeinFlashing(true), 500);
    const t2 = setTimeout(() => setIsHyeinFlashing(false), 2900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // 뒤로 돌아왔을 때 검색/선택 상태 유지
  useEffect(() => {
    navigate(location.pathname, {
      replace: true,
      preventScrollReset: true,
      state: {
        boothMapUiState: {
          activeBuildingId,
          search,
          searchMode,
        },
      },
    });
  }, [activeBuildingId, navigate, location.pathname, search, searchMode]);

  const orderedBuildingButtons = useMemo(() => {
    const map = new Map(BUILDINGS.map((item) => [item.id, item]));
    return BUILDING_BUTTON_ORDER.map((id) => map.get(id)).filter(Boolean);
  }, []);

  const apiLocation =
    searchMode || !activeBuildingId ? undefined : BUILDING_ID_TO_API_LOCATION[activeBuildingId];

  const {
    data: boothListPayload,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['boothList', apiLocation ?? 'all'],
    queryFn: () => getAllBooth(apiLocation),
  });

  const boothRows = useMemo(() => {
    const raw = normalizeBoothList(boothListPayload);
    const mapped = raw.map((item, index) => ({
      id: String(item.boothId ?? `idx-${index}`),
      boothId: item.boothId,
      thumbnailUrl: item.thumbnailUrl,
      locationCode: String(item.location ?? '').trim(),
      location: formatBoothLocationKo(item.location),
      locationDescription: item.locationDescription ?? '',
      departmentName: item.departmentName ?? '',
      boothNumbers: normalizeBoothNumbersFromApi(item),
    }));
    return sortBoothRowsByDepartmentKo(mapped);
  }, [boothListPayload]);

  const searchQ = search.trim().toLowerCase();

  const sheetBoothRows = useMemo(() => {
    if (!searchQ) return boothRows;
    return boothRows.filter((r) => {
      const matchDept = r.departmentName.toLowerCase().includes(searchQ);
      const matchLoc =
        r.location.toLowerCase().includes(searchQ) ||
        r.locationCode.toLowerCase().includes(searchQ) ||
        r.locationDescription.toLowerCase().includes(searchQ);
      const matchNum =
        Array.isArray(r.boothNumbers) &&
        r.boothNumbers.some((n) => String(n).toLowerCase().includes(searchQ));
      return matchDept || matchLoc || matchNum;
    });
  }, [boothRows, searchQ]);

  /** 검색 오버레이: 건물 탭 무관하게 전체 부스 중 검색 */
  const searchOverlayRows = useMemo(() => {
    if (!searchQ) return [];
    return boothRows.filter((r) => {
      const matchDept = r.departmentName.toLowerCase().includes(searchQ);
      const matchLoc =
        r.location.toLowerCase().includes(searchQ) ||
        r.locationCode.toLowerCase().includes(searchQ) ||
        r.locationDescription.toLowerCase().includes(searchQ);
      const matchNum =
        Array.isArray(r.boothNumbers) &&
        r.boothNumbers.some((n) => String(n).toLowerCase().includes(searchQ));
      return matchDept || matchLoc || matchNum;
    });
  }, [boothRows, searchQ]);

  const triggerCardsAnimation = () => {
    setCardsAnimateEnabled(true);
    setCardsAnimVersion((v) => v + 1);
  };
  const handleBoothCardNavigate = () => {
    sessionStorage.setItem(BOOTH_MAP_SCROLL_Y_STORAGE_KEY, String(window.scrollY || 0));
    if (activeBuildingId != null) {
      sessionStorage.setItem(BOOTH_MAP_BUILDING_STORAGE_KEY, activeBuildingId);
    } else {
      sessionStorage.removeItem(BOOTH_MAP_BUILDING_STORAGE_KEY);
    }
    setCardsAnimateEnabled(false);
  };

  /** about-fire2 배경을 section background로 두고
   *  viewport 고정 레이어로 분리해 콘텐츠 변화의 영향을 받지 않도록 함함*/
  const fixedBgStyle = useMemo(
    () => ({
      backgroundImage: `url(${backgroundImg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      transform: 'translateZ(0)',
      backfaceVisibility: 'hidden',
      willChange: 'transform',
    }),
    []
  );

  return (
    <section
      className="relative min-h-dvh overflow-x-hidden bg-[#121212] text-white"
      style={{ isolation: 'isolate' }}
    >
      {!searchMode && (
        <div
          className="pointer-events-none fixed inset-0 z-0 bg-[#121212]"
          style={fixedBgStyle}
          aria-hidden
        />
      )}
      <div className="relative z-[1] flex flex-col">
        <style>{`
        @keyframes hyein-panel-flash {
          0%   { background-color: #121212; }
          50%  { background-color: #8A2822; }
          100% { background-color: #121212; }
        }
        @keyframes hyein-btn-flash {
          0%   { opacity: 0; }
          50%  { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes booth-card-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        <PageHeader
          title="부스 안내"
          to="/"
          onBack={() => {
            if (searchMode) {
              setSearchMode(false);
              setSearch('');
              setActiveBuildingId(null);
              triggerCardsAnimation();
              return;
            }
            navigate('/');
          }}
        />

        <div className="mx-auto flex w-full max-w-[450px] flex-col px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] pt-[max(5rem,calc(env(safe-area-inset-top)+2.75rem))]">
          <div className="mt-5 shrink-0 px-1">
            <SearchInput
              placeholder="학과명으로 부스 검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => {
                if (!searchMode) {
                  setSearchMode(true);
                  triggerCardsAnimation();
                }
              }}
            />
          </div>

          {!searchMode && (
            <>
              <div className="mt-5 w-full shrink-0">
                <BoothMap
                  activeBuildingId={activeBuildingId}
                  isHyeinFlashing={isHyeinFlashing}
                  onSelectBuilding={(id) =>
                    setActiveBuildingId((prev) => (prev === id ? null : id))
                  }
                  onMapBackdropClick={() => setActiveBuildingId(null)}
                />
              </div>

              <div className="mx-1 mt-15 min-w-0">
                <div className="flex w-full min-w-0 flex-nowrap items-stretch gap-1.5 sm:gap-2">
                  {orderedBuildingButtons.map((item) => {
                    const active = item.id === activeBuildingId;
                    const flashing = item.id === 'hyein' && isHyeinFlashing && !active;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        title={item.label}
                        onClick={() => {
                          setActiveBuildingId((prev) => (prev === item.id ? null : item.id));
                          triggerCardsAnimation();
                        }}
                        onMouseUp={(e) => e.currentTarget.blur()}
                        onTouchEnd={(e) => e.currentTarget.blur()}
                        className={clsx(
                          'relative overflow-hidden flex h-8 min-h-8 min-w-0 flex-[1_1_60px] items-center justify-center px-1 text-[clamp(12px,3vw,14px)] font-medium leading-none tracking-[-0.02em] [font-family:Pretendard] outline-none focus:outline-none focus-visible:outline-none',
                          active
                            ? 'bg-[rgba(196,58,49,0.6)] text-[#FFDDDB]'
                            : 'bg-[#353535] text-[#a0a0a0]'
                        )}
                        style={{
                          WebkitTapHighlightColor: 'transparent',
                          appearance: 'none',
                          boxShadow: active ? 'inset 0 0 0 1px #C43A31' : 'inset 0 0 0 1px #595959',
                        }}
                      >
                        {flashing && (
                          <span
                            className="pointer-events-none absolute inset-0"
                            style={{
                              backgroundColor: '#8A2822',
                              animation: 'hyein-btn-flash 1.2s ease-in 2 forwards',
                            }}
                          />
                        )}
                        <span className="relative z-10 block max-w-full truncate text-center">
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          <div className="mx-1 mt-7 min-w-0 pb-4">
            {searchMode && !search.trim() ? (
              <div className="min-h-[min(50vh,24rem)]" aria-hidden />
            ) : isPending ? (
              <p className="py-8 text-center text-sm text-white/50 [font-family:Pretendard]">
                불러오는 중…
              </p>
            ) : isError ? (
              <p className="py-8 text-center text-sm text-white/50 [font-family:Pretendard]">
                부스 목록을 불러오지 못했습니다.
              </p>
            ) : (searchMode ? searchOverlayRows : sheetBoothRows).length === 0 ? (
              <p className="py-8 text-center text-sm text-white/50 [font-family:Pretendard]">
                {search.trim() ? '검색 결과가 없습니다.' : '등록된 부스 목록이 없습니다.'}
              </p>
            ) : searchMode ? (
              <ul className="flex flex-col gap-3 px-1 pb-4">
                {searchOverlayRows.map((row, i) => (
                  <li
                    key={cardsAnimateEnabled ? `${cardsAnimVersion}-${row.id}` : row.id}
                    className="min-w-0"
                    style={
                      cardsAnimateEnabled
                        ? {
                            opacity: 0,
                            animation: 'booth-card-in 0.7s ease forwards',
                            animationDelay: `${i * 70}ms`,
                          }
                        : undefined
                    }
                  >
                    <BoothCard
                      variant="search"
                      to={row.boothId != null ? `/order/${row.boothId}` : undefined}
                      onClick={handleBoothCardNavigate}
                      imageSrc={row.thumbnailUrl || BoothPlaceholderImg}
                      location={row.location}
                      departmentName={row.departmentName}
                      boothNumbers={row.boothNumbers}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="grid min-w-0 grid-cols-2 gap-x-3 gap-y-4">
                {sheetBoothRows.map((row, i) => (
                  <div
                    key={cardsAnimateEnabled ? `${cardsAnimVersion}-${row.id}` : row.id}
                    style={
                      cardsAnimateEnabled
                        ? {
                            opacity: 0,
                            animation: 'booth-card-in 0.7s ease forwards',
                            animationDelay: `${i * 70}ms`,
                          }
                        : undefined
                    }
                  >
                    <BoothCard
                      variant="sheet"
                      to={row.boothId != null ? `/order/${row.boothId}` : undefined}
                      onClick={handleBoothCardNavigate}
                      imageSrc={row.thumbnailUrl || BoothPlaceholderImg}
                      location={row.location}
                      departmentName={row.departmentName}
                      boothNumbers={row.boothNumbers}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
