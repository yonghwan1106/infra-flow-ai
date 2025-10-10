'use client';

import { useState } from 'react';
import KakaoMap from '@/components/map/KakaoMap';
import { SensorData, MaintenanceTask } from '@/types';
import { OptimizedRoute } from '@/lib/routeOptimizer';
import { MapPin, Route, X, TrendingDown, Clock, DollarSign } from 'lucide-react';

interface RouteMapViewProps {
  sensorData: SensorData[];
  selectedTeam: string;
  optimizedRoute: OptimizedRoute;
  onClose: () => void;
}

export default function RouteMapView({
  sensorData,
  selectedTeam,
  optimizedRoute,
  onClose
}: RouteMapViewProps) {
  const [selectedStep, setSelectedStep] = useState<number | null>(null);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-lg w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* 헤더 */}
        <div className="bg-slate-800 p-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Route className="h-6 w-6 text-blue-400" />
              <div>
                <h2 className="text-xl font-bold text-white">{selectedTeam} 최적화 경로</h2>
                <p className="text-sm text-slate-400">TSP 알고리즘 기반 자동 경로 생성</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* 컨텐츠 */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-0 overflow-hidden">
          {/* 지도 영역 */}
          <div className="lg:col-span-2 h-full">
            <KakaoMap
              sensorData={sensorData}
              optimizedRoute={optimizedRoute}
              showRoute={true}
              onMarkerClick={() => {}}
            />
          </div>

          {/* 경로 상세 정보 */}
          <div className="bg-slate-800 p-6 overflow-y-auto">
            {/* 절감 효과 */}
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3">절감 효과</h3>
              <div className="space-y-3">
                <div className="bg-slate-900 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-slate-400 text-sm">거리 절감</span>
                    <TrendingDown className="h-4 w-4 text-green-400" />
                  </div>
                  <p className="text-xl font-bold text-green-400">
                    {optimizedRoute.savings.distanceReduction.toFixed(1)}%
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    총 {optimizedRoute.totalDistance}km
                  </p>
                </div>

                <div className="bg-slate-900 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-slate-400 text-sm">시간 절감</span>
                    <Clock className="h-4 w-4 text-blue-400" />
                  </div>
                  <p className="text-xl font-bold text-blue-400">
                    {optimizedRoute.savings.timeReduction}분
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    총 {Math.floor(optimizedRoute.totalTime / 60)}시간 {optimizedRoute.totalTime % 60}분
                  </p>
                </div>

                <div className="bg-slate-900 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-slate-400 text-sm">연료비 절감</span>
                    <DollarSign className="h-4 w-4 text-yellow-400" />
                  </div>
                  <p className="text-xl font-bold text-yellow-400">
                    {optimizedRoute.savings.fuelSavings}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">예상 절감액</p>
                </div>
              </div>
            </div>

            {/* 작업 순서 */}
            <div>
              <h3 className="text-white font-semibold mb-3">작업 순서</h3>
              <div className="space-y-2">
                {optimizedRoute.path.map((step, index) => (
                  <div
                    key={step.taskId}
                    onClick={() => setSelectedStep(index)}
                    className={`bg-slate-900 rounded-lg p-3 cursor-pointer transition-all ${
                      selectedStep === index
                        ? 'ring-2 ring-blue-500'
                        : 'hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {/* 순서 번호 */}
                      <div className="flex-shrink-0">
                        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{step.order}</span>
                        </div>
                      </div>

                      {/* 위치 정보 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <MapPin className="h-3 w-3 text-slate-400 flex-shrink-0" />
                          <span className="text-white text-sm font-medium truncate">
                            {step.location}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3 text-xs text-slate-400">
                          <span>🕐 {step.arrivalTime}</span>
                          <span>⏱️ {step.duration}분</span>
                        </div>
                        {step.distanceFromPrevious > 0 && (
                          <div className="text-xs text-slate-500 mt-1">
                            ↗ 이전 지점에서 {step.distanceFromPrevious}km
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 알고리즘 설명 */}
            <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2 text-sm">🎯 최적화 알고리즘</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>TSP (Traveling Salesman Problem)</strong> 기반으로
                Nearest Neighbor + 2-opt 알고리즘을 사용하여 최단 거리를 계산하고,
                긴급 작업을 우선 배치하여 위험도를 최소화합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
