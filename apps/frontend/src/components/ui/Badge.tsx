import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | 'vip'
    | 'general'
    | 'speaker'
    | 'student'
    | 'success'
    | 'warning'
    | 'error'
    | 'cyan'
    | 'purple'
    | 'default';
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  icon,
}) => {
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-xs';

  const variantClass =
    {
      vip: 'bg-[#FBF2EE] text-[#B86E52] border border-[#F0D5C9] font-bold',
      speaker: 'bg-[#F0F4F8] text-[#2C3E50] border border-[#D4E0EC] font-semibold',
      student: 'bg-[#F2F5F0] text-[#55684D] border border-[#D8E0D4] font-semibold',
      general: 'bg-[#F0EDE6] text-[#504D47] border border-[#E0DDD4] font-medium',
      cyan: 'bg-[#ECF8FA] text-[#0E7490] border border-[#CFEBF0] font-semibold',
      purple: 'bg-[#F6F2FA] text-[#6D28D9] border border-[#E5DBF5] font-semibold',
      success: 'bg-[#EEF6F0] text-[#2E683E] border border-[#C6E2CD] font-semibold',
      warning: 'bg-[#FDF6E8] text-[#945B0E] border border-[#F3E0BA] font-semibold',
      error: 'bg-[#FDF0F0] text-[#A83232] border border-[#F5CCCC] font-semibold',
      default: 'bg-[#F0EDE6] text-[#504D47] border border-[#E0DDD4] font-medium',
    }[variant] || 'bg-[#F0EDE6] text-[#504D47] border border-[#E0DDD4]';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-mono uppercase tracking-wider shrink-0 ${sizeClass} ${variantClass} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};