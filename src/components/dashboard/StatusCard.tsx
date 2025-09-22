'use client';

import { LucideIcon } from 'lucide-react';

interface StatusCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  status: 'normal' | 'warning' | 'critical';
  subtitle?: string;
}

export default function StatusCard({
  title,
  value,
  icon: Icon,
  status,
  subtitle
}: StatusCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'critical':
        return 'border-red-500 bg-red-500/10';
      case 'warning':
        return 'border-yellow-500 bg-yellow-500/10';
      default:
        return 'border-green-500 bg-green-500/10';
    }
  };

  const getIconColor = () => {
    switch (status) {
      case 'critical':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      default:
        return 'text-green-400';
    }
  };

  return (
    <div className={`control-panel rounded-lg p-6 border ${getStatusColor()}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {subtitle && (
            <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
          )}
        </div>
        <Icon className={`h-8 w-8 ${getIconColor()} status-indicator`} />
      </div>
    </div>
  );
}