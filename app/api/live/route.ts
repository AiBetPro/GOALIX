import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Placeholder for live matches endpoint
    return NextResponse.json({
      success: true,
      message: 'Live matches endpoint',
      matches: []
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch live matches' },
      { status: 500 }
    );
  }
}
