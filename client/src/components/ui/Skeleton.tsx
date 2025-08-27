import React from 'react';
import { cn } from '../../utils/cn';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  animated?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  width,
  height,
  rounded = 'md',
  animated = true,
}) => {
  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  return (
    <div
      className={cn(
        'bg-gray-200',
        roundedClasses[rounded],
        animated && 'animate-pulse',
        className
      )}
      style={{
        width: width,
        height: height,
      }}
    />
  );
};

// Skeleton components específicos
export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 1,
  className,
}) => (
  <div className={cn('space-y-2', className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        height="1rem"
        width={i === lines - 1 ? '75%' : '100%'}
        className="last:mb-0"
      />
    ))}
  </div>
);

export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('p-6 space-y-4', className)}>
    <div className="flex items-center space-x-4">
      <Skeleton width={48} height={48} rounded="full" />
      <div className="flex-1 space-y-2">
        <Skeleton height="1.25rem" width="60%" />
        <Skeleton height="1rem" width="40%" />
      </div>
    </div>
    <SkeletonText lines={3} />
    <div className="flex space-x-2">
      <Skeleton height="2rem" width="6rem" />
      <Skeleton height="2rem" width="4rem" />
    </div>
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number; columns?: number; className?: string }> = ({
  rows = 5,
  columns = 4,
  className,
}) => (
  <div className={cn('space-y-3', className)}>
    {/* Header */}
    <div className="flex space-x-4 pb-2 border-b border-gray-200">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} height="1.25rem" width={`${100 / columns}%`} />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex space-x-4 py-3">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton
            key={colIndex}
            height="1rem"
            width={`${100 / columns}%`}
          />
        ))}
      </div>
    ))}
  </div>
);
