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

    // Claude API로 분석 요청
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `
다음 빗물받이 센서 데이터를 분석해서 위험도를 평가하고 구체적인 권장사항을 제시해주세요.

센서 데이터:
- 수위: ${sensorData.waterLevel}%
- 쓰레기량: ${sensorData.debrisLevel}%
- 유량: ${sensorData.flowRate} L/min
- 온도: ${sensorData.temperature}°C
- 위치: ${sensorData.location}

기상 정보:
- 현재 강수량: ${weatherData?.rainfall || 0}mm
- 습도: ${weatherData?.humidity || 0}%
- 온도: ${weatherData?.temperature || 0}°C

다음 JSON 형식으로 답변해주세요:
{
  "riskScore": 0-100 사이의 숫자,
  "predictedRisk": 6시간 후 예상 위험도 (0-100),
  "riskFactors": ["위험 요인1", "위험 요인2"],
  "recommendation": "구체적인 권장 조치사항",
  "urgency": "low|medium|high",
  "insights": "AI 분석 인사이트"
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
    } catch {
      // JSON 파싱 실패 시 기본 응답 생성
      analysis = {
        riskScore: Math.min(100, (sensorData.waterLevel * 0.4 + sensorData.debrisLevel * 0.4 + (weatherData?.rainfall || 0) * 0.2)),
        predictedRisk: Math.min(100, (sensorData.waterLevel * 0.4 + sensorData.debrisLevel * 0.4 + (weatherData?.rainfall || 0) * 0.2) + 10),
        riskFactors: sensorData.waterLevel > 70 ? ['높은 수위'] : sensorData.debrisLevel > 60 ? ['쓰레기 축적'] : ['정상 범위'],
        recommendation: content.text.length > 0 ? content.text : '센서 데이터 모니터링 지속',
        urgency: sensorData.waterLevel > 80 || sensorData.debrisLevel > 80 ? 'high' : sensorData.waterLevel > 50 || sensorData.debrisLevel > 50 ? 'medium' : 'low',
        insights: '실시간 센서 데이터를 기반으로 분석되었습니다.'
      };
    }

    return NextResponse.json({
      success: true,
      analysis
    });

  } catch (error) {
    console.error('AI 분석 오류:', error);

    // 에러 발생 시 기본 분석 반환
    const fallbackAnalysis = {
      riskScore: 50,
      predictedRisk: 55,
      riskFactors: ['시스템 오류로 인한 기본 분석'],
      recommendation: 'AI 시스템 연결 후 다시 분석해주세요.',
      urgency: 'medium',
      insights: 'AI 분석 서비스에 일시적 문제가 발생했습니다.'
    };

    return NextResponse.json({
      success: false,
      analysis: fallbackAnalysis,
      error: 'AI 분석 서비스 오류'
    });
  }
}