import { SensorData, MaintenanceTask, WeatherData, DashboardStats } from '@/types';
import { generateAdvancedSensorData } from './advancedSimulator';

// 현실적인 센서 데이터 생성 (고급 시뮬레이터 사용)
export function generateSensorData(count: number = 50, rainfall: number = 0): SensorData[] {
  return generateAdvancedSensorData(count, rainfall);
}

// 작업 관리 데이터 생성
export function generateMaintenanceTasks(sensorData: SensorData[]): MaintenanceTask[] {
  const highRiskSensors = sensorData.filter(s => s.status === 'critical' || s.status === 'warning');

  return highRiskSensors.slice(0, 15).map((sensor, index) => ({
    id: `task-${String(index + 1).padStart(3, '0')}`,
    deviceId: sensor.deviceId,
    priority: sensor.status === 'critical' ? 'high' : 'medium',
    status: Math.random() > 0.7 ? 'completed' : Math.random() > 0.5 ? 'in_progress' : 'pending',
    assignedTeam: `청소팀 ${Math.floor(Math.random() * 3) + 1}`,
    estimatedTime: Math.round(Math.random() * 40 + 20), // 20-60분
    route: {
      order: index + 1,
      optimizedPath: `Route-${index + 1}`,
    },
    createdAt: new Date(Date.now() - Math.random() * 86400000), // 최근 24시간 내
  }));
}

// 기상 데이터 생성 (실제 API 사용 시도 후 실패 시 더미 데이터)
export async function generateWeatherData(): Promise<WeatherData> {
  try {
    // 서버 환경에서만 실제 API 호출
    if (typeof window === 'undefined') {
      const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/weather`);
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          return result.data;
        }
      }
    }
  } catch (error) {
    console.log('실제 기상 API 사용 불가, 더미 데이터 사용:', error);
  }

  // 더미 데이터 생성
  const currentTemp = Math.round(Math.random() * 15 + 10); // 10-25°C
  const currentRainfall = Math.round(Math.random() * 50); // 0-50mm

  return {
    location: '강남구',
    temperature: currentTemp,
    humidity: Math.round(Math.random() * 40 + 40), // 40-80%
    rainfall: currentRainfall,
    windSpeed: Math.round(Math.random() * 10 + 5), // 5-15m/s
    forecast: Array.from({ length: 6 }, (_, i) => ({
      time: new Date(Date.now() + i * 3600000).toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      rainfall: Math.round(Math.random() * 80),
      intensity: Math.random() > 0.7 ? 'heavy' : Math.random() > 0.4 ? 'moderate' : 'light' as const,
    })),
  };
}

// 대시보드 통계 생성
export function generateDashboardStats(sensorData: SensorData[], tasks: MaintenanceTask[]): DashboardStats {
  const criticalCount = sensorData.filter(s => s.status === 'critical').length;
  const warningCount = sensorData.filter(s => s.status === 'warning').length;
  const normalCount = sensorData.filter(s => s.status === 'normal').length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;

  return {
    totalDevices: sensorData.length,
    criticalCount,
    warningCount,
    normalCount,
    todayTasks: tasks.length,
    completedTasks,
  };
}

// 실시간 알림 생성
export function generateAlerts(sensorData: SensorData[]) {
  const criticalSensors = sensorData.filter(s => s.status === 'critical');

  return criticalSensors.slice(0, 5).map((sensor, index) => ({
    id: `alert-${index + 1}`,
    location: sensor.location.name,
    message: `빗물받이 막힘 위험 - 수위 ${sensor.measurements.waterLevel}%, 쓰레기량 ${sensor.measurements.debrisLevel}%`,
    severity: 'high' as const,
    timestamp: new Date(Date.now() - Math.random() * 3600000), // 최근 1시간 내
  }));
}