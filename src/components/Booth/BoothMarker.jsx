/* eslint-disable react-refresh/only-export-components */
import clsx from 'clsx';

/**
 * 지도 부스 마커 정의(건물별), 바텀시트/카드와 인덱스/번호 매칭 시 요 배열대로 기준으로 함
 */

/** 혜인관 부스 번호(지도 좌→우),바텀시트 학과 카드와 1:1 매칭 시 동일 인덱스로 연결함 */
export const HYEIN_BOOTH_MARKERS = [
  { id: '1', label: '1', variant: 'booth' },
  { id: '2', label: '2', variant: 'booth' },
  { id: '3', label: '3', variant: 'booth' },
  { id: '4', label: '4', variant: 'booth' },
  { id: '5', label: '5', variant: 'booth' },
];

/** 은주1관 지도 마커(건물 위쪽 일렬, 좌→우 16–23) */
export const EUNJU1_BOOTH_MARKERS = Array.from({ length: 8 }, (_, i) => {
  const n = 16 + i;
  return { id: String(n), label: String(n) };
});

/** 은주2관 지도 마커 번호(건물 앞 사각형 좌→우 6–15) */
export const EUNJU2_BOOTH_MARKERS = Array.from({ length: 10 }, (_, i) => {
  const n = 6 + i;
  return { id: String(n), label: String(n) };
});

/** 청운관 지도 마커(원 가로 열 자리, 좌→우 32–36) */
export const CHEONGUN_BOOTH_MARKERS = Array.from({ length: 5 }, (_, i) => {
  const n = 32 + i;
  return { id: String(n), label: String(n) };
});

/** 대일관 지도 마커(원래 가로 8칸 자리, 좌→우 24–31) */
export const DAEIL_BOOTH_MARKERS = Array.from({ length: 8 }, (_, i) => {
  const n = 24 + i;
  return { id: String(n), label: String(n) };
});

/** 건물 키별 마커 조회용 (선택적 사용) */
export const BOOTH_MARKERS_BY_BUILDING = {
  hyein: HYEIN_BOOTH_MARKERS,
  eunju1: EUNJU1_BOOTH_MARKERS,
  eunju2: EUNJU2_BOOTH_MARKERS,
  cheongun: CHEONGUN_BOOTH_MARKERS,
  daeil: DAEIL_BOOTH_MARKERS,
};

/** 지도 직사각형 마커(미선택 기본 칸) 픽셀 크기 */
export const BOOTH_SQUARE_WIDTH_PX = 16;
export const BOOTH_SQUARE_HEIGHT_PX = 12;

/** 건물 미선택 시 기본 칸 배경 (선택 시 건물 컴포넌트에서 다른 톤으로 덮어씀) */
export const BOOTH_SQUARE_COLOR_DEFAULT = '#FF958F';
/** Square 컴포넌트 */
export function Square({ className, style, color = BOOTH_SQUARE_COLOR_DEFAULT }) {
  return (
    <div
      className={clsx('shrink-0', className)}
      style={{
        width: BOOTH_SQUARE_WIDTH_PX,
        height: BOOTH_SQUARE_HEIGHT_PX,
        backgroundColor: color,
        ...style,
      }}
    />
  );
}
