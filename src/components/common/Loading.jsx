import Lottie from 'lottie-react/build/index.es.js';

import LoadingLottie from '@/assets/lottie/loading_animations.json';

export default function Loading() {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/10">
      <Lottie animationData={LoadingLottie} loop={true} />
    </div>
  );
}
