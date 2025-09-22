'use client';

import {
  Info,
  Target,
  Lightbulb,
  Cpu,
  Award,
  Users,
  TrendingUp,
  Shield,
  Zap,
  Brain,
  Eye,
  Cloud,
  Activity,
  CheckCircle,
  ArrowRight,
  Globe
} from 'lucide-react';

export default function AboutView() {
  const features = [
    {
      icon: Eye,
      title: 'AI 비전 분석',
      description: '딥러닝 기반 쓰레기, 낙엽 등 막힘 원인 직접 탐지 및 정량화'
    },
    {
      icon: Brain,
      title: '예측 분석',
      description: '기상 데이터와 융합하여 막힘 위험도를 사전 예측'
    },
    {
      icon: Activity,
      title: '실시간 모니터링',
      description: '1,247개 센서의 실시간 데이터 수집 및 분석'
    },
    {
      icon: Cloud,
      title: '클라우드 기반',
      description: '확장 가능한 클라우드 인프라와 빅데이터 처리'
    }
  ];

  const advantages = [
    {
      title: '패러다임 전환',
      description: '사후 대응 → 예측 기반 선제적 관리',
      color: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    },
    {
      title: '하이브리드 센서',
      description: '비용 효율적인 차별화된 센서 배치 전략',
      color: 'bg-green-500/20 text-green-400 border-green-500/30'
    },
    {
      title: '기술적 해자',
      description: 'AI 모델의 지속적 학습을 통한 정확도 향상',
      color: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    },
    {
      title: '네트워크 효과',
      description: '설치 지역 확대에 따른 성능 향상',
      color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    }
  ];

  const timeline = [
    {
      phase: '1단계',
      title: 'MVP 개발 및 검증',
      period: '12개월',
      tasks: ['파일럿 지역 50-100개 빗물받이', '프로토타입 개발 및 현장 테스트', '기술적/경제적 효과 검증']
    },
    {
      phase: '2단계',
      title: '사업 확장',
      period: '24-36개월',
      tasks: ['파일럿 지자체 전역 확대', '다른 지자체로 솔루션 확산', '수익 모델 최적화']
    },
    {
      phase: '3단계',
      title: '고도화 및 확장',
      period: '48개월+',
      tasks: ['AI 모델 고도화', '연관 분야 서비스 확장', '해외 진출 검토']
    }
  ];

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white flex items-center justify-center">
          <Info className="h-10 w-10 mr-4 text-blue-400" />
          Infra-Flow AI
        </h1>
        <p className="text-xl text-slate-300">
          도시 침수 방지를 위한 AI 기반 예측적 빗물받이 관리 시스템
        </p>
        <div className="flex items-center justify-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-blue-400" />
            <span className="text-slate-300">크리에이티브 넥서스</span>
          </div>
          <div className="flex items-center space-x-2">
            <Award className="h-4 w-4 text-yellow-400" />
            <span className="text-slate-300">2025년 대한민국 물산업 혁신 창업대전</span>
          </div>
        </div>
      </div>

      {/* 핵심 컨셉 */}
      <div className="control-panel rounded-lg p-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Target className="h-6 w-6 mr-3 text-blue-400" />
          핵심 컨셉
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">현재의 문제점</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                <p className="text-slate-300">주기적 청소와 민원 기반 사후 대응</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                <p className="text-slate-300">예측 불가능한 국지성 폭우에 비효율적</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                <p className="text-slate-300">한정된 예산과 인력의 비효율적 배치</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Infra-Flow AI 솔루션</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                <p className="text-slate-300">AI 기반 실시간 위험도 예측</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                <p className="text-slate-300">기상 데이터 융합 선제적 대응</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                <p className="text-slate-300">자원 최적화 및 효율성 30% 향상</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 핵심 기능 */}
      <div className="control-panel rounded-lg p-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Zap className="h-6 w-6 mr-3 text-blue-400" />
          핵심 기능
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-slate-800 rounded-lg p-6 text-center">
                <Icon className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3단계 프로세스 */}
      <div className="control-panel rounded-lg p-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Activity className="h-6 w-6 mr-3 text-blue-400" />
          시스템 프로세스
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-3">1</div>
              <h3 className="text-white font-semibold">실시간 데이터 수집</h3>
            </div>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>• 수위 센서: 배수 이상 징후 감지</li>
              <li>• AI 비전 센서: 막힘 원인 직접 탐지</li>
              <li>• IoT 통신: 실시간 데이터 전송</li>
            </ul>
          </div>

          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold mr-3">2</div>
              <h3 className="text-white font-semibold">지능형 데이터 분석</h3>
            </div>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>• 기상청 강우 예보 데이터 연동</li>
              <li>• GIS 데이터 융합 분석</li>
              <li>• 머신러닝 위험도 예측</li>
            </ul>
          </div>

          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-3">3</div>
              <h3 className="text-white font-semibold">선제적 대응</h3>
            </div>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>• 고위험 빗물받이 우선순위 생성</li>
              <li>• 최적 청소 경로 제안</li>
              <li>• 실시간 관제 및 모바일 앱</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 혁신성과 차별화 */}
      <div className="control-panel rounded-lg p-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Lightbulb className="h-6 w-6 mr-3 text-blue-400" />
          혁신성과 차별화
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {advantages.map((advantage, index) => (
            <div key={index} className={`border rounded-lg p-6 ${advantage.color}`}>
              <h3 className="font-semibold mb-2">{advantage.title}</h3>
              <p className="text-sm opacity-90">{advantage.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 기술 수준 */}
      <div className="control-panel rounded-lg p-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Cpu className="h-6 w-6 mr-3 text-blue-400" />
          기술 수준 (TRL)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">8</div>
            <h3 className="text-white font-semibold mb-2">IoT 센서</h3>
            <p className="text-slate-400 text-sm">상용화된 기술</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">7</div>
            <h3 className="text-white font-semibold mb-2">AI 비전</h3>
            <p className="text-slate-400 text-sm">검증된 기술</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">9</div>
            <h3 className="text-white font-semibold mb-2">클라우드</h3>
            <p className="text-slate-400 text-sm">완성된 기술</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">6</div>
            <h3 className="text-white font-semibold mb-2">ML 예측</h3>
            <p className="text-slate-400 text-sm">개발 중</p>
          </div>
        </div>
      </div>

      {/* 단계별 실현 계획 */}
      <div className="control-panel rounded-lg p-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <TrendingUp className="h-6 w-6 mr-3 text-blue-400" />
          단계별 실현 계획
        </h2>
        <div className="space-y-6">
          {timeline.map((phase, index) => (
            <div key={index} className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-2">
                  <h3 className="text-white font-semibold text-lg">{phase.phase}: {phase.title}</h3>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">{phase.period}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {phase.tasks.map((task, taskIndex) => (
                    <div key={taskIndex} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                      <span className="text-slate-300 text-sm">{task}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 예상 성과 */}
      <div className="control-panel rounded-lg p-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Award className="h-6 w-6 mr-3 text-blue-400" />
          예상 성과
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">90%</div>
            <h3 className="text-white font-semibold mb-2">기술적 성과</h3>
            <p className="text-slate-400 text-sm">빗물받이 막힘 예측 정확도</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">30%</div>
            <h3 className="text-white font-semibold mb-2">경제적 성과</h3>
            <p className="text-slate-400 text-sm">유지보수 비용 절감</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">50%</div>
            <h3 className="text-white font-semibold mb-2">사회적 성과</h3>
            <p className="text-slate-400 text-sm">침수 피해 감소</p>
          </div>
        </div>
      </div>

      {/* 결론 */}
      <div className="control-panel rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center justify-center">
          <Shield className="h-6 w-6 mr-3 text-blue-400" />
          비전
        </h2>
        <p className="text-lg text-slate-300 mb-6">
          도시의 혈관과 같은 빗물받이에 지능을 부여하여<br />
          시민의 안전을 지키는 <strong className="text-blue-400">"도시 인프라의 디지털 주치의"</strong>
        </p>
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-2 text-slate-400">
            <Globe className="h-4 w-4" />
            <span className="text-sm">전국 지자체 확산</span>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-500" />
          <div className="flex items-center space-x-2 text-slate-400">
            <Shield className="h-4 w-4" />
            <span className="text-sm">국가적 재난 대응 역량 강화</span>
          </div>
        </div>
      </div>
    </div>
  );
}