import { useEffect, useRef, useState } from 'react';

const clamp01 = (v) => Math.min(1, Math.max(0, v));

/** 메인 랜딩 섹션 공통 — 말 아이콘 + 영문 타이틀 묶음 */
export const MAIN_SECTION_ICON_SCROLL_FADE = {
  minOpacity: 0.18,
  maxOpacity: 1,
  peakViewportY: 0.38,
  bandVH: 0.48,
};

/** 메인 랜딩 섹션 공통 */
export const MAIN_SECTION_BODY_SCROLL_FADE = {
  minOpacity: 0.15,
  maxOpacity: 1,
  peakViewportY: 0.44,
  bandVH: 0.52,
};

/**
 * 요소 위치와 뷰포트 스크롤에 따라 선명도 값을 계산함
 *
 * @param {DOMRect} rect getBoundingClientRect()
 * @param {number} viewportHeight window.innerHeight
 * @param {{
 *   minOpacity?: number;
 *   maxOpacity?: number;
 *   peakViewportY?: number;
 *   bandVH?: number;
 * }} [options]
 * @returns {number}
 */
export function computeScrollOpacity(rect, viewportHeight, options = {}) {
  const { minOpacity = 0.15, maxOpacity = 1, peakViewportY = 0.42, bandVH = 0.52 } = options;

  const vh = viewportHeight || 1;
  if (rect.height <= 0) return minOpacity;

  const cy = rect.top + rect.height / 2;
  const peakPx = peakViewportY * vh;
  const bandPx = Math.max(bandVH * vh, 1);

  let clarity = 1 - Math.abs(cy - peakPx) / bandPx;
  clarity = clamp01(clarity);

  const visibleTop = Math.max(0, Math.min(rect.bottom, vh) - Math.max(rect.top, 0));
  const visibleRatio = visibleTop / rect.height;
  const visibilityBoost = clamp01(visibleRatio * 1.15);

  const combined = clamp01(clarity * 0.72 + visibilityBoost * 0.28);
  return minOpacity + (maxOpacity - minOpacity) * combined;
}

/**
 * 스크롤이나 리사이즈에 따라 요소의 opacity를 갱신함 window 스크롤 기준임
 *
 * @param {React.RefObject<HTMLElement | null>} elementRef
 * @param {{
 *   minOpacity?: number;
 *   maxOpacity?: number;
 *   peakViewportY?: number;
 *   bandVH?: number;
 * }} [options]
 * @returns {number}
 */
const OPACITY_UPDATE_EPS = 0.012;

export function useScrollDrivenOpacity(elementRef, options = {}) {
  const { minOpacity = 0.15, maxOpacity = 1, peakViewportY = 0.42, bandVH = 0.52 } = options;

  const [opacity, setOpacity] = useState(maxOpacity);
  const frameRef = useRef(0);
  const lastCommittedRef = useRef(null);

  useEffect(() => {
    const measure = () => {
      const el = elementRef?.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const next = computeScrollOpacity(rect, vh, {
        minOpacity,
        maxOpacity,
        peakViewportY,
        bandVH,
      });
      const prev = lastCommittedRef.current;
      if (prev !== null && Math.abs(next - prev) < OPACITY_UPDATE_EPS) return;
      lastCommittedRef.current = next;
      setOpacity(next);
    };

    const onScrollOrResize = () => {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(measure);
    };

    lastCommittedRef.current = null;
    measure();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [elementRef, minOpacity, maxOpacity, peakViewportY, bandVH]);

  return opacity;
}
