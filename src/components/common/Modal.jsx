import WarningIcon from '@/assets/icons/admin/warning_icon.svg?react';

function Modal({
  isOpen,
  cancelText,
  confirmText,
  onCancel,
  onConfirm,
  isConfirmDisabled,
  children,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      style={{ animation: 'modal-backdrop-in 0.4s ease both' }}
    >
      <style>{`
        @keyframes modal-backdrop-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modal-card-in {
          from { opacity: 0; transform: scale(0.93) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
      <div
        className="bg-white rounded-2xl mx-8 px-8 pt-9 pb-5 flex flex-col items-center w-full max-w-sm"
        style={{ animation: 'modal-card-in 0.3s cubic-bezier(0.34,1.56,0.64,1) both' }}
      >
        <WarningIcon />
        <div className="text-center flex flex-col mt-3 gap-1">{children}</div>
        <div className="flex gap-3 w-full mt-6">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-lg bg-gray-100 text-gray-500 font-medium text-sm"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isConfirmDisabled}
            className="flex-1 py-3 rounded-lg bg-order-button text-white font-medium text-sm disabled:opacity-50"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
