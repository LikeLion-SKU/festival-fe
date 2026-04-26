import { useEffect, useRef, useState } from 'react';

const DEFAULT_DEPARTMENTS = [
  '경영학부',
  '공공인재학부',
  '군사학과',
  '금융정보공학과',
  '나노화학생명공학과',
  '도시공학과',
  '물류시스템공학과',
  '소프트웨어학과',
  '전자컴퓨터공학과',
  '아동학과',
];

export default function DepartmentBox({
  value,
  onChange,
  options = DEFAULT_DEPARTMENTS,
  placeholder = '학과를 선택해주세요',
}) {
  const [internalValue, setInternalValue] = useState('');
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const isControlled = value !== undefined;
  const selected = isControlled ? value : internalValue;

  const handleSelect = (department) => {
    if (!isControlled) setInternalValue(department);
    onChange?.(department);
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-87.5">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex h-11.5 w-full items-center justify-between rounded-[5px] border bg-white px-3.75 py-1.25 ${
          selected ? 'border-[#FE5F54]' : 'border-[#A0A0A0]'
        }`}
      >
        <span
          className={`text-[13px] font-medium leading-[19.5px] ${
            selected ? 'text-[#FE5F54]' : 'text-[#7F7F7F]'
          }`}
        >
          {selected || placeholder}
        </span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          className={`shrink-0 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke={selected ? '#FE5F54' : '#7F7F7F'}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-10 border rounded-lg border-[#E3E3E3] bg-white p-px pr-1.5 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]">
          <div className="max-h-80.5 overflow-y-auto">
            {options.map((department) => {
              const isSelected = department === selected;
              return (
                <button
                  key={department}
                  type="button"
                  onClick={() => handleSelect(department)}
                  className={`flex h-12 w-full items-center border-b border-[#F5F5F5] px-4.75 py-1.5 text-left text-[13px] font-medium leading-[1.6] last:border-b-0 ${
                    isSelected ? 'bg-[#F5F5F5] text-[#FE5F54]' : 'text-[#A0A0A0] hover:bg-[#FAFAFA]'
                  }`}
                >
                  {department}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
