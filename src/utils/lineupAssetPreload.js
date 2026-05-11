import LineupCardDay2Bg from '@/assets/images/lineup-card-day2.svg';
import LineupCardBg from '@/assets/images/lineup-card.svg';
import LineupStarBg from '@/assets/images/lineup-star.webp';
import { LINEUP_ITEMS } from '@/constants/lineupDummyData';

/** 라인업 카드에 쓰이는 정적 이미지 URL (아티스트 컷 + 프레임·별) */
export function getLineupAssetSrcs() {
  const artistSrcs = LINEUP_ITEMS.map((item) => item.image).filter(Boolean);
  return [...new Set([...artistSrcs, LineupCardBg, LineupCardDay2Bg, LineupStarBg])];
}

function preloadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

/** HTTP 캐시만 워밍 — `decode()` 일괄 호출은 스크롤 구간에서 메인 스레드/GPU 스파이크 유발 */
async function preloadLineupAssetsStaggered() {
  const srcs = getLineupAssetSrcs();
  for (const src of srcs) {
    await preloadImage(src);
    await new Promise((r) => requestAnimationFrame(r));
  }
}

/** 캐러셀 전환 시 깜빡임 완화 — 디코드는 실제 `<img>` 페인트 시점으로 미룸 */
export function preloadLineupAssets() {
  return preloadLineupAssetsStaggered().then(() => undefined);
}
