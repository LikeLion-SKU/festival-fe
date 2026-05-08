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
      <div className={`relative px-2 pb-1 border-b ${borderClass(state)}`}>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          className={`w-full text-xl focus:text-xl placeholder-gray-400 font-medium outline-none bg-transparent pr-7 ${textClass(state)}`}
        />
        {state === 'valid' && (
          <CheckIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5" />
        )}
        {state === 'invalid' && (
          <WarnIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5" />
        )}
      </div>
      {state === 'invalid' && errorMessage && (
        <p className="text-sm text-warn-orange mt-2 px-2">{errorMessage}</p>
      )}
    </div>
  );
}

export default InputField;
