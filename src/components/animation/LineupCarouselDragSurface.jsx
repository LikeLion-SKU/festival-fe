import { motion as Motion } from 'framer-motion';

export default function LineupCarouselDragSurface({ reduceMotion, onDragEnd, children }) {
  return (
    <Motion.div
      className={`relative h-full w-full ${reduceMotion ? '' : 'cursor-grab touch-none active:cursor-grabbing'}`}
      drag={reduceMotion ? false : 'x'}
      dragSnapToOrigin
      dragElastic={0.12}
      dragMomentum={false}
      onDragEnd={onDragEnd}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </Motion.div>
  );
}
