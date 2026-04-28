import WarningIcon from '@/assets/icons/admin/warning_icon.svg?react';

function Modal({ isOpen, cancelText, confirmText, onCancel, onConfirm, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl mx-8 px-8 py-10 flex flex-col items-center gap-5 w-full max-w-sm">
        <WarningIcon className="[&_path]:fill-[#FFC107]" />
        <div className="text-center flex flex-col gap-1">{children}</div>
        <div className="flex gap-3 w-full mt-1">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-500 font-medium text-sm"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-order-button text-white font-medium text-sm"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
