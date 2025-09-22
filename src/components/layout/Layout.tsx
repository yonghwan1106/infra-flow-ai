'use client';

import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children?: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function Layout({ children, activeTab: propActiveTab, onTabChange: propOnTabChange }: LayoutProps) {
  const [internalActiveTab, setInternalActiveTab] = useState('dashboard');

  const activeTab = propActiveTab ?? internalActiveTab;
  const onTabChange = propOnTabChange ?? setInternalActiveTab;

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={onTabChange} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}