import { useState } from 'react';

import EyeClose from '@/assets/icons/admin/eye-close-icon.svg?react';
import EyeOpen from '@/assets/icons/admin/eye-open-icon.svg?react';
import EyeCloseOrange from '@/assets/icons/admin/eye_close_orange_icon.svg?react';
import EyeOpenOrange from '@/assets/icons/admin/eye_open_orange_icon.svg?react';

export default function PasswordBox({ value, onChange, isFail, inputRef }) {
  const [visible, setVisible] = useState(false);

  const borderColor = isFail ? 'border-[#FF9500]' : 'border-[#E3E3E3]';

  return (
    <div className="flex w-full flex-col gap-1.25">
      <div className={`flex w-full items-center border-b-2 pb-2 px-3 ${borderColor}`}>
        <input
          ref={inputRef}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="비밀번호를 입력해주세요"
          className={`flex-1 min-w-0 h-7.5 bg-transparent text-[14px] leading-[1.6] 
            ${
              isFail
                ? 'text-[#FF9500] placeholder:text-[#FF9500]'
                : 'text-[#1A1A1A] placeholder:text-[#A0A0A0]'
            } outline-none`}
        />
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          className="shrink-0 w-5 h-5"
          aria-label={visible ? '비밀번호 숨기기' : '비밀번호 표시'}
        >
          {visible ? (
            isFail ? (
              <EyeOpenOrange className="w-5 h-5" />
            ) : (
              <EyeOpen className="w-5 h-5" />
            )
          ) : isFail ? (
            <EyeCloseOrange className="w-5 h-5" />
          ) : (
            <EyeClose className="w-5 h-5" />
          )}
        </button>
      </div>
      <div className="flex w-full items-center px-2.5">
        {isFail && (
          <p className="text-[12px] leading-6 text-[#FF9500]">비밀번호가 일치하지 않습니다.</p>
        )}
      </div>
    </div>
  );
}
