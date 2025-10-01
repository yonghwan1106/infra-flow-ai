# 🚀 Infra-Flow AI 설치 및 설정 가이드

> **2025년 대한민국 물산업 혁신 창업대전** 출품작
>
> Next.js 15 + React 19 + Claude AI 기반 빗물받이 모니터링 시스템

---

## 📋 목차

1. [시스템 요구사항](#시스템-요구사항)
2. [설치 방법](#설치-방법)
3. [API 키 발급](#api-키-발급)
4. [환경 설정](#환경-설정)
5. [실행 방법](#실행-방법)
6. [문제 해결](#문제-해결)

---

## 💻 시스템 요구사항

### 필수 요구사항

- **Node.js**: 18.17 이상 (권장: 20.x LTS)
- **npm**: 9.0 이상 또는 **yarn**: 1.22 이상
- **운영체제**: Windows 10/11, macOS 10.15+, Linux (Ubuntu 20.04+)
- **메모리**: 최소 4GB RAM (권장: 8GB 이상)
- **디스크**: 최소 500MB 여유 공간

### 선택 요구사항

- **Git**: 버전 관리를 위한 Git 2.0 이상
- **VS Code**: 개발 환경 (권장)

---

## 📦 설치 방법

### 1. 저장소 클론

```bash
# HTTPS
git clone https://github.com/your-username/infra-flow-ai.git

# SSH
git clone git@github.com:your-username/infra-flow-ai.git

cd infra-flow-ai
```

### 2. 의존성 설치

```bash
# npm 사용
npm install

# yarn 사용
yarn install
```

**설치 시간**: 약 2-5분 소요 (인터넷 속도에 따라 다름)

---

## 🔑 API 키 발급

이 프로젝트는 3개의 외부 API를 사용합니다. 각 API 키를 발급받아야 합니다.

### 1. Claude AI API (Anthropic)

**필수** - AI 분석 기능에 사용됩니다.

#### 발급 방법:

1. [Anthropic Console](https://console.anthropic.com/) 접속
2. 계정 생성 또는 로그인
3. **API Keys** 메뉴로 이동
4. **Create Key** 버튼 클릭
5. 키 이름 입력 (예: "infra-flow-ai-dev")
6. **Create** 버튼 클릭
7. 생성된 API 키 복사 (⚠️ 한 번만 표시됨!)

#### 요금 정보:

- **무료 크레딧**: 신규 가입 시 $5 크레딧 제공
- **Claude 3.5 Sonnet**: 입력 $3/1M 토큰, 출력 $15/1M 토큰
- 예상 비용: 하루 테스트 시 약 $0.10-0.50

**⚠️ 주의사항**:
- API 키는 절대 공개하지 마세요!
- `.env.local` 파일은 절대 git에 커밋하지 마세요!

---

### 2. 카카오맵 API

**필수** - 지도 시각화에 사용됩니다.

#### 발급 방법:

1. [Kakao Developers](https://developers.kakao.com/) 접속
2. 카카오 계정으로 로그인
3. **내 애플리케이션** 메뉴로 이동
4. **애플리케이션 추가하기** 클릭
5. 앱 정보 입력:
   - 앱 이름: "Infra-Flow AI"
   - 사업자명: 본인 이름 또는 팀명
6. **저장** 클릭
7. 생성된 앱 클릭 → **JavaScript 키** 복사

#### 플랫폼 등록:

1. **플랫폼** 탭 클릭
2. **Web 플랫폼 등록** 클릭
3. 사이트 도메인 등록:
   - 개발 환경: `http://localhost:3000`
   - 프로덕션: `https://your-domain.com`

#### 요금 정보:

- **무료**: 일 300,000건까지 무료
- 개발/테스트 목적으로 충분함

---

### 3. 기상청 API (선택)

**선택** - 실제 기상 데이터에 사용됩니다. 없어도 시뮬레이션 데이터로 동작합니다.

#### 발급 방법:

1. [공공데이터포털](https://www.data.go.kr/) 접속
2. 회원가입 또는 로그인
3. 검색창에 **"기상청 단기예보"** 검색
4. **기상청_단기예보 ((구)_동네예보) 조회서비스** 클릭
5. **활용신청** 버튼 클릭
6. 신청 양식 작성:
   - 활용 목적: "빗물받이 모니터링 시스템 개발"
   - 상세 기능: "강수량 예측 및 위험도 분석"
7. 신청 후 **승인 대기** (보통 1-2일 소요)
8. 승인 후 **마이페이지** → **인증키(일반)** 복사

#### 요금 정보:

- **무료**: 제한 없이 무료 사용

---

## ⚙️ 환경 설정

### 1. 환경 변수 파일 생성

프로젝트 루트 디렉토리에 `.env.local` 파일을 생성합니다.

```bash
# Windows
copy .env.local.example .env.local

# macOS/Linux
cp .env.local.example .env.local
```

### 2. API 키 설정

`.env.local` 파일을 편집기로 열고, 발급받은 API 키를 입력합니다.

```env
# Claude AI API Key
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Kakao Map API Key
NEXT_PUBLIC_KAKAO_MAP_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Weather API Key (선택)
WEATHER_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Environment
NODE_ENV=development
```

**⚠️ 보안 중요 사항**:

- `ANTHROPIC_API_KEY`: 절대 공개 저장소에 커밋하지 마세요!
- `NEXT_PUBLIC_` 접두사가 붙은 키는 클라이언트에 노출됩니다.
- `.env.local` 파일은 `.gitignore`에 포함되어 있습니다.

### 3. 설정 확인

환경 변수가 제대로 설정되었는지 확인:

```bash
# Windows PowerShell
Get-Content .env.local

# macOS/Linux
cat .env.local
```

---

## 🏃 실행 방법

### 개발 서버 실행

```bash
# npm 사용
npm run dev

# yarn 사용
yarn dev
```

**실행 결과**:
```
▲ Next.js 15.5.3 (Turbopack)
- Local:        http://localhost:3000
- Network:      http://172.30.1.11:3000

✓ Ready in 2.2s
```

브라우저에서 `http://localhost:3000` 접속

### 프로덕션 빌드

```bash
# 1. 빌드
npm run build

# 2. 프로덕션 서버 실행
npm start
```

### Lint 실행

```bash
npm run lint
```

---

## 🎨 주요 기능 테스트

### 1. 대시보드
- URL: `http://localhost:3000`
- 1,247개 센서 실시간 모니터링
- 시간대별 패턴 (출퇴근 시간 수위 증가)

### 2. 지도 뷰
- 사이드바에서 **실시간 지도** 클릭
- 센서 위치 확인 (강남구)
- 센서 클릭 시 상세 정보 표시

### 3. 실시간 뷰
- 사이드바에서 **실시간 모니터링** 클릭
- 3초마다 자동 업데이트
- 실시간 알림 및 위험 센서 목록

### 4. AI 예측
- 사이드바에서 **AI 예측** 클릭
- 센서 선택 → Claude AI 분석 실행
- 6시간 후 위험도 예측 확인

### 5. 작업 관리
- 사이드바에서 **작업 관리** 클릭
- 팀 선택 → **최적화 보기** 클릭
- TSP 알고리즘 기반 경로 최적화 확인

---

## 🐛 문제 해결

### Q1: `npm install` 시 오류 발생

**문제**: 의존성 설치 중 오류

**해결 방법**:
```bash
# 캐시 삭제
npm cache clean --force

# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

---

### Q2: 포트 3000이 이미 사용 중

**문제**: `Port 3000 is already in use`

**해결 방법**:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID번호> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9

# 또는 다른 포트 사용
PORT=3001 npm run dev
```

---

### Q3: Kakao Map이 표시되지 않음

**문제**: 지도가 빈 화면으로 표시됨

**해결 방법**:

1. API 키 확인:
   ```bash
   echo $NEXT_PUBLIC_KAKAO_MAP_API_KEY
   ```

2. 브라우저 콘솔 확인 (F12):
   - Kakao Maps API 로드 오류 확인
   - CORS 오류 확인

3. 플랫폼 등록 확인:
   - Kakao Developers → 내 애플리케이션
   - Web 플랫폼에 `http://localhost:3000` 등록 여부 확인

---

### Q4: Claude AI 분석이 동작하지 않음

**문제**: "AI 분석 서비스 오류" 메시지 표시

**해결 방법**:

1. API 키 확인:
   ```bash
   # .env.local 파일 확인
   cat .env.local | grep ANTHROPIC
   ```

2. API 키 유효성 테스트:
   ```bash
   curl https://api.anthropic.com/v1/messages \
     -H "x-api-key: $ANTHROPIC_API_KEY" \
     -H "anthropic-version: 2023-06-01" \
     -H "content-type: application/json" \
     -d '{"model":"claude-3-5-sonnet-20241022","max_tokens":10,"messages":[{"role":"user","content":"Hi"}]}'
   ```

3. 크레딧 잔액 확인:
   - [Anthropic Console](https://console.anthropic.com/) → Billing

4. Fallback 모드:
   - API 실패 시 로컬 알고리즘으로 자동 전환됩니다.
   - "로컬 알고리즘으로 분석했습니다" 메시지 확인

---

### Q5: 기상 데이터가 더미 데이터로 표시됨

**문제**: "Fallback Data (API Error)" 표시

**해결 방법**:

1. 기상청 API 키 확인
2. 승인 상태 확인 (공공데이터포털)
3. **선택 사항이므로 더미 데이터로도 정상 작동합니다**

---

### Q6: Turbopack 경고 메시지

**문제**: `experimental.turbo is deprecated`

**해결 방법**:

이 경고는 무시해도 됩니다. Next.js 15에서 자동으로 Turbopack을 사용합니다.

억제하려면 `next.config.js` 수정:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // experimental.turbo 제거
};
```

---

## 📧 지원

### 문의사항

- **이메일**: your-email@example.com
- **GitHub Issues**: https://github.com/your-username/infra-flow-ai/issues

### 추가 자료

- [Next.js 문서](https://nextjs.org/docs)
- [Claude AI API 문서](https://docs.anthropic.com/claude/reference/getting-started-with-the-api)
- [Kakao Maps API 문서](https://apis.map.kakao.com/web/)
- [기상청 API 가이드](https://www.data.go.kr/data/15084084/openapi.do)

---

## 🎯 다음 단계

설치가 완료되었다면:

1. ✅ 대시보드 확인 (`http://localhost:3000`)
2. ✅ 지도 뷰에서 센서 위치 확인
3. ✅ 실시간 뷰에서 자동 업데이트 확인
4. ✅ AI 예측 기능 테스트
5. ✅ 작업 관리에서 경로 최적화 확인

**대회 준비를 위한 추가 작업**:

- 프레젠테이션 자료 준비
- 데모 시나리오 작성
- 스크린샷 및 동영상 촬영
- README 업데이트

---

**작성일**: 2025-10-01
**버전**: 1.0.0
**라이선스**: MIT
