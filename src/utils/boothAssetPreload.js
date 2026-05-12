import DesertBg from '@/assets/images/desert.svg';
import FenceBg from '@/assets/images/fence.svg';
import { getMainBoothAssetSrcs } from '@/constants/boothBuildingData';

function preloadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

async function preloadBoothAssetsStaggered() {
  const srcs = [...getMainBoothAssetSrcs(), FenceBg, DesertBg];
  for (const src of srcs) {
    await preloadImage(src);
    await new Promise((r) => requestAnimationFrame(r));
  }
}

/** 모션 시 끊김 완화 — 일괄 decode 대신 프레임 나눠 캐시만 채움 */
export function preloadBoothAssets() {
  return preloadBoothAssetsStaggered().then(() => undefined);
}
