import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Placeholder for odds endpoint
    return NextResponse.json({
      success: true,
      message: 'Odds endpoint',
      odds: []
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch odds' },
      { status: 500 }
    );
  }
}
