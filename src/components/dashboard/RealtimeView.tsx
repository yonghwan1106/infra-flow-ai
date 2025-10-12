'use client';

import { useEffect, useState } from 'react';
import { useRealtime } from '@/hooks/useRealtime';
import {
  Activity,
  Wifi,
  WifiOff,
  RefreshCw,
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
  const { data, isConnected, error, reconnect } = useRealtime();
  const [previousData, setPreviousData] = useState<{ data: { criticalCount: number; warningCount: number; completedTasks: number } } | null>(null);
  const [trends, setTrends] = useState<{
    critical: 'up' | 'down' | 'same';
    warning: 'up' | 'down' | 'same';
    tasks: 'up' | 'down' | 'same';
  }>({ critical: 'same', warning: 'same', tasks: 'same' });

  // 트렌드 계산
  useEffect(() => {
    if (data?.data && previousData?.data) {
      const newTrends = {
        critical: data.data.criticalCount > previousData.data.criticalCount ? 'up' as const :
                 data.data.criticalCount < previousData.data.criticalCount ? 'down' as const : 'same' as const,
        warning: data.data.warningCount > previousData.data.warningCount ? 'up' as const :
                data.data.warningCount < previousData.data.warningCount ? 'down' as const : 'same' as const,
        tasks: data.data.completedTasks > previousData.data.completedTasks ? 'up' as const :
              data.data.completedTasks < previousData.data.completedTasks ? 'down' as const : 'same' as const,
      };
      setTrends(newTrends);
    }

    if (data?.data) {
      setPreviousData(data);
    }
  }, [data, previousData]);

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
            {isConnected ? (
              <>
                <Wifi className="h-5 w-5 text-green-400" />
                <span className="text-green-400 text-sm">실시간 연결됨</span>
              </>
            ) : (
              <>
                <WifiOff className="h-5 w-5 text-red-400" />
                <span className="text-red-400 text-sm">연결 끊김</span>
              </>
            )}
          </div>

          {/* 재연결 버튼 */}
          {(error || !isConnected) && (
            <button
              onClick={reconnect}
              className="flex items-center space-x-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm"
            >
              <RefreshCw className="h-4 w-4" />
              <span>재연결</span>
            </button>
          )}

          {/* 마지막 업데이트 시간 */}
          {data?.timestamp && (
            <div className="text-sm text-slate-400">
              {new Date(data.timestamp).toLocaleTimeString('ko-KR')}
            </div>
          )}
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
            <span className="text-red-400">연결 오류: {error}</span>
          </div>
        </div>
      )}

      {/* 실시간 상태 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="control-panel rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">위험 상태</p>
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-bold text-red-400">
                  {data?.data?.criticalCount || 0}
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
                  {data?.data?.warningCount || 0}
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
                {data?.data?.normalCount || 0}
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
                  {data?.data?.completedTasks || 0}
                </p>
                {getTrendIcon(trends.tasks)}
              </div>
              <p className="text-xs text-slate-500">
                / {data?.data?.totalTasks || 0} 총 작업
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

          {data?.data?.weather && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Thermometer className="h-4 w-4 text-blue-400 mr-2" />
                  <div>
                    <p className="text-sm text-slate-400">온도</p>
                    <p className="text-white font-semibold">{data.data.weather.temperature}°C</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Droplets className="h-4 w-4 text-blue-400 mr-2" />
                  <div>
                    <p className="text-sm text-slate-400">습도</p>
                    <p className="text-white font-semibold">{data.data.weather.humidity}%</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <CloudRain className="h-4 w-4 text-blue-400 mr-2" />
                  <div>
                    <p className="text-sm text-slate-400">강수량</p>
                    <p className="text-white font-semibold">{data.data.weather.rainfall}mm</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Wind className="h-4 w-4 text-blue-400 mr-2" />
                  <div>
                    <p className="text-sm text-slate-400">풍속</p>
                    <p className="text-white font-semibold">{data.data.weather.windSpeed}m/s</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-slate-400 mb-2">6시간 강수 예보</p>
                <div className="space-y-2">
                  {data.data.weather.forecast.slice(0, 3).map((forecast, index) => (
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
            {data?.data?.criticalSensors?.map((sensor, index) => (
              <div key={sensor.id} className="bg-slate-800 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{index + 1}. {sensor.location}</span>
                  <span className="text-red-400 font-bold">{sensor.riskScore}%</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-slate-400">
                    수위: <span className="text-white">{sensor.waterLevel}%</span>
                  </div>
                  <div className="text-slate-400">
                    쓰레기: <span className="text-white">{sensor.debrisLevel}%</span>
                  </div>
                </div>
              </div>
            )) || (
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
            {data?.data?.alerts?.map((alert) => (
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
                  {new Date(alert.timestamp).toLocaleTimeString('ko-KR')}
                </div>
              </div>
            )) || (
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
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-slate-300">
                실시간 연결: {isConnected ? '활성' : '비활성'}
              </span>
            </div>
            <div className="text-sm text-slate-400">
              업데이트 주기: 3초
            </div>
          </div>

          {data?.timestamp && (
            <div className="text-sm text-slate-400">
              마지막 업데이트: {new Date(data.timestamp).toLocaleString('ko-KR')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}