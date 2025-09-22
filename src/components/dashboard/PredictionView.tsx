'use client';

import { useState, useEffect } from 'react';
import { SensorData, WeatherData } from '@/types';
import {
  Brain,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  Lightbulb,
  ArrowRight
} from 'lucide-react';

interface PredictionViewProps {
  sensorData: SensorData[];
  weatherData: WeatherData;
}

interface AIAnalysis {
  riskScore: number;
  predictedRisk: number;
  riskFactors: string[];
  recommendation: string;
  urgency: 'low' | 'medium' | 'high';
  insights: string;
}

export default function PredictionView({ sensorData, weatherData }: PredictionViewProps) {
  const [selectedSensor, setSelectedSensor] = useState<SensorData | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 위험도가 높은 센서들 필터링
  const highRiskSensors = sensorData
    .filter(sensor => sensor.riskAnalysis.currentRisk >= 60)
    .slice(0, 10);

  useEffect(() => {
    if (highRiskSensors.length > 0) {
      setSelectedSensor(highRiskSensors[0]);
    }
  }, [sensorData]);

  // AI 분석 요청
  const analyzeWithAI = async (sensor: SensorData) => {
    if (!sensor) return;

    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sensorData: {
            waterLevel: sensor.measurements.waterLevel,
            debrisLevel: sensor.measurements.debrisLevel,
            flowRate: sensor.measurements.flowRate,
            temperature: sensor.measurements.temperature,
            location: sensor.location.name,
          },
          weatherData: {
            rainfall: weatherData.rainfall,
            humidity: weatherData.humidity,
            temperature: weatherData.temperature,
          }
        }),
      });

      const result = await response.json();
      if (result.success) {
        setAnalysis(result.analysis);
      } else {
        setAnalysis(result.analysis); // fallback 분석도 표시
      }
    } catch (error) {
      console.error('AI 분석 실패:', error);
      // 에러 시 기본 분석 생성
      setAnalysis({
        riskScore: sensor.riskAnalysis.currentRisk,
        predictedRisk: sensor.riskAnalysis.predictedRisk,
        riskFactors: sensor.riskAnalysis.factors,
        recommendation: sensor.riskAnalysis.recommendation,
        urgency: sensor.status === 'critical' ? 'high' : sensor.status === 'warning' ? 'medium' : 'low',
        insights: '로컬 데이터를 기반으로 분석되었습니다.',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (selectedSensor) {
      analyzeWithAI(selectedSensor);
    }
  }, [selectedSensor]);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-green-400 bg-green-500/20';
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'high': return '긴급';
      case 'medium': return '주의';
      default: return '정상';
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white flex items-center">
          <Brain className="h-8 w-8 mr-3 text-blue-400" />
          AI 예측 분석
        </h2>
        <div className="text-sm text-slate-400">
          Claude AI 기반 실시간 분석
        </div>
      </div>

      {/* 전체 예측 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="control-panel rounded-lg p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-400" />
            6시간 후 예측
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-300">위험 증가 예상</span>
              <span className="text-red-400 font-semibold">
                +{sensorData.filter(s => s.riskAnalysis.predictedRisk > s.riskAnalysis.currentRisk).length}개소
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">안정화 예상</span>
              <span className="text-green-400 font-semibold">
                {sensorData.filter(s => s.riskAnalysis.predictedRisk < s.riskAnalysis.currentRisk).length}개소
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">변화 없음</span>
              <span className="text-slate-400 font-semibold">
                {sensorData.filter(s => s.riskAnalysis.predictedRisk === s.riskAnalysis.currentRisk).length}개소
              </span>
            </div>
          </div>
        </div>

        <div className="control-panel rounded-lg p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-yellow-400" />
            우선 조치 필요
          </h3>
          <div className="space-y-2">
            {highRiskSensors.slice(0, 3).map((sensor, index) => (
              <div key={sensor.id} className="flex justify-between text-sm">
                <span className="text-slate-300 truncate">{sensor.location.name}</span>
                <span className="text-red-400 font-semibold">{sensor.riskAnalysis.currentRisk}%</span>
              </div>
            ))}
          </div>
          {highRiskSensors.length > 3 && (
            <p className="text-xs text-slate-400 mt-2">
              외 {highRiskSensors.length - 3}개소 더
            </p>
          )}
        </div>

        <div className="control-panel rounded-lg p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center">
            <Zap className="h-5 w-5 mr-2 text-green-400" />
            AI 효율성
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-300">예측 정확도</span>
              <span className="text-green-400 font-semibold">89%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">조치 성공률</span>
              <span className="text-green-400 font-semibold">94%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">비용 절감</span>
              <span className="text-green-400 font-semibold">35%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 상세 분석 영역 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 센서 목록 */}
        <div className="control-panel rounded-lg p-6">
          <h3 className="text-white font-semibold mb-4">분석 대상 센서</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {highRiskSensors.map((sensor) => (
              <button
                key={sensor.id}
                onClick={() => setSelectedSensor(sensor)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedSensor?.id === sensor.id
                    ? 'bg-blue-600/30 border border-blue-500'
                    : 'bg-slate-800 hover:bg-slate-700'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white font-medium text-sm">{sensor.location.name}</p>
                    <p className="text-slate-400 text-xs">{sensor.deviceId}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold text-sm ${
                      sensor.riskAnalysis.currentRisk >= 80 ? 'text-red-400' :
                      sensor.riskAnalysis.currentRisk >= 60 ? 'text-yellow-400' :
                      'text-green-400'
                    }`}>
                      {sensor.riskAnalysis.currentRisk}%
                    </p>
                    <div className="flex items-center text-xs text-slate-400">
                      <ArrowRight className="h-3 w-3 mr-1" />
                      {sensor.riskAnalysis.predictedRisk}%
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* AI 분석 결과 */}
        <div className="lg:col-span-2 control-panel rounded-lg p-6">
          {selectedSensor ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold text-lg">
                  {selectedSensor.location.name} - AI 분석 결과
                </h3>
                {isAnalyzing && (
                  <div className="text-blue-400 text-sm flex items-center">
                    <div className="animate-spin h-4 w-4 border-2 border-blue-400 border-t-transparent rounded-full mr-2"></div>
                    분석 중...
                  </div>
                )}
              </div>

              {analysis && (
                <div className="space-y-6">
                  {/* 위험도 점수 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-800 rounded-lg p-4">
                      <h4 className="text-slate-300 text-sm mb-2">현재 위험도</h4>
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl font-bold text-white">{analysis.riskScore}%</div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getUrgencyColor(analysis.urgency)}`}>
                          {getUrgencyText(analysis.urgency)}
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-800 rounded-lg p-4">
                      <h4 className="text-slate-300 text-sm mb-2">6시간 후 예측</h4>
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl font-bold text-white">{analysis.predictedRisk}%</div>
                        <div className="flex items-center text-sm">
                          {analysis.predictedRisk > analysis.riskScore ? (
                            <TrendingUp className="h-4 w-4 text-red-400 mr-1" />
                          ) : (
                            <TrendingUp className="h-4 w-4 text-green-400 mr-1 transform rotate-180" />
                          )}
                          <span className={analysis.predictedRisk > analysis.riskScore ? 'text-red-400' : 'text-green-400'}>
                            {Math.abs(analysis.predictedRisk - analysis.riskScore)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 위험 요인 */}
                  <div>
                    <h4 className="text-white font-medium mb-3 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      주요 위험 요인
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.riskFactors.map((factor, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm"
                        >
                          {factor}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 권장 조치 */}
                  <div>
                    <h4 className="text-white font-medium mb-3 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      AI 권장 조치
                    </h4>
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                      <p className="text-slate-200">{analysis.recommendation}</p>
                    </div>
                  </div>

                  {/* AI 인사이트 */}
                  <div>
                    <h4 className="text-white font-medium mb-3 flex items-center">
                      <Lightbulb className="h-4 w-4 mr-2" />
                      AI 인사이트
                    </h4>
                    <div className="bg-slate-800 rounded-lg p-4">
                      <p className="text-slate-300 text-sm">{analysis.insights}</p>
                    </div>
                  </div>

                  {/* 센서 상세 데이터 */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-slate-400 text-xs">수위</p>
                      <p className="text-white font-semibold">{selectedSensor.measurements.waterLevel}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-400 text-xs">쓰레기량</p>
                      <p className="text-white font-semibold">{selectedSensor.measurements.debrisLevel}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-400 text-xs">유량</p>
                      <p className="text-white font-semibold">{selectedSensor.measurements.flowRate} L/min</p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-400 text-xs">온도</p>
                      <p className="text-white font-semibold">{selectedSensor.measurements.temperature}°C</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Brain className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-400">분석할 센서를 선택해주세요</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}