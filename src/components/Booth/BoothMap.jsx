import { useLayoutEffect, useRef, useState } from 'react';

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
 * @param {{ activeBuildingId?: string; onSelectBuilding?: (id: string) => void }} props
 */
export default function BoothMap({ activeBuildingId, onSelectBuilding }) {
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
  };

  return (
    <div ref={containerRef} className="relative aspect-[335/360] w-full bg-transparent">
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-contain bg-no-repeat"
        style={{
          backgroundImage: `url(${boothMapBg})`,
          backgroundPosition: 'center calc(50%)',
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 z-10 overflow-visible">
        <div className="absolute left-0 top-0 origin-top-left" style={scaleLayerStyle}>
          <div className="relative h-full w-full">
            <div
              className="pointer-events-none absolute left-[91%] top-[85%] z-[5] flex -translate-x-1/2 -translate-y-1/2 items-center gap-1"
              aria-hidden
            >
              <AedIcon width={25} height={25} className="shrink-0 [&_path]:fill-[#C43A31]" />
              <span className="-translate-y-[1px] whitespace-nowrap text-[1.05rem] font-semibold leading-none text-[#C43A31] [font-family:Pretendard]">
                AED
              </span>
            </div>
            <div className="absolute inset-0 z-10 translate-x-[14px]">
              <div className="pointer-events-auto absolute left-1/2 top-[8%] -translate-x-1/2">
                <Hyein
                  active={activeBuildingId === 'hyein'}
                  hasBuildingSelection={activeBuildingId != null}
                  onClick={() => onSelectBuilding?.('hyein')}
                />
              </div>
              <div className="pointer-events-auto absolute left-[7%] top-[17%]">
                <Cheongun
                  active={activeBuildingId === 'cheongun'}
                  hasBuildingSelection={activeBuildingId != null}
                  onClick={() => onSelectBuilding?.('cheongun')}
                />
              </div>
              <div className="pointer-events-auto absolute left-[24%] top-[32%]">
                <Eunju1
                  active={activeBuildingId === 'eunju1'}
                  hasBuildingSelection={activeBuildingId != null}
                  onClick={() => onSelectBuilding?.('eunju1')}
                />
              </div>
              <div className="pointer-events-auto absolute left-[57%] top-[31%]">
                <Eunju2
                  active={activeBuildingId === 'eunju2'}
                  hasBuildingSelection={activeBuildingId != null}
                  onClick={() => onSelectBuilding?.('eunju2')}
                />
              </div>
              <div className="pointer-events-auto absolute left-[-7%] top-[49%]">
                <Daeil
                  active={activeBuildingId === 'daeil'}
                  hasBuildingSelection={activeBuildingId != null}
                  onClick={() => onSelectBuilding?.('daeil')}
                />
              </div>
              <div className="pointer-events-none absolute left-[19%] top-[68%]">
                <Pokpung />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
