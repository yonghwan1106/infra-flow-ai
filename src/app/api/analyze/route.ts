import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { sensorData, weatherData } = await request.json();

    if (!sensorData) {
      return NextResponse.json(
        { error: '센서 데이터가 필요합니다.' },
        { status: 400 }
      );
    }

    // 현재 시간대 정보
    const currentHour = new Date().getHours();
    const isRushHour = (currentHour >= 7 && currentHour <= 9) || (currentHour >= 18 && currentHour <= 20);
    const timeContext = isRushHour ? '출퇴근 시간대' : '일반 시간대';

    // Claude API로 분석 요청
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1200,
      messages: [{
        role: 'user',
        content: `
당신은 도시 하수도 및 빗물받이 시스템 전문가입니다. 다음 센서 데이터를 분석하여 위험도를 평가하고 구체적인 조치사항을 제시해주세요.

## 센서 데이터
- 장치 ID: ${sensorData.deviceId}
- 위치: ${sensorData.location}
- 수위: ${sensorData.waterLevel}% ${sensorData.waterLevel > 70 ? '(높음 ⚠️)' : ''}
- 쓰레기 축적: ${sensorData.debrisLevel}% ${sensorData.debrisLevel > 70 ? '(높음 ⚠️)' : ''}
- 유량: ${sensorData.flowRate} L/min ${sensorData.flowRate < 200 ? '(배수 불량 ⚠️)' : ''}
- 온도: ${sensorData.temperature}°C

## 기상 정보
- 현재 강수량: ${weatherData?.rainfall || 0}mm ${(weatherData?.rainfall || 0) > 10 ? '(강한 비 🌧️)' : ''}
- 습도: ${weatherData?.humidity || 0}%
- 기온: ${weatherData?.temperature || 0}°C
- 풍속: ${weatherData?.windSpeed || 0}m/s

## 환경 정보
- 시간대: ${timeContext} (${currentHour}시)
- 현재 위험도: ${sensorData.currentRisk}점

## 분석 요청사항
1. 현재 위험도를 0-100점으로 평가
2. 6시간 후 예상 위험도 예측
3. 주요 위험 요인 2-4가지 나열
4. 구체적이고 실행 가능한 권장 조치사항 제시
5. 긴급도 평가 (low/medium/high)
6. 전문가 관점의 인사이트 제공 (시간대, 날씨, 위치를 고려)
7. 예상 유지보수 우선순위 (1-100)
8. 대략적인 청소 비용 예측

다음 JSON 형식으로만 답변해주세요 (다른 텍스트 없이):
{
  "riskScore": 숫자,
  "predictedRisk": 숫자,
  "riskFactors": ["요인1", "요인2", "요인3"],
  "recommendation": "상세한 권장 조치사항",
  "urgency": "low 또는 medium 또는 high",
  "insights": "전문가 관점의 상세 인사이트",
  "maintenancePriority": 숫자,
  "estimatedCost": "예상 비용 (예: 5만원~7만원)"
}
        `
      }]
    });

    // 응답 파싱
    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    let analysis;
    try {
      // JSON 파싱 시도
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      // JSON 파싱 실패 시 개선된 기본 응답 생성
      const waterLevel = sensorData.waterLevel || 0;
      const debrisLevel = sensorData.debrisLevel || 0;
      const flowRate = sensorData.flowRate || 300;
      const rainfall = weatherData?.rainfall || 0;

      const riskScore = Math.min(100,
        waterLevel * 0.4 +
        debrisLevel * 0.3 +
        (1 - flowRate / 600) * 100 * 0.15 +
        Math.min(100, rainfall * 2) * 0.15
      );

      const predictedRisk = Math.min(100, riskScore + (rainfall >= 10 ? 20 : 5));

      const factors = [];
      if (waterLevel > 70) factors.push('높은 수위');
      if (debrisLevel > 60) factors.push('쓰레기 축적');
      if (flowRate < 200) factors.push('배수 불량');
      if (rainfall >= 10) factors.push('강한 강수');
      if (factors.length === 0) factors.push('정상 범위');

      const urgency = riskScore >= 75 ? 'high' : riskScore >= 50 ? 'medium' : 'low';

      let recommendation = '';
      if (urgency === 'high') {
        recommendation = '즉시 청소 및 점검 필요. 긴급 대응팀 파견 권장.';
      } else if (urgency === 'medium') {
        recommendation = '2시간 내 청소 작업 권장. 상황 모니터링 필요.';
      } else {
        recommendation = '정상 상태. 정기 점검 일정에 따라 관리.';
      }

      analysis = {
        riskScore: Math.round(riskScore),
        predictedRisk: Math.round(predictedRisk),
        riskFactors: factors,
        recommendation,
        urgency,
        insights: content.text.length > 0 ? content.text : '실시간 센서 데이터를 기반으로 분석되었습니다.',
        maintenancePriority: Math.round(riskScore),
        estimatedCost: urgency === 'high' ? '7.5만원~10만원' : urgency === 'medium' ? '5만원~7만원' : '3만원~5만원'
      };
    }

    return NextResponse.json({
      success: true,
      analysis
    });

  } catch (error) {
    console.error('AI 분석 오류:', error);

    // 에러 발생 시에도 센서 데이터 기반 기본 분석 제공
    const waterLevel = sensorData?.waterLevel || 0;
    const debrisLevel = sensorData?.debrisLevel || 0;
    const flowRate = sensorData?.flowRate || 300;
    const rainfall = weatherData?.rainfall || 0;

    const riskScore = Math.min(100,
      waterLevel * 0.4 +
      debrisLevel * 0.3 +
      (1 - flowRate / 600) * 100 * 0.15 +
      Math.min(100, rainfall * 2) * 0.15
    );

    const predictedRisk = Math.min(100, riskScore + (rainfall >= 10 ? 20 : 5));

    const factors = [];
    if (waterLevel > 70) factors.push('높은 수위');
    if (debrisLevel > 60) factors.push('쓰레기 축적');
    if (flowRate < 200) factors.push('배수 불량');
    if (rainfall >= 10) factors.push('강한 강수');
    if (factors.length === 0) factors.push('정상 범위');

    const urgency = riskScore >= 75 ? 'high' : riskScore >= 50 ? 'medium' : 'low';

    let recommendation = '';
    if (urgency === 'high') {
      recommendation = '즉시 청소 및 점검 필요. 긴급 대응팀 파견 권장.';
    } else if (urgency === 'medium') {
      recommendation = '2시간 내 청소 작업 권장. 상황 모니터링 필요.';
    } else {
      recommendation = '정상 상태. 정기 점검 일정에 따라 관리.';
    }

    const fallbackAnalysis = {
      riskScore: Math.round(riskScore),
      predictedRisk: Math.round(predictedRisk),
      riskFactors: factors,
      recommendation,
      urgency,
      insights: 'AI 분석 서비스에 일시적 문제가 발생하여 로컬 알고리즘으로 분석했습니다.',
      maintenancePriority: Math.round(riskScore),
      estimatedCost: urgency === 'high' ? '7.5만원~10만원' : urgency === 'medium' ? '5만원~7만원' : '3만원~5만원'
    };

    return NextResponse.json({
      success: false,
      analysis: fallbackAnalysis,
      error: error instanceof Error ? error.message : 'AI 분석 서비스 오류',
      fallback: true
    });
  }
}