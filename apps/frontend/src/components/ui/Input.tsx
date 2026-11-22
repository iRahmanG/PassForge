import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full bg-slate-950/70 border ${
          error ? 'border-rose-500/80 focus:border-rose-500' : 'border-slate-800 focus:border-indigo-500'
        } rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-500/50 ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-rose-400 mt-1 font-medium">{error}</p>}
      {helperText && !error && <p className="text-xs text-slate-500 mt-1">{helperText}</p>}
    </div>
  );
};
