import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'vip' | 'general' | 'speaker' | 'student' | 'success' | 'warning' | 'error' | 'default';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  const variantClass = {
    vip: 'bg-amber-950/60 text-amber-300 border border-amber-600/40 font-bold',
    speaker: 'bg-cyan-950/60 text-cyan-300 border border-cyan-600/40 font-bold',
    student: 'bg-emerald-950/60 text-emerald-300 border border-emerald-600/40 font-semibold',
    general: 'bg-slate-800 text-slate-300 border border-slate-700 font-semibold',
    success: 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 font-semibold',
    warning: 'bg-amber-950/60 text-amber-400 border border-amber-500/30 font-semibold',
    error: 'bg-rose-950/60 text-rose-400 border border-rose-500/30 font-semibold',
    default: 'bg-slate-800 text-slate-300 border border-slate-700 font-medium',
  }[variant] || 'bg-slate-800 text-slate-300 border border-slate-700';

  return (
    <span className={`inline-flex items-center rounded-full font-mono uppercase tracking-wider ${sizeClass} ${variantClass} ${className}`}>
      {children}
    </span>
  );
};
