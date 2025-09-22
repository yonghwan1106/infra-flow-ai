import { SensorData, MaintenanceTask, WeatherData, DashboardStats } from '@/types';

// 강남구 주요 위치 좌표
const gangnamLocations = [
  { name: '강남역 2번 출구', lat: 37.4979, lng: 127.0276, district: '강남구' },
  { name: '역삼역 1번 출구', lat: 37.5000, lng: 127.0364, district: '강남구' },
  { name: '선릉역 3번 출구', lat: 37.5044, lng: 127.0492, district: '강남구' },
  { name: '테헤란로 123번지', lat: 37.4996, lng: 127.0317, district: '강남구' },
  { name: '삼성역 2번 출구', lat: 37.5091, lng: 127.0627, district: '강남구' },
  { name: '봉은사로 456번지', lat: 37.5105, lng: 127.0591, district: '강남구' },
  { name: '논현로 789번지', lat: 37.5109, lng: 127.0227, district: '강남구' },
  { name: '압구정로 321번지', lat: 37.5274, lng: 127.0286, district: '강남구' },
  { name: '신사역 4번 출구', lat: 37.5160, lng: 127.0202, district: '강남구' },
  { name: '청담동 카페거리', lat: 37.5196, lng: 127.0408, district: '강남구' },
];

// 현실적인 센서 데이터 생성
export function generateSensorData(count: number = 50): SensorData[] {
  const sensors: SensorData[] = [];

  for (let i = 0; i < count; i++) {
    const location = gangnamLocations[Math.floor(Math.random() * gangnamLocations.length)];
    const baseWaterLevel = Math.random() * 100;
    const baseDebrisLevel = Math.random() * 100;

    // 위험도 계산 (수위 + 쓰레기량 + 날씨 요인)
    const weatherFactor = Math.random() * 20; // 기상 영향
    const currentRisk = Math.min(100, (baseWaterLevel * 0.4 + baseDebrisLevel * 0.4 + weatherFactor * 0.2));

    // 예측 위험도 (현재 + 변화량)
    const predictedRisk = Math.min(100, currentRisk + (Math.random() - 0.5) * 30);

    // 상태 결정
    let status: 'normal' | 'warning' | 'critical';
    if (currentRisk >= 80) status = 'critical';
    else if (currentRisk >= 50) status = 'warning';
    else status = 'normal';

    // 위험 요인 생성
    const factors = [];
    if (baseWaterLevel > 70) factors.push('높은 수위');
    if (baseDebrisLevel > 60) factors.push('쓰레기 축적');
    if (weatherFactor > 15) factors.push('집중강우 예보');
    if (factors.length === 0) factors.push('정상 범위');

    // AI 권장사항 생성
    let recommendation = '';
    if (status === 'critical') {
      recommendation = '즉시 청소 및 점검 필요. 긴급 대응팀 파견 권장.';
    } else if (status === 'warning') {
      recommendation = '2시간 내 청소 작업 권장. 상황 모니터링 필요.';
    } else {
      recommendation = '정상 상태. 정기 점검 일정에 따라 관리.';
    }

    sensors.push({
      id: `sensor-${String(i + 1).padStart(3, '0')}`,
      deviceId: `INF-GN-${String(i + 1).padStart(3, '0')}`,
      location: {
        ...location,
        lat: location.lat + (Math.random() - 0.5) * 0.01, // 위치에 약간의 변화 추가
        lng: location.lng + (Math.random() - 0.5) * 0.01,
      },
      measurements: {
        waterLevel: Math.round(baseWaterLevel),
        debrisLevel: Math.round(baseDebrisLevel),
        flowRate: Math.round(Math.random() * 500 + 100), // 100-600 L/min
        temperature: Math.round(Math.random() * 10 + 15), // 15-25°C
      },
      riskAnalysis: {
        currentRisk: Math.round(currentRisk),
        predictedRisk: Math.round(predictedRisk),
        factors,
        recommendation,
      },
      timestamp: new Date(),
      status,
    });
  }

  return sensors.sort((a, b) => b.riskAnalysis.currentRisk - a.riskAnalysis.currentRisk);
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