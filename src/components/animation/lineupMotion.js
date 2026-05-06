export const LINEUP_STAGE_WIDTH_PX = 336;
export const LINEUP_CARD_WIDTH_PX = 312;

/** 좌 /중앙 /우 —라인업 카드 motion */
const LINEUP_SLOT_STYLE = {
  left: {
    x: -192,
    y: 1.6,
    z: -90,
    rotateYDeg: 14,
    rotateZDeg: -6,
    scale: 0.94,
    blurPx: 2,
    brightness: 0.68,
    opacity: 0.95,
    zIndex: 2,
  },
  center: {
    x: LINEUP_STAGE_WIDTH_PX / 2 - LINEUP_CARD_WIDTH_PX / 2,
    y: 56,
    z: 12,
    rotateYDeg: 0,
    rotateZDeg: 0.85,
    scale: 1,
    blurPx: 0,
    brightness: 1,
    opacity: 1,
    zIndex: 5,
  },
  right: {
    x: LINEUP_STAGE_WIDTH_PX + 15.2 * 16 - LINEUP_CARD_WIDTH_PX,
    y: 1.6,
    z: -90,
    rotateYDeg: -14,
    rotateZDeg: 18,
    scale: 0.94,
    blurPx: 2,
    brightness: 0.68,
    opacity: 0.95,
    zIndex: 2,
  },
};

export const LINEUP_SPRING_TRANSITION = { type: 'spring', stiffness: 120, damping: 22 };
export const LINEUP_TWEEN_TRANSITION = { type: 'tween', duration: 0.22, ease: [0.33, 1, 0.68, 1] };

export function animateForSlot(position, stageShiftX = 0) {
  const slot = LINEUP_SLOT_STYLE[position];
  const filterChunks = [];
  if (slot.blurPx > 0) filterChunks.push(`blur(${slot.blurPx}px)`);
  if (typeof slot.brightness === 'number') filterChunks.push(`brightness(${slot.brightness})`);
  return {
    x: slot.x + stageShiftX,
    y: slot.y,
    z: slot.z,
    rotateY: slot.rotateYDeg,
    rotateZ: slot.rotateZDeg,
    scale: slot.scale,
    opacity: slot.opacity,
    filter: filterChunks.length > 0 ? filterChunks.join(' ') : 'none',
    zIndex: slot.zIndex,
  };
}
