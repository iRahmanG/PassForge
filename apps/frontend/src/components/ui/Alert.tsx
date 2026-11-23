import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

interface AlertProps {
  children: React.ReactNode;
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  className?: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  children,
  type = 'info',
  title,
  className = '',
  onClose,
}) => {
  const config = {
    info: {
      container: 'bg-[#F2F5F0] border-[#D8E0D4] text-[#35332F]',
      icon: <Info className="w-4 h-4 text-[#77866F] shrink-0 mt-0.5" />,
      titleColor: 'text-[#252525]',
    },
    success: {
      container: 'bg-[#EEF6F0] border-[#C6E2CD] text-[#252525]',
      icon: <CheckCircle2 className="w-4 h-4 text-[#2E683E] shrink-0 mt-0.5" />,
      titleColor: 'text-[#2E683E]',
    },
    warning: {
      container: 'bg-[#FDF6E8] border-[#F3E0BA] text-[#35332F]',
      icon: <AlertTriangle className="w-4 h-4 text-[#945B0E] shrink-0 mt-0.5" />,
      titleColor: 'text-[#945B0E]',
    },
    error: {
      container: 'bg-[#FDF0F0] border-[#F5CCCC] text-[#35332F]',
      icon: <AlertCircle className="w-4 h-4 text-[#A83232] shrink-0 mt-0.5" />,
      titleColor: 'text-[#A83232]',
    },
  }[type];

  return (
    <div
      className={`border rounded-2xl p-4 text-xs ${config.container} ${className} flex items-start gap-3 shadow-sm`}
    >
      {config.icon}
      <div className="flex-1 min-w-0">
        {title && <h5 className={`font-bold text-sm mb-1 ${config.titleColor}`}>{title}</h5>}
        <div className="leading-relaxed text-[#4A4641]">{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-[#9E9A90] hover:text-[#252525] p-1 rounded-md transition-colors shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};