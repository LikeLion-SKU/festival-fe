import Daeil from '@/components/Booth/Daeil';
import Eunju1 from '@/components/Booth/Eunju1';
import Eunju2 from '@/components/Booth/Eunju2';
import Hyein from '@/components/Booth/Hyein';

/**
 * 부스 지도 영역
 * @param {{ activeBuildingId?: string; onSelectBuilding?: (id: string) => void }} props
 */
export default function BoothMap({ activeBuildingId, onSelectBuilding }) {
  return (
    <div className="relative aspect-[335/360] w-full bg-[#121212]">
      <div className="pointer-events-auto absolute left-1/2 top-[8%] z-10 -translate-x-1/2">
        <Hyein active={activeBuildingId === 'hyein'} onClick={() => onSelectBuilding?.('hyein')} />
      </div>
      <div className="pointer-events-auto absolute left-[18%] top-[34%] z-10">
        <Eunju1
          active={activeBuildingId === 'eunju1'}
          onClick={() => onSelectBuilding?.('eunju1')}
        />
      </div>
      <div className="pointer-events-auto absolute left-[59%] top-[36%] z-10">
        <Eunju2
          active={activeBuildingId === 'eunju2'}
          onClick={() => onSelectBuilding?.('eunju2')}
        />
      </div>
      <div className="pointer-events-auto absolute left-[-5%] top-[52%] z-10">
        <Daeil active={activeBuildingId === 'daeil'} onClick={() => onSelectBuilding?.('daeil')} />
      </div>
    </div>
  );
}
