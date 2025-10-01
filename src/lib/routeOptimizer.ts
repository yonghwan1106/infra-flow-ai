/**
 * 경로 최적화 알고리즘
 * TSP (Traveling Salesman Problem) 기반 청소 작업 경로 최적화
 */

import { SensorData, MaintenanceTask } from '@/types';

// 좌표 인터페이스
interface Coordinates {
  lat: number;
  lng: number;
}

// 최적화된 경로 결과
export interface OptimizedRoute {
  tasks: MaintenanceTask[];
  totalDistance: number; // km
  totalTime: number; // 분
  savings: {
    distanceReduction: number; // %
    timeReduction: number; // 분
    fuelSavings: string; // 예상 연료비 절감
  };
  path: Array<{
    order: number;
    taskId: string;
    deviceId: string;
    location: string;
    coordinates: Coordinates;
    arrivalTime: string;
    duration: number;
    distanceFromPrevious: number;
  }>;
}

/**
 * 두 지점 간 거리 계산 (Haversine formula)
 */
function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371; // 지구 반지름 (km)
  const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
  const dLng = (coord2.lng - coord1.lng) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(coord1.lat * Math.PI / 180) *
    Math.cos(coord2.lat * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

/**
 * 거리 행렬 생성
 */
function createDistanceMatrix(
  tasks: MaintenanceTask[],
  sensorData: SensorData[]
): number[][] {
  const matrix: number[][] = [];

  for (let i = 0; i < tasks.length; i++) {
    matrix[i] = [];
    const sensor1 = sensorData.find(s => s.deviceId === tasks[i].deviceId);

    for (let j = 0; j < tasks.length; j++) {
      if (i === j) {
        matrix[i][j] = 0;
      } else {
        const sensor2 = sensorData.find(s => s.deviceId === tasks[j].deviceId);

        if (sensor1 && sensor2) {
          matrix[i][j] = calculateDistance(
            { lat: sensor1.location.lat, lng: sensor1.location.lng },
            { lat: sensor2.location.lat, lng: sensor2.location.lng }
          );
        } else {
          matrix[i][j] = 999; // 매우 큰 값 (센서 정보 없음)
        }
      }
    }
  }

  return matrix;
}

/**
 * Nearest Neighbor (최근접 이웃) 알고리즘
 * - 현재 위치에서 가장 가까운 미방문 지점을 선택
 * - 빠르지만 최적해는 아님
 */
function nearestNeighborTSP(distanceMatrix: number[][]): number[] {
  const n = distanceMatrix.length;
  const visited = new Array(n).fill(false);
  const route: number[] = [0]; // 첫 번째 작업부터 시작
  visited[0] = true;

  for (let i = 1; i < n; i++) {
    let minDist = Infinity;
    let nearestIndex = -1;

    const current = route[route.length - 1];

    // 가장 가까운 미방문 지점 찾기
    for (let j = 0; j < n; j++) {
      if (!visited[j] && distanceMatrix[current][j] < minDist) {
        minDist = distanceMatrix[current][j];
        nearestIndex = j;
      }
    }

    if (nearestIndex !== -1) {
      route.push(nearestIndex);
      visited[nearestIndex] = true;
    }
  }

  return route;
}

/**
 * 2-opt 개선 알고리즘
 * - 경로의 두 엣지를 교환하여 개선
 * - 지역 최적화
 */
function twoOptImprovement(
  route: number[],
  distanceMatrix: number[][],
  maxIterations: number = 100
): number[] {
  let improved = true;
  let iterations = 0;
  let bestRoute = [...route];

  while (improved && iterations < maxIterations) {
    improved = false;
    iterations++;

    for (let i = 1; i < bestRoute.length - 1; i++) {
      for (let j = i + 1; j < bestRoute.length; j++) {
        const currentDist =
          distanceMatrix[bestRoute[i - 1]][bestRoute[i]] +
          distanceMatrix[bestRoute[j]][bestRoute[j === bestRoute.length - 1 ? 0 : j + 1]];

        const newDist =
          distanceMatrix[bestRoute[i - 1]][bestRoute[j]] +
          distanceMatrix[bestRoute[i]][bestRoute[j === bestRoute.length - 1 ? 0 : j + 1]];

        if (newDist < currentDist) {
          // 경로 개선
          const newRoute = [
            ...bestRoute.slice(0, i),
            ...bestRoute.slice(i, j + 1).reverse(),
            ...bestRoute.slice(j + 1)
          ];
          bestRoute = newRoute;
          improved = true;
        }
      }
    }
  }

  return bestRoute;
}

/**
 * 우선순위 기반 경로 조정
 * - 긴급(high priority) 작업을 앞쪽에 배치
 * - 거리보다 위험도를 우선
 */
function priorityAdjustment(
  route: number[],
  tasks: MaintenanceTask[]
): number[] {
  const adjustedRoute = [...route];

  // high priority 작업들을 찾아서 앞으로 이동
  const highPriorityIndices: number[] = [];

  adjustedRoute.forEach((taskIndex, routeIndex) => {
    if (tasks[taskIndex].priority === 'high') {
      highPriorityIndices.push(routeIndex);
    }
  });

  // 긴급 작업들을 앞쪽 30% 구간에 배치
  highPriorityIndices.forEach((routeIndex, i) => {
    const targetPosition = Math.min(i + 1, Math.floor(adjustedRoute.length * 0.3));

    if (routeIndex > targetPosition) {
      const [task] = adjustedRoute.splice(routeIndex, 1);
      adjustedRoute.splice(targetPosition, 0, task);
    }
  });

  return adjustedRoute;
}

/**
 * 총 거리 계산
 */
function calculateTotalDistance(route: number[], distanceMatrix: number[][]): number {
  let total = 0;

  for (let i = 0; i < route.length - 1; i++) {
    total += distanceMatrix[route[i]][route[i + 1]];
  }

  return total;
}

/**
 * 작업 시간 계산
 * - 이동 시간 + 작업 시간
 */
function calculateTotalTime(
  route: number[],
  tasks: MaintenanceTask[],
  distanceMatrix: number[][]
): number {
  let totalTime = 0;
  const avgSpeed = 20; // 평균 속도 20km/h (도심 주행)

  // 이동 시간
  for (let i = 0; i < route.length - 1; i++) {
    const distance = distanceMatrix[route[i]][route[i + 1]];
    const travelTime = (distance / avgSpeed) * 60; // 분
    totalTime += travelTime;
  }

  // 작업 시간
  route.forEach(taskIndex => {
    totalTime += tasks[taskIndex].estimatedTime;
  });

  return totalTime;
}

/**
 * 경로 최적화 메인 함수
 */
export function optimizeRoute(
  tasks: MaintenanceTask[],
  sensorData: SensorData[]
): OptimizedRoute {
  if (tasks.length === 0) {
    return {
      tasks: [],
      totalDistance: 0,
      totalTime: 0,
      savings: {
        distanceReduction: 0,
        timeReduction: 0,
        fuelSavings: '0원'
      },
      path: []
    };
  }

  // 1. 거리 행렬 생성
  const distanceMatrix = createDistanceMatrix(tasks, sensorData);

  // 2. 초기 경로 생성 (Nearest Neighbor)
  let optimizedRoute = nearestNeighborTSP(distanceMatrix);

  // 3. 2-opt 개선
  optimizedRoute = twoOptImprovement(optimizedRoute, distanceMatrix);

  // 4. 우선순위 조정
  optimizedRoute = priorityAdjustment(optimizedRoute, tasks);

  // 5. 최적화 전 거리 (순서대로 방문)
  const originalRoute = tasks.map((_, i) => i);
  const originalDistance = calculateTotalDistance(originalRoute, distanceMatrix);
  const originalTime = calculateTotalTime(originalRoute, tasks, distanceMatrix);

  // 6. 최적화 후 거리/시간
  const optimizedDistance = calculateTotalDistance(optimizedRoute, distanceMatrix);
  const optimizedTime = calculateTotalTime(optimizedRoute, tasks, distanceMatrix);

  // 7. 절감 효과 계산
  const distanceReduction = ((originalDistance - optimizedDistance) / originalDistance) * 100;
  const timeReduction = originalTime - optimizedTime;

  // 연료비 절감 (리터당 1,700원, 연비 10km/L 가정)
  const fuelPrice = 1700;
  const fuelEfficiency = 10;
  const fuelSavingsAmount = ((originalDistance - optimizedDistance) / fuelEfficiency) * fuelPrice;

  // 8. 경로 세부 정보 생성
  const startTime = new Date();
  startTime.setHours(9, 0, 0, 0); // 오전 9시 시작
  let currentTime = new Date(startTime);

  const path = optimizedRoute.map((taskIndex, order) => {
    const task = tasks[taskIndex];
    const sensor = sensorData.find(s => s.deviceId === task.deviceId);

    let distanceFromPrevious = 0;
    if (order > 0) {
      const prevTaskIndex = optimizedRoute[order - 1];
      distanceFromPrevious = distanceMatrix[prevTaskIndex][taskIndex];

      // 이동 시간 추가
      const travelTime = (distanceFromPrevious / 20) * 60; // 분
      currentTime = new Date(currentTime.getTime() + travelTime * 60000);
    }

    const arrivalTime = currentTime.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    // 작업 시간 추가
    currentTime = new Date(currentTime.getTime() + task.estimatedTime * 60000);

    return {
      order: order + 1,
      taskId: task.id,
      deviceId: task.deviceId,
      location: sensor?.location.name || '위치 정보 없음',
      coordinates: sensor ? { lat: sensor.location.lat, lng: sensor.location.lng } : { lat: 0, lng: 0 },
      arrivalTime,
      duration: task.estimatedTime,
      distanceFromPrevious: Math.round(distanceFromPrevious * 10) / 10
    };
  });

  // 9. 최적화된 작업 목록 (순서 업데이트)
  const optimizedTasks = optimizedRoute.map((taskIndex, order) => ({
    ...tasks[taskIndex],
    route: {
      ...tasks[taskIndex].route,
      order: order + 1
    }
  }));

  return {
    tasks: optimizedTasks,
    totalDistance: Math.round(optimizedDistance * 10) / 10,
    totalTime: Math.round(optimizedTime),
    savings: {
      distanceReduction: Math.round(distanceReduction * 10) / 10,
      timeReduction: Math.round(timeReduction),
      fuelSavings: `${Math.round(fuelSavingsAmount / 1000)}천원`
    },
    path
  };
}

/**
 * 팀별 경로 최적화
 */
export function optimizeTeamRoutes(
  allTasks: MaintenanceTask[],
  sensorData: SensorData[]
): Map<string, OptimizedRoute> {
  const teamRoutes = new Map<string, OptimizedRoute>();

  // 팀별로 그룹화
  const teamTasks = allTasks.reduce((acc, task) => {
    if (!acc[task.assignedTeam]) {
      acc[task.assignedTeam] = [];
    }
    acc[task.assignedTeam].push(task);
    return acc;
  }, {} as Record<string, MaintenanceTask[]>);

  // 각 팀별로 경로 최적화
  Object.entries(teamTasks).forEach(([team, tasks]) => {
    const optimized = optimizeRoute(tasks, sensorData);
    teamRoutes.set(team, optimized);
  });

  return teamRoutes;
}
