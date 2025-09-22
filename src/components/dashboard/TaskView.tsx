'use client';

import { useState } from 'react';
import { MaintenanceTask, SensorData } from '@/types';
import {
  Users,
  ClipboardList,
  Navigation,
  Clock,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Camera,
  Play,
  Pause,
  RotateCcw,
  Route
} from 'lucide-react';

interface TaskViewProps {
  tasks: MaintenanceTask[];
  sensorData: SensorData[];
}

export default function TaskView({ tasks, sensorData }: TaskViewProps) {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<MaintenanceTask | null>(null);
  const [isMobileView, setIsMobileView] = useState(false);

  // 팀별 작업 그룹화
  const teamTasks = tasks.reduce((acc, task) => {
    if (!acc[task.assignedTeam]) {
      acc[task.assignedTeam] = [];
    }
    acc[task.assignedTeam].push(task);
    return acc;
  }, {} as Record<string, MaintenanceTask[]>);

  const teams = Object.keys(teamTasks);

  // 작업 상태별 카운트
  const getTaskStats = (teamTasks: MaintenanceTask[]) => {
    return {
      total: teamTasks.length,
      pending: teamTasks.filter(t => t.status === 'pending').length,
      inProgress: teamTasks.filter(t => t.status === 'in_progress').length,
      completed: teamTasks.filter(t => t.status === 'completed').length,
    };
  };

  // 우선순위별 색상
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400';
      case 'in_progress': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return '완료';
      case 'in_progress': return '진행중';
      default: return '대기';
    }
  };

  // 센서 정보 찾기
  const getSensorInfo = (deviceId: string) => {
    return sensorData.find(sensor => sensor.deviceId === deviceId);
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white flex items-center">
          <Users className="h-8 w-8 mr-3 text-blue-400" />
          작업 관리 시스템
        </h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsMobileView(!isMobileView)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              isMobileView
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            📱 모바일 뷰
          </button>
          <div className="text-sm text-slate-400">
            총 {tasks.length}개 작업
          </div>
        </div>
      </div>

      {/* 전체 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="control-panel rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">전체 작업</p>
              <p className="text-2xl font-bold text-white">{tasks.length}</p>
            </div>
            <ClipboardList className="h-6 w-6 text-blue-400" />
          </div>
        </div>

        <div className="control-panel rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">대기 중</p>
              <p className="text-2xl font-bold text-slate-400">
                {tasks.filter(t => t.status === 'pending').length}
              </p>
            </div>
            <Clock className="h-6 w-6 text-slate-400" />
          </div>
        </div>

        <div className="control-panel rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">진행 중</p>
              <p className="text-2xl font-bold text-blue-400">
                {tasks.filter(t => t.status === 'in_progress').length}
              </p>
            </div>
            <Play className="h-6 w-6 text-blue-400" />
          </div>
        </div>

        <div className="control-panel rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">완료</p>
              <p className="text-2xl font-bold text-green-400">
                {tasks.filter(t => t.status === 'completed').length}
              </p>
            </div>
            <CheckCircle className="h-6 w-6 text-green-400" />
          </div>
        </div>
      </div>

      {isMobileView ? (
        /* 모바일 뷰 (작업자용) */
        <div className="max-w-md mx-auto">
          <div className="control-panel rounded-lg p-1 bg-slate-800">
            {/* 모바일 헤더 */}
            <div className="bg-slate-900 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">청소팀 전용</h3>
                  <p className="text-sm text-slate-400">김청소 (3팀)</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">오늘의 작업</p>
                  <p className="text-lg font-bold text-white">5건</p>
                </div>
              </div>
            </div>

            {/* 오늘의 작업 목록 */}
            <div className="space-y-3 p-4">
              <h4 className="text-white font-semibold mb-3 flex items-center">
                <ClipboardList className="h-4 w-4 mr-2" />
                오늘의 작업 목록
              </h4>

              {teamTasks['청소팀 3']?.slice(0, 5).map((task, index) => {
                const sensor = getSensorInfo(task.deviceId);
                return (
                  <div key={task.id} className="bg-slate-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(task.status)}`}>
                        {getStatusText(task.status)}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                        {task.priority === 'high' ? '긴급' : task.priority === 'medium' ? '보통' : '낮음'}
                      </span>
                    </div>

                    <div className="flex items-center mb-2">
                      <MapPin className="h-4 w-4 text-slate-400 mr-2" />
                      <span className="text-white font-medium">{sensor?.location.name || '위치 정보 없음'}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-slate-400 mb-3">
                      <span>예상 소요시간: {task.estimatedTime}분</span>
                      <span>순서: {task.route.order}번째</span>
                    </div>

                    {sensor && (
                      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                        <div>
                          <span className="text-slate-400">수위: </span>
                          <span className="text-white">{sensor.measurements.waterLevel}%</span>
                        </div>
                        <div>
                          <span className="text-slate-400">쓰레기: </span>
                          <span className="text-white">{sensor.measurements.debrisLevel}%</span>
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      {task.status === 'pending' && (
                        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium flex items-center justify-center">
                          <Play className="h-3 w-3 mr-1" />
                          작업 시작
                        </button>
                      )}
                      {task.status === 'in_progress' && (
                        <>
                          <button className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded text-sm font-medium flex items-center justify-center">
                            <Pause className="h-3 w-3 mr-1" />
                            일시정지
                          </button>
                          <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm font-medium flex items-center justify-center">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            완료
                          </button>
                        </>
                      )}
                      {task.status === 'completed' && (
                        <button className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm font-medium flex items-center justify-center">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          완료됨
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 최적 경로 안내 */}
            <div className="p-4 border-t border-slate-700">
              <h4 className="text-white font-semibold mb-3 flex items-center">
                <Route className="h-4 w-4 mr-2" />
                최적 경로 안내
              </h4>
              <div className="bg-slate-700 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300">예상 소요시간</span>
                  <span className="text-white font-semibold">2시간 15분</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300">총 이동거리</span>
                  <span className="text-white font-semibold">8.3km</span>
                </div>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium flex items-center justify-center mt-3">
                  <Navigation className="h-3 w-3 mr-1" />
                  길안내 시작
                </button>
              </div>
            </div>

            {/* 작업 완료 인증 */}
            <div className="p-4 border-t border-slate-700">
              <h4 className="text-white font-semibold mb-3 flex items-center">
                <Camera className="h-4 w-4 mr-2" />
                작업 완료 인증
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <button className="bg-slate-600 hover:bg-slate-500 text-white px-3 py-2 rounded text-sm font-medium flex items-center justify-center">
                  <Camera className="h-3 w-3 mr-1" />
                  사진 촬영
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm font-medium flex items-center justify-center">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  완료 처리
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 데스크톱 뷰 (관리자용) */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 팀 목록 */}
          <div className="control-panel rounded-lg p-6">
            <h3 className="text-white font-semibold mb-4">작업팀 현황</h3>
            <div className="space-y-3">
              {teams.map((team) => {
                const stats = getTaskStats(teamTasks[team]);
                return (
                  <button
                    key={team}
                    onClick={() => setSelectedTeam(team)}
                    className={`w-full text-left p-4 rounded-lg transition-colors ${
                      selectedTeam === team
                        ? 'bg-blue-600/30 border border-blue-500'
                        : 'bg-slate-800 hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-white font-medium">{team}</h4>
                      <span className="text-sm text-slate-400">{stats.total}건</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <p className="text-slate-400">대기</p>
                        <p className="text-slate-300 font-semibold">{stats.pending}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-slate-400">진행</p>
                        <p className="text-blue-400 font-semibold">{stats.inProgress}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-slate-400">완료</p>
                        <p className="text-green-400 font-semibold">{stats.completed}</p>
                      </div>
                    </div>
                    <div className="mt-2 bg-slate-700 rounded-full h-1">
                      <div
                        className="bg-green-500 h-1 rounded-full"
                        style={{ width: `${(stats.completed / stats.total) * 100}%` }}
                      ></div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 선택된 팀의 작업 목록 */}
          <div className="lg:col-span-2 control-panel rounded-lg p-6">
            {selectedTeam ? (
              <div>
                <h3 className="text-white font-semibold mb-4">{selectedTeam} 작업 목록</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {teamTasks[selectedTeam]?.map((task) => {
                    const sensor = getSensorInfo(task.deviceId);
                    return (
                      <div
                        key={task.id}
                        className="bg-slate-800 rounded-lg p-4 hover:bg-slate-700 transition-colors cursor-pointer"
                        onClick={() => setSelectedTask(task)}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="text-white font-medium">{sensor?.location.name || '위치 정보 없음'}</h4>
                            <p className="text-sm text-slate-400">{task.deviceId}</p>
                          </div>
                          <div className="flex space-x-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(task.status)}`}>
                              {getStatusText(task.status)}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                              {task.priority === 'high' ? '긴급' : task.priority === 'medium' ? '보통' : '낮음'}
                            </span>
                          </div>
                        </div>

                        {sensor && (
                          <div className="grid grid-cols-4 gap-2 text-sm mb-2">
                            <div>
                              <span className="text-slate-400">수위: </span>
                              <span className="text-white">{sensor.measurements.waterLevel}%</span>
                            </div>
                            <div>
                              <span className="text-slate-400">쓰레기: </span>
                              <span className="text-white">{sensor.measurements.debrisLevel}%</span>
                            </div>
                            <div>
                              <span className="text-slate-400">위험도: </span>
                              <span className={`font-semibold ${
                                sensor.riskAnalysis.currentRisk >= 80 ? 'text-red-400' :
                                sensor.riskAnalysis.currentRisk >= 60 ? 'text-yellow-400' :
                                'text-green-400'
                              }`}>
                                {sensor.riskAnalysis.currentRisk}%
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-400">예상: </span>
                              <span className="text-white">{task.estimatedTime}분</span>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-between items-center text-xs text-slate-400">
                          <span>순서: {task.route.order}번째</span>
                          <span>등록: {task.createdAt.toLocaleDateString('ko-KR')}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-400">작업팀을 선택해주세요</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}