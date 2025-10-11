'use client';

import { useState } from 'react';
import KakaoMap from '@/components/map/KakaoMap';
import { SensorData } from '@/types';
import { MapPin, X } from 'lucide-react';

interface MapViewProps {
  sensorData: SensorData[];
}

export default function MapView({ sensorData }: MapViewProps) {
  const [selectedSensor, setSelectedSensor] = useState<SensorData | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'critical' | 'warning' | 'normal'>('all');

  const handleMarkerClick = (sensor: SensorData) => {
    setSelectedSensor(sensor);
  };

  const handleFilterClick = (filter: 'critical' | 'warning' | 'normal') => {
    // 같은 필터를 다시 클릭하면 필터 해제 (전체 표시)
    setSelectedFilter(selectedFilter === filter ? 'all' : filter);
  };

  const criticalSensors = sensorData.filter(s => s.status === 'critical');
  const warningSensors = sensorData.filter(s => s.status === 'warning');
  const normalSensors = sensorData.filter(s => s.status === 'normal');

  // 필터링된 센서 데이터
  const filteredSensorData = selectedFilter === 'all'
    ? sensorData
    : sensorData.filter(s => s.status === selectedFilter);

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">실시간 지도 뷰</h2>
        <div className="text-sm text-slate-400">
          강남구 빗물받이 모니터링 현황
        </div>
      </div>

      {/* 통계 카드 (클릭 가능) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => handleFilterClick('critical')}
          className={`control-panel rounded-lg p-4 border transition-all hover:scale-105 cursor-pointer ${
            selectedFilter === 'critical'
              ? 'border-red-500 bg-red-500/10'
              : 'border-red-500/30 hover:border-red-500/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">위험 상태</p>
              <p className="text-2xl font-bold text-red-400">{criticalSensors.length}</p>
              <p className="text-xs text-slate-500 mt-1">
                {selectedFilter === 'critical' ? '✓ 필터링 중' : '클릭하여 필터링'}
              </p>
            </div>
            <div className="w-3 h-3 bg-red-500 rounded-full status-indicator"></div>
          </div>
        </button>

        <button
          onClick={() => handleFilterClick('warning')}
          className={`control-panel rounded-lg p-4 border transition-all hover:scale-105 cursor-pointer ${
            selectedFilter === 'warning'
              ? 'border-yellow-500 bg-yellow-500/10'
              : 'border-yellow-500/30 hover:border-yellow-500/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">주의 상태</p>
              <p className="text-2xl font-bold text-yellow-400">{warningSensors.length}</p>
              <p className="text-xs text-slate-500 mt-1">
                {selectedFilter === 'warning' ? '✓ 필터링 중' : '클릭하여 필터링'}
              </p>
            </div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          </div>
        </button>

        <button
          onClick={() => handleFilterClick('normal')}
          className={`control-panel rounded-lg p-4 border transition-all hover:scale-105 cursor-pointer ${
            selectedFilter === 'normal'
              ? 'border-green-500 bg-green-500/10'
              : 'border-green-500/30 hover:border-green-500/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">정상 상태</p>
              <p className="text-2xl font-bold text-green-400">{normalSensors.length}</p>
              <p className="text-xs text-slate-500 mt-1">
                {selectedFilter === 'normal' ? '✓ 필터링 중' : '클릭하여 필터링'}
              </p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </button>
      </div>

      {/* 지도와 상세 정보 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 지도 영역 */}
        <div className={`${selectedSensor ? 'lg:col-span-2' : 'lg:col-span-3'} control-panel rounded-lg p-1`}>
          <KakaoMap
            sensorData={filteredSensorData}
            onMarkerClick={handleMarkerClick}
          />
        </div>

        {/* 선택된 센서 상세 정보 */}
        {selectedSensor && (
          <div className="control-panel rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                센서 상세 정보
              </h3>
              <button
                onClick={() => setSelectedSensor(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* 기본 정보 */}
              <div>
                <h4 className="text-white font-semibold mb-2">{selectedSensor.location.name}</h4>
                <p className="text-sm text-slate-400">{selectedSensor.location.district}</p>
                <p className="text-sm text-slate-400">ID: {selectedSensor.deviceId}</p>
              </div>

              {/* 상태 정보 */}
              <div>
                <h5 className="text-white font-medium mb-2">현재 상태</h5>
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedSensor.status === 'critical' ? 'bg-red-500/20 text-red-400' :
                    selectedSensor.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {selectedSensor.status === 'critical' ? '위험' :
                     selectedSensor.status === 'warning' ? '주의' : '정상'}
                  </span>
                </div>
                <p className="text-2xl font-bold text-white">
                  위험도: {selectedSensor.riskAnalysis.currentRisk}%
                </p>
              </div>

              {/* 센서 측정값 */}
              <div>
                <h5 className="text-white font-medium mb-3">센서 측정값</h5>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">수위</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${selectedSensor.measurements.waterLevel}%` }}
                        ></div>
                      </div>
                      <span className="text-white font-semibold w-12 text-right">
                        {selectedSensor.measurements.waterLevel}%
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">쓰레기량</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full"
                          style={{ width: `${selectedSensor.measurements.debrisLevel}%` }}
                        ></div>
                      </div>
                      <span className="text-white font-semibold w-12 text-right">
                        {selectedSensor.measurements.debrisLevel}%
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-300">유량</span>
                    <span className="text-white">{selectedSensor.measurements.flowRate} L/min</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-300">온도</span>
                    <span className="text-white">{selectedSensor.measurements.temperature}°C</span>
                  </div>
                </div>
              </div>

              {/* AI 분석 */}
              <div>
                <h5 className="text-white font-medium mb-2">AI 분석 결과</h5>
                <div className="bg-slate-800 rounded-lg p-3">
                  <p className="text-sm text-slate-300 mb-2">
                    <strong>예측 위험도 (6시간 후):</strong> {selectedSensor.riskAnalysis.predictedRisk}%
                  </p>
                  <p className="text-sm text-slate-300 mb-2">
                    <strong>위험 요인:</strong> {selectedSensor.riskAnalysis.factors.join(', ')}
                  </p>
                  <p className="text-sm text-slate-300">
                    <strong>권장 조치:</strong> {selectedSensor.riskAnalysis.recommendation}
                  </p>
                </div>
              </div>

              {/* 업데이트 시간 */}
              <div className="text-xs text-slate-400 border-t border-slate-700 pt-3">
                마지막 업데이트: {selectedSensor.timestamp.toLocaleString('ko-KR')}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}