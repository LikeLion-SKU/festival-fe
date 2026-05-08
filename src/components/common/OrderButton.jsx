import CheckIcon from '@/assets/icons/check_white_Icon.svg?react';

export default function OrderButton({
  width,
  height,
  color,
  buttonName,
  onClick,
  showCheckIcon = false,
  textSize = '14px',
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ width, height, backgroundColor: color, fontSize: textSize }}
      className="flex items-center justify-center gap-1 rounded-lg font-medium leading-normal text-white"
    >
      {showCheckIcon && <CheckIcon />}
      <span>{buttonName}</span>
    </button>
  );
}
