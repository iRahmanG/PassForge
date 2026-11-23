import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  headerIcon?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  action,
  headerIcon,
}) => {
  return (
    <div
      className={`bg-white border border-[#E9E5DC] rounded-2xl shadow-sm overflow-hidden ${className}`}
    >
      {(title || action) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E9E5DC] px-6 py-4 gap-3 bg-[#FAF8F5]">
          <div className="flex items-center gap-3 min-w-0">
            {headerIcon && (
              <div className="w-8 h-8 rounded-xl bg-[#FBF2EE] border border-[#F0D5C9] text-[#B86E52] flex items-center justify-center shrink-0">
                {headerIcon}
              </div>
            )}
            <div className="min-w-0">
              {title && (
                <h3 className="text-base font-bold text-[#252525] tracking-tight truncate font-sans">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-[#77736C] mt-0.5 truncate">{subtitle}</p>
              )}
            </div>
          </div>
          {action && <div className="shrink-0 flex items-center gap-2">{action}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};