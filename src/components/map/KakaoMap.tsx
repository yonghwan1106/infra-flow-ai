'use client';

import { useEffect, useRef } from 'react';
import { SensorData } from '@/types';

interface KakaoMap {
  setCenter: (latlng: { getLat: () => number; getLng: () => number }) => void;
  setLevel: (level: number) => void;
}

interface KakaoLatLng {
  getLat: () => number;
  getLng: () => number;
}

declare global {
  interface Window {
    kakao: {
      maps: {
        Map: new (container: HTMLElement, options: { center: KakaoLatLng; level: number }) => KakaoMap;
        LatLng: new (lat: number, lng: number) => KakaoLatLng;
        Marker: new (options: { position: KakaoLatLng; map: KakaoMap }) => void;
        load: (callback: () => void) => void;
      };
    };
  }
}

interface KakaoMapProps {
  sensorData: SensorData[];
  onMarkerClick?: (sensor: SensorData) => void;
}

export default function KakaoMap({ sensorData, onMarkerClick }: KakaoMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<KakaoMap | null>(null);
  const markers = useRef<unknown[]>([]);

  // 강남구 중심 좌표
  const defaultCenter = { lat: 37.5172, lng: 127.0473 };

  useEffect(() => {
    if (!window.kakao || !mapContainer.current) return;

    // 지도 초기화
    if (!map.current) {
      const options = {
        center: new window.kakao.maps.LatLng(defaultCenter.lat, defaultCenter.lng),
        level: 4,
      };
      map.current = new window.kakao.maps.Map(mapContainer.current, options);
    }

    // 기존 마커 제거
    markers.current.forEach(marker => marker.setMap(null));
    markers.current = [];

    // 새 마커 추가
    sensorData.forEach(sensor => {
      const position = new window.kakao.maps.LatLng(
        sensor.location.lat,
        sensor.location.lng
      );

      // 상태에 따른 마커 색상
      const markerImage = createMarkerImage(sensor.status);

      const marker = new window.kakao.maps.Marker({
        position,
        image: markerImage,
        title: sensor.location.name,
      });

      marker.setMap(map.current);

      // 마커 클릭 이벤트
      window.kakao.maps.event.addListener(marker, 'click', () => {
        if (onMarkerClick) {
          onMarkerClick(sensor);
        }
      });

      // 정보창 생성
      const infoWindow = createInfoWindow(sensor);

      // 마커 호버 이벤트
      window.kakao.maps.event.addListener(marker, 'mouseover', () => {
        infoWindow.open(map.current, marker);
      });

      window.kakao.maps.event.addListener(marker, 'mouseout', () => {
        infoWindow.close();
      });

      markers.current.push(marker);
    });
  }, [sensorData, onMarkerClick]);

  // 카카오 지도 스크립트 로드
  useEffect(() => {
    const kakaoMapApiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;

    if (!window.kakao) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoMapApiKey || 'demo'}&autoload=false`;

      script.onload = () => {
        window.kakao.maps.load(() => {
          // 지도 로드 완료 후 처리
        });
      };

      document.head.appendChild(script);
    }
  }, []);

  // 마커 이미지 생성
  const createMarkerImage = (status: string) => {
    const colors = {
      critical: '#dc2626', // 빨강
      warning: '#ea580c',  // 주황
      normal: '#16a34a',   // 초록
    };

    const color = colors[status as keyof typeof colors] || colors.normal;

    // SVG 마커 생성
    const svgMarker = `
      <svg width="24" height="30" viewBox="0 0 24 30" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C7 0 3 4 3 9c0 5 9 21 9 21s9-16 9-21c0-5-4-9-9-9z"
              fill="${color}" stroke="#fff" stroke-width="2"/>
        <circle cx="12" cy="9" r="4" fill="#fff"/>
      </svg>
    `;

    const encodedSvg = encodeURIComponent(svgMarker);
    const dataUri = `data:image/svg+xml,${encodedSvg}`;

    return new window.kakao.maps.MarkerImage(
      dataUri,
      new window.kakao.maps.Size(24, 30),
      { offset: new window.kakao.maps.Point(12, 30) }
    );
  };

  // 정보창 생성
  const createInfoWindow = (sensor: SensorData) => {
    const statusText = {
      critical: '위험',
      warning: '주의',
      normal: '정상'
    };

    const content = `
      <div style="padding: 8px; min-width: 200px; background: #1e293b; color: white; border-radius: 8px; font-size: 12px;">
        <div style="font-weight: bold; margin-bottom: 4px;">${sensor.location.name}</div>
        <div style="margin-bottom: 2px;">상태: <span style="color: ${
          sensor.status === 'critical' ? '#ef4444' :
          sensor.status === 'warning' ? '#f97316' : '#22c55e'
        }">${statusText[sensor.status]}</span></div>
        <div style="margin-bottom: 2px;">위험도: ${sensor.riskAnalysis.currentRisk}%</div>
        <div style="margin-bottom: 2px;">수위: ${sensor.measurements.waterLevel}%</div>
        <div>쓰레기량: ${sensor.measurements.debrisLevel}%</div>
      </div>
    `;

    return new window.kakao.maps.InfoWindow({
      content,
      removable: false,
    });
  };

  return (
    <div className="relative w-full h-full">
      <div
        ref={mapContainer}
        className="w-full h-full rounded-lg"
        style={{ minHeight: '400px' }}
      />

      {/* 지도 범례 */}
      <div className="absolute top-4 right-4 bg-slate-800 rounded-lg p-4 border border-slate-700">
        <h4 className="text-white font-semibold mb-3 text-sm">상태 범례</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-slate-300 text-xs">위험 (80% 이상)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-slate-300 text-xs">주의 (50-79%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-slate-300 text-xs">정상 (50% 미만)</span>
          </div>
        </div>
      </div>

      {/* 지도 컨트롤 */}
      <div className="absolute bottom-4 left-4 bg-slate-800 rounded-lg p-2 border border-slate-700">
        <div className="text-slate-300 text-xs">
          총 {sensorData.length}개 센서
        </div>
      </div>
    </div>
  );
}