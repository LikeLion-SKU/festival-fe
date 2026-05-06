import { useNavigate } from 'react-router';

export default function SimpleNotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-full w-full items-center justify-center bg-white px-6">
      <div className="flex flex-col items-center text-center">
        <p className="text-[80px] font-black leading-none text-[#FE5F54] [font-family:Pretendard]">
          404
        </p>
        <p className="mt-2 text-[1.125rem] font-bold text-[#1A1A1A] [font-family:Pretendard]">
          Page Not Found<span className="text-[2.5rem] text-[#FE5F54]">.</span>
        </p>
        <div className="mt-6 flex flex-col items-center gap-1">
          <p className="text-[14px] font-semibold leading-[1.4] tracking-[0%] text-[#1A1A1A] [font-family:Pretendard]">
            페이지를 찾을 수 없습니다.
          </p>
          <p className="text-[14px] font-semibold leading-[1.4] tracking-[0%] text-[#1A1A1A] [font-family:Pretendard]">
            이전 페이지로 이동 후 다시 시도해주세요.
          </p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="mt-5 text-[13px] font-semibold leading-[0.79] tracking-[0%] text-[#FF756C] underline underline-offset-2 [font-family:Pretendard]"
        >
          이전 페이지로 이동하기
        </button>
      </div>
    </div>
  );
}
