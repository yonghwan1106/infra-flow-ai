'use client';

import { useState, useEffect } from 'react';
import { SensorData } from '@/types';
import {
  Bell,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  Clock,
  MapPin,
  Filter,
  Search,
  X,
  Volume2,
  VolumeX,
  Settings,
  Trash2
} from 'lucide-react';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  location: string;
  deviceId: string;
  timestamp: Date;
  isRead: boolean;
  isAcknowledged: boolean;
  priority: 'high' | 'medium' | 'low';
  category: 'sensor' | 'system' | 'weather' | 'maintenance';
}

interface AlertsViewProps {
  sensorData: SensorData[];
}

export default function AlertsView({ sensorData }: AlertsViewProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  // 알림 생성
  useEffect(() => {
    const generateAlerts = () => {
      const newAlerts: Alert[] = [];

      // 센서 기반 알림 생성
      sensorData.forEach((sensor, index) => {
        if (sensor.status === 'critical') {
          newAlerts.push({
            id: `alert-critical-${sensor.id}`,
            type: 'critical',
            title: '긴급: 빗물받이 막힘 위험',
            message: `${sensor.location.name}에서 수위 ${sensor.measurements.waterLevel}%, 쓰레기량 ${sensor.measurements.debrisLevel}% 달성. 즉시 조치 필요`,
            location: sensor.location.name,
            deviceId: sensor.deviceId,
            timestamp: new Date(Date.now() - Math.random() * 3600000),
            isRead: Math.random() > 0.7,
            isAcknowledged: Math.random() > 0.8,
            priority: 'high',
            category: 'sensor'
          });
        } else if (sensor.status === 'warning') {
          newAlerts.push({
            id: `alert-warning-${sensor.id}`,
            type: 'warning',
            title: '주의: 빗물받이 상태 점검 필요',
            message: `${sensor.location.name}에서 위험도 ${sensor.riskAnalysis.currentRisk}% 도달. 모니터링 강화 권장`,
            location: sensor.location.name,
            deviceId: sensor.deviceId,
            timestamp: new Date(Date.now() - Math.random() * 7200000),
            isRead: Math.random() > 0.5,
            isAcknowledged: Math.random() > 0.6,
            priority: 'medium',
            category: 'sensor'
          });
        }
      });

      // 시스템 알림 추가
      const systemAlerts: Omit<Alert, 'id'>[] = [
        {
          type: 'info',
          title: '시스템 업데이트 완료',
          message: 'AI 예측 모델이 v2.1로 업데이트되었습니다. 예측 정확도가 89%로 향상되었습니다.',
          location: '시스템',
          deviceId: 'SYSTEM',
          timestamp: new Date(Date.now() - 1800000),
          isRead: false,
          isAcknowledged: false,
          priority: 'low',
          category: 'system'
        },
        {
          type: 'warning',
          title: '기상청 호우 특보',
          message: '강남구 일대에 호우특보가 발령되었습니다. 향후 6시간 동안 80mm 이상의 강우가 예상됩니다.',
          location: '강남구 전체',
          deviceId: 'WEATHER',
          timestamp: new Date(Date.now() - 900000),
          isRead: true,
          isAcknowledged: false,
          priority: 'high',
          category: 'weather'
        },
        {
          type: 'success',
          title: '청소 작업 완료',
          message: '청소팀 3에서 강남역 2번 출구 빗물받이 청소를 완료했습니다. 위험도가 95%에서 15%로 감소했습니다.',
          location: '강남역 2번 출구',
          deviceId: 'INF-GN-001',
          timestamp: new Date(Date.now() - 3600000),
          isRead: true,
          isAcknowledged: true,
          priority: 'medium',
          category: 'maintenance'
        }
      ];

      systemAlerts.forEach((alert, index) => {
        newAlerts.push({
          ...alert,
          id: `system-alert-${index}`
        });
      });

      // 시간순 정렬
      newAlerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      setAlerts(newAlerts.slice(0, 50)); // 최대 50개
    };

    generateAlerts();
  }, [sensorData]);

  // 필터링
  useEffect(() => {
    let filtered = alerts;

    // 타입 필터
    if (filterType !== 'all') {
      filtered = filtered.filter(alert => alert.type === filterType);
    }

    // 카테고리 필터
    if (filterCategory !== 'all') {
      filtered = filtered.filter(alert => alert.category === filterCategory);
    }

    // 검색
    if (searchTerm) {
      filtered = filtered.filter(alert =>
        alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAlerts(filtered);
  }, [alerts, filterType, filterCategory, searchTerm]);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-400" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-400" />;
      case 'info': return <Info className="h-5 w-5 text-blue-400" />;
      case 'success': return <CheckCircle className="h-5 w-5 text-green-400" />;
      default: return <Bell className="h-5 w-5 text-slate-400" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'border-red-500/30 bg-red-500/10';
      case 'warning': return 'border-yellow-500/30 bg-yellow-500/10';
      case 'info': return 'border-blue-500/30 bg-blue-500/10';
      case 'success': return 'border-green-500/30 bg-green-500/10';
      default: return 'border-slate-500/30 bg-slate-500/10';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      default: return 'text-slate-400';
    }
  };

  const markAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId ? { ...alert, isAcknowledged: true } : alert
    ));
  };

  const deleteAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    if (selectedAlert?.id === alertId) {
      setSelectedAlert(null);
    }
  };

  const unreadCount = alerts.filter(alert => !alert.isRead).length;
  const criticalCount = alerts.filter(alert => alert.type === 'critical' && !alert.isAcknowledged).length;

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white flex items-center">
          <Bell className="h-8 w-8 mr-3 text-blue-400" />
          알림 센터
          {unreadCount > 0 && (
            <span className="ml-3 bg-red-500 text-white text-sm px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsSoundEnabled(!isSoundEnabled)}
            className={`p-2 rounded-lg transition-colors ${
              isSoundEnabled ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'
            }`}
          >
            {isSoundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="control-panel rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">전체 알림</p>
              <p className="text-2xl font-bold text-white">{alerts.length}</p>
            </div>
            <Bell className="h-6 w-6 text-blue-400" />
          </div>
        </div>

        <div className="control-panel rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">읽지 않음</p>
              <p className="text-2xl font-bold text-red-400">{unreadCount}</p>
            </div>
            <AlertCircle className="h-6 w-6 text-red-400" />
          </div>
        </div>

        <div className="control-panel rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">긴급 대응</p>
              <p className="text-2xl font-bold text-yellow-400">{criticalCount}</p>
            </div>
            <AlertTriangle className="h-6 w-6 text-yellow-400" />
          </div>
        </div>

        <div className="control-panel rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">오늘 처리</p>
              <p className="text-2xl font-bold text-green-400">
                {alerts.filter(alert => alert.isAcknowledged &&
                  alert.timestamp.toDateString() === new Date().toDateString()).length}
              </p>
            </div>
            <CheckCircle className="h-6 w-6 text-green-400" />
          </div>
        </div>
      </div>

      {/* 필터 및 검색 */}
      <div className="control-panel rounded-lg p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-700 text-white rounded px-3 py-1 text-sm"
            >
              <option value="all">모든 타입</option>
              <option value="critical">긴급</option>
              <option value="warning">주의</option>
              <option value="info">정보</option>
              <option value="success">성공</option>
            </select>
          </div>

          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-slate-700 text-white rounded px-3 py-1 text-sm"
            >
              <option value="all">모든 카테고리</option>
              <option value="sensor">센서</option>
              <option value="system">시스템</option>
              <option value="weather">기상</option>
              <option value="maintenance">작업</option>
            </select>
          </div>

          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="알림 검색..."
                className="w-full bg-slate-700 text-white rounded pl-10 pr-4 py-2 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 알림 목록 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 알림 리스트 */}
        <div className={`${selectedAlert ? 'lg:col-span-2' : 'lg:col-span-3'} control-panel rounded-lg p-6`}>
          <h3 className="text-white font-semibold mb-4">
            알림 목록 ({filteredAlerts.length})
          </h3>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                onClick={() => {
                  setSelectedAlert(alert);
                  markAsRead(alert.id);
                }}
                className={`border rounded-lg p-4 cursor-pointer transition-colors hover:bg-slate-800/50 ${
                  getAlertColor(alert.type)
                } ${!alert.isRead ? 'border-l-4' : ''} ${
                  selectedAlert?.id === alert.id ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className={`font-medium ${!alert.isRead ? 'text-white' : 'text-slate-300'}`}>
                          {alert.title}
                        </h4>
                        {!alert.isRead && (
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-sm text-slate-400 mb-2">{alert.message}</p>
                      <div className="flex items-center space-x-4 text-xs text-slate-500">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{alert.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{alert.timestamp.toLocaleString('ko-KR')}</span>
                        </div>
                        <span className={`font-medium ${getPriorityColor(alert.priority)}`}>
                          {alert.priority === 'high' ? '높음' : alert.priority === 'medium' ? '보통' : '낮음'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {alert.isAcknowledged && (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteAlert(alert.id);
                      }}
                      className="text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredAlerts.length === 0 && (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-400">조건에 맞는 알림이 없습니다</p>
            </div>
          )}
        </div>

        {/* 선택된 알림 상세 */}
        {selectedAlert && (
          <div className="control-panel rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">알림 상세</h3>
              <button
                onClick={() => setSelectedAlert(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                {getAlertIcon(selectedAlert.type)}
                <h4 className="text-white font-medium">{selectedAlert.title}</h4>
              </div>

              <div className="bg-slate-800 rounded-lg p-4">
                <p className="text-slate-300">{selectedAlert.message}</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">위치:</span>
                  <span className="text-white">{selectedAlert.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">장치 ID:</span>
                  <span className="text-white">{selectedAlert.deviceId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">시간:</span>
                  <span className="text-white">{selectedAlert.timestamp.toLocaleString('ko-KR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">우선순위:</span>
                  <span className={getPriorityColor(selectedAlert.priority)}>
                    {selectedAlert.priority === 'high' ? '높음' : selectedAlert.priority === 'medium' ? '보통' : '낮음'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">카테고리:</span>
                  <span className="text-white">
                    {selectedAlert.category === 'sensor' ? '센서' :
                     selectedAlert.category === 'system' ? '시스템' :
                     selectedAlert.category === 'weather' ? '기상' : '작업'}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => acknowledgeAlert(selectedAlert.id)}
                  disabled={selectedAlert.isAcknowledged}
                  className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedAlert.isAcknowledged
                      ? 'bg-green-600/20 text-green-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {selectedAlert.isAcknowledged ? '처리 완료' : '처리 확인'}
                </button>

                <button
                  onClick={() => deleteAlert(selectedAlert.id)}
                  className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  알림 삭제
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}