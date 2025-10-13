'use client';

import { useEffect, useState } from 'react';
import { useData } from '@/contexts/DataContext';
import {
  Activity,
  Wifi,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  Thermometer,
  CloudRain,
  Droplets,
  Wind
} from 'lucide-react';

export default function RealtimeView() {
  const { sensorData, tasks, weather, stats, alerts } = useData(); // Context에서 모든 데이터 가져오기
  const [previousStats, setPreviousStats] = useState<{ criticalCount: number; warningCount: number; completedTasks: number } | null>(null);
  const [trends, setTrends] = useState<{
    critical: 'up' | 'down' | 'same';
    warning: 'up' | 'down' | 'same';
    tasks: 'up' | 'down' | 'same';
  }>({ critical: 'same', warning: 'same', tasks: 'same' });

  // 트렌드 계산
  useEffect(() => {
    if (stats && previousStats) {
      const newTrends = {
        critical: stats.criticalCount > previousStats.criticalCount ? 'up' as const :
                 stats.criticalCount < previousStats.criticalCount ? 'down' as const : 'same' as const,
        warning: stats.warningCount > previousStats.warningCount ? 'up' as const :
                stats.warningCount < previousStats.warningCount ? 'down' as const : 'same' as const,
        tasks: stats.completedTasks > previousStats.completedTasks ? 'up' as const :
              stats.completedTasks < previousStats.completedTasks ? 'down' as const : 'same' as const,
      };
      setTrends(newTrends);
    }

    if (stats) {
      setPreviousStats({
        criticalCount: stats.criticalCount,
        warningCount: stats.warningCount,
        completedTasks: stats.completedTasks
      });
    }
  }, [stats, previousStats]);

  const getTrendIcon = (trend: 'up' | 'down' | 'same') => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-red-400" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-green-400" />;
      default: return <Minus className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white flex items-center">
          <Activity className="h-8 w-8 mr-3 text-blue-400" />
          실시간 모니터링
        </h2>
        <div className="flex items-center space-x-4">
          {/* 연결 상태 */}
          <div className="flex items-center space-x-2">
            <Wifi className="h-5 w-5 text-green-400" />
            <span className="text-green-400 text-sm">실시간 연결됨</span>
          </div>

          {/* 업데이트 시간 */}
          <div className="text-sm text-slate-400">
            업데이트 주기: 5초
          </div>
        </div>
      </div>

      {/* 실시간 상태 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="control-panel rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">위험 상태</p>
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-bold text-red-400">
                  {stats?.criticalCount || 0}
                </p>
                {getTrendIcon(trends.critical)}
              </div>
            </div>
            <div className="w-3 h-3 bg-red-500 rounded-full status-indicator"></div>
          </div>
        </div>

        <div className="control-panel rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">주의 상태</p>
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-bold text-yellow-400">
                  {stats?.warningCount || 0}
                </p>
                {getTrendIcon(trends.warning)}
              </div>
            </div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          </div>
        </div>

        <div className="control-panel rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">정상 상태</p>
              <p className="text-2xl font-bold text-green-400">
                {stats?.normalCount || 0}
              </p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </div>

        <div className="control-panel rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">완료된 작업</p>
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-bold text-white">
                  {stats?.completedTasks || 0}
                </p>
                {getTrendIcon(trends.tasks)}
              </div>
              <p className="text-xs text-slate-500">
                / {stats?.todayTasks || 0} 총 작업
              </p>
            </div>
            <Clock className="h-6 w-6 text-blue-400" />
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 실시간 기상 정보 */}
        <div className="control-panel rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <CloudRain className="h-5 w-5 mr-2" />
            기상 정보
          </h3>

          {weather && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Thermometer className="h-4 w-4 text-blue-400 mr-2" />
                  <div>
                    <p className="text-sm text-slate-400">온도</p>
                    <p className="text-white font-semibold">{weather.temperature}°C</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Droplets className="h-4 w-4 text-blue-400 mr-2" />
                  <div>
                    <p className="text-sm text-slate-400">습도</p>
                    <p className="text-white font-semibold">{weather.humidity}%</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <CloudRain className="h-4 w-4 text-blue-400 mr-2" />
                  <div>
                    <p className="text-sm text-slate-400">강수량</p>
                    <p className="text-white font-semibold">{weather.rainfall}mm</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Wind className="h-4 w-4 text-blue-400 mr-2" />
                  <div>
                    <p className="text-sm text-slate-400">풍속</p>
                    <p className="text-white font-semibold">{weather.windSpeed}m/s</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-slate-400 mb-2">6시간 강수 예보</p>
                <div className="space-y-2">
                  {weather.forecast.slice(0, 3).map((forecast, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-slate-300">{forecast.time}</span>
                      <span className="text-white">{forecast.rainfall}mm</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 위험 센서 목록 */}
        <div className="control-panel rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            위험 센서 TOP 5
          </h3>

          <div className="space-y-3">
            {sensorData.filter(s => s.status === 'critical').slice(0, 5).map((sensor, index) => (
              <div key={sensor.id} className="bg-slate-800 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{index + 1}. {sensor.location.name}</span>
                  <span className="text-red-400 font-bold">{sensor.riskAnalysis.currentRisk}%</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-slate-400">
                    수위: <span className="text-white">{sensor.measurements.waterLevel}%</span>
                  </div>
                  <div className="text-slate-400">
                    쓰레기: <span className="text-white">{sensor.measurements.debrisLevel}%</span>
                  </div>
                </div>
              </div>
            ))}
            {sensorData.filter(s => s.status === 'critical').length === 0 && (
              <div className="text-center py-4">
                <p className="text-slate-400">위험 센서가 없습니다</p>
              </div>
            )}
          </div>
        </div>

        {/* 실시간 알림 */}
        <div className="control-panel rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            실시간 알림
          </h3>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {alerts.slice(0, 3).map((alert) => (
              <div key={alert.id} className="border border-slate-700 rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    alert.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                    alert.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {alert.severity.toUpperCase()}
                  </span>
                </div>

                <p className="text-white text-sm mb-1">{alert.location}</p>
                <p className="text-slate-300 text-sm mb-2">{alert.message}</p>

                <div className="text-xs text-slate-400">
                  {alert.timestamp.toLocaleTimeString('ko-KR')}
                </div>
              </div>
            ))}
            {alerts.length === 0 && (
              <div className="text-center py-4">
                <p className="text-slate-400">새로운 알림이 없습니다</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 연결 상태 정보 */}
      <div className="control-panel rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-sm text-slate-300">
                실시간 연결: 활성
              </span>
            </div>
            <div className="text-sm text-slate-400">
              업데이트 주기: 5초
            </div>
          </div>

          <div className="text-sm text-slate-400">
            대시보드와 동기화됨
          </div>
        </div>
      </div>
    </div>
  );
}