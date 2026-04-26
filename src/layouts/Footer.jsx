import EmailIcon from '@/assets/icons/email.svg';
import GithubIcon from '@/assets/icons/github.svg';
import InstagramIcon from '@/assets/icons/instagram.svg';
import LiklionLogo from '@/assets/icons/liklion-logo.svg';

export default function Footer() {
  return (
    <footer
      id="footer"
      className="relative flex h-[9.4375rem] flex-col items-center justify-start gap-[0.9rem] bg-[#121212] pt-[2rem]"
    >
      <p className="flex items-center gap-[0.25rem] text-[0.5rem] font-bold leading-none tracking-[-0.01rem] text-white [font-family:Pretendard]">
        <span>2026 서경대학교 대동제 X</span>
        <img src={LiklionLogo} alt="" aria-hidden="true" className="h-[0.45rem] w-auto" />
        <span>SKU LIKELION</span>
      </p>
      <div className="flex items-center gap-[0.35rem] pt-[0.5rem]">
        <img src={EmailIcon} alt="email" className="h-[0.75rem] w-[0.75rem]" />
        <img src={InstagramIcon} alt="instagram" className="h-[0.75rem] w-[0.75rem]" />
        <img src={GithubIcon} alt="github" className="h-[0.75rem] w-[0.75rem]" />
      </div>
      <p className="text-[0.375rem] font-thin leading-none text-white/65 [font-family:Pretendard]">
        © 2026 SKU LIKELION, All rights reserved.
      </p>
    </footer>
  );
}
