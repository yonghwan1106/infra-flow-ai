'use client';

import {
  BarChart3,
  Map,
  Settings,
  Users,
  AlertTriangle,
  Monitor,
  Activity,
  Info
} from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: '대시보드', icon: Monitor },
    { id: 'realtime', label: '실시간 모니터링', icon: Activity },
    { id: 'prediction', label: 'AI 예측 분석', icon: BarChart3 },
    { id: 'map', label: '지도 뷰', icon: Map },
    { id: 'tasks', label: '작업 관리', icon: Users },
    { id: 'alerts', label: '알림 센터', icon: AlertTriangle },
    { id: 'about', label: '프로젝트 소개', icon: Info },
    { id: 'settings', label: '설정', icon: Settings },
  ];

  return (
    <aside className={`bg-slate-800 border-r border-slate-700 transition-all duration-300 overflow-hidden ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="p-4">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full text-left text-slate-400 hover:text-white transition-colors"
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="mt-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center px-4 py-3 text-left transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white border-r-2 border-blue-400'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="ml-3 font-medium">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

    </aside>
  );
}