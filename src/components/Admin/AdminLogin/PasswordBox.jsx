import { useState } from 'react';

export default function PasswordBox({ value, onChange, correctPassword }) {
  const [visible, setVisible] = useState(false);

  const isEmpty = value.length === 0;
  const isMatch = !isEmpty && value === correctPassword;
  const isMismatch = !isEmpty && value !== correctPassword;

  const borderColor = isMatch
    ? 'border-[#4AA4FF]'
    : isMismatch
      ? 'border-[#FF3737]'
      : 'border-[#E3E3E3]';

  return (
    <div className="flex w-full min-w-87.5 flex-col gap-1.25">
      <div
        className={`flex w-full items-center justify-between border-b-2 pb-[15px] pl-[10px] ${borderColor}`}
      >
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="비밀번호를 입력해주세요"
          className="flex-1 bg-transparent text-[18px] leading-[1.6] text-[#1A1A1A] outline-none placeholder:text-[#A0A0A0]"
        />
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          className="shrink-0"
          aria-label={visible ? '비밀번호 숨기기' : '비밀번호 표시'}
        >
          {visible ? (
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
              <path
                d="M5 15s3.75-6.25 10-6.25S25 15 25 15s-3.75 6.25-10 6.25S5 15 5 15Z"
                stroke="#7F7F7F"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="15" cy="15" r="2.5" stroke="#7F7F7F" strokeWidth="1.5" />
            </svg>
          ) : (
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
              <path
                d="M6.25 11.25S8.75 16.25 15 16.25s8.75-5 8.75-5"
                stroke="#7F7F7F"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="m20 16 2 3M15 17.5v3M10 16l-2 3"
                stroke="#7F7F7F"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </div>
      <div className="flex w-full items-center px-2.5">
        {isMatch && <p className="text-[12px] leading-6 text-[#4AA4FF]">비밀번호가 일치합니다!</p>}
        {isMismatch && (
          <p className="text-[12px] leading-6 text-[#FF3737]">비밀번호가 일치하지 않습니다</p>
        )}
      </div>
    </div>
  );
}
