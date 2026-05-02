import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

import HomeShadow from '@/assets/icons/home_shadow.svg?react';
import EnFlag from '@/assets/images/en.svg';
import KoFlag from '@/assets/images/ko.svg';
import ZhFlag from '@/assets/images/zh.svg';

const LANGUAGES = [
  { code: 'ZH', flag: ZhFlag },
  { code: 'EN', flag: EnFlag },
  { code: 'KO', flag: KoFlag },
];

function BoothImageSection({ Image }) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedLang, setSelectedLang] = useState(sessionStorage.getItem('language') || 'KO');
  const pillRef = useRef(null);

  const currentLang = LANGUAGES.find((l) => l.code === selectedLang);

  const handleLangSelect = (code) => {
    sessionStorage.setItem('language', code);
    setSelectedLang(code);
    setIsExpanded(false);
  };

  useEffect(() => {
    if (!isExpanded) return;
    const handleClickOutside = (e) => {
      if (pillRef.current && !pillRef.current.contains(e.target)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExpanded]);

  return (
    <div className="relative h-75 w-full">
      <div className="absolute bottom-0 w-full overflow-hidden">
        <Image className="w-full blur translate-y-4 -translate-x-0.7" />
      </div>
      <Image className="w-49 h-49 absolute top-37 left-7 z-10 rounded-lg" />

      <div className="absolute top-12 right-5 z-20 flex items-center gap-2.5">
        {/* 언어 선택 pill */}
        <div
          ref={pillRef}
          className="px-1.25 py-1.25 bg-white rounded-[35px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] inline-flex items-center gap-2"
        >
          {isExpanded ? (
            LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLangSelect(lang.code)}
                className="relative w-10 h-10 rounded-full overflow-hidden outline-1 -outline-offset-1"
                style={{ outlineColor: lang.code === selectedLang ? '#737373' : '#E5E5E5' }}
              >
                <img src={lang.flag} alt={lang.code} className="w-full h-full object-cover" />
                {lang.code === selectedLang && <div className="absolute inset-0 bg-black/50" />}
              </button>
            ))
          ) : (
            <button
              onClick={() => setIsExpanded(true)}
              className="w-10 h-10 rounded-full overflow-hidden outline-1 -outline-offset-1 outline-gray-200"
            >
              <img
                src={currentLang.flag}
                alt={selectedLang}
                className="w-full h-full object-cover"
              />
            </button>
          )}
        </div>

        {/* 홈 버튼 */}
        <button
          onClick={() => navigate('/')}
          className="w-12 h-12 bg-white rounded-full shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] flex items-center justify-center"
        >
          <HomeShadow className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default BoothImageSection;
