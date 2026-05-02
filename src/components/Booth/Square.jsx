import clsx from 'clsx';

/**
 * 부스 지도용 작은 직사각형 마커 -> 건물 미선택 초기 색상으로, 건물 선택 시 색상 변함
 * @param {{ className?: string; style?: React.CSSProperties; color?: string }} props
 */
export default function Square({ className, style, color = '#FF958F' }) {
  return (
    <div
      className={clsx('shrink-0', className)}
      style={{ width: 12, height: 8, backgroundColor: color, ...style }}
    />
  );
}
