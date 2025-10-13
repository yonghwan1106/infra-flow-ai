import { NextRequest } from 'next/server';
import { generateSensorData, generateMaintenanceTasks, generateWeatherData, generateAlerts } from '@/lib/mockData';

export async function GET(request: NextRequest) {
  // Server-Sent Events 응답 설정
  const responseHeaders = new Headers({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  });

  // 실시간 데이터 스트림 생성
  const stream = new ReadableStream({
    async start(controller) {
      // 클라이언트 연결 확인 메시지
      controller.enqueue(`data: ${JSON.stringify({ type: 'connected', message: '실시간 연결됨' })}\n\n`);

      // 초기 날씨 데이터를 먼저 동기적으로 가져오기
      let currentWeather = await generateWeatherData();

      // 주기적으로 데이터 전송 (3초마다)
      const interval = setInterval(async () => {
        try {

          // 새로운 센서 데이터 생성 (날씨 연동)
          const sensorData = generateSensorData(1247, currentWeather.rainfall);
          const tasks = generateMaintenanceTasks(sensorData);
          const alerts = generateAlerts(sensorData);

          // 주요 상태 변화만 전송 (성능 최적화)
          const criticalSensors = sensorData.filter(s => s.status === 'critical');
          const recentAlerts = alerts.slice(0, 3);

          const updateData = {
            type: 'update',
            timestamp: new Date().toISOString(),
            data: {
              criticalCount: criticalSensors.length,
              warningCount: sensorData.filter(s => s.status === 'warning').length,
              normalCount: sensorData.filter(s => s.status === 'normal').length,
              completedTasks: tasks.filter(t => t.status === 'completed').length,
              totalTasks: tasks.length,
              weather: {
                temperature: currentWeather.temperature,
                rainfall: currentWeather.rainfall,
                humidity: currentWeather.humidity,
                windSpeed: currentWeather.windSpeed,
                forecast: currentWeather.forecast,
              },
              alerts: recentAlerts,
              criticalSensors: criticalSensors.slice(0, 5).map(sensor => ({
                id: sensor.id,
                location: sensor.location.name,
                riskScore: sensor.riskAnalysis.currentRisk,
                waterLevel: sensor.measurements.waterLevel,
                debrisLevel: sensor.measurements.debrisLevel,
              })),
            }
          };

          controller.enqueue(`data: ${JSON.stringify(updateData)}\n\n`);
        } catch (error) {
          console.error('실시간 데이터 전송 오류:', error);
          controller.enqueue(`data: ${JSON.stringify({ type: 'error', message: '데이터 전송 오류' })}\n\n`);
        }
      }, 3000);

      // 연결 종료 시 정리
      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, { headers: responseHeaders });
}