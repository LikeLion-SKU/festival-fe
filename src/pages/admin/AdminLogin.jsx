import { useState } from 'react';

import CheckIcon from '@/assets/icons/check_red_icon.svg?react';
import DepartmentBox from '@/components/Admin/AdminLogin/DepartmentBox';
import PasswordBox from '@/components/Admin/AdminLogin/PasswordBox';

const CORRECT_PASSWORD = 'sw2026!@';

export default function AdminLogin() {
  const [department, setDepartment] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="relative mx-auto min-h-dvh w-97.5 bg-white">
      <header className="px-6.25 pt-27.25">
        <h1 className="text-[22px] w-68 font-semibold leading-8.75 text-[#551F1C]">
          안녕하세요, 부스 관리자님 로그인을 완료해주세요.
        </h1>
      </header>

      <div className="mt-21.25 flex w-87.5 flex-col gap-6.25 pl-5">
        <div className="flex w-full flex-col gap-2.5">
          <div
            className={`flex items-center gap-1 w-full text-[18px] font-semibold leading-[1.6]  ${department ? 'text-[#FE5F54]' : 'text-[#595959]'}`}
          >
            학과 선택
            {department ? <CheckIcon /> : ''}
          </div>
          <DepartmentBox value={department} onChange={setDepartment} />
        </div>

        <div className="flex w-full flex-col gap-3.75">
          <p
            className={`w-full text-[18px] font-semibold leading-[1.6] ${password ? 'text-[#FE5F54]' : 'text-[#595959]'}`}
          >
            비밀번호
          </p>
          <PasswordBox value={password} onChange={setPassword} correctPassword={CORRECT_PASSWORD} />
        </div>
      </div>
    </div>
  );
}
