/**
 * AI 분석 모듈
 * Claude API를 활용한 고급 센서 데이터 분석
 */

import { SensorData, WeatherData } from '@/types';

// 분석 결과 인터페이스
export interface AIAnalysisResult {
  riskScore: number;
  predictedRisk: number;
  riskFactors: string[];
  recommendation: string;
  urgency: 'low' | 'medium' | 'high';
  insights: string;
  maintenancePriority?: number;
  estimatedCost?: string;
}

// 캐시 시스템 (동일한 센서 데이터에 대해 반복 요청 방지)
const analysisCache = new Map<string, { result: AIAnalysisResult; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5분

/**
 * 캐시 키 생성
 */
function generateCacheKey(sensor: SensorData, weather: WeatherData | null): string {
  return `${sensor.deviceId}-${sensor.measurements.waterLevel}-${sensor.measurements.debrisLevel}-${weather?.rainfall || 0}`;
}

/**
 * Claude API를 사용한 실제 AI 분석
 */
async function analyzeWithClaude(
  sensor: SensorData,
  weather: WeatherData | null
): Promise<AIAnalysisResult> {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sensorData: {
          deviceId: sensor.deviceId,
          location: sensor.location.name,
          waterLevel: sensor.measurements.waterLevel,
          debrisLevel: sensor.measurements.debrisLevel,
          flowRate: sensor.measurements.flowRate,
          temperature: sensor.measurements.temperature,
          currentRisk: sensor.riskAnalysis.currentRisk,
        },
        weatherData: weather ? {
          rainfall: weather.rainfall,
          humidity: weather.humidity,
          temperature: weather.temperature,
          windSpeed: weather.windSpeed,
        } : null,
      }),
    });

    if (!response.ok) {
      throw new Error('AI 분석 API 호출 실패');
    }

    const data = await response.json();

    if (data.success && data.analysis) {
      return data.analysis;
    } else {
      throw new Error('AI 분석 결과 파싱 실패');
    }
  } catch (error) {
    console.error('Claude API 분석 오류:', error);
    // Fallback to local analysis
    return generateLocalAnalysis(sensor, weather);
  }
}

/**
 * 로컬 분석 (AI API 실패 시 대체)
 */
function generateLocalAnalysis(
  sensor: SensorData,
  weather: WeatherData | null
): AIAnalysisResult {
  const { waterLevel, debrisLevel, flowRate } = sensor.measurements;
  const rainfall = weather?.rainfall || 0;

  // 위험도 계산
  const waterRisk = waterLevel * 0.4;
  const debrisRisk = debrisLevel * 0.3;
  const flowRisk = (1 - flowRate / 600) * 100 * 0.15;
  const rainfallRisk = Math.min(100, rainfall * 2) * 0.15;
  const riskScore = Math.min(100, waterRisk + debrisRisk + flowRisk + rainfallRisk);

  // 예측 위험도 (6시간 후)
  let predictedRisk = riskScore;
  if (rainfall >= 10) {
    predictedRisk += 20 + Math.random() * 15;
  } else if (rainfall >= 5) {
    predictedRisk += 10 + Math.random() * 10;
  }
  predictedRisk = Math.min(100, predictedRisk);

  // 위험 요인
  const riskFactors: string[] = [];
  if (waterLevel > 80) riskFactors.push('매우 높은 수위');
  else if (waterLevel > 60) riskFactors.push('높은 수위');

  if (debrisLevel > 70) riskFactors.push('심각한 쓰레기 축적');
  else if (debrisLevel > 50) riskFactors.push('쓰레기 축적');

  if (flowRate < 200) riskFactors.push('낮은 유량 (배수 불량)');

  if (rainfall >= 30) riskFactors.push('집중호우');
  else if (rainfall >= 10) riskFactors.push('강한 강수');

  if (riskFactors.length === 0) riskFactors.push('정상 범위');

  // 긴급도
  let urgency: 'low' | 'medium' | 'high';
  if (riskScore >= 75) urgency = 'high';
  else if (riskScore >= 50) urgency = 'medium';
  else urgency = 'low';

  // 권장사항
  let recommendation = '';
  if (urgency === 'high') {
    recommendation = '🚨 즉시 청소 및 점검 필요. 긴급 대응팀 파견 권장. 주변 배수 시설도 함께 점검하세요.';
  } else if (urgency === 'medium') {
    recommendation = predictedRisk > 80
      ? '⚠️ 2시간 내 청소 작업 권장. 6시간 후 위험 상태로 전환될 가능성이 높습니다.'
      : '⚠️ 2시간 내 청소 작업 권장. 상황 모니터링 필요.';
  } else {
    recommendation = rainfall > 0
      ? '✅ 현재는 정상이나 강수량 증가 시 주의 필요. 모니터링 강화 권장.'
      : '✅ 정상 상태. 정기 점검 일정에 따라 관리하세요.';
  }

  // 인사이트
  const insights = generateInsights(sensor, weather, riskScore, predictedRisk);

  // 유지보수 우선순위
  const maintenancePriority = Math.round(riskScore);

  // 예상 비용
  const estimatedCost = estimateMaintenanceCost(urgency, debrisLevel, waterLevel);

  return {
    riskScore: Math.round(riskScore),
    predictedRisk: Math.round(predictedRisk),
    riskFactors,
    recommendation,
    urgency,
    insights,
    maintenancePriority,
    estimatedCost,
  };
}

/**
 * AI 인사이트 생성
 */
function generateInsights(
  sensor: SensorData,
  weather: WeatherData | null,
  currentRisk: number,
  predictedRisk: number
): string {
  const insights: string[] = [];

  // 추세 분석
  const riskChange = predictedRisk - currentRisk;
  if (riskChange > 15) {
    insights.push('위험도가 급격히 증가할 것으로 예상됩니다.');
  } else if (riskChange > 5) {
    insights.push('위험도가 점진적으로 증가할 것으로 보입니다.');
  } else if (riskChange < -5) {
    insights.push('상황이 개선될 것으로 예상됩니다.');
  }

  // 날씨 영향
  if (weather && weather.rainfall > 20) {
    insights.push('현재 강수량이 많아 배수 시스템에 부담이 가중되고 있습니다.');
  } else if (weather && weather.rainfall > 5) {
    insights.push('강수로 인해 수위 상승이 예상됩니다.');
  }

  // 센서 상태
  if (sensor.measurements.flowRate < 150) {
    insights.push('유량이 매우 낮아 막힘 현상이 의심됩니다.');
  }

  if (sensor.measurements.debrisLevel > 70 && sensor.measurements.waterLevel > 70) {
    insights.push('쓰레기와 높은 수위의 복합적 문제로 침수 위험이 높습니다.');
  }

  // 위치별 특성
  if (sensor.location.name.includes('역')) {
    insights.push('역 주변 지역으로 유동인구가 많아 신속한 대응이 중요합니다.');
  }

  if (insights.length === 0) {
    insights.push('현재 센서 데이터를 기반으로 정상 상태로 분석됩니다.');
  }

  return insights.join(' ');
}

/**
 * 유지보수 비용 예측
 */
function estimateMaintenanceCost(
  urgency: 'low' | 'medium' | 'high',
  debrisLevel: number,
  waterLevel: number
): string {
  let baseCost = 50000; // 기본 작업 비용 (원)

  // 긴급도에 따른 비용
  if (urgency === 'high') {
    baseCost *= 1.5; // 긴급 출동 할증
  } else if (urgency === 'medium') {
    baseCost *= 1.2;
  }

  // 쓰레기량에 따른 비용
  if (debrisLevel > 80) {
    baseCost += 30000;
  } else if (debrisLevel > 60) {
    baseCost += 20000;
  } else if (debrisLevel > 40) {
    baseCost += 10000;
  }

  // 수위에 따른 비용
  if (waterLevel > 80) {
    baseCost += 20000; // 배수 작업 추가
  }

  const minCost = Math.round(baseCost * 0.8);
  const maxCost = Math.round(baseCost * 1.2);

  return `${(minCost / 10000).toFixed(1)}만원 ~ ${(maxCost / 10000).toFixed(1)}만원`;
}

/**
 * 센서 데이터 AI 분석 (캐싱 포함)
 */
export async function analyzeSensorData(
  sensor: SensorData,
  weather: WeatherData | null,
  useCache: boolean = true
): Promise<AIAnalysisResult> {
  // 캐시 확인
  if (useCache) {
    const cacheKey = generateCacheKey(sensor, weather);
    const cached = analysisCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.result;
    }
  }

  // AI 분석 실행
  const result = await analyzeWithClaude(sensor, weather);

  // 캐시 저장
  if (useCache) {
    const cacheKey = generateCacheKey(sensor, weather);
    analysisCache.set(cacheKey, {
      result,
      timestamp: Date.now(),
    });
  }

  return result;
}

/**
 * 배치 분석 (여러 센서 동시 분석)
 */
export async function analyzeSensorsBatch(
  sensors: SensorData[],
  weather: WeatherData | null,
  limit: number = 10
): Promise<Map<string, AIAnalysisResult>> {
  const results = new Map<string, AIAnalysisResult>();

  // 위험도가 높은 센서 우선 분석
  const topSensors = sensors
    .sort((a, b) => b.riskAnalysis.currentRisk - a.riskAnalysis.currentRisk)
    .slice(0, limit);

  const promises = topSensors.map(async (sensor) => {
    const result = await analyzeSensorData(sensor, weather);
    return { deviceId: sensor.deviceId, result };
  });

  const analysisResults = await Promise.all(promises);

  analysisResults.forEach(({ deviceId, result }) => {
    results.set(deviceId, result);
  });

  return results;
}

/**
 * 캐시 초기화
 */
export function clearAnalysisCache(): void {
  analysisCache.clear();
}

/**
 * 통계 정보
 */
export function getAnalysisStats(): {
  cacheSize: number;
  oldestCache: number | null;
} {
  let oldestTimestamp: number | null = null;

  analysisCache.forEach((value) => {
    if (oldestTimestamp === null || value.timestamp < oldestTimestamp) {
      oldestTimestamp = value.timestamp;
    }
  });

  return {
    cacheSize: analysisCache.size,
    oldestCache: oldestTimestamp,
  };
}
