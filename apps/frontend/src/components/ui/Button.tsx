import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none select-none shrink-0 cursor-pointer disabled:cursor-not-allowed';

  const sizeClasses = {
    sm: 'h-8 px-3 text-xs gap-1.5',
    md: 'h-10 px-4 text-xs sm:text-sm gap-2',
    lg: 'h-11 px-5 text-sm sm:text-base gap-2.5',
  }[size];

  const variantClasses = {
    primary:
      'bg-[#B86E52] hover:bg-[#A15D43] text-white shadow-sm border border-[#A15D43] focus:ring-2 focus:ring-[#B86E52]/25 active:scale-[0.98] disabled:opacity-50 disabled:hover:bg-[#B86E52]',
    secondary:
      'bg-[#F0EDE6] hover:bg-[#E5E0D5] text-[#252525] border border-[#DDD8CD] focus:ring-2 focus:ring-[#B86E52]/20 active:scale-[0.98] disabled:opacity-50',
    outline:
      'bg-white hover:bg-[#F7F5F0] text-[#252525] border border-[#DDD8CD] hover:border-[#C5BFB2] focus:ring-2 focus:ring-[#B86E52]/20 active:scale-[0.98] disabled:opacity-50',
    danger:
      'bg-[#FDF0F0] hover:bg-[#FBE4E4] text-[#A83232] border border-[#F5CCCC] focus:ring-2 focus:ring-[#A83232]/20 active:scale-[0.98] disabled:opacity-50',
    ghost:
      'bg-transparent hover:bg-[#F0EDE6] text-[#77736C] hover:text-[#252525] border border-transparent disabled:opacity-50',
  }[variant];

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin mr-1 shrink-0" />
      ) : icon ? (
        <span className="shrink-0 inline-flex items-center">{icon}</span>
      ) : null}
      <span>{children}</span>
    </button>
  );
};