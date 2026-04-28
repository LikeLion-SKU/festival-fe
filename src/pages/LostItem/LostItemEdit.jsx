import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';

import { getLostItemDetail, updateLostItem } from '@/api/lostItem';
import backgroundImg from '@/assets/images/about-fire2.svg';
import PageHeader from '@/components/common/PageHeader';
import Toast from '@/components/common/Toast';

const DATE_OPTIONS = [
  { label: '5월 13일 수요일', value: '2026-05-13' },
  { label: '5월 14일 목요일', value: '2026-05-14' },
  { label: '5월 15일 금요일', value: '2026-05-15' },
];

const inputClass =
  'w-full h-[3.25rem] bg-[#1a1a1a]/20 border border-[#3a3a3a] backdrop-blur-md text-white text-[0.9375rem] px-[1rem] placeholder-[#A0A0A0] outline-none';

export default function LostItemEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const fileInputRef = useRef(null);
  const [images, setImages] = useState([]);
  const [form, setForm] = useState({ name: '', location: '', date: '', existingImageUrls: [] });
  const [dateOpen, setDateOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const applyItem = (item) =>
      setForm({
        name: item.name ?? '',
        location: item.foundLocation ?? '',
        date: item.foundAt?.slice(0, 10) ?? '',
        existingImageUrls: item.imageUrls ?? (item.imageUrl ? [item.imageUrl] : []),
      });

    if (state?.item) applyItem(state.item);
    getLostItemDetail(id)
      .then((res) => applyItem(res.data))
      .catch(() => {});
  }, [id, state?.item]);

  const { name, location, date, existingImageUrls } = form;
  const selectedDateLabel =
    DATE_OPTIONS.find((d) => d.value === date)?.label ?? '날짜를 선택하세요';

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files].slice(0, 4));
  };

  const totalImageCount = form.existingImageUrls.length + images.length;

  const handleSubmit = async () => {
    if (!name || !location || !date || totalImageCount === 0) {
      setShowWarning(true);
      return;
    }
    const formData = new FormData();
    formData.append('name', name);
    formData.append('foundLocation', location);
    formData.append('foundAt', `${date}T00:00:00`);
    existingImageUrls.forEach((url) => formData.append('existingImageUrls', url));
    images.forEach((img) => formData.append('images', img));
    try {
      await updateLostItem(id, formData);
      setShowSuccess(true);
      setTimeout(() => navigate('/lost-items'), 1500);
    } catch {
      setShowSuccess(true);
      setTimeout(() => navigate('/lost-items'), 1500);
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#0d0d0d',
      }}
    >
      <PageHeader title="분실물" top="50px" className="z-10 bg-[#0d0d0d]" />

      <div className="flex-1 overflow-hidden" style={{ marginTop: 'calc(50px + 3.5rem)' }}>
        <div
          className={`h-full overflow-y-auto px-[1.25rem] pt-[1.5rem] ${dateOpen ? 'pb-[10rem]' : 'pb-[6rem]'}`}
          style={{ scrollbarWidth: 'none' }}
        >
          {/* 사진 업로드 */}
          <div className="flex flex-col gap-[0.625rem]">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageChange}
            />
            <div className="flex gap-[0.75rem] flex-wrap">
              {existingImageUrls.map((url, i) => (
                <div
                  key={`existing-${i}`}
                  className="w-[4.5rem] h-[4.5rem] relative border border-[#3a3a3a] overflow-hidden"
                >
                  <img src={url} alt={`기존 ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        existingImageUrls: prev.existingImageUrls.filter((_, idx) => idx !== i),
                      }))
                    }
                    className="absolute top-[0.25rem] right-[0.25rem] w-[1.25rem] h-[1.25rem] rounded-full bg-black/60 text-white text-[0.625rem] flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              ))}
              {images.map((img, i) => (
                <div
                  key={`new-${i}`}
                  className="w-[4.5rem] h-[4.5rem] relative border border-[#3a3a3a] overflow-hidden"
                >
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`첨부 ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                    className="absolute top-[0.25rem] right-[0.25rem] w-[1.25rem] h-[1.25rem] rounded-full bg-black/60 text-white text-[0.625rem] flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              ))}
              {totalImageCount < 4 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-[4.5rem] h-[4.5rem] flex flex-col items-center justify-center gap-[0.375rem] bg-[#1a1a1a] border border-[#3a3a3a]"
                >
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#A0A0A0"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                  <span
                    className="text-[#A0A0A0] text-[0.625rem] font-semibold"
                    style={{ lineHeight: '16px', letterSpacing: '-0.025em' }}
                  >
                    사진
                  </span>
                </button>
              )}
            </div>
            <p
              className="text-[#A0A0A0] text-[0.625rem] font-semibold"
              style={{ lineHeight: '19.5px', letterSpacing: '0px' }}
            >
              물건 전체와 특징이 잘 보이도록 밝은 곳에서 선명하게 촬영해주세요 (최대 4장)
            </p>
          </div>

          {/* 분실물 이름 */}
          <div className="flex flex-col gap-[0.625rem] mt-[1.5rem]">
            <label
              className="text-[#7F7F7F] text-[0.875rem] font-semibold"
              style={{ lineHeight: '16px', letterSpacing: '0' }}
            >
              분실물 입력
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="분실물 이름을 입력해주세요."
              className={inputClass}
            />
          </div>

          {/* 습득 장소 */}
          <div className="flex flex-col gap-[0.625rem] mt-[1.5rem]">
            <label
              className="text-[#7F7F7F] text-[0.875rem] font-semibold"
              style={{ lineHeight: '16px', letterSpacing: '0' }}
            >
              습득 장소 입력
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
              placeholder="예) 혜인관 앞"
              className={inputClass}
            />
          </div>

          {/* 날짜 */}
          <div className="flex flex-col gap-[0.625rem] mt-[1.5rem]">
            <label
              className="text-[#7F7F7F] text-[0.875rem] font-semibold"
              style={{ lineHeight: '16px', letterSpacing: '0' }}
            >
              날짜 입력
            </label>
            <button
              type="button"
              onClick={() => setDateOpen((v) => !v)}
              className="w-full h-[3.25rem] bg-[#1a1a1a]/20 border border-[#3a3a3a] backdrop-blur-md px-[1rem] flex items-center justify-between"
            >
              <span
                className={`text-[0.9375rem] ${date ? 'text-white' : 'text-[#5a5a5a]'}`}
                style={{ letterSpacing: '-0.025em' }}
              >
                {selectedDateLabel}
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#A0A0A0"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transform: dateOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s',
                }}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {dateOpen && (
              <div className="border border-[#3a3a3a] overflow-hidden backdrop-blur-md">
                {DATE_OPTIONS.map((opt, i) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setForm((prev) => ({ ...prev, date: opt.value }));
                      setDateOpen(false);
                    }}
                    className={`w-full bg-[#1a1a1a]/20 px-[1rem] py-[1rem] text-left text-white text-[0.9375rem] font-semibold ${
                      i < DATE_OPTIONS.length - 1 ? 'border-b border-[#3a3a3a]' : ''
                    } ${date === opt.value ? 'text-[#C43A31]' : ''}`}
                    style={{ letterSpacing: '-0.025em' }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Toast
        visible={showSuccess}
        message="수정이 완료되었습니다"
        onClose={() => setShowSuccess(false)}
        duration={1000}
      />
      <Toast
        visible={showWarning}
        message="모든 정보를 입력해주세요"
        icon="warning"
        onClose={() => setShowWarning(false)}
      />

      <div className="absolute bottom-0 left-0 right-0 px-[1.25rem] pb-[2rem] pt-[1rem] bg-[#1a1a1a]">
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full py-[1.125rem] bg-[#7D2A25] text-white text-[1rem] font-semibold text-center"
          style={{ fontSize: '1rem', lineHeight: '160%', letterSpacing: '0' }}
        >
          분실물 수정하기
        </button>
      </div>
    </div>
  );
}
