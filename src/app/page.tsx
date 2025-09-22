'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import StatusCard from '@/components/dashboard/StatusCard';
import AlertPanel from '@/components/dashboard/AlertPanel';
import MapView from '@/components/dashboard/MapView';
import PredictionView from '@/components/dashboard/PredictionView';
import TaskView from '@/components/dashboard/TaskView';
import RealtimeView from '@/components/dashboard/RealtimeView';
import AlertsView from '@/components/dashboard/AlertsView';
import SettingsView from '@/components/dashboard/SettingsView';
import AboutView from '@/components/dashboard/AboutView';
import {
  generateSensorData,
  generateMaintenanceTasks,
  generateWeatherData,
  generateDashboardStats,
  generateAlerts
} from '@/lib/mockData';
import { SensorData, MaintenanceTask, WeatherData, DashboardStats } from '@/types';
import {
  Monitor,
  AlertTriangle,
  CheckCircle,
  Clock,
  Thermometer,
  CloudRain,
  Wind,
  Droplets
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // 초기 데이터 생성
    const initializeData = async () => {
      const sensors = generateSensorData(1247);
      const maintenanceTasks = generateMaintenanceTasks(sensors);
      const weatherData = await generateWeatherData();
      const dashboardStats = generateDashboardStats(sensors, maintenanceTasks);
      const alertData = generateAlerts(sensors);

      setSensorData(sensors);
      setTasks(maintenanceTasks);
      setWeather(weatherData);
      setStats(dashboardStats);
      setAlerts(alertData);
    };

    initializeData();

    // 실시간 업데이트 시뮬레이션 (5초마다)
    const interval = setInterval(async () => {
      const updatedSensors = generateSensorData(1247);
      const updatedTasks = generateMaintenanceTasks(updatedSensors);
      const updatedStats = generateDashboardStats(updatedSensors, updatedTasks);
      const updatedAlerts = generateAlerts(updatedSensors);

      setSensorData(updatedSensors);
      setTasks(updatedTasks);
      setStats(updatedStats);
      setAlerts(updatedAlerts);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // 컨텐츠 렌더링 함수
  const renderContent = () => {
    if (!stats || !weather) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-white">데이터 로딩 중...</div>
        </div>
      );
    }

    switch (activeTab) {
      case 'map':
        return <MapView sensorData={sensorData} />;
      case 'realtime':
        return <RealtimeView />;
      case 'prediction':
        return <PredictionView sensorData={sensorData} weatherData={weather} />;
      case 'tasks':
        return <TaskView tasks={tasks} sensorData={sensorData} />;
      case 'alerts':
        return <AlertsView sensorData={sensorData} />;
      case 'settings':
        return <SettingsView />;
      case 'about':
        return <AboutView />;
      default:
        return (
          <div className="space-y-6">
        {/* 페이지 헤더 */}
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-white">실시간 관제 대시보드</h2>
          <div className="text-sm text-slate-400">
            마지막 업데이트: {mounted ? new Date().toLocaleTimeString('ko-KR') : '--:--:--'}
          </div>
        </div>

        {/* 상태 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatusCard
            title="모니터링 중인 빗물받이"
            value={stats.totalDevices.toLocaleString()}
            icon={Monitor}
            status="normal"
            subtitle="강남구 전체"
          />
          <StatusCard
            title="위험 상태"
            value={stats.criticalCount}
            icon={AlertTriangle}
            status="critical"
            subtitle="즉시 조치 필요"
          />
          <StatusCard
            title="주의 상태"
            value={stats.warningCount}
            icon={Clock}
            status="warning"
            subtitle="모니터링 필요"
          />
          <StatusCard
            title="정상 상태"
            value={stats.normalCount}
            icon={CheckCircle}
            status="normal"
            subtitle="양호한 상태"
          />
        </div>

        {/* 메인 콘텐츠 영역 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 기상 정보 */}
          <div className="control-panel rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <CloudRain className="h-5 w-5 mr-2" />
              기상 정보
            </h3>

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
          </div>

          {/* 작업 현황 */}
          <div className="control-panel rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">오늘의 작업 현황</h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">전체 작업</span>
                <span className="text-white font-semibold">{stats.todayTasks}건</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">완료됨</span>
                <span className="text-green-400 font-semibold">{stats.completedTasks}건</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">진행 중</span>
                <span className="text-yellow-400 font-semibold">
                  {tasks.filter(t => t.status === 'in_progress').length}건
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">대기 중</span>
                <span className="text-blue-400 font-semibold">
                  {tasks.filter(t => t.status === 'pending').length}건
                </span>
              </div>

              <div className="mt-4">
                <div className="bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${(stats.completedTasks / stats.todayTasks) * 100}%`
                    }}
                  ></div>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  완료율: {Math.round((stats.completedTasks / stats.todayTasks) * 100)}%
                </p>
              </div>
            </div>
          </div>

          {/* 긴급 알림 */}
          <div className="lg:row-span-2">
            <AlertPanel alerts={alerts} />
          </div>
        </div>

        {/* 우선 청소 대상 */}
        <div className="control-panel rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">우선 청소 대상 (TOP 10)</h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-2 text-slate-400 text-sm">순위</th>
                  <th className="text-left py-2 text-slate-400 text-sm">위치</th>
                  <th className="text-left py-2 text-slate-400 text-sm">위험도</th>
                  <th className="text-left py-2 text-slate-400 text-sm">상태</th>
                  <th className="text-left py-2 text-slate-400 text-sm">작업팀</th>
                </tr>
              </thead>
              <tbody>
                {sensorData.slice(0, 10).map((sensor, index) => {
                  const task = tasks.find(t => t.deviceId === sensor.deviceId);
                  return (
                    <tr key={sensor.id} className="border-b border-slate-800">
                      <td className="py-3 text-white font-semibold">{index + 1}</td>
                      <td className="py-3 text-slate-300">{sensor.location.name}</td>
                      <td className="py-3">
                        <span className={`font-semibold ${
                          sensor.riskAnalysis.currentRisk >= 80 ? 'text-red-400' :
                          sensor.riskAnalysis.currentRisk >= 50 ? 'text-yellow-400' :
                          'text-green-400'
                        }`}>
                          {sensor.riskAnalysis.currentRisk}%
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          sensor.status === 'critical' ? 'bg-red-500/20 text-red-400' :
                          sensor.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {sensor.status === 'critical' ? '위험' :
                           sensor.status === 'warning' ? '주의' : '정상'}
                        </span>
                      </td>
                      <td className="py-3 text-slate-300">
                        {task ? task.assignedTeam : '미배정'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
          </div>
        );
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}
