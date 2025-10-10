'use client';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  count?: number;
}

export default function Skeleton({
  className = '',
  variant = 'text',
  width,
  height,
  count = 1
}: SkeletonProps) {
  const getVariantClass = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full';
      case 'rectangular':
        return 'rounded-lg';
      case 'text':
      default:
        return 'rounded';
    }
  };

  const baseClass = 'bg-slate-700 animate-pulse';
  const variantClass = getVariantClass();

  const style: React.CSSProperties = {
    width: width || '100%',
    height: height || (variant === 'text' ? '1rem' : '100%')
  };

  if (count === 1) {
    return <div className={`${baseClass} ${variantClass} ${className}`} style={style} />;
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={`${baseClass} ${variantClass} ${className}`} style={style} />
      ))}
    </div>
  );
}

// 사전 정의된 스켈레톤 레이아웃
export function SkeletonCard() {
  return (
    <div className="control-panel rounded-lg p-6">
      <div className="flex items-center space-x-4 mb-4">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1">
          <Skeleton width="60%" height={20} className="mb-2" />
          <Skeleton width="40%" height={16} />
        </div>
      </div>
      <Skeleton count={3} className="mb-2" />
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="control-panel rounded-lg p-6">
      <Skeleton width="30%" height={24} className="mb-4" />
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center space-x-4">
            <Skeleton width={50} height={50} variant="rectangular" />
            <div className="flex-1">
              <Skeleton width="80%" height={20} className="mb-2" />
              <Skeleton width="60%" height={16} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <Skeleton width="40%" height={32} />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="control-panel rounded-lg p-4">
            <Skeleton width="60%" height={16} className="mb-2" />
            <Skeleton width="40%" height={32} />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SkeletonTable />
        </div>
        <div>
          <SkeletonCard />
        </div>
      </div>
    </div>
  );
}
