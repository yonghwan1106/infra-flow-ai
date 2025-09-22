import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const apiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: '카카오 지도 API 키가 설정되지 않았습니다.'
      }, { status: 500 });
    }

    // 카카오 지도 API 테스트 (좌표 -> 주소 변환 API 사용)
    const testUrl = `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=127.0276&y=37.4979`;

    const response = await fetch(testUrl, {
      headers: {
        'Authorization': `KakaoAK ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`카카오 API 오류: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.documents && data.documents.length > 0) {
      return NextResponse.json({
        success: true,
        message: '카카오 지도 API 연결 성공',
        testLocation: '강남역 2번 출구',
        address: data.documents[0].address?.address_name || '주소 정보 없음',
        roadAddress: data.documents[0].road_address?.address_name || '도로명 주소 없음'
      });
    } else {
      throw new Error('카카오 API 응답에 데이터가 없습니다.');
    }

  } catch (error) {
    console.error('카카오 지도 API 테스트 오류:', error);

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '카카오 지도 API 연결 실패'
    }, { status: 500 });
  }
}