'use client';

import { useEffect, useState, useRef } from 'react';

interface RealtimeData {
  type: string;
  timestamp?: string;
  data?: {
    criticalCount: number;
    warningCount: number;
    normalCount: number;
    completedTasks: number;
    totalTasks: number;
    weather: {
      temperature: number;
      rainfall: number;
      humidity: number;
      windSpeed: number;
      forecast: Array<{
        time: string;
        rainfall: number;
        probability: number;
      }>;
    };
    alerts: Array<{
      id: string;
      location: string;
      message: string;
      severity: string;
      timestamp: Date;
    }>;
    criticalSensors: Array<{
      id: string;
      location: string;
      riskScore: number;
      waterLevel: number;
      debrisLevel: number;
    }>;
  };
  message?: string;
}

export function useRealtime() {
  const [data, setData] = useState<RealtimeData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    // EventSource 연결
    const connectEventSource = () => {
      try {
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
        }

        const eventSource = new EventSource('/api/realtime');
        eventSourceRef.current = eventSource;

        eventSource.onopen = () => {
          console.log('실시간 연결 성공');
          setIsConnected(true);
          setError(null);
        };

        eventSource.onmessage = (event) => {
          try {
            const data: RealtimeData = JSON.parse(event.data);

            if (data.type === 'connected') {
              console.log('실시간 연결 확인:', data.message);
            } else if (data.type === 'update') {
              setData(data);
            } else if (data.type === 'error') {
              setError(data.message || '알 수 없는 오류');
            }
          } catch (parseError) {
            console.error('실시간 데이터 파싱 오류:', parseError);
            setError('데이터 파싱 오류');
          }
        };

        eventSource.onerror = (event) => {
          console.error('실시간 연결 오류:', event);
          setIsConnected(false);
          setError('연결 오류 발생');

          // 재연결 시도 (5초 후)
          setTimeout(() => {
            if (eventSourceRef.current?.readyState === EventSource.CLOSED) {
              console.log('실시간 연결 재시도...');
              connectEventSource();
            }
          }, 5000);
        };

      } catch (initError) {
        console.error('EventSource 초기화 오류:', initError);
        setError('실시간 연결 초기화 실패');
      }
    };

    // 연결 시작
    connectEventSource();

    // 컴포넌트 언마운트 시 연결 해제
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      setIsConnected(false);
    };
  }, []);

  // 수동 재연결
  const reconnect = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
    setError(null);
    setIsConnected(false);
  };

  return {
    data,
    isConnected,
    error,
    reconnect,
  };
}