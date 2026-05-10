import { useLayoutEffect, useMemo, useRef, useState } from 'react';

import AedIcon from '@/assets/icons/aed.svg?react';
import boothMapBg from '@/assets/images/booth-map-bg.svg';
import Cheongun from '@/components/Booth/Cheongun';
import Daeil from '@/components/Booth/Daeil';
import Eunju1 from '@/components/Booth/Eunju1';
import Eunju2 from '@/components/Booth/Eunju2';
import Hyein from '@/components/Booth/Hyein';
import Pokpung from '@/components/Booth/Pokpung';

const BOOTH_MAP_DESIGN_WIDTH = 390;
const BOOTH_MAP_DESIGN_HEIGHT = (BOOTH_MAP_DESIGN_WIDTH * 360) / 335;

/**
 * 부스 지도 영역
 * @param {{ activeBuildingId?: string; onSelectBuilding?: (id: string) => void; onMapBackdropClick?: () => void }} props
 */
export default function BoothMap({
  activeBuildingId,
  isHyeinFlashing = false,
  onSelectBuilding,
  onMapBackdropClick,
}) {
  const containerRef = useRef(null);
  const [zoom, setZoom] = useState(1);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const w = el.getBoundingClientRect().width;
      setZoom(w > 0 ? w / BOOTH_MAP_DESIGN_WIDTH : 1);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scaleLayerStyle = {
    width: BOOTH_MAP_DESIGN_WIDTH,
    height: BOOTH_MAP_DESIGN_HEIGHT,
    zoom,
    transform: 'translateZ(0)',
    backfaceVisibility: 'hidden',
  };

  /** 건물 활성/비활성 토글 시 인접 레이어(필터·합성) 변화로 배경이 1~2px 흔들리거나
   *  가장자리에 먼지/회색 실선처럼 보이는 안티앨리어싱 잔상이 나타나는 것을 방지하기 위해
   *  자체 컴포지터 레이어로 승격하고 스타일 객체를 메모이제이션한다. */
  const bgStyle = useMemo(
    () => ({
      backgroundImage: `url(${boothMapBg})`,
      backgroundPosition: 'center calc(50%)',
      transform: 'translateZ(0)',
      backfaceVisibility: 'hidden',
      willChange: 'transform',
    }),
    []
  );

  return (
    <div
      ref={containerRef}
      className="relative isolate aspect-[335/360] w-full overscroll-contain bg-transparent [touch-action:pan-y]"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-contain bg-no-repeat"
        style={bgStyle}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 z-10 overflow-visible">
        <div className="absolute left-0 top-0 origin-top-left" style={scaleLayerStyle}>
          <div className="relative h-full w-full">
            <div
              className="pointer-events-none absolute left-[93%] top-[100%] z-[5] flex -translate-x-1/2 -translate-y-1/2 items-center gap-1"
              aria-hidden
            >
              <AedIcon width={20} height={20} className="shrink-0 [&_path]:fill-[#C43A31]" />
              <span className="-translate-y-[1px] whitespace-nowrap text-[0.85rem] font-semibold leading-none text-[#C43A31] [font-family:Pretendard]">
                AED
              </span>
            </div>
            <div
              className="pointer-events-none absolute left-[54%] top-[49%] z-[5] select-none"
              style={{
                transform: 'translate(-10%, -200%) rotate(97deg)',
              }}
              aria-hidden
            >
              <span className="block whitespace-nowrap text-[12px] font-semibold italic leading-none tracking-[0.02em] text-[#391412] [font-family:Pretendard]">
                SEOKYEONG UNIVERSITY
              </span>
            </div>
            <div className="absolute inset-0 z-10 translate-x-[14px]">
              <button
                type="button"
                tabIndex={-1}
                aria-label="건물 선택 해제"
                className="absolute inset-0 z-[1] cursor-default bg-transparent p-0"
                onClick={() => onMapBackdropClick?.()}
              />
              <div className="pointer-events-auto absolute left-[50%] top-[5%] z-[2] -translate-x-1/2">
                <Hyein
                  active={activeBuildingId === 'hyein'}
                  isFlashing={isHyeinFlashing}
                  hasBuildingSelection={activeBuildingId != null}
                  onClick={() => onSelectBuilding?.('hyein')}
                />
              </div>
              <div className="pointer-events-auto absolute left-[-8.5%] top-[21.5%] z-[2]">
                <Cheongun
                  active={activeBuildingId === 'cheongun'}
                  hasBuildingSelection={activeBuildingId != null}
                  onClick={() => onSelectBuilding?.('cheongun')}
                />
              </div>
              <div className="pointer-events-auto absolute left-[21%] top-[39%] z-[2]">
                <Eunju1
                  active={activeBuildingId === 'eunju1'}
                  hasBuildingSelection={activeBuildingId != null}
                  onClick={() => onSelectBuilding?.('eunju1')}
                />
              </div>
              <div className="pointer-events-auto absolute left-[58%] top-[36%] z-[2]">
                <Eunju2
                  active={activeBuildingId === 'eunju2'}
                  hasBuildingSelection={activeBuildingId != null}
                  onClick={() => onSelectBuilding?.('eunju2')}
                />
              </div>
              <div className="pointer-events-auto absolute left-[-21%] top-[64%] z-[2]">
                <Daeil
                  active={activeBuildingId === 'daeil'}
                  hasBuildingSelection={activeBuildingId != null}
                  onClick={() => onSelectBuilding?.('daeil')}
                />
              </div>
              <div className="pointer-events-none absolute left-[11.5%] top-[82%]">
                <Pokpung />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
