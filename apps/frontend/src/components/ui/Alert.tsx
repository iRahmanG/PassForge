import React from 'react';

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
  const styles = {
    info: 'bg-indigo-950/40 border-indigo-500/40 text-indigo-200',
    success: 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200',
    warning: 'bg-amber-950/40 border-amber-500/40 text-amber-200',
    error: 'bg-rose-950/40 border-rose-500/40 text-rose-200',
  }[type];

  return (
    <div className={`border rounded-lg p-3.5 text-xs ${styles} ${className} flex items-start justify-between`}>
      <div>
        {title && <h5 className="font-bold text-sm mb-1">{title}</h5>}
        <div className="opacity-95 leading-relaxed">{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-3 text-current opacity-60 hover:opacity-100 transition-opacity text-base font-bold leading-none"
        >
          &times;
        </button>
      )}
    </div>
  );
};
