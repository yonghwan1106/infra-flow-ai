import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export async function POST() {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'Claude API 키가 설정되지 않았습니다.'
      }, { status: 500 });
    }

    const anthropic = new Anthropic({
      apiKey: apiKey,
    });

    // 간단한 테스트 요청
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 100,
      messages: [{
        role: 'user',
        content: '안녕하세요! 간단한 연결 테스트입니다. "연결 성공"이라고 답변해주세요.'
      }]
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    return NextResponse.json({
      success: true,
      message: 'Claude API 연결 성공',
      response: content.text,
      model: response.model,
      usage: response.usage
    });

  } catch (error) {
    console.error('Claude API 테스트 오류:', error);

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Claude API 연결 실패'
    }, { status: 500 });
  }
}