import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '5xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = '2xl',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
  }[maxWidth];

  return (
    <div
      className="fixed inset-0 top-0 right-0 bottom-0 left-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-900/40 backdrop-blur-xs"
      style={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0 }}
    >
      {/* Backdrop overlay dismiss */}
      <div
        className="absolute inset-0 top-0 right-0 bottom-0 left-0"
        style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
        onClick={onClose}
      />

      <div
        className={`relative w-full ${widthClass} bg-white border border-[#E9E5DC] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E9E5DC] bg-[#FAF8F5]">
          <div className="flex-1 min-w-0 pr-4">{title}</div>
          <button
            onClick={onClose}
            className="text-[#77736C] hover:text-[#252525] transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F0EDE6] border border-transparent hover:border-[#DDD8CD] focus:outline-none cursor-pointer"
            title="Close modal (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};