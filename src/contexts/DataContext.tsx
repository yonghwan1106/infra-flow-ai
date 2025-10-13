'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { generateSensorData, generateMaintenanceTasks, generateWeatherData, generateDashboardStats, generateAlerts } from '@/lib/mockData';
import { SensorData, MaintenanceTask, WeatherData, DashboardStats } from '@/types';

interface DataContextType {
  sensorData: SensorData[];
  tasks: MaintenanceTask[];
  weather: WeatherData | null;
  stats: DashboardStats | null;
  alerts: { id: string; level: string; message: string; timestamp: Date; location: string }[];
  lastUpdate: Date;
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [alerts, setAlerts] = useState<{ id: string; level: string; message: string; timestamp: Date; location: string }[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let currentWeather: WeatherData | null = null;

    // 초기 데이터 생성
    const initializeData = async () => {
      try {
        const weatherData = await generateWeatherData();
        currentWeather = weatherData;
        const sensors = generateSensorData(1247, weatherData.rainfall);
        const maintenanceTasks = generateMaintenanceTasks(sensors);
        const dashboardStats = generateDashboardStats(sensors, maintenanceTasks);
        const alertData = generateAlerts(sensors);

        setSensorData(sensors);
        setTasks(maintenanceTasks);
        setWeather(weatherData);
        setStats(dashboardStats);
        setAlerts(alertData);
        setIsLoading(false);
      } catch (error) {
        console.error('Data initialization error:', error);
        setIsLoading(false);
      }
    };

    initializeData();

    // 실시간 업데이트 시뮬레이션 (5초마다)
    const interval = setInterval(() => {
      const currentRainfall = currentWeather?.rainfall || 0;
      const updatedSensors = generateSensorData(1247, currentRainfall);
      const updatedTasks = generateMaintenanceTasks(updatedSensors);
      const updatedStats = generateDashboardStats(updatedSensors, updatedTasks);
      const updatedAlerts = generateAlerts(updatedSensors);

      setSensorData(updatedSensors);
      setTasks(updatedTasks);
      setStats(updatedStats);
      setAlerts(updatedAlerts);
      setLastUpdate(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <DataContext.Provider value={{ sensorData, tasks, weather, stats, alerts, lastUpdate, isLoading }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
