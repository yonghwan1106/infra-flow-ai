import { SensorData } from '@/types';

/**
 * 고급 센서 데이터 시뮬레이터
 * - 시간대별 패턴
 * - 날씨 연동
 * - 지역별 특성
 * - 점진적 변화
 */

// 강남구 주요 위치 좌표 (트래픽 가중치 포함)
const gangnamLocations = [
  { name: '강남역 2번 출구', lat: 37.4979, lng: 127.0276, district: '강남구', trafficWeight: 1.5 },
  { name: '역삼역 1번 출구', lat: 37.5000, lng: 127.0364, district: '강남구', trafficWeight: 1.3 },
  { name: '선릉역 3번 출구', lat: 37.5044, lng: 127.0492, district: '강남구', trafficWeight: 1.2 },
  { name: '테헤란로 123번지', lat: 37.4996, lng: 127.0317, district: '강남구', trafficWeight: 1.4 },
  { name: '삼성역 2번 출구', lat: 37.5091, lng: 127.0627, district: '강남구', trafficWeight: 1.3 },
  { name: '봉은사로 456번지', lat: 37.5105, lng: 127.0591, district: '강남구', trafficWeight: 1.1 },
  { name: '논현로 789번지', lat: 37.5109, lng: 127.0227, district: '강남구', trafficWeight: 1.2 },
  { name: '압구정로 321번지', lat: 37.5274, lng: 127.0286, district: '강남구', trafficWeight: 1.0 },
  { name: '신사역 4번 출구', lat: 37.5160, lng: 127.0202, district: '강남구', trafficWeight: 1.1 },
  { name: '청담동 카페거리', lat: 37.5196, lng: 127.0408, district: '강남구', trafficWeight: 0.9 },
];

// 이전 센서 데이터 저장 (점진적 변화를 위해)
let previousSensorData: Map<string, SensorData> = new Map();

/**
 * 시간대별 가중치 계산
 * - 출퇴근 시간(7-9시, 18-20시): 1.4배
 * - 점심시간(12-14시): 1.2배
 * - 심야(23-5시): 0.6배
 */
function getTimeWeight(): number {
  const hour = new Date().getHours();

  // 출퇴근 시간
  if ((hour >= 7 && hour <= 9) || (hour >= 18 && hour <= 20)) {
    return 1.4;
  }

  // 점심시간
  if (hour >= 12 && hour <= 14) {
    return 1.2;
  }

  // 심야 시간
  if (hour >= 23 || hour <= 5) {
    return 0.6;
  }

  // 일반 시간
  return 1.0;
}

/**
 * 날씨 기반 가중치 계산
 * - 강수량이 많을수록 수위 증가
 */
function getWeatherWeight(rainfall: number = 0): number {
  if (rainfall >= 50) return 1.8; // 폭우
  if (rainfall >= 30) return 1.5; // 강한 비
  if (rainfall >= 10) return 1.3; // 비
  if (rainfall >= 1) return 1.1;  // 약한 비
  return 1.0; // 맑음
}

/**
 * 요일별 가중치
 * - 평일: 1.0
 * - 주말: 0.8
 */
function getDayWeight(): number {
  const day = new Date().getDay();
  // 0: 일요일, 6: 토요일
  if (day === 0 || day === 6) {
    return 0.8;
  }
  return 1.0;
}

/**
 * 점진적 변화 적용
 * - 이전 값에서 크게 벗어나지 않도록
 */
function applyGradualChange(
  previousValue: number | undefined,
  targetValue: number,
  maxChangeRate: number = 0.15
): number {
  if (previousValue === undefined) {
    return targetValue;
  }

  const maxChange = previousValue * maxChangeRate;
  const change = targetValue - previousValue;

  if (Math.abs(change) > maxChange) {
    return previousValue + Math.sign(change) * maxChange;
  }

  return targetValue;
}

/**
 * 위험도 계산 (정교한 알고리즘)
 */
function calculateRisk(
  waterLevel: number,
  debrisLevel: number,
  flowRate: number,
  rainfall: number
): number {
  // 수위 (40% 가중치)
  const waterRisk = waterLevel * 0.4;

  // 쓰레기량 (30% 가중치)
  const debrisRisk = debrisLevel * 0.3;

  // 유량 (낮을수록 위험) (10% 가중치)
  const flowRisk = (1 - flowRate / 600) * 100 * 0.1;

  // 강수량 (20% 가중치)
  const rainfallRisk = Math.min(100, rainfall * 2) * 0.2;

  return Math.min(100, waterRisk + debrisRisk + flowRisk + rainfallRisk);
}

/**
 * 예측 위험도 계산 (6시간 후)
 */
function predictFutureRisk(
  currentRisk: number,
  rainfall: number,
  trend: 'increasing' | 'stable' | 'decreasing'
): number {
  let prediction = currentRisk;

  // 강수량에 따른 증가
  if (rainfall >= 10) {
    prediction += 15 + Math.random() * 10;
  } else if (rainfall >= 5) {
    prediction += 5 + Math.random() * 5;
  }

  // 추세 반영
  if (trend === 'increasing') {
    prediction += 5 + Math.random() * 10;
  } else if (trend === 'decreasing') {
    prediction -= 5 + Math.random() * 10;
  }

  // 일반적인 변동성
  prediction += (Math.random() - 0.5) * 10;

  return Math.max(0, Math.min(100, prediction));
}

/**
 * 위험 요인 분석
 */
function analyzeRiskFactors(
  waterLevel: number,
  debrisLevel: number,
  flowRate: number,
  rainfall: number
): string[] {
  const factors: string[] = [];

  if (waterLevel > 80) {
    factors.push('매우 높은 수위');
  } else if (waterLevel > 60) {
    factors.push('높은 수위');
  }

  if (debrisLevel > 70) {
    factors.push('심각한 쓰레기 축적');
  } else if (debrisLevel > 50) {
    factors.push('쓰레기 축적');
  }

  if (flowRate < 200) {
    factors.push('낮은 유량 (배수 불량)');
  }

  if (rainfall >= 30) {
    factors.push('집중호우 경보');
  } else if (rainfall >= 10) {
    factors.push('강한 강수');
  } else if (rainfall >= 1) {
    factors.push('강수 진행 중');
  }

  const hour = new Date().getHours();
  if ((hour >= 7 && hour <= 9) || (hour >= 18 && hour <= 20)) {
    factors.push('출퇴근 시간대 (높은 트래픽)');
  }

  if (factors.length === 0) {
    factors.push('정상 범위');
  }

  return factors;
}

/**
 * AI 권장사항 생성
 */
function generateRecommendation(
  status: 'normal' | 'warning' | 'critical',
  factors: string[],
  predictedRisk: number
): string {
  if (status === 'critical') {
    return '🚨 즉시 청소 및 점검 필요. 긴급 대응팀 파견 권장. 주변 배수 시설도 함께 점검하세요.';
  }

  if (status === 'warning') {
    if (predictedRisk > 80) {
      return '⚠️ 2시간 내 청소 작업 권장. 6시간 후 위험 상태로 전환될 가능성이 높습니다.';
    }
    return '⚠️ 2시간 내 청소 작업 권장. 상황 모니터링 필요.';
  }

  // normal
  if (factors.includes('강수 진행 중') || factors.includes('강한 강수')) {
    return '✅ 현재는 정상이나 강수량 증가 시 주의 필요. 모니터링 강화 권장.';
  }

  if (predictedRisk > 60) {
    return '✅ 정상 상태. 다만 6시간 후 주의 상태 가능성. 정기 점검 권장.';
  }

  return '✅ 정상 상태. 정기 점검 일정에 따라 관리하세요.';
}

/**
 * 고급 센서 데이터 생성
 */
export function generateAdvancedSensorData(
  count: number = 1247,
  weatherRainfall: number = 0
): SensorData[] {
  const sensors: SensorData[] = [];

  const timeWeight = getTimeWeight();
  const weatherWeight = getWeatherWeight(weatherRainfall);
  const dayWeight = getDayWeight();

  for (let i = 0; i < count; i++) {
    const deviceId = `INF-GN-${String(i + 1).padStart(4, '0')}`;
    const location = gangnamLocations[i % gangnamLocations.length];

    // 이전 데이터 가져오기
    const previous = previousSensorData.get(deviceId);

    // 기본 수위 (위치별 트래픽 가중치 적용)
    const baseWaterLevel =
      15 + // 기본 수위
      Math.random() * 30 + // 랜덤 변동
      (location.trafficWeight - 1) * 20; // 트래픽 가중치

    // 시간대, 날씨, 요일 가중치 적용
    let targetWaterLevel = baseWaterLevel * timeWeight * weatherWeight * dayWeight;

    // 점진적 변화 적용
    const waterLevel = applyGradualChange(
      previous?.measurements.waterLevel,
      targetWaterLevel,
      0.2 // 최대 20% 변화
    );

    // 쓰레기량 (수위와 상관관계)
    const baseDebrisLevel =
      10 +
      Math.random() * 40 +
      waterLevel * 0.3; // 수위가 높으면 쓰레기도 많음

    const debrisLevel = applyGradualChange(
      previous?.measurements.debrisLevel,
      baseDebrisLevel,
      0.15
    );

    // 유량 (수위가 높고 쓰레기가 많으면 유량 감소)
    const blockageFactor = (waterLevel * 0.5 + debrisLevel * 0.5) / 100;
    const targetFlowRate =
      600 - (blockageFactor * 400) + // 막힘에 따른 유량 감소
      (Math.random() - 0.5) * 100; // 랜덤 변동

    const flowRate = Math.max(50, applyGradualChange(
      previous?.measurements.flowRate,
      targetFlowRate,
      0.25
    ));

    // 온도 (계절 및 시간대 반영)
    const baseTemp = 18 + (new Date().getMonth() - 3) * 1.5; // 계절 반영
    const hourTemp = baseTemp + (new Date().getHours() - 12) * 0.5; // 시간대 반영
    const temperature = Math.round(hourTemp + (Math.random() - 0.5) * 3);

    // 위험도 계산
    const currentRisk = calculateRisk(
      waterLevel,
      debrisLevel,
      flowRate,
      weatherRainfall
    );

    // 추세 판단
    let trend: 'increasing' | 'stable' | 'decreasing' = 'stable';
    if (previous) {
      const previousRisk = previous.riskAnalysis.currentRisk;
      if (currentRisk > previousRisk + 5) trend = 'increasing';
      else if (currentRisk < previousRisk - 5) trend = 'decreasing';
    }

    // 예측 위험도
    const predictedRisk = predictFutureRisk(currentRisk, weatherRainfall, trend);

    // 상태 결정 (더 엄격한 기준)
    let status: 'normal' | 'warning' | 'critical';
    if (currentRisk >= 85) status = 'critical';
    else if (currentRisk >= 65) status = 'warning';
    else status = 'normal';

    // 위험 요인 분석
    const factors = analyzeRiskFactors(waterLevel, debrisLevel, flowRate, weatherRainfall);

    // 권장사항 생성
    const recommendation = generateRecommendation(status, factors, predictedRisk);

    const sensorData: SensorData = {
      id: `sensor-${String(i + 1).padStart(4, '0')}`,
      deviceId,
      location: {
        ...location,
        lat: location.lat + (Math.random() - 0.5) * 0.01,
        lng: location.lng + (Math.random() - 0.5) * 0.01,
      },
      measurements: {
        waterLevel: Math.round(waterLevel),
        debrisLevel: Math.round(debrisLevel),
        flowRate: Math.round(flowRate),
        temperature,
      },
      riskAnalysis: {
        currentRisk: Math.round(currentRisk),
        predictedRisk: Math.round(predictedRisk),
        factors,
        recommendation,
      },
      timestamp: new Date(),
      status,
    };

    // 다음 업데이트를 위해 저장
    previousSensorData.set(deviceId, sensorData);

    sensors.push(sensorData);
  }

  // 위험도 순으로 정렬
  sensors.sort((a, b) => b.riskAnalysis.currentRisk - a.riskAnalysis.currentRisk);

  // 위험/주의 상태 조정 (현실적인 시뮬레이션을 위해)
  let criticalCount = sensors.filter(s => s.status === 'critical').length;
  let warningCount = sensors.filter(s => s.status === 'warning').length;

  // 위험 상태가 너무 많으면 일부를 warning으로 변경
  if (criticalCount > 15) {
    const excessCount = criticalCount - 15;
    const criticalSensors = sensors.filter(s => s.status === 'critical');
    // 위험도가 낮은 critical 센서들을 warning으로 변경
    criticalSensors
      .sort((a, b) => a.riskAnalysis.currentRisk - b.riskAnalysis.currentRisk)
      .slice(0, excessCount)
      .forEach(sensor => {
        sensor.status = 'warning';
        sensor.riskAnalysis.currentRisk = Math.min(sensor.riskAnalysis.currentRisk, 74);
      });
    criticalCount = sensors.filter(s => s.status === 'critical').length;
    warningCount = sensors.filter(s => s.status === 'warning').length;
  }

  // 주의 상태가 너무 많으면 일부를 normal로 변경
  if (warningCount > 20) {
    const excessCount = warningCount - 20;
    const warningSensors = sensors.filter(s => s.status === 'warning');
    // 위험도가 낮은 warning 센서들을 normal로 변경
    warningSensors
      .sort((a, b) => a.riskAnalysis.currentRisk - b.riskAnalysis.currentRisk)
      .slice(0, excessCount)
      .forEach(sensor => {
        sensor.status = 'normal';
        sensor.riskAnalysis.currentRisk = Math.min(sensor.riskAnalysis.currentRisk, 49);
      });
  }

  return sensors;
}

/**
 * 시뮬레이터 초기화 (페이지 새로고침 시 사용)
 */
export function resetSimulator(): void {
  previousSensorData.clear();
}

/**
 * 특정 이벤트 시뮬레이션 (테스트용)
 */
export function simulateEvent(
  eventType: 'heavy_rain' | 'normal' | 'rush_hour'
): { rainfall: number; description: string } {
  switch (eventType) {
    case 'heavy_rain':
      return {
        rainfall: 50 + Math.random() * 30,
        description: '집중호우 시뮬레이션'
      };
    case 'rush_hour':
      return {
        rainfall: 0,
        description: '출퇴근 시간 시뮬레이션'
      };
    default:
      return {
        rainfall: Math.random() * 5,
        description: '일반 날씨'
      };
  }
}
