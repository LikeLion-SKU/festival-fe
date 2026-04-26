import CheckIcon from '@/assets/icons/check_white_icon.svg?react';

export default function OrderButton({
  width,
  height,
  color,
  buttonName,
  onClick,
  showCheckIcon = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ width, height, backgroundColor: color }}
      className="flex items-center justify-center gap-1 rounded-lg text-[14px] font-semibold leading-[1.5] text-white"
    >
      {showCheckIcon && <CheckIcon />}
      <span>{buttonName}</span>
    </button>
  );
}
