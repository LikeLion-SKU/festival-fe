import { useRef, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import { login } from '@/api/auth';
import CheckIcon from '@/assets/icons/admin/check_red_icon.svg?react';
import WrningIcon from '@/assets/icons/admin/warning_orange_icon.svg?react';
import DepartmentBox from '@/components/Admin/AdminLogin/DepartmentBox';
import PasswordBox from '@/components/Admin/AdminLogin/PasswordBox';
import OrderButton from '@/components/common/OrderButton';

import LoginSplash from './LoginSplash';

export default function AdminLogin() {
  const [department, setDepartment] = useState('');
  const [password, setPassword] = useState('');
  const [isFail, setIsFail] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const navigate = useNavigate();
  const passwordInputRef = useRef(null);
  const { setIsLoading } = useOutletContext() ?? {};

  const onClicklogin = async () => {
    setIsLoading?.(true);
    try {
      const res = await login({ departmentName: department.departmentName, password });
      if (res.data?.boothId) localStorage.setItem('boothId', res.data.boothId);

      setIsFail(false);
      setShowSplash(true);
      setTimeout(() => navigate('/admin/waiting'), 3000);
    } catch (error) {
      console.log('로그인 실패 : ' + error);
      setIsFail(true);
      passwordInputRef.current?.focus();
    } finally {
      setIsLoading?.(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center mx-auto min-h-dvh  bg-white">
      <header className="pt-27.25 mr-auto ml-5">
        <h1 className="text-[22px] font-bold leading-8.75 text-[#353535]">
          안녕하세요, 부스 관리자님
        </h1>
        <h1 className="text-[22px] font-bold leading-8.75 text-[#353535]">
          로그인을 완료해주세요.
        </h1>
      </header>

      <div className="mt-12.75 flex w-full flex-col gap-6.25 px-5 items-center">
        <div className="flex w-full flex-col gap-2.5">
          <div
            className={`flex items-center gap-1 w-full text-[16px] font-semibold leading-[1.6]  ${department ? 'text-[#FE5F54]' : 'text-deep-gray'}`}
          >
            학과 선택
            {department ? <CheckIcon /> : ''}
          </div>
          <DepartmentBox value={department} onChange={setDepartment} />
        </div>

        <div className="flex w-full flex-col gap-3.75">
          <p
            className={`flex items-center gap-1 w-full text-[16px] font-semibold leading-[1.6] ${isFail ? 'text-[#FF9500]' : 'text-deep-gray'}`}
          >
            비밀번호
            {isFail && <WrningIcon />}
          </p>
          <PasswordBox
            value={password}
            onChange={setPassword}
            isFail={isFail}
            inputRef={passwordInputRef}
          />
        </div>
      </div>

      <div className="flex mt-auto px-5 w-full justify-center items-center h-28 shadow-[0_-1px_7px_-2px_rgba(0,0,0,0.25)]">
        <OrderButton
          width="21.5rem"
          height="3.25rem"
          color={department && password ? '#FE5F54' : '#C9C9C9'}
          onClick={department && password ? onClicklogin : () => {}}
          buttonName="로그인"
        />
      </div>

      {showSplash && <LoginSplash />}
    </div>
  );
}
