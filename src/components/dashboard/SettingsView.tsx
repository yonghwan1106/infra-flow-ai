'use client';

import { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  RefreshCw,
  Bell,
  Shield,
  Database,
  Monitor,
  Users,
  Map,
  Cloud,
  Zap,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react';

interface SettingsConfig {
  // 알림 설정
  notifications: {
    enabled: boolean;
    sound: boolean;
    desktop: boolean;
    email: boolean;
    criticalOnly: boolean;
    updateInterval: number;
  };
  // 대시보드 설정
  dashboard: {
    autoRefresh: boolean;
    refreshInterval: number;
    showWeather: boolean;
    showMap: boolean;
    theme: 'dark' | 'light';
    language: 'ko' | 'en';
  };
  // 센서 설정
  sensors: {
    criticalThreshold: number;
    warningThreshold: number;
    dataRetention: number;
    alertDelay: number;
  };
  // API 설정
  api: {
    claude: {
      enabled: boolean;
      model: string;
      maxTokens: number;
    };
    kakao: {
      enabled: boolean;
      mapLevel: number;
    };
    weather: {
      enabled: boolean;
      updateInterval: number;
    };
  };
  // 사용자 설정
  user: {
    role: 'admin' | 'operator' | 'viewer';
    name: string;
    department: string;
    timezone: string;
  };
}

export default function SettingsView() {
  const [config, setConfig] = useState<SettingsConfig>({
    notifications: {
      enabled: true,
      sound: true,
      desktop: true,
      email: false,
      criticalOnly: false,
      updateInterval: 30
    },
    dashboard: {
      autoRefresh: true,
      refreshInterval: 5,
      showWeather: true,
      showMap: true,
      theme: 'dark',
      language: 'ko'
    },
    sensors: {
      criticalThreshold: 80,
      warningThreshold: 60,
      dataRetention: 30,
      alertDelay: 5
    },
    api: {
      claude: {
        enabled: true,
        model: 'claude-3-5-sonnet-20241022',
        maxTokens: 1000
      },
      kakao: {
        enabled: true,
        mapLevel: 4
      },
      weather: {
        enabled: true,
        updateInterval: 10
      }
    },
    user: {
      role: 'admin',
      name: '관제센터 관리자',
      department: '강남구 도시관리공단',
      timezone: 'Asia/Seoul'
    }
  });

  const [activeTab, setActiveTab] = useState('notifications');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [apiTestResults, setApiTestResults] = useState<{[key: string]: 'success' | 'error' | 'testing' | null}>({
    claude: null,
    kakao: null,
    weather: null
  });
  const [showApiKeys, setShowApiKeys] = useState(false);

  const tabs = [
    { id: 'notifications', label: '알림 설정', icon: Bell },
    { id: 'dashboard', label: '대시보드', icon: Monitor },
    { id: 'sensors', label: '센서 설정', icon: Database },
    { id: 'api', label: 'API 설정', icon: Cloud },
    { id: 'user', label: '사용자', icon: Users },
    { id: 'system', label: '시스템', icon: Settings }
  ];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 설정 저장 로직 (localStorage 또는 API 호출)
      localStorage.setItem('infraflow-settings', JSON.stringify(config));

      // 시뮬레이션 지연
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSaveMessage('설정이 저장되었습니다.');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('설정 저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const testApi = async (apiType: 'claude' | 'kakao' | 'weather') => {
    setApiTestResults(prev => ({ ...prev, [apiType]: 'testing' }));

    try {
      let response;

      switch (apiType) {
        case 'claude':
          response = await fetch('/api/test/claude', { method: 'POST' });
          break;
        case 'kakao':
          response = await fetch('/api/test/kakao', { method: 'POST' });
          break;
        case 'weather':
          response = await fetch('/api/test/weather', { method: 'POST' });
          break;
      }

      if (response?.ok) {
        setApiTestResults(prev => ({ ...prev, [apiType]: 'success' }));
      } else {
        setApiTestResults(prev => ({ ...prev, [apiType]: 'error' }));
      }
    } catch (error) {
      setApiTestResults(prev => ({ ...prev, [apiType]: 'error' }));
    }
  };

  const renderTestButton = (apiType: 'claude' | 'kakao' | 'weather') => {
    const status = apiTestResults[apiType];

    return (
      <button
        onClick={() => testApi(apiType)}
        disabled={status === 'testing'}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
          status === 'success' ? 'bg-green-600 text-white' :
          status === 'error' ? 'bg-red-600 text-white' :
          status === 'testing' ? 'bg-blue-600 text-white' :
          'bg-slate-600 hover:bg-slate-500 text-slate-300'
        }`}
      >
        {status === 'testing' ? (
          <div className="flex items-center space-x-1">
            <RefreshCw className="h-3 w-3 animate-spin" />
            <span>테스트 중</span>
          </div>
        ) : status === 'success' ? (
          <div className="flex items-center space-x-1">
            <CheckCircle className="h-3 w-3" />
            <span>성공</span>
          </div>
        ) : status === 'error' ? (
          <div className="flex items-center space-x-1">
            <AlertTriangle className="h-3 w-3" />
            <span>실패</span>
          </div>
        ) : (
          '연결 테스트'
        )}
      </button>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'notifications':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">알림 설정</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-white font-medium">알림 활성화</label>
                  <p className="text-sm text-slate-400">시스템 알림을 받습니다</p>
                </div>
                <input
                  type="checkbox"
                  checked={config.notifications.enabled}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, enabled: e.target.checked }
                  }))}
                  className="w-4 h-4"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-white font-medium">사운드 알림</label>
                  <p className="text-sm text-slate-400">새 알림 시 소리로 알립니다</p>
                </div>
                <input
                  type="checkbox"
                  checked={config.notifications.sound}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, sound: e.target.checked }
                  }))}
                  className="w-4 h-4"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-white font-medium">긴급 알림만</label>
                  <p className="text-sm text-slate-400">긴급 알림만 받습니다</p>
                </div>
                <input
                  type="checkbox"
                  checked={config.notifications.criticalOnly}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, criticalOnly: e.target.checked }
                  }))}
                  className="w-4 h-4"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">업데이트 주기 (초)</label>
                <input
                  type="number"
                  min="5"
                  max="300"
                  value={config.notifications.updateInterval}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, updateInterval: parseInt(e.target.value) }
                  }))}
                  className="w-full bg-slate-700 text-white rounded px-3 py-2"
                />
              </div>
            </div>
          </div>
        );

      case 'dashboard':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">대시보드 설정</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-white font-medium">자동 새로고침</label>
                  <p className="text-sm text-slate-400">데이터를 자동으로 업데이트합니다</p>
                </div>
                <input
                  type="checkbox"
                  checked={config.dashboard.autoRefresh}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    dashboard: { ...prev.dashboard, autoRefresh: e.target.checked }
                  }))}
                  className="w-4 h-4"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">새로고침 주기 (초)</label>
                <input
                  type="number"
                  min="3"
                  max="60"
                  value={config.dashboard.refreshInterval}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    dashboard: { ...prev.dashboard, refreshInterval: parseInt(e.target.value) }
                  }))}
                  className="w-full bg-slate-700 text-white rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">언어</label>
                <select
                  value={config.dashboard.language}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    dashboard: { ...prev.dashboard, language: e.target.value as 'ko' | 'en' }
                  }))}
                  className="w-full bg-slate-700 text-white rounded px-3 py-2"
                >
                  <option value="ko">한국어</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'sensors':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">센서 설정</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">위험 임계값 (%)</label>
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={config.sensors.criticalThreshold}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    sensors: { ...prev.sensors, criticalThreshold: parseInt(e.target.value) }
                  }))}
                  className="w-full bg-slate-700 text-white rounded px-3 py-2"
                />
                <p className="text-sm text-slate-400 mt-1">이 값 이상일 때 위험 알림이 발송됩니다</p>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">주의 임계값 (%)</label>
                <input
                  type="number"
                  min="30"
                  max="80"
                  value={config.sensors.warningThreshold}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    sensors: { ...prev.sensors, warningThreshold: parseInt(e.target.value) }
                  }))}
                  className="w-full bg-slate-700 text-white rounded px-3 py-2"
                />
                <p className="text-sm text-slate-400 mt-1">이 값 이상일 때 주의 알림이 발송됩니다</p>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">데이터 보관 기간 (일)</label>
                <input
                  type="number"
                  min="7"
                  max="365"
                  value={config.sensors.dataRetention}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    sensors: { ...prev.sensors, dataRetention: parseInt(e.target.value) }
                  }))}
                  className="w-full bg-slate-700 text-white rounded px-3 py-2"
                />
              </div>
            </div>
          </div>
        );

      case 'api':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">API 설정</h3>
              <button
                onClick={() => setShowApiKeys(!showApiKeys)}
                className="flex items-center space-x-2 text-slate-400 hover:text-white"
              >
                {showApiKeys ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span>{showApiKeys ? 'API 키 숨기기' : 'API 키 보기'}</span>
              </button>
            </div>

            <div className="space-y-6">
              {/* Claude API */}
              <div className="bg-slate-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white font-medium">Claude AI API</h4>
                  {renderTestButton('claude')}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">API 사용</span>
                    <input
                      type="checkbox"
                      checked={config.api.claude.enabled}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        api: { ...prev.api, claude: { ...prev.api.claude, enabled: e.target.checked } }
                      }))}
                      className="w-4 h-4"
                    />
                  </div>

                  {showApiKeys && (
                    <div>
                      <label className="block text-slate-300 text-sm mb-1">API 키</label>
                      <input
                        type="password"
                        value="sk-ant-api03-NWr2wvL1I90fOLFVKy7g..."
                        readOnly
                        className="w-full bg-slate-700 text-slate-400 rounded px-3 py-2 text-sm"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-slate-300 text-sm mb-1">모델</label>
                    <select
                      value={config.api.claude.model}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        api: { ...prev.api, claude: { ...prev.api.claude, model: e.target.value } }
                      }))}
                      className="w-full bg-slate-700 text-white rounded px-3 py-2 text-sm"
                    >
                      <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet</option>
                      <option value="claude-3-5-haiku-20241022">Claude 3.5 Haiku</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Kakao Map API */}
              <div className="bg-slate-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white font-medium">카카오 지도 API</h4>
                  {renderTestButton('kakao')}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">API 사용</span>
                    <input
                      type="checkbox"
                      checked={config.api.kakao.enabled}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        api: { ...prev.api, kakao: { ...prev.api.kakao, enabled: e.target.checked } }
                      }))}
                      className="w-4 h-4"
                    />
                  </div>

                  {showApiKeys && (
                    <div>
                      <label className="block text-slate-300 text-sm mb-1">API 키</label>
                      <input
                        type="password"
                        value="b0f49a85cf2dfefcd8ac377de88d38a3"
                        readOnly
                        className="w-full bg-slate-700 text-slate-400 rounded px-3 py-2 text-sm"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-slate-300 text-sm mb-1">기본 지도 레벨</label>
                    <input
                      type="number"
                      min="1"
                      max="14"
                      value={config.api.kakao.mapLevel}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        api: { ...prev.api, kakao: { ...prev.api.kakao, mapLevel: parseInt(e.target.value) } }
                      }))}
                      className="w-full bg-slate-700 text-white rounded px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Weather API */}
              <div className="bg-slate-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white font-medium">기상청 API</h4>
                  {renderTestButton('weather')}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">API 사용</span>
                    <input
                      type="checkbox"
                      checked={config.api.weather.enabled}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        api: { ...prev.api, weather: { ...prev.api.weather, enabled: e.target.checked } }
                      }))}
                      className="w-4 h-4"
                    />
                  </div>

                  {showApiKeys && (
                    <div>
                      <label className="block text-slate-300 text-sm mb-1">API 키</label>
                      <input
                        type="password"
                        value="Lw8JpvInQjSPCabyJ7I0qA"
                        readOnly
                        className="w-full bg-slate-700 text-slate-400 rounded px-3 py-2 text-sm"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'user':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">사용자 설정</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">이름</label>
                <input
                  type="text"
                  value={config.user.name}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    user: { ...prev.user, name: e.target.value }
                  }))}
                  className="w-full bg-slate-700 text-white rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">부서</label>
                <input
                  type="text"
                  value={config.user.department}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    user: { ...prev.user, department: e.target.value }
                  }))}
                  className="w-full bg-slate-700 text-white rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">권한</label>
                <select
                  value={config.user.role}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    user: { ...prev.user, role: e.target.value as 'admin' | 'operator' | 'viewer' }
                  }))}
                  className="w-full bg-slate-700 text-white rounded px-3 py-2"
                >
                  <option value="admin">관리자</option>
                  <option value="operator">운영자</option>
                  <option value="viewer">조회자</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'system':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">시스템 정보</h3>

            <div className="space-y-4">
              <div className="bg-slate-800 rounded-lg p-4">
                <h4 className="text-white font-medium mb-3">버전 정보</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Infra-Flow AI</span>
                    <span className="text-white">v1.0.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Next.js</span>
                    <span className="text-white">15.5.3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Claude API</span>
                    <span className="text-white">v1.0</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 rounded-lg p-4">
                <h4 className="text-white font-medium mb-3">시스템 상태</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">서비스 상태</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-400 text-sm">정상</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">데이터베이스</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-400 text-sm">연결됨</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">AI 서비스</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-400 text-sm">활성</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white flex items-center">
          <Settings className="h-8 w-8 mr-3 text-blue-400" />
          시스템 설정
        </h2>
        <div className="flex items-center space-x-4">
          {saveMessage && (
            <div className={`px-3 py-1 rounded text-sm ${
              saveMessage.includes('실패') ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
            }`}>
              {saveMessage}
            </div>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg font-medium transition-colors"
          >
            {isSaving ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>저장 중...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>설정 저장</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 탭과 콘텐츠 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 탭 목록 */}
        <div className="control-panel rounded-lg p-6">
          <h3 className="text-white font-semibold mb-4">설정 메뉴</h3>
          <div className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 설정 콘텐츠 */}
        <div className="lg:col-span-3 control-panel rounded-lg p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}