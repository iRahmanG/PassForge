import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  icon,
  className = '',
  id,
  required,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/[^a-z0-9]/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="flex items-center justify-between text-xs font-semibold text-[#35332F]"
        >
          <span>
            {label} {required && <span className="text-[#A83232] ml-0.5">*</span>}
          </span>
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-3.5 text-[#9E9A90] pointer-events-none shrink-0 flex items-center">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          required={required}
          className={`w-full h-10.5 bg-white border ${
            error
              ? 'border-[#F5CCCC] text-[#A83232] focus:border-[#A83232] focus:ring-[#A83232]/15'
              : 'border-[#DDD8CD] text-[#252525] focus:border-[#B86E52] focus:ring-[#B86E52]/15'
          } rounded-xl ${
            icon ? 'pl-10 pr-3.5' : 'px-3.5'
          } py-2 text-sm placeholder-[#9E9A90] transition-all focus:outline-none focus:ring-2 ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-[#A83232] font-medium">{error}</p>}
      {helperText && !error && <p className="text-[11px] text-[#77736C]">{helperText}</p>}
    </div>
  );
};