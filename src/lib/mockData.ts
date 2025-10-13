import { SensorData, MaintenanceTask, WeatherData, DashboardStats } from '@/types';
import { generateAdvancedSensorData } from './advancedSimulator';

// 현실적인 센서 데이터 생성 (고급 시뮬레이터 사용)
export function generateSensorData(count: number = 50, rainfall: number = 0): SensorData[] {
  return generateAdvancedSensorData(count, rainfall);
}

// 작업 관리 데이터 생성
export function generateMaintenanceTasks(sensorData: SensorData[]): MaintenanceTask[] {
  const tasks: MaintenanceTask[] = [];

  // 1. 위험/주의 상태 센서는 긴급 작업 생성
  const highRiskSensors = sensorData.filter(s => s.status === 'critical' || s.status === 'warning');
  highRiskSensors.slice(0, 10).forEach((sensor, index) => {
    tasks.push({
      id: `task-${String(tasks.length + 1).padStart(3, '0')}`,
      deviceId: sensor.deviceId,
      priority: sensor.status === 'critical' ? 'high' : 'medium',
      status: Math.random() > 0.7 ? 'completed' : Math.random() > 0.5 ? 'in_progress' : 'pending',
      assignedTeam: `청소팀 ${Math.floor(Math.random() * 3) + 1}`,
      estimatedTime: Math.round(Math.random() * 40 + 20), // 20-60분
      route: {
        order: tasks.length + 1,
        optimizedPath: `Route-${tasks.length + 1}`,
      },
      createdAt: new Date(Date.now() - Math.random() * 86400000), // 최근 24시간 내
    });
  });

  // 2. 정상 상태 센서 중 일부는 정기 점검/청소 작업 생성
  const normalSensors = sensorData.filter(s => s.status === 'normal');
  const regularMaintenanceCount = Math.min(20, Math.floor(normalSensors.length * 0.1)); // 정상 센서의 10%, 최대 20개

  normalSensors.slice(0, regularMaintenanceCount).forEach((sensor, index) => {
    tasks.push({
      id: `task-${String(tasks.length + 1).padStart(3, '0')}`,
      deviceId: sensor.deviceId,
      priority: 'low', // 정기 작업은 낮은 우선순위
      status: Math.random() > 0.6 ? 'completed' : Math.random() > 0.4 ? 'in_progress' : 'pending',
      assignedTeam: `청소팀 ${Math.floor(Math.random() * 3) + 1}`,
      estimatedTime: Math.round(Math.random() * 30 + 15), // 15-45분
      route: {
        order: tasks.length + 1,
        optimizedPath: `Route-${tasks.length + 1}`,
      },
      createdAt: new Date(Date.now() - Math.random() * 86400000), // 최근 24시간 내
    });
  });

  // 순서 재조정 (우선순위 높은 것부터)
  tasks.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  // 순서 번호 재할당
  tasks.forEach((task, index) => {
    task.route.order = index + 1;
  });

  return tasks;
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
  const alerts: Array<{
    id: string;
    severity: 'high' | 'medium' | 'low';
    message: string;
    timestamp: Date;
    location: string;
  }> = [];

  // 위험 상태 센서 알림 (최대 5개)
  const criticalSensors = sensorData.filter(s => s.status === 'critical');
  criticalSensors.slice(0, 5).forEach((sensor, index) => {
    alerts.push({
      id: `alert-critical-${index + 1}`,
      severity: 'high',
      location: sensor.location.name,
      message: `긴급: 빗물받이 막힘 위험 - 수위 ${sensor.measurements.waterLevel}%, 쓰레기량 ${sensor.measurements.debrisLevel}%`,
      timestamp: new Date(Date.now() - Math.random() * 1800000), // 최근 30분 내
    });
  });

  // 주의 상태 센서 알림 (최대 3개)
  const warningSensors = sensorData.filter(s => s.status === 'warning');
  warningSensors.slice(0, 3).forEach((sensor, index) => {
    alerts.push({
      id: `alert-warning-${index + 1}`,
      severity: 'medium',
      location: sensor.location.name,
      message: `주의: 수위 상승 감지 - 수위 ${sensor.measurements.waterLevel}%, 점검 필요`,
      timestamp: new Date(Date.now() - Math.random() * 3600000), // 최근 1시간 내
    });
  });

  // 일반 정보 알림 (시스템 상태)
  if (alerts.length < 3) {
    alerts.push({
      id: 'alert-info-1',
      severity: 'low',
      location: '시스템',
      message: `정상 작동 중 - 모니터링 중인 센서 ${sensorData.length}개`,
      timestamp: new Date(Date.now() - Math.random() * 7200000), // 최근 2시간 내
    });
  }

  // 시간순 정렬 (최신순)
  alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return alerts.slice(0, 10); // 최대 10개 알림
}