'use client';

import { AlertTriangle, Clock, MapPin } from 'lucide-react';

interface Alert {
  id: string;
  location: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: Date;
}

interface AlertPanelProps {
  alerts: Alert[];
}

export default function AlertPanel({ alerts }: AlertPanelProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-400 bg-red-500/20';
      case 'medium':
        return 'text-yellow-400 bg-yellow-500/20';
      default:
        return 'text-blue-400 bg-blue-500/20';
    }
  };

  return (
    <div className="control-panel rounded-lg p-6">
      <div className="flex items-center mb-4">
        <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
        <h3 className="text-lg font-semibold text-white">긴급 알림</h3>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="border border-slate-700 rounded-lg p-4 hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(
                      alert.severity
                    )}`}
                  >
                    {alert.severity.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center text-sm text-slate-300 mb-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  {alert.location}
                </div>

                <p className="text-white mb-2">{alert.message}</p>

                <div className="flex items-center text-xs text-slate-400">
                  <Clock className="h-3 w-3 mr-1" />
                  {alert.timestamp.toLocaleTimeString('ko-KR')}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {alerts.length === 0 && (
        <div className="text-center py-8">
          <p className="text-slate-400">현재 긴급 알림이 없습니다</p>
        </div>
      )}
    </div>
  );
}