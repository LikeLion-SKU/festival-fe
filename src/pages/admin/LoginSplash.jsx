import Lottie from 'lottie-react/build/index.es.js';

import SplashAnimation from '@/assets/lottie/login_splash.json';

export default function LoginSplash() {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white">
      <Lottie animationData={SplashAnimation} loop={true} />
    </div>
  );
}
