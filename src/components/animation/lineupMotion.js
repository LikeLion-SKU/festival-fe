export const LINEUP_STAGE_WIDTH_PX = 336;
export const LINEUP_CARD_WIDTH_PX = 312;

export const SLOT_ORDER = ['left', 'center', 'right'];

/** 좌·중·우 = 타원 위 균등 간격 각도(도) — 전환 시 중간 각 키프레임으로 호를 그림 */
export const ORBIT_ANGLE_BY_SLOT = {
  left: -53,
  center: 0,
  right: 53,
};

export function slotPositionFromIndex(slotIndex) {
  return SLOT_ORDER[slotIndex] ?? 'center';
}

/**
 * 버튼·스와이프 연속 입력 시 이전 트랜스폼이 끝나기 전에 슬롯만 바뀌어 카드가 겹쳐 보이는 문제 완화.
 * 최장 단계 시간 ≈ buildOrbitSlotChangeKeyframes(base 0.54s × 카드 3장일 때 2배 각도).
 */
export function lineupManualNavCooldownMs(itemCount) {
  if (itemCount <= 1) return 0;
  const baseSec = 0.54;
  const maxSpanRatio = itemCount <= 3 ? 2 : 1;
  return Math.ceil(baseSec * maxSpanRatio * 1000) + 60;
}

const DEG = Math.PI / 180;
const ORBIT_MAX_DEG = 53;
const ORBIT_A = 258;
const ORBIT_B = 218;
const Z_CENTER = 38;
const CENTER_X_BASE = LINEUP_STAGE_WIDTH_PX / 2 - LINEUP_CARD_WIDTH_PX / 2;
const Y_CENTER = 56;
const Y_SIDE = 1.6;

/**
 * 타원(정면 투영): x·z는 각도의 sin/cos로 묶여 궤도상에서 겹침이 줄어듦
 */
function poseDegrees(deg) {
  const r = deg * DEG;
  const sin = Math.sin(r);
  const cos = Math.cos(r);
  const absSin = Math.abs(sin);

  const x = CENTER_X_BASE + ORBIT_A * sin;
  const z = Z_CENTER + ORBIT_B * (cos - 1);

  const denom = 1 - Math.cos(ORBIT_MAX_DEG * DEG);
  const t = denom > 1e-6 ? (1 - cos) / denom : 0;
  const y = Y_CENTER + (Y_SIDE - Y_CENTER) * t;

  const rotateYDeg = -24 * sin;
  const rotateZDeg = 13 * sin + 0.85 * cos;

  const scale = 1 - 0.17 * absSin;
  const opacity = 1 - 0.12 * absSin;

  const blurPx = absSin > 0.1 ? 2 : 0;
  const brightness = absSin > 0.1 ? 0.68 : 1;

  /** translateZ(z)와 일치하는 페인트 순서 — 전환 중 앞/뒤가 뒤바뀌며 서로 뚫고 지나가 보이는 현상 완화 */
  const zIndex = Math.max(1, Math.round(52 + z + sin * 2));

  return {
    x,
    y,
    z,
    rotateYDeg,
    rotateZDeg,
    scale,
    opacity,
    blurPx,
    brightness,
    zIndex,
  };
}

function orbitGeometryFromDeg(deg, stageShiftX) {
  const p = poseDegrees(deg);
  return {
    x: p.x + stageShiftX,
    y: p.y,
    z: p.z,
    rotateY: p.rotateYDeg,
    rotateZ: p.rotateZDeg,
    scale: p.scale,
    opacity: p.opacity,
    zIndex: p.zIndex,
    transformPerspective: 1400,
  };
}

/** 이전 슬롯 → 다음 슬롯 사이, 타원 위 중간 각(호의 한 점) */
export function midOrbitGeometryBetween(fromSlot, toSlot, stageShiftX) {
  const a0 = ORBIT_ANGLE_BY_SLOT[fromSlot];
  const a1 = ORBIT_ANGLE_BY_SLOT[toSlot];
  const midDeg = (a0 + a1) / 2;
  return orbitGeometryFromDeg(midDeg, stageShiftX);
}

/** 인접 슬롯(left↔center↔right) 한 칸 이동 시 각도 변화(도) */
const ORBIT_ONE_STEP_DEG = Math.abs(ORBIT_ANGLE_BY_SLOT.right - ORBIT_ANGLE_BY_SLOT.center);

/**
 * 슬롯 전환: 각도를 균등 분할한 호 경로.
 * 카드 3장일 때 같은 카드가 left→right로 한 번에 갈 수 있어 각도 2배 — duration·키프레임도 비례해
 * 각속도가 인접 이동과 비슷하게 느껴지도록 함.
 */
export function buildOrbitSlotChangeKeyframes(fromSlot, toSlot, stageShiftX, baseDuration = 0.54) {
  const a0 = ORBIT_ANGLE_BY_SLOT[fromSlot];
  const a1 = ORBIT_ANGLE_BY_SLOT[toSlot];
  const deltaDeg = Math.abs(a1 - a0);
  const spanRatio = Math.max(1, deltaDeg / ORBIT_ONE_STEP_DEG);
  const duration = baseDuration * spanRatio;
  const n = Math.min(26, Math.max(14, Math.round(14 * spanRatio)));
  const x = [];
  const y = [];
  const z = [];
  const rotateY = [];
  const rotateZ = [];
  const scale = [];
  const opacity = [];
  const zIndex = [];
  const times = [];

  for (let i = 0; i <= n; i += 1) {
    const t = i / n;
    times.push(t);
    const deg = a0 + (a1 - a0) * t;
    const g = orbitGeometryFromDeg(deg, stageShiftX);
    x.push(g.x);
    y.push(g.y);
    z.push(g.z);
    rotateY.push(g.rotateY);
    rotateZ.push(g.rotateZ);
    scale.push(g.scale);
    opacity.push(g.opacity);
    zIndex.push(g.zIndex);
  }

  const end = orbitGeometryFromDeg(a1, stageShiftX);
  return {
    x,
    y,
    z,
    rotateY,
    rotateZ,
    scale,
    opacity,
    zIndex,
    transformPerspective: end.transformPerspective,
    times,
    duration,
  };
}

export function animateGeometryForSlot(position, stageShiftX = 0) {
  const deg = ORBIT_ANGLE_BY_SLOT[position];
  return orbitGeometryFromDeg(deg, stageShiftX);
}

export function animateFilterForSlot(position) {
  const deg = ORBIT_ANGLE_BY_SLOT[position];
  const p = poseDegrees(deg);
  const filterChunks = [];
  if (p.blurPx > 0) filterChunks.push(`blur(${p.blurPx}px)`);
  if (typeof p.brightness === 'number') filterChunks.push(`brightness(${p.brightness})`);
  return {
    filter: filterChunks.length > 0 ? filterChunks.join(' ') : 'none',
  };
}

/** 슬롯 전환·레이아웃 공통 — 사이드 이동이 덜 급하게 느껴지도록 완만한 이징 */
export const LINEUP_ORBIT_SLOT_EASE = [0.39, 0.03, 0.62, 0.98];

/** 인접 슬롯 한 칸 기준 길이 (buildOrbitSlotChangeKeyframes baseDuration과 맞춤) */
const LINEUP_ORBIT_MOTION = {
  duration: 0.54,
  ease: LINEUP_ORBIT_SLOT_EASE,
};

/** 슬롯 전환: 균등 각도 키프레임과 함께 사용 */
export const LINEUP_ORBIT_SLOT_TRANSITION = LINEUP_ORBIT_MOTION;

export const LINEUP_SPRING_TRANSITION = { type: 'spring', stiffness: 72, damping: 34, mass: 1.05 };

/** 리사이즈/첫 마운트 등 슬롯만 유지할 때도 위와 동일  -> 한 장만 빨리 도는 현상 방지 */
export const LINEUP_ORBIT_LAYOUT_TRANSITION = {
  type: 'tween',
  ...LINEUP_ORBIT_MOTION,
  zIndex: { duration: 0 },
};

export const LINEUP_ORBIT_FILTER_TRANSITION = {
  filter: { duration: LINEUP_ORBIT_MOTION.duration, ease: LINEUP_ORBIT_MOTION.ease },
};

export const LINEUP_TWEEN_TRANSITION = { type: 'tween', duration: 0.22, ease: [0.33, 1, 0.68, 1] };
