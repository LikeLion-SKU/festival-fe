import DesertBg from '@/assets/images/desert.svg';
import FenceBg from '@/assets/images/fence.svg';
import { getMainBoothAssetSrcs } from '@/constants/boothBuildingData';

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

/** 모션 시 이미지 끊김 완화 */
export function preloadBoothAssets() {
  const srcs = [...getMainBoothAssetSrcs(), FenceBg, DesertBg];
  return Promise.all(srcs.map(preloadImage)).then(() => undefined);
}
