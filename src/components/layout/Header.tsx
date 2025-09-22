'use client';

import { Cloud, Shield, Users } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Header() {
  const [currentTime, setCurrentTime] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('ko-KR'));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);
  return (
    <header className="bg-slate-900 border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Cloud className="h-8 w-8 text-blue-400" />
            <h1 className="text-2xl font-bold text-white">
              Infra-Flow AI
            </h1>
          </div>
          <div className="hidden md:flex items-center space-x-1 text-sm text-slate-400">
            <Shield className="h-4 w-4" />
            <span>통합 관제센터</span>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="hidden md:flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full status-indicator"></div>
              <span className="text-slate-300">시스템 정상</span>
            </div>
            <div className="text-slate-400">
              마지막 업데이트: {mounted ? currentTime : '--:--:--'}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-slate-400" />
            <span className="text-sm text-slate-300">관제센터</span>
          </div>
        </div>
      </div>
    </header>
  );
}