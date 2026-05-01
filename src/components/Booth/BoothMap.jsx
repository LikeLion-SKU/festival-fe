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
    </div>
  );
}
