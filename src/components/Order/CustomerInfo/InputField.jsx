import CheckIcon from '@/assets/icons/check.svg?react';
import WarnIcon from '@/assets/icons/small_warn.svg?react';

const borderClass = (state) => {
  if (state === 'valid') return 'border-order-button';
  if (state === 'invalid') return 'border-warn-orange';
  return 'border-gray-300';
};

const textClass = (state) => {
  if (state === 'valid') return 'text-order-button';
  if (state === 'invalid') return 'text-warn-orange';
  return 'text-gray-400';
};

function InputField({
  placeholder,
  value,
  onChange,
  onKeyDown,
  state,
  errorMessage,
  type = 'text',
}) {
  return (
    <div>
      <div className={`px-2 pb-1 border-b ${borderClass(state)}`}>
        <div className="flex items-center gap-2">
          <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            className={`flex-1 text-xl placeholder-gray-400 outline-none bg-transparent ${textClass(state)}`}
          />
          {state === 'valid' && <CheckIcon className="w-5 h-5 shrink-0" />}
          {state === 'invalid' && <WarnIcon className="w-5 h-5 shrink-0" />}
        </div>
      </div>
      {state === 'invalid' && errorMessage && (
        <p className="text-sm text-warn-orange mt-2 px-2">{errorMessage}</p>
      )}
    </div>
  );
}

export default InputField;
