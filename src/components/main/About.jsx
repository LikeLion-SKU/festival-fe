import SkuLogo from '@/assets/icons/sku-logo.svg';
import AboutFire2 from '@/assets/images/about-fire2.svg';
import AboutFire from '@/assets/images/about-fire.svg';

const CAST_ROWS = [
  { role: 'PROJECT LEADER', names: 'Yoon Heejun, Lim Dahyun' },
  { role: 'PRODUCT OWNER', names: 'Jeong Youngjin, Choi Unjo, Lim Dahyun, Kim Junghyeon' },
  { role: 'FRONTEND', names: 'Sim SeoHyeon, Jeong Mokjin, Kim Hyunsu' },
  { role: 'BACKEND', names: 'Keum Sieon, Kim NaKung, Shin Chaerin' },
];

export default function About() {
  return (
    <section
      id="about"
      className="relative min-h-[85rem] overflow-hidden bg-[#141414] px-[3.65625rem] pt-[3.75rem]"
    >
      <img
        src={AboutFire}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 z-[0] w-[28.125rem] max-w-none -translate-x-1/2 object-cover"
      />
      <img
        src={AboutFire2}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 z-[0] w-[28.125rem] max-w-none -translate-x-1/2 object-cover"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[16rem]"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 45%, rgba(0,0,0,0.35) 70%, rgba(0,0,0,0.15) 90%,rgba(0,0,0,0) 100%)',
        }}
      />
      <div className="relative z-10 flex flex-col items-center pt-[0.5rem] text-center text-white">
        <p className="text-[1.25rem] leading-[1.2] text-[#fefefe] [font-family:Sekuya] [text-shadow:1px_1px_0px_rgba(0,0,0,0.11)]">
          ABOUT
        </p>
        <div className="mt-[2.25rem] flex flex-col items-center gap-[1.3rem]">
          <span className="h-[0.3125rem] w-[0.3125rem] rounded-full bg-white" />
          <span className="h-[0.3125rem] w-[0.3125rem] rounded-full bg-white" />
          <span className="h-[0.3125rem] w-[0.3125rem] rounded-full bg-white" />
        </div>
        <img src={SkuLogo} alt="SKU LIKELION 로고" className="mt-[3.125rem] h-[9rem] w-[9rem]" />
        <p className="mt-[2rem] text-[1.125rem] leading-[1.2] text-[#fefefe] [font-family:Sekuya]">
          SKU LIKELION 14TH
        </p>
        <p className="mt-[3.25rem] text-[0.75rem] font-normal leading-[1.6] text-[#fefefe] [font-family:Pretendard]">
          안녕하세요, <span className="font-bold">멋쟁이사자처럼 서경대</span>입니다.
        </p>
        <div className="mt-[2.25rem] text-[0.625rem] font-normal leading-[1.6] text-[#fefefe] [font-family:Pretendard]">
          <p className="m-0">학우분들께서 축제를 더욱 즐겁고</p>
          <p className="m-0">편리하게 즐길 수 있도록 축제 페이지를 제작하였습니다.</p>
          <p className="m-0">
            여러분들께 도움이 되는 페이지가 되길 바라며, 즐거운 축제 즐기시길 바랍니다 !
          </p>
        </div>
        <div className="mt-[6rem] -mx-[1rem] w-[calc(100%+2rem)] text-[#C43A31]">
          <p className="text-center text-[1.125rem] leading-[1.2] [font-family:Sekuya]">CAST</p>
          <div className="mt-[3rem] space-y-[2rem]">
            {CAST_ROWS.map((row) => (
              <div
                key={row.role}
                className="grid grid-cols-[5.6rem_1fr] items-start gap-x-[0rem] text-left"
              >
                <p className="pl-[1.3rem] m-0 text-[0.75rem] font-black leading-[1.4] [font-family:Pretendard]">
                  {row.role.includes('LEADER') ? (
                    <>
                      {row.role.replace(' LEADER', '')}{' '}
                      <span className="relative left-[1rem] inline-block">LEADER</span>
                    </>
                  ) : row.role.includes('OWNER') ? (
                    <>
                      {row.role.replace(' OWNER', '')}{' '}
                      <span className="relative left-[1.1rem] inline-block">OWNER</span>
                    </>
                  ) : row.role === 'BACKEND' ? (
                    <span className="relative left-[0.5rem] inline-block">BACKEND</span>
                  ) : (
                    row.role
                  )}
                </p>
                <p className="-ml-[-1.25rem] m-0 text-[0.75rem] font-semibold leading-[1.4] [font-family:Pretendard]">
                  {row.names}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-[8rem] -mx-[1rem] flex w-[calc(100%+2rem)] flex-col gap-[0.55rem]">
          <button
            type="button"
            className="h-[3rem] w-full border border-[rgba(255,255,255,0.2)] bg-[rgba(34,34,34,0.72)] text-[1rem] font-bold leading-none text-white [font-family:Pretendard]"
          >
            제작자 보러가기
          </button>
          <button
            type="button"
            className="h-[3rem] w-full border border-[rgba(255,255,255,0.2)] bg-[rgba(34,34,34,0.72)] text-[1rem] font-bold leading-none text-white [font-family:Pretendard]"
          >
            부스 보러가기
          </button>
        </div>
      </div>
    </section>
  );
}
