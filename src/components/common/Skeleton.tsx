import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'text';
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  variant = 'rectangular' 
}) => {
  const baseClasses = 'bg-slate-200/80 dark:bg-slate-800/80 relative overflow-hidden animate-pulse';
  
  const variantClasses = {
    rectangular: 'rounded-2xl',
    circular: 'rounded-full',
    text: 'rounded-md h-4 w-full',
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {/* Shimmer gradient effect */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent animate-[shimmer_1.6s_infinite]" />
    </div>
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 p-5 space-y-4 shadow-xs">
      <Skeleton className="h-36 w-full rounded-2xl" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <Skeleton className="h-8 flex-1 rounded-xl" />
        <Skeleton className="h-8 w-8 rounded-xl" />
      </div>
    </div>
  );
};

export const GridSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
};
