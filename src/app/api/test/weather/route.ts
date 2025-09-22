import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const serviceKey = process.env.WEATHER_API_KEY;

    if (!serviceKey) {
      return NextResponse.json({
        success: false,
        error: '기상청 API 키가 설정되지 않았습니다.'
      }, { status: 500 });
    }

    // 현재 시간 기준으로 발표 시간 계산
    const now = new Date();
    const baseDate = now.toISOString().slice(0, 10).replace(/-/g, '');

    // 발표 시간은 02, 05, 08, 11, 14, 17, 20, 23시
    const hours = [23, 20, 17, 14, 11, 8, 5, 2];
    let baseTime = '0200';

    for (const hour of hours) {
      if (now.getHours() >= hour) {
        baseTime = hour.toString().padStart(2, '0') + '00';
        break;
      }
    }

    // 기상청 API 테스트 호출 (강남구 격자 좌표)
    const apiUrl = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst';
    const params = new URLSearchParams({
      serviceKey: serviceKey,
      pageNo: '1',
      numOfRows: '10', // 테스트용으로 10개만
      dataType: 'JSON',
      base_date: baseDate,
      base_time: baseTime,
      nx: '61', // 강남구 격자 X
      ny: '125' // 강남구 격자 Y
    });

    console.log('기상청 API 테스트 요청:', `${apiUrl}?${params.toString()}`);

    const response = await fetch(`${apiUrl}?${params.toString()}`, {
      headers: {
        'User-Agent': 'Infra-Flow-AI/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`기상청 API 응답 오류: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.response?.header?.resultCode !== '00') {
      throw new Error(`기상청 API 오류: ${data.response?.header?.resultMsg || 'Unknown error'}`);
    }

    const items = data.response?.body?.items?.item || [];
    const totalCount = data.response?.body?.totalCount || 0;

    return NextResponse.json({
      success: true,
      message: '기상청 API 연결 성공',
      testData: {
        baseDate: baseDate,
        baseTime: baseTime,
        location: '강남구 (격자: 61, 125)',
        itemCount: items.length,
        totalCount: totalCount
      },
      sampleData: items.slice(0, 3).map((item: { category: string; fcstDate: string; fcstTime: string; fcstValue: string }) => ({
        category: item.category,
        fcstDate: item.fcstDate,
        fcstTime: item.fcstTime,
        fcstValue: item.fcstValue
      }))
    });

  } catch (error) {
    console.error('기상청 API 테스트 오류:', error);

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '기상청 API 연결 실패'
    }, { status: 500 });
  }
}