import { motion as Motion } from 'framer-motion';

/**
 * 드래그 레이어
 */
export default function LineupCarouselDragSurface({ reduceMotion, onDragEnd }) {
  if (reduceMotion) return null;

  return (
    <Motion.div
      aria-hidden="true"
      className="absolute inset-0 z-[25] cursor-grab touch-none active:cursor-grabbing"
      drag="x"
      dragSnapToOrigin
      dragElastic={0.12}
      dragMomentum={false}
      onDragEnd={onDragEnd}
    />
  );
}
