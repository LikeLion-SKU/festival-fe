import LineupCardDay2Bg from '@/assets/images/lineup-card-day2.svg';
import LineupCardBg from '@/assets/images/lineup-card.svg';
import LineupStarBg from '@/assets/images/lineup-star.png';
import { LINEUP_ITEMS } from '@/constants/lineupDummyData';

/** 라인업 카드에 쓰이는 정적 이미지 URL (아티스트 컷 + 프레임·별) */
export function getLineupAssetSrcs() {
  const artistSrcs = LINEUP_ITEMS.map((item) => item.image).filter(Boolean);
  return [...new Set([...artistSrcs, LineupCardBg, LineupCardDay2Bg, LineupStarBg])];
}

function preloadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    const afterLoad = () => {
      if (typeof img.decode === 'function') {
        img.decode().then(resolve).catch(resolve);
      } else {
        resolve();
      }
    };
    img.onload = afterLoad;
    img.onerror = () => resolve();
    img.src = src;
  });
}

/** 로드·GPU 디코드까지 — 캐러셀 전환 시 이미지 디코딩으로 끊기는 현상 완화 */
export function preloadLineupAssets() {
  return Promise.all(getLineupAssetSrcs().map(preloadImage)).then(() => undefined);
}
