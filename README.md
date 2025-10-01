# 🌊 Infra-Flow AI

> **2025년 대한민국 물산업 혁신 창업대전 출품작**
>
> AI 기반 빗물받이 실시간 모니터링 및 예측 시스템

빗물받이 막힘으로 인한 도심 침수를 예방하고, AI 분석을 통해 효율적인 유지보수를 지원하는 차세대 인프라 관리 시스템입니다.

## Features

- 🌊 **Real-time Infrastructure Monitoring**: Track water levels, debris, and flow rates across storm drains
- 🤖 **AI-Powered Risk Analysis**: Predictive analysis using Anthropic Claude for maintenance optimization
- 🗺️ **Interactive Map Visualization**: Kakao Maps integration for location-based monitoring
- ⚡ **Real-time Alerts**: Automated alert system for critical infrastructure conditions
- 📊 **Predictive Analytics**: Weather integration for proactive maintenance planning
- 🔧 **Task Management**: Optimized maintenance scheduling and route planning

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **AI Integration**: Anthropic Claude SDK
- **Maps**: Kakao Maps API
- **Charts**: Recharts
- **Icons**: Lucide React
- **Build Tool**: Turbopack

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- API keys for required services

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yonghwan1106/infra-flow-ai.git
   cd infra-flow-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   ```

   Fill in your API keys (자세한 내용은 [SETUP.md](./SETUP.md) 참고):
   - `ANTHROPIC_API_KEY`: Claude AI API key ([발급 방법](./SETUP.md#1-claude-ai-api-anthropic))
   - `NEXT_PUBLIC_KAKAO_MAP_API_KEY`: Kakao Maps API key ([발급 방법](./SETUP.md#2-카카오맵-api))
   - `WEATHER_API_KEY`: 기상청 API key (선택) ([발급 방법](./SETUP.md#3-기상청-api-선택))

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard:
   - `ANTHROPIC_API_KEY`
   - `NEXT_PUBLIC_KAKAO_MAP_API_KEY`
   - `WEATHER_API_KEY`
   - `NEXT_PUBLIC_APP_URL` (your Vercel domain)
3. Deploy automatically on push to main branch

### Manual Build

```bash
npm run build
npm start
```

## API Keys Setup

### Anthropic API Key
1. Sign up at [console.anthropic.com](https://console.anthropic.com)
2. Create an API key
3. Add to environment variables as `ANTHROPIC_API_KEY`

### Kakao Maps API Key
1. Register at [developers.kakao.com](https://developers.kakao.com)
2. Create an app and get JavaScript key
3. Add to environment variables as `NEXT_PUBLIC_KAKAO_MAP_API_KEY`

### Weather API Key
1. Sign up at [OpenWeatherMap](https://openweathermap.org/api) or similar service
2. Get API key
3. Add to environment variables as `WEATHER_API_KEY`

## Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API routes
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Main dashboard
├── components/         # React components
│   ├── dashboard/      # Dashboard views
│   ├── layout/         # Layout components
│   └── map/           # Map components
├── hooks/             # Custom React hooks
├── lib/               # Utility functions
└── types/             # TypeScript definitions
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org)
- AI powered by [Anthropic Claude](https://anthropic.com)
- Maps by [Kakao Maps](https://apis.map.kakao.com)
- Icons by [Lucide](https://lucide.dev)