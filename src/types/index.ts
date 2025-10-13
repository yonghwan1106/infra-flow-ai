// 센서 데이터 인터페이스
export interface SensorData {
  id: string;
  deviceId: string;
  location: {
    name: string;
    lat: number;
    lng: number;
    district: string;
  };
  measurements: {
    waterLevel: number;      // 0-100%
    debrisLevel: number;     // 0-100%
    flowRate: number;        // L/min
    temperature: number;     // °C
  };
  riskAnalysis: {
    currentRisk: number;     // 0-100
    predictedRisk: number;   // 6시간 후 예측
    factors: string[];       // 위험 요인들
    recommendation: string;  // AI 권장사항
  };
  timestamp: Date;
  status: 'normal' | 'warning' | 'critical';
}

// 작업 관리 인터페이스
export interface MaintenanceTask {
  id: string;
  deviceId: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  assignedTeam: string;
  estimatedTime: number;   // 분
  route: {
    order: number;
    optimizedPath: string;
  };
  createdAt: Date;
  completedAt?: Date;
}

// 기상 데이터 인터페이스
export interface WeatherData {
  location: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  forecast: {
    time: string;
    rainfall: number;
    intensity: 'light' | 'moderate' | 'heavy';
  }[];
}

// 대시보드 통계 인터페이스
export interface DashboardStats {
  totalDevices: number;
  criticalCount: number;
  warningCount: number;
  normalCount: number;
  todayTasks: number;
  completedTasks: number;
}

// 알림 인터페이스
export interface Alert {
  id: string;
  location: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: Date;
}