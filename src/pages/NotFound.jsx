import { useNavigate } from 'react-router';

import HatIcon from '@/assets/icons/hat.svg';
import bg404 from '@/assets/images/bg-404-1.png';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-[#121212]">
      <img
        src={bg404}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="relative z-10 flex flex-col items-center text-center">
        <img src={HatIcon} alt="" aria-hidden="true" className="h-[24px] w-[36px] object-contain" />
        <p className="mt-1 text-[52px] font-black italic leading-[1.3] tracking-[0%] text-white [font-family:'NeueHaasGrotDisp']">
          404
        </p>
        <p className="mt-1 text-[1.375rem] font-medium italic tracking-[0%] text-white [font-family:'NeueHaasGrotDisp']">
          NOT FOUND in the system
        </p>
        <p className="text-[1rem] font-medium italic tracking-[0%] text-white [font-family:'NeueHaasGrotDisp']">
          404 the new era, era
        </p>
        <p className="mt-1 text-[1rem] text-white [font-family:Pretendard]">...</p>
        <div className="mt-[40px] flex flex-col items-center gap-2">
          <p className="text-[14px] font-medium leading-[1] tracking-[0%] text-white [font-family:Pretendard]">
            ...죄송합니다. 페이지를 찾을 수 없습니다.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="text-[14px] font-medium leading-[1] tracking-[0%] text-white underline underline-offset-2 [font-family:Pretendard]"
          >
            이전 페이지로 이동하기
          </button>
        </div>
      </div>
    </div>
  );
}
